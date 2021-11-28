const socket = io();
const $ = document.querySelector.bind(document);

const username = prompt("Name:");

const text = $("#text");
const btn_send = $("#send");
const list = $("#chatbox ul");
const chatList = [];

const render = () => {
  let html = "";
  chatList.forEach((i) => {
    html += `<li>${i.username}: ${i.text}</li>`;
  });
  list.innerHTML = html;
};

render();
const addText = (text) => {
  chatList.push(text);
  render();
};

btn_send.addEventListener("click", (e) => {
  e.preventDefault();

  addText({ username: username, text: text.value });
  socket.emit("msg", { username: username, text: text.value });

  text.value = "";
});

socket.on("msg-end", (d) => {
  addText(d);
});
