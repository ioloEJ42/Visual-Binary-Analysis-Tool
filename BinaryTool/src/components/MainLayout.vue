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
    <div class="content">
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
  console.log('Taking snapshot of', props.filePath)
}
</script>

<style scoped>
.main-layout {
  display: flex;
  height: calc(100vh - 60px); /* Adjust for navbar height */
}

.control-panel {
  width: 20%;
  background-color: #f0f0f0;
  padding: 1rem;
  overflow-y: auto;
}

.content {
  display: flex;
  width: 80%;
}

.binary-visualization {
  width: 60%;
  background-color: #ffffff;
  padding: 1rem;
}

.hex-dec-view {
  width: 40%;
  background-color: #f9f9f9;
  padding: 1rem;
}
</style>