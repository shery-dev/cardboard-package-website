# Use Debian-based image so native modules (better-sqlite3, sharp, bcrypt) can compile
FROM node:20-slim

WORKDIR /usr/src/app

# Install build deps for native modules (better-sqlite3, etc.)
RUN apt-get update -y && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install all deps (including devDependencies) so `npm run build` works
RUN npm ci

COPY . .

# Browserslist update and build (NODE_ENV not set so devDeps + ESLint available)
RUN npx update-browserslist-db@latest --update-db && npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
