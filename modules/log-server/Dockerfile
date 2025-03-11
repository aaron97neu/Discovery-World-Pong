FROM node:18-slim

LABEL org.opencontainers.image.source=https://github.com/aaron97neu/Discovery-World-Pong
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server.js .
CMD ["node", "server.js"]
