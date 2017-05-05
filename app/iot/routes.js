module.exports = function (app) {

    app.get('/simulator', function (req, res) {
        res.render('iot/simulator');
    });
    
    // route to display all the data that is generated
    app.get('/simulator/data', require('./controllers/data').all);
    
    // route to write data to the database
    app.post('/simulator/data', require('./controllers/data').write);
    
    // delete the data when the stream is stopped or when the app is closed
    app.get('/simulator/data/delete', require('./controllers/data').delete);

}