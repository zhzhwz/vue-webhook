#!/bin/bash

WORK_PATH='/usr/projects/vue-back'
cd $WORK_PATH
echo "clear old codes..."
git reset --hard origin/master
git clean -f
echo "pull newest codes..."
git pull origin master
echo "building..."
docker build -t vue-back .
echo "stop and delete old container..."
docker stop vue-back-container
docker rm vue-back-container
echo "start new container..."
docker container run -p 3000:3000 -v /usr/projects/files:/app/upload --name vue-back-container -d vue-back
