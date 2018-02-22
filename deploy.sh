#!/bin/bash

for i in $(ls ~gitlab-runner/tcr-ui-apps)
do
    docker stop ethereum-tcr-ui-deploy-$i
    docker rm ethereum-tcr-ui-deploy-$i
    cat Dockerfile-template | sed s/_DIR/$i/ | sed s/_PORT/$(cat ~gitlab-runner/tcr-ui-apps/$i/port)/ > Dockerfile-$i
    cp -rf ~gitlab-runner/tcr-ui-apps/* .
    docker build -f Dockerfile-$i . -t ethereum-tcr-ui-deploy-$i
    #docker run -p 127.0.0.1:8989:8989 -t ethereum-tcr-backend-deploy
    docker run -d --name ethereum-tcr-ui-deploy-$i --network host -t ethereum-tcr-ui-deploy-$i
done
