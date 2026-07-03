<template>
  <div class="map-panel" :style="{ height: resolvedHeight }">
    <div class="radar-ring ring-1" />
    <div class="radar-ring ring-2" />
    <div class="radar-ring ring-3" />
    <svg class="grid-overlay" preserveAspectRatio="none">
      <line v-for="i in 5" :key="'h'+i" :x1="0" :y1="(i*100/6)+'%'" :x2="'100%'" :y2="(i*100/6)+'%'" />
      <line v-for="i in 7" :key="'v'+i" :x1="(i*100/8)+'%'" :y1="0" :x2="(i*100/8)+'%'" y2="100%" />
    </svg>

    <div
      v-for="(p, idx) in positioned" :key="idx"
      class="pin"
      :class="{ 'pin-pulse': p.pulse }"
      :style="{ left: p.x + '%', top: p.y + '%', '--pin-color': p.color || '#2F6FED' }"
      :title="p.label"
      @click="$emit('select', p.raw)"
    >
      <div class="pin-dot">
        <v-icon v-if="p.icon" :icon="p.icon" size="11" color="white" />
      </div>
      <div v-if="p.label && showLabels" class="pin-label">{{ p.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  points: { type: Array, default: () => [] },
  height: { type: [Number, String], default: 360 },
  showLabels: { type: Boolean, default: false },
})
defineEmits(['select'])

const BOUNDS = { latMin: 7, latMax: 34, lngMin: 70, lngMax: 90 }

const positioned = computed(() => props.points.map((p) => ({
  ...p,
  raw: p,
  x: clamp(((p.lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * 100),
  y: clamp(((BOUNDS.latMax - p.lat) / (BOUNDS.latMax - BOUNDS.latMin)) * 100),
})))

function clamp(v) {
  return Math.min(94, Math.max(4, v))
}

const resolvedHeight = computed(() => {
  const h = props.height
  if (typeof h === 'number') return h + 'px'
  return /^\d+$/.test(h) ? h + 'px' : h
})
</script>

<style scoped>
.map-panel {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 45%, rgba(47,111,237,0.16) 0%, rgba(47,111,237,0.03) 45%, transparent 70%),
    linear-gradient(160deg, #0E2559 0%, #0B1E4D 55%, #081638 100%);
}
.grid-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.grid-overlay line {
  stroke: rgba(255,255,255,0.06);
  stroke-width: 1;
}
.radar-ring {
  position: absolute;
  left: 50%;
  top: 45%;
  border: 1px solid rgba(47,111,237,0.18);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.ring-1 { width: 30%; padding-bottom: 30%; }
.ring-2 { width: 55%; padding-bottom: 55%; }
.ring-3 { width: 80%; padding-bottom: 80%; }

.pin {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pin-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--pin-color);
  border: 2px solid rgba(255,255,255,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.45);
}
.pin-pulse .pin-dot {
  box-shadow: 0 0 0 0 var(--pin-color);
  animation: pulse 2s infinite;
}
.pin-label {
  margin-top: 4px;
  font-size: 10px;
  color: white;
  background: rgba(0,0,0,0.35);
  padding: 1px 6px;
  border-radius: 6px;
  white-space: nowrap;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--pin-color) 55%, transparent); }
  70% { box-shadow: 0 0 0 10px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
</style>
