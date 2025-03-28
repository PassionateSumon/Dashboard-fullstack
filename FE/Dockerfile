FROM node:22-alpine

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build
RUN ls -la /app/dist

EXPOSE 5173

CMD ["npm", "run", "preview"]