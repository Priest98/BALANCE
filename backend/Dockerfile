FROM node:20-bullseye-slim

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start:prod"]
