var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var helmet = require('helmet');
var subdomain = require('subdomain');
var app = express();
var server = require('http').Server(app);

//setup security ===============================================================
require('./app/shared/security-setup')(app, helmet);

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

// mount the routes and subdomains (SUBDOMAIN_BASE own declared var with heroku config:set SUBDOMAIN_BASE=delaware-insights --remote production)
app.use(subdomain({ base : process.env.SUBDOMAIN_BASE || 'localhost', removeWWW : true }));
require('./app/routes.js')(app); // load our routes and pass in our app

// errorhandling
require('./app/shared/errorhandling.js')(app);

// export so bin/www can launch ================================================
module.exports = {app: app, server: server};
