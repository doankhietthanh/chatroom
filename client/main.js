const socket = io();
const $ = document.querySelector.bind(document);

const text = $("#text");
const btn_send = $("#send");
const list = $("#chatbox ul");
const chatList = [];

const render = () => {
  let html = "";
  chatList.forEach((i) => {
    html += `<li>${i.text}</li>`;
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

  addText({ text: text.value });
  socket.emit("msg", { text: text.value });
});

socket.on("msg-end", (d) => {
  addText(d);
});
