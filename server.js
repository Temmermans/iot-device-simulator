var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var port = parseInt(process.env.PORT, 10) || 3000;

app.get("/", function(req, res) {
   res.redirect("/index.html");
});

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

console.log("Simple static server running at localhost using port: " + port);
app.listen(port);
