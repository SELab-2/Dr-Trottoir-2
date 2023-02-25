# pull official base image
FROM node:18-alpine AS deps

# set work directory
WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm install

# copy project
COPY . .