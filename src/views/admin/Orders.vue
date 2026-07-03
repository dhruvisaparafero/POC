<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between mb-6 ga-3">
      <div>
        <h2 class="text-h5 section-title">Orders</h2>
        <p class="text-body-2 text-medium-emphasis">{{ filtered.length }} orders &middot; FTL &amp; multi-drop LTL</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'admin-order-new' }">New Order</v-btn>
    </div>

    <v-card class="pa-4 mb-4">
      <v-row dense>
        <v-col cols="12" sm="4">
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search order or customer" hide-details density="compact" clearable />
        </v-col>
        <v-col cols="12" sm="3">
          <v-select v-model="typeFilter" :items="['All', 'FTL', 'LTL']" label="Type" hide-details density="compact" />
        </v-col>
        <v-col cols="12" sm="3">
          <v-select v-model="statusFilter" :items="statusOptions" label="Status" hide-details density="compact" />
        </v-col>
      </v-row>
    </v-card>

    <v-card>
      <v-table density="comfortable">
        <thead>
          <tr>
            <th>Order</th><th>Customer</th><th>Type</th><th>Stops</th><th>Branch</th><th>Created</th><th>Status</th><th class="text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in filtered" :key="o.id" class="cursor-pointer" @click="$router.push({ name: 'admin-order-detail', params: { id: o.id } })">
            <td class="font-weight-medium">{{ o.id }}</td>
            <td>{{ o.customer }}</td>
            <td><v-chip size="small" variant="outlined">{{ o.type }}</v-chip></td>
            <td>{{ o.stops.length }}</td>
            <td>{{ o.branch }}</td>
            <td>{{ o.createdAt }}</td>
            <td><StatusChip :status="o.status" /></td>
            <td class="text-right text-mono">₹{{ o.valueInr.toLocaleString('en-IN') }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLogisticsStore } from '../../stores/logistics'
import StatusChip from '../../components/StatusChip.vue'

const store = useLogisticsStore()
const search = ref('')
const typeFilter = ref('All')
const statusFilter = ref('All')
const statusOptions = ['All', 'pending', 'planned', 'in-transit', 'delivered', 'failed']

const filtered = computed(() => store.orders.filter((o) => {
  const matchesSearch = !search.value || (o.id + o.customer).toLowerCase().includes(search.value.toLowerCase())
  const matchesType = typeFilter.value === 'All' || o.type === typeFilter.value
  const matchesStatus = statusFilter.value === 'All' || o.status === statusFilter.value
  return matchesSearch && matchesType && matchesStatus
}))
</script>
