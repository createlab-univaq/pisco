# Step 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /backend

COPY package*.json tsconfig.json ./
# Add --ignore-scripts here so it waits for the src folder
RUN npm ci --ignore-scripts

COPY src ./src
# Now explicitly run the compilation because the code is here
RUN npm run postinstall

# Step 2: Production runner stage
FROM node:20-alpine AS runner

WORKDIR /backend

ENV NODE_ENV=production

COPY package*.json ./
# Keep --ignore-scripts here so it skips compiling in the runner stage
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /backend/dist ./dist

EXPOSE 5000

CMD ["node", "./dist/server.js"]