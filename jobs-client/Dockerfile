# Stage 1: Build the React application
FROM node:18-alpine as build
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the source code into the container
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the application with a lightweight HTTP server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove the default NGINX configuration file
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy the built React app from the previous stage
COPY --from=build /usr/src/app/build .

# Copy custom NGINX configuration for SPA (Single Page Application)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
