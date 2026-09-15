const currency = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})
const fractionalCurrency = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Format an amount in kopecks without changing the API representation. */
export function formatMoney(amount: number) {
  // Split integers before formatting: division as Number loses kopecks near MAX_SAFE_INTEGER.
  const kopecks = BigInt(amount)
  const rubles = kopecks / 100n
  const fraction = kopecks % 100n
  if (fraction === 0n) return currency.format(rubles)
  return fractionalCurrency
    .formatToParts(rubles)
    .map((part) => (part.type === 'fraction' ? String(fraction).padStart(2, '0') : part.value))
    .join('')
}
