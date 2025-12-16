# Use an official Node.js LTS runtime as the base image for building
FROM node:22-alpine as builder

# Accept build-time arguments
ARG BUILD_COMMAND=build
ARG NODE_ENV=production

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies for building (including devDependencies for build tools)
# Using npm install instead of npm ci to handle lock file sync issues
RUN npm install

# Verify vite is installed (for debugging)
RUN ls -la node_modules/.bin/vite || echo "Vite binary not found after install"

# Copy the rest of the application code to the working directory
# Note: .dockerignore should exclude node_modules to prevent overwriting installed packages
COPY . ./

# Verify vite still exists after copying files
RUN ls -la node_modules/.bin/vite || echo "Vite binary not found after copy"

# Build the Vite application using npm run (npm handles PATH resolution automatically)
RUN npm run build

# Use an official lightweight Node.js LTS image for serving
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package.json and package-lock.json to the working directory in the final image
# Copy the updated lock file from builder stage (will be synced after npm install)
COPY --from=builder /app/package*.json ./

# Install only production dependencies
# Use npm install with --production flag (lock file will be synced from builder stage)
RUN npm install --production && \
    npm cache clean --force

# Copy the built Vite application from the builder stage
COPY --from=builder /app/dist ./dist

# Copy server file
COPY --from=builder /app/server-web.js ./server-web.js

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Run the Node.js application
CMD ["npm", "start"]
