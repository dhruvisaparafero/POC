<template>
  <div v-if="invoice">
    <div class="d-flex flex-wrap align-center justify-space-between mb-6 ga-3">
      <div>
        <div class="d-flex align-center ga-3">
          <h2 class="text-h5 section-title">{{ invoice.id }}</h2>
          <StatusChip :status="invoice.status" />
        </div>
        <p class="text-body-2 text-medium-emphasis">Order {{ invoice.orderId }} &middot; Issued {{ invoice.issuedAt }} &middot; Due {{ invoice.dueAt }}</p>
      </div>
      <div class="d-flex ga-2">
        <v-btn v-if="invoice.status === 'draft'" variant="tonal" color="info" prepend-icon="mdi-send-outline" @click="invoice.status = 'sent'">Mark Sent</v-btn>
        <v-btn v-if="invoice.status === 'sent'" variant="tonal" color="success" prepend-icon="mdi-check" @click="invoice.status = 'paid'">Mark Paid</v-btn>
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="7">
        <v-card class="pa-5">
          <div class="font-weight-bold mb-3">Line Items</div>
          <v-table density="comfortable">
            <thead><tr><th>Description</th><th class="text-right">Amount</th></tr></thead>
            <tbody>
              <tr v-for="(it, idx) in invoice.items" :key="idx">
                <td>{{ it.desc }}</td>
                <td class="text-right text-mono">₹{{ it.amountInr.toLocaleString('en-IN') }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-divider class="my-3" />
          <div class="d-flex justify-space-between text-h6 font-weight-bold">
            <span>Total</span><span class="text-mono">₹{{ invoice.amountInr.toLocaleString('en-IN') }}</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card class="pa-5">
          <div class="font-weight-bold mb-3">Billed To</div>
          <div class="font-weight-medium">{{ invoice.customer }}</div>
          <v-btn class="mt-4" block variant="tonal" color="primary" :to="{ name: 'admin-order-detail', params: { id: invoice.orderId } }">
            View Source Order
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <v-alert v-else type="warning" variant="tonal">Invoice not found.</v-alert>
</template>

<script setup>
import { computed } from 'vue'
import { useLogisticsStore } from '../../stores/logistics'
import StatusChip from '../../components/StatusChip.vue'

const props = defineProps({ id: String })
const store = useLogisticsStore()
const invoice = computed(() => store.invoiceById(props.id))
</script>
