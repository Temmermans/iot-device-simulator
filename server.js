var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

//set Pug as default templating engine
app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');

//the default store is not for production usage. Install a store compatible with the db you are using from: https://github.com/expressjs/session#compatible-session-stores
//this is also a dependency of csurf
// app.use(session({
//   secret: "@lHJr+JrSwv1W&J904@W%nmWf++K99pRBvk&wBaNAs4JTid1Ji",
//   resave: false,
//   saveUninitialized: true
// }));

// use domains for better error handling
app.use(function(req, res, next){
    // create a domain for this request
    var domain = require('domain').create();
    // handle errors on this domain
    domain.on('error', function(err){
        console.error('DOMAIN ERROR CAUGHT\n', err.stack);
        try {
            // failsafe shutdown in 5 seconds
            setTimeout(function(){
                console.error('Failsafe shutdown.');
                process.exit(1);
            }, 5000);

            // disconnect from the cluster
            var worker = require('cluster').worker;
            if(worker) worker.disconnect();

            // stop taking new requests
            server.close();

            try {
                // attempt to use Express error route
                next(err);
            } catch(error){
                // if Express error route failed, try
                // plain Node response
                console.error('Express error mechanism failed.\n', error.stack);
                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain');
                res.end('Server error.');
            }
        } catch(error){
            console.error('Unable to send 500 response.\n', error.stack);
        }
    });

    // add the request and response objects to the domain
    domain.add(req);
    domain.add(res);

    // execute the rest of the request chain in the domain
    domain.run(next);
});

app.use(express.static(__dirname + '/public'))

//log all the requests
app.use(logger('dev'))

//set the body object on every request. Can also be done on every request individually (when not all routes need the bodyparser)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//setup security
app.use(require('./security/security-setup'))
//require all the controllers
app.use(require('./controllers/index'))
//errorhandling middleware
app.use(require('./controllers/errorhandling'))

// export the app as a node module so the logic is encapsulated
module.exports = app;
