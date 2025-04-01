# # stage - 1
# FROM node:22-alpine AS builder

# WORKDIR /app

# COPY package*.json .

# RUN npm install

# COPY . .

# RUN npm run build

# # stage - 2
# FROM node:22-alpine

# WORKDIR /app

# COPY package*.json .

# RUN npm install

# COPY --from=builder /app/dist ./dist
# COPY prisma ./prisma

# # Generate Prisma Client in the production stage
# RUN npm run prisma:generate

# # Remove devDependencies to keep the image lean
# RUN npm prune --omit=dev

# EXPOSE 7003

# CMD ["npm", "start"]


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

# Install postgresql-client to provide pg_isready
RUN apk add --no-cache postgresql-client

COPY package*.json .

RUN npm install

COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

RUN npm run prisma:generate

RUN npm prune --omit=dev

EXPOSE 7003

# Run migrations and start the app at runtime
# CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
CMD ["sh", "-c", "until pg_isready -h database -U postgres; do sleep 1; done && npx prisma migrate deploy && npm start"]