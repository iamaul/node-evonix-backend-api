FROM node:12.16.1-alpine

RUN mkdir -p /evonix-app

WORKDIR /evonix-app

COPY . .

RUN npm install

EXPOSE 5000

CMD ["npm", "run", "start"]
