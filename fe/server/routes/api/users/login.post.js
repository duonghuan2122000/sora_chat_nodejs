export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const response = await $fetch(`${config.beHost}/users/login`, {
    method: "POST",
    body,
  });
  if (response.success) {
    setCookie(event, "x_sora_access_token", response.data.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  }
  // xóa bỏ đi thông tin data (chứa access_token) để đảm bảo ANTT
  delete response.data;
  return response;
});
