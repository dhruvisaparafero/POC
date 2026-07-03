<template>
  <v-chip :color="color" variant="tonal" size="small" density="comfortable" class="text-capitalize font-weight-medium">
    {{ status.replace('-', ' ') }}
  </v-chip>
</template>

<script setup>
import { computed } from 'vue'
import { useLogisticsStore } from '../stores/logistics'

const props = defineProps({ status: { type: String, required: true } })
const store = useLogisticsStore()
const color = computed(() => store.statusColor(props.status))
</script>
