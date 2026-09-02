# syntax=docker/dockerfile:1

FROM node:24-alpine AS deps
WORKDIR /build

# Dependency layer on its own: it only reinstalls when the manifests change.
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /build
COPY --from=deps /build/node_modules ./node_modules
COPY . .

# next substitutes every NEXT_PUBLIC_* variable into the client bundle while it
# builds, so this one cannot come from the runtime environment -- it has to be here,
# and it has to be a URL the browser can reach. QuestionImageUploadField builds
# <img src> from it. On Coolify, mark it "Build Variable" or it will not arrive.
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Read by next.config.ts, which is evaluated during the build as well.
ARG MAX_UPLOAD_SIZE=10mb
ENV MAX_UPLOAD_SIZE=$MAX_UPLOAD_SIZE

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

# The standalone output covers the server only; public/ and .next/static are not
# part of it and have to be copied in beside it or every asset 404s.
COPY --from=build /build/public ./public
COPY --from=build --chown=node:node /build/.next/standalone ./
COPY --from=build --chown=node:node /build/.next/static ./.next/static

USER node
EXPOSE 3000

# The generated server.js binds to HOSTNAME, which defaults to localhost -- from
# outside the container that looks like a refused connection.
ENV HOSTNAME=0.0.0.0

HEALTHCHECK --interval=10s --timeout=5s --retries=12 --start-period=20s \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
