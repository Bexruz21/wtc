const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

wss.on("connection", (ws, req) => {
  console.log("New client connected:", req.socket.remoteAddress);

  ws.on("message", (message) => {
    try {
      const mstr = message.toString();
      console.log("recv:", mstr.substring(0, 120).replace(/\n/g, "\\n"));
    } catch (e) { /* ignore */ }

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (err) => {
    console.error("WS error:", err);
  });
});

console.log(`✅ Signaling server running on ws://0.0.0.0:${PORT}`);
