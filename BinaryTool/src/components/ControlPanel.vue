<template>
  <div class="control-panel">
    <h3>Control Panel</h3>
    <div class="control-group">
      <label>Zoom:</label>
      <el-slider v-model="zoom" :min="10" :max="200" :step="10" @input="updateZoom" />
    </div>
    <div class="control-group">
      <label>View:</label>
      <el-radio-group v-model="view" @change="updateView">
        <el-radio-button label="cluster">Cluster</el-radio-button>
        <el-radio-button label="scan">Scan</el-radio-button>
      </el-radio-group>
    </div>
    <div class="control-group">
      <label>Color Scheme:</label>
      <el-select v-model="colorScheme" @change="updateColorScheme">
        <el-option label="Grayscale" value="grayscale" />
        <el-option label="RGB" value="rgb" />
        <el-option label="Heat Map" value="heatmap" />
      </el-select>
    </div>
    <el-button @click="takeSnapshot">Take Snapshot</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElSlider, ElRadioGroup, ElRadioButton, ElSelect, ElOption, ElButton } from 'element-plus'

const zoom = ref(100)
const view = ref('cluster')
const colorScheme = ref('grayscale')

const emit = defineEmits(['update:zoom', 'update:view', 'update:colorScheme', 'takeSnapshot'])

const updateZoom = (value: number) => {
  emit('update:zoom', value / 100)
}

const updateView = (value: string) => {
  emit('update:view', value)
}

const updateColorScheme = (value: string) => {
  emit('update:colorScheme', value)
}

const takeSnapshot = () => {
  emit('takeSnapshot')
}
</script>

<style scoped>
.control-panel {
  padding: 1rem;
}

.control-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
