var express = require('express');
var logger = require('morgan');
var app = express();

//set Jade as default templating engine
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

//setup security
app.use(require('./security/security-setup'));

//Serve the static content and require all the controllers
app.use(logger('dev'));
//uncomment when bodyparser works
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(require('./controllers'));

//errorhandling middleware
app.use(require('./controllers/errorhandling'));

// export the app as a node module so the logic is encapsulated
module.exports = app;
