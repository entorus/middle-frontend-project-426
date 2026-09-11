import { STATUS_CODES } from 'node:http'

import Ajv2020 from 'ajv/dist/2020'
import type { FastifyInstance } from 'fastify'

import { modelSchemas } from './generated/schemas'

export function configureContract(app: FastifyInstance) {
  // Responses must not coerce or silently remove invalid data.
  const ajv = new Ajv2020({ strict: false, allErrors: true })
  ajv.addFormat('int32', {
    type: 'number',
    validate: (value: number) =>
      Number.isInteger(value) && value >= -2147483648 && value <= 2147483647,
  })
  const validateError = ajv.compile(modelSchemas.ApiError)
  app.setValidatorCompiler(({ schema }) => ajv.compile(schema))
  app.setSerializerCompiler(({ schema }) => {
    const validate = ajv.compile(schema)
    return (data) => {
      if (!validate(data)) throw new Error('Ответ API не соответствует контракту')
      return JSON.stringify(data)
    }
  })
  app.setErrorHandler((error, request, reply) => {
    const candidate =
      error instanceof Error && 'statusCode' in error && typeof error.statusCode === 'number'
        ? error.statusCode
        : 500
    const statusCode = candidate >= 400 && candidate <= 599 ? candidate : 500
    if (statusCode >= 500) request.log.error(error)
    const body = {
      statusCode,
      error: STATUS_CODES[statusCode] ?? 'Error',
      message: statusCode >= 500 ? 'Внутренняя ошибка сервера' : 'Некорректный запрос',
    }
    if (!validateError(body)) throw new Error('Некорректный формат ошибки API')
    reply.code(statusCode).send(body)
  })
}
