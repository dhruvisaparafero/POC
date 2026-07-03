<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between mb-6 ga-3">
      
      <div class="d-flex align-center ga-3">
        <v-select
          v-model="range" :items="['March 2026', 'Last 7 days', 'Last 30 days']" hide-details density="compact"
          style="min-width:170px" prepend-inner-icon="mdi-calendar-blank-outline"
        />
        <v-btn variant="outlined" color="primary" prepend-icon="mdi-tray-arrow-down">Export CSV</v-btn>
      </div>
    </div>

    <v-row>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 d-flex align-center ga-3">
          <v-avatar size="42" color="primary" variant="tonal" rounded="lg"><v-icon icon="mdi-package-variant-closed" size="20" /></v-avatar>
          <div>
            <div class="text-caption text-medium-emphasis">Total Shipments</div>
            <div class="d-flex align-baseline ga-2">
              <span class="text-h5 font-weight-bold text-mono">{{ kpis.total }}</span>
              <span class="text-caption">vs last month: {{ prevMonth.total }} <span class="text-success font-weight-bold">↗{{ pctChange(kpis.total, prevMonth.total) }}%</span></span>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 d-flex align-center ga-3">
          <v-avatar size="42" color="secondary" variant="tonal" rounded="lg"><v-icon icon="mdi-truck-fast-outline" size="20" /></v-avatar>
          <div>
            <div class="text-caption text-medium-emphasis">In-Transit</div>
            <div class="d-flex align-baseline ga-2">
              <span class="text-h5 font-weight-bold text-mono">{{ inTransitCount }}</span>
              <span class="text-caption">vs last month: {{ prevMonth.inTransit }} <span class="text-error font-weight-bold">↘{{ pctChange(inTransitCount, prevMonth.inTransit) }}%</span></span>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 d-flex align-center ga-3">
          <v-avatar size="42" color="success" variant="tonal" rounded="lg"><v-icon icon="mdi-check-circle-outline" size="20" /></v-avatar>
          <div>
            <div class="text-caption text-medium-emphasis">Delivered</div>
            <div class="d-flex align-baseline ga-2">
              <span class="text-h5 font-weight-bold text-mono">{{ kpis.delivered }}</span>
              <span class="text-caption">vs last month: {{ prevMonth.delivered }} <span class="text-error font-weight-bold">↘{{ pctChange(kpis.delivered, prevMonth.delivered) }}%</span></span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-1">
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-5" height="100%">
          <div class="d-flex justify-space-between align-center mb-n2">
            <div>
              <div class="font-weight-bold">Analytical View</div>
              <div class="text-caption text-medium-emphasis">Total shipment revenue overview</div>
            </div>
            <v-icon icon="mdi-dots-horizontal" size="18" />
          </div>
          <apexchart type="radialBar" height="190" :options="revenueChartOptions" :series="[revenuePercent]" />
          <div class="text-center mt-n10">
            <div class="text-h5 font-weight-bold text-mono">₹{{ formatCompact(kpis.revenue) }}</div>
            <div class="text-caption text-success">↗ 25% than last week</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-5" height="100%">
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="font-weight-bold">Branch Wise Revenue</div>
              <div class="text-caption text-medium-emphasis">Revenue distribution by branch</div>
            </div>
            <v-chip color="success" variant="tonal" size="small" class="font-weight-bold">
              ₹{{ kpis.revenue.toLocaleString('en-IN') }}
            </v-chip>
          </div>
          <apexchart type="donut" height="230" :options="branchRevenueOptions" :series="branchRevenueSeries" />
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-5" height="100%">
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="font-weight-bold">Tracking Delivery</div>
              <div class="text-caption text-medium-emphasis">Last viewed delivery history</div>
            </div>
            <v-icon icon="mdi-dots-horizontal" size="18" />
          </div>
          <MapPanel v-if="trackedStop" :points="[{ lat: trackedStop.lat, lng: trackedStop.lng, color: '#2F6FED', icon: 'mdi-truck', pulse: true, label: trackedOrder?.branch }]" height="150" show-labels class="mb-3" />
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 font-weight-medium">{{ trackedOrder?.id }}</span>
            <StatusChip v-if="trackedOrder" :status="trackedOrder.status" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-1">
      <v-col cols="12" md="8">
        <v-card class="pa-5" height="100%">
          <div class="d-flex justify-space-between align-center mb-2">
            <div>
              <div class="font-weight-bold">Shipments Statistics</div>
              <div class="text-caption text-medium-emphasis">Total number of deliveries: {{ kpis.total * 40 }}</div>
            </div>
            <v-select v-model="statsPeriod" :items="['Year', 'Quarter']" hide-details density="compact" style="max-width:120px" />
          </div>
          <apexchart type="bar" height="290" :options="monthlyChartOptions" :series="monthlySeries" />
        </v-card>
      </v-col>
      <v-col cols="12" md="4" class="d-flex flex-column ga-3">
        <v-card class="pa-4 d-flex align-center justify-space-between">
          <div>
            <div class="text-caption text-medium-emphasis mb-1">Delivery Vehicle</div>
            <div class="text-h4 font-weight-bold text-mono">{{ onRoadVehicles }}</div>
            <div class="text-caption text-error font-weight-medium">↘ 7.69% <span class="text-medium-emphasis">than last week</span></div>
            <v-chip class="mt-2" color="secondary" variant="flat" size="small" prepend-icon="mdi-circle-medium">On-Route</v-chip>
          </div>
          <v-avatar size="64" color="secondary" variant="tonal" rounded="lg">
            <v-icon icon="mdi-truck-fast" size="32" />
          </v-avatar>
        </v-card>

        <v-card class="pa-4 flex-grow-1">
          <div class="font-weight-bold mb-3">Top Products with Order Counts</div>
          <div v-for="(p, idx) in topProducts" :key="p.name" class="d-flex align-center justify-space-between product-row" :class="{ 'mb-2': idx < topProducts.length - 1 }">
            <span class="text-body-2 text-medium-emphasis product-name">{{ idx + 1 }}. {{ p.name }}</span>
            <span class="leader" />
            <span class="text-body-2 font-weight-bold">{{ p.count }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-1">
      <v-col cols="12">
        <v-card class="pa-5">
          <div class="d-flex flex-wrap justify-space-between align-center mb-3 ga-3">
            <div>
              <div class="font-weight-bold">Shipments Activities</div>
              <div class="text-caption text-medium-emphasis">Keep track of recent shipment activities</div>
            </div>
            <div class="d-flex align-center ga-2">
              <v-chip
                v-for="f in activityFilters" :key="f"
                :color="activityFilter === f ? 'secondary' : undefined"
                :variant="activityFilter === f ? 'flat' : 'outlined'"
                size="small" class="text-capitalize" @click="activityFilter = f"
              >{{ f }}</v-chip>
              <v-btn icon="mdi-tune-variant" size="small" variant="outlined" density="comfortable" />
              <v-btn icon="mdi-calendar-blank-outline" size="small" variant="outlined" density="comfortable" />
            </div>
          </div>
          <v-table density="comfortable">
            <thead>
              <tr>
                <th width="1"><v-checkbox-btn disabled /></th>
                <th>Order Id</th><th>Category</th><th>Company</th><th>Arrival Time</th><th>Route</th><th>Price</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in activityOrders" :key="o.id" class="cursor-pointer" @click="$router.push({ name: 'admin-order-detail', params: { id: o.id } })">
                <td @click.stop><v-checkbox-btn /></td>
                <td class="font-weight-medium">#{{ o.id }}</td>
                <td>{{ o.items[0]?.name?.split(' ')[0] || 'Goods' }}</td>
                <td>{{ o.customer }}</td>
                <td>{{ o.createdAt }} 10:00 AM</td>
                <td class="text-caption text-medium-emphasis">{{ o.branch }}</td>
                <td class="text-mono">₹{{ o.valueInr.toLocaleString('en-IN') }}</td>
                <td><StatusChip :status="o.status" /></td>
              </tr>
            </tbody>
          </v-table>
          <div class="d-flex justify-space-between align-center mt-3">
            <span class="text-caption text-medium-emphasis">1-{{ activityOrders.length }} of {{ store.orders.length }}</span>
            <div class="d-flex ga-1">
              <v-btn icon="mdi-chevron-left" size="small" variant="outlined" density="comfortable" />
              <v-btn icon="mdi-chevron-right" size="small" variant="outlined" density="comfortable" />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLogisticsStore } from '../../stores/logistics'
