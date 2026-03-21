import React, { useMemo, useState } from 'react';
import { useAdmin } from '../AdminContext.jsx';
import { INVENTORY_COLUMNS } from '../inventoryConfig.js';
import InventoryRow from '../components/inventory/InventoryRow.jsx';
import RestockModal from '../components/inventory/RestockModal.jsx';

function Inventory() {
  const { state, restockProduct } = useAdmin();
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockQty, setRestockQty] = useState('20');
  const [activeProduct, setActiveProduct] = useState(null);

  const products = useMemo(() => state.products, [state.products]);

  const handleOpenRestock = (product) => {
    setActiveProduct(product);
    setRestockQty('20');
    setRestockOpen(true);
  };

  const handleCloseRestock = () => {
    setRestockOpen(false);
    setActiveProduct(null);
  };

  const handleSubmitRestock = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    const qtyNum = Number(restockQty);
    if (!activeProduct || Number.isNaN(qtyNum) || qtyNum <= 0) return;
    await restockProduct(activeProduct.id, qtyNum);
    setRestockOpen(false);
    setActiveProduct(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Inventory
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">Monitor stock levels</p>
        </div>
      </div>

      <div className="table-shell">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="table-head-row">
              {INVENTORY_COLUMNS.map((header) => (
                <th key={header} className="table-head-cell">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <InventoryRow
                key={product.id}
                product={product}
                onRestock={handleOpenRestock}
              />
            ))}
          </tbody>
        </table>
      </div>

      <RestockModal
        open={restockOpen}
        product={activeProduct}
        quantity={restockQty}
        onQuantityChange={setRestockQty}
        onClose={handleCloseRestock}
        onSubmit={handleSubmitRestock}
      />
    </div>
  );
}

export default Inventory;

