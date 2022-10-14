# FROM ubuntu:latest
# COPY . .
# RUN apt-get update && \
#     apt-get -qy full-upgrade && \
#     apt-get install -qy curl && \
#     apt-get install -qy curl && \
#     curl -sSL https://get.docker.com/ | sh
# RUN curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
# RUN bash /tmp/nodesource_setup.sh
# RUN apt install nodejs -y
# RUN npm install -g nodemon
# RUN npm install -g mega-linter-runner
# RUN npm install
# EXPOSE 3500
# CMD [ "nodemon", "server.ts" ]

# FROM docker:latest AS dock
# COPY . .

FROM node:alpine AS nd
COPY package*.json ./
COPY . .


FROM alpine
COPY --from=nd . .
RUN apk add --update docker openrc
RUN rc-update add docker boot
RUN npm install -g nodemon
RUN npm install -g mega-linter-runner
RUN npm install
EXPOSE 3500
CMD [ "nodemon", "./src/server.ts" ]