var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session'); // compatible stores at https://github.com/expressjs/session#compatible-session-stores
var exphbs  = require('express-handlebars');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var helmet = require('helmet');
var redis = require('redis');
var redisAdapter = require('socket.io-redis');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
// use the redis adapter to create sticky sessions, this is needed because of the different clusters
io.adapter(redisAdapter( require('./app/lib/config').credentials.redis.url ));

//setup security ===============================================================
require('./app/lib/security-setup')(app, helmet);

// configuration ===============================================================
app.use(logger('dev')); // log every request to the console

// set up our express application ==============================================

// setup connect flash so we can sent messages
app.use(cookieParser('secretString'));
app.use(session({
  secret: "@lHJr+JrSwv1W&J904@W%nmWf++K99pRBvk&wBaNAs4JTid1Ji",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Make the body object available on the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set handlebars as default templating engine
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// serve the static content ====================================================
app.use(express.static(__dirname + '/public'));

// set up global variables =====================================================
app.use(function(req, res, next) {
  //set the io object on the response, so we can access it in our routes
  res.io = io;
  //set some global variables to make use of flash easier
  res.locals.message_success = req.flash('message_success');
  res.locals.message_failure = req.flash('message_failure');
  res.locals.message_validation_errors = req.flash('message_validation_errors');
  next();
});

// routes ======================================================================
require('./app/routes.js')(app); // load our routes and pass in our app

// export so bin/www can launch ================================================
module.exports = {app: app, server: server};
