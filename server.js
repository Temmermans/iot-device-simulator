var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs  = require('express-handlebars');
var helmet = require('helmet');
var app = express();

// configuration ===============================================================

//setup security ===============================================================
require('./lib/security-setup')(app, helmet)

// set up our express application ==============================================
app.use(logger('dev')); // log every request to the console
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//set handlebars as default templating engine
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//the default store is not for production usage. Install a store compatible with the db you are using from: https://github.com/expressjs/session#compatible-session-stores
//this is also a dependency of csurf and passport
// app.use(session({
//   secret: "@lHJr+JrSwv1W&J904@W%nmWf++K99pRBvk&wBaNAs4JTid1Ji",
//   resave: false,
//   saveUninitialized: true
// }));

// serve the static content ====================================================
app.use(express.static(__dirname + '/public'))

// routes ======================================================================
require('./app/routes.js')(app) // load our routes and pass in our app

// export so bin/www can launch ================================================
module.exports = app;
