<template>
  <div v-if="order">
    <div class="d-flex flex-wrap align-center justify-space-between mb-6 ga-3">
      <div>
        <div class="d-flex align-center ga-3">
          <h2 class="text-h5 section-title">{{ order.id }}</h2>
          <StatusChip :status="order.status" />
          <v-chip size="small" variant="outlined">{{ order.type }}</v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis">{{ order.customer }} &middot; {{ order.branch }} &middot; Created {{ order.createdAt }}</p>
      </div>
      <v-btn v-if="!order.tripId" color="primary" prepend-icon="mdi-map-marker-path" :to="{ name: 'admin-trip-new', query: { orderId: order.id } }">
        Plan Trip
      </v-btn>
      <v-btn v-else variant="tonal" color="secondary" prepend-icon="mdi-truck-fast" :to="{ name: 'admin-trip-detail', params: { id: order.tripId } }">
        View Trip {{ order.tripId }}
      </v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="7">
        <v-card class="pa-5 mb-4">
          <div class="font-weight-bold mb-3">Order Items</div>
          <v-table density="comfortable">
            <thead><tr><th>SKU</th><th>Item</th><th class="text-right">Qty</th><th>Unit</th></tr></thead>
            <tbody>
              <tr v-for="it in order.items" :key="it.sku">
                <td>{{ it.sku }}</td><td>{{ it.name }}</td><td class="text-right">{{ it.qty }}</td><td>{{ it.unit }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider class="my-3" />
          <div class="d-flex justify-space-between">
            <span class="text-medium-emphasis">Order Value</span>
            <span class="font-weight-bold text-mono">₹{{ order.valueInr.toLocaleString('en-IN') }}</span>
          </div>
        </v-card>

        <v-card class="pa-5">
          <div class="font-weight-bold mb-3">Delivery Stops ({{ order.stops.length }})</div>
          <v-timeline density="compact" side="end">
            <v-timeline-item v-for="s in order.stops" :key="s.seq" :dot-color="store.statusColor(s.status)" size="small">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="font-weight-medium">Stop {{ s.seq }}: {{ s.address }}</div>
                  <div class="text-caption text-medium-emphasis">{{ s.lat.toFixed(4) }}, {{ s.lng.toFixed(4) }}</div>
                </div>
                <StatusChip :status="s.status" />
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="pa-5">
          <div class="font-weight-bold mb-3">Customer</div>
          <div class="d-flex align-center ga-3 mb-2">
            <v-avatar color="primary" variant="tonal"><v-icon icon="mdi-domain" /></v-avatar>
            <div>
              <div class="font-weight-medium">{{ order.customer }}</div>
              <div class="text-caption text-medium-emphasis">{{ customer?.contact }}</div>
            </div>
          </div>
          <v-divider class="my-3" />
          <div class="text-body-2 mb-1"><v-icon icon="mdi-email-outline" size="16" class="mr-1" />{{ customer?.email }}</div>
          <div class="text-body-2"><v-icon icon="mdi-phone-outline" size="16" class="mr-1" />{{ customer?.phone }}</div>
        </v-card>

        <v-card v-if="invoice" class="pa-5 mt-4">
          <div class="font-weight-bold mb-3">Invoice</div>
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="font-weight-medium">{{ invoice.id }}</div>
              <div class="text-caption text-medium-emphasis">Due {{ invoice.dueAt }}</div>
            </div>
            <StatusChip :status="invoice.status" />
          </div>
          <v-btn class="mt-3" block variant="tonal" color="primary" :to="{ name: 'admin-invoice-detail', params: { id: invoice.id } }">
            View Invoice
          </v-btn>
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
const customer = computed(() => store.customers.find((c) => c.id === order.value?.customerId))
const invoice = computed(() => order.value && store.invoiceForOrder(order.value.id))
</script>
