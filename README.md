# Интернет-магазин комплектующих для ПК

[![hexlet-check](https://github.com/entorus/middle-frontend-project-426/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/entorus/middle-frontend-project-426/actions)

Разработайте интернет-магазин комплектующих для ПК целиком на TypeScript.
Фронтенд пишете на любом TS-фреймворке (React, Vue, Svelte, Angular, Solid и др.).
Готового API здесь нет, поэтому сервер под свой интерфейс вы поднимаете сами,
а фреймворк для него и работу с базой выбираете на свой вкус. Спроектируйте API
через TypeSpec → OpenAPI, реализуйте регистрацию и авторизацию, главную
с промо-блоками, каталог с фильтрами и пагинацией, корзину, оформление заказа
и личный кабинет с историей заказов. Приложение деплоится в прод с третьего шага
и развивается под собственными браузерными тестами.

Учебный проект Хекслета: https://ru.hexlet.io/programs/middle-frontend
Как это должно работать: https://files.hexlet.app/a/qf7bsq
Готовое приложение находится здесь https://middle-frontend-project-426-mynk.onrender.com

## Стек

- React + Vite + TypeScript; Fastify; PostgreSQL + Knex; Sentry; Docker Compose.

## Установка

<!-- Опишите установку: клонирование, зависимости, переменные окружения -->

```bash
git clone https://github.com/entorus/middle-frontend-project-426.git
cd middle-frontend-project-426
```

## Использование

<!-- Добавьте примеры запуска и запись asciinema — именно это смотрит работодатель -->

Из корня репозитория:

```bash
docker compose up --build -d --wait
```

Откройте [локальное приложение](http://localhost:3000/catalog).
Один сервер отдаёт сборку React и API. Фильтр категории сохраняется в URL.
Миграции и сид выполняются перед каждым стартом сервера; сид добавляет две категории
и шесть демонстрационных товаров, не удаляя данные и не создавая дубликаты.
Цены в сиде учебные, хранятся в копейках.

```bash
docker compose logs app
npm ci
npm run test:smoke
docker compose exec -T app node dist/db/prepare.js
npm run test:smoke
docker compose down
```

Обычный `docker compose down` сохраняет данные PostgreSQL в volume.
Не используйте `down -v`, если нужно сохранить базу.

Если порт 5432 занят другой базой, запускайте `POSTGRES_PORT=55432 docker compose up --build -d --wait`
или задайте `POSTGRES_PORT=55432` в `.env`. Внутри Compose база остаётся на `db:5432`.
Для порта веб-приложения аналогично доступен `APP_PORT` (по умолчанию 3000).

Для разработки с автоматическим обновлением React:

```bash
npm --prefix apps/front ci
npm --prefix apps/front run dev
```

Vite проксирует `/api` к уже запущенному серверу на порту 3000.
Проверка компиляции обоих приложений: `npm run build` после установки зависимостей API и фронтенда.

## Окружение и мониторинг

Скопируйте `.env.example` в `.env` и заполните значения для своего окружения.
Секреты не коммитятся. В Compose URL локальной БД задан отдельно; для прямого запуска API
передайте `DATABASE_URL` через окружение. На хостинге используйте URL managed PostgreSQL.

| Переменная                 | Назначение                                                      |
| -------------------------- | --------------------------------------------------------------- |
| `DATABASE_URL`             | Соединение API с PostgreSQL, только runtime                     |
| `PORT`                     | Порт Fastify; хостинг задаёт сам, локально 3000                 |
| `SENTRY_DSN`               | DSN бэкенда, runtime                                            |
| `SENTRY_ENVIRONMENT`       | Метка окружения Sentry                                          |
| `VITE_SENTRY_DSN`          | Публичный DSN фронтенда, передаётся при сборке                  |
| `SENTRY_TEST_ENABLED`      | Временно включает `/api/debug-sentry`                           |
| `VITE_SENTRY_TEST_ENABLED` | Временно включает страницу `/monitoring-test`, нужна пересборка |

Без DSN мониторинг отключён. Инициализация Node SDK выполняется до загрузки Fastify.
React использует SDK и ErrorBoundary. Для проверки доставки событий заполните DSN,
временно включите оба тестовых флага и пересоберите приложение. Нажмите кнопку на
`/monitoring-test` и запросите `/api/debug-sentry` (ожидается 500).
Проверьте обе ошибки в проектах Sentry, затем отключите флаги и пересоберите образ.
Тесты только в локальном окружении не подтверждают доставку событий с продакшена.

Для полностью локальной проверки SDK без настоящих DSN используйте тестовый приёмник:

```bash
POSTGRES_PORT=55432 docker compose -f compose.yaml -f compose.monitoring.yaml up --build -d --wait
```

Откройте `http://localhost:3000/monitoring-test`, нажмите кнопку и запросите
`http://localhost:3000/api/debug-sentry`. На `http://localhost:4318/events` должны
появиться `Frontend monitoring smoke test` и `Backend monitoring smoke test`.
Этот приёмник хранит только тестовые сообщения в памяти; не публикуйте его в интернете.
После проверки верните обычную сборку и остановите приёмник:

```bash
POSTGRES_PORT=55432 docker compose -f compose.yaml -f compose.monitoring.yaml stop sentry-local
POSTGRES_PORT=55432 SENTRY_DSN= VITE_SENTRY_DSN= SENTRY_TEST_ENABLED=false VITE_SENTRY_TEST_ENABLED=false docker compose up --build -d --wait
```

DSN фронтенда доступен в JS-бандле. `SENTRY_AUTH_TOKEN` для базового сбора ошибок не нужен;
если настраиваете загрузку source maps, передавайте токен как build secret, не как `VITE_*` или Docker ARG.

## Деплой и статус проверки

Для Render: подключите GitHub-репозиторий, выберите Docker, путь `./Dockerfile`, контекст
корня репозитория; Root Directory и Docker Command оставьте пустыми.
Создайте managed PostgreSQL в том же регионе и задайте внутренний URL как `DATABASE_URL`.
Укажите DSN в Environment, health check `/health-check`, Auto-Deploy → On Commit.
Compose используется локально, managed-база не создаётся Dockerfile.
GitHub workflow `quality.yml` проверяет линтер, сборку, контейнеры и повторный сид.

Публичный HTTPS-адрес пока не указан. После деплоя добавьте сюда ссылку на приложение.
Создание managed-базы, настройки Render, автодеплой и доставка двух ошибок в Sentry
не проверены: текущая проверка ограничена локальным проектом.

## Проверка и форматирование кода

Установите инструменты из корня репозитория: `npm ci`.
Зависимости API устанавливаются отдельно: `npm --prefix apps/api ci`.
Зависимости фронтенда: `npm --prefix apps/front ci`.

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

Общая конфигурация ESLint проверяет JavaScript и TypeScript в обоих приложениях.
Правила похожи на Airbnb: строгие сравнения, `const`, стрелочные колбэки,
порядок импортов, запрет изменения параметров и неиспользуемых переменных.
Неиспользуемые параметры TypeScript можно обозначать префиксом `_`.
Это адаптированный набор правил, а не полный `eslint-config-airbnb`.
Для React включены правила hooks и проверка зависимостей эффектов.

Prettier отвечает за оформление: два пробела, одинарные кавычки,
точки с запятой и завершающие запятые. `eslint-config-prettier` отключает
конфликтующие правила ESLint. Сборки, зависимости и покрытие исключены из проверок.

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
