<template>
  <div class="hex-dec-viewer">
    <div class="controls">
      <el-radio-group v-model="viewMode" size="small">
        <el-radio-button label="hex">Hex</el-radio-button>
        <el-radio-button label="dec">Dec</el-radio-button>
      </el-radio-group>
    </div>
    <div class="viewer" ref="viewer" @scroll="handleScroll">
      <div :style="{ height: totalHeight + 'px' }">
        <pre
          v-for="(line, index) in visibleLines"
          :key="index"
          :style="{ position: 'absolute', top: (index + firstVisibleLine) * lineHeight + 'px' }"
          >{{ line }}</pre
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElRadioGroup, ElRadioButton } from 'element-plus'

const props = defineProps<{
  filePath: string
}>()

const viewMode = ref('hex')
const fileContent = ref<number[]>([])
const viewer = ref<HTMLElement | null>(null)
const firstVisibleLine = ref(0)
const visibleLineCount = ref(0)
const lineHeight = 20
const chunkSize = 16

const loadFileContent = async () => {
  fileContent.value = await window.electron.readFile(props.filePath)
}

const formatLine = (offset: number, chunk: number[]) => {
  const hexValues = chunk.map((byte) => byte.toString(16).padStart(2, '0')).join(' ')
  const decValues = chunk.map((byte) => byte.toString().padStart(3, ' ')).join(' ')
  const asciiValues = chunk
    .map((byte) => (byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.'))
    .join('')

  return (
    `${offset.toString(16).padStart(8, '0')}  ${viewMode.value === 'hex' ? hexValues : decValues}`.padEnd(
      58
    ) + ` |${asciiValues}|`
  )
}

const totalLines = computed(() => Math.ceil(fileContent.value.length / chunkSize))
const totalHeight = computed(() => totalLines.value * lineHeight)

const visibleLines = computed(() => {
  const lines = []
  for (
    let i = firstVisibleLine.value;
    i < firstVisibleLine.value + visibleLineCount.value && i < totalLines.value;
    i++
  ) {
    const offset = i * chunkSize
    const chunk = fileContent.value.slice(offset, offset + chunkSize)
    lines.push(formatLine(offset, chunk))
  }
  return lines
})

const handleScroll = () => {
  if (!viewer.value) return
  firstVisibleLine.value = Math.floor(viewer.value.scrollTop / lineHeight)
}

const updateVisibleLineCount = () => {
  if (!viewer.value) return
  visibleLineCount.value = Math.ceil(viewer.value.clientHeight / lineHeight) + 1
}

watch(() => props.filePath, loadFileContent)
watch(viewMode, () => {
  if (viewer.value) viewer.value.scrollTop = 0
  firstVisibleLine.value = 0
})

onMounted(() => {
  loadFileContent()
  updateVisibleLineCount()
  window.addEventListener('resize', updateVisibleLineCount)
})
</script>

<style scoped>
.hex-dec-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.controls {
  margin-bottom: 1rem;
}

.viewer {
  flex-grow: 1;
  overflow-y: auto;
  font-family: monospace;
  white-space: pre;
  font-size: 12px;
  position: relative;
}
</style>
