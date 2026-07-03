<template>
  <v-card class="pa-0 overflow-hidden">
    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-6 what-col">
        <div class="section-label mb-4">What details</div>

        <v-select v-if="showCustomer" v-model="form.customerId" :items="customerItems" item-title="title" item-value="value" label="Customer" class="mb-2" />
        <v-row dense>
          <v-col cols="12" sm="6"><v-select v-model="form.type" :items="['FTL', 'LTL']" label="Order Type" /></v-col>
          <v-col cols="12" sm="6"><v-select v-model="form.branch" :items="branches" label="Branch / Region" /></v-col>
        </v-row>

        <v-divider class="my-4" />
        <div class="d-flex justify-space-between align-center mb-3">
          <span class="text-subtitle-2 font-weight-bold">Cargo Items</span>
          <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-plus" @click="addItem">Add Item</v-btn>
        </div>
        <v-row v-for="(item, idx) in form.items" :key="idx" dense align="center">
          <v-col cols="12" sm="5"><v-text-field v-model="item.name" label="Item name" density="compact" /></v-col>
          <v-col cols="4" sm="2"><v-text-field v-model.number="item.qty" type="number" label="Qty" density="compact" /></v-col>
          <v-col cols="4" sm="2"><v-text-field v-model="item.unit" label="Unit" density="compact" /></v-col>
          <v-col cols="4" sm="2"><v-text-field v-model.number="item.unitPrice" type="number" label="Price ₹" density="compact" /></v-col>
          <v-col cols="12" sm="1" class="d-flex justify-end">
            <v-btn icon="mdi-delete-outline" size="small" variant="text" color="error" :disabled="form.items.length === 1" @click="removeItem(idx)" />
          </v-col>
        </v-row>

        <v-divider class="my-4" />
        <div class="text-subtitle-2 font-weight-bold mb-3">Additional Services</div>
        <v-row dense>
          <v-col cols="6"><v-checkbox v-model="form.services.insurance" label="Cargo insurance" density="compact" hide-details /></v-col>
          <v-col cols="6"><v-checkbox v-model="form.services.temperatureControl" label="Temperature control" density="compact" hide-details /></v-col>
          <v-col cols="6"><v-checkbox v-model="form.services.tailLift" label="Tail lift" density="compact" hide-details /></v-col>
          <v-col cols="6"><v-checkbox v-model="form.services.priority" label="Priority handling" density="compact" hide-details /></v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="6" class="pa-6 where-col">
        <div class="section-label mb-4">Where details</div>

        <div class="d-flex justify-space-between align-center mb-3">
          <span class="text-subtitle-2 font-weight-bold">Delivery Stops ({{ form.stops.length }})</span>
          <v-btn size="small" variant="tonal" color="secondary" prepend-icon="mdi-plus" @click="addStop">Add Point</v-btn>
        </div>
        <div v-for="(stop, idx) in form.stops" :key="idx" class="stop-row mb-3">
          <v-avatar size="26" color="secondary" variant="tonal" class="mr-2 mt-2">
            <span class="text-caption font-weight-bold">{{ idx + 1 }}</span>
          </v-avatar>
          <v-row dense class="flex-grow-1">
            <v-col cols="12" sm="8"><v-text-field v-model="stop.address" label="Delivery address" density="compact" /></v-col>
            <v-col cols="8" sm="3"><v-text-field v-model.number="stop.lat" type="number" label="Lat" density="compact" /></v-col>
            <v-col cols="4" sm="1" class="d-flex justify-end">
              <v-btn icon="mdi-delete-outline" size="small" variant="text" color="error" :disabled="form.stops.length === 1" @click="removeStop(idx)" />
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-4" />
        <v-text-field v-model="form.deliveryDate" label="Target delivery date" placeholder="2026-07-10" prepend-inner-icon="mdi-calendar-outline" class="mb-2" />

        <v-divider class="my-4" />
        <div class="text-subtitle-2 font-weight-bold mb-3">Payment Details</div>
        <v-row dense>
          <v-col cols="6"><v-checkbox v-model="form.payment.prepaid" label="Prepaid" density="compact" hide-details @change="onPaymentToggle('prepaid')" /></v-col>
          <v-col cols="6"><v-checkbox v-model="form.payment.credit" label="Credit terms" density="compact" hide-details @change="onPaymentToggle('credit')" /></v-col>
        </v-row>

        <v-card class="pa-4 mt-5" color="primary" variant="tonal" rounded="lg">
          <div class="d-flex justify-space-between text-body-2 mb-1">
            <span>Items</span><span class="font-weight-medium">{{ form.items.length }}</span>
          </div>
          <div class="d-flex justify-space-between text-body-2 mb-1">
            <span>Delivery stops</span><span class="font-weight-medium">{{ form.stops.length }}</span>
          </div>
          <v-divider class="my-2" style="opacity:.2" />
          <div class="d-flex justify-space-between text-subtitle-1 font-weight-bold">
            <span>Estimated value</span><span class="text-mono">₹{{ estimatedValue.toLocaleString('en-IN') }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-divider />
    <div class="d-flex justify-end ga-3 pa-5">
      <v-btn variant="text" @click="$emit('cancel')">Cancel</v-btn>
      <v-btn variant="outlined" color="primary" prepend-icon="mdi-file-document-outline">Request Quotation</v-btn>
      <v-btn color="primary" prepend-icon="mdi-check" @click="submit">{{ submitLabel }}</v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useLogisticsStore } from '../stores/logistics'

