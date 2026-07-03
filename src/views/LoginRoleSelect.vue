<template>
  <div class="login-screen d-flex align-center justify-center">
    <v-container style="max-width:960px">
      <div class="text-center mb-10">
        <v-avatar color="secondary" size="56" class="mb-4">
          <v-icon icon="mdi-truck-fast" size="30" />
        </v-avatar>
        <h1 class="text-h4 font-weight-bold text-white mb-2">Myntra Logistics</h1>
        <p class="text-body-1" style="color:rgba(255,255,255,.7)">
          Distribution &amp; transport management platform &mdash; demo workspace
        </p>
      </div>

      <v-row justify="center">
        <v-col v-for="role in roles" :key="role.key" cols="12" sm="4">
          <v-card
            class="role-card pa-6 text-center h-100"
            :elevation="0"
            @click="select(role.key)"
          >
            <v-avatar :color="role.color" size="64" class="mb-4">
              <v-icon :icon="role.icon" size="32" color="white" />
            </v-avatar>
            <div class="text-h6 font-weight-bold mb-1">{{ role.title }}</div>
            <div class="text-body-2 text-medium-emphasis mb-5">{{ role.desc }}</div>
            <v-btn :color="role.color" block variant="flat">Continue as {{ role.title }}</v-btn>
          </v-card>
        </v-col>
      </v-row>

      <p class="text-center text-caption mt-8" style="color:rgba(255,255,255,.5)">
        Demo environment &middot; sample data only &middot; no real credentials required
      </p>
    </v-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const roles = [
  { key: 'admin', title: 'Ops Admin', desc: 'Orders, trips, control tower, invoicing', icon: 'mdi-view-dashboard-outline', color: 'primary' },
  { key: 'customer', title: 'Customer', desc: 'Place orders, track shipments, invoices', icon: 'mdi-account-outline', color: 'secondary' },
  { key: 'driver', title: 'Driver', desc: 'View assigned trips and update status', icon: 'mdi-steering', color: 'accent' },
]

function select(role) {
  auth.loginAs(role)
  if (role === 'admin') router.push({ name: 'admin-dashboard' })
  else if (role === 'customer') router.push({ name: 'portal-dashboard' })
  else router.push({ name: 'driver-trips' })
}
</script>

<style scoped>
.login-screen {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #1c3584 0%, #0e1e4d 55%, #0a1638 100%);
}
.role-card {
  cursor: pointer;
  border-radius: 20px !important;
  transition: transform .18s ease, box-shadow .18s ease;
  background: #fff;
}
.role-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,.25) !important;
}
</style>
