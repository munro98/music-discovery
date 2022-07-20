#!/bin/bash

#give permission for everything in the app directory
sudo chmod -R 777 /home/ec2-user/app

#navigate into our working directory where we have all our github files
cd /home/ec2-user/app

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
npm install

#install react server dependencies
cd /home/ec2-user/app/client
#install node modules
npm install -f

cd /home/ec2-user/app
export MY_SECRET="cool beans"

#route port web traffic on port 80 to reactjs server on 3000
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000

#start our node app in the background
#node app.js > app.out.log 2> app.err.log < /dev/null & 
npm run production > app.out.log 2> app.err.log < /dev/null & 