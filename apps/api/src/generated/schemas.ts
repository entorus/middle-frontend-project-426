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
    unevaluatedProperties: {
      not: {},
    },
  },
  CreateOrder: {
    type: 'object',
    required: ['items', 'receiving'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'quantity'],
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
              minimum: 1,
            },
            quantity: {
              type: 'integer',
              format: 'int32',
              minimum: 1,
              maximum: 999,
            },
          },
          unevaluatedProperties: {
            not: {},
          },
        },
        minItems: 1,
        maxItems: 100,
      },
      receiving: {
        anyOf: [
          {
            type: 'object',
            required: ['name', 'phone', 'method', 'address'],
            properties: {
              name: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                pattern: '\\S',
              },
              phone: {
                type: 'string',
                minLength: 7,
                maxLength: 25,
                pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
              },
              method: {
                type: 'string',
                enum: ['delivery'],
              },
              address: {
                type: 'string',
                minLength: 1,
                maxLength: 500,
                pattern: '\\S',
              },
            },
            unevaluatedProperties: {
              not: {},
            },
          },
          {
            type: 'object',
            required: ['name', 'phone', 'method'],
            properties: {
              name: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                pattern: '\\S',
              },
              phone: {
                type: 'string',
                minLength: 7,
                maxLength: 25,
                pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
              },
              method: {
                type: 'string',
                enum: ['pickup'],
              },
            },
            unevaluatedProperties: {
              not: {},
            },
          },
        ],
      },
    },
    unevaluatedProperties: {
      not: {},
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
    unevaluatedProperties: {
      not: {},
    },
  },
  Delivery: {
    type: 'object',
    required: ['name', 'phone', 'method', 'address'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        pattern: '\\S',
      },
      phone: {
        type: 'string',
        minLength: 7,
        maxLength: 25,
        pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
      },
      method: {
        type: 'string',
        enum: ['delivery'],
      },
      address: {
        type: 'string',
        minLength: 1,
        maxLength: 500,
        pattern: '\\S',
      },
    },
    unevaluatedProperties: {
      not: {},
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
    unevaluatedProperties: {
      not: {},
    },
  },
  Money: {
    type: 'object',
    required: ['amount', 'currency'],
    properties: {
      amount: {
        type: 'integer',
        minimum: 0,
        maximum: 9007199254740991,
      },
      currency: {
        type: 'string',
        enum: ['RUB'],
      },
    },
    unevaluatedProperties: {
      not: {},
    },
    description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
    examples: [
      {
        amount: 1999000,
        currency: 'RUB',
      },
    ],
  },
  Order: {
    type: 'object',
    required: ['id', 'status', 'createdAt', 'receiving', 'items', 'total'],
    properties: {
      id: {
        type: 'integer',
        format: 'int32',
      },
      status: {
        type: 'string',
        enum: ['paid'],
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
      },
      receiving: {
        anyOf: [
          {
            type: 'object',
            required: ['name', 'phone', 'method', 'address'],
            properties: {
              name: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                pattern: '\\S',
              },
              phone: {
                type: 'string',
                minLength: 7,
                maxLength: 25,
                pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
              },
              method: {
                type: 'string',
                enum: ['delivery'],
              },
              address: {
                type: 'string',
                minLength: 1,
                maxLength: 500,
                pattern: '\\S',
              },
            },
            unevaluatedProperties: {
              not: {},
            },
          },
          {
            type: 'object',
            required: ['name', 'phone', 'method'],
            properties: {
              name: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                pattern: '\\S',
              },
              phone: {
                type: 'string',
                minLength: 7,
                maxLength: 25,
                pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
              },
              method: {
                type: 'string',
                enum: ['pickup'],
              },
            },
            unevaluatedProperties: {
              not: {},
            },
          },
        ],
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['productId', 'name', 'quantity', 'price', 'total'],
          properties: {
            productId: {
              type: 'integer',
              format: 'int32',
            },
            name: {
              type: 'string',
            },
            quantity: {
              type: 'integer',
              format: 'int32',
              minimum: 1,
            },
            price: {
              type: 'object',
              required: ['amount', 'currency'],
              properties: {
                amount: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 9007199254740991,
                },
                currency: {
                  type: 'string',
                  enum: ['RUB'],
                },
              },
              unevaluatedProperties: {
                not: {},
              },
              description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
              examples: [
                {
                  amount: 1999000,
                  currency: 'RUB',
                },
              ],
            },
            total: {
              type: 'object',
              required: ['amount', 'currency'],
              properties: {
                amount: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 9007199254740991,
                },
                currency: {
                  type: 'string',
                  enum: ['RUB'],
                },
              },
              unevaluatedProperties: {
                not: {},
              },
              description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
              examples: [
                {
                  amount: 1999000,
                  currency: 'RUB',
                },
              ],
            },
          },
          unevaluatedProperties: {
            not: {},
          },
        },
      },
      total: {
        type: 'object',
        required: ['amount', 'currency'],
        properties: {
          amount: {
            type: 'integer',
            minimum: 0,
            maximum: 9007199254740991,
          },
          currency: {
            type: 'string',
            enum: ['RUB'],
          },
        },
        unevaluatedProperties: {
          not: {},
        },
        description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
        examples: [
          {
            amount: 1999000,
            currency: 'RUB',
          },
        ],
      },
    },
    unevaluatedProperties: {
      not: {},
    },
  },
  OrderInputItem: {
    type: 'object',
    required: ['id', 'quantity'],
    properties: {
      id: {
        type: 'integer',
        format: 'int32',
        minimum: 1,
      },
      quantity: {
        type: 'integer',
        format: 'int32',
        minimum: 1,
        maximum: 999,
      },
    },
    unevaluatedProperties: {
      not: {},
    },
  },
  OrderItem: {
    type: 'object',
    required: ['productId', 'name', 'quantity', 'price', 'total'],
    properties: {
      productId: {
        type: 'integer',
        format: 'int32',
      },
      name: {
        type: 'string',
      },
      quantity: {
        type: 'integer',
        format: 'int32',
        minimum: 1,
      },
      price: {
        type: 'object',
        required: ['amount', 'currency'],
        properties: {
          amount: {
            type: 'integer',
            minimum: 0,
            maximum: 9007199254740991,
          },
          currency: {
            type: 'string',
            enum: ['RUB'],
          },
        },
        unevaluatedProperties: {
          not: {},
        },
        description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
        examples: [
          {
            amount: 1999000,
            currency: 'RUB',
          },
        ],
      },
      total: {
        type: 'object',
        required: ['amount', 'currency'],
        properties: {
          amount: {
            type: 'integer',
            minimum: 0,
            maximum: 9007199254740991,
          },
          currency: {
            type: 'string',
            enum: ['RUB'],
          },
        },
        unevaluatedProperties: {
          not: {},
        },
        description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
        examples: [
          {
            amount: 1999000,
            currency: 'RUB',
          },
        ],
      },
    },
    unevaluatedProperties: {
      not: {},
    },
  },
  OrderRejected: {
    type: 'object',
    required: ['products'],
    properties: {
      products: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'reason'],
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
            },
            reason: {
              type: 'string',
              enum: ['not_found', 'unavailable'],
            },
          },
          unevaluatedProperties: {
            not: {},
          },
        },
      },
    },
    unevaluatedProperties: {
      not: {},
    },
    allOf: [
      {
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
    ],
  },
  Pickup: {
    type: 'object',
    required: ['name', 'phone', 'method'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        pattern: '\\S',
      },
      phone: {
        type: 'string',
        minLength: 7,
        maxLength: 25,
        pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
      },
      method: {
        type: 'string',
        enum: ['pickup'],
      },
    },
    unevaluatedProperties: {
      not: {},
    },
  },
  ProblemProduct: {
    type: 'object',
    required: ['id', 'reason'],
    properties: {
      id: {
        type: 'integer',
        format: 'int32',
      },
      reason: {
        type: 'string',
        enum: ['not_found', 'unavailable'],
      },
    },
    unevaluatedProperties: {
      not: {},
    },
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
            minimum: 0,
            maximum: 9007199254740991,
          },
          currency: {
            type: 'string',
            enum: ['RUB'],
          },
        },
        unevaluatedProperties: {
          not: {},
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
    unevaluatedProperties: {
      not: {},
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
                  minimum: 0,
                  maximum: 9007199254740991,
                },
                currency: {
                  type: 'string',
                  enum: ['RUB'],
                },
              },
              unevaluatedProperties: {
                not: {},
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
          unevaluatedProperties: {
            not: {},
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
    unevaluatedProperties: {
      not: {},
    },
  },
  Promotion: {
    type: 'object',
    required: ['id', 'title', 'text', 'product'],
    properties: {
      id: {
        type: 'integer',
        format: 'int32',
      },
      title: {
        type: 'string',
        minLength: 1,
      },
      text: {
        type: 'string',
        minLength: 1,
      },
      product: {
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
                minimum: 0,
                maximum: 9007199254740991,
              },
              currency: {
                type: 'string',
                enum: ['RUB'],
              },
            },
            unevaluatedProperties: {
              not: {},
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
        unevaluatedProperties: {
          not: {},
        },
      },
    },
    unevaluatedProperties: {
      not: {},
    },
    description: 'Промо-блок главной. Товар уникален в подборке и доступен для покупки.',
  },
  Receiving: {
    anyOf: [
      {
        type: 'object',
        required: ['name', 'phone', 'method', 'address'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            pattern: '\\S',
          },
          phone: {
            type: 'string',
            minLength: 7,
            maxLength: 25,
            pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
          },
          method: {
            type: 'string',
            enum: ['delivery'],
          },
          address: {
            type: 'string',
            minLength: 1,
            maxLength: 500,
            pattern: '\\S',
          },
        },
        unevaluatedProperties: {
          not: {},
        },
      },
      {
        type: 'object',
        required: ['name', 'phone', 'method'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            pattern: '\\S',
          },
          phone: {
            type: 'string',
            minLength: 7,
            maxLength: 25,
            pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
          },
          method: {
            type: 'string',
            enum: ['pickup'],
          },
        },
        unevaluatedProperties: {
          not: {},
        },
      },
    ],
  },
  Recipient: {
    type: 'object',
    required: ['name', 'phone'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        pattern: '\\S',
      },
      phone: {
        type: 'string',
        minLength: 7,
        maxLength: 25,
        pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
      },
    },
    unevaluatedProperties: {
      not: {},
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
    unevaluatedProperties: {
      not: {},
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
        unevaluatedProperties: {
          not: {},
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
        unevaluatedProperties: {
          not: {},
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
      unevaluatedProperties: {
        not: {},
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
        unevaluatedProperties: {
          not: {},
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
        unevaluatedProperties: {
          not: {},
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
      unevaluatedProperties: {
        not: {},
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
          unevaluatedProperties: {
            not: {},
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
  createOrder: {
    response: {
      '201': {
        type: 'object',
        required: ['id', 'status', 'createdAt', 'receiving', 'items', 'total'],
        properties: {
          id: {
            type: 'integer',
            format: 'int32',
          },
          status: {
            type: 'string',
            enum: ['paid'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          receiving: {
            anyOf: [
              {
                type: 'object',
                required: ['name', 'phone', 'method', 'address'],
                properties: {
                  name: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 100,
                    pattern: '\\S',
                  },
                  phone: {
                    type: 'string',
                    minLength: 7,
                    maxLength: 25,
                    pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
                  },
                  method: {
                    type: 'string',
                    enum: ['delivery'],
                  },
                  address: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 500,
                    pattern: '\\S',
                  },
                },
                unevaluatedProperties: {
                  not: {},
                },
              },
              {
                type: 'object',
                required: ['name', 'phone', 'method'],
                properties: {
                  name: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 100,
                    pattern: '\\S',
                  },
                  phone: {
                    type: 'string',
                    minLength: 7,
                    maxLength: 25,
                    pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
                  },
                  method: {
                    type: 'string',
                    enum: ['pickup'],
                  },
                },
                unevaluatedProperties: {
                  not: {},
                },
              },
            ],
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['productId', 'name', 'quantity', 'price', 'total'],
              properties: {
                productId: {
                  type: 'integer',
                  format: 'int32',
                },
                name: {
                  type: 'string',
                },
                quantity: {
                  type: 'integer',
                  format: 'int32',
                  minimum: 1,
                },
                price: {
                  type: 'object',
                  required: ['amount', 'currency'],
                  properties: {
                    amount: {
                      type: 'integer',
                      minimum: 0,
                      maximum: 9007199254740991,
                    },
                    currency: {
                      type: 'string',
                      enum: ['RUB'],
                    },
                  },
                  unevaluatedProperties: {
                    not: {},
                  },
                  description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
                  examples: [
                    {
                      amount: 1999000,
                      currency: 'RUB',
                    },
                  ],
                },
                total: {
                  type: 'object',
                  required: ['amount', 'currency'],
                  properties: {
                    amount: {
                      type: 'integer',
                      minimum: 0,
                      maximum: 9007199254740991,
                    },
                    currency: {
                      type: 'string',
                      enum: ['RUB'],
                    },
                  },
                  unevaluatedProperties: {
                    not: {},
                  },
                  description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
                  examples: [
                    {
                      amount: 1999000,
                      currency: 'RUB',
                    },
                  ],
                },
              },
              unevaluatedProperties: {
                not: {},
              },
            },
          },
          total: {
            type: 'object',
            required: ['amount', 'currency'],
            properties: {
              amount: {
                type: 'integer',
                minimum: 0,
                maximum: 9007199254740991,
              },
              currency: {
                type: 'string',
                enum: ['RUB'],
              },
            },
            unevaluatedProperties: {
              not: {},
            },
            description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
            examples: [
              {
                amount: 1999000,
                currency: 'RUB',
              },
            ],
          },
        },
        unevaluatedProperties: {
          not: {},
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
      '409': {
        type: 'object',
        required: ['products'],
        properties: {
          products: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'reason'],
              properties: {
                id: {
                  type: 'integer',
                  format: 'int32',
                },
                reason: {
                  type: 'string',
                  enum: ['not_found', 'unavailable'],
                },
              },
              unevaluatedProperties: {
                not: {},
              },
            },
          },
        },
        unevaluatedProperties: {
          not: {},
        },
        allOf: [
          {
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
      required: ['items', 'receiving'],
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'quantity'],
            properties: {
              id: {
                type: 'integer',
                format: 'int32',
                minimum: 1,
              },
              quantity: {
                type: 'integer',
                format: 'int32',
                minimum: 1,
                maximum: 999,
              },
            },
            unevaluatedProperties: {
              not: {},
            },
          },
          minItems: 1,
          maxItems: 100,
        },
        receiving: {
          anyOf: [
            {
              type: 'object',
              required: ['name', 'phone', 'method', 'address'],
              properties: {
                name: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 100,
                  pattern: '\\S',
                },
                phone: {
                  type: 'string',
                  minLength: 7,
                  maxLength: 25,
                  pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
                },
                method: {
                  type: 'string',
                  enum: ['delivery'],
                },
                address: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 500,
                  pattern: '\\S',
                },
              },
              unevaluatedProperties: {
                not: {},
              },
            },
            {
              type: 'object',
              required: ['name', 'phone', 'method'],
              properties: {
                name: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 100,
                  pattern: '\\S',
                },
                phone: {
                  type: 'string',
                  minLength: 7,
                  maxLength: 25,
                  pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
                },
                method: {
                  type: 'string',
                  enum: ['pickup'],
                },
              },
              unevaluatedProperties: {
                not: {},
              },
            },
          ],
        },
      },
      unevaluatedProperties: {
        not: {},
      },
    },
  },
  listOrders: {
    response: {
      '200': {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'status', 'createdAt', 'receiving', 'items', 'total'],
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
            },
            status: {
              type: 'string',
              enum: ['paid'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            receiving: {
              anyOf: [
                {
                  type: 'object',
                  required: ['name', 'phone', 'method', 'address'],
                  properties: {
                    name: {
                      type: 'string',
                      minLength: 1,
                      maxLength: 100,
                      pattern: '\\S',
                    },
                    phone: {
                      type: 'string',
                      minLength: 7,
                      maxLength: 25,
                      pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
                    },
                    method: {
                      type: 'string',
                      enum: ['delivery'],
                    },
                    address: {
                      type: 'string',
                      minLength: 1,
                      maxLength: 500,
                      pattern: '\\S',
                    },
                  },
                  unevaluatedProperties: {
                    not: {},
                  },
                },
                {
                  type: 'object',
                  required: ['name', 'phone', 'method'],
                  properties: {
                    name: {
                      type: 'string',
                      minLength: 1,
                      maxLength: 100,
                      pattern: '\\S',
                    },
                    phone: {
                      type: 'string',
                      minLength: 7,
                      maxLength: 25,
                      pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
                    },
                    method: {
                      type: 'string',
                      enum: ['pickup'],
                    },
                  },
                  unevaluatedProperties: {
                    not: {},
                  },
                },
              ],
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['productId', 'name', 'quantity', 'price', 'total'],
                properties: {
                  productId: {
                    type: 'integer',
                    format: 'int32',
                  },
                  name: {
                    type: 'string',
                  },
                  quantity: {
                    type: 'integer',
                    format: 'int32',
                    minimum: 1,
                  },
                  price: {
                    type: 'object',
                    required: ['amount', 'currency'],
                    properties: {
                      amount: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 9007199254740991,
                      },
                      currency: {
                        type: 'string',
                        enum: ['RUB'],
                      },
                    },
                    unevaluatedProperties: {
                      not: {},
                    },
                    description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
                    examples: [
                      {
                        amount: 1999000,
                        currency: 'RUB',
                      },
                    ],
                  },
                  total: {
                    type: 'object',
                    required: ['amount', 'currency'],
                    properties: {
                      amount: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 9007199254740991,
                      },
                      currency: {
                        type: 'string',
                        enum: ['RUB'],
                      },
                    },
                    unevaluatedProperties: {
                      not: {},
                    },
                    description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
                    examples: [
                      {
                        amount: 1999000,
                        currency: 'RUB',
                      },
                    ],
                  },
                },
                unevaluatedProperties: {
                  not: {},
                },
              },
            },
            total: {
              type: 'object',
              required: ['amount', 'currency'],
              properties: {
                amount: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 9007199254740991,
                },
                currency: {
                  type: 'string',
                  enum: ['RUB'],
                },
              },
              unevaluatedProperties: {
                not: {},
              },
              description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
              examples: [
                {
                  amount: 1999000,
                  currency: 'RUB',
                },
              ],
            },
          },
          unevaluatedProperties: {
            not: {},
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
  getOrder: {
    response: {
      '200': {
        type: 'object',
        required: ['id', 'status', 'createdAt', 'receiving', 'items', 'total'],
        properties: {
          id: {
            type: 'integer',
            format: 'int32',
          },
          status: {
            type: 'string',
            enum: ['paid'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          receiving: {
            anyOf: [
              {
                type: 'object',
                required: ['name', 'phone', 'method', 'address'],
                properties: {
                  name: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 100,
                    pattern: '\\S',
                  },
                  phone: {
                    type: 'string',
                    minLength: 7,
                    maxLength: 25,
                    pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
                  },
                  method: {
                    type: 'string',
                    enum: ['delivery'],
                  },
                  address: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 500,
                    pattern: '\\S',
                  },
                },
                unevaluatedProperties: {
                  not: {},
                },
              },
              {
                type: 'object',
                required: ['name', 'phone', 'method'],
                properties: {
                  name: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 100,
                    pattern: '\\S',
                  },
                  phone: {
                    type: 'string',
                    minLength: 7,
                    maxLength: 25,
                    pattern: '^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9 ()-]{7,25}$',
                  },
                  method: {
                    type: 'string',
                    enum: ['pickup'],
                  },
                },
                unevaluatedProperties: {
                  not: {},
                },
              },
            ],
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['productId', 'name', 'quantity', 'price', 'total'],
              properties: {
                productId: {
                  type: 'integer',
                  format: 'int32',
                },
                name: {
                  type: 'string',
                },
                quantity: {
                  type: 'integer',
                  format: 'int32',
                  minimum: 1,
                },
                price: {
                  type: 'object',
                  required: ['amount', 'currency'],
                  properties: {
                    amount: {
                      type: 'integer',
                      minimum: 0,
                      maximum: 9007199254740991,
                    },
                    currency: {
                      type: 'string',
                      enum: ['RUB'],
                    },
                  },
                  unevaluatedProperties: {
                    not: {},
                  },
                  description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
                  examples: [
                    {
                      amount: 1999000,
                      currency: 'RUB',
                    },
                  ],
                },
                total: {
                  type: 'object',
                  required: ['amount', 'currency'],
                  properties: {
                    amount: {
                      type: 'integer',
                      minimum: 0,
                      maximum: 9007199254740991,
                    },
                    currency: {
                      type: 'string',
                      enum: ['RUB'],
                    },
                  },
                  unevaluatedProperties: {
                    not: {},
                  },
                  description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
                  examples: [
                    {
                      amount: 1999000,
                      currency: 'RUB',
                    },
                  ],
                },
              },
              unevaluatedProperties: {
                not: {},
              },
            },
          },
          total: {
            type: 'object',
            required: ['amount', 'currency'],
            properties: {
              amount: {
                type: 'integer',
                minimum: 0,
                maximum: 9007199254740991,
              },
              currency: {
                type: 'string',
                enum: ['RUB'],
              },
            },
            unevaluatedProperties: {
              not: {},
            },
            description: 'Денежная сумма: amount — целое число копеек, currency — RUB.',
            examples: [
              {
                amount: 1999000,
                currency: 'RUB',
              },
            ],
          },
        },
        unevaluatedProperties: {
          not: {},
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
                      minimum: 0,
                      maximum: 9007199254740991,
                    },
                    currency: {
                      type: 'string',
                      enum: ['RUB'],
                    },
                  },
                  unevaluatedProperties: {
                    not: {},
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
              unevaluatedProperties: {
                not: {},
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
        unevaluatedProperties: {
          not: {},
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
                minimum: 0,
                maximum: 9007199254740991,
              },
              currency: {
                type: 'string',
                enum: ['RUB'],
              },
            },
            unevaluatedProperties: {
              not: {},
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
        unevaluatedProperties: {
          not: {},
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
  listPromotions: {
    response: {
      '200': {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'title', 'text', 'product'],
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
            },
            title: {
              type: 'string',
              minLength: 1,
            },
            text: {
              type: 'string',
              minLength: 1,
            },
            product: {
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
                      minimum: 0,
                      maximum: 9007199254740991,
                    },
                    currency: {
                      type: 'string',
                      enum: ['RUB'],
                    },
                  },
                  unevaluatedProperties: {
                    not: {},
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
              unevaluatedProperties: {
                not: {},
              },
            },
          },
          unevaluatedProperties: {
            not: {},
          },
          description: 'Промо-блок главной. Товар уникален в подборке и доступен для покупки.',
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
        unevaluatedProperties: {
          not: {},
        },
      },
    },
  },
} as const
