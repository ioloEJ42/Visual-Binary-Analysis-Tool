<template>
  <div class="main-layout">
    <div class="control-panel">
      <!-- Control panel content will go here -->
      <h2>Control Panel</h2>
    </div>
    <div class="binary-visualization">
      <!-- Binary visualization will go here -->
      <h2>Binary Visualization</h2>
    </div>
    <div class="hex-dec-view">
      <!-- Hex/Dec view will go here -->
      <h2>Hex/Dec View</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will go here
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
}

.control-panel {
  width: 20%;
  background-color: #f0f0f0;
  padding: 1rem;
}

.binary-visualization {
  width: 50%;
  background-color: #ffffff;
  padding: 1rem;
}

.hex-dec-view {
  width: 30%;
  background-color: #f9f9f9;
  padding: 1rem;
}
</style>
