import { CurrentUserKey, HttpStatusCode } from "#src/common/const.common";
import { decodeJwt } from "#src/utils/common.util";
import { ResponseUtil } from "#src/utils/request.util";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(async (c, next) => {
  let token = getCookie(c, "x_sora_access_token");
  if (!token) {
    token = c.req.header("Authorization")?.replace("Bearer ", "");
  }
  if (!token) {
    c.status(HttpStatusCode.UNAUTHORIZED);
    return c.json(
      ResponseUtil.error(
        HttpStatusCode.UNAUTHORIZED,
        HttpStatusCode.UNAUTHORIZED,
      ),
    );
  }

  try {
    let payload = await decodeJwt(token);
    c.set(CurrentUserKey, payload);
    return await next();
  } catch (error) {
    c.status(HttpStatusCode.UNAUTHORIZED);
    return c.json(
      ResponseUtil.error(
        HttpStatusCode.UNAUTHORIZED,
        HttpStatusCode.UNAUTHORIZED,
      ),
    );
  }
});
