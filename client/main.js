const $ = document.querySelector.bind(document);

let username = "";
while (username == "" || username == null) {
  username = prompt("Name:");
}
const socket = io("", { query: "name=" + username });

const text = $("#text");
const btn_send = $("#send");
const list = $("#chat-message");
const members = $("#members ul");
const fileInput = $("#imgUpload");
const btn_file = $("#sendImg");

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

btn_file.addEventListener("click", (e) => {
  e.preventDefault();
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  getBase64(fileInput.files[0]).then((dataImg) => {
    renderMessage("my", { username: username, data: dataImg, type: "img" });
    socket.emit("chat", { username: username, data: dataImg, type: "img" });
  });
});

const renderMessage = (type, message) => {
  const date = new Date();
  const time = date.getHours() + ":" + date.getMinutes();

  const content =
    message.type == "text"
      ? `<div class="text">${message.data}</div>`
      : `<div class="text"><img class="text_img" src="${message.data}"/></div>`;
  if (type == "my") {
    let el = document.createElement("div");
    el.setAttribute("class", "message my-message");

    el.innerHTML = `
				<div>
					<div class="name">You ${time}</div>
          ${content}
				</div>
			`;
    list.appendChild(el);
  } else if (type == "other") {
    let el = document.createElement("div");
    el.setAttribute("class", "message other-message");
    el.innerHTML = `
				<div>
					<div class="name">${message.username} ${time}</div>
          ${content}
				</div>
			`;
    list.appendChild(el);
  }
  list.scrollTo(0, list.scrollHeight);
};
const randomColor = (member) => {
  let seed = 0;
  [...member].forEach((v, i) => {
    seed += member.charCodeAt(i);
  });
  return (
    "#" +
    Math.floor(Math.abs(Math.sin(seed) * 16777215) % 16777215).toString(16)
  );
};
const renderMembers = (membersList) => {
  let html = "";
  membersList.forEach((member) => {
    const ch = member.charAt(0).toUpperCase();
    html += `
    <li>
      <div class="avatar" style="background-color: ${randomColor(member)}">
        <div class="f-name">${ch}</div>
        <div class="active"></div>
      </div>
      <div class="name">${member}</div>
    </li>
    `;
  });
  members.innerHTML = html;
};

btn_send.addEventListener("click", (e) => {
  e.preventDefault();
  if (text.value == "") return;
  renderMessage("my", { username: username, data: text.value, type: "text" });
  socket.emit("chat", { username: username, data: text.value, type: "text" });
  text.value = "";
});

socket.on("chat", (message) => {
  renderMessage("other", message);
});

socket.on("members", (members) => {
  renderMembers(members);
});
