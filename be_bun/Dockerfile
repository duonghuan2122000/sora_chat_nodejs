# syntax=docker/dockerfile:1

FROM oven/bun:1.3.5-alpine as build

# Set working directory
WORKDIR /app

# Copy dependency files first (tối ưu cache)
COPY package.json bun.lock ./

# Install dependencies (production only)
RUN bun install --production --frozen-lockfile

FROM oven/bun:1.3.5-alpine

WORKDIR /app

# Copy source code
COPY --from=build /app/node_modules ./node_modules
COPY . .
# Expose port (ví dụ Hono chạy 3000)
EXPOSE 3000

# Run app
CMD ["bun", "run", "start"]