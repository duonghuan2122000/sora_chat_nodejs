<!-- 
    trang chủ 
    GET /
    @author dbhuan 31.12.2025
-->
<template>
  <div class="HomeView h-screen flex flex-row">
    <div class="flex-none w-[320px] border-r border-gray-200 flex flex-col">
      <div class="flex-0 p-4 border-b border-gray-200 flex flex-col gap-2">
        <Input placeholder="Tìm kiếm user, nhóm" />
        <div>
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
                        class="absolute top-[-5px] right-[-5px] cursor-pointer font-semibold bg-white border rounded-[50%] h-[18px] w-[18px] leading-[18px] flex flex-row items-center justify-center"
                      >
                        x
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
                        class="absolute top-[-5px] right-[-5px] cursor-pointer font-semibold bg-white border rounded-[50%] h-[18px] w-[18px] leading-[18px] flex flex-row items-center justify-center"
                      >
                        x
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
        </div>
      </div>
      <div class="flex-1">
        <div class="flex flex-row px-4 py-2 gap-2 items-center cursor-pointer hover:bg-green-100">
          <div class="flex-none w-[36px] h-[36px]">
            <img
              src="https://cdn2.tuoitre.vn/zoom/515_322/471584752817336320/data/teen360/news/2020/09/01/59881/1598972593_118265345_2621091828152910_2700791632228574126_n.jpg"
              alt=""
              class="w-[36px] h-[36px] rounded-[50%]"
            />
          </div>
          <div class="flex-1 truncate overflow-hidden text-ellipsis">Dương Huân</div>
          <div class="flex-0 pl-2">
            <div
              class="flex flex-row items-center justify-center bg-red-300 text-center w-[28px] h-[28px] rounded-[50%] text-white text-sm"
            >
              10+
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 flex flex-row items-center justify-center">
      <div class="font-semibold">Hãy bắt đầu chat ngay</div>
    </div>
  </div>
</template>

<script setup>
import { Input } from "@/components/ui/input";
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
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
</script>
