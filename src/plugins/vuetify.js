import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const myntraTheme = {
  dark: false,
  colors: {
    background: '#F1F4FA',
    surface: '#FFFFFF',
    primary: '#0B1E4D',
    'primary-darken-1': '#071534',
    secondary: '#2F6FED',
    'secondary-darken-1': '#1E54C4',
    accent: '#FF8A3D',
    error: '#E5484D',
    warning: '#F5A524',
    success: '#1DAA6E',
    info: '#2F6FED',
    'on-surface-variant': '#5B6479',
  },
  variables: {
    'border-color': '#E3E7F1',
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myntraTheme',
    themes: { myntraTheme },
  },
  defaults: {
    VCard: { rounded: 'lg', elevation: 0, border: true },
    VBtn: { rounded: 'lg', style: 'text-transform:none;font-weight:600;letter-spacing:0' },
    VTextField: { variant: 'outlined', density: 'comfortable', rounded: 'lg' },
    VSelect: { variant: 'outlined', density: 'comfortable', rounded: 'lg' },
    VAutocomplete: { variant: 'outlined', density: 'comfortable', rounded: 'lg' },
    VTextarea: { variant: 'outlined', density: 'comfortable', rounded: 'lg' },
    VChip: { rounded: 'lg' },
    VDataTable: { density: 'comfortable' },
  },
})
