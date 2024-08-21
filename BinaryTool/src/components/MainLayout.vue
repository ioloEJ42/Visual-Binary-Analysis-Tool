<template>
  <div class="main-layout">
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
      />
    </div>
    <div class="hex-dec-view">
      <HexDecViewer :filePath="filePath" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BinaryVisualization from './BinaryVisualization.vue'
import HexDecViewer from './HexDecViewer.vue'
import ControlPanel from './ControlPanel.vue'

const props = defineProps<{
  filePath: string
}>()

const zoom = ref(1)
const view = ref('cluster')
const colorScheme = ref('grayscale')

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
</script>

<style scoped>
.main-layout {
  display: flex;
  height: calc(100vh - 60px);
  background-color: #f0f0f0;
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
