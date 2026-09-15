export function CatalogLoader() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-12 z-10 flex justify-center">
      <div
        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm"
        role="status"
        data-testid="catalog-loader"
      >
        <span
          className="size-5 rounded-full border-2 border-gray-200 border-t-indigo-500 motion-safe:animate-spin"
          aria-hidden="true"
        />
        Загружаем товары…
      </div>
    </div>
  )
}

export function CatalogSkeleton() {
  return Array.from({ length: 12 }, (_, index) => (
    <div
      key={index}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white motion-safe:animate-pulse"
      aria-hidden="true"
      data-testid="catalog-skeleton"
    >
      <div className="h-44 bg-gray-200" />
      <div className="space-y-4 p-3">
        <div className="h-4 w-1/2 rounded bg-gray-100" />
        <div className="h-6 w-4/5 rounded bg-gray-200" />
        <div className="h-10 rounded bg-gray-100" />
        <div className="h-7 w-2/3 rounded bg-gray-200" />
        <div className="h-10 rounded bg-indigo-50" />
      </div>
    </div>
  ))
}
