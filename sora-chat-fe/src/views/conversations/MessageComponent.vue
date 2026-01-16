<!-- 
    Giao diện từng dòng tin nhắn
    @author dbhuan 01.01.2026
-->
<template>
  <div class="flex flex-row items-end gap-3" :class="{ 'flex-row-reverse': isMessageCurrentUser }">
    <div class="flex-none w-[28px] h-[28px]">
      <div class="relative">
        <img
          src="https://cdn2.tuoitre.vn/zoom/515_322/471584752817336320/data/teen360/news/2020/09/01/59881/1598972593_118265345_2621091828152910_2700791632228574126_n.jpg"
          alt=""
          class="w-[28px] h-[28px] rounded-[50%]"
          title="Dương Huân"
        />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div v-if="!isMessageCurrentUser" class="text-sm text-gray-400">Dương Huân</div>
      <div
        class="flex flex-row items-center gap-2"
        :class="{ 'flex-row-reverse': isMessageCurrentUser }"
      >
        <div
          class="border border-gray-200 rounded-[8px] px-3 py-2 inline-block max-w-[400px]"
          :class="{ 'bg-green-100': isMessageCurrentUser, 'bg-gray-100': !isMessageCurrentUser }"
        >
          <div class="relative">
            <div title="Thứ 5 - 01/01/2026">
              Xin chào sfsfsfs fs sfsfsf s sfdsfdsf sf sfsdfsdfsdf sf sfsfdsfsf sf sfsf &#128512;
              fsfs sfsf sfsf sfsfsfs sf sfsfsfsfs sf sfsdfsdf sf sdfsdfsfs fs fsfsdfsdf sf sfsfsf
            </div>
            <div class="absolute bottom-[-20px] right-[-5px] flex flex-row">
              <div class="border border-gray-100 rounded-[50%] cursor-pointer bg-white">😂</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Components

const props = defineProps({
  /**
   * Cờ cho biết có phải là message của user hiện tại
   * Mặc định: false
   */
  isMessageCurrentUser: {
    type: Boolean,
    default: false,
  },
});

const isMessageCurrentUser = computed(() => props.isMessageCurrentUser);
</script>
