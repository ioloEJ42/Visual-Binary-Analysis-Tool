<template>
  <div class="binary-visualization-container">
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps<{
  filePath: string,
  zoom: number,
  view: string,
  colorScheme: string
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const canvasWidth = ref(0)
const canvasHeight = ref(0)
const bytesPerRow = 32

const updateCanvasSize = () => {
  if (canvas.value) {
    const container = canvas.value.parentElement;
    if (container) {
      canvasWidth.value = container.clientWidth;
      canvasHeight.value = Math.max(container.clientHeight, calculateMinHeight());
      console.log("Canvas size updated:", canvasWidth.value, canvasHeight.value);
    } else {
      console.error("Canvas parent element not found");
    }
  } else {
    console.error("Canvas element not found");
  }
}

const calculateMinHeight = () => {
  // Calculate the minimum height based on file size and zoom level
  // This is a placeholder calculation, adjust as needed
  return 1000 * props.zoom
}

const getColor = (byte: number) => {
  switch (props.colorScheme) {
    case 'rgb':
      return `rgb(${byte}, ${Math.max(0, byte - 85)}, ${Math.max(0, byte - 170)})`
    case 'heatmap':
      return `hsl(${240 - byte * 240 / 255}, 100%, 50%)`
    default: // grayscale
      return `rgb(${byte}, ${byte}, ${byte})`
  }
}

const drawBinary = async () => {
  console.log("Drawing binary, file path:", props.filePath);
  if (!canvas.value) {
    console.error("Canvas element not found");
    return;
  }
  const ctx = canvas.value.getContext('2d');
  if (!ctx) {
    console.error("Could not get 2D context");
    return;
  }

  try {
    const fileBuffer = await window.electron.readFile(props.filePath);
    console.log("File buffer length:", fileBuffer.length);
    // ... rest of the function
  } catch (error) {
    console.error("Error reading file:", error);
  }

  const fileBuffer = await window.electron.readFile(props.filePath)
  
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  const totalBytes = fileBuffer.length
  const bytesPerColumn = Math.ceil(totalBytes / bytesPerRow)
  const pixelSize = (canvasWidth.value / bytesPerRow) * props.zoom

  canvasHeight.value = Math.max(calculateMinHeight(), bytesPerColumn * pixelSize)
  canvas.value.height = canvasHeight.value

  for (let i = 0; i < totalBytes; i++) {
    const x = (i % bytesPerRow) * pixelSize
    const y = Math.floor(i / bytesPerRow) * pixelSize
    ctx.fillStyle = getColor(fileBuffer[i])
    ctx.fillRect(x, y, pixelSize, pixelSize)
  }

  if (props.view === 'scan') {
    // Add scan line visualization logic here
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    const scanLineY = (Date.now() / 20) % canvasHeight.value
    ctx.beginPath()
    ctx.moveTo(0, scanLineY)
    ctx.lineTo(canvasWidth.value, scanLineY)
    ctx.stroke()
  }
}

onMounted(() => {
  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)
  drawBinary()
})

watch([() => props.filePath, () => props.zoom, () => props.view, () => props.colorScheme], () => {
  console.log("Props changed:", props.filePath, props.zoom, props.view, props.colorScheme);
  nextTick(() => {
    updateCanvasSize();
    drawBinary();
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize)
})
</script>

<style scoped>
.binary-visualization-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

canvas {
  width: 100%;
  display: block;
}
</style>