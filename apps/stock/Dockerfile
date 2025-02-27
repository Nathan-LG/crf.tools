FROM node:23-alpine AS alpine

# ------------------------- BASE -------------------------
FROM alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN pnpm install turbo --global
RUN pnpm install next --global

# ------------------------- BUILDER -------------------------
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY . .
RUN turbo prune stock --docker

# ------------------------- INSTALLER -------------------------
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./
COPY --from=builder /app/out/pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpm build

# ------------------------- RUNNER -------------------------
FROM base AS runner
WORKDIR /app

ARG GIT_TAG
ENV GIT_TAG=$GIT_TAG

ENV NODE_ENV=production

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .turbo
RUN chown nextjs:nodejs .turbo

USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/stock/.next/standalone/ .
COPY --from=installer --chown=nextjs:nodejs /app/apps/stock/.next/static /app/apps/stock/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/stock/public /app/apps/stock/public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD turbo db:deploy; turbo db:seed; node /app/apps/stock/server.js