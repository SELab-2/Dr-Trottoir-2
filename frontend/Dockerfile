# pull official base image
FROM cypress/base:18.15.0 AS deps

# set work directory
WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm install

# copy project
COPY . .