const io = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("taskAssigned", (data) => {
  console.log("Realtime Notification:", data);
});