import StatusChip from '../../components/StatusChip.vue'
import MapPanel from '../../components/MapPanel.vue'

const store = useLogisticsStore()
const range = ref('March 2026')
const statsPeriod = ref('Year')
const activityFilter = ref('all')
const activityFilters = ['all', 'delivered', 'in-transit', 'pending']

const kpis = computed(() => store.kpis)
const inTransitCount = computed(() => store.orders.filter((o) => o.status === 'in-transit').length)
const prevMonth = { total: 12, inTransit: 5, delivered: 8 }

function pctChange(current, prev) {
  if (!prev) return 0
  return Math.abs(Math.round(((current - prev) / prev) * 100))
}

const activityOrders = computed(() => {
  const list = activityFilter.value === 'all' ? store.orders : store.orders.filter((o) => o.status === activityFilter.value)
  return list.slice(0, 8)
})

const trackedOrder = computed(() => store.orders.find((o) => o.status === 'in-transit') || store.orders[0])
const trackedStop = computed(() => trackedOrder.value?.stops?.[0])

const onRoadVehicles = computed(() => store.vehicles.filter((v) => v.status === 'on-trip').length)

function formatCompact(n) {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr'
  if (n >= 100000) return (n / 100000).toFixed(1) + 'L'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toLocaleString('en-IN')
}

