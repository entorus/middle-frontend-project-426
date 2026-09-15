import { Link } from 'react-router-dom'

import { Button, primaryLink } from './shared/ui'
import type { components } from './generated/api'
import { useResource } from './useResource'
import { PromotionCard } from './home/PromotionCard'

export default function Home() {
  const { data, error, retry } =
    useResource<components['schemas']['Promotion'][]>('/api/promotions')
  return (
    <>
      <section className="mb-8 max-w-2xl space-y-3">
        <h1
          className="mb-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl"
          data-testid="app-title"
        >
          Комплектующие для ПК с доставкой по городу
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-gray-500">
          Соберите компьютер под свои задачи. Процессоры, видеокарты и память для работы, творчества
          и игр — в одном магазине.
        </p>
        <Link className={primaryLink} to="/catalog">
          Подобрать комплектующие ↗
        </Link>
        <p className="block text-xs text-gray-400">Учебный магазин · демонстрационные цены</p>
      </section>
      <section data-testid="home-promo" aria-labelledby="home-promo-title" className="space-y-4">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-gray-500">
          <h2 className="mb-2 text-lg font-semibold text-gray-900" id="home-promo-title">
            Стоит присмотреться
          </h2>
          <span>Идеи для вашей сборки</span>
        </div>
        {!data && !error && (
          <p className="py-2 text-sm text-gray-500" role="status">
            Загружаем подборку…
          </p>
        )}
        {error && (
          <div role="alert" data-testid="home-promo-error">
            <p>Не удалось загрузить подборку. Каталог по-прежнему доступен.</p>
            <Button type="button" onClick={retry}>
              Повторить
            </Button>
          </div>
        )}
        {data?.length === 0 && (
          <p data-testid="home-promo-empty">
            Сейчас нет специальных подборок. Найдите нужные комплектующие в каталоге.
          </p>
        )}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((promo) => (
            <PromotionCard key={promo.id} promo={promo} />
          ))}
        </div>
      </section>
    </>
  )
}
