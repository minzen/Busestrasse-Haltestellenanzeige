# frontend/Dockerfile

# 1) Builder: käännä Vite-dist
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) Runtime: tarjoile Nginxillä ja proxyä /api backendille
FROM nginx:alpine
# oma nginx-konffi mukaan
COPY nginx.conf /etc/nginx/conf.d/default.conf
# kopioi käännetty dist
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx default portti 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
