<template>
  <div>
    <el-button @click="selectFile">Select Binary File</el-button>
    <div v-if="fileInfo">
      <p>Path: {{ fileInfo.path }}</p>
      <p>Size: {{ fileInfo.size }} bytes</p>
      <p>Last Modified: {{ new Date(fileInfo.lastModified).toLocaleString() }}</p>
      <div v-if="hashes">
        <p>MD5: {{ hashes.md5 }}</p>
        <p>SHA1: {{ hashes.sha1 }}</p>
        <p>SHA256: {{ hashes.sha256 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'

interface FileInfo {
  path: string
  size: number
  lastModified: string
}

interface Hashes {
  md5: string
  sha1: string
  sha256: string
}

const fileInfo = ref<FileInfo | null>(null)
const hashes = ref<Hashes | null>(null)
const emit = defineEmits(['file-selected'])

const selectFile = async () => {
  fileInfo.value = await window.electron.openFileDialog()
  if (fileInfo.value) {
    hashes.value = await window.electron.generateHashes(fileInfo.value.path)
    emit('file-selected', { ...fileInfo.value, hashes: hashes.value })
  }
}
</script>
