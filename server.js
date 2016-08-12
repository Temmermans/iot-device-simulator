var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

//set Jade as default templating engine
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

//the default store is not for production usage. Install a store compatible with the db you are using from: https://github.com/expressjs/session#compatible-session-stores
//this is also a dependency of csurf
// app.use(session({
//   secret: "@lHJr+JrSwv1W&J904@W%nmWf++K99pRBvk&wBaNAs4JTid1Ji",
//   resave: false,
//   saveUninitialized: true
// }));

app.use(express.static(__dirname + '/public'))

//log all the requests
app.use(logger('dev'))

//set the body object on every request. Can also be done on every request individually (when not all routes need the bodyparser)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//setup security
app.use(require('./security/security-setup'))
//Serve the static content and require all the controllers

app.use(require('./controllers'))
//errorhandling middleware
app.use(require('./controllers/errorhandling'))

// export the app as a node module so the logic is encapsulated
module.exports = app;
