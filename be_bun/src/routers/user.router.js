import { AppUrlPath } from "#src/common/const.common";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { getCookie } from "hono/cookie";
import {
  createUserValidationSchema,
  loginValidationSchema,
  searchUserValidationSchema,
} from "#src/validations/user.validation.js";
import { ResponseUtil } from "#src/utils/request.util";

const app = new Hono();

// POST /users
app.post(
  AppUrlPath.Users.CREATE,
  validator("json", (value, c) => {
    const parsed = createUserValidationSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        ResponseUtil.error(
          CreateUserErrorInfo.Code.BAD_REQUEST,
          CreateUserErrorInfo.Message.BAD_REQUEST
        )
      );
    }
    return parsed.data;
  }),
  async (c) => {
    let { body } = c.req.valid("json");
    let user = await userService.createUser(body);
    return res.status(HttpStatusCode.OK).json(ResponseUtil.success(user));
  }
);

// POST /users/login
app.post(
  AppUrlPath.Users.LOGIN,
  validator("json", (value, c) => {
    const parsed = loginValidationSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        ResponseUtil.error(
          LoginErrorInfo.Code.BAD_REQUEST,
          LoginErrorInfo.Message.BAD_REQUEST
        )
      );
    }
    return parsed.data;
  }),
  async (c) => {
    let { body } = c.req.valid("json");
    return res.status(HttpStatusCode.OK).json(await userService.login(body));
  }
);

// POST /users/search
app.post(
  AppUrlPath.Users.SEARCH,
  validator("json", (value, c) => {
    const parsed = searchUserValidationSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        ResponseUtil.error(
          SearchUserErrorInfo.Code.BAD_REQUEST,
          SearchUserErrorInfo.Message.BAD_REQUEST
        )
      );
    }
    return parsed.data;
  }),
  async (c) => {
    let { body } = c.req.valid("json");
    return res
      .status(HttpStatusCode.OK)
      .json(ResponseUtil.success(await userService.searchUser(body)));
  }
);

// GET /users/me
app.get(AppUrlPath.Users.ME, async (c) => {
  let token = getCookie(c, "x_sora_access_token");
  if (!token) {
    token = c.req.header("Authorization")?.replace("Bearer ", "");
  }
  if (!token) {
    return c.json(
      ResponseUtil.error(
        HttpStatusCode.UNAUTHORIZED,
        HttpStatusCode.UNAUTHORIZED
      )
    );
  }
  return c.json(ResponseUtil.success(await userService.getCurUser(token)));
});

export default app;
