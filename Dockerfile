FROM node:12.16.1-alpine

RUN mkdir -p /home/iamaul/evonix-backend-api

WORKDIR /home/iamaul/evonix-backend-api

COPY . .

RUN npm install

EXPOSE 5000

CMD ["npm", "run", "start"]
