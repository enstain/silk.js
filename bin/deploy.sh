#!/bin/bash

if [ "$1" == "production" ]
then
	echo "Select 13" > redis-deploy-script.txt
elif [ "$1" == "staging" ]
then
	echo "Select 12" > redis-deploy-script.txt
else
	echo 'usage - npm run deploy <production|staging>'
	exit 0
fi

NODE_ENV=production webpack
lib=`cat dist/ru-upfinder-silk.js`
lib=`echo $lib | base64`
echo "Select 12" > redis-deploy-script.txt
`ruby bin/gen_redis.rb $lib >> redis-deploy-script.txt`
scp redis-deploy-script.txt deploy@up-finder.com:redis-deploy-script.txt
ssh deploy@up-finder.com <<'ENDSSH'
echo -e "$(cat redis-deploy-script.txt)" | redis-cli --pipe
ENDSSH