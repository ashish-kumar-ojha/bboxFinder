FROM node:22-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package-lock.json package.json ./

# Install dependencies (including devDependencies for dev mode)
RUN npm ci --only=production=false

# Copy application source code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