const props = defineProps({
  showCustomer: { type: Boolean, default: true },
  fixedCustomerId: { type: String, default: null },
  submitLabel: { type: String, default: 'Create Order' },
})
const emit = defineEmits(['submit', 'cancel'])

const store = useLogisticsStore()
const branches = [
  'Mumbai - Bhiwandi', 'Bengaluru - Bommasandra', 'Chennai - Sriperumbudur',
  'Delhi NCR - Manesar', 'Hyderabad - Shamshabad', 'Kochi - Aluva',
]
const customerItems = computed(() => store.customers.map((c) => ({ title: c.name, value: c.id })))

const form = reactive({
  customerId: props.fixedCustomerId || store.customers[0].id,
  branch: branches[0],
  type: 'LTL',
  deliveryDate: '2026-07-10',
  items: [{ name: '', qty: 1, unit: 'units', unitPrice: 250 }],
  stops: [{ address: '', lat: 19.0760 }],
  services: { insurance: false, temperatureControl: false, tailLift: false, priority: false },
  payment: { prepaid: false, credit: false },
})

function addItem() { form.items.push({ name: '', qty: 1, unit: 'units', unitPrice: 250 }) }
function removeItem(i) { form.items.splice(i, 1) }
function addStop() { form.stops.push({ address: '', lat: 19.0760 }) }
function removeStop(i) { form.stops.splice(i, 1) }
function onPaymentToggle(key) {
  if (key === 'prepaid' && form.payment.prepaid) form.payment.credit = false
  if (key === 'credit' && form.payment.credit) form.payment.prepaid = false
}

const estimatedValue = computed(() => form.items.reduce((s, it) => s + (it.qty || 0) * (it.unitPrice || 0), 0))

function submit() {
  const stops = form.stops.map((s) => ({ address: s.address || 'Delivery address', lat: s.lat || 19.0760, lng: 72.8777 }))
  const order = store.createOrder({
    customerId: form.customerId,
    type: form.type,
    branch: form.branch,
    items: form.items.map((it) => ({ sku: `SKU-${Math.floor(1000 + Math.random() * 8999)}`, name: it.name || 'Item', qty: it.qty || 1, unit: it.unit || 'units', unitPrice: it.unitPrice || 250 })),
    stops,
  })
  emit('submit', order)
}
</script>

<style scoped>
.section-label {
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-secondary));
}
.what-col {
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
.stop-row {
  display: flex;
  align-items: flex-start;
}
</style>
