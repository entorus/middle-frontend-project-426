import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT ?? 'development',
  enabled: Boolean(process.env.SENTRY_DSN),
  sendDefaultPii: false,
  beforeSend(event) {
    if (!event.request) return event
    // Never send credentials or session cookies to monitoring.
    const { data: _data, cookies: _cookies, headers: _headers, ...request } = event.request
    return { ...event, request }
  },
})
