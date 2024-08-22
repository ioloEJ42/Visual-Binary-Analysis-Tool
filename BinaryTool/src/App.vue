<template>
  <div class="app-container">
    <TopNavBar 
      :fileSelected="!!selectedFile"
      :fileName="selectedFile?.name || ''"
      @show-file-info="showFileInfo"
    />
    <FileSelector @file-selected="onFileSelected" />
    <MainLayout v-if="selectedFile" :filePath="selectedFile.path" />
    <FileInfoPopup
      v-if="selectedFile"
      :fileInfo="fileInfo"
      :hashes="hashes"
      v-model:visible="showPopup"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopNavBar from './components/TopNavBar.vue'
import FileSelector from './components/FileSelector.vue'
import MainLayout from './components/MainLayout.vue'
import FileInfoPopup from './components/FileInfoPopup.vue'

interface SelectedFile {
  path: string;
  name: string;
}

interface FileInfo {
  name: string;
  size: number;
  lastModified: string;
}

interface Hashes {
  md5: string;
  sha1: string;
  sha256: string;
}

const selectedFile = ref<SelectedFile | null>(null)
const fileInfo = ref<FileInfo | null>(null)
const hashes = ref<Hashes | null>(null)
const showPopup = ref(false)

const onFileSelected = async (file: SelectedFile) => {
  selectedFile.value = file
  fileInfo.value = await window.electron.getFileInfo(file.path) as FileInfo
  hashes.value = await window.electron.generateHashes(file.path) as Hashes
}

const showFileInfo = () => {
  showPopup.value = true
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
body {
  font-family: 'Inter', sans-serif;
}
</style>
