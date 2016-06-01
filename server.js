var express = require('express');
var logger = require('morgan');
var app = express();

//set Jade as default templating engine
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

//Serve the static content and require all the controllers
app.use(logger('dev'));
//uncomment when bodyparser works
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(require('./controllers'));


//////////// ERROR HANDLING ////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// export the app as a node module so the logic is encapsulated
module.exports = app;
