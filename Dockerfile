# Use a Node.js base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Install http-server globally
RUN npm install -g http-server

# Copy all project files into the container
COPY . /app/

# Expose the port http-server will use
EXPOSE 8081

# Start http-server
CMD ["http-server", "-p", "8081", "--spa"]