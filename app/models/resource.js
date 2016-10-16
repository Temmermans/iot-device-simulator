//here goes everything that interacts with the database, starting by creating or requiring the db
var mongo = require('mongodb');
var mongoose = require('mongoose');
var mongoUrl = require('../lib/config').credentials.mongodb.url;

// set up our mongodb database
mongoose.connect(mongoUrl);
//set a variable to hold this connection
var db = mongoose.connection;

var nameSchema = mongoose.Schema({
  name: {type: String}
});

var Name = module.exports = mongoose.model('Name', nameSchema);
