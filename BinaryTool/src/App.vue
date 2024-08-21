<template>
  <div class="app-container">
    <TopNavBar :fileSelected="!!selectedFile" :fileInfo="fileInfo" :hashes="hashes" />
    <div class="main-content">
      <FileSelector @file-selected="onFileSelected" />
      <MainLayout v-if="selectedFile" :filePath="selectedFile.path" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopNavBar from './components/TopNavBar.vue'
import FileSelector from './components/FileSelector.vue'
import MainLayout from './components/MainLayout.vue'

const selectedFile = ref(null)
const fileInfo = ref(null)
const hashes = ref(null)

const onFileSelected = async (file) => {
  selectedFile.value = file
  fileInfo.value = await window.electron.getFileInfo(file.path)
  hashes.value = await window.electron.generateHashes(file.path)
}
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f0f0f0;
}
</style>
