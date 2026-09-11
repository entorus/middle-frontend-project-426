import { mkdir, writeFile } from 'node:fs/promises'

import SwaggerParser from '@apidevtools/swagger-parser'
import openapiTS, { astToString } from 'openapi-typescript'
import { format, resolveConfig } from 'prettier'

const root = new URL('../', import.meta.url)
const specUrl = new URL('openapi/openapi.yaml', root)
const parser = new SwaggerParser()
const spec = await parser.validate(specUrl.pathname)
if (spec.openapi !== '3.1.0')
  throw new Error('Генератор ожидает OpenAPI 3.1.0 / JSON Schema 2020-12')
if (!Object.keys(spec.paths ?? {}).length || !Object.keys(spec.components?.schemas ?? {}).length) {
  throw new Error('Пустой контракт: объявите сервис, операции и модели в main.tsp')
}

// All references are resolved from the validated document, never copied by hand.
const document = await parser.dereference(specUrl.pathname, { dereference: { circular: false } })
const routeSchemas = {}
const methods = new Set(['get', 'post', 'put', 'patch', 'delete', 'options', 'head'])
for (const [path, item] of Object.entries(document.paths)) {
  for (const [method, operation] of Object.entries(item)) {
    if (!methods.has(method)) continue
    const { operationId } = operation
    if (!operationId || routeSchemas[operationId])
      throw new Error(`Отсутствует или повторяется operationId: ${method} ${path}`)
    const schema = { response: {} }
    for (const parameter of [...(item.parameters ?? []), ...(operation.parameters ?? [])]) {
      const target = { query: 'querystring', path: 'params', header: 'headers' }[parameter.in]
      if (!target || !parameter.schema)
        throw new Error(`Неподдерживаемый параметр в ${operationId}`)
      schema[target] ??= { type: 'object', properties: {}, required: [] }
      schema[target].properties[parameter.name] = parameter.schema
      if (parameter.required) schema[target].required.push(parameter.name)
    }
    if (operation.requestBody) {
      const body = operation.requestBody.content?.['application/json']?.schema
      if (!body) throw new Error(`Ожидается JSON body в ${operationId}`)
      schema.body = body
    }
    for (const [status, response] of Object.entries(operation.responses)) {
      const body = response.content?.['application/json']?.schema
      if (body) schema.response[status] = body
      else if (response.content) throw new Error(`Ожидается JSON response в ${operationId}`)
    }
    routeSchemas[operationId] = schema
  }
}

const banner =
  '// GENERATED from main.tsp → openapi/openapi.yaml. Run npm run contract:generate. DO NOT EDIT.\n'
const options = await resolveConfig(new URL('package.json', root).pathname)
async function emit(path, source) {
  const url = new URL(path, root)
  await mkdir(new URL('./', url), { recursive: true })
  await writeFile(url, await format(banner + source, { ...options, parser: 'typescript' }))
}

const types = astToString(await openapiTS(specUrl))
await emit('apps/front/src/generated/api.d.ts', types)
await emit('apps/api/src/generated/api.d.ts', types)
await emit(
  'apps/api/src/generated/schemas.ts',
  `export const modelSchemas = ${JSON.stringify(document.components.schemas, null, 2)} as const\nexport const routeSchemas = ${JSON.stringify(routeSchemas, null, 2)} as const\n`,
)
process.stdout.write(
  `Generated ${Object.keys(routeSchemas).length} operations and ${Object.keys(document.components.schemas).length} models\n`,
)
