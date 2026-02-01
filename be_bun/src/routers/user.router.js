import {
  AppUrlPath,
  HttpStatusCode,
  SearchUserErrorInfo,
  RegisterErrorInfo,
  CreateUserErrorInfo,
} from "#src/common/const.common";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import {
  loginValidationSchema,
  searchUserValidationSchema,
  registerValidationSchema,
} from "#src/validations/user.validation.js";
import { ResponseUtil } from "#src/utils/request.util";
import { addTime, getCurrentTime } from "#src/utils/common.util";
import { userService } from "#src/services/user.service";

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
          CreateUserErrorInfo.Message.BAD_REQUEST,
        ),
      );
    }
    return parsed.data;
  }),
  async (c) => {
    let { body } = c.req.valid("json");
    let user = await userService.createUser(body);
    return res.status(HttpStatusCode.OK).json(ResponseUtil.success(user));
  },
);

// POST /users/register
app.post(
  AppUrlPath.Users.REGISTER,
  validator("json", (value, c) => {
    const parsed = registerValidationSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        ResponseUtil.error(
          RegisterErrorInfo.Code.BAD_REQUEST,
          RegisterErrorInfo.Message.BAD_REQUEST,
        ),
      );
    }
    return parsed.data;
  }),
  async (c) => {
    let body = c.req.valid("json");
    let result = await userService.registerUser(body);
    return c.json(result);
  },
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
          LoginErrorInfo.Message.BAD_REQUEST,
        ),
      );
    }
    return parsed.data;
  }),
  async (c) => {
    let body = c.req.valid("json");
    let result = await userService.login(body);
    if (result?.success) {
      // Access token cookie
      setCookie(c, "x_sora_access_token", result?.data?.token, {
        path: "/",
        httpOnly: true,
        expires: addTime(getCurrentTime(), result?.data?.expires_in),
        sameSite: "Strict",
      });
      // Refresh token cookie
      setCookie(c, "x_sora_refresh_token", result?.data?.refresh_token, {
        path: "/",
        httpOnly: true,
        expires: addTime(getCurrentTime(), result?.data?.refresh_expires_in),
        sameSite: "Strict",
      });
    }
    return c.json(result);
  },
);

// POST /users/refresh-token
app.post(AppUrlPath.Users.REFRESH_TOKEN, async (c) => {
  let refreshToken = getCookie(c, "x_sora_refresh_token");
  if (!refreshToken) {
    c.status(HttpStatusCode.UNAUTHORIZED);
    return c.json(
      ResponseUtil.error(
        HttpStatusCode.UNAUTHORIZED,
        "Refresh token not found",
      ),
    );
  }

  let result = await userService.refreshToken(refreshToken);
  if (result.success) {
    // Cập nhật lại cookie
    setCookie(c, "x_sora_access_token", result?.data?.token, {
      path: "/",
      httpOnly: true,
      expires: addTime(getCurrentTime(), result?.data?.expires_in),
      sameSite: "Strict",
    });
    setCookie(c, "x_sora_refresh_token", result?.data?.refresh_token, {
      path: "/",
      httpOnly: true,
      expires: addTime(getCurrentTime(), result?.data?.refresh_expires_in),
      sameSite: "Strict",
    });
  } else {
    // Nếu refresh thất bại (hết hạn), xóa cookie
    deleteCookie(c, "x_sora_access_token", { path: "/" });
    deleteCookie(c, "x_sora_refresh_token", { path: "/" });
    c.status(HttpStatusCode.UNAUTHORIZED);
  }

  return c.json(result);
});

// POST /users/search
app.post(
  AppUrlPath.Users.SEARCH,
  validator("json", (value, c) => {
    const parsed = searchUserValidationSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        ResponseUtil.error(
          SearchUserErrorInfo.Code.BAD_REQUEST,
          SearchUserErrorInfo.Message.BAD_REQUEST,
        ),
      );
    }
    return parsed.data;
  }),
  async (c) => {
    let body = c.req.valid("json");
    return c.json(ResponseUtil.success(await userService.searchUser(body)));
  },
);

// GET /users/me
app.get(AppUrlPath.Users.ME, async (c) => {
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
  return c.json(ResponseUtil.success(await userService.getCurUser(token)));
});

// POST /users/logout
app.post(AppUrlPath.Users.LOGOUT, async (c) => {
  let refreshToken = getCookie(c, "x_sora_refresh_token");
  await userService.logout(refreshToken);

  deleteCookie(c, "x_sora_access_token", {
    path: "/",
  });
  deleteCookie(c, "x_sora_refresh_token", {
    path: "/",
  });
  return c.json(ResponseUtil.success(null));
});

export default app;
