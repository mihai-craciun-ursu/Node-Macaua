var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var listOfNames = [];
var listOfIds = [];

var connectCounter = 0;

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
  res.render('index');
});

app.use("", express.static(__dirname));

io.on('connection', function(socket){
  var specificName = "";
  if(listOfNames.length >= 4){
    socket.emit("redirect");
    socket.disconnect();
  }
  
  socket.on("name", function(nume){
    if(listOfNames.indexOf(nume) > -1){
      nume =  nume + (Math.floor(Math.random() * 900) + 100).toString();
    }
    specificName = nume;
    listOfNames[listOfNames.length] = nume;
    listOfIds[listOfIds.length] = socket.id;
    console.log(nume + " connected");
    io.emit('chat message', `<li><i>${specificName} has connected</i></li>`);
    io.emit('name', listOfNames);
    socket.emit("playerRank", listOfIds.length);
  });
  
  socket.on('disconnect', function() { 
    
    listOfNames.splice(listOfNames.indexOf(specificName), 1);
    listOfIds.splice(listOfIds.indexOf(socket.id),1);
    console.log(specificName + " has disconnected");
    io.emit('chat message', `<li><i>${specificName} has disconnected</i></li>`);
    io.emit('name', listOfNames);

  });
  
  socket.on('chat message', function(msg){
    if(msg == "/start"){
      if(socket.id == listOfIds[0])
        socket.emit('start-game', listOfIds.length);
    }else if(msg.startsWith("/card")){
        socket.emit('test', msg.substr(5));
    }
    else
      io.emit('chat message', `<li><b>${specificName}</b>: ${msg}</li>`);
  });

  socket.on("hands", function(hands){
    console.log(hands.upperhand);
    socket.broadcast.emit("hands",hands);
  });

  socket.on("start-cards-2", function(cards){
    socket.broadcast.emit("start-cards-2", cards);
  });


  socket.on("start-cards-3", function(cards){
    socket.broadcast.emit("start-cards-3", cards);
  });

  socket.on("start-cards-4", function(cards){  
    socket.broadcast.emit("start-cards-4", cards);
  });

  socket.on("card-put", function(card){
    socket.broadcast.emit("card-put", card);
  });
//
  socket.on("numberOfPlayersOnStart", function(number){
    socket.broadcast.emit("numberOfPlayersOnStart", number)
  });

  socket.on("next", function(playerRank){
    socket.broadcast.emit("next", playerRank)
  });

  //trebuie modificat
  socket.on("down-card", function(card){
    socket.broadcast.emit("down-card",card);
  });
  socket.on("lowerhand-put", function(card){
    socket.broadcast.emit("upperhand-put",card);
  });
//

  socket.on("render",function(){
    socket.broadcast.emit("render");
  })
  socket.on("draw-card", function(card){
    socket.broadcast.emit("draw-card", card);
  });
  socket.on("limita", function(){
    socket.broadcast.emit("limita");
  })

  
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
