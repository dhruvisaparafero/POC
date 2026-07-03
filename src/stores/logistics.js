import { defineStore } from 'pinia'
import { orders as seedOrders } from '../data/orders'
import { trips as seedTrips } from '../data/trips'
import { invoices as seedInvoices } from '../data/invoices'
import { drivers as seedDrivers } from '../data/drivers'
import { vehicles as seedVehicles } from '../data/vehicles'
import { customers as seedCustomers, currentCustomer } from '../data/customers'

const STATUS_COLORS = {
  pending: 'warning', planned: 'info', 'in-transit': 'secondary', delivered: 'success', failed: 'error',
  draft: 'on-surface-variant', sent: 'info', paid: 'success',
  available: 'success', 'on-trip': 'secondary', 'off-duty': 'on-surface-variant', maintenance: 'warning',
}

let orderSeq = 8855
let tripSeq = 3311
let invoiceSeq = 9006

export const useLogisticsStore = defineStore('logistics', {
  state: () => ({
    orders: seedOrders.map((o) => ({ ...o })),
    trips: seedTrips.map((t) => ({ ...t })),
    invoices: seedInvoices.map((i) => ({ ...i })),
    drivers: seedDrivers.map((d) => ({ ...d })),
    vehicles: seedVehicles.map((v) => ({ ...v })),
    customers: seedCustomers,
    currentCustomer,
  }),
  getters: {
    statusColor: () => (status) => STATUS_COLORS[status] || 'on-surface-variant',

    kpis(state) {
      const total = state.orders.length
      const active = state.trips.filter((t) => t.status === 'in-transit' || t.status === 'planned').length
      const delivered = state.orders.filter((o) => o.status === 'delivered').length
      const failed = state.orders.filter((o) => o.status === 'failed').length
      const onTimeRate = total ? Math.round(((delivered) / (delivered + failed || 1)) * 100) : 0
      const busyVehicles = state.vehicles.filter((v) => v.status === 'on-trip').length
      const fleetUtilization = Math.round((busyVehicles / state.vehicles.length) * 100)
      const busyDrivers = state.drivers.filter((d) => d.status === 'on-trip').length
      const driverUtilization = Math.round((busyDrivers / state.drivers.length) * 100)
      const revenue = state.invoices.reduce((s, i) => s + i.amountInr, 0)
      return { total, active, delivered, failed, onTimeRate, fleetUtilization, driverUtilization, revenue }
    },

    orderVolumeTrend(state) {
      const byDate = {}
      for (const o of state.orders) {
        byDate[o.createdAt] = (byDate[o.createdAt] || 0) + 1
      }
      const dates = Object.keys(byDate).sort()
      return { dates, counts: dates.map((d) => byDate[d]) }
    },

    deliveryStatusMix(state) {
      const buckets = ['pending', 'planned', 'in-transit', 'delivered', 'failed']
      return buckets.map((b) => ({ status: b, count: state.orders.filter((o) => o.status === b).length }))
    },

    branchUtilization(state) {
      const byBranch = {}
      for (const v of state.vehicles) {
        byBranch[v.branch] = byBranch[v.branch] || { total: 0, busy: 0 }
        byBranch[v.branch].total += 1
        if (v.status === 'on-trip') byBranch[v.branch].busy += 1
      }
      return Object.entries(byBranch).map(([branch, v]) => ({
        branch, utilization: Math.round((v.busy / v.total) * 100),
      }))
    },

    driverById: (state) => (id) => state.drivers.find((d) => d.id === id),
    vehicleById: (state) => (id) => state.vehicles.find((v) => v.id === id),
    orderById: (state) => (id) => state.orders.find((o) => o.id === id),
    tripById: (state) => (id) => state.trips.find((t) => t.id === id),
    invoiceById: (state) => (id) => state.invoices.find((i) => i.id === id),
    ordersForTrip: (state) => (trip) => state.orders.filter((o) => trip.orderIds.includes(o.id)),
    invoiceForOrder: (state) => (orderId) => state.invoices.find((i) => i.orderId === orderId),
    unplannedOrders: (state) => state.orders.filter((o) => !o.tripId),

    customerOrders: (state) => state.orders.filter((o) => o.customerId === state.currentCustomer.id),
    customerInvoices: (state) => state.invoices.filter((i) => i.customerId === state.currentCustomer.id),
  },
  actions: {
    createOrder({ customerId, type, branch, items, stops }) {
      const customer = this.customers.find((c) => c.id === customerId)
      const id = `ORD-${orderSeq++}`
      const order = {
        id, customerId, customer: customer?.name || 'Unknown Customer', type, branch,
        createdAt: '2026-07-03', status: 'pending', tripId: null, items,
        stops: stops.map((s, idx) => ({ seq: idx + 1, ...s, status: 'pending' })),
        valueInr: items.reduce((s, it) => s + (it.qty * (it.unitPrice || 250)), 0),
      }
      this.orders.unshift(order)
      return order
    },

    createTrip({ orderIds, driverId, vehicleId, branch, scheduledAt }) {
      const id = `TRP-${tripSeq++}`
      const firstOrder = this.orders.find((o) => o.id === orderIds[0])
      const trip = {
        id, orderIds, driverId, vehicleId, branch, scheduledAt,
        status: 'planned', distanceKm: 20 + Math.round(orderIds.length * 12.5),
        currentPos: firstOrder?.stops?.[0] ? { lat: firstOrder.stops[0].lat, lng: firstOrder.stops[0].lng } : { lat: 19.0760, lng: 72.8777 },
      }
      this.trips.unshift(trip)
      for (const oid of orderIds) {
        const order = this.orderById(oid)
        if (order) {
          order.tripId = id
          order.status = 'planned'
          order.stops.forEach((s) => { s.status = 'planned' })
        }
      }
      const driver = this.driverById(driverId)
      const vehicle = this.vehicleById(vehicleId)
      if (driver) driver.status = 'on-trip'
      if (vehicle) vehicle.status = 'on-trip'
      return trip
    },

    markTripDelivered(tripId) {
      const trip = this.tripById(tripId)
      if (!trip || trip.status === 'delivered') return null
      trip.status = 'delivered'
      const relatedOrders = this.ordersForTrip(trip)
      let invoice = null
      for (const order of relatedOrders) {
        order.status = 'delivered'
        order.stops.forEach((s) => { s.status = 'delivered' })
        if (!this.invoiceForOrder(order.id)) {
          const id = `INV-${invoiceSeq++}`
          invoice = {
            id, orderId: order.id, customerId: order.customerId, customer: order.customer,
            issuedAt: '2026-07-03', dueAt: '2026-07-18', status: 'draft', amountInr: order.valueInr,
            items: order.items.map((it) => ({ desc: `${it.name} x ${it.qty}`, amountInr: Math.round(order.valueInr / order.items.length) })),
          }
          this.invoices.unshift(invoice)
        }
      }
      const driver = this.driverById(trip.driverId)
      const vehicle = this.vehicleById(trip.vehicleId)
      if (driver) driver.status = 'available'
      if (vehicle) vehicle.status = 'available'
      return invoice
    },
  },
})
