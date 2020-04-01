FROM node:10-alpine

RUN mkdir -p /home/iamaul/evonix-ucp-backend-api

WORKDIR /home/iamaul/evonix-ucp-backend-api

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
