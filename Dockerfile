FROM node:18-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

COPY src ./src
COPY tsconfig.json .

RUN npm run build && tree /

RUN ls -l /dist

EXPOSE 8080

CMD ["npm", "start"]