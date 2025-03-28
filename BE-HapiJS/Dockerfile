# stage - 1
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# stage - 2
FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

# Generate Prisma Client in the production stage
RUN npm run prisma:generate

# Remove devDependencies to keep the image lean
RUN npm prune --omit=dev

EXPOSE 7003

CMD ["npm", "start"]