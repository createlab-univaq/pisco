# Step 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /backend

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npm run postinstall

# Step 2: Production runner stage
FROM node:20-alpine AS runner

WORKDIR /backend

ENV NODE_ENV=production

COPY package*.json ./
# Added --ignore-scripts so 'postinstall' (tsc) is skipped in this stage
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /backend/dist ./dist

EXPOSE 5000

CMD ["node", "./dist/server.js"]