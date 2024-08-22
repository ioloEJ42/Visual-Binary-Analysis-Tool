<template>
  <div class="control-panel">
    <div class="control-group">
      <el-button @click="zoom(1)">
        <el-icon><Plus /></el-icon>
      </el-button>
      <el-button @click="zoom(-1)">
        <el-icon><Minus /></el-icon>
      </el-button>
      <el-button @click="resetZoom">
        <el-icon><RefreshLeft /></el-icon>
      </el-button>
    </div>
    <div class="control-group">
      <el-popover placement="right" :width="200" trigger="click">
        <template #reference>
          <el-button>
            <el-icon><Grid /></el-icon>
          </el-button>
        </template>
        <div class="view-options">
          <el-radio-group v-model="viewMode" @change="changeView">
            <el-radio label="cluster">Cluster</el-radio>
            <el-radio label="scan">Scan</el-radio>
          </el-radio-group>
        </div>
      </el-popover>
    </div>
    <div class="control-group">
      <el-popover placement="right" :width="200" trigger="click">
        <template #reference>
          <el-button>
            <el-icon><Brush /></el-icon>
          </el-button>
        </template>
        <div class="color-options">
          <el-radio-group v-model="colorScheme" @change="changeColorScheme">
            <el-radio label="grayscale">Grayscale</el-radio>
            <el-radio label="rgb">RGB</el-radio>
            <el-radio label="heatmap">Heatmap</el-radio>
          </el-radio-group>
        </div>
      </el-popover>
    </div>
    <div class="control-group">
      <el-button @click="takeSnapshot">
        <el-icon><Camera /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElButton, ElPopover, ElRadioGroup, ElRadio, ElIcon } from 'element-plus'

const emit = defineEmits(['update:zoom', 'update:view', 'update:colorScheme', 'takeSnapshot'])

const zoomLevel = ref(1)
const viewMode = ref('cluster')
const colorScheme = ref('grayscale')

const zoom = (direction: number) => {
  zoomLevel.value = Math.max(0.1, Math.min(10, zoomLevel.value + direction * 0.1))
  emit('update:zoom', zoomLevel.value)
}

const resetZoom = () => {
  zoomLevel.value = 1
  emit('update:zoom', zoomLevel.value)
}

const changeView = (value: string | number | boolean | undefined) => {
  if (typeof value === 'string') {
    emit('update:view', value)
  }
}

const changeColorScheme = (value: string | number | boolean | undefined) => {
  if (typeof value === 'string') {
    emit('update:colorScheme', value)
  }
}

const takeSnapshot = () => {
  emit('takeSnapshot')
}

watch(zoomLevel, (newZoom) => {
  emit('update:zoom', newZoom)
})

watch(viewMode, (newView) => {
  emit('update:view', newView)
})

watch(colorScheme, (newScheme) => {
  emit('update:colorScheme', newScheme)
})
</script>
<style scoped>
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

.control-group {
  display: flex;
  gap: 5px;
}

.view-options,
.color-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>