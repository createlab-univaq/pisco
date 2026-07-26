# Step 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /backend

COPY . .

RUN npm ci

FROM node:20-alpine AS runner

WORKDIR /backend

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /backend/dist ./dist

EXPOSE 5000

CMD ["node", "./dist/server.js"]