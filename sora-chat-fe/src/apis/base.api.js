import { HttpStatusCode, RouterName } from "@/commons/const.common";
import axios from "axios";
import router from "@/router";
export class BaseApi {
  constructor() {}

  async requestAsync(instanceConfig, { url, method, data, headers = {} }) {
    const _this = this;
    let result;
    try {
      instanceConfig = await _this._processInstanceConfig(instanceConfig);
      headers = await _this._processRequestHeaders(headers);
      method = await _this._processRequestMethod(method);

      let response = await instanceConfig({
        url,
        method,
        data,
        headers,
      });
      result = {
        httpStatusCode: response.status,
        headers: response.headers,
        data: response.data,
      };
    } catch (error) {
      console.error(error);
      result = {
        httpStatusCode: error?.response?.status,
        headers: error?.response?.headers,
        data: error?.response?.data,
      };
      if (result.httpStatusCode === HttpStatusCode.UNAUTHORIZED) {
        // chuyển về trang login
        router.push({ name: RouterName.Login });
        return;
      }
    }
    return result;
  }

  /**
   * Thực hiện thêm các tham số header mặc định
   * @author 02.01.2026
   */
  async _processRequestHeaders(headers = {}) {
    if (!headers) {
      headers = {};
    }

    // mặc định: Content-Type: application/json
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
  }

  /**
   * Thực hiện xử lý cho method
   * @author 02.01.2026
   */
  async _processRequestMethod(method) {
    if (!method) {
      method = "GET";
    }
    return method;
  }

  async _processInstanceConfig(instanceConfig) {
    if (!instanceConfig) {
      instanceConfig = axios;
    }
    return instanceConfig;
  }
}
