<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between mb-4 ga-3">
      <div>
        <h2 class="text-h5 section-title">Control Tower</h2>
        <p class="text-body-2 text-medium-emphasis">Live trip &amp; vehicle positions across all branches</p>
      </div>
      <v-btn-toggle v-model="tab" color="primary" variant="outlined" density="comfortable" mandatory>
        <v-btn value="map" prepend-icon="mdi-map-outline">Map View</v-btn>
        <v-btn value="trips" prepend-icon="mdi-format-list-bulleted">Trips</v-btn>
      </v-btn-toggle>
    </div>

    <v-row class="mb-2">
      <v-col cols="6" sm="3">
        <StatCard label="Trips Active" :value="liveTrips.length" icon="mdi-map-marker-path" color="secondary" />
      </v-col>
      <v-col cols="6" sm="3">
        <StatCard label="Orders in Transit" :value="ordersInTransit" icon="mdi-package-variant-closed" color="primary" />
      </v-col>
      <v-col cols="6" sm="3">
        <StatCard label="Vehicles Deployed" :value="store.vehicles.filter(v => v.status === 'on-trip').length" icon="mdi-truck-outline" color="accent" />
      </v-col>
      <v-col cols="6" sm="3">
        <StatCard label="Drivers On Road" :value="store.drivers.filter(d => d.status === 'on-trip').length" icon="mdi-account-hard-hat-outline" color="success" />
      </v-col>
    </v-row>

    <template v-if="tab === 'map'">
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="pa-3">
            <MapPanel :points="mapPoints" height="520" show-labels @select="onSelect" />
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="pa-5">
            <div class="font-weight-bold mb-3">Trips in Progress</div>
            <v-list density="compact" class="pa-0">
              <v-list-item
                v-for="t in liveTrips" :key="t.id"
                :to="{ name: 'admin-trip-detail', params: { id: t.id } }"
                class="px-0"
              >
                <template #prepend>
                  <v-avatar size="34" :color="store.statusColor(t.status)" variant="tonal">
                    <v-icon icon="mdi-truck-fast-outline" size="16" />
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{ t.id }}</v-list-item-title>
                <v-list-item-subtitle>{{ store.driverById(t.driverId)?.name }} &middot; {{ t.branch }}</v-list-item-subtitle>
                <template #append><StatusChip :status="t.status" /></template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-card>
        <v-table density="comfortable">
          <thead>
            <tr>
              <th>Trip ID</th><th>Orders</th><th>Status</th><th>Service Type</th>
              <th>Source</th><th>Destination</th><th>Driver</th><th>Vehicle No.</th><th>Scheduled</th><th class="text-right">Distance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in store.trips" :key="t.id" class="cursor-pointer" @click="$router.push({ name: 'admin-trip-detail', params: { id: t.id } })">
              <td class="font-weight-medium">{{ t.id }}</td>
              <td>{{ t.orderIds.join(', ') }}</td>
              <td><StatusChip :status="t.status" /></td>
              <td>{{ store.ordersForTrip(t)[0]?.type || '—' }}</td>
              <td class="text-caption">{{ t.branch }}</td>
              <td class="text-caption">{{ store.ordersForTrip(t)[0]?.stops?.[0]?.address || '—' }}</td>
              <td>{{ store.driverById(t.driverId)?.name }}</td>
              <td>{{ store.vehicleById(t.vehicleId)?.regNo }}</td>
              <td>{{ t.scheduledAt }}</td>
              <td class="text-right">{{ t.distanceKm }} km</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLogisticsStore } from '../../stores/logistics'
import StatCard from '../../components/StatCard.vue'
import StatusChip from '../../components/StatusChip.vue'
import MapPanel from '../../components/MapPanel.vue'

const store = useLogisticsStore()
const router = useRouter()
const tab = ref('map')
const liveTrips = computed(() => store.trips.filter((t) => t.status === 'in-transit' || t.status === 'planned'))
const ordersInTransit = computed(() => store.orders.filter((o) => o.status === 'in-transit').length)

const mapPoints = computed(() => liveTrips.value.map((t) => ({
  lat: t.currentPos.lat,
  lng: t.currentPos.lng,
  label: t.id,
  color: pinColor(t.status),
  icon: 'mdi-truck',
  pulse: t.status === 'in-transit',
  id: t.id,
})))

function pinColor(status) {
  const map = { 'in-transit': '#2F6FED', planned: '#0F9E96', delivered: '#1DAA6E', failed: '#E5484D' }
  return map[status] || '#0B1E4D'
}

function onSelect(p) {
  router.push({ name: 'admin-trip-detail', params: { id: p.id } })
}
</script>
