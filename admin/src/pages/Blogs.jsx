import React from 'react';
import { useAdmin } from '../AdminContext.jsx';

function Blogs() {
  const { state } = useAdmin();

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Blog Management
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">
            Create and manage blog posts
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-[7px] rounded-[10px] bg-gradient-to-br from-[var(--gold)] to-[#e8a830] px-[17px] py-[9px] text-[13px] font-medium text-[var(--dark)] shadow-[0_4px_14px_rgba(246,189,96,0.28)] transition-transform duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(246,189,96,0.38)]"
        >
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[6px] bg-[rgba(0,0,0,0.08)] text-[14px]">
            +
          </span>
          New Post
        </button>
      </div>

      {/* Blog cards row/column layout (no CSS grid) */}
      <div className="flex flex-wrap gap-[18px]">
        {state.blogs.map((b) => (
          <div
            key={b.id}
            className="flex h-full min-w-[260px] flex-1 basis-[calc(33.333%-12px)] flex-col overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] transition-transform hover:-translate-y-[3px] hover:shadow-[var(--shadow-lg)]"
          >
            <div className="flex h-[130px] items-center justify-center bg-gradient-to-br from-[var(--cream)] via-[var(--blush)] to-[var(--sage)] text-[38px]">
              {b.emoji}
            </div>
            <div className="flex flex-1 flex-col px-[15px] py-[12px]">
              <div className="font-['DM_Serif_Display',serif] text-[15px] text-[var(--text)]">
                {b.title}
              </div>
              <div className="mt-[4px] flex items-center gap-[6px] text-[11.5px] text-[var(--text2)]">
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
            <div className="flex items-center gap-[7px] border-t border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[10px]">
              <button
                type="button"
                className="inline-flex items-center gap-[6px] rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-[12px] py-[6px] text-[12px] text-[var(--text2)] transition-colors hover:border-[var(--sage)] hover:text-[var(--sage)]"
              >
                ✏️ Edit
              </button>
              <button
                type="button"
                className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.08)] text-[13px] text-[#dc2626] transition-colors hover:bg-[#dc2626] hover:text-white"
              >
                🗑️
              </button>
              <button
                type="button"
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
    </div>
  );
}

export default Blogs;

