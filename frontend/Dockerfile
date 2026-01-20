# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY .env .env

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- Runtime Stage ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our nginx config
COPY nginx.conf /etc/nginx/conf.d

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
