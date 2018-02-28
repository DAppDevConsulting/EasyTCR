#!/bin/bash

COUNTER=0

if [ -e ~gitlab-runner/tcr-ui-apps/$1/counter ]
then
    COUNTER=$(cat ~gitlab-runner/tcr-ui-apps/$1/counter)
fi

INC=`expr $COUNTER '+' 1`
cat Dockerfile-template | sed s/_DIR/$1/ | sed s/_PORT/$(cat ~gitlab-runner/tcr-ui-apps/"$1"/port)/ > Dockerfile-$1
cp -rf ~gitlab-runner/tcr-ui-apps/* .
docker build -f Dockerfile-$1 . -t ethereum-tcr-ui-deploy-"$1"-$INC
docker stop ethereum-tcr-ui-deploy-"$1"-$COUNTER
docker rm ethereum-tcr-ui-deploy-"$1"-$COUNTER
docker run -d --name ethereum-tcr-ui-deploy-"$1"-$INC --network host -t ethereum-tcr-ui-deploy-"$1"-$INC

echo "$INC" > ~gitlab-runner/tcr-ui-apps/$1/counter
