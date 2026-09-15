import assert from 'node:assert/strict'
import test from 'node:test'

import { formatMoney } from '../../apps/front/src/shared/money.ts'

test('отображение Money сохраняет копейки во всём диапазоне контракта', () => {
  for (const [amount, expected] of [
    [0, '0₽'],
    [100, '1₽'],
    [1, '0,01₽'],
    [12340, '123,40₽'],
    [12345, '123,45₽'],
    [37035, '370,35₽'],
    [Number.MAX_SAFE_INTEGER, '90071992547409,91₽'],
  ]) {
    assert.equal(formatMoney(amount).replace(/\s/g, ''), expected)
  }
})
