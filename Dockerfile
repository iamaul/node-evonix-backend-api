FROM node:12.16.1-alpine

RUN mkdir -p /evonix-app/api

WORKDIR /evonix-app/api

COPY package*.json ./

RUN npm install

EXPOSE 5000

CMD ["npm", "run", "start"]
