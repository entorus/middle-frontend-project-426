import { randomBytes } from 'node:crypto'

import type { FastifyInstance } from 'fastify'
import type { Knex } from 'knex'

import { HttpError } from './contract'
import { hashPassword, verifyPassword } from './password'
import { routeSchemas } from './generated/schemas'
import type { components } from './generated/api'
import { createSession, lifetime, requireUser, sessionHash, setCookie } from './auth/session'
import { validateOrigin } from './auth/validateOrigin'

type Credentials = components['schemas']['Credentials']
type User = components['schemas']['User']

export { requireUser, validateOrigin }

export function registerAuth(app: FastifyInstance, db: Knex) {
  // Equal-cost password check even when the account does not exist.
  const dummyHash = hashPassword(randomBytes(32).toString('hex'))
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
