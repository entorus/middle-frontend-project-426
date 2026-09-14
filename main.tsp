import "@typespec/http";
import "@typespec/openapi3";

using TypeSpec.Http;

@service(#{ title: "PS Parts API" })
namespace PsParts;

model Credentials {
  @minLength(3)
  @maxLength(254)
  @pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
  email: string;

  @minLength(8)
  @maxLength(128)
  password: string;
}

model User {
  id: int32;
  email: string;
}

@error
model Unauthorized {
  @statusCode code: 401;
  @body body: ApiError;
}

@error
model Conflict {
  @statusCode code: 409;
  @body body: ApiError;
}

@route("/api/auth/signup")
@post
op signup(@body credentials: Credentials): User | BadRequest | Conflict | ServerError;

@route("/api/auth/signin")
@post
op signin(@body credentials: Credentials): User | BadRequest | Unauthorized | ServerError;

@route("/api/auth/signout")
@post
op signout():
  | {
      success: true;
    }
  | BadRequest
  | ServerError;

@useAuth(ApiKeyAuth<ApiKeyLocation.cookie, "psparts_session">)
@route("/api/auth/me")
@get
op currentUser(): User | Unauthorized | ServerError;

model Health {
  health: "check";
}

model Category {
  id: int32;
  slug: string;
  name: string;
}

@doc("Денежная сумма: amount — целое число копеек, currency — RUB.")
@example(#{ amount: 1999000, currency: "RUB" })
model Money {
  @minValue(0)
  amount: int32;

  currency: "RUB";
}

model Product {
  id: int32;
  sku: string;
  name: string;
  description: string;
  price: Money;
  category_slug: string;
  category_name: string;
  image_url: string | null;
  available: boolean;
}

model ProductPage {
  items: Product[];
  @minValue(0) total: int32;
  @minValue(1) page: int32;
  @minValue(1) pageSize: int32;
  @minValue(0) totalPages: int32;
}

@doc("Единый JSON-формат ошибок API. statusCode совпадает с HTTP-статусом.")
@example(#{ statusCode: 400, error: "Bad Request", message: "Некорректный запрос" })
model ApiError {
  @minValue(400)
  @maxValue(599)
  statusCode: int32;

  error: string;
  message: string;
}

@error
model ServerError {
  @statusCode code: 500;
  @body body: ApiError;
}

@error
model BadRequest {
  @statusCode code: 400;
  @body body: ApiError;
}

@error
model NotFound {
  @statusCode code: 404;
  @body body: ApiError;
}

@doc("Проверка доступности сервера.")
@route("/health-check")
@get
op healthCheck(): Health;

@doc("Список категорий, отсортированный по id.")
@route("/api/categories")
@get
op listCategories(): Category[] | ServerError;

@doc("Каталог товаров с названиями категорий, отсортированный по id.")
@route("/api/products")
@get
op listProducts(
  @doc("Необязательный фильтр по slug категории.")
  @minLength(1)
  @maxLength(100)
  @pattern("^[a-z0-9]+(?:-[a-z0-9]+)*$")
  @query
  category?: string,

  @doc("Минимальная цена в целых рублях, включительно.")
  @minValue(0)
  @maxValue(21474836)
  @query
  priceMin?: int32,

  @doc("Максимальная цена в целых рублях, включительно.")
  @minValue(0)
  @maxValue(21474836)
  @query
  priceMax?: int32,

  @query available?: boolean,

  @minLength(1)
  @maxLength(100)
  @query
  search?: string,

  @minValue(1)
  @maxValue(100000)
  @query
  page?: int32 = 1,

  @minValue(1)
  @maxValue(48)
  @query
  pageSize?: int32 = 12,
): ProductPage | BadRequest | NotFound | ServerError;

@route("/api/products/{id}")
@get
op getProduct(@minValue(1) @path id: int32): Product | BadRequest | NotFound | ServerError;
