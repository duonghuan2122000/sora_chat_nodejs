<!-- 
    Giao diện tạo nhóm
-->
<template>
  <Dialog>
    <DialogTrigger>
      <Button variant="outline" size="icon" aria-label="Thêm nhóm" title="Thêm nhóm">
        <CirclePlus />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Thêm nhóm</DialogTitle>
      </DialogHeader>
      <div class="flex flex-col gap-4">
        <Field>
          <FieldLabel>Tên nhóm</FieldLabel>
          <Input placeholder="Nhập tên nhóm" />
        </Field>
        <Field>
          <FieldLabel>Chọn user</FieldLabel>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                role="combobox"
                :aria-expanded="open"
                class="justify-start font-normal"
                >Chọn user</Button
              >
            </PopoverTrigger>
            <PopoverContent class="w-[425px]">
              <Command>
                <CommandInput placeholder="Tìm kiếm user" />
                <CommandList>
                  <CommandEmpty>Không tìm thấy user</CommandEmpty>
                  <CommandGroup>
                    <CommandItem>DBHuan</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div class="flex flex-row gap-4">
            <div class="relative">
              <div class="w-[36px] h-[36px]" title="Dương Huân">
                <img
                  src="https://cdn2.tuoitre.vn/zoom/515_322/471584752817336320/data/teen360/news/2020/09/01/59881/1598972593_118265345_2621091828152910_2700791632228574126_n.jpg"
                  alt=""
                  class="w-[36px] h-[36px] rounded-[50%]"
                />
              </div>
              <div
                class="absolute top-[-5px] right-[-5px] cursor-pointer bg-white border rounded-[50%] h-[14px] w-[14px] leading-[14px] flex flex-row items-center justify-center"
              >
                &#10006;
              </div>
            </div>

            <div class="relative">
              <div class="w-[36px] h-[36px]" title="Dương Huân">
                <img
                  src="https://cdn2.tuoitre.vn/zoom/515_322/471584752817336320/data/teen360/news/2020/09/01/59881/1598972593_118265345_2621091828152910_2700791632228574126_n.jpg"
                  alt=""
                  class="w-[36px] h-[36px] rounded-[50%]"
                />
              </div>
              <div
                class="absolute top-[-5px] right-[-5px] cursor-pointer bg-white border rounded-[50%] h-[14px] w-[14px] leading-[14px] flex flex-row items-center justify-center"
              >
                &#10006;
              </div>
            </div>
          </div>
        </Field>
      </div>
      <div class="flex flex-row gap-2 justify-end">
        <DialogClose as-child>
          <Button variant="outline">Đóng</Button>
        </DialogClose>
        <Button>Tạo</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { CirclePlus } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
</script>
