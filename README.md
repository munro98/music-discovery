## A Music Discovery Web App

A web app with a sign up and login system for discovering music using the Youtube and LastFM APIs.

## Features
- Search artists
- View artists top music and biography using lastFM api
- Play artists top music inside an embeded Youtube player
- (In progress): Add music to your account and play them from you profile page
- (In progress): Continous integration into AWS with AWS CodeDeploy

## Dependencies
- Node.js
- NPM
- React
- MongoDB Atlas MongoURI
- **.env file with ENV variables**, a .env template is provided

## Quick Start

Clone the repository
Install packages for Node backend
```
 npm install
```

Install packages for React client

```
 cd ./client
 npm install
```
To Test Locally


edit ```basename="/your-app-basename"```
from ```client/src/index.js```
create a .env in the root using the .env template with your database, lastfm key and youtube api keys
create file ./client/src/clientConfig.js with your youtube and lastfm api keys using the clientConfig template.js


Start Dev Server ( both React server and Nodejs server )

```
 npm run dev
```