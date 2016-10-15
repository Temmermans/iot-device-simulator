// Initialize socket.io so it is ready to start sending messages
var socket = io.connect(window.location.origin , {transports:['websocket']} );
