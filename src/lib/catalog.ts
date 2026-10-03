import type { ProductItem } from '../app/context/ShopContext';

// The coffee endpoint uses drink styles (e.g. Latte) as its category.
// Keep the UI's existing COFFEE/FOOD discriminator at this boundary.
export function normalizeCoffeeList(data: unknown): ProductItem[] {
  const rows = Array.isArray(data) ? data :
    data && typeof data === 'object' && 'results' in data ? data.results : null;
  if (!Array.isArray(rows) || rows.some(row => !row || typeof row.productID !== 'number' || typeof row.name !== 'string')) {
    throw new Error('The catalog response is invalid. Please try again.');
  }
  return rows.map(row => ({ ...row, category: 'COFFEE' }));
}
