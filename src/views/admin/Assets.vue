<template>
  <div>
    <div class="mb-6">
      <h2 class="text-h5 section-title">Assets</h2>
      <p class="text-body-2 text-medium-emphasis">Drivers and vehicles supporting trip planning</p>
    </div>

    <v-tabs v-model="tab" color="primary" class="mb-4">
      <v-tab value="drivers">Drivers</v-tab>
      <v-tab value="vehicles">Vehicles</v-tab>
    </v-tabs>

    <v-card v-if="tab === 'drivers'">
      <v-table density="comfortable">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Phone</th><th>License</th><th>Branch</th><th>Rating</th><th>Trips</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr v-for="d in store.drivers" :key="d.id">
            <td class="font-weight-medium">{{ d.id }}</td>
            <td>{{ d.name }}</td>
            <td>{{ d.phone }}</td>
            <td>{{ d.license }}</td>
            <td>{{ d.branch }}</td>
            <td>⭐ {{ d.rating }}</td>
            <td>{{ d.trips }}</td>
            <td><StatusChip :status="d.status" /></td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-card v-else>
      <v-table density="comfortable">
        <thead>
          <tr><th>ID</th><th>Reg No.</th><th>Type</th><th>Capacity</th><th>Branch</th><th>Odometer</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr v-for="v in store.vehicles" :key="v.id">
            <td class="font-weight-medium">{{ v.id }}</td>
            <td>{{ v.regNo }}</td>
            <td>{{ v.type }}</td>
            <td>{{ v.capacityKg.toLocaleString('en-IN') }} kg</td>
            <td>{{ v.branch }}</td>
            <td>{{ v.odometer.toLocaleString('en-IN') }} km</td>
            <td><StatusChip :status="v.status" /></td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLogisticsStore } from '../../stores/logistics'
import StatusChip from '../../components/StatusChip.vue'

const store = useLogisticsStore()
const tab = ref('drivers')
</script>
