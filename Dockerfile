# ==============================================================================
# Stage 1: Build React Single Page Application with Node 20
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy source code and build production assets
COPY . ./
RUN npm run build

# ==============================================================================
# Stage 2: Serve Production Assets with Nginx Alpine for Cloud Run
# ==============================================================================
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration configured for Port 8080 and SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Google Cloud Run container port
EXPOSE 8080

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
