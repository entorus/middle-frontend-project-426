import assert from 'node:assert/strict'
import test from 'node:test'

import { parsePort } from '../../apps/api/dist/config.js'

test('PORT обязателен, валидируется и не имеет зашитого значения', () => {
  assert.equal(parsePort('4567'), 4567)
  assert.equal(parsePort('1'), 1)
  assert.equal(parsePort('65535'), 65535)
  assert.throws(() => parsePort(undefined), /PORT/)
  for (const value of ['', '0', '-1', '65536', '1.5', 'Infinity', 'abc', ' 4567 '])
    assert.throws(() => parsePort(value), /PORT/)
})
