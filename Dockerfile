# FROM node:20

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install

# COPY . .


# EXPOSE 3000

# CMD ["npm", "start"]


FROM node:11.2.0-alpine

RUN apk add --no-cache curl-dev libzip-dev autoconf build-base gmp-dev coreutils python

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm i

EXPOSE 3000

CMD ["node", "./bin/www"]