FROM node:8

# install dash-core
# https://github.com/dashpay/docker-dashd/blob/master/Dockerfile
ADD https://github.com/dashpay/dash/releases/download/v0.12.1.4/dashcore-0.12.1.4-linux64.tar.gz /tmp/
RUN tar -xvf /tmp/dashcore-*.tar.gz -C /tmp/
RUN cp /tmp/dashcore*/bin/*  /usr/local/bin
RUN rm -rf /tmp/dashcore*

# create app directory
WORKDIR /usr/src/app
# copy package.json to app directory
COPY package.json /usr/src/app
# install dependencies before copying the full source
# this makes use of layer caching to only reinstall when package.json changes
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
RUN npm install
# copy app src
COPY . /usr/src/app

EXPOSE 3000
CMD dashd -daemon && npm run dev
