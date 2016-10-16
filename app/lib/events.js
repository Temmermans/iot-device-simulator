module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log("Web socket is listening");

    //listening for the disconnect event
    socket.on('disconnect', function() {
      console.log("Web socket closed");
    });
  });
}
