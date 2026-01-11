# syntax=docker/dockerfile:1

FROM oven/bun:1.3.5-alpine as build

# Set working directory
WORKDIR /app

# Copy dependency files first (tối ưu cache)
COPY . .

# Install dependencies (production only)
RUN bun install --production --frozen-lockfile

RUN bun build ./src/index.js --compile --compile-autoload-tsconfig --compile-autoload-package-json --minify --outfile ./sora_app_be

FROM alpine:3.23

RUN apk add --no-cache libstdc++ libgcc

WORKDIR /app

# Copy source code
COPY --from=build /app/sora_app_be ./sora_app_be
COPY .env package.json jsconfig.json ./
# Expose port (ví dụ Hono chạy 3000)
EXPOSE 3000

# Run app
CMD ["./sora_app_be"]