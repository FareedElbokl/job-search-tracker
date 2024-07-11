FROM node:18-alpine3.19

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm uninstall bcrypt

RUN npm install bcrypt

EXPOSE 3000