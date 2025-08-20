# Multi-stage build for production optimization
FROM node:18-alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production
ENV PORT=8606

# Copy dependencies
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./

# Create necessary directories with proper permissions
RUN mkdir -p /tmp /app/logs && chown -R nodejs:nodejs /tmp /app/logs

# Security hardening
RUN chown -R nodejs:nodejs /app
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8606/health', (res) => { \
    if (res.statusCode === 200) { \
      process.exit(0) \
    } else { \
      process.exit(1) \
    } \
  }).on('error', () => process.exit(1))"

EXPOSE 8606

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