const branchRevenue = computed(() => {
  const byBranch = {}
  for (const o of store.orders) {
    const city = o.branch.split(' - ')[0]
    byBranch[city] = (byBranch[city] || 0) + o.valueInr
  }
  return Object.entries(byBranch).sort((a, b) => b[1] - a[1])
})
const branchRevenueSeries = computed(() => branchRevenue.value.map(([, v]) => v))
const branchRevenueOptions = computed(() => ({
  chart: { fontFamily: 'Plus Jakarta Sans, sans-serif' },
  labels: branchRevenue.value.map(([k]) => k),
  colors: ['#0B1E4D', '#2F6FED', '#0F9E96', '#F5A524', '#FF8A3D', '#94A3C4'],
  legend: { position: 'bottom', fontSize: '12px' },
  dataLabels: { enabled: false },
  stroke: { width: 2, colors: ['#fff'] },
  tooltip: { y: { formatter: (v) => '₹' + v.toLocaleString('en-IN') } },
}))

const topProducts = computed(() => {
  const byName = {}
  for (const o of store.orders) {
    for (const it of o.items) {
      byName[it.name] = (byName[it.name] || 0) + it.qty
    }
  }
  return Object.entries(byName)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const revenuePercent = computed(() => Math.min(100, Math.round((kpis.value.revenue / 1800000) * 100)))
const revenueChartOptions = computed(() => ({
  chart: { fontFamily: 'Plus Jakarta Sans, sans-serif', offsetY: -10 },
  colors: ['#2F6FED'],
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      hollow: { size: '65%' },
      track: { background: '#E9EDF7', margin: 6 },
      dataLabels: { name: { show: false }, value: { show: false } },
    },
  },
  stroke: { lineCap: 'round' },
}))

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthlySeries = [
  { name: 'Total Shipments', data: [40, 62, 55, 48, 70, 58, 63, 71, 52, 44, 39, 47] },
  { name: 'In Transit', data: [18, 24, 20, 16, 26, 21, 22, 24, 19, 15, 14, 17] },
  { name: 'Delivered', data: [28, 44, 38, 34, 48, 40, 42, 54, 36, 30, 27, 33] },
]
const monthlyChartOptions = computed(() => ({
  chart: { toolbar: { show: false }, fontFamily: 'Plus Jakarta Sans, sans-serif', stacked: false },
  colors: ['#0B1E4D', '#94A3C4', '#2F6FED'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '65%' } },
  dataLabels: { enabled: false },
  grid: { borderColor: '#E3E7F1', strokeDashArray: 4 },
  legend: { position: 'top', horizontalAlign: 'right' },
  xaxis: { categories: months, labels: { style: { colors: '#5B6479' } } },
  yaxis: { labels: { style: { colors: '#5B6479' } } },
}))
</script>

<style scoped>
.product-row .product-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.product-row .leader {
  flex: 1 1 auto;
  border-bottom: 1px dotted rgba(var(--v-theme-on-surface), 0.3);
  margin: 0 8px;
  height: 0;
  transform: translateY(-4px);
}
</style>

