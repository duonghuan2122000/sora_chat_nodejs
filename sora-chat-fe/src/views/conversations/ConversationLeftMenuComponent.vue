<!-- 
  Left menu component của cuộc trò chuyện
  @author dbhuan 01.01.2026
-->
<template>
  <div class="flex-none w-[320px] py-4">
    <div class="bg-white flex flex-col h-[100%] rounded-[12px]">
      <div class="flex-0 p-4 border-b border-gray-200 flex flex-col gap-2">
        <Input placeholder="Tìm kiếm user, nhóm" />
        <div>
          <CreateGroupComponent />
        </div>
      </div>
      <div class="flex-1 overflow-y-auto px-2 py-2">
        <ConversationItemComponent
          v-for="n in 20"
          :active="n == 1"
          :online="n == 1"
          :unReadMessage="n == 1 ? 10 : 0"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Input } from "@/components/ui/input";
import CreateGroupComponent from "@/views/conversations/CreateGroupComponent.vue";
import ConversationItemComponent from "@/views/conversations/ConversationItemComponent.vue";
</script>
