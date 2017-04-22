module.exports = function(router) {
    
  router.get("/home", function(req, res) {
    res.json([
        { name: "Brian" }
    ]);
  });

};
