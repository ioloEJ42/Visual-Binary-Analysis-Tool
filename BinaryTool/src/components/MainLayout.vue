<template>
  <div class="main-layout">
    <el-loading :fullscreen="true" v-if="isLoading">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <div class="loading-text">Processing file...</div>
    </el-loading>
    <div class="control-panel">
      <ControlPanel
        @update:zoom="updateZoom"
        @update:view="updateView"
        @update:colorScheme="updateColorScheme"
        @takeSnapshot="takeSnapshot"
      />
    </div>
    <div class="binary-visualization">
      <BinaryVisualization
        :filePath="filePath"
        :zoom="zoom"
        :view="view"
        :colorScheme="colorScheme"
        @loading="setLoading"
      />
    </div>
    <div class="hex-dec-view">
      <HexDecViewer :filePath="filePath" @loading="setLoading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElLoading } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import BinaryVisualization from './BinaryVisualization.vue'
import HexDecViewer from './HexDecViewer.vue'
import ControlPanel from './ControlPanel.vue'

const props = defineProps<{
  filePath: string
}>()

const zoom = ref(1)
const view = ref('cluster')
const colorScheme = ref('grayscale')
const isLoading = ref(false)

const updateZoom = (value: number) => {
  zoom.value = value
}

const updateView = (value: string) => {
  view.value = value
}

const updateColorScheme = (value: string) => {
  colorScheme.value = value
}

const takeSnapshot = () => {
  // Implement snapshot functionality
  console.log('Taking snapshot of', props.filePath)
}

const setLoading = (loading: boolean) => {
  isLoading.value = loading
}
</script>

<style scoped>
.main-layout {
  display: flex;
  height: calc(100vh - 60px);
  position: relative;
}

.loading-icon {
  font-size: 30px;
}

.loading-text {
  margin-top: 10px;
}

.control-panel {
  width: 20%;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.binary-visualization {
  width: 50%;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.hex-dec-view {
  width: 30%;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
</style>
