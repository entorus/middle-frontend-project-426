FROM node:24-bookworm-slim AS build

WORKDIR /app/apps/front
COPY apps/front/package*.json ./
RUN npm ci
COPY apps/front/ ./
RUN npm run build

WORKDIR /app/apps/api
COPY apps/api/package*.json ./
RUN npm ci
COPY apps/api/ ./
RUN npm run build


FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app/apps/api

COPY apps/api/package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/front/dist /app/apps/front/dist
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

USER node
EXPOSE 3000

ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]