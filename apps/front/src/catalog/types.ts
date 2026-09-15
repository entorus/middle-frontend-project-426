import type { components } from '../generated/api'

export type Product = components['schemas']['Product']
export type ProductPage = components['schemas']['ProductPage']
export type Category = components['schemas']['Category']
export type Filters = {
  category: string
  priceMin: string
  priceMax: string
  available: boolean
  search: string
}
export const emptyFilters: Filters = {
  category: '',
  priceMin: '',
  priceMax: '',
  available: false,
  search: '',
}
