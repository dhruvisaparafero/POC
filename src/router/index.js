import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'login', component: () => import('../views/LoginRoleSelect.vue'), meta: { public: true } },
  {
    path: '/admin',
    component: () => import('../layouts/AppShell.vue'),
    meta: { role: 'admin' },
    children: [
      { path: '', redirect: { name: 'admin-dashboard' } },
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('../views/admin/Dashboard.vue') },
      { path: 'orders', name: 'admin-orders', component: () => import('../views/admin/Orders.vue') },
      { path: 'orders/new', name: 'admin-order-new', component: () => import('../views/admin/OrderForm.vue') },
      { path: 'orders/:id', name: 'admin-order-detail', component: () => import('../views/admin/OrderDetail.vue'), props: true },
      { path: 'trips', name: 'admin-trips', component: () => import('../views/admin/Trips.vue') },
      { path: 'trips/new', name: 'admin-trip-new', component: () => import('../views/admin/TripForm.vue') },
      { path: 'trips/:id', name: 'admin-trip-detail', component: () => import('../views/admin/TripDetail.vue'), props: true },
      { path: 'control-tower', name: 'admin-control-tower', component: () => import('../views/admin/ControlTower.vue') },
      { path: 'assets', name: 'admin-assets', component: () => import('../views/admin/Assets.vue') },
      { path: 'invoices', name: 'admin-invoices', component: () => import('../views/admin/Invoices.vue') },
      { path: 'invoices/:id', name: 'admin-invoice-detail', component: () => import('../views/admin/InvoiceDetail.vue'), props: true },
    ],
  },
  {
    path: '/portal',
    component: () => import('../layouts/AppShell.vue'),
    meta: { role: 'customer' },
    children: [
      { path: '', redirect: { name: 'portal-dashboard' } },
      { path: 'dashboard', name: 'portal-dashboard', component: () => import('../views/customer/Dashboard.vue') },
      { path: 'orders/new', name: 'portal-order-new', component: () => import('../views/customer/PlaceOrder.vue') },
      { path: 'orders', name: 'portal-orders', component: () => import('../views/customer/TrackOrders.vue') },
      { path: 'orders/:id', name: 'portal-order-detail', component: () => import('../views/customer/OrderDetail.vue'), props: true },
      { path: 'invoices', name: 'portal-invoices', component: () => import('../views/customer/Invoices.vue') },
    ],
  },
  {
    path: '/driver',
    component: () => import('../layouts/AppShell.vue'),
    meta: { role: 'driver' },
    children: [
      { path: '', name: 'driver-trips', component: () => import('../views/driver/MyTrips.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.public) return true
  if (!auth.role) return { name: 'login' }
  if (to.meta.role && to.meta.role !== auth.role) {
    if (auth.role === 'admin') return { name: 'admin-dashboard' }
    if (auth.role === 'customer') return { name: 'portal-dashboard' }
    return { name: 'driver-trips' }
  }
  return true
})

export default router
