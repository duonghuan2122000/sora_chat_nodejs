import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";

import { mongoConnect } from "#src/data/mongo.connect.js";
import app from "#src/app.js";
import { handleSocket } from "#src/socket.js";

await mongoConnect.init();

const io = new Server();
const engine = new Engine();

io.bind(engine);

await handleSocket(io);

const { websocket } = engine.handler();

export default {
  port: process.env.PORT || 3000,
  idleTimeout: parseInt(process.env.IDLE_TIMEOUT) || 30, // must be greater than the "pingInterval" option of the engine, which defaults to 25 seconds

  fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/socket.io/") {
      return engine.handleRequest(req, server);
    } else {
      return app.fetch(req, server);
    }
  },

  websocket,
};
