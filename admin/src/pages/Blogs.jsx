import React from 'react';
import { useAdmin } from '../AdminContext.jsx';

function Blogs() {
  const { state } = useAdmin();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Blog Management
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">
            Create and manage blog posts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2 lg:grid-cols-3">
        {state.blogs.map((b) => (
          <div
            key={b.id}
            className="overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] transition-transform hover:-translate-y-[3px] hover:shadow-[var(--shadow-lg)]"
          >
            <div className="flex h-[130px] items-center justify-center bg-gradient-to-br from-[var(--cream)] via-[var(--blush)] to-[var(--sage)] text-[38px]">
              {b.emoji}
            </div>
            <div className="px-[15px] py-[12px]">
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
              <div className="mt-[6px] text-[12px] leading-relaxed text-[var(--text2)]">
                {b.excerpt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;

