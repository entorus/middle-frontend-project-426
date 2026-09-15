import { createHash, randomBytes } from 'node:crypto'

import type { FastifyReply, FastifyRequest } from 'fastify'
import type { Knex } from 'knex'

import { HttpError } from '../contract'
import type { components } from '../generated/api'

type User = components['schemas']['User']

const cookieName = 'psparts_session'
export const lifetime = 7 * 24 * 60 * 60
const digest = (token: string) => createHash('sha256').update(token).digest('hex')

export function sessionHash(request: FastifyRequest) {
  const value = request.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1)
  return value && /^[A-Za-z0-9_-]{43}$/.test(value) ? digest(value) : null
}

export function setCookie(reply: FastifyReply, value: string, maxAge: number) {
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

export async function createSession(tx: Knex, request: FastifyRequest, user: User) {
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
