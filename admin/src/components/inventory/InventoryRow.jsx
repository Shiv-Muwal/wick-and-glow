import React, { useMemo } from 'react';
import { getStockVisuals } from '../../utils/inventoryUtils.js';

function InventoryRow({ product, onRestock }) {
  const { pct, color } = useMemo(
    () => getStockVisuals(product.stock),
    [product.stock]
  );

  return (
    <tr className="table-row">
      <td className="table-cell">
        <div className="flex items-center gap-[12px]">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--cream)] to-[var(--blush)] text-[20px]">
            {product.emoji}
          </div>
          <span className="text-[var(--text)]">{product.name}</span>
        </div>
      </td>

      <td className="table-cell text-[var(--text)]">{product.category}</td>

      <td className="table-cell">
        <div className="flex items-center gap-[8px]">
          <span className="w-[28px] font-semibold" style={{ color }}>
            {product.stock}
          </span>
          <div className="w-[80px]">
            <div className="h-[5px] rounded-[3px] bg-[var(--border)]">
              <div
                className="h-[5px] rounded-[3px] transition-[width] duration-300 ease-out"
                style={{ width: pct + '%', background: color }}
              />
            </div>
          </div>
        </div>
      </td>

      <td className="table-cell">
        <button
          type="button"
          className="btn btn-secondary gap-[6px] rounded-[8px] px-[12px] py-[6px] normal-case tracking-normal text-[12px]"
          onClick={() => onRestock(product)}
        >
          📦 Restock
        </button>
      </td>
    </tr>
  );
}

export default InventoryRow;

