FROM node:22-alpine

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build
RUN ls -la /app/dist

EXPOSE 5173

RUN apk add --no-cache netcat-openbsd
# CMD ["npm", "run", "preview"]
CMD ["sh", "-c", "until nc -z backend 7003; do sleep 1; done && npm run preview"]