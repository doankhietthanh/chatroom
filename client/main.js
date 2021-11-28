const $ = document.querySelector.bind(document);

const username = prompt("Name:");
const socket = io("", { query: "name=" + username });

const text = $("#text");
const btn_send = $("#send");
const list = $("#chat-box");
const members = $("#members div");

const renderMessage = (type, message) => {
  if (type == "my") {
    let el = document.createElement("div");
    el.setAttribute("class", "message my-message");
    el.innerHTML = `
				<div>
					<div class="name">You</div>
					<div class="text">${message.text}</div>
				</div>
			`;
    list.appendChild(el);
  } else if (type == "other") {
    let el = document.createElement("div");
    el.setAttribute("class", "message other-message");
    el.innerHTML = `
				<div>
					<div class="name">${message.username}</div>
					<div class="text">${message.text}</div>
				</div>
			`;
    list.appendChild(el);
  }
};

const renderMembers = (membersList) => {
  let html = "";
  membersList.forEach((member) => {
    html += `<div>${member}</div>`;
  });
  members.innerHTML = html;
};

btn_send.addEventListener("click", (e) => {
  e.preventDefault();
  renderMessage("my", { username: username, text: text.value });
  socket.emit("chat", { username: username, text: text.value });
  text.value = "";
});

socket.on("chat", (message) => {
  renderMessage("other", message);
});

socket.on("members", (members) => {
  renderMembers(members);
});
