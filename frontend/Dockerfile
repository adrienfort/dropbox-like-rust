# Builder Image
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --omit=dev
RUN npm install typescript

COPY . .

RUN npm run build

# Production Image
FROM nginx:1.27.3-alpine AS app

WORKDIR /app

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for the Nginx server (see nginx.conf)
EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]