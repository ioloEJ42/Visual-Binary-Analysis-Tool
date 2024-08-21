<template>
  <div class="binary-visualization">
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" @wheel="handleZoom"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  filePath: string
  zoom: number
  view: string
  colorScheme: string
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const canvasWidth = 500
const canvasHeight = 500
const zoomLevel = ref(1)
const bytesPerRow = ref(32)
const scanLine = ref(0)

const getColor = (byte: number) => {
  switch (props.colorScheme) {
    case 'rgb':
      return `rgb(${byte}, ${Math.max(0, byte - 85)}, ${Math.max(0, byte - 170)})`
    case 'heatmap':
      return `hsl(${240 - (byte * 240) / 255}, 100%, 50%)`
    default: // grayscale
      return `rgb(${byte}, ${byte}, ${byte})`
  }
}

const drawBinary = async () => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const fileBuffer = await window.electron.readFile(props.filePath)

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  const bytesPerColumn = Math.ceil(fileBuffer.length / bytesPerRow.value)
  const pixelSize =
    Math.min(canvasWidth / bytesPerRow.value, canvasHeight / bytesPerColumn) * zoomLevel.value

  for (let i = 0; i < fileBuffer.length; i++) {
    const x = (i % bytesPerRow.value) * pixelSize
    const y = Math.floor(i / bytesPerRow.value) * pixelSize
    ctx.fillStyle = getColor(fileBuffer[i])
    ctx.fillRect(x, y, pixelSize, pixelSize)
  }

  if (props.view === 'scan') {
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, scanLine.value * pixelSize)
    ctx.lineTo(canvasWidth, scanLine.value * pixelSize)
    ctx.stroke()
  }
}

const handleZoom = (event: WheelEvent) => {
  event.preventDefault()
  const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1
  zoomLevel.value = Math.max(0.1, Math.min(10, zoomLevel.value * zoomFactor))
  drawBinary()
}

const animateScan = () => {
  if (props.view === 'scan') {
    scanLine.value = (scanLine.value + 1) % (fileBuffer.length / bytesPerRow.value)
    drawBinary()
    requestAnimationFrame(animateScan)
  }
}

onMounted(() => {
  drawBinary()
  animateScan()
})

watch(() => props.filePath, drawBinary)
watch(
  () => props.zoom,
  (newZoom) => {
    zoomLevel.value = newZoom
    drawBinary()
  }
)
watch(
  () => props.view,
  (newView) => {
    if (newView === 'scan') {
      animateScan()
    }
    drawBinary()
  }
)
watch(() => props.colorScheme, drawBinary)
</script>

<style scoped>
.binary-visualization {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
