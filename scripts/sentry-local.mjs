// Test-only envelope receiver. Never deploy this service publicly.
import { createServer } from 'node:http'
import { gunzipSync } from 'node:zlib'

const events = []
const server = createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Sentry-Auth')
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  response.setHeader('Content-Type', 'application/json')
  if (request.method === 'OPTIONS') {
    response.writeHead(204).end()
    return
  }
  if (request.method === 'GET' && request.url === '/events') {
    response.end(JSON.stringify(events))
    return
  }
  if (request.method !== 'POST' || !/^\/api\/[12]\/envelope\//.test(request.url ?? '')) {
    response.writeHead(404).end('{}')
    return
  }
  try {
    const chunks = []
    let size = 0
    for await (const chunk of request) {
      size += chunk.length
      if (size > 1000000) {
        response.writeHead(413).end('{}')
        return
      }
      chunks.push(chunk)
    }
    const body = Buffer.concat(chunks)
    const text = (
      request.headers['content-encoding'] === 'gzip' ? gunzipSync(body) : body
    ).toString()
    for (const line of text.split('\n')) {
      try {
        const event = JSON.parse(line)
        const message = event.exception?.values?.[0]?.value
        if (message) events.push({ project: request.url.split('/')[2], message })
      } catch {
        /* Ignore non-JSON attachment lines. */
      }
    }
    response.end('{}')
  } catch {
    response.writeHead(400).end('{}')
  }
})
server.listen(4318, '0.0.0.0')
