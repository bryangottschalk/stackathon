// we get access to this file from the io object which is wrapped around the server
// sends as a string the code for the client side connection
const socket = io();

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
