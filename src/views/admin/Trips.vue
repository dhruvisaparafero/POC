<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between mb-6 ga-3">
      <div>
        <h2 class="text-h5 section-title">Trip Planning</h2>
        <p class="text-body-2 text-medium-emphasis">{{ store.trips.length }} trips &middot; {{ store.unplannedOrders.length }} orders awaiting a trip</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'admin-trip-new' }">Plan Trip</v-btn>
    </div>

    <v-card>
      <v-table density="comfortable">
        <thead>
          <tr>
            <th>Trip</th><th>Orders</th><th>Driver</th><th>Vehicle</th><th>Branch</th><th>Scheduled</th><th>Distance</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in store.trips" :key="t.id" class="cursor-pointer" @click="$router.push({ name: 'admin-trip-detail', params: { id: t.id } })">
            <td class="font-weight-medium">{{ t.id }}</td>
            <td>{{ t.orderIds.length }}</td>
            <td>{{ store.driverById(t.driverId)?.name }}</td>
            <td>{{ store.vehicleById(t.vehicleId)?.regNo }}</td>
            <td>{{ t.branch }}</td>
            <td>{{ t.scheduledAt }}</td>
            <td>{{ t.distanceKm }} km</td>
            <td><StatusChip :status="t.status" /></td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { useLogisticsStore } from '../../stores/logistics'
import StatusChip from '../../components/StatusChip.vue'

const store = useLogisticsStore()
</script>
