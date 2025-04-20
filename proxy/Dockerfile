# Use Ubuntu as the base image for building
FROM ubuntu:22.04 AS builder

# Install build dependencies
RUN apt-get update && \
    apt-get install -y \
    make \
    gcc \
    g++ \
    libc6-dev \
    libpoco-dev \
    libpq-dev \
    postgresql-server-dev-all \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the source code
COPY . .

# Build the application with debug output
RUN apt-cache search poco | grep dev
RUN ls -la /usr/lib/**/libPoco* || echo "No Poco libraries found with that pattern"
RUN pkg-config --list-all | grep -i poco || echo "No Poco pkg-config modules found"
RUN make docker || make docker-alt || make docker-fallback

# Use Ubuntu again for the smaller runtime image
FROM ubuntu:22.04

# Install runtime dependencies including CA certs for SSL
RUN apt-get update && \
    apt-get install -y \
    libpoco-dev \
    libpq-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy only the compiled binary from the builder stage
COPY --from=builder /app/proxy_compiled /app/

# Make the binary executable
RUN chmod +x /app/proxy_compiled

# Expose the port the proxy runs on (adjust if needed)
EXPOSE 4000

# Command to run the proxy
CMD ["/app/proxy_compiled"]
