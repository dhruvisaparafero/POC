<template>
  <v-navigation-drawer v-model="drawer" theme="dark" width="264" class="nav-drawer" permanent>
    <div class="px-5 pt-6 pb-4 d-flex align-center">
      <v-avatar color="secondary" size="38" class="mr-3">
        <v-icon icon="mdi-truck-fast" size="22" />
      </v-avatar>
      <div>
        <div class="text-subtitle-1 font-weight-bold" style="line-height:1.1">Myntra</div>
        <div class="text-caption" style="opacity:.6;letter-spacing:.08em">LOGISTICS</div>
      </div>
    </div>
    <v-divider style="opacity:.1" />
    <v-list nav class="px-3 pt-4" density="comfortable">
      <v-list-item
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        rounded="lg"
        class="mb-1 nav-item"
        color="white"
      />
    </v-list>
  </v-navigation-drawer>

  <v-app-bar flat color="surface" border>
    <v-toolbar-title class="font-weight-bold">{{ pageTitle }}</v-toolbar-title>
    <v-spacer />
    <v-chip class="mr-3" color="primary" variant="tonal" prepend-icon="mdi-account-circle">
      {{ auth.name }}
    </v-chip>
    <v-btn icon="mdi-logout" variant="text" @click="logout" />
  </v-app-bar>

  <v-main style="background:#F1F4FA">
    <v-container fluid class="pa-6">
      <router-view />
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const drawer = ref(true)
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const adminNav = [
  { title: 'Dashboard', to: '/admin/dashboard', icon: 'mdi-view-dashboard-outline' },
  { title: 'Orders', to: '/admin/orders', icon: 'mdi-package-variant-closed' },
  { title: 'Trip Planning', to: '/admin/trips', icon: 'mdi-map-marker-path' },
  { title: 'Control Tower', to: '/admin/control-tower', icon: 'mdi-radar' },
  { title: 'Assets', to: '/admin/assets', icon: 'mdi-truck-outline' },
  { title: 'Invoicing', to: '/admin/invoices', icon: 'mdi-receipt-text-outline' },
]
const customerNav = [
  { title: 'Dashboard', to: '/portal/dashboard', icon: 'mdi-view-dashboard-outline' },
  { title: 'Place Order', to: '/portal/orders/new', icon: 'mdi-plus-box-outline' },
  { title: 'My Orders', to: '/portal/orders', icon: 'mdi-package-variant-closed' },
  { title: 'Invoices', to: '/portal/invoices', icon: 'mdi-receipt-text-outline' },
]
const driverNav = [
  { title: 'My Trips', to: '/driver', icon: 'mdi-map-marker-path' },
]

const navItems = computed(() => {
  if (auth.role === 'admin') return adminNav
  if (auth.role === 'customer') return customerNav
  return driverNav
})

const pageTitle = computed(() => {
  const all = [...adminNav, ...customerNav, ...driverNav]
  const match = all.find((i) => route.path === i.to || (i.to !== '/driver' && route.path.startsWith(i.to)))
  return match?.title || 'Myntra Logistics'
})

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.nav-drawer {
  background: linear-gradient(180deg, #0E2559 0%, #0B1E4D 55%, #081638 100%) !important;
}
.nav-item.v-list-item--active {
  background: rgba(47, 111, 237, 0.28) !important;
}
</style>
