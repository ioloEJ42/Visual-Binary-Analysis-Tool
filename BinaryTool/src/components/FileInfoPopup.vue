<template>
  <el-popover placement="bottom-end" :width="400" trigger="click">
    <template #reference>
      <el-button>File Info</el-button>
    </template>
    <div class="file-info-content">
      <h3>File Information</h3>
      <p v-if="fileInfo"><strong>Name:</strong> {{ fileInfo.name }}</p>
      <p v-if="fileInfo"><strong>Size:</strong> {{ formatFileSize(fileInfo.size) }}</p>
      <p v-if="fileInfo"><strong>Last Modified:</strong> {{ formatDate(fileInfo.lastModified) }}</p>
      <h3>Hashes</h3>
      <p v-if="hashes"><strong>MD5:</strong> {{ hashes.md5 }}</p>
      <p v-if="hashes"><strong>SHA1:</strong> {{ hashes.sha1 }}</p>
      <p v-if="hashes"><strong>SHA256:</strong> {{ hashes.sha256 }}</p>
      <h3>External Links</h3>
      <el-button @click="openVirusTotal" size="small">VirusTotal</el-button>
      <el-button @click="openMetaScan" size="small">MetaScan</el-button>
      <el-button @click="openGoogle" size="small">Google</el-button>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ElPopover, ElButton } from 'element-plus'

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
