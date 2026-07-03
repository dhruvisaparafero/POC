<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between mb-6 ga-3">
      <div>
        <h2 class="text-h5 section-title">Invoicing</h2>
        <p class="text-body-2 text-medium-emphasis">{{ store.invoices.length }} invoices &middot; ₹{{ totalRevenue.toLocaleString('en-IN') }} total value</p>
      </div>
    </div>

    <v-row class="mb-2">
      <v-col cols="12" sm="4" v-for="s in summary" :key="s.status">
        <StatCard :label="s.label" :value="s.count" :icon="s.icon" :color="store.statusColor(s.status)" />
      </v-col>
    </v-row>

    <v-card>
      <v-table density="comfortable">
        <thead>
          <tr><th>Invoice</th><th>Order</th><th>Customer</th><th>Issued</th><th>Due</th><th>Status</th><th class="text-right">Amount</th></tr>
        </thead>
        <tbody>
          <tr v-for="i in store.invoices" :key="i.id" class="cursor-pointer" @click="$router.push({ name: 'admin-invoice-detail', params: { id: i.id } })">
            <td class="font-weight-medium">{{ i.id }}</td>
            <td>{{ i.orderId }}</td>
            <td>{{ i.customer }}</td>
            <td>{{ i.issuedAt }}</td>
            <td>{{ i.dueAt }}</td>
            <td><StatusChip :status="i.status" /></td>
            <td class="text-right text-mono">₹{{ i.amountInr.toLocaleString('en-IN') }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLogisticsStore } from '../../stores/logistics'
import StatCard from '../../components/StatCard.vue'
import StatusChip from '../../components/StatusChip.vue'

const store = useLogisticsStore()
const totalRevenue = computed(() => store.invoices.reduce((s, i) => s + i.amountInr, 0))
const summary = computed(() => ([
  { status: 'draft', label: 'Draft', icon: 'mdi-file-outline', count: store.invoices.filter((i) => i.status === 'draft').length },
  { status: 'sent', label: 'Sent', icon: 'mdi-send-outline', count: store.invoices.filter((i) => i.status === 'sent').length },
  { status: 'paid', label: 'Paid', icon: 'mdi-check-circle-outline', count: store.invoices.filter((i) => i.status === 'paid').length },
]))
</script>
