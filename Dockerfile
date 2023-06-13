FROM node:19-bullseye AS base

RUN npm i -g pnpm ts-node

FROM base AS deploy

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY . .
RUN pnpm install

EXPOSE 3000
CMD [ "ts-node", "index.ts" ]
