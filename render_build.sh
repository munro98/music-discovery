#install node modules
npm install
#install web server
npm install serve
#install react server dependencies
cd ./client
#install node modules
npm install -f
#build production react application
npm run build
cd ../
export MY_SECRET="cool beans"