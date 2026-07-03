<template>
  <div v-if="order">
    <div class="d-flex flex-wrap align-center justify-space-between mb-6 ga-3">
      <div>
        <div class="d-flex align-center ga-3">
          <h2 class="text-h5 section-title">{{ order.id }}</h2>
          <StatusChip :status="order.status" />
        </div>
        <p class="text-body-2 text-medium-emphasis">Placed {{ order.createdAt }} &middot; {{ order.type }}</p>
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="7">
        <v-card class="pa-5 mb-4">
          <div class="font-weight-bold mb-3">Items</div>
          <v-table density="comfortable">
            <thead><tr><th>Item</th><th class="text-right">Qty</th><th>Unit</th></tr></thead>
            <tbody>
              <tr v-for="it in order.items" :key="it.sku">
                <td>{{ it.name }}</td><td class="text-right">{{ it.qty }}</td><td>{{ it.unit }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
        <v-card class="pa-5">
          <div class="font-weight-bold mb-3">Delivery Progress</div>
          <v-timeline density="compact" side="end">
            <v-timeline-item v-for="s in order.stops" :key="s.seq" :dot-color="store.statusColor(s.status)" size="small">
              <div class="d-flex justify-space-between align-center">
                <div class="font-weight-medium">{{ s.address }}</div>
                <StatusChip :status="s.status" />
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card class="pa-5">
          <div class="font-weight-bold mb-3">Order Summary</div>
          <div class="d-flex justify-space-between mb-1"><span class="text-medium-emphasis">Value</span><span class="font-weight-bold text-mono">₹{{ order.valueInr.toLocaleString('en-IN') }}</span></div>
          <div class="d-flex justify-space-between"><span class="text-medium-emphasis">Branch</span><span>{{ order.branch }}</span></div>
        </v-card>
        <v-card v-if="invoice" class="pa-5 mt-4">
          <div class="font-weight-bold mb-3">Invoice</div>
          <div class="d-flex justify-space-between align-center">
            <div class="font-weight-medium">{{ invoice.id }}</div>
            <StatusChip :status="invoice.status" />
          </div>
          <v-btn class="mt-3" block variant="tonal" color="primary" :to="{ name: 'portal-invoices' }">View Invoices</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <v-alert v-else type="warning" variant="tonal">Order not found.</v-alert>
</template>

<script setup>
import { computed } from 'vue'
import { useLogisticsStore } from '../../stores/logistics'
import StatusChip from '../../components/StatusChip.vue'

const props = defineProps({ id: String })
const store = useLogisticsStore()
const order = computed(() => store.orderById(props.id))
const invoice = computed(() => order.value && store.invoiceForOrder(order.value.id))
</script>
