export type CartItem = { id: number; quantity: number }
export const storageKey = 'psparts-cart'
export const maxQuantity = 999

export function readCart(): CartItem[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(data)) return []
    const quantities = new Map<number, number>()
    for (const item of data) {
      if (
        !item ||
        !Number.isSafeInteger(item.id) ||
        item.id < 1 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1
      )
        continue
      quantities.set(item.id, Math.min(maxQuantity, (quantities.get(item.id) ?? 0) + item.quantity))
    }
    return [...quantities].map(([id, quantity]) => ({ id, quantity }))
  } catch {
    return []
  }
}
