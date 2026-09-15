export function Availability({ available, testId }: { available: boolean; testId?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}
      data-testid={testId}
      data-available={String(available)}
    >
      {available ? 'В наличии' : 'Нет в наличии'}
    </span>
  )
}
