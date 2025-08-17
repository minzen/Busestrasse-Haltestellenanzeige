# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Kopioi vain package*-tiedostot ensin jotta layer cache toimii
COPY package*.json ./
RUN npm ci --only=production

# Varsinainen sovellus
COPY server.js ./server.js

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
