var express = require('express');
var app = express();

//set Jade as default templating engine
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

//Serve the static content and require all the controllers
app.use(express.static('public'));
app.use(require('./controllers'));

app.listen(3000, function(){
  console.log("Server running at port 3000");
});
