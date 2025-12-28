export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const conversationId = getRouterParam(event, "conversation_id");
  const response = await $fetch(
    `${config.beHost}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body,
    }
  );
  return response;
});
