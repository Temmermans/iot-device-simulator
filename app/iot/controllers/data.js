var Data = require('../models/data');

exports.all = function(req, res) {
  Data.find({}, function(err, docs) {
    if(err) throw err;
    res.json(docs);
  });  
}

exports.write = function(req, res, next) {
    
    req.body.forEach(function(r, i){
        
      const newData = new Data({
          ESP_OPS:          req.body[i]['ESP_OPS'],
          attributeName:    req.body[i]['attributeName'],
          categories:       req.body[i]['categories'] || [''],
          dataType:         req.body[i]['dataType'],
          deviceName:       req.body[i]['deviceName'],
          timestamp:        req.body[i]['timestamp'],
          value:            req.body[i]['value'],
          fixedValue:       req.body[i]['fixedValue'] || '',
          min:              req.body[i]['min'] || '',
          max:              req.body[i]['max'] || ''
      });
        
      newData.save(function(err) {
        if(err) throw err;
        res.end("Post succesfull");
      }); 
    })
}

exports.delete = function(req, res, next) {
    
  Data.find({}).remove(function(err) {
      if (err) throw err; 
      res.end('data deleted')
  });
    
}