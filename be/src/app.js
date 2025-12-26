import express from "express";
import { ResponseUtil } from "#src/utils/request.util.js";
import { AppUrlPath, HttpStatusCode } from "#src/common/const.common.js";
import userRouter from "#src/routers/user.router.js";
import conversationRouter from "#src/routers/conversation.router.js";

const app = express();

app.use(express.json());

app.get(AppUrlPath.Healthz.BASE, (_, res) => {
  res.status(HttpStatusCode.OK).json(ResponseUtil.success("OK"));
});

app.use(AppUrlPath.Users.BASE, userRouter);
app.use(AppUrlPath.Conversations.BASE, conversationRouter);

export default app;
