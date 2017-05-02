module.exports = function (app) {

    app.get('/subdomain/api/', function (req, res) {
        res.send('Welcome to the API services of delaware insights! To use these services, you will need a key.');
    });

    app.get('/subdomain/api/services', function (req, res) {
        res.render('api/services');
    });

    app.post('/subdomain/api/predictive/influencers', function (req, res) {
        if (!req.body.data)
            res.json('No data provided to perform calculations');

        if (!req.header('dlw-insights-logontoken'))
            res.json('Acces Denied!');

        if (req.header('dlw-insights-logontoken') !== 'dlw-insights-secret')
            res.json('Wrong access token!')

        res.send('Influencers are calculating');

    });

}
