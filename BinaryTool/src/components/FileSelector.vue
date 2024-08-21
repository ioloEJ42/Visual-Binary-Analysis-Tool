<template>
  <div>
    <el-button @click="selectFile">Select Binary File</el-button>
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'

const emit = defineEmits(['file-selected'])

const selectFile = async () => {
  const fileInfo = await window.electron.openFileDialog()
  if (fileInfo) {
    emit('file-selected', fileInfo)
  }
}
</script>
