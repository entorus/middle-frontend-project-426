import "@typespec/http";
import "@typespec/openapi3";

using TypeSpec.Http;

@service(#{ title: "PS Parts API" })
namespace PsParts;

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
): Product[] | BadRequest | NotFound | ServerError;
