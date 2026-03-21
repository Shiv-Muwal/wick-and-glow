/** Max orderable qty for a product (API has stock; static fallback has no cap). */
export function getStockCap(product) {
  if (!product || product.stock === undefined || product.stock === null) {
    return 999;
  }
  const n = Number(product.stock);
  return Number.isFinite(n) && n >= 0 ? n : 999;
}

export function isOutOfStock(product) {
  return getStockCap(product) <= 0;
}
