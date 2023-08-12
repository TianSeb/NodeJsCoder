FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8080

ARG ENV_LOCAL

ENV ENV_LOCAL=${ENV_LOCAL}

CMD ["npm", "run", "test"]