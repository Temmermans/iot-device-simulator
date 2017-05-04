module.exports = function (app) {

    app.get('/subdomain/iot/simulator', function (req, res) {
        res.render('iot/simulator');
    });

}