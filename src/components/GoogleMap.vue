<template>
  <div class="google-map" :style="{ height: resolvedHeight }">
    <iframe
      :src="embedUrl"
      width="100%"
      height="100%"
      style="border:0"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  points: { type: Array, default: () => [] },
  height: { type: [Number, String], default: 300 },
  zoom: { type: Number, default: 11 },
})

const resolvedHeight = computed(() => {
  const h = props.height
  if (typeof h === 'number') return h + 'px'
  return /^\d+$/.test(h) ? h + 'px' : h
})

// Multi-waypoint /maps/dir/ embeds get blocked by Google's frame policy in
// keyless mode, so always fall back to a single centered point (centroid).
const embedUrl = computed(() => {
  const pts = props.points.filter((p) => p && p.lat && p.lng)
  if (!pts.length) {
    return 'https://www.google.com/maps?q=India&z=5&output=embed'
  }
  const lat = pts.reduce((s, p) => s + p.lat, 0) / pts.length
  const lng = pts.reduce((s, p) => s + p.lng, 0) / pts.length
  const zoom = pts.length > 1 ? Math.min(props.zoom, 9) : props.zoom
  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`
})
</script>

<style scoped>
.google-map {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #E3E7F1;
}
</style>
