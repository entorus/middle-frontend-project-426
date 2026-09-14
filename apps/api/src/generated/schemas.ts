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
  Credentials: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        minLength: 3,
        maxLength: 254,
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 128,
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
    required: [
      'id',
      'sku',
      'name',
      'description',
      'price',
      'category_slug',
      'category_name',
      'image_url',
      'available',
    ],
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
      image_url: {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
      },
      available: {
        type: 'boolean',
      },
    },
  },
  ProductPage: {
    type: 'object',
    required: ['items', 'total', 'page', 'pageSize', 'totalPages'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: [
            'id',
            'sku',
            'name',
            'description',
            'price',
            'category_slug',
            'category_name',
            'image_url',
            'available',
          ],
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
            image_url: {
              anyOf: [
                {
                  type: 'string',
                },
                {
                  type: 'null',
                },
              ],
            },
            available: {
              type: 'boolean',
            },
          },
        },
      },
      total: {
        type: 'integer',
        format: 'int32',
        minimum: 0,
      },
      page: {
        type: 'integer',
        format: 'int32',
        minimum: 1,
      },
      pageSize: {
        type: 'integer',
        format: 'int32',
        minimum: 1,
      },
      totalPages: {
        type: 'integer',
        format: 'int32',
        minimum: 0,
      },
    },
  },
  User: {
    type: 'object',
    required: ['id', 'email'],
    properties: {
      id: {
        type: 'integer',
        format: 'int32',
      },
      email: {
        type: 'string',
      },
    },
  },
} as const
export const routeSchemas = {
  currentUser: {
    response: {
      '200': {
        type: 'object',
        required: ['id', 'email'],
        properties: {
          id: {
            type: 'integer',
            format: 'int32',
          },
          email: {
            type: 'string',
          },
        },
      },
      '401': {
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
  },
  signin: {
    response: {
      '200': {
        type: 'object',
        required: ['id', 'email'],
        properties: {
          id: {
            type: 'integer',
            format: 'int32',
          },
          email: {
            type: 'string',
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
      '401': {
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
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          minLength: 3,
          maxLength: 254,
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
        password: {
          type: 'string',
          minLength: 8,
          maxLength: 128,
        },
      },
    },
  },
  signout: {
    response: {
      '200': {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            enum: [true],
          },
        },
        required: ['success'],
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
  signup: {
    response: {
      '200': {
        type: 'object',
        required: ['id', 'email'],
        properties: {
          id: {
            type: 'integer',
            format: 'int32',
          },
          email: {
            type: 'string',
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
      '409': {
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
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          minLength: 3,
          maxLength: 254,
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
        password: {
          type: 'string',
          minLength: 8,
          maxLength: 128,
        },
      },
    },
  },
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
        type: 'object',
        required: ['items', 'total', 'page', 'pageSize', 'totalPages'],
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: [
                'id',
                'sku',
                'name',
                'description',
                'price',
                'category_slug',
                'category_name',
                'image_url',
                'available',
              ],
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
                image_url: {
                  anyOf: [
                    {
                      type: 'string',
                    },
                    {
                      type: 'null',
                    },
                  ],
                },
                available: {
                  type: 'boolean',
                },
              },
            },
          },
          total: {
            type: 'integer',
            format: 'int32',
            minimum: 0,
          },
          page: {
            type: 'integer',
            format: 'int32',
            minimum: 1,
          },
          pageSize: {
            type: 'integer',
            format: 'int32',
            minimum: 1,
          },
          totalPages: {
            type: 'integer',
            format: 'int32',
            minimum: 0,
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
        priceMin: {
          type: 'integer',
          format: 'int32',
          minimum: 0,
          maximum: 21474836,
        },
        priceMax: {
          type: 'integer',
          format: 'int32',
          minimum: 0,
          maximum: 21474836,
        },
        available: {
          type: 'boolean',
        },
        search: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
        page: {
          type: 'integer',
          format: 'int32',
          minimum: 1,
          maximum: 100000,
          default: 1,
        },
        pageSize: {
          type: 'integer',
          format: 'int32',
          minimum: 1,
          maximum: 48,
          default: 12,
        },
      },
      required: [],
    },
  },
  getProduct: {
    response: {
      '200': {
        type: 'object',
        required: [
          'id',
          'sku',
          'name',
          'description',
          'price',
          'category_slug',
          'category_name',
          'image_url',
          'available',
        ],
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
          image_url: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'null',
              },
            ],
          },
          available: {
            type: 'boolean',
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
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          format: 'int32',
          minimum: 1,
        },
      },
      required: ['id'],
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
