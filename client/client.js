// we get access to this file from the io object which is wrapped around the server
// sends as a string the code for the client side connection
const socket = io();

// event listener to receive events from the server
// pass in the emitted message you want to receive from the server
const clientGame = document.getElementById('phaser-game');

// const p1direction = playerOneState.direction;

// socket.on('p1direction', direction => {
//   direction = playerOneState.direction;
//   console.log('direction', direction);
// });

// socket.on('p2direction', direction => {});

socket.on('message', text => {
  //listens for message from server
  const parent = document.getElementById('events');
  const el = document.createElement('li');
  el.innerHTML = text;
  parent.appendChild(el);
});

const chatSubmitted = e => {
  e.preventDefault(); // don't need to submit and reload the page --> we will handle the data ourselves
  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';
  socket.emit('message', text); //send message to server with payload of string text
};

document.querySelector('#chat-form').addEventListener('submit', chatSubmitted);

// const sendDirection = e => {};

// document.addEventListener('keydown', sendDirection);

//GOAL # 1
// send direction to server for keypresses
// log out that info on server
