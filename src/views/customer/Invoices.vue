<template>
  <div>
    <div class="mb-6">
      <h2 class="text-h5 section-title">Invoices</h2>
      <p class="text-body-2 text-medium-emphasis">{{ invoices.length }} invoices for {{ store.currentCustomer.name }}</p>
    </div>

    <v-card>
      <v-table density="comfortable">
        <thead>
          <tr><th>Invoice</th><th>Order</th><th>Issued</th><th>Due</th><th>Status</th><th class="text-right">Amount</th></tr>
        </thead>
        <tbody>
          <tr v-for="i in invoices" :key="i.id">
            <td class="font-weight-medium">{{ i.id }}</td>
            <td>{{ i.orderId }}</td>
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
import StatusChip from '../../components/StatusChip.vue'

const store = useLogisticsStore()
const invoices = computed(() => store.customerInvoices)
</script>
