FROM node:18-alpine AS builder

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /frontend

RUN npm install -g serve

COPY --from=builder /frontend/dist ./dist

EXPOSE $FRONTEND_PORT

CMD ["sh", "-c", "serve -s dist -l ${FRONTEND_PORT:-3000}"]