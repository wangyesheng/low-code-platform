<template>
  <div class="app-wrap">
    <!-- v-model => :modelValue + @update:modelValue -->
    <editor v-model="settings" />
  </div>
</template>

<script setup>
import { provide, ref } from "vue";

import editor from "./packages/editor";
import data from "./data.json";
import { registerConfig as config } from "./utils/editor-config";

provide("editorConfig", config);

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
