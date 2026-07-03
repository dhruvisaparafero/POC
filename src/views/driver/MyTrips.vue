<template>
  <div>
    <div class="mb-6">
      <h2 class="text-h5 section-title">My Trips</h2>
      <p class="text-body-2 text-medium-emphasis">Assigned trips for {{ driver?.name }}</p>
    </div>

    <v-row>
      <v-col cols="12" md="6" v-for="t in myTrips" :key="t.id">
        <v-card class="pa-5">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="font-weight-bold">{{ t.id }}</span>
            <StatusChip :status="t.status" />
          </div>
          <div class="text-body-2 text-medium-emphasis mb-3">{{ t.branch }} &middot; {{ t.scheduledAt }} &middot; {{ t.distanceKm }} km</div>
          <v-divider class="mb-3" />
          <div v-for="o in store.ordersForTrip(t)" :key="o.id" class="d-flex justify-space-between mb-1">
            <span>{{ o.id }} &middot; {{ o.customer }}</span>
            <StatusChip :status="o.status" />
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-alert v-if="!myTrips.length" type="info" variant="tonal">No trips assigned right now.</v-alert>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLogisticsStore } from '../../stores/logistics'
import StatusChip from '../../components/StatusChip.vue'

const store = useLogisticsStore()
const driver = computed(() => store.drivers[0])
const myTrips = computed(() => store.trips.filter((t) => t.driverId === driver.value?.id))
</script>
