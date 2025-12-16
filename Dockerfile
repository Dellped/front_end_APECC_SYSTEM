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
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . ./

# Build the Vite application
RUN npm run $BUILD_COMMAND

# Use an official lightweight Node.js LTS image for serving
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package.json and package-lock.json to the working directory in the final image
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
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
