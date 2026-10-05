FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy manifests and the schema before installing so Prisma's postinstall can generate the client
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Development image, copy all the files
FROM base AS runner
WORKDIR /app

ENV NODE_ENV development

# Create system group and user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma/generated ./prisma/generated

# Copy the rest of the application
COPY . .

# Set permissions
RUN chown -R nextjs:nodejs /app

# Install wait-for-it
RUN apk add --no-cache bash wget openssl
RUN wget -O /usr/local/bin/wait-for-it https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it

# Set user to nextjs
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set environment variables
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Wait for PostgreSQL, apply pending migrations, then start the application in development mode
CMD wait-for-it postgres:5432 --timeout=30 --strict -- \
    sh -c "npx prisma migrate deploy && npm run dev"
