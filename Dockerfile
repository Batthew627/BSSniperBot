FROM node:alpine as base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install


COPY . .



FROM base as production

ENV NODE_PATH=./dist

RUN npm run build