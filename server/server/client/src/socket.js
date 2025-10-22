import { io } from "socket.io-client";

// Connect to your Render backend
const socket = io("https://vigilant-backend.onrender.com", {
  transports: ["websocket"], // ensures only websocket connection
});

// Connection established
socket.on("connect", () => {
  console.log("Connected with socket id:", socket.id);
});

// Listen for incident alerts
socket.on("incident-alert", (incident) => {
  console.log("Received incident:", incident);
  // You can handle state updates here or in your components
});

export default socket;
