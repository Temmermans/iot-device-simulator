var express = require('express');
var enforceSSL = require('express-enforces-ssl');
var helmet = require('helmet');
var ms = require('ms');
var csrf = require('csurf');
var app = express();

//Make sure all requests use HTTPS instead of HTTP. We need to enbale the trust proxy
//because when deploying to Heroku, Heroku is between the server and the client. So we need to let out app now about this.
//we use helmet to keep them on HTTPS and not go back to HTTP


// app.enable('trust proxy');
// app.use(enforceSSL());
//
// app.use(helmet.hsts({
//   maxAge: ms('1 year'),
//   includeSubdomains: true
// }));

//Protect against reflected XSS
app.use(helmet.xssFilter());

//Protect against cross forgery attacks by using the csurf module. This will add a .csrfToken to the req body
//If the request is something other than a GET we can look to a parameter _csrf to validate the request.
//This can be done in the following way:
//
// app.get("/", function(req, res) {
//   res.render("myview", {
//     csrfToken: req.csrfToken()
//   });
// });
//
// And in the view:
//
// <form method="post" action="/submit">
//   <input name="_csrf" value="<%= csrfToken %>" type="hidden">
//   <! -- ... -->
// </form>
//
//The rest will be handled by csurf. It is not required but it is best to have some kind of handler for failed CSRF requests catching the CSRF error.
//
// app.use(function(err, req, res, next) {
//   if (err.code !== "EBADCSRFTOKEN") {
//     next(err);
//     return;
//   }
//   res.status(403);
//   res.send("CSRF error.");
// });
// app.use(csrf());

//disable the header so its not immediatly clear that this is an express application
app.disable("x-powered-by");

//prevent clickjacking
app.use(helmet.frameguard("sameorigin"));

//keeping adobe products out of the site (like flash)
app.use(helmet.noSniff());

module.exports = app;
