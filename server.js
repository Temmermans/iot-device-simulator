var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session'); // compatible stores at https://github.com/expressjs/session#compatible-session-stores
var exphbs  = require('express-handlebars');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var helmet = require('helmet');
var app = express();

//setup security ===============================================================
require('./app/lib/security-setup')(app, helmet);

// configuration ===============================================================
app.use(logger('dev')); // log every request to the console

// set up our express application ==============================================
// Make the body object available on the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set handlebars as default templating engine
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// serve the static content ====================================================
app.use(express.static(__dirname + '/public'));

// set up global variables =====================================================

// routes ======================================================================
require('./app/routes.js')(app); // load our routes and pass in our app

// export so bin/www can launch ================================================
module.exports = app;
