const currency = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

/** Format an amount in kopecks without changing the API representation. */
export const formatMoney = (amount: number) => currency.format(amount / 100)
