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
  playerOneState: {
    direction: null,
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

io.on('connection', socket => {
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
    //reset score when lobby is empty
    state.playerCount === 0 ? state.score = {
      player1: 0,
      player2: 0
    }
    console.log('new num players:', state.playerCount);
  });

  // handle messages from any client
  socket.emit('message', 'Welcome from the server!'); // emits to one person
  // socket.emit('state', state);
  socket.on('message', text => {
    //handle messages from single client
    io.emit('message', text); // send chat message to everyone that is connected, included client itself
    // if we did socket.emit it would send the message to a particular client
  });

  socket.on('dir', (dir, isFirstPlayer) => {
    if (isFirstPlayer) {
      state.playerOneState.direction = dir;
    } else {
      state.playerTwoState.direction = dir;
    }
  });
  socket.on('p1scored', () => {
    state.score.player1++;
  });
  socket.on('p2scored', () => {
    state.score.player2++;
  });
  socket.on('ballMoved', (ballX, ballY) => {
    state.ball.x = ballX;
    state.ball.y = ballY;
  });
});

setInterval(() => {
  io.emit('state', state);
}, 10);

server.on('error', err => {
  console.error('Server error:', err);
});

server.listen(process.env.PORT || 3000, function() {
  // Listens to port 3000
  console.log('Listening on ' + server.address().port);
});
