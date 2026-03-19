import React from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';

function RestockModal({
  open,
  product,
  quantity,
  onQuantityChange,
  onClose,
  onSubmit,
}) {
  if (!product) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-header">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text3)]">
            Inventory action
          </p>
          <h3 className="mt-[3px] font-['DM_Serif_Display',serif] text-[21px] leading-snug text-[var(--text)]">
            Restock product
          </h3>
          <p className="mt-[4px] text-[12.5px] text-[var(--text2)]">
            {product.name} — current stock {product.stock}
          </p>
        </div>
        <Button
          variant="secondary"
          className="ms-3 h-8 w-8 rounded-full !border-0 bg-[var(--surface2)] p-0 text-[13px] shadow-[0_4px_10px_rgba(15,23,42,0.18)] hover:bg-[#ef4444] hover:text-white"
          onClick={onClose}
        >
          ✕
          <span className="sr-only">Close modal</span>
        </Button>
      </div>

      <div className="modal-body">
        <label className="mb-2 block text-[12px] font-medium tracking-[0.08em] text-[var(--text2)] uppercase">
          Quantity to add
        </label>
        <Input
          type="number"
          min="1"
          variant="pill"
          value={quantity}
          onChange={(event) => onQuantityChange(event.target.value)}
          placeholder="Enter quantity, e.g. 20"
        />
      </div>

      <div className="modal-footer">
        <Button
          variant="ghost"
          className="px-4 py-2 text-[12px] tracking-[0.08em]"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="gap-1.5 px-5 py-2 text-[12px] tracking-[0.14em]"
          onClick={onSubmit}
        >
          <span className="text-[14px] leading-none">➕</span>
          Restock
        </Button>
      </div>
    </Modal>
  );
}

export default RestockModal;

