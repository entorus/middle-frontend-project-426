import type { FastifyRequest } from 'fastify'

import { HttpError } from '../contract'

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
