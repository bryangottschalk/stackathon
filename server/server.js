const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'client')));

/* set up for individual */
const players = [];

const state = {
  score: {
    player1: 0,
    player2: 0,
  },
  playerOneState: {
    direction: null,
    connected: false,
  },
  playerTwoState: {
    direction: null,
  },
  playerIds: [],
  playerCount: 0,
  ball: {
    x: 0,
    y: 0,
  },
};

// function Player(id, x, y) {
//   this.id = id;
//   this.x = x;
//   this.y = y;
// }

io.on('connection', socket => {
  // socket.on('start', data => {
  //   //make a new player --> client sends in its x and y position
  //   console.log(`id: ${socket.id} x: ${data.x} y: ${data.y}`);

  //   const player = new Player(socket.id, data.x, data.y);
  //   players.push(player);
  // });
  console.log('Someone connected', socket.id);

  if (!state.playerIds.includes(socket.id)) {
    state.playerIds.push(socket.id);
    state.playerCount++;
    console.log('new num players', state.playerCount);
  }
  socket.on('disconnect', () => {
    console.log('a player disconnected');
    const i = state.playerIds.indexOf(socket.id);
    state.playerIds.splice(i, 1);
    state.playerCount--;
    console.log('new num players', state.playerCount);
  });

  // handle messages from any client
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
  socket.on('scored', () => {
    state.score.player1++;
  });
  socket.on('ballMoved', (ballX, ballY) => {
    state.ball.x = ballX;
    state.ball.y = ballY;
    console.log('x:', state.ball.x);
    console.log('y:', state.ball.y);
    // console.log('x:', ballX, 'y:', ballY);
    // console.log('in ballmoved', coordinates);

    // state.ball.y = coordinates.y;
  });
});

// io.on('scored', socket => {

// })

setInterval(() => {
  io.emit('state', state);
}, 10);

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
