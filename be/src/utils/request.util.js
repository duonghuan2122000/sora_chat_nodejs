/**
 * Hàm util format lại result (response body) theo chuẩn
 * CreatedBy: dbhuan 23.12.2025
 */
export class ResponseUtil {
  /**
   * Hàm trả về khi kết quả success
   * @param {*} data data khi thành công
   * @returns object json thành công
   * @author dbhuan 23.12.2025
   */
  static success(data) {
    return {
      success: true,
      data: data,
    };
  }

  /**
   * Hàm trả về khi kết quả có lỗi
   * @param {string} code Mã lỗi
   * @param {string} message Mô tả mã lỗi
   * @returns object json thất bại
   * @author dbhuan 23.12.2025
   */
  static error(code, message) {
    return {
      success: false,
      code: code,
      message: message,
    };
  }
}
