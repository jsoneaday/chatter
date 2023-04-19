FROM node:18
WORKDIR /app
COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]
COPY . .
RUN npm install
CMD npm run build:start