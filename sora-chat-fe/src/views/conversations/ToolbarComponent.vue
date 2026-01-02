<!-- 
    Giao diện toolbar
    @author dbhuan 01.01.2026
-->
<template>
  <div class="flex-none w-[64px] flex flex-col items-center justify-between py-4">
    <div>
      <Button variant="outline" size="icon" aria-label="Tin nhắn" title="Tin nhắn">
        <MessageCircle />
      </Button>
    </div>
    <div>
      <div class="cursor-pointer">
        <img
          src="https://cdn2.tuoitre.vn/zoom/515_322/471584752817336320/data/teen360/news/2020/09/01/59881/1598972593_118265345_2621091828152910_2700791632228574126_n.jpg"
          alt=""
          class="w-[36px] h-[36px] rounded-[50%]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { MessageCircle } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
</script>
