<template>
  <el-menu mode="horizontal" :router="true" class="top-nav-bar">
    <el-menu-item index="/">Visual Binary Analysis Tool</el-menu-item>
    <el-menu-item index="/about">About</el-menu-item>
    <el-menu-item index="/changelog">Changelog</el-menu-item>
    <el-menu-item index="/help">Help</el-menu-item>
    <el-menu-item index="#" class="file-info-button" @click="showFileInfo" v-if="fileSelected">
      {{ fileInfoButtonText }}
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMenu, ElMenuItem } from 'element-plus'

const props = defineProps<{
  fileSelected: boolean,
  fileName: string
}>()

const emit = defineEmits(['show-file-info'])

const fileInfoButtonText = computed(() => {
  return props.fileSelected ? `File Info - ${props.fileName}` : 'File Info'
})

const showFileInfo = () => {
  emit('show-file-info')
}
</script>

<style scoped>
.top-nav-bar {
  position: relative;
}

.file-info-button {
  position: absolute !important;
  right: 0;
}
</style>