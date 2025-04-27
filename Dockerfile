# Stage 1: Build the app
FROM node:22-alpine AS builder

WORKDIR /app

# Only copy the package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Run the app
FROM node:22-alpine

WORKDIR /app

# Only copy the built app and necessary files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.production .env.production

# Install only production dependencies
RUN npm install --only=production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000
# Expose the port
EXPOSE 8000

# Run the app
CMD ["npm", "run", "start:prod"]
