import { Link } from 'react-router-dom'

import type { components } from '../generated/api'

type Props = { error: string; problems: components['schemas']['ProblemProduct'][] }

export function OrderError({ error, problems }: Props) {
  return (
    <div role="alert" data-testid="order-error">
      <p>{error}</p>
      {problems.length > 0 && (
        <ul>
          {problems.map((product) => (
            <li key={product.id}>
              Товар №{product.id}:{' '}
              {product.reason === 'not_found' ? 'не найден в каталоге' : 'нет в наличии'}
            </li>
          ))}
        </ul>
      )}
      <Link to="/cart">Вернуться в корзину</Link> · <Link to="/account">Проверить заказы</Link>
    </div>
  )
}
