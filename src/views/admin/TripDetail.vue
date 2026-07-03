<template>
  <div v-if="trip">
    <div class="d-flex flex-wrap align-center justify-space-between mb-6 ga-3">
      <div>
        <div class="d-flex align-center ga-3">
          <h2 class="text-h5 section-title">{{ trip.id }}</h2>
          <StatusChip :status="trip.status" />
        </div>
        <p class="text-body-2 text-medium-emphasis">{{ trip.branch }} &middot; Scheduled {{ trip.scheduledAt }} &middot; {{ trip.distanceKm }} km</p>
      </div>
      <v-btn
        v-if="trip.status !== 'delivered' && trip.status !== 'failed'"
        color="success" prepend-icon="mdi-check-circle-outline"
        @click="deliver"
      >
        Mark Delivered
      </v-btn>
    </div>

    <v-alert v-if="justInvoiced" type="success" variant="tonal" class="mb-5" closable>
      Trip delivered — invoice <strong>{{ justInvoiced.id }}</strong> generated automatically.
      <router-link :to="{ name: 'admin-invoice-detail', params: { id: justInvoiced.id } }" class="font-weight-bold ml-1">View invoice</router-link>
    </v-alert>

    <v-row>
      <v-col cols="12" md="7">
        <v-card class="pa-5 mb-4">
          <div class="font-weight-bold mb-3">Orders on this Trip</div>
          <v-table density="comfortable">
            <thead><tr><th>Order</th><th>Customer</th><th>Type</th><th>Stops</th><th>Status</th></tr></thead>
            <tbody>
              <tr v-for="o in orders" :key="o.id" class="cursor-pointer" @click="$router.push({ name: 'admin-order-detail', params: { id: o.id } })">
                <td class="font-weight-medium">{{ o.id }}</td>
                <td>{{ o.customer }}</td>
                <td>{{ o.type }}</td>
                <td>{{ o.stops.length }}</td>
                <td><StatusChip :status="o.status" /></td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <v-card class="pa-5">
          <div class="font-weight-bold mb-3">Route Map</div>
          <MapPanel :points="mapPoints" height="320" show-labels />
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="pa-5 mb-4">
          <div class="font-weight-bold mb-3">Driver</div>
          <div class="d-flex align-center ga-3">
            <v-avatar color="secondary" variant="tonal"><v-icon icon="mdi-account" /></v-avatar>
            <div>
              <div class="font-weight-medium">{{ driver?.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ driver?.phone }} &middot; ⭐ {{ driver?.rating }}</div>
            </div>
          </div>
        </v-card>
        <v-card class="pa-5">
          <div class="font-weight-bold mb-3">Vehicle</div>
          <div class="d-flex align-center ga-3">
            <v-avatar color="accent" variant="tonal"><v-icon icon="mdi-truck-outline" /></v-avatar>
            <div>
              <div class="font-weight-medium">{{ vehicle?.regNo }}</div>
              <div class="text-caption text-medium-emphasis">{{ vehicle?.type }} &middot; {{ vehicle?.capacityKg }} kg capacity</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <v-alert v-else type="warning" variant="tonal">Trip not found.</v-alert>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLogisticsStore } from '../../stores/logistics'
import StatusChip from '../../components/StatusChip.vue'
import MapPanel from '../../components/MapPanel.vue'

const props = defineProps({ id: String })
const store = useLogisticsStore()
const justInvoiced = ref(null)

const trip = computed(() => store.tripById(props.id))
const orders = computed(() => (trip.value ? store.ordersForTrip(trip.value) : []))
const driver = computed(() => trip.value && store.driverById(trip.value.driverId))
const vehicle = computed(() => trip.value && store.vehicleById(trip.value.vehicleId))
const allStops = computed(() => orders.value.flatMap((o) => o.stops))
const mapPoints = computed(() => allStops.value.map((s) => ({
  lat: s.lat, lng: s.lng, label: `Stop ${s.seq}`, color: store.statusColor(s.status) === 'success' ? '#1DAA6E' : '#2F6FED', icon: 'mdi-map-marker',
})))

function deliver() {
  justInvoiced.value = store.markTripDelivered(props.id)
}
</script>
