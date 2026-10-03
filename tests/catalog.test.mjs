import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCoffeeList } from '../src/lib/catalog.ts';

test('Django coffee categories remain visible in the coffee catalog', () => {
  const rows = normalizeCoffeeList([{ productID: 7, name: 'Latte', category: 'Latte', price: '4.50' }]);
  assert.equal(rows[0].category, 'COFFEE');
  assert.equal(rows[0].productID, 7);
  assert.equal(rows[0].price, '4.50');
});
test('accepts a paginated list and preserves product fields', () => {
  const rows = normalizeCoffeeList({ results: [{ productID: 9, name: 'Espresso', volume: '30ml' }] });
  assert.equal(rows[0].volume, '30ml');
});
test('rejects malformed API responses instead of crashing during render', () => {
  assert.throws(() => normalizeCoffeeList({ detail: 'Unavailable' }), /catalog/i);
});
