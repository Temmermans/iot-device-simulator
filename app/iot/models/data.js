//here goes everything that interacts with the database, starting by creating or requiring the db
var mongo = require('mongodb');
var mongoose = require('mongoose');
var mongoUrl = require('../../shared/config').credentials.mongodb.url;

// set up our mongodb database
mongoose.connect(mongoUrl);

//set a variable to hold this connection
var db = mongoose.connection;

var dataSchema = mongoose.Schema({
  ESP_OPS: {type: String},
  attributeName: {type: String},
  categories: [String],
  dataType: {type: String},
  deviceName: {type: String},
  timestamp: {type: String},
  value: {type: String},
  fixedValue: {type: String},
  min: {type: String},
  max: {type: String}
});

var Data = module.exports = mongoose.model('Data', dataSchema);