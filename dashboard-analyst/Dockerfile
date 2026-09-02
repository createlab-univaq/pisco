# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /build

# The `playwright` devDependency downloads a browser bundle on install. It is only
# needed by `npm run test:e2e`, the browsers do not run on alpine anyway, and the
# download is most of the install time.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Dependency layer first: it only reinstalls when the manifests change.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Nothing from the environment is read here. Every variable reaches the app through
# $env/dynamic/private at runtime, so this build needs no API URL and no secrets.
RUN npm run build && npm prune --omit=dev

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

# adapter-node's output is not self-contained -- it imports from node_modules at
# runtime, so the pruned production tree ships alongside it.
COPY --from=build /build/package.json ./
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/build ./build

USER node
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --retries=12 --start-period=20s \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"

CMD ["node", "build"]
