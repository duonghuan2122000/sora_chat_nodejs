export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const response = await $fetch(`${config.beHost}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookies["x_sora_access_token"]}`,
    },
  });
  return response;
});
