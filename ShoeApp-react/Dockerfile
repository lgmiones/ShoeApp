# ========================================
# Build the static site
# ========================================
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies (use files from current context)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# IMPORTANT: Vite env var is baked at build time.
# In compose, set args: VITE_API_BASE_URL: "http://api:8080" (API in Docker)
ARG VITE_API_BASE_URL="http://api:8080"
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the site
RUN npm run build

# ========================================
# Serve with nginx
# ========================================
FROM nginx:1.27-alpine AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist ./

# SPA fallback to index.html
COPY <<'NGINX_CONF' /etc/nginx/conf.d/default.conf
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  # Static assets with long cache
  location /assets/ {
    try_files $uri =404;
    access_log off;
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # SPA fallback
  location / {
    try_files $uri /index.html;
  }
}
NGINX_CONF

EXPOSE 80
