# Debug with nodemon running
FROM node:15-alpine as debug

# install simple http server for serving static content
RUN npm install -g http-server

WORKDIR /work/

COPY package*.json /work/
RUN npm install

COPY ./src/ /work/src/

ENTRYPOINT [ "npm","run","serve" ]

# Prod 
FROM node:15-alpine as prod

WORKDIR /work/

COPY package*.json /work/
RUN npm install

COPY ./src/ /work/src/

RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]