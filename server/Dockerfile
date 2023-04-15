FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /usr/src
COPY ["package.json", "tsconfig.json", "./"]
RUN npm install --production --silent
COPY . .
EXPOSE 8000
RUN chown -R node /usr/src
USER node
CMD ["npm", "start"]
