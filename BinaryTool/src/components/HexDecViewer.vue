<template>
  <div class="hex-dec-viewer">
    <div class="controls">
      <el-radio-group v-model="viewMode" size="small">
        <el-radio-button label="hex">Hex</el-radio-button>
        <el-radio-button label="dec">Dec</el-radio-button>
      </el-radio-group>
    </div>
    <div class="viewer" ref="viewer">
      <table>
        <tr>
          <th>Offset</th>
          <th>{{ viewMode.toUpperCase() }}</th>
          <th>ASCII</th>
          <th>EXIF</th>
        </tr>
        <tr v-for="(line, index) in visibleLines" :key="index">
          <td class="offset">{{ line.offset }}</td>
          <td class="hex-dec">{{ line.hexDec }}</td>
          <td class="ascii">{{ line.ascii }}</td>
          <td class="exif">{{ line.exif }}</td>
        </tr>
      </table>
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
const exifData = ref<Record<string, any>>({})

const loadFileContent = async () => {
  fileContent.value = await window.electron.readFile(props.filePath)
  exifData.value = await window.electron.readExifData(props.filePath)
}

const visibleLines = computed(() => {
  const chunkSize = 16
  const lines = []
  for (let i = 0; i < fileContent.value.length; i += chunkSize) {
    const chunk = fileContent.value.slice(i, i + chunkSize)
    const offset = i.toString(16).padStart(8, '0')
    const hexValues = chunk.map(byte => byte.toString(16).padStart(2, '0')).join(' ')
    const decValues = chunk.map(byte => byte.toString().padStart(3, ' ')).join(' ')
    const asciiValues = chunk.map(byte => (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.').join('')
    const exifValue = getExifForOffset(i)
    
    lines.push({
      offset,
      hexDec: viewMode.value === 'hex' ? hexValues : decValues,
      ascii: asciiValues,
      exif: exifValue
    })
  }
  return lines
})

const getExifForOffset = (offset: number) => {
  const exifEntries = Object.entries(exifData.value)
  for (const [key, value] of exifEntries) {
    if (typeof value === 'object' && 'start' in value && 'end' in value) {
      if (offset >= value.start && offset < value.end) {
        return `${key}: ${JSON.stringify(value)}`
      }
    }
  }
  return ''
}

watch(() => props.filePath, loadFileContent)
onMounted(loadFileContent)
</script>

<style scoped>
.hex-dec-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', monospace;
  font-size: 12px;
}

.controls {
  margin-bottom: 1rem;
}

.viewer {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  padding: 4px 8px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  font-weight: 600;
}

.offset {
  color: #888;
}

.hex-dec {
  font-family: monospace;
  white-space: pre;
}

.ascii {
  font-family: monospace;
  color: #00f;
}

.exif {
  color: #080;
}
</style>