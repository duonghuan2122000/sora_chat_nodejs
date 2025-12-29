import {
  AppUrlPath,
  CreateUserErrorInfo,
  HttpStatusCode,
  LoginErrorInfo,
  SearchUserErrorInfo,
} from "#src/common/const.common.js";
import { userService } from "#src/services/user.service.js";
import { ResponseUtil } from "#src/utils/request.util.js";
import {
  createUserValidationSchema,
  loginValidationSchema,
  searchUserValidationSchema,
} from "#src/validations/user.validation.js";
import express from "express";

const router = express.Router();

router.post(AppUrlPath.Users.CREATE, async (req, res) => {
  const resultParse = await createUserValidationSchema.safeParseAsync(req.body);
  if (!resultParse.success) {
    return res
      .status(HttpStatusCode.OK)
      .json(
        ResponseUtil.error(
          CreateUserErrorInfo.Code.BAD_REQUEST,
          CreateUserErrorInfo.Message.BAD_REQUEST
        )
      );
  }
  let user = await userService.createUser(resultParse.data);
  return res.status(HttpStatusCode.OK).json(ResponseUtil.success(user));
});

router.post(AppUrlPath.Users.LOGIN, async (req, res) => {
  const resultParse = await loginValidationSchema.safeParseAsync(req.body);
  if (!resultParse.success) {
    return res
      .status(HttpStatusCode.OK)
      .json(
        ResponseUtil.error(
          LoginErrorInfo.Code.BAD_REQUEST,
          LoginErrorInfo.Message.BAD_REQUEST
        )
      );
  }

  return res
    .status(HttpStatusCode.OK)
    .json(await userService.login(resultParse.data));
});

router.post(AppUrlPath.Users.SEARCH, async (req, res) => {
  const resultParse = await searchUserValidationSchema.safeParseAsync(req.body);
  if (!resultParse.success) {
    return res
      .status(HttpStatusCode.OK)
      .json(
        ResponseUtil.error(
          SearchUserErrorInfo.Code.BAD_REQUEST,
          SearchUserErrorInfo.Message.BAD_REQUEST
        )
      );
  }
  return res
    .status(HttpStatusCode.OK)
    .json(ResponseUtil.success(await userService.searchUser(req.body)));
});

router.get(AppUrlPath.Users.ME, async (req, res) => {
  let token = req.cookies?.x_sora_access_token;
  if (!token) {
    token = req.headers["authorization"]?.replace("Bearer ", "");
  }
  if (!token) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json(
        ResponseUtil.error(
          HttpStatusCode.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED
        )
      );
  }
  return res
    .status(HttpStatusCode.OK)
    .json(ResponseUtil.success(await userService.getCurUser(token)));
});

export default router;
