// Static demo order data. Dates are fixed strings (no Date.now()) so the
// dataset is stable across every run of the demo.
export const orders = [
  {
    id: 'ORD-8841', customerId: 'CUST-001', customer: 'Reliance Retail Ltd', type: 'FTL',
    createdAt: '2026-06-20', branch: 'Mumbai - Bhiwandi', status: 'delivered', tripId: 'TRP-3301',
    items: [
      { sku: 'SKU-2210', name: 'Basmati Rice 25kg', qty: 400, unit: 'bags' },
      { sku: 'SKU-2211', name: 'Refined Sunflower Oil 15L', qty: 220, unit: 'tins' },
    ],
    stops: [
      { seq: 1, address: 'Reliance Smart DC, Bhiwandi, Maharashtra', lat: 19.2813, lng: 73.0483, status: 'delivered' },
    ],
    valueInr: 486000,
  },
  {
    id: 'ORD-8842', customerId: 'CUST-002', customer: 'Big Bazaar Distribution', type: 'LTL',
    createdAt: '2026-06-21', branch: 'Bengaluru - Bommasandra', status: 'in-transit', tripId: 'TRP-3302',
    items: [
      { sku: 'SKU-3315', name: 'Toor Dal 1kg Pouch', qty: 900, unit: 'pouches' },
      { sku: 'SKU-3316', name: 'Wheat Atta 10kg', qty: 300, unit: 'bags' },
      { sku: 'SKU-3317', name: 'Iodised Salt 1kg', qty: 1200, unit: 'pouches' },
    ],
    stops: [
      { seq: 1, address: 'Big Bazaar Store, Koramangala, Bengaluru', lat: 12.9352, lng: 77.6146, status: 'delivered' },
      { seq: 2, address: 'Big Bazaar Store, Whitefield, Bengaluru', lat: 12.9698, lng: 77.7500, status: 'delivered' },
      { seq: 3, address: 'Big Bazaar Store, Electronic City, Bengaluru', lat: 12.8452, lng: 77.6602, status: 'in-transit' },
    ],
    valueInr: 312500,
  },
  {
    id: 'ORD-8843', customerId: 'CUST-003', customer: 'Nature Basket Foods', type: 'LTL',
    createdAt: '2026-06-22', branch: 'Chennai - Sriperumbudur', status: 'planned', tripId: 'TRP-3303',
    items: [
      { sku: 'SKU-4401', name: 'Organic Almonds 500g', qty: 600, unit: 'packs' },
      { sku: 'SKU-4402', name: 'Cold Pressed Coconut Oil 1L', qty: 500, unit: 'bottles' },
    ],
    stops: [
      { seq: 1, address: 'Nature Basket, Adyar, Chennai', lat: 13.0067, lng: 80.2570, status: 'planned' },
      { seq: 2, address: 'Nature Basket, Anna Nagar, Chennai', lat: 13.0850, lng: 80.2101, status: 'planned' },
    ],
    valueInr: 198750,
  },
  {
    id: 'ORD-8844', customerId: 'CUST-004', customer: 'Spencer Retail Hub', type: 'FTL',
    createdAt: '2026-06-23', branch: 'Delhi NCR - Manesar', status: 'in-transit', tripId: 'TRP-3304',
    items: [
      { sku: 'SKU-5510', name: 'Packaged Drinking Water 1L (Case of 12)', qty: 1500, unit: 'cases' },
    ],
    stops: [
      { seq: 1, address: 'Spencer Warehouse, Gurugram Sector 18', lat: 28.4732, lng: 77.0714, status: 'in-transit' },
    ],
    valueInr: 275000,
  },
  {
    id: 'ORD-8845', customerId: 'CUST-005', customer: 'More Supermarkets', type: 'LTL',
    createdAt: '2026-06-24', branch: 'Hyderabad - Shamshabad', status: 'pending', tripId: null,
    items: [
      { sku: 'SKU-6601', name: 'Frozen Green Peas 1kg', qty: 800, unit: 'packs' },
      { sku: 'SKU-6602', name: 'Paneer 200g', qty: 1000, unit: 'packs' },
    ],
    stops: [
      { seq: 1, address: 'More Supermarket, Kondapur, Hyderabad', lat: 17.4615, lng: 78.3629, status: 'pending' },
      { seq: 2, address: 'More Supermarket, Gachibowli, Hyderabad', lat: 17.4401, lng: 78.3489, status: 'pending' },
      { seq: 3, address: 'More Supermarket, Madhapur, Hyderabad', lat: 17.4483, lng: 78.3915, status: 'pending' },
    ],
    valueInr: 156000,
  },
  {
    id: 'ORD-8846', customerId: 'CUST-006', customer: 'Lulu Hypermarket', type: 'FTL',
    createdAt: '2026-06-25', branch: 'Kochi - Aluva', status: 'delivered', tripId: 'TRP-3305',
    items: [
      { sku: 'SKU-7701', name: 'Assorted Spices Kit', qty: 700, unit: 'kits' },
      { sku: 'SKU-7702', name: 'Tea Powder 1kg', qty: 450, unit: 'packs' },
    ],
    stops: [
      { seq: 1, address: 'Lulu Hypermarket, Edappally, Kochi', lat: 10.0261, lng: 76.3086, status: 'delivered' },
    ],
    valueInr: 342000,
  },
  {
    id: 'ORD-8847', customerId: 'CUST-001', customer: 'Reliance Retail Ltd', type: 'LTL',
    createdAt: '2026-06-26', branch: 'Mumbai - Bhiwandi', status: 'failed', tripId: 'TRP-3306',
    items: [
      { sku: 'SKU-2212', name: 'Instant Noodles Case (24pk)', qty: 350, unit: 'cases' },
    ],
    stops: [
      { seq: 1, address: 'Reliance Fresh, Andheri West, Mumbai', lat: 19.1358, lng: 72.8264, status: 'failed' },
    ],
    valueInr: 87500,
  },
  {
    id: 'ORD-8848', customerId: 'CUST-002', customer: 'Big Bazaar Distribution', type: 'FTL',
    createdAt: '2026-06-27', branch: 'Bengaluru - Bommasandra', status: 'delivered', tripId: 'TRP-3307',
    items: [
      { sku: 'SKU-3318', name: 'Detergent Powder 5kg', qty: 500, unit: 'bags' },
    ],
    stops: [
      { seq: 1, address: 'Big Bazaar DC, Bommasandra, Bengaluru', lat: 12.8107, lng: 77.6980, status: 'delivered' },
    ],
    valueInr: 245000,
  },
  {
    id: 'ORD-8849', customerId: 'CUST-004', customer: 'Spencer Retail Hub', type: 'LTL',
    createdAt: '2026-06-28', branch: 'Delhi NCR - Manesar', status: 'planned', tripId: 'TRP-3308',
    items: [
      { sku: 'SKU-5511', name: 'Breakfast Cereal 500g', qty: 600, unit: 'packs' },
      { sku: 'SKU-5512', name: 'Peanut Butter 340g', qty: 400, unit: 'jars' },
    ],
    stops: [
      { seq: 1, address: 'Spencer Retail, Cyber Hub, Gurugram', lat: 28.4950, lng: 77.0891, status: 'planned' },
      { seq: 2, address: 'Spencer Retail, Sector 29, Gurugram', lat: 28.4650, lng: 77.0596, status: 'planned' },
    ],
    valueInr: 176400,
  },
  {
    id: 'ORD-8850', customerId: 'CUST-003', customer: 'Nature Basket Foods', type: 'FTL',
    createdAt: '2026-06-29', branch: 'Chennai - Sriperumbudur', status: 'in-transit', tripId: 'TRP-3309',
    items: [
      { sku: 'SKU-4403', name: 'Extra Virgin Olive Oil 1L', qty: 300, unit: 'bottles' },
    ],
    stops: [
      { seq: 1, address: 'Nature Basket DC, Sriperumbudur, Chennai', lat: 12.9675, lng: 79.9420, status: 'in-transit' },
    ],
    valueInr: 210000,
  },
  {
    id: 'ORD-8851', customerId: 'CUST-005', customer: 'More Supermarkets', type: 'LTL',
    createdAt: '2026-06-30', branch: 'Hyderabad - Shamshabad', status: 'pending', tripId: null,
    items: [
      { sku: 'SKU-6603', name: 'Bakery Bread Loaf', qty: 1200, unit: 'loaves' },
    ],
    stops: [
      { seq: 1, address: 'More Supermarket, Banjara Hills, Hyderabad', lat: 17.4126, lng: 78.4482, status: 'pending' },
    ],
    valueInr: 64800,
  },
  {
    id: 'ORD-8852', customerId: 'CUST-006', customer: 'Lulu Hypermarket', type: 'LTL',
    createdAt: '2026-07-01', branch: 'Kochi - Aluva', status: 'planned', tripId: 'TRP-3310',
    items: [
      { sku: 'SKU-7703', name: 'Frozen Prawns 500g', qty: 500, unit: 'packs' },
      { sku: 'SKU-7704', name: 'Coconut Milk 400ml', qty: 800, unit: 'cans' },
    ],
    stops: [
      { seq: 1, address: 'Lulu Hypermarket, Kakkanad, Kochi', lat: 10.0158, lng: 76.3419, status: 'planned' },
      { seq: 2, address: 'Lulu Hypermarket, Vyttila, Kochi', lat: 9.9683, lng: 76.3186, status: 'planned' },
    ],
    valueInr: 132000,
  },
  {
    id: 'ORD-8853', customerId: 'CUST-001', customer: 'Reliance Retail Ltd', type: 'FTL',
    createdAt: '2026-07-02', branch: 'Mumbai - Bhiwandi', status: 'pending', tripId: null,
    items: [
      { sku: 'SKU-2213', name: 'Ghee 1L Tin', qty: 350, unit: 'tins' },
    ],
    stops: [
      { seq: 1, address: 'Reliance Smart DC, Thane, Mumbai', lat: 19.2183, lng: 72.9781, status: 'pending' },
    ],
    valueInr: 297500,
  },
  {
    id: 'ORD-8854', customerId: 'CUST-002', customer: 'Big Bazaar Distribution', type: 'LTL',
    createdAt: '2026-07-03', branch: 'Bengaluru - Bommasandra', status: 'pending', tripId: null,
    items: [
      { sku: 'SKU-3319', name: 'Multigrain Atta 5kg', qty: 500, unit: 'bags' },
      { sku: 'SKU-3320', name: 'Cooking Soda 200g', qty: 900, unit: 'packs' },
    ],
    stops: [
      { seq: 1, address: 'Big Bazaar Store, Jayanagar, Bengaluru', lat: 12.9308, lng: 77.5838, status: 'pending' },
      { seq: 2, address: 'Big Bazaar Store, HSR Layout, Bengaluru', lat: 12.9121, lng: 77.6446, status: 'pending' },
      { seq: 3, address: 'Big Bazaar Store, Marathahalli, Bengaluru', lat: 12.9569, lng: 77.7011, status: 'pending' },
    ],
    valueInr: 189200,
  },
]
