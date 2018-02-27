#!/bin/bash

docker stop ethereum-tcr-ui-deploy-$1
docker rm ethereum-tcr-ui-deploy-$1
cat Dockerfile-template | sed s/_DIR/$1/ | sed s/_PORT/$(cat ~gitlab-runner/tcr-ui-apps/$1/port)/ > Dockerfile-$1
cp -rf ~gitlab-runner/tcr-ui-apps/$1/* .
docker build -f Dockerfile-$1 . -t ethereum-tcr-ui-deploy-$1
docker run -d --name ethereum-tcr-ui-deploy-$1 --network host -t ethereum-tcr-ui-deploy-$1
