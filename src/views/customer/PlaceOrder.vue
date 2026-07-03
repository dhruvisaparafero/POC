<template>
  <div>
    <h2 class="text-h5 section-title mb-1">Place a New Order</h2>
    <p class="text-body-2 text-medium-emphasis mb-6">Add items and delivery stops — our team will confirm scheduling</p>
    <OrderFormCard
      :show-customer="false"
      :fixed-customer-id="store.currentCustomer.id"
      submit-label="Place Order"
      @submit="onCreated"
      @cancel="$router.push({ name: 'portal-dashboard' })"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useLogisticsStore } from '../../stores/logistics'
import OrderFormCard from '../../components/OrderFormCard.vue'

const store = useLogisticsStore()
const router = useRouter()
function onCreated(order) {
  router.push({ name: 'portal-order-detail', params: { id: order.id } })
}
</script>
