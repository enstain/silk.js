#!/bin/bash

if [ "$1" == "production" ]
then
	echo "Select 13" > redis-deploy-script.txt
elif [ "$1" == "staging" ]
then
	echo "Select 12" > redis-deploy-script.txt
else
	echo 'usage - npm run deploy <production|staging> <debug>'
	exit 0
fi

if [ "$2" == "debug" ]
then
	NODE_ENV=production DEBUG=t webpack
else
	NODE_ENV=production webpack	
fi

lib=`cat dist/ru-upfinder-silk.js`
lib=`echo $lib | base64`
`ruby bin/gen_redis.rb $lib >> redis-deploy-script.txt`

scp redis-deploy-script.txt deploy@up-finder.com:redis-deploy-script.txt
ssh deploy@up-finder.com <<'ENDSSH'
echo -e "$(cat redis-deploy-script.txt)" | redis-cli --pipe
rm redis-deploy-script.txt
ENDSSH