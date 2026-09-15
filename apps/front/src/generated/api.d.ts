// GENERATED from main.tsp → openapi/openapi.yaml. Run npm run contract:generate. DO NOT EDIT.
export interface paths {
  '/api/auth/me': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get: operations['currentUser']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/auth/signin': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post: operations['signin']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/auth/signout': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post: operations['signout']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/auth/signup': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post: operations['signup']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
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
  '/api/health': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** @description Проверка доступности сервера. */
    get: operations['apiHealth']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/orders': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get: operations['listOrders']
    put?: never
    post: operations['createOrder']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/orders/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get: operations['getOrder']
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
  '/api/products/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get: operations['getProduct']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/promotions': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** @description Промо-блоки в порядке показа. Недоступные товары исключены; пустой список допустим. */
    get: operations['listPromotions']
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
    CreateOrder: {
      items: components['schemas']['OrderInputItem'][]
      receiving: components['schemas']['Receiving']
    }
    Credentials: {
      email: string
      password: string
    }
    Delivery: {
      name: string
      phone: string
      /** @enum {string} */
      method: 'delivery'
      address: string
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
      amount: number
      /** @enum {string} */
      currency: 'RUB'
    }
    Order: {
      /** Format: int32 */
      id: number
      /** @enum {string} */
      status: 'paid'
      /** Format: date-time */
      createdAt: string
      receiving: components['schemas']['Receiving']
      items: components['schemas']['OrderItem'][]
      total: components['schemas']['Money']
    }
    OrderInputItem: {
      /** Format: int32 */
      id: number
      /** Format: int32 */
      quantity: number
    }
    OrderItem: {
      /** Format: int32 */
      productId: number
      name: string
      /** Format: int32 */
      quantity: number
      price: components['schemas']['Money']
      total: components['schemas']['Money']
    }
    OrderRejected: {
      products: components['schemas']['ProblemProduct'][]
    } & components['schemas']['ApiError']
    Pickup: {
      name: string
      phone: string
      /** @enum {string} */
      method: 'pickup'
    }
    ProblemProduct: {
      /** Format: int32 */
      id: number
      /** @enum {string} */
      reason: 'not_found' | 'unavailable'
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
      image_url: string | null
      available: boolean
    }
    ProductPage: {
      items: components['schemas']['Product'][]
      /** Format: int32 */
      total: number
      /** Format: int32 */
      page: number
      /** Format: int32 */
      pageSize: number
      /** Format: int32 */
      totalPages: number
    }
    /** @description Промо-блок главной. Товар уникален в подборке и доступен для покупки. */
    Promotion: {
      /** Format: int32 */
      id: number
      title: string
      text: string
      product: components['schemas']['Product']
    }
    Receiving: components['schemas']['Delivery'] | components['schemas']['Pickup']
    Recipient: {
      name: string
      phone: string
    }
    User: {
      /** Format: int32 */
      id: number
      email: string
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
  currentUser: {
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
          'application/json': components['schemas']['User']
        }
      }
      /** @description Access is unauthorized. */
      401: {
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
  signin: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['Credentials']
      }
    }
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['User']
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
      /** @description Access is unauthorized. */
      401: {
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
  signout: {
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
          'application/json': {
            /** @enum {boolean} */
            success: true
          }
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
  signup: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['Credentials']
      }
    }
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['User']
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
      /** @description The request conflicts with the current state of the server. */
      409: {
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
  apiHealth: {
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
  listOrders: {
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
          'application/json': components['schemas']['Order'][]
        }
      }
      /** @description Access is unauthorized. */
      401: {
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
  createOrder: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateOrder']
      }
    }
    responses: {
      /** @description The request has succeeded and a new resource has been created as a result. */
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['Order']
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
      /** @description Access is unauthorized. */
      401: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ApiError']
        }
      }
      /** @description The request conflicts with the current state of the server. */
      409: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['OrderRejected']
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
  getOrder: {
    parameters: {
      query?: never
      header?: never
      path: {
        id: number
      }
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
          'application/json': components['schemas']['Order']
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
      /** @description Access is unauthorized. */
      401: {
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
  listProducts: {
    parameters: {
      query?: {
        /** @description Необязательный фильтр по slug категории. */
        category?: string
        /** @description Минимальная цена в целых рублях, включительно. */
        priceMin?: number
        /** @description Максимальная цена в целых рублях, включительно. */
        priceMax?: number
        available?: boolean
        search?: string
        page?: number
        pageSize?: number
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
          'application/json': components['schemas']['ProductPage']
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
  getProduct: {
    parameters: {
      query?: never
      header?: never
      path: {
        id: number
      }
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
          'application/json': components['schemas']['Product']
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
  listPromotions: {
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
          'application/json': components['schemas']['Promotion'][]
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
}
