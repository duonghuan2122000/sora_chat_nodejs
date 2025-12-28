export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const conversationId = getRouterParam(event, "conversation_id");
  const response = await $fetch(
    `${config.beHost}/conversations/${conversationId}`,
    {
      method: "GET",
    }
  );
  return response;
});
