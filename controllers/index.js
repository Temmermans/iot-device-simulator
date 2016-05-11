//the index.js file requires all other controllers plus defines some general routes that are not linked to a resource, like the home routes

var express = require('express'),
   router = express.Router(),
   City = require('../models/resource');

//optional if you want a prefix in youre routes
//router.use('/API', require('./cities'));

router.get("/", function(req, res) {
   res.render("index");
});

module.exports = router;
