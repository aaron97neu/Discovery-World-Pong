# FROM node:17 AS builder
# WORKDIR /app
# COPY --from=util ./js_packages ./js_packages
# COPY package*.json ./
# RUN npm install
# RUN npm install ./js_packages/dw/state-machine
# COPY . ./
# RUN npm run build

# FROM nginx:1.25.0
# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=builder /app/build .
# EXPOSE 80
# ENTRYPOINT ["nginx", "-g", "daemon off;"]

ARG CERTS=default

FROM node:17 AS ssl_default

FROM ssl_default AS ssl_zscaler
COPY --from=certs . ./certs
RUN cp ./certs/zscaler.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

FROM ssl_${CERTS} AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY --from=util ./js_packages ./js_packages
RUN npm install ./js_packages/dw/state-machine
COPY . ./
RUN npm run build

FROM nginx:1.25.0

LABEL org.opencontainers.image.source=https://github.com/aaron97neu/Discovery-World-Pong
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]