<template>
  <div class="app-wrap">
    <!-- v-model => :modelValue + @update:modelValue -->
    <editor v-model="settings" :formData="formData" />
  </div>
</template>

<script setup>
import { genHeatmap } from "@/utils/webgl";
import { provide, ref } from "vue";

import editor from "./packages/editor";
import data from "./data.json";
import { registerConfig as config } from "./utils/editor-config";
import webglData from "./webgldata.json";

(async () => {
  // console.log(webglData);
  // const { data, max, min, color, xy } = webglData;
  // const response = await genHeatmap(data, max, min, color, xy);
  // console.log("============", response);
})();

provide("editorConfig", config);

const formData = ref({
  username: "wangyesheng",
  password: "123456",
  start: 0,
  end: 100,
});

const settings = ref(data);
</script>

<style lang="scss">
.app-wrap {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
}
</style>
