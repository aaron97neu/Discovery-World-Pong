# This dockerfile was quickly made to dockerize the application it has not been optimized.
ARG CERTS=default

FROM node:17 AS base_default

FROM base_default AS base_zscaler
COPY --from=certs . ./certs
RUN cp ./certs/zscaler.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

FROM base_${CERTS} AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.25.0

LABEL org.opencontainers.image.source=https://github.com/aaron97neu/Discovery-World-Pong
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
COPY --from=models . /usr/share/nginx/html/
ENTRYPOINT ["nginx", "-g", "daemon off;"]
