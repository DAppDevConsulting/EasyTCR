docker stop ethereum-tcr-ui-deploy
docker rm ethereum-tcr-ui-deploy
docker build . -t ethereum-tcr-ui-deploy 
#docker run -p 127.0.0.1:8989:8989 -t ethereum-tcr-backend-deploy 
docker run -d --name ethereum-tcr-ui-deploy --network host -t ethereum-tcr-ui-deploy 
