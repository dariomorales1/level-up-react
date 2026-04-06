# ============================================
# STAGE 1 - Build del frontend React
# ============================================
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json primero para cache de layers
COPY package*.json ./

# Instalar dependencias
RUN npm ci --no-audit --no-fund

# Copiar el resto del codigo
COPY . .

# Variable de entorno para el build
ENV REACT_APP_API_URL=/api
ENV CI=false
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS="--max-old-space-size=3072"

# Build de produccion
RUN npm run build

# ============================================
# STAGE 2 - Nginx sirviendo el build
# ============================================
FROM nginx:alpine

# Eliminar config default
RUN rm /etc/nginx/conf.d/default.conf

# Copiar nginx config custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build del stage anterior
COPY --from=build /app/build /usr/share/nginx/html

# Permisos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/nginx-health || exit 1

CMD ["nginx", "-g", "daemon off;"]
