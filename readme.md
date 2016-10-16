# Simple Node Server

[![Build Status](https://travis-ci.org/travis-ci/travis-web.png?branch=master)](https://travis-ci.org/travis-ci/travis-web)

### Info

Simple node server with package.json (for back-end) and bower.json (for front-end) to clone and jumpstart a Javascript project. Every file has comments to what its purpose exactly is.

### Socket.io

Socket.io is setup to work with the clusters and ./bin/www file so the back and front-end can communicate using websockets. Solution is implemented using the following blog (with redis-io to make sure the requests go to the correct process):

https://github.com/squivo/chat-example-cluster, http://stackoverflow.com/questions/24609991/using-socket-io-in-express-4-and-express-generators-bin-www and
https://github.com/socketio/socket.io-redis/issues/31

See this example on the socket.io site to see how it works to emit and listen for events: http://socket.io/get-started/chat/

### Use

Clone the project with following command and set to a new origin in a new repository:

```
$ git clone https://Temmermans@bitbucket.org/Temmermans/simple-node-server.git
$ git remote set-url origin https://github.com/USERNAME/OTHERREPOSITORY.git
```
cd in the project and install npm and bower dependecies

```
$ npm install && bower install
```
fire up the server by using the following command

```
$ npm run start
```

To test the application, simply add files in the test folder (give them the same name as the resources they test) and run

```
$ npm run test
```

Npm is used as the build and package manager. Look at the package.json file to see what scripts can be run. For example:

```
$ npm run watch
```

This command will watch for changes in every file of the src folder and run the appropriate command to compile less, minify js or minify images.

### Node Inspector (or use build in debugger in atom)

To use the node inspector follow the following steps:
```
$ npm install -g node-inspector
```

run the node inspector in a command line and open another command line
```
$ node-inspector
```

to start debugging the application run node --debug
```
$ node --debug ./bin/www
```
visit the following url: http://localhost:8080/debug?port=5858. Start debugging!

Commands:
1. Resume script execution (F8)
2. Step over next function call (F10)
3. Step into next function call (F11)
4. Step out of current function (Shift-F11)

### Git workflow and Heroku

The repo has following braches that have to following flow
```
development -> staging -> production (master)
```
## Development
Development is the first step that happens on the localhost. From this branch, features branches can be created and merged back into the development branch
using the following git commands:
```
$ git checkout -b feature
```

This will create a new branch and immediatly switches to it. Merge it back with development using the following git command:
```
$ git checkout development
$ git merge feature
```

After the merge you no longer need the branch so delete it
```
$ git branch -d feature
```
## Staging
After the work and tests in development on the localhost are done, its time to merge the development branch in the staging branch to start tests in a production
env in Heroku.
```
$ git checkout staging
$ git merge development
```

In Heroku, to create a staging app, run the following command:
```
$ heroku create --remote staging
```

To push to the staging app, run the following command (not the normal git push heroku master):
```
$ git push staging master
```

This will run the app still in a test app but still in the same env the production app will be running
more info can be found on the following url: https://devcenter.heroku.com/articles/multiple-environments

## Production

This is the master branch and the app we will present to the userbase. To merge staging into production use following commands:
```
$ git checkout master
$ git merge staging
```

Then create a production app and push to it:
```
$ heroku create --remote production <appName>
$ git push production master
```

# Note
In the development and staging branch both the src folder and the public folder will be checked in. In the master branch, the src folder is in the gitignore file
since this will only take up more app space and this is not necessary for the working of the app (all necessary files will be in the public directory after running the gulp
command and this is the directory that will be served by express)

To push to a certain branch, run the following commands:
```
$ git checkout -b <branch>
$ git push -u origin <branch>
```
