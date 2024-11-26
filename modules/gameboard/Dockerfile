# This dockerfile was quickly made to dockerize the application it has not been optimized.
FROM node:17 AS builder
WORKDIR /app
COPY --from=util ./js_packages ./js_packages
COPY package*.json ./
RUN npm install
RUN npm install ./js_packages/dw/state-machine
COPY . ./
RUN npm run build

FROM nginx:1.25.0
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
