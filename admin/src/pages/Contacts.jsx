import React, { useEffect, useState } from 'react';
import { fetchAdminContacts } from '../api/client.js';

function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Contacts() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAdminContacts();
        if (!cancelled) {
          setRows(Array.isArray(data) ? data : []);
          setError('');
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load contact messages');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Contacts
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">
            Website contact form submissions
          </p>
        </div>
        <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] px-[10px] py-[6px] text-[12px] text-[var(--text2)]">
          Total: {rows.length}
        </div>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)]">
        {loading ? (
          <p className="px-[15px] py-[14px] text-[13px] text-[var(--text2)]">Loading contact messages...</p>
        ) : error ? (
          <p className="px-[15px] py-[14px] text-[13px] text-red-600">{error}</p>
        ) : rows.length === 0 ? (
          <p className="px-[15px] py-[14px] text-[13px] text-[var(--text2)]">No contact messages found.</p>
        ) : (
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface2)]">
                <th className="whitespace-nowrap px-[15px] py-[12px] text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text2)]">
                  Name
                </th>
                <th className="whitespace-nowrap px-[15px] py-[12px] text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text2)]">
                  Email
                </th>
                <th className="whitespace-nowrap px-[15px] py-[12px] text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text2)]">
                  Phone
                </th>
                <th className="whitespace-nowrap px-[15px] py-[12px] text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text2)]">
                  Subject
                </th>
                <th className="whitespace-nowrap px-[15px] py-[12px] text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text2)]">
                  Message
                </th>
                <th className="whitespace-nowrap px-[15px] py-[12px] text-left text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text2)]">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id} className="border-b border-[var(--border)] align-top last:border-b-0 hover:bg-[var(--surface2)]">
                  <td className="px-[15px] py-[13px] text-[var(--text)]">
                    <div className="font-medium">{`${m.firstName || ''} ${m.lastName || ''}`.trim() || '—'}</div>
                  </td>
                  <td className="px-[15px] py-[13px] text-[var(--text2)]">{m.email || '—'}</td>
                  <td className="px-[15px] py-[13px] text-[var(--text2)]">{m.phone || '—'}</td>
                  <td className="px-[15px] py-[13px] text-[var(--text2)]">{m.subject || 'General'}</td>
                  <td className="max-w-[520px] px-[15px] py-[13px] text-[var(--text)]">{m.message || '—'}</td>
                  <td className="whitespace-nowrap px-[15px] py-[13px] text-[var(--text2)]">
                    {formatDateTime(m.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Contacts;
