import { Link } from 'react-router-dom'

import type { components } from './generated/api'
import { useResource } from './useResource'

const currency = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

export default function Home() {
  const { data, error, retry } =
    useResource<components['schemas']['Promotion'][]>('/api/promotions')
  return (
    <>
      <section className="hero home-hero">
        <p className="eyebrow">PS PARTS · КОМПЛЕКТУЮЩИЕ ДЛЯ ПК</p>
        <h1 data-testid="app-title">
          Ваш следующий
          <br />
          апгрейд — здесь.
        </h1>
        <p className="intro">
          Соберите компьютер под свои задачи. Процессоры, видеокарты и память для работы, творчества
          и игр — в одном магазине.
        </p>
        <Link className="home-catalog-link" to="/catalog">
          Подобрать комплектующие ↗
        </Link>
        <p className="demo-note">Учебный магазин · демонстрационные цены</p>
      </section>
      <section
        data-testid="home-promo"
        aria-labelledby="home-promo-title"
        className="home-promotions"
      >
        <div className="section-heading">
          <h2 id="home-promo-title">Стоит присмотреться</h2>
          <span>Идеи для вашей сборки</span>
        </div>
        {!data && !error && <p role="status">Загружаем подборку…</p>}
        {error && (
          <div role="alert" data-testid="home-promo-error">
            <p>Не удалось загрузить подборку. Каталог по-прежнему доступен.</p>
            <button type="button" onClick={retry}>
              Повторить
            </button>
          </div>
        )}
        {data?.length === 0 && (
          <p data-testid="home-promo-empty">
            Сейчас нет специальных подборок. Найдите нужные комплектующие в каталоге.
          </p>
        )}
        <div className="home-promo-grid">
          {data?.map((promo) => (
            <Link
              key={promo.id}
              to={`/products/${promo.product.id}`}
              data-testid="home-promo-item"
              className="home-promo-card"
            >
              <p className="eyebrow">{promo.product.category_name}</p>
              <h3>{promo.title}</h3>
              <p className="promo-text">{promo.text}</p>
              <div className="promo-product">
                <span>{promo.product.name}</span>
                <strong>{currency.format(promo.product.price.amount / 100)}</strong>
              </div>
              <span className="promo-action">
                Посмотреть товар <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
