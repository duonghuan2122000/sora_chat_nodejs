import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";

import { mongoConnect } from "#src/data/mongo.connect.js";
import app from "#src/app.js";
import { handleSocket } from "#src/socket.js";

await mongoConnect.init();

const io = new Server({
  path: process.env.SOCKET_PATH,
});
const engine = new Engine();

io.bind(engine);

await handleSocket(io);

app.all("/socket.io/", (c) => {
  const request = c.req.raw;
  const server = c.env;
  return engine.handleRequest(request, server);
});

export default {
  port: process.env.PORT || 3000,
  idleTimeout: parseInt(process.env.IDLE_TIMEOUT) || 30, // must be greater than the "pingInterval" option of the engine, which defaults to 25 seconds
  ...engine.handler(),
  fetch: app.fetch,
};
