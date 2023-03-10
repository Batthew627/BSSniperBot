FROM node:alpine as base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install


COPY . .

RUN npm run build



FROM base as production

ENV NODE_PATH=./build

RUN npm run build