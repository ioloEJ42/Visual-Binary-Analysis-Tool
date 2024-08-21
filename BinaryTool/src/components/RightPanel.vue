<template>
  <div class="right-panel">
    <h3>File Information</h3>
    <div v-if="fileInfo">
      <p><strong>Name:</strong> {{ fileInfo.name }}</p>
      <p><strong>Size:</strong> {{ formatFileSize(fileInfo.size) }}</p>
      <p><strong>Last Modified:</strong> {{ formatDate(fileInfo.lastModified) }}</p>
    </div>
    <h3>Hashes</h3>
    <div v-if="hashes">
      <p><strong>MD5:</strong> {{ hashes.md5 }}</p>
      <p><strong>SHA1:</strong> {{ hashes.sha1 }}</p>
      <p><strong>SHA256:</strong> {{ hashes.sha256 }}</p>
    </div>
    <h3>External Links</h3>
    <el-button @click="openVirusTotal" :disabled="!hashes">VirusTotal</el-button>
    <el-button @click="openMetaScan" :disabled="!hashes">MetaScan</el-button>
    <el-button @click="openGoogle" :disabled="!fileInfo">Google</el-button>
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'

const props = defineProps<{
  fileInfo: {
    name: string
    size: number
    lastModified: string
  } | null
  hashes: {
    md5: string
    sha1: string
    sha256: string
  } | null
}>()

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const openVirusTotal = () => {
  if (props.hashes) {
    window.open(`https://www.virustotal.com/gui/file/${props.hashes.sha256}`, '_blank')
  }
}

const openMetaScan = () => {
  if (props.hashes) {
    window.open(
      `https://metadefender.opswat.com/results#!/file/${props.hashes.md5}/hash/overview`,
      '_blank'
    )
  }
}

const openGoogle = () => {
  if (props.fileInfo) {
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(props.fileInfo.name)}`,
      '_blank'
    )
  }
}
</script>

<style scoped>
.right-panel {
  padding: 1rem;
}

h3 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
