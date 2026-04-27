# Use official Node runtime as a parent image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the application
RUN npm run build

# Install a simple static server to serve the build
RUN npm install -g serve

# Expose the port
EXPOSE 5173

# Command to serve the built application
CMD ["serve", "-s", "dist", "-l", "5173"]
