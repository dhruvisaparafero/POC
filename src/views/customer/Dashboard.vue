<template>
  <div>
    <div class="mb-6">
      <h2 class="text-h5 section-title">Welcome, {{ store.currentCustomer.contact }}</h2>
      <p class="text-body-2 text-medium-emphasis">{{ store.currentCustomer.name }} &middot; {{ store.currentCustomer.city }}</p>
    </div>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <StatCard label="Total Orders" :value="orders.length" icon="mdi-package-variant-closed" color="primary" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <StatCard label="In Transit" :value="inTransit" icon="mdi-truck-fast-outline" color="secondary" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <StatCard label="Delivered" :value="delivered" icon="mdi-check-circle-outline" color="success" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <StatCard label="Open Invoices" :value="openInvoices" icon="mdi-receipt-text-outline" color="accent" />
      </v-col>
    </v-row>

    <v-row class="mt-1">
      <v-col cols="12">
        <v-card class="pa-5">
          <div class="d-flex justify-space-between align-center mb-3">
            <span class="font-weight-bold">Recent Orders</span>
            <v-btn size="small" variant="text" color="primary" :to="{ name: 'portal-orders' }">Track all</v-btn>
          </div>
          <v-table density="comfortable">
            <thead><tr><th>Order</th><th>Type</th><th>Stops</th><th>Status</th><th class="text-right">Value</th></tr></thead>
            <tbody>
              <tr v-for="o in orders.slice(0, 6)" :key="o.id" class="cursor-pointer" @click="$router.push({ name: 'portal-order-detail', params: { id: o.id } })">
                <td class="font-weight-medium">{{ o.id }}</td>
                <td>{{ o.type }}</td>
                <td>{{ o.stops.length }}</td>
                <td><StatusChip :status="o.status" /></td>
                <td class="text-right text-mono">₹{{ o.valueInr.toLocaleString('en-IN') }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLogisticsStore } from '../../stores/logistics'
import StatCard from '../../components/StatCard.vue'
import StatusChip from '../../components/StatusChip.vue'

const store = useLogisticsStore()
const orders = computed(() => store.customerOrders)
const inTransit = computed(() => orders.value.filter((o) => o.status === 'in-transit').length)
const delivered = computed(() => orders.value.filter((o) => o.status === 'delivered').length)
const openInvoices = computed(() => store.customerInvoices.filter((i) => i.status !== 'paid').length)
</script>
