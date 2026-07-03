import { defineStore } from 'pinia'
import { currentCustomer } from '../data/customers'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    role: null, // 'admin' | 'customer' | 'driver'
    name: null,
  }),
  actions: {
    loginAs(role) {
      this.role = role
      if (role === 'admin') this.name = 'Ops Admin'
      else if (role === 'customer') this.name = currentCustomer.contact
      else this.name = 'Arjun Mehta'
    },
    logout() {
      this.role = null
      this.name = null
    },
  },
})
