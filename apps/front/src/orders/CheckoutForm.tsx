import { Button, Input, Select } from '../shared/ui'
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
      <fieldset
        className="grid gap-3 rounded-xl border border-gray-200 bg-white p-5"
        disabled={pending}
      >
        <label className="text-sm font-medium text-gray-800" htmlFor="checkout-method">
          Способ получения
        </label>
        <Select
          id="checkout-method"
          data-testid="checkout-method"
          value={method}
          onChange={(event) => setMethod(event.target.value as 'delivery' | 'pickup')}
        >
          <option value="delivery">Доставка</option>
          <option value="pickup">Самовывоз</option>
        </Select>
        <label className="text-sm font-medium text-gray-800" htmlFor="checkout-name">
          Имя получателя
        </label>
        <Input
          id="checkout-name"
          data-testid="checkout-name"
          autoComplete="name"
          required
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <label className="text-sm font-medium text-gray-800" htmlFor="checkout-phone">
          Телефон
        </label>
        <Input
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
            <label className="text-sm font-medium text-gray-800" htmlFor="checkout-address">
              Адрес доставки
            </label>
            <Input
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
        <Button variant="primary" type="submit" data-testid="checkout-submit">
          {pending ? 'Оформляем…' : 'Оформить заказ'}
        </Button>
      </fieldset>
    </form>
  )
}
