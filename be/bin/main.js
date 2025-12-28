import "dotenv/config";
import app from "#src/app.js";

import { createClient } from "redis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createServer } from "http";
import { mongoConnect } from "#src/data/mongo.connect.js";
import { handleSocket } from "#src/socket.js";

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

(async function () {
  try {
    await Promise.all([pubClient.connect(), subClient.connect()]);
    await mongoConnect.init();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      /* options */
      adapter: createAdapter(pubClient, subClient),
      // path: process.env.SOCKET_PATH,
    });

    await handleSocket(io);

    httpServer.listen(3000);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoConnect.close();
  }
})();
