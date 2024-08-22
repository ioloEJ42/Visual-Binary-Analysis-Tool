<template>
  <el-dialog :model-value="visible" @update:model-value="updateVisible" title="File Information" width="30%">
    <div v-if="fileInfo">
      <h3>File Information</h3>
      <p><strong>Name:</strong> {{ fileInfo.name }}</p>
      <p><strong>Size:</strong> {{ formatFileSize(fileInfo.size) }}</p>
      <p><strong>Last Modified:</strong> {{ formatDate(fileInfo.lastModified) }}</p>
    </div>
    <div v-if="hashes">
      <h3>Hashes</h3>
      <p><strong>MD5:</strong> {{ hashes.md5 }}</p>
      <p><strong>SHA1:</strong> {{ hashes.sha1 }}</p>
      <p><strong>SHA256:</strong> {{ hashes.sha256 }}</p>
    </div>
    <h3>External Links</h3>
    <el-button @click="openVirusTotal" :disabled="!hashes">VirusTotal</el-button>
    <el-button @click="openMetaScan" :disabled="!hashes">MetaScan</el-button>
    <el-button @click="openGoogle" :disabled="!fileInfo">Google</el-button>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElDialog, ElButton } from 'element-plus'

const props = defineProps<{
  fileInfo: any,
  hashes: any,
  visible: boolean
}>()

const emit = defineEmits(['update:visible'])

const updateVisible = (value: boolean) => {
  emit('update:visible', value)
}

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
    window.open(`https://metadefender.opswat.com/results#!/file/${props.hashes.md5}/hash/overview`, '_blank')
  }
}

const openGoogle = () => {
  if (props.fileInfo) {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(props.fileInfo.name)}`, '_blank')
  }
}
</script>

<style scoped>
.file-info-content {
  padding: 10px;
}

h3 {
  margin-top: 15px;
  margin-bottom: 10px;
  color: #409eff;
}

p {
  margin: 5px 0;
}

.el-button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
