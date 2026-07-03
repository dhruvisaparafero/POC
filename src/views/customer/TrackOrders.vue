<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between mb-6 ga-3">
      <div>
        <h2 class="text-h5 section-title">My Orders</h2>
        <p class="text-body-2 text-medium-emphasis">{{ orders.length }} orders placed</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'portal-order-new' }">Place Order</v-btn>
    </div>

    <v-card>
      <v-table density="comfortable">
        <thead>
          <tr><th>Order</th><th>Type</th><th>Stops</th><th>Created</th><th>Status</th><th class="text-right">Value</th></tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id" class="cursor-pointer" @click="$router.push({ name: 'portal-order-detail', params: { id: o.id } })">
            <td class="font-weight-medium">{{ o.id }}</td>
            <td>{{ o.type }}</td>
            <td>{{ o.stops.length }}</td>
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
import { computed } from 'vue'
import { useLogisticsStore } from '../../stores/logistics'
import StatusChip from '../../components/StatusChip.vue'

const store = useLogisticsStore()
const orders = computed(() => store.customerOrders)
</script>
