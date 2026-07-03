<template>
  <div>
    <h2 class="text-h5 section-title mb-1">Plan Trip</h2>
    <p class="text-body-2 text-medium-emphasis mb-6">Group orders, assign a driver &amp; vehicle, and schedule the run</p>

    <v-card class="pa-6">
      <div class="font-weight-bold mb-3">Select Orders</div>
      <v-table density="comfortable" class="mb-5">
        <thead>
          <tr><th width="1"></th><th>Order</th><th>Customer</th><th>Type</th><th>Stops</th><th>Branch</th></tr>
        </thead>
        <tbody>
          <tr v-for="o in store.unplannedOrders" :key="o.id">
            <td><v-checkbox-btn v-model="selectedOrderIds" :value="o.id" /></td>
            <td class="font-weight-medium">{{ o.id }}</td>
            <td>{{ o.customer }}</td>
            <td>{{ o.type }}</td>
            <td>{{ o.stops.length }}</td>
            <td>{{ o.branch }}</td>
          </tr>
        </tbody>
      </v-table>
      <v-alert v-if="!store.unplannedOrders.length" type="info" variant="tonal" class="mb-5">
        No unplanned orders right now — create a new order first.
      </v-alert>

      <v-divider class="mb-5" />
      <v-row>
        <v-col cols="12" md="4">
          <v-select v-model="branch" :items="branches" label="Branch" />
        </v-col>
        <v-col cols="12" md="4">
          <v-select v-model="driverId" :items="driverItems" item-title="title" item-value="value" label="Driver" />
        </v-col>
        <v-col cols="12" md="4">
          <v-select v-model="vehicleId" :items="vehicleItems" item-title="title" item-value="value" label="Vehicle" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="scheduledAt" label="Scheduled at" placeholder="2026-07-04 08:00" />
        </v-col>
      </v-row>

      <div class="d-flex justify-end ga-3 mt-4">
        <v-btn variant="text" @click="$router.back()">Cancel</v-btn>
        <v-btn color="primary" prepend-icon="mdi-check" :disabled="!canSubmit" @click="submit">Confirm Trip</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLogisticsStore } from '../../stores/logistics'

const store = useLogisticsStore()
const route = useRoute()
const router = useRouter()

const branches = ['Mumbai - Bhiwandi', 'Bengaluru - Bommasandra', 'Chennai - Sriperumbudur', 'Delhi NCR - Manesar', 'Hyderabad - Shamshabad', 'Kochi - Aluva']

const selectedOrderIds = ref(route.query.orderId ? [route.query.orderId] : [])
const branch = ref(branches[0])
const driverId = ref(null)
const vehicleId = ref(null)
const scheduledAt = ref('2026-07-04 08:00')

const availableDrivers = computed(() => store.drivers.filter((d) => d.status === 'available'))
const availableVehicles = computed(() => store.vehicles.filter((v) => v.status === 'available'))
const driverItems = computed(() => availableDrivers.value.map((d) => ({ title: `${d.name} (${d.branch})`, value: d.id })))
const vehicleItems = computed(() => availableVehicles.value.map((v) => ({ title: `${v.regNo} — ${v.type}`, value: v.id })))

const canSubmit = computed(() => selectedOrderIds.value.length > 0 && driverId.value && vehicleId.value)

function submit() {
  const trip = store.createTrip({
    orderIds: selectedOrderIds.value,
    driverId: driverId.value,
    vehicleId: vehicleId.value,
    branch: branch.value,
    scheduledAt: scheduledAt.value,
  })
  router.push({ name: 'admin-trip-detail', params: { id: trip.id } })
}
</script>
