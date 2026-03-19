export function getStockVisuals(stock, max = 60) {
  const pct = Math.min((stock / max) * 100, 100);

  let color;
  if (stock === 0 || stock < 15) {
    color = '#ef4444';
  } else if (stock < 30) {
    color = '#f6bd60';
  } else {
    color = '#84a59d';
  }

  return { pct, color };
}

