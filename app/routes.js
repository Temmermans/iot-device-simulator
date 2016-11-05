module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index");
    res.io.on('connection', function(socket) {
      socket.emit('home route');
    })
  });

  app.get('/:name', function(req, res, next){
    res.send('Hi ' + req.params.name);
  });

  //resource routes
  app.get('/users/names', require('./controllers/resources').find);

// Errorhandling ===============================================================

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
      if (err.status === 404) {
        res.status(404);
        res.render('404', {
          message: err.message,
          error: err
        });
      } else if (err.status === 500) {
        res.status(500);
        res.render('500', {
          message: err.message,
          error: err
        });
      } else {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      }
    });
   }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    if (err.status === 404) {
      res.status(404);
      res.render('404', {
        message: err.message,
        error: {}
      });
    } else if (err.status === 500) {
      res.status(500);
      res.render('500', {
        message: err.message,
        error: {}
      });
    } else {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    }
  });
};
