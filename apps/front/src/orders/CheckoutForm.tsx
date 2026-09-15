import type { useCheckout } from './useCheckout'

type Props = Pick<
  ReturnType<typeof useCheckout>,
  | 'method'
  | 'setMethod'
  | 'name'
  | 'setName'
  | 'phone'
  | 'setPhone'
  | 'address'
  | 'setAddress'
  | 'pending'
  | 'submit'
>

export function CheckoutForm({
  method,
  setMethod,
  name,
  setName,
  phone,
  setPhone,
  address,
  setAddress,
  pending,
  submit,
}: Props) {
  return (
    <form data-testid="checkout-form" onSubmit={(event) => void submit(event)}>
      <fieldset disabled={pending}>
        <label htmlFor="checkout-method">Способ получения</label>
        <select
          id="checkout-method"
          data-testid="checkout-method"
          value={method}
          onChange={(event) => setMethod(event.target.value as 'delivery' | 'pickup')}
        >
          <option value="delivery">Доставка</option>
          <option value="pickup">Самовывоз</option>
        </select>
        <label htmlFor="checkout-name">Имя получателя</label>
        <input
          id="checkout-name"
          data-testid="checkout-name"
          autoComplete="name"
          required
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <label htmlFor="checkout-phone">Телефон</label>
        <input
          id="checkout-phone"
          data-testid="checkout-phone"
          type="tel"
          autoComplete="tel"
          required
          minLength={7}
          maxLength={25}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        {method === 'delivery' ? (
          <>
            <label htmlFor="checkout-address">Адрес доставки</label>
            <input
              id="checkout-address"
              data-testid="checkout-address"
              autoComplete="street-address"
              required
              maxLength={500}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </>
        ) : (
          <p>Самовывоз из единственного пункта выдачи магазина. Адрес доставки не нужен.</p>
        )}
        <button type="submit" data-testid="checkout-submit">
          {pending ? 'Оформляем…' : 'Оформить заказ'}
        </button>
      </fieldset>
    </form>
  )
}
