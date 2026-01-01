# syntax=docker/dockerfile:1

FROM oven/bun:1.3.5-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (tối ưu cache)
COPY package.json ./

# Install dependencies (production only)
RUN bun install --production

# Copy source code
COPY . .

# Expose port (ví dụ Hono chạy 3000)
EXPOSE 3000

# Run app
CMD ["bun", "run", "start"]