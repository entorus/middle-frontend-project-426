// GENERATED from main.tsp → openapi/openapi.yaml. Run npm run contract:generate. DO NOT EDIT.
export interface paths {
  '/api/categories': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** @description Список категорий, отсортированный по id. */
    get: operations['listCategories']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/products': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** @description Каталог товаров с названиями категорий, отсортированный по id. */
    get: operations['listProducts']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/health-check': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** @description Проверка доступности сервера. */
    get: operations['healthCheck']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: {
    /**
     * @description Единый JSON-формат ошибок API. statusCode совпадает с HTTP-статусом.
     * @example {
     *       "statusCode": 400,
     *       "error": "Bad Request",
     *       "message": "Некорректный запрос"
     *     }
     */
    ApiError: {
      /** Format: int32 */
      statusCode: number
      error: string
      message: string
    }
    Category: {
      /** Format: int32 */
      id: number
      slug: string
      name: string
    }
    Health: {
      /** @enum {string} */
      health: 'check'
    }
    /**
     * @description Денежная сумма: amount — целое число копеек, currency — RUB.
     * @example {
     *       "amount": 1999000,
     *       "currency": "RUB"
     *     }
     */
    Money: {
      /** Format: int32 */
      amount: number
      /** @enum {string} */
      currency: 'RUB'
    }
    Product: {
      /** Format: int32 */
      id: number
      sku: string
      name: string
      description: string
      price: components['schemas']['Money']
      category_slug: string
      category_name: string
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  listCategories: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['Category'][]
        }
      }
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ApiError']
        }
      }
    }
  }
  listProducts: {
    parameters: {
      query?: {
        /** @description Необязательный фильтр по slug категории. */
        category?: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['Product'][]
        }
      }
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ApiError']
        }
      }
      /** @description The server cannot find the requested resource. */
      404: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ApiError']
        }
      }
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ApiError']
        }
      }
    }
  }
  healthCheck: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['Health']
        }
      }
    }
  }
}
