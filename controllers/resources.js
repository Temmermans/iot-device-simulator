//create a controller file for every model. A good convention is to pluralize it
//the controller has everything to do with routing relative to the resourece

// var express = require('express'),
//     router = express.Router(),
//     City = require('../models/resource');
//
// router.get('/cities', function(req, res){
//   City.all(function(err, rows) {
//     if (err !== null) {
//       next(err);
//     } else {
//       res.send(rows);
//     }
//   });
// });
//
// router.post('/cities', jsonEncode, function(req, res, next) {
//   City.create(req.body.name, req.body.desc, function(err) {
//     if (err !== null) {
//       next(err);
//     }
//   });
// });
// 
// module.exports = router;
