## Build Stage
FROM node:23-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

## Production Stage
FROM node:23-alpine

WORKDIR /app
COPY --from=build /app/dist ./dist
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
RUN npm install --only=production 

EXPOSE 3000

CMD ["npm", "run", "start:prod"]