ARG CERTS=default

FROM node:18 AS ssl_node_default

FROM nginx:1.25.0 AS ssl_nginx_default

FROM ssl_nginx_default AS ssl_nginx_zscaler
COPY --from=certs . ./certs
RUN cp ./certs/zscaler.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt


FROM ssl_node_default AS ssl_node_zscaler
COPY --from=certs . ./certs
RUN cp ./certs/zscaler.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

FROM ssl_node_${CERTS} AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=optional
COPY . ./ 
RUN chmod +x ./node_modules/.bin/react-scripts
RUN npm run build

FROM ssl_nginx_${CERTS}
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
