# ---- Build Stage ----
FROM oven/bun:alpine AS builder

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV NODE_ENV=production

WORKDIR /app

# Install dependencies
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile

# Copy source and build
COPY . .
RUN bun run build

# ---- Production Stage ----
FROM oven/bun:alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy standalone output (requires "output: 'standalone'" in next.config.js)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["bun", "server.js"]
