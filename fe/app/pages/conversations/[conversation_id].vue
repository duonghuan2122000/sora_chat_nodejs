<!-- 
    Trang giao diện đoạn chat
    GET /conversations/:conversation_id
-->
<template>
  <div class="flex flex-row h-screen">
    <div class="flex-none w-1/4">
      <div class="flex flex-col">
        <div class="flex-0">
          <div class="p-4">
            <UInput placeholder="Tìm người dùng" class="w-full" />
          </div>
          <USeparator />
        </div>
        <div class="flex-1">
          <div
            class="flex flex-row items-center gap-3 px-4 py-2 cursor-pointer hover:bg-sky-100"
          >
            <div class="flex-none">
              <img
                src="https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg"
                class="w-10 h-10 rounded-[50%]"
              />
            </div>
            <div class="flex-1">Dương Huân</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-none w-3/4 border-l border-gray-200">
      <div class="flex flex-col h-full">
        <div class="flex-0 border-b border-gray-200">
          <div class="flex flex-row items-center gap-3 px-4 py-2">
            <div class="flex-none">
              <img
                src="https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg"
                class="w-10 h-10 rounded-[50%]"
              />
            </div>
            <div class="flex-1">Dương Huân</div>
          </div>
        </div>
        <div class="flex-1 p-4 overflow-y-auto">
          <template v-for="message in messages">
            <!-- Dòng tin nhắn -->
            <div class="flex flex-row flex-wrap items-end gap-3 px-4 py-2">
              <div class="flex-none">
                <img
                  src="https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg"
                  class="w-10 h-10 rounded-[50%]"
                />
              </div>
              <div class="flex-1">
                <div class="flex flex-col gap-2">
                  <div class="flex flex-row">Dương Huân</div>
                  <div class="flex flex-row flex-wrap">
                    <div class="flex-none w-[50%]">
                      <div class="flex flex-col gap-1">
                        <div class="flex flex-row flex-wrap">
                          <div
                            class="inline-block border border-gray-200 p-2 rounded-[8px]"
                          >
                            <div
                              v-html="bindMessage(message.message.blocks)"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Dòng tin nhắn -->

            <!-- Dòng tin nhắn -->
            <div
              class="flex flex-row-reverse flex-wrap items-end gap-3 px-4 py-2"
            >
              <div class="flex-none">
                <img
                  src="https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg"
                  class="w-10 h-10 rounded-[50%]"
                />
              </div>
              <div class="flex-1">
                <div class="flex flex-col gap-2">
                  <div class="flex flex-row justify-end">Dương Huân</div>
                  <div class="flex flex-row justify-end flex-wrap">
                    <div class="flex-none w-[50%]">
                      <div class="flex flex-col gap-1">
                        <div class="flex flex-row flex-wrap justify-end">
                          <div
                            class="inline-block border border-gray-200 p-2 rounded-[8px] bg-sky-200"
                          >
                            alo alo
                          </div>
                        </div>

                        <div class="flex flex-row flex-wrap justify-end">
                          <div
                            class="inline-block border border-gray-200 p-2 rounded-[8px] bg-sky-200"
                          >
                            alo alo
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Dòng tin nhắn -->
          </template>
        </div>
        <div class="flex-0 p-4">
          <UInput class="w-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Đoạn chat - Sora Chat",
});

const route = useRoute();
const conversationId = route.params.conversation_id;

const conversation = ref(null);
const messages = ref([]);
const users = ref([]);

const { data: dataConversation } = await useFetch(
  `/api/conversations/${conversationId}`,
  {
    method: "GET",
  }
);

conversation.value = dataConversation.value?.data;

const { data: dataMessages } = await useFetch(
  `/api/conversations/${conversationId}/messages`,
  {
    method: "POST",
    body: {},
  }
);

messages.value = dataMessages.value?.data ?? [];

if (conversation.value) {
  if (conversation.value.type === "direct") {
    const userIds = conversation.value.members.map((member) => member.user_id);
    const { data: dataUsers } = await useFetch(`/api/users/search`, {
      method: "POST",
      body: {
        user_ids: userIds,
      },
    });
    users.value = dataUsers.value?.data?.items ?? [];
  }
}

const bindMessage = (blocks = []) => {
  return blocks.reduce((msg, block) => {
    switch (block.type) {
      case "text":
        return msg + block.value;
      default:
        return msg;
    }
  }, "");
};
</script>
