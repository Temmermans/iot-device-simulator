//here goes everything that interacts with the database, starting by creating or requiring the db

////////// CREATE ////////////////
// var fs = require('fs');
// var file = 'cities.db';
// var exists = fs.existsSync(file);
//
// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('cities.db');

////////// REQUIRE ////////////////
// var db = require(../nameofdatabase.db)

//Create a new city in the Database
// exports.create = function(name, desc, cb) {
//   var city = {
//     name: name,
//     description: desc,
//   };
//
//   db.run("INSERT INTO cities (name, description) VALUES ('" + city.name + "', '" + city.description + "')", cb);
// };


//create all functions and export them, for example return everything from a table
// exports.all = function(cb) {
//     db.get("SELECT * FROM cities", cb);
// };
