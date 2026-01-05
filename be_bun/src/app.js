import { Hono } from "hono";
import userRouter from "#src/routers/user.router.js";
import conversationRouter from "#src/routers/conversation.router.js";
import { AppUrlPath } from "#src/common/const.common.js";
import { ResponseUtil } from "#src/utils/request.util.js";
const app = new Hono();

app.get(AppUrlPath.Healthz.BASE, (c) => {
  return c.json(ResponseUtil.success("health"));
});
app.route(AppUrlPath.Users.BASE, userRouter);
app.route(AppUrlPath.Conversations.BASE, conversationRouter);

export default app;
