//the index.js file requires all other controllers plus defines some general routes that are not linked to a resource, like the home route

var express = require('express'),
   router = express.Router()

//optional if you want a prefix in youre routes
//router.use('/API', require('./resources'));

//require all other controllers
// router.use('/resources', require('./resources'));

router.get("/", function(req, res) {
   res.render("index");
})

module.exports = router;
