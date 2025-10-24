# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json ./
COPY bun.lock* ./
RUN bun install

COPY . .
RUN bun run build

# Production stage
FROM oven/bun:latest

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["bun", "run", "start"]
