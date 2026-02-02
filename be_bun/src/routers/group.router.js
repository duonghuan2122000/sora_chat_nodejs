import { AppUrlPath, SearchGroupErrorInfo } from "#src/common/const.common";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { ResponseUtil } from "#src/utils/request.util";
import { groupService } from "#src/services/group.service";
import * as z from "zod";

const searchGroupValidationSchema = z.object({
  skip: z.number().min(0).default(0),
  limit: z.number().min(1).default(10),
  key_search: z.string(),
});

const app = new Hono();

// POST /groups/search
app.post(
  AppUrlPath.Groups.SEARCH,
  validator("json", (value, c) => {
    const parsed = searchGroupValidationSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        ResponseUtil.error(
          SearchGroupErrorInfo.Code.BAD_REQUEST,
          SearchGroupErrorInfo.Message.BAD_REQUEST,
        ),
      );
    }
    return parsed.data;
  }),
  async (c) => {
    let body = c.req.valid("json");
    return c.json(ResponseUtil.success(await groupService.searchGroup(body)));
  },
);

export default app;
