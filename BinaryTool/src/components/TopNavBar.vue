<template>
  <el-menu mode="horizontal" :router="true" class="top-nav-bar">
    <el-menu-item index="/">Visual Binary Analysis Tool</el-menu-item>
    <el-menu-item index="/about">About</el-menu-item>
    <el-menu-item index="/changelog">Changelog</el-menu-item>
    <el-menu-item index="/help">Help</el-menu-item>
    <el-menu-item index="#" class="file-info-button">
      <FileInfoPopup v-if="fileSelected" :fileInfo="fileInfo" :hashes="hashes" />
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ElMenu, ElMenuItem } from 'element-plus'
import FileInfoPopup from './FileInfoPopup.vue'

defineProps<{
  fileSelected: boolean
  fileInfo: any
  hashes: any
}>()
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
