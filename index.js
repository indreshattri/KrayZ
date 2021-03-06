var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/game', function(req, res){
  res.sendFile(__dirname + '/game.html');
});

app.use(require('express').static('public'));

var count = 1;




io.on('connection', function(socket){


	socket.on('start', function(msg){
	  io.emit('start', count++);
	});

  	socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

	socket.on('mouse moved', function(angle){

	    io.emit('mouse moved', angle);
  });

	socket.on('key angle', function(angle){

	    io.emit('key angle', angle);
  });

	socket.on('mouse pressed', function(mouseFlag){
	    io.emit('mouse pressed', mouseFlag);
  });

		socket.on('key pressed', function(keyFlag){
		    io.emit('key pressed', keyFlag);
	  });

		socket.on('obstacle1', function(x,y,r,speedX,speedY){
		    io.emit('obstacle1', x,y,r,speedX,speedY);
	  });

		socket.on('obstacle2', function(x,y,r,speedX,speedY){
		    io.emit('obstacle2', x,y,r,speedX,speedY);
	  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
