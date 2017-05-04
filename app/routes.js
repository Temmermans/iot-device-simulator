module.exports = function(app) {
    
    // ===== IOT SERVICES     ==== //
    require('./iot/routes.js')(app);
    
};
