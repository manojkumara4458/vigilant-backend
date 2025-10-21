import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  transports: ["websocket"], // optional but avoids long polling fallback
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server with id:", socket.id);
});

socket.on("incident-alert", (incident) => {
  console.log("Received new incident:", incident);
});

export default socket;
