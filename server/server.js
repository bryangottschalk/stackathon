const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'client')));

const state = {
  score: {
    player1: 0,
    player2: 0,
  },
  scoreText: {
    player1: null,
  },
  playerOneState: {
    direction: null,
  },
  playerTwoState: {
    direction: null,
  },
  ball: {},
};

io.on('connection', socket => {
  // handle messages from any client
  console.log('Someone connected', socket.id);
  socket.emit('message', 'Welcome from the server!'); // emits to one person
  // socket.emit('state', state);
  socket.on('message', text => {
    //handle messages from single client
    io.emit('message', text); // send chat message to everyone that is connected, included client itself
    // if we did socket.emit it would send the message to a particular client
  });

  socket.on('dir', dir => {
    console.log(dir);
    state.playerOneState.direction = dir;
    // io.emit(state)
    // io.emit('p1direction', dir);
  });
  socket.on('scored', addToScore => {
    state.score.player1++;
    console.log('scored');
    console.log('state.score.player1', state.score.player1);
  });
});

// io.on('scored', socket => {

// })

setInterval(() => {
  io.emit('state', state);
}, 100);

server.on('error', err => {
  console.error('Server error:', err);
});

server.listen(8081, function() {
  // Listens to port 8081
  console.log('Listening on ' + server.address().port);
});

// will need a timer to send the state to clients
// will need to run physics of ball on the server side
// can you run phaser on the server?
