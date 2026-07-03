<template>
  <v-card class="stat-card pa-5" height="100%">
    <div class="d-flex align-start justify-space-between mb-3">
      <v-avatar :color="color" variant="tonal" size="42" rounded="lg">
        <v-icon :icon="icon" size="22" :color="color" />
      </v-avatar>
      <v-chip v-if="trend" size="small" :color="trendColor" variant="tonal" density="comfortable">
        <v-icon start :icon="trendIcon" size="14" />{{ trend }}
      </v-chip>
    </div>
    <div class="text-h5 font-weight-bold text-mono">{{ value }}</div>
    <div class="text-body-2 text-medium-emphasis mt-1">{{ label }}</div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: [String, Number],
  icon: String,
  color: { type: String, default: 'primary' },
  trend: String,
  trendDirection: { type: String, default: 'up' },
})

const trendIcon = computed(() => (props.trendDirection === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'))
const trendColor = computed(() => (props.trendDirection === 'up' ? 'success' : 'error'))
</script>
