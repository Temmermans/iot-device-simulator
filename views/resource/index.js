// all routes that are needed for the resource
var Name = require('../../app/models/resource');

exports.find = function(req, res, next) {
  // route handlers go here
  Name.find({}, function(err, docs) {
    if(err) throw err;

    res.render('../views/resource/resource', { names: docs })
  });
}
