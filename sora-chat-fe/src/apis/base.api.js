import { HttpStatusCode, RouterName, AppUrlPath } from "@/commons/const.common";
import axios from "axios";
import router from "@/router";
import { beBaseRequest } from "./configs/be.config.api";
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
        // Nếu không phải là request refresh token thì mới thử refresh
        if (url !== AppUrlPath.Users.REFRESH_TOKEN) {
          // Thử refresh token
          const refreshResult = await this.refreshTokenAsync();
          if (refreshResult?.httpStatusCode === HttpStatusCode.OK) {
            // Refresh thành công, thử lại request ban đầu
            return await this.requestAsync(instanceConfig, {
              url,
              method,
              data,
              headers,
            });
          }
        }

        // Nếu refresh thất bại hoặc là chính request refresh bị 401
        // chuyển về trang login
        router.push({ name: RouterName.Login });
        return;
      }
    }
    return result;
  }

  /**
   * Thực hiện gọi api refresh token
   */
  async refreshTokenAsync() {
    if (this._isRefreshing) {
      // Nếu đang refresh rồi thì đợi cái kia xong
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (!this._isRefreshing) {
            clearInterval(check);
            resolve({ httpStatusCode: HttpStatusCode.OK }); // Giả định là ok để thử lại request
          }
        }, 100);
      });
    }

    this._isRefreshing = true;
    try {
      const response = await beBaseRequest({
        url: `${AppUrlPath.Users.BASE}${AppUrlPath.Users.REFRESH_TOKEN}`,
        method: "POST",
        withCredentials: true, // Quan trọng để gửi/nhận cookie
      });
      return {
        httpStatusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      return {
        httpStatusCode: error?.response?.status,
      };
    } finally {
      this._isRefreshing = false;
    }
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
