# Stage 1: Build the application
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Ensure the correct permissions for the node_modules directory
RUN chown -R node:node /app/node_modules

# Copy the rest of the application code
COPY . ./ 

# Set permissions for react-scripts
RUN chmod +x ./node_modules/.bin/react-scripts

# Run the build command
RUN npm run build

# Stage 2: Serve the built application using Nginx
FROM nginx:1.25.0

# Set the working directory for Nginx
WORKDIR /usr/share/nginx/html

# Remove the default Nginx content
RUN rm -rf ./*

# Copy the built app from the builder stage
COPY --from=builder /app/build .

# If you have other model-specific files to copy, ensure the path is correct
# COPY --from=models . /usr/share/nginx/html/

# Set up the entrypoint to start Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
