FROM node:lts-alpine as debug

# install simple http server for serving static content
RUN npm install -g @vue/cli

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package.json /app/package.json
COPY package-lock.json /app/package.lock.json

# install project dependencies
RUN npm install --silent

# copy project files and folders to the current working directory (i.e. 'app' folder)

COPY ./ .

EXPOSE 8080
CMD ["npm", "run", "serve"]

# # Debug with nodemon running
# FROM node:15-alpine as debug

# # install simple http server for serving static content
# RUN npm install -g http-server

# WORKDIR /work/

# COPY package*.json /work/
# RUN npm install

# COPY ./ /work/

# ENTRYPOINT [ "npm","run","serve" ]

# # Prod 
# FROM node:15-alpine as prod

# # install simple http server for serving static content
# RUN npm install -g http-server

# WORKDIR /work/

# COPY package*.json /work/
# RUN npm install

# COPY ./src/ /work/src/

# RUN npm run build

# EXPOSE 8080
# CMD [ "http-server", "dist" ]