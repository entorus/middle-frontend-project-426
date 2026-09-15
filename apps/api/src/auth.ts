import { createHash, randomBytes } from 'node:crypto'

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { Knex } from 'knex'

import { HttpError } from './contract'
import { hashPassword, verifyPassword } from './password'
import { routeSchemas } from './generated/schemas'
import type { components } from './generated/api'

type Credentials = components['schemas']['Credentials']
type User = components['schemas']['User']
const cookieName = 'psparts_session'
const lifetime = 7 * 24 * 60 * 60
const digest = (token: string) => createHash('sha256').update(token).digest('hex')

function sessionHash(request: FastifyRequest) {
  const value = request.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1)
  return value && /^[A-Za-z0-9_-]{43}$/.test(value) ? digest(value) : null
}

function setCookie(reply: FastifyReply, value: string, maxAge: number) {
  const secure =
    process.env.COOKIE_SECURE !== undefined
      ? process.env.COOKIE_SECURE === 'true'
      : reply.request.protocol === 'https' ||
        process.env.APP_ORIGIN?.startsWith('https://') === true ||
        reply.request.headers['x-forwarded-proto'] === 'https'
  reply.header(
    'set-cookie',
    `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`,
  )
}

export function validateOrigin(request: FastifyRequest) {
  if (request.method !== 'POST') return
  const origin = request.headers.origin
  // Origin is supplied by browsers; API clients without it are also supported.
  if (request.headers['sec-fetch-site'] === 'cross-site')
    throw new HttpError(400, 'Недопустимый источник запроса')
  if (origin) {
    let valid = false
    try {
      const parsed = new URL(origin)
      valid = process.env.APP_ORIGIN
        ? origin === process.env.APP_ORIGIN
        : parsed.host === request.headers.host && ['http:', 'https:'].includes(parsed.protocol)
    } catch {
      /* Invalid Origin is rejected below. */
    }
    if (!valid) throw new HttpError(400, 'Недопустимый источник запроса')
  }
}

export async function requireUser(db: Knex, request: FastifyRequest): Promise<User> {
  const hash = sessionHash(request)
  const user = hash
    ? await db('sessions')
        .join('users', 'users.id', 'sessions.user_id')
        .where('token_hash', hash)
        .where('expires_at', '>', new Date())
        .select('users.id', 'users.email')
        .first<User>()
    : undefined
  if (!user) throw new HttpError(401, 'Необходимо войти в аккаунт')
  return user
}

export function registerAuth(app: FastifyInstance, db: Knex) {
  // Equal-cost password check even when the account does not exist.
  const dummyHash = hashPassword(randomBytes(32).toString('hex'))
  async function createSession(tx: Knex, request: FastifyRequest, user: User) {
    const previous = sessionHash(request)
    if (previous) await tx('sessions').where('token_hash', previous).delete()
    await tx('sessions').where('expires_at', '<=', new Date()).delete()
    const token = randomBytes(32).toString('base64url')
    await tx('sessions').insert({
      token_hash: digest(token),
      user_id: user.id,
      expires_at: new Date(Date.now() + lifetime * 1000),
    })
    return token
  }

  app.register(async (auth) => {
    auth.addHook('onRequest', async (request, reply) => {
      reply.header('cache-control', 'no-store')
      validateOrigin(request)
    })

    auth.post<{ Body: Credentials }>(
      '/api/auth/signup',
      { schema: routeSchemas.signup },
      async (request, reply) => {
        const email = request.body.email.toLowerCase()
        const passwordHash = await hashPassword(request.body.password)
        try {
          const { user, token } = await db.transaction(async (tx) => {
            const [user] = await tx('users')
              .insert({ email, password_hash: passwordHash })
              .returning<User[]>(['id', 'email'])
            return { user, token: await createSession(tx, request, user) }
          })
          setCookie(reply, token, lifetime)
          return user
        } catch (error) {
          if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === '23505' &&
            'constraint' in error &&
            error.constraint === 'users_email_unique'
          )
            throw new HttpError(409, 'Этот email уже зарегистрирован')
          throw error
        }
      },
    )

    auth.post<{ Body: Credentials }>(
      '/api/auth/signin',
      { schema: routeSchemas.signin },
      async (request, reply) => {
        const row = await db('users')
          .where('email', request.body.email.toLowerCase())
          .first<User & { password_hash: string }>()
        const valid = await verifyPassword(
          request.body.password,
          row?.password_hash ?? (await dummyHash),
        )
        if (!row || !valid) throw new HttpError(401, 'Неверный email или пароль')
        const user: User = { id: row.id, email: row.email }
        const token = await db.transaction((tx) => createSession(tx, request, user))
        setCookie(reply, token, lifetime)
        return user
      },
    )

    auth.post('/api/auth/signout', { schema: routeSchemas.signout }, async (request, reply) => {
      const hash = sessionHash(request)
      if (hash) await db('sessions').where('token_hash', hash).delete()
      setCookie(reply, '', 0)
      return { success: true }
    })

    auth.get('/api/auth/me', { schema: routeSchemas.currentUser }, async (request) => {
      return requireUser(db, request)
    })
  })
}
