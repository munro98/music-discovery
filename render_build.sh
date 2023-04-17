#install node modules
npm install
#install web server
npm install serve
#install react server dependencies
cd /home/ec2-user/app/client
#install node modules
npm install -f
#build production react application
npm run build
cd /home/ec2-user/app
export MY_SECRET="cool beans"