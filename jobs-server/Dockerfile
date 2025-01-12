# Stage 1: Base image
FROM node:18-alpine as base
WORKDIR /usr/src/app

# Stage 2: Install dependencies
FROM base as deps
COPY package.json package-lock.json ./ 
RUN npm ci --omit=dev

# Stage 3: Build the project
FROM base as build
COPY package.json package-lock.json ./ 
RUN npm ci
COPY . . 
RUN npm run build

# Stage 4: Production image
FROM node:18-alpine as prod
WORKDIR /usr/src/app

# Install Redis
RUN apk add --no-cache redis

# Copy application code and dependencies
COPY package.json ./ 
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Expose the necessary ports
EXPOSE 8000
EXPOSE 6379

# Start Redis in the background and then start the app
CMD redis-server --daemonize yes && npm run start:prod
