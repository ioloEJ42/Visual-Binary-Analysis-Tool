<template>
  <div>
    <el-button @click="selectFile" :loading="isLoading">Select Binary File</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'

const emit = defineEmits(['file-selected', 'loading'])
const isLoading = ref(false)

const selectFile = async () => {
  isLoading.value = true
  emit('loading', true)
  try {
    const fileInfo = await window.electron.openFileDialog()
    if (fileInfo) {
      emit('file-selected', fileInfo)
    }
  } finally {
    isLoading.value = false
    emit('loading', false)
  }
}
</script>
