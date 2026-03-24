import React, { useEffect, useMemo, useState } from 'react';
import { useAdmin } from '../AdminContext.jsx';
import { SearchIcon } from '../components/logos.jsx';
import { PRODUCT_COLUMNS, PRODUCT_CATEGORIES } from '../productsConfig.js';
import {
  uploadProductImage,
  postAdminProductApi,
  patchAdminProductApi,
  deleteAdminProductApi,
} from '../api/client.js';
import Modal from '../components/ui/Modal.jsx';

const initialForm = {
  name: '',
  price: '',
  stock: '',
  category: PRODUCT_CATEGORIES[0],
  fragrance: '',
  description: '',
  id: '',
};

function Products() {
  const { state, refreshState } = useAdmin();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(initialForm);
  /** New file chosen in modal; uploaded after product save */
  const [imageDraft, setImageDraft] = useState(null);
  /** Saved image URL when editing (for preview if no new file) */
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [blobPreviewUrl, setBlobPreviewUrl] = useState(null);

  useEffect(() => {
    if (!imageDraft) {
      setBlobPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(imageDraft);
    setBlobPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageDraft]);

  const categoryOptions = useMemo(() => {
    const set = new Set(PRODUCT_CATEGORIES);
    state.products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [state.products]);

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

  const openAddProduct = () => {
    setEditingId(null);
    setForm(initialForm);
    setImageDraft(null);
    setExistingImageUrl(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditProduct = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || '',
      price: String(p.price ?? ''),
      stock: String(p.stock ?? ''),
      category: p.category || PRODUCT_CATEGORIES[0],
      fragrance: p.fragrance || '',
      description: p.description || '',
      id: p.id,
    });
    setImageDraft(null);
    setExistingImageUrl(p.imageUrl || null);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleModalImagePick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImageDraft(file);
  };

  const closeAddProduct = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingId(null);
    setImageDraft(null);
    setExistingImageUrl(null);
    setFormError('');
  };

  const handleDeleteProduct = async (p) => {
    if (!window.confirm(`Delete “${p.name}”? This cannot be undone.`)) return;
    setDeletingId(p.id);
    try {
      await deleteAdminProductApi(p.id);
      await refreshState();
    } catch (err) {
      window.alert(err.message || 'Could not delete product');
    } finally {
      setDeletingId(null);
    }
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
      let productId = editingId;

      if (editingId) {
        await patchAdminProductApi(editingId, {
          name,
          price,
          stock,
          category: form.category || PRODUCT_CATEGORIES[0],
          fragrance,
          description,
        });
      } else {
        const created = await postAdminProductApi({
          id: form.id.trim() || undefined,
          name,
          price,
          stock,
          category: form.category || PRODUCT_CATEGORIES[0],
          fragrance,
          description,
        });
        productId = created?.id;
      }

      if (imageDraft && productId) {
        try {
          await uploadProductImage(productId, imageDraft);
        } catch (upErr) {
          window.alert(upErr.message || 'Product saved, but image upload failed. Edit the product to try again.');
        }
      }

      setIsModalOpen(false);
      setEditingId(null);
      setImageDraft(null);
      setExistingImageUrl(null);
      await refreshState();
    } catch (err) {
      setFormError(err.message || (editingId ? 'Could not update product' : 'Could not create product'));
    } finally {
      setSaving(false);
    }
  };

  const modalImageSrc = imageDraft ? blobPreviewUrl : existingImageUrl;

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Products
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">
            Manage your candle collection · upload product images when adding or editing
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
                    <div className="flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[10px] bg-gradient-to-br from-[var(--cream)] to-[var(--blush)] text-[22px] text-[var(--text2)]">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span title="No image yet — add one in Add / Edit product" className="select-none">
                          🕯️
                        </span>
                      )}
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
                  <td className="px-[15px] py-[13px] align-middle">
                    <div className="flex flex-wrap items-center gap-[8px]">
                      <button
                        type="button"
                        onClick={() => openEditProduct(p)}
                        disabled={deletingId === p.id}
                        className="inline-flex items-center gap-[6px] rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] px-[10px] py-[6px] text-[12px] font-semibold text-[var(--text2)] transition-colors hover:border-[var(--sage)] hover:text-[var(--sage)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p)}
                        disabled={deletingId === p.id}
                        className="inline-flex items-center gap-[6px] rounded-[8px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] px-[10px] py-[6px] text-[12px] font-semibold text-[#dc2626] transition-colors hover:bg-[#dc2626] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === p.id ? '…' : '🗑️ Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={isModalOpen} onClose={closeAddProduct}>
        <div className="flex max-h-[min(100dvh-32px,calc(100vh-32px))] w-full min-w-0 flex-col overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--bg2)] shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
          <div className="flex shrink-0 items-center justify-between px-[26px] pt-[26px] pb-[14px]">
            <h3 className="font-['DM_Serif_Display',serif] text-[19px] text-[var(--text)]">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h3>
            <button
              type="button"
              onClick={closeAddProduct}
              className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface2)] text-[16px] text-[var(--text2)] transition-colors hover:bg-[#ef4444] hover:text-white"
              aria-label="Close add product modal"
              disabled={saving}
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid min-h-0 min-w-0 flex-1 gap-[12px] overflow-y-auto overflow-x-hidden overscroll-y-contain px-[26px] pb-[26px] [scrollbar-gutter:stable]"
          >
            <div className="grid min-w-0 grid-cols-1 gap-[12px] sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-[6px]">
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
              <div className="flex min-w-0 flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  {editingId ? 'Product ID' : 'Product ID (Optional)'}
                </label>
                <input
                  value={form.id}
                  onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                  placeholder="e.g. p-lavender-mist"
                  disabled={!!editingId}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)] disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-[12px] sm:grid-cols-3">
              <div className="flex min-w-0 flex-col gap-[6px]">
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
              <div className="flex min-w-0 flex-col gap-[6px]">
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
              <div className="flex min-w-0 flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-[6px]">
              <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                Fragrance
              </label>
              <input
                value={form.fragrance}
                onChange={(e) => setForm((f) => ({ ...f, fragrance: e.target.value }))}
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-[8px]">
              <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                Product image
              </label>
              <div className="flex min-w-0 flex-wrap items-start gap-[14px]">
                <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface2)] text-[28px] text-[var(--text3)]">
                  {modalImageSrc ? (
                    <img src={modalImageSrc} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="select-none" aria-hidden>
                      🕯️
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
                  <label className="inline-flex w-fit cursor-pointer rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[14px] py-[8px] text-[12px] font-semibold text-[var(--sage)] transition-colors hover:bg-[rgba(132,165,157,0.08)]">
                    {imageDraft ? 'Replace image…' : 'Choose image…'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={saving}
                      onChange={handleModalImagePick}
                    />
                  </label>
                  {imageDraft ? (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => setImageDraft(null)}
                      className="w-fit rounded-[8px] border border-[var(--border)] px-[12px] py-[6px] text-[11.5px] font-medium text-[var(--text2)] hover:border-[var(--sage)] hover:text-[var(--sage)] disabled:opacity-50"
                    >
                      Clear new selection
                    </button>
                  ) : null}
                  <p className="text-[11px] leading-relaxed text-[var(--text2)]">
                    JPEG, PNG, WebP or GIF. Image uploads after you save (Cloudinary must be configured on the server).
                  </p>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-[6px]">
              <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
                className="max-w-full min-h-[100px] w-full resize-y break-words rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
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
                {saving ? (editingId ? 'Saving…' : 'Creating…') : editingId ? 'Save changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Products;
