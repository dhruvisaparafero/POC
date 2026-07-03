<template>
  <div>
    <h2 class="text-h5 section-title mb-1">New Order</h2>
    <p class="text-body-2 text-medium-emphasis mb-6">Create a full-truckload or multi-drop order</p>
    <OrderFormCard @submit="onCreated" @cancel="$router.back()" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import OrderFormCard from '../../components/OrderFormCard.vue'

const router = useRouter()
function onCreated(order) {
  router.push({ name: 'admin-order-detail', params: { id: order.id } })
}
</script>
