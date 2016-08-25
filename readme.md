# Simple Node Server

[![Build Status](https://travis-ci.org/travis-ci/travis-web.png?branch=master)](https://travis-ci.org/travis-ci/travis-web)

### Info

Simple node server with package.json (for back-end) and bower.json (for front-end) to clone and jumpstart a Javascript project. The setup is MVC. Every file has comments to what its purpose exactly is.

Note: To serve the public directory, Nginx or V8 are better suited than node to do so.

### Use

Clone the project with following command

```
$ git clone https://Temmermans@bitbucket.org/Temmermans/simple-node-server.git
```
cd in the project and install npm and bower dependecies

```
$ npm install && bower install
```
fire up the server by using the following command

```
$ node ./bin/www
```

To test the application, simply add files in the test folder (give them the same name as the resources they test) and run

```
$ grunt test
```

### Node Inspector

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

### Grunt

Run the following command to compile LESS to CSS, minify, bundle and hash all the static resource files.

```
$ grunt bunminify
```

### ToDo
- Heroku
