import React, { useMemo, useState } from 'react';
import { useAdmin } from '../AdminContext.jsx';
import { uploadBlogCover, fetchBlogApi } from '../api/client.js';
import Modal from '../components/ui/Modal.jsx';

const emptyForm = () => ({
  title: '',
  date: new Date().toISOString().slice(0, 10),
  tag: 'Journal',
  emoji: '🕯️',
  excerpt: '',
  content: '',
  published: false,
});

function Blogs() {
  const {
    state,
    toggleBlogPublished,
    removeBlog,
    refreshState,
    createBlog,
    saveBlog,
  } = useAdmin();
  const [uploadingBlogId, setUploadingBlogId] = useState(null);
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loadEditor, setLoadEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filteredBlogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return state.blogs;
    return state.blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.excerpt || '').toLowerCase().includes(q) ||
        (b.tag || '').toLowerCase().includes(q)
    );
  }, [state.blogs, search]);

  const handleCoverUpload = async (blogId, e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingBlogId(blogId);
    try {
      await uploadBlogCover(blogId, file);
      await refreshState();
    } catch (err) {
      window.alert(err.message || 'Upload failed');
    } finally {
      setUploadingBlogId(null);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setEditorOpen(true);
  };

  const openEdit = async (id) => {
    setEditingId(id);
    setEditorOpen(true);
    setLoadEditor(true);
    try {
      const full = await fetchBlogApi(id);
      setForm({
        title: full.title || '',
        date: full.date || new Date().toISOString().slice(0, 10),
        tag: full.tag || 'Journal',
        emoji: full.emoji || '🕯️',
        excerpt: full.excerpt || '',
        content: full.content || '',
        published: !!full.published,
      });
    } catch (err) {
      window.alert(err.message || 'Could not load post');
      setEditorOpen(false);
      setEditingId(null);
    } finally {
      setLoadEditor(false);
    }
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      window.alert('Title is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title,
        date: form.date.trim(),
        tag: form.tag.trim() || 'Journal',
        emoji: form.emoji.trim() || '🕯️',
        excerpt: form.excerpt.trim(),
        content: form.content,
        published: form.published,
      };
      if (editingId) {
        await saveBlog(editingId, payload);
      } else {
        await createBlog(payload);
      }
      closeEditor();
    } catch (err) {
      window.alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Blog Management
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">
            Create and manage blog posts
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-[10px]">
          <div className="flex min-w-[200px] max-w-[280px] flex-1 items-center gap-[8px] rounded-[12px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[8px] focus-within:border-[var(--sage)] focus-within:shadow-[0_0_0_3px_rgba(132,165,157,0.12)]">
            <span className="text-[14px] text-[var(--text3)]" aria-hidden>
              🔍
            </span>
            <input
              type="search"
              value={search}
              onChange={(ev) => setSearch(ev.target.value)}
              placeholder="Search posts…"
              className="w-full border-none bg-transparent text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--text3)]"
            />
          </div>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-[7px] rounded-[10px] bg-gradient-to-br from-[var(--gold)] to-[#e8a830] px-[17px] py-[9px] text-[13px] font-medium text-[var(--dark)] shadow-[0_4px_14px_rgba(246,189,96,0.28)] transition-transform duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(246,189,96,0.38)]"
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[6px] bg-[rgba(0,0,0,0.08)] text-[14px]">
              +
            </span>
            New Post
          </button>
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <p className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-[20px] py-[24px] text-[13px] text-[var(--text2)]">
          {state.blogs.length === 0
            ? 'No posts yet. Click “New Post” to create one.'
            : 'No posts match your search.'}
        </p>
      ) : (
        <div className="flex flex-wrap gap-[18px]">
          {filteredBlogs.map((b) => (
            <div
              key={b.id}
              className="flex h-full min-w-[260px] flex-1 basis-[calc(33.333%-12px)] flex-col overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] transition-transform hover:-translate-y-[3px] hover:shadow-[var(--shadow-lg)]"
            >
              <div className="relative flex h-[130px] items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--cream)] via-[var(--blush)] to-[var(--sage)] text-[38px]">
                {b.coverImageUrl ? (
                  <img
                    src={b.coverImageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  b.emoji
                )}
              </div>
              <div className="flex flex-1 flex-col px-[15px] py-[12px]">
                <div className="font-['DM_Serif_Display',serif] text-[15px] text-[var(--text)]">
                  {b.title}
                </div>
                <div className="mt-[4px] flex flex-wrap items-center gap-[6px] text-[11.5px] text-[var(--text2)]">
                  <span>📅 {b.date}</span>
                  <span
                    className={`inline-flex items-center rounded-[20px] px-[10px] py-[4px] text-[11px] font-semibold capitalize ${
                      b.published
                        ? 'bg-[rgba(16,185,129,0.15)] text-[#059669]'
                        : 'bg-[rgba(156,163,175,0.2)] text-[var(--text2)]'
                    }`}
                  >
                    {b.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="mt-[6px] flex-1 text-[12px] leading-relaxed text-[var(--text2)]">
                  {b.excerpt}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-[7px] border-t border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[10px]">
                <label className="inline-flex cursor-pointer items-center gap-[6px] rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-[12px] py-[6px] text-[12px] text-[var(--text2)] transition-colors hover:border-[var(--sage)] hover:text-[var(--sage)]">
                  {uploadingBlogId === b.id ? '…' : '🖼 Cover'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={uploadingBlogId === b.id}
                    onChange={(e) => handleCoverUpload(b.id, e)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => openEdit(b.id)}
                  className="inline-flex items-center gap-[6px] rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-[12px] py-[6px] text-[12px] text-[var(--text2)] transition-colors hover:border-[var(--sage)] hover:text-[var(--sage)]"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm('Delete this post?')) return;
                    try {
                      await removeBlog(b.id);
                    } catch (err) {
                      window.alert(err.message || 'Delete failed');
                    }
                  }}
                  className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.08)] text-[13px] text-[#dc2626] transition-colors hover:bg-[#dc2626] hover:text-white"
                >
                  🗑️
                </button>
                <button
                  type="button"
                  onClick={() => toggleBlogPublished(b.id, !b.published)}
                  className={`ml-auto inline-flex items-center gap-[6px] rounded-[8px] px-[12px] py-[6px] text-[12px] font-medium transition-colors ${
                    b.published
                      ? 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text2)] hover:border-[var(--sage)] hover:text-[var(--sage)]'
                      : 'bg-gradient-to-br from-[var(--sage)] to-[#6b9088] text-white shadow-[0_4px_14px_rgba(132,165,157,0.28)] hover:shadow-[0_6px_20px_rgba(132,165,157,0.38)]'
                  }`}
                >
                  {b.published ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={editorOpen} onClose={closeEditor}>
        <div className="max-h-[90vh] w-[min(100vw-32px,560px)] overflow-y-auto rounded-[20px] border border-[var(--border)] bg-[var(--bg2)] p-[26px] shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
          <div className="mb-[18px] flex items-center justify-between gap-3">
            <h3 className="font-['DM_Serif_Display',serif] text-[19px] text-[var(--text)]">
              {editingId ? 'Edit post' : 'New post'}
            </h3>
            <button
              type="button"
              onClick={closeEditor}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-[var(--surface2)] text-[16px] text-[var(--text2)] transition-colors hover:bg-[#ef4444] hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {loadEditor ? (
            <p className="text-[13px] text-[var(--text2)]">Loading…</p>
          ) : (
            <form onSubmit={handleSave} className="grid gap-[14px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(ev) => setForm((f) => ({ ...f, title: ev.target.value }))}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                  required
                />
              </div>
              <div className="grid gap-[14px] sm:grid-cols-2">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(ev) => setForm((f) => ({ ...f, date: ev.target.value }))}
                    className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                    Tag
                  </label>
                  <input
                    value={form.tag}
                    onChange={(ev) => setForm((f) => ({ ...f, tag: ev.target.value }))}
                    className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  Emoji (no cover image)
                </label>
                <input
                  value={form.emoji}
                  onChange={(ev) => setForm((f) => ({ ...f, emoji: ev.target.value }))}
                  className="w-full max-w-[120px] rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[20px] outline-none focus:border-[var(--sage)]"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  Excerpt
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(ev) => setForm((f) => ({ ...f, excerpt: ev.target.value }))}
                  rows={3}
                  className="w-full resize-y rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text2)]">
                  Content
                </label>
                <textarea
                  value={form.content}
                  onChange={(ev) => setForm((f) => ({ ...f, content: ev.target.value }))}
                  rows={8}
                  className="w-full resize-y rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--sage)]"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-[10px] text-[13px] text-[var(--text)]">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(ev) => setForm((f) => ({ ...f, published: ev.target.checked }))}
                  className="h-[16px] w-[16px] accent-[var(--sage)]"
                />
                Published (visible on storefront)
              </label>
              <div className="mt-[6px] flex justify-end gap-[9px] border-t border-[var(--border)] pt-[16px]">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="rounded-[10px] border border-[var(--border)] bg-transparent px-[17px] py-[9px] text-[13px] font-medium text-[var(--text2)] hover:bg-[rgba(132,165,157,0.06)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-[10px] bg-gradient-to-br from-[var(--sage)] to-[#6b9088] px-[17px] py-[9px] text-[13px] font-medium text-white shadow-[0_4px_14px_rgba(132,165,157,0.28)] disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create post'}
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Blogs;
