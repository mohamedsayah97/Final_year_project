FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app
EXPOSE 3000

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --legacy-peer-deps --ignore-scripts

# Copy application code
COPY . .

# Build the application
RUN npm run build

# No prune needed - we already have only production deps?
# Start the application
CMD ["node", "dist/main.ts"]