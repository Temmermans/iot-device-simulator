module.exports = function (app) {

    app.get('/simulator', function (req, res) {
        res.render('iot/simulator');
    });

}