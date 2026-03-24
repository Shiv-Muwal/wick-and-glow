import React, { useMemo, useState } from 'react';
import { useAdmin } from '../AdminContext.jsx';
import { SearchIcon } from '../components/logos.jsx';
import { PRODUCT_COLUMNS, PRODUCT_CATEGORIES } from '../productsConfig.js';
import { uploadProductImage, postAdminProductApi } from '../api/client.js';
import Modal from '../components/ui/Modal.jsx';

const initialForm = {
  name: '',
  price: '',
  stock: '',
  category: PRODUCT_CATEGORIES[0],
  fragrance: '',
  description: '',
  emoji: '🕯️',
  id: '',
};

function Products() {
  const { state, refreshState } = useAdmin();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [uploadingId, setUploadingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(initialForm);

  const filtered = useMemo(() => {
    return state.products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.fragrance.toLowerCase().includes(search.toLowerCase());
      const matchesCat = !category || p.category === category;
      return matchesSearch && matchesCat;
    });
  }, [state.products, search, category]);

  const handleImageChange = async (productId, e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingId(productId);
    try {
      await uploadProductImage(productId, file);
      await refreshState();
    } catch (err) {
      window.alert(err.message || 'Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  const openAddProduct = () => {
    setForm(initialForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const closeAddProduct = () => {
    if (saving) return;
    setIsModalOpen(false);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const fragrance = form.fragrance.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name) return setFormError('Product name is required');
    if (!Number.isFinite(price) || price <= 0) return setFormError('Enter a valid price');
    if (!Number.isFinite(stock) || stock < 0) return setFormError('Enter a valid stock value');
    if (!description) return setFormError('Description is required');

    setSaving(true);
    setFormError('');
    try {
      await postAdminProductApi({
        id: form.id.trim() || undefined,
        name,
        price,
        stock,
        category: form.category || PRODUCT_CATEGORIES[0],
        fragrance,
        description,
        emoji: form.emoji.trim() || '🕯️',
      });
      setIsModalOpen(false);
      await refreshState();
    } catch (err) {
      setFormError(err.message || 'Could not create product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Products
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">
            Manage your candle collection · Cloudinary image upload per row
          </p>
        </div>
        <button
          type="button"
          onClick={openAddProduct}
          className="inline-flex items-center gap-[7px] rounded-[10px] bg-gradient-to-br from-[var(--gold)] to-[#e8a830] px-[17px] py-[9px] text-[13px] font-medium text-[var(--dark)] shadow-[0_4px_14px_rgba(246,189,96,0.28)] transition-transform duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(246,189,96,0.38)]"
        >
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[6px] bg-[rgba(0,0,0,0.08)] text-[14px]">
            +
          </span>
          Add Product
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-[11px]">
        <div className="flex min-w-[220px] max-w-[320px] flex-1 items-center gap-[8px] rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[8px] transition-all focus-within:border-[var(--sage)] focus-within:shadow-[0_0_0_3px_rgba(132,165,157,0.1)]">
          <SearchIcon className="h-[15px] w-[15px] text-[var(--text3)]" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-none bg-transparent text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--text3)]"
          />
        </div>
        <select
          className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[9px] text-[13px] text-[var(--text)] outline-none transition-colors focus:border-[var(--sage)]"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[12px] border border-[var(--border)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface2)]">
              {PRODUCT_COLUMNS.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-[15px] py-[12px] text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text2)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const lowStock = p.stock < 20;
              return (
                <tr
                  key={p.id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface2)]"
                >
                  <td className="px-[15px] py-[13px] align-middle">
                    <div className="flex flex-col items-start gap-[6px]">
                      <div className="flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-[10px] bg-gradient-to-br from-[var(--cream)] to-[var(--blush)] text-[20px]">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          p.emoji
                        )}
                      </div>
                      <label className="cursor-pointer text-[10px] font-semibold text-[var(--sage)] hover:underline">
                        {uploadingId === p.id ? 'Uploading…' : 'Upload image'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          disabled={uploadingId === p.id}
                          onChange={(e) => handleImageChange(p.id, e)}
                        />
                      </label>
                    </div>
                  </td>
                  <td className="px-[15px] py-[13px] align-middle">
                    <div className="font-medium text-[var(--text)]">{p.name}</div>
                    <div className="text-[11px] text-[var(--text2)]">{p.fragrance}</div>
                  </td>
                  <td className="px-[15px] py-[13px] align-middle font-semibold text-[var(--text)]">
                    ₹{p.price.toLocaleString()}
                  </td>
                  <td className="px-[15px] py-[13px] align-middle">
                    <span
                      className={`inline-flex items-center rounded-[20px] px-[10px] py-[4px] text-[11px] font-semibold ${
                        lowStock
                          ? 'bg-[rgba(246,189,96,0.15)] text-[#d97706]'
                          : 'bg-[rgba(16,185,129,0.15)] text-[#059669]'
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-[15px] py-[13px] align-middle">
                    <span className="inline-flex items-center rounded-[20px] bg-[rgba(132,165,157,0.15)] px-[10px] py-[4px] text-[11px] font-semibold text-[#065f46]">
                      {p.category}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={isModalOpen} onClose={closeAddProduct}>
        <div className="w-[min(100vw-32px,600px)] rounded-[20px] border border-[var(--border)] bg-[var(--bg2)] p-[26px] shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
          <div className="mb-[18px] flex items-center justify-between">
            <h3 className="font-['DM_Serif_Display',serif] text-[19px] text-[var(--text)]">
              Add Product
            </h3>
            <button
              type="button"
              onClick={closeAddProduct}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-[var(--surface2)] text-[16px] text-[var(--text2)] transition-colors hover:bg-[#ef4444] hover:text-white"
              aria-label="Close add product modal"
              disabled={saving}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-[12px]">
            <div className="grid gap-[12px] sm:grid-cols-2">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  Product Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                  required
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  Product ID (Optional)
                </label>
                <input
                  value={form.id}
                  onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                  placeholder="e.g. p-lavender-mist"
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                />
              </div>
            </div>

            <div className="grid gap-[12px] sm:grid-cols-3">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  Price *
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                  required
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                  required
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-[12px] sm:grid-cols-2">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  Fragrance
                </label>
                <input
                  value={form.fragrance}
                  onChange={(e) => setForm((f) => ({ ...f, fragrance: e.target.value }))}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  Emoji
                </label>
                <input
                  value={form.emoji}
                  onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[20px] outline-none focus:border-[var(--sage)]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
                className="w-full resize-y rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                required
              />
            </div>

            {formError ? (
              <p className="text-[12px] font-medium text-red-600">{formError}</p>
            ) : null}

            <div className="mt-[6px] flex justify-end gap-[9px] border-t border-[var(--border)] pt-[16px]">
              <button
                type="button"
                onClick={closeAddProduct}
                disabled={saving}
                className="rounded-[10px] border border-[var(--border)] bg-transparent px-[17px] py-[9px] text-[13px] font-medium text-[var(--text2)] hover:bg-[rgba(132,165,157,0.05)] hover:text-[var(--sage)] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-[10px] bg-[linear-gradient(135deg,var(--gold),#e8a830)] px-[17px] py-[9px] text-[13px] font-medium text-[#1f2937] shadow-[0_4px_14px_rgba(246,189,96,0.28)] transition-transform hover:-translate-y-[1px] disabled:opacity-60"
              >
                {saving ? 'Creating…' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Products;
