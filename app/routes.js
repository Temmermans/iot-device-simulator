module.exports = function(app) {
  app.get("/", function(req, res) {
     res.render("pages/index");
  });

  app.get('/:name', function(req, res, next){
    res.send('Hi ' + req.params.name);
  });

  //resource routes
  // app.get('/resource', require('../views/pages/resource/index').find);

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
      res.status(err.status || 500);
      res.render('pages/error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error', {
      message: err.message,
      error: {}
    });
  });
};
