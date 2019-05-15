
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var app = express();






io.on('connection', function(socket){
  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on("name", function(nume){
    console.log(nume + " connected");
  });
  socket.on('ceva', function(card){
    console.log("ceva ffs");
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
