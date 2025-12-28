export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const response = await $fetch(`${config.beHost}/users/search`, {
    method: "POST",
    body: {
      ...body,
      key_search: body?.key_search ?? "",
    },
  });
  return response;
});
