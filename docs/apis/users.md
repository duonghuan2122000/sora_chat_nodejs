### API đăng nhập người dùng

**POST** /users/login

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

**Request Body**

| Tên trường | Kiểu dữ liệu   | Bắt buộc | Mô tả         |
| ---------- | -------------- | -------- | ------------- |
| username   | string (6, ..) | Có       | Tên đăng nhập |
| password   | string (6, ..) | Có       | Mật khẩu      |

**Response Body**

| Tên trường      | Kiểu dữ liệu | Bắt buộc                | Mô tả                                                            |
| --------------- | ------------ | ----------------------- | ---------------------------------------------------------------- |
| success         | bool         | Có                      | Cờ cho biết request có thành công hay không?                     |
| code            | string       | Không                   | Mã lỗi. Chỉ có giá trị khi success = false                       |
| message         | string       | Không                   | Mô tả mã lỗi. Chỉ có giá trị khi success = false                 |
| data            | object       | Không                   | Data khi đăng nhập thành công. Chỉ có giá trị khi success = true |
| data.token      | string       | Có (Phụ thuộc vào data) | Token xác thực của người dùng                                    |
| data.expires_in | int          | Có (Phụ thuộc vào data) | Thời gian hiệu lực của token                                     |

**Bảng mã lỗi**

| Http Status Code | Mã lỗi      | Mô tả mã lỗi                   |
| ---------------- | ----------- | ------------------------------ |
| 200              |             | Thành công                     |
|                  | BAD_REQUEST | Thông tin request không hợp lệ |
| 5xx              |             | Lỗi hệ thống                   |
