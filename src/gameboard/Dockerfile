# This dockerfile was quickly made to dockerize the application it has not been optimized.
FROM node:17 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.25.0

LABEL org.opencontainers.image.source https://github.com/aaron97neu/Discovery-World-Pong
LABEL org.opencontainers.image.licenses MIT

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]