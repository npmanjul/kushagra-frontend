# Build stage
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env.production .env.production
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app
COPY --from=build /app ./

EXPOSE 3000
CMD ["npm", "start"]