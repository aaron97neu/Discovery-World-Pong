ARG CERTS=default

FROM node:18-slim AS ssl_default

FROM ssl_default AS ssl_zscaler
COPY --from=certs . ./certs
RUN cp ./certs/zscaler.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

FROM ssl_${CERTS} AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=optional
COPY . ./ 
RUN chmod +x ./node_modules/.bin/react-scripts
RUN npm run build

FROM nginx:1.25.0
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
