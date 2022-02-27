#!/bin/bash

WORK_PATH='/usr/projects/vue-front'
cd $WORK_PATH
echo "clearing old codes..."
git reset --hard origin/master
git clean -f
echo "pulling newest codes..."
git pull origin master
echo "installing dependency..."
npm install
echo "compiling..."
export NODE_OPTIONS=--openssl-legacy-provider
npm run build
echo "building..."
docker build -t vue-front .
echo "stoping and deleting old container..."
docker stop vue-front-container
docker rm vue-front-container
echo "starting new container..."
docker container run -p 8080:80 --name vue-front-container -d vue-front
