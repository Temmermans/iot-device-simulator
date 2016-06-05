var express = require('express');
var enforceSSL = require('express-enforces-ssl');
var helmet = require('helmet');
var ms = require('ms');
var app = express();

//Make sure all requests use HTTPS instead of HTTP. We need to enbale the trust proxy
//because when deploying to Heroku, Heroku is between the server and the client. So we need to let out app now about this.
//we use helmet to keep them on HTTPS and not go back to HTTP
app.enable('trust proxy');
app.use(enforceSSL());

app.use(helmet.hsts({
  maxAge: ms('1 year'),
  includeSubdomains: true
}));

module.exports = app;
