//the index.js file requires all other controllers plus defines some general routes that are not linked to a resource, like the home route

var express = require('express'),
   router = express.Router()

//optional if you want a prefix in youre routes
//router.use('/API', require('./resources'));

//require all other controllers with the desired prefix. In the controller itself the defined routes are
//added behind the prefix added in the below line of code where we mount the controller router in the main app router
router.use('/user', require('./resources'));

router.get("/", function(req, res) {
   res.render("pages/index");
})

module.exports = router;
