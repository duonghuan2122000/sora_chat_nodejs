import { BaseApi } from "@/apis/base.api";
import { beBaseRequest } from "@/apis/configs/be.config.api";
import { HttpRequestMethod } from "@/commons/const.common";

class ImageApi extends BaseApi {
  /**
   * Upload image
   * @param {File} file
   * @returns {Promise<any>}
   */
  async uploadImageAsync(file) {
    const formData = new FormData();
    formData.append("file", file);

    let result = await this.requestAsync(beBaseRequest, {
      url: "/images/upload",
      method: HttpRequestMethod.POST,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result;
  }
}

export const imageApi = new ImageApi();
