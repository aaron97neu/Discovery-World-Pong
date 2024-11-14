FROM node:18-slim AS builder
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
