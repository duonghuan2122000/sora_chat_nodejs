import { Hono } from "hono";
import {
  AppUrlPath,
  HttpStatusCode,
  ImageUploadErrorInfo,
} from "#src/common/const.common";
import { ResponseUtil } from "#src/utils/request.util";
import imageService from "#src/services/image.service";

const app = new Hono();

// POST /images/upload
app.post(AppUrlPath.Images.UPLOAD, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return c.json(
        ResponseUtil.error(
          ImageUploadErrorInfo.Code.BAD_REQUEST,
          ImageUploadErrorInfo.Message.BAD_REQUEST,
        ),
        HttpStatusCode.BAD_REQUEST,
      );
    }

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      return c.json(
        ResponseUtil.error(
          ImageUploadErrorInfo.Code.INVALID_FILE_TYPE,
          ImageUploadErrorInfo.Message.INVALID_FILE_TYPE,
        ),
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = await imageService.uploadImage(buffer, file.name);

    return c.json(ResponseUtil.success({ filename }));
  } catch (error) {
    console.error("Upload error:", error);
    return c.json(
      ResponseUtil.error(
        ImageUploadErrorInfo.Code.UPLOAD_FAILED,
        ImageUploadErrorInfo.Message.UPLOAD_FAILED,
      ),
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }
});

// GET /images/:filename
app.get(AppUrlPath.Images.STREAM, async (c) => {
  try {
    const filename = c.req.param("filename");
    const { stream, stat } = await imageService.getImage(filename);

    return c.body(stream, HttpStatusCode.OK, {
      "Content-Type":
        stat.metaData["Content-Type"] || "application/octet-stream",
      "Content-Length": stat.size.toString(),
    });
  } catch (error) {
    console.error("Stream error:", error);
    return c.json(
      ResponseUtil.error(HttpStatusCode.NOT_FOUND, "Image not found"),
      HttpStatusCode.NOT_FOUND,
    );
  }
});

export default app;
