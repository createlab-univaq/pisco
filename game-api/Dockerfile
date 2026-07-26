# base
FROM node:24.13-alpine3.23 AS base

WORKDIR /usr/src/app

COPY package*.json ./
    
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

ENTRYPOINT ["npm","start"]