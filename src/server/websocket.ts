import { WebSocketServer, WebSocket, RawData } from "ws";
import { ServerConfig } from "../config";

let wsConnection: WebSocket;

export function websocket() {
  const server = new WebSocketServer({ port: ServerConfig.wsPort });

  server.on("listening", () => {
    console.info("Listening websocket server on PORT: ", ServerConfig.wsPort);
  });
  server.on("connection", handleWebSocketConnection);
}

function handleWebSocketConnection(connection: WebSocket) {
  wsConnection = connection;
  connection.on("message", handleWebSocketMessage);
}

function handleWebSocketMessage(message: RawData) {
  console.info(
    new Date().toLocaleTimeString(),
    "Received:",
    message.toString()
  );
  sendWebSocketMessage(message.toString());
}

function sendWebSocketMessage(message: string) {
  wsConnection.send(message);
  console.info(new Date().toLocaleTimeString(), "Sent:", message);
}
