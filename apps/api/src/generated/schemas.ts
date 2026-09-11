// GENERATED from main.tsp → openapi/openapi.yaml. Run npm run contract:generate. DO NOT EDIT.
export const modelSchemas = {
  ApiError: {
    type: 'object',
    required: ['statusCode', 'error', 'message'],
    properties: {
      statusCode: {
        type: 'integer',
        format: 'int32',
        minimum: 400,
        maximum: 599,
      },
      error: {
        type: 'string',
      },
      message: {
        type: 'string',
      },
    },
    description: 'Единый JSON-формат ошибок API. statusCode совпадает с HTTP-статусом.',
    examples: [
      {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Некорректный запрос',
      },
    ],
  },
  Category: {
    type: 'object',
    required: ['id', 'slug', 'name'],
    properties: {
      id: {
        type: 'integer',
        format: 'int32',
      },
      slug: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
    },
  },
  Health: {
    type: 'object',
    required: ['health'],
    properties: {
      health: {
        type: 'string',
        enum: ['check'],
      },
    },
  },
  Money: {
    type: 'object',
    required: ['amount', 'currency'],
    properties: {
      amount: {
        type: 'integer',
        format: 'int32',
        minimum: 0,
      },
      currency: {
        type: 'string',
        enum: ['RUB'],
      },
    },
    description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
    examples: [
      {
        amount: 1999000,
        currency: 'RUB',
      },
    ],
  },
  Product: {
    type: 'object',
    required: ['id', 'sku', 'name', 'description', 'price', 'category_slug', 'category_name'],
    properties: {
      id: {
        type: 'integer',
        format: 'int32',
      },
      sku: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      price: {
        type: 'object',
        required: ['amount', 'currency'],
        properties: {
          amount: {
            type: 'integer',
            format: 'int32',
            minimum: 0,
          },
          currency: {
            type: 'string',
            enum: ['RUB'],
          },
        },
        description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
        examples: [
          {
            amount: 1999000,
            currency: 'RUB',
          },
        ],
      },
      category_slug: {
        type: 'string',
      },
      category_name: {
        type: 'string',
      },
    },
  },
} as const
export const routeSchemas = {
  listCategories: {
    response: {
      '200': {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'slug', 'name'],
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
            },
            slug: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
      '500': {
        type: 'object',
        required: ['statusCode', 'error', 'message'],
        properties: {
          statusCode: {
            type: 'integer',
            format: 'int32',
            minimum: 400,
            maximum: 599,
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
        description: 'Единый JSON-формат ошибок API. statusCode совпадает с HTTP-статусом.',
        examples: [
          {
            statusCode: 400,
            error: 'Bad Request',
            message: 'Некорректный запрос',
          },
        ],
      },
    },
  },
  listProducts: {
    response: {
      '200': {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'sku', 'name', 'description', 'price', 'category_slug', 'category_name'],
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
            },
            sku: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            price: {
              type: 'object',
              required: ['amount', 'currency'],
              properties: {
                amount: {
                  type: 'integer',
                  format: 'int32',
                  minimum: 0,
                },
                currency: {
                  type: 'string',
                  enum: ['RUB'],
                },
              },
              description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
              examples: [
                {
                  amount: 1999000,
                  currency: 'RUB',
                },
              ],
            },
            category_slug: {
              type: 'string',
            },
            category_name: {
              type: 'string',
            },
          },
        },
      },
      '400': {
        type: 'object',
        required: ['statusCode', 'error', 'message'],
        properties: {
          statusCode: {
            type: 'integer',
            format: 'int32',
            minimum: 400,
            maximum: 599,
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
        description: 'Единый JSON-формат ошибок API. statusCode совпадает с HTTP-статусом.',
        examples: [
          {
            statusCode: 400,
            error: 'Bad Request',
            message: 'Некорректный запрос',
          },
        ],
      },
      '404': {
        type: 'object',
        required: ['statusCode', 'error', 'message'],
        properties: {
          statusCode: {
            type: 'integer',
            format: 'int32',
            minimum: 400,
            maximum: 599,
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
        description: 'Единый JSON-формат ошибок API. statusCode совпадает с HTTP-статусом.',
        examples: [
          {
            statusCode: 400,
            error: 'Bad Request',
            message: 'Некорректный запрос',
          },
        ],
      },
      '500': {
        type: 'object',
        required: ['statusCode', 'error', 'message'],
        properties: {
          statusCode: {
            type: 'integer',
            format: 'int32',
            minimum: 400,
            maximum: 599,
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
        description: 'Единый JSON-формат ошибок API. statusCode совпадает с HTTP-статусом.',
        examples: [
          {
            statusCode: 400,
            error: 'Bad Request',
            message: 'Некорректный запрос',
          },
        ],
      },
    },
    querystring: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
          minLength: 1,
          maxLength: 100,
        },
      },
      required: [],
    },
  },
  healthCheck: {
    response: {
      '200': {
        type: 'object',
        required: ['health'],
        properties: {
          health: {
            type: 'string',
            enum: ['check'],
          },
        },
      },
    },
  },
} as const
