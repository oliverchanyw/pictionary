var app = require('http').createServer(require('./expressApp.js'));
var io = require('socket.io').listen(app, { log: false });
var fs = require('fs');

app.listen(process.env.PORT || 8080);
console.log('>>> Pictionary started at port ' + (process.env.PORT || 8080) + ' >>>');

// ================================================
//                                app logic section
// ================================================

// TODO: MONGO
var users = [], canvas = [];
var dictionary, currentWord, currentPlayer, drawingTimer;

// load dictionary.txt into memory
fs.readFile(__dirname + '/dictionary.txt', function (err, data) {
  dictionary = data.toString('utf-8').split('\r\n');
});

io.sockets.on('connection', function (socket) {

  // Ask for personal details to connect
  socket.emit('whoru');

  // Recieve personal details before connecting proper
  socket.on('whoami', function (deets) {
    var myNick = deets.nick,
  		myColor = rndColor();
  		myScore = 0;

  	// TODO: MONGO
  	users.push({ id: socket.id, nick: myNick, color: myColor, score: myScore });

  	io.sockets.emit('userJoined', { nick: myNick, color: myColor });
  	io.sockets.emit('users', users);
  	socket.emit('drawCanvas', canvas);

    // notify if someone is drawing
  	if(currentPlayer) {
  		for(var i = 0; i<users.length; i++) {
  			if(users[i].id == currentPlayer) {
  				socket.emit('friendDraw', { color: users[i].color, nick: users[i].nick });
  				break;
  			}
  		}
  	}
  });

	// =============
	// chat logic section
	// =============

	socket.on('message', function (msg) {
		if(!msg.text || msg.text.length>256) {
			return;
		}

		io.sockets.emit('message', { text: msg.text, color: myColor, nick: myNick });

		// check if current word was guessed
		if(currentPlayer != null && currentPlayer != socket.id) {
			if(msg.text.toLowerCase().trim() == currentWord) {
				io.sockets.emit('wordGuessed', { text: currentWord, color: myColor, nick: myNick });

				// add scores to guesser and drawer
				for(var i = 0; i<users.length; i++) {
					if(users[i].id == socket.id || users[i].id == currentPlayer) {
						users[i].score = users[i].score + 10;
					}
				}

				// comunicate new scores
				sortUsersByScore();
				io.sockets.emit('users', users);

				// turn off drawing timer
				clearTimeout(drawingTimer);
				drawingTimer = null;

				// allow new user to draw
				currentPlayer = null;
				io.sockets.emit('youCanDraw');
			}
		}
	});

	socket.on('nickChange', function (user) {
		if(!user.nick || myNick == user.nick || user.nick.length>32) {
			return;
		}

		io.sockets.emit('nickChange', { newNick: user.nick, oldNick: myNick, color: myColor });
		myNick = user.nick;

		for(var i = 0; i<users.length; i++) {
			if(users[i].id == socket.id) {
				users[i].nick = myNick;
				break;
			}
		}

		io.sockets.emit('users', users);
	});

	socket.on('disconnect', function () {
		io.sockets.emit('userLeft', { nick: myNick, color: myColor });
		for(var i = 0; i<users.length; i++) {
			if(users[i].id == socket.id) {
				users.splice(i,1);
				break;
			}
		}

		io.sockets.emit('users', users);

		if(currentPlayer == socket.id) {
			// turn off drawing timer
			clearTimeout(drawingTimer);
			turnFinished();
		}
	});

	socket.on('draw', function (line) {
		if(currentPlayer == socket.id) {
			canvas.push(line);
			socket.broadcast.emit('draw', line);
		}
	});

	socket.on('clearCanvas', function () {
		if(currentPlayer == socket.id) {
			canvas.splice(0, canvas.length);
			io.sockets.emit('clearCanvas');
		}
	});

	socket.on('changeNickColor', function() {
		myColor = rndColor();

		for(var i = 0; i<users.length; i++) {
			if(users[i].id == socket.id) {
				users[i].color = myColor;
				break;
			}
		}

		io.sockets.emit('users', users);
	});

	function rndColor() {
		var color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
		return color;
	}

	function sortUsersByScore() {
		users.sort(function(a,b) { return parseFloat(b.score) - parseFloat(a.score); } );
	}

	// =================
	// pictionary logic section
	// =================

	socket.on('readyToDraw', function () {
		if (!currentPlayer) {
			currentPlayer = socket.id;
			canvas.splice(0, canvas.length);
			io.sockets.emit('clearCanvas');

			var randomLine = Math.floor(Math.random() * dictionary.length),
				line = dictionary[randomLine],
				word = line.split(',');

			currentWord = word[0];
			socket.emit('youDraw', word);
			io.sockets.emit('friendDraw', { color: myColor, nick: myNick });

			// set the timer for 2 minutes (120000ms)
			drawingTimer = setTimeout( turnFinished, 120000 );
		} else if (currentPlayer == socket.id) {
			// turn off drawing timer
			clearTimeout(drawingTimer);
			turnFinished();
		}
	});

	function turnFinished() {
		drawingTimer = null;
		currentPlayer = null;
		io.sockets.emit('wordNotGuessed', { text: currentWord });
		io.sockets.emit('youCanDraw');
	}
});
