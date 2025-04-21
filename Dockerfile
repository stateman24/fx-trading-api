FROM node:lts

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY .env.production .env.production

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]