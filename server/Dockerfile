FROM node:22-bookworm-slim AS build

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

ENV PORT=3001
ENV DATA_DIR=/app/data
ENV DATABASE_PATH=/app/data/shop.db
ENV UPLOADS_PATH=/app/data/uploads

EXPOSE 3001

CMD ["node", "dist/index.js"]
