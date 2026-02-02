import { ResponseUtil } from "#src/utils/request.util.js";

class GroupService {
  /**
   * Hàm tìm kiếm nhóm (Placeholder)
   * @author dbhuan 02.02.2026
   */
  async searchGroup(payload) {
    // Hiện tại chưa có nghiệp vụ về nhóm, trả về mảng rỗng
    return {
      total_count: 0,
      items: [],
    };
  }
}

export const groupService = new GroupService();
