# Debug with nodemon running
FROM node:15-alpine as debug

WORKDIR /work/

COPY package*.json /work/
RUN npm install
RUN npm install -g nodemon

COPY ./src/ /work/src/

ENTRYPOINT [ "nodemon","-L","./src/app.js" ]

# Prod 
FROM node:15-alpine as prod

WORKDIR /work/

COPY package*.json /work/
RUN npm install

COPY ./src/ /work/src/

CMD node .