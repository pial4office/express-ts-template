import { WebSocketServer, WebSocket, RawData } from "ws";
import { ServerConfig } from "../config";
import http from "http";

let wsConnection: WebSocket;

export function websocket() {
  const server = new WebSocketServer({ port: ServerConfig.wsPort });
  const customServer = new WebSocketServer({
    server: getCustomServer(),
  });

  server.on("listening", () => {
    console.info("Listening websocket server on PORT: ", ServerConfig.wsPort);
  });
  customServer.on("listening", () => {
    console.info(
      "Listening custom websocket server on PORT: ",
      ServerConfig.wsPort2
    );
  });
  server.on("connection", handleWebSocketConnection);
}

function getCustomServer() {
  const httpServer = http.createServer();
  httpServer.on("upgrade", (_req, socket, _head) => {
    socket.destroy();
  });

  httpServer.listen(ServerConfig.wsPort2);
  return httpServer;
}

function handleWebSocketConnection(connection: WebSocket) {
  console.log("Connected", Date());
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
