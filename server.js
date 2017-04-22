var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var helmet = require('helmet');
var subdomain = require('express-subdomain');
var apiRouter = express.Router();
var appRouter = express.Router();
var app = express();
var server = require('http').Server(app);

//setup security ===============================================================
require('./app/lib/security-setup')(app, helmet);

// configuration ===============================================================
app.use(logger('dev')); // log every request to the console

// set up our express application ==============================================

// Make the body object available on the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set handlebars as default templating engine
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// serve the static content 
app.use(express.static(__dirname + '/public'));

// mount the routes and subdomains

// ===== Web Application ======== //
require('./app/routes.js')(app, appRouter); // load our routes and pass in our app
app.use(appRouter);

// ===== API service ============ //
require('./api/routes.js')(apiRouter);
app.use(subdomain('api', apiRouter));

// export so bin/www can launch ================================================
module.exports = {app: app, server: server};
