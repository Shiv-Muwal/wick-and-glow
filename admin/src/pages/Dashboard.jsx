import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { fetchAdminDashboard } from '../api/client.js';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CATEGORY_COLORS = ['#f5cac3', '#84a59d', '#f6bd60', '#a8c5bf', '#e8c17a', '#c9d6e3', '#a78bfa', '#fda4af'];
const TOP_BAR_COLORS = ['var(--sage)', 'var(--gold)', 'var(--blush)', '#c9d6e3', '#a8c5bf', '#e8c17a'];
const BADGE_ICONS = ['🕯️', '📦', '💰', '👥'];
const BADGE_COLORS = [
  'bg-[rgba(132,165,157,0.15)]',
  'bg-[rgba(246,189,96,0.15)]',
  'bg-[rgba(245,202,195,0.22)]',
  'bg-[rgba(167,139,250,0.15)]',
];

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}

function formatCompactINR(n) {
  const x = Number(n) || 0;
  if (x >= 10000000) return `₹${(x / 10000000).toFixed(2)} Cr`;
  if (x >= 100000) return `₹${Math.round(x / 1000)}K`;
  if (x >= 1000) return `₹${(x / 1000).toFixed(1)}K`;
  return `₹${x.toLocaleString('en-IN')}`;
}

function formatStatus(s) {
  if (!s) return '—';
  const t = String(s).replace(/_/g, ' ').trim();
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

function ordersSubtitle(stats) {
  if (stats.ordersToday === 0 && stats.ordersYesterday === 0) return 'No orders today or yesterday';
  if (stats.ordersYesterday === 0)
    return stats.ordersToday > 0 ? 'No orders yesterday — activity today' : '—';
  const arrow = stats.ordersDeltaPercent >= 0 ? '↑' : '↓';
  return `${arrow} ${Math.abs(stats.ordersDeltaPercent)}% vs yesterday`;
}

function revenueSubtitle(stats) {
  if (stats.revenueMonth <= 0 && stats.revenuePrevMonth <= 0) return 'No paid orders this month yet';
  if (stats.revenuePrevMonth <= 0)
    return stats.revenueMonth > 0 ? 'New revenue this month' : '—';
  const arrow = stats.revenueDeltaPercent >= 0 ? '↑' : '↓';
  return `${arrow} ${Math.abs(stats.revenueDeltaPercent)}% vs last month`;
}

function Dashboard() {
  const [dash, setDash] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const salesRef = useRef(null);
  const categoryRef = useRef(null);
  const salesChartRef = useRef(null);
  const categoryChartRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr('');
    fetchAdminDashboard()
      .then((d) => {
        if (!cancelled) setDash(d);
      })
      .catch((e) => {
        if (!cancelled) setErr(e.message || 'Failed to load dashboard');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!dash) return undefined;

    if (salesChartRef.current) {
      salesChartRef.current.destroy();
      salesChartRef.current = null;
    }
    if (categoryChartRef.current) {
      categoryChartRef.current.destroy();
      categoryChartRef.current = null;
    }

    const salesCtx = salesRef.current;
    const categoryCtx = categoryRef.current;

    const lineValues =
      Array.isArray(dash.monthlyRevenue) && dash.monthlyRevenue.length === 12
        ? dash.monthlyRevenue
        : MONTH_LABELS.map(() => 0);

    if (salesCtx) {
      salesChartRef.current = new Chart(salesCtx, {
        type: 'line',
        data: {
          labels: MONTH_LABELS,
          datasets: [
            {
              label: 'Revenue',
              data: lineValues,
              borderColor: '#84a59d',
              backgroundColor: 'rgba(132,165,157,0.08)',
              borderWidth: 2.5,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#84a59d',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(31,41,55,0.92)',
              titleColor: '#f7ede2',
              bodyColor: '#f7ede2',
              borderColor: 'rgba(132,165,157,0.3)',
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label: (ctx) => ` ₹${Number(ctx.parsed.y).toLocaleString('en-IN')}`,
              },
            },
          },
          scales: {
            y: {
              grid: { color: 'rgba(132,165,157,0.1)' },
              ticks: {
                color: '#9ca3af',
                font: { family: 'Poppins', size: 11 },
                callback: (v) => `₹${Number(v) / 1000}k`,
              },
              border: { display: false },
            },
            x: {
              grid: { display: false },
              ticks: { color: '#9ca3af', font: { family: 'Poppins', size: 11 } },
              border: { display: false },
            },
          },
        },
      });
    }

    const cats = Array.isArray(dash.categoryDistribution) ? dash.categoryDistribution : [];
    const catTotal = cats.reduce((s, c) => s + (Number(c.revenue) || 0), 0);
    let donutLabels;
    let donutData;
    let donutBg;
    if (cats.length === 0 || catTotal <= 0) {
      donutLabels = ['No sales yet'];
      donutData = [1];
      donutBg = ['#e5e7eb'];
    } else {
      donutLabels = cats.map((c) => c.label);
      donutData = cats.map((c) => c.revenue);
      donutBg = cats.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]);
    }

    if (categoryCtx) {
      categoryChartRef.current = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
          labels: donutLabels,
          datasets: [
            {
              data: donutData,
              backgroundColor: donutBg,
              borderWidth: 0,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#9ca3af',
                font: { family: 'Poppins', size: 11 },
                padding: 10,
                boxWidth: 10,
              },
            },
            tooltip: {
              backgroundColor: 'rgba(31,41,55,0.92)',
              titleColor: '#f7ede2',
              bodyColor: '#f7ede2',
              callbacks: {
                label: (ctx) => {
                  if (donutLabels[0] === 'No sales yet' && catTotal <= 0) {
                    return ' No category breakdown yet';
                  }
                  const v = Number(ctx.parsed) || 0;
                  const total = ctx.dataset.data.reduce((a, b) => a + Number(b), 0);
                  const pct = total ? Math.round((v / total) * 100) : 0;
                  return ` ₹${v.toLocaleString('en-IN')} (${pct}%)`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      salesChartRef.current?.destroy();
      categoryChartRef.current?.destroy();
    };
  }, [dash]);

  if (loading) {
    return (
      <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[28px] text-[14px] text-[var(--text2)] shadow-[var(--shadow)]">
        Loading dashboard…
      </div>
    );
  }

  if (err) {
    return (
      <div className="rounded-[16px] border border-red-200 bg-red-50 p-[28px] text-[14px] text-red-800">
        {err}
      </div>
    );
  }

  if (!dash?.stats) return null;

  const { stats, chartYear, recentOrders, topSellers } = dash;
  const maxTopRev = topSellers?.length ? Math.max(...topSellers.map((p) => p.revenue), 1) : 1;

  const statCards = [
    {
      label: 'Total Products',
      value: String(stats.totalProducts),
      change: 'Live catalog count',
    },
    {
      label: 'Orders Today',
      value: String(stats.ordersToday),
      change: ordersSubtitle(stats),
    },
    {
      label: 'Revenue',
      value: formatCompactINR(stats.revenueMonth),
      change: revenueSubtitle(stats),
    },
    {
      label: 'Customers',
      value: String(stats.totalCustomers),
      change: 'Unique profiles from checkout',
    },
  ];

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="grid grid-cols-4 gap-[18px]">
        {statCards.map((card, idx) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
          >
            <div
              className={`mb-[14px] flex h-[44px] w-[44px] items-center justify-center rounded-[12px] text-[20px] ${BADGE_COLORS[idx]}`}
            >
              {BADGE_ICONS[idx]}
            </div>
            <div className="stat-label text-[11.5px] font-medium uppercase tracking-[0.05em] text-[var(--text2)]">
              {card.label}
            </div>
            <div className="stat-value mb-[8px] text-[27px] font-bold text-[var(--text)]">{card.value}</div>
            <div className="stat-change text-[12px] text-[var(--text2)]">{card.change}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-[18px]">
        <div className="min-w-0 flex-[2] rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)]">
          <div className="mb-[18px] flex items-start justify-between">
            <div>
              <div className="font-['DM_Serif_Display',serif] text-[16px] text-[var(--text)]">
                Monthly Revenue
              </div>
              <div className="mt-[2px] text-[12px] text-[var(--text2)]">
                Jan – Dec {chartYear}
              </div>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <canvas ref={salesRef} />
          </div>
        </div>

        <div className="min-w-0 flex-1 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)]">
          <div className="mb-[18px] flex items-start justify-between">
            <div>
              <div className="font-['DM_Serif_Display',serif] text-[16px] text-[var(--text)]">
                By Category
              </div>
              <div className="mt-[2px] text-[12px] text-[var(--text2)]">Sales by category (line totals)</div>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <canvas ref={categoryRef} />
          </div>
        </div>
      </div>

      <div className="flex gap-[18px]">
        <div className="min-w-0 flex-[2] rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)]">
          <div className="mb-[18px] flex items-start justify-between">
            <div>
              <div className="font-['DM_Serif_Display',serif] text-[16px] text-[var(--text)]">
                Recent Orders
              </div>
              <div className="mt-[2px] text-[12px] text-[var(--text2)]">Latest 5 transactions</div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[12px] border border-[var(--border)]">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface2)]">
                  {['Order ID', 'Customer', 'Amount', 'Status'].map((h) => (
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
                {recentOrders?.length ? (
                  recentOrders.map((row) => (
                    <tr key={row.id} className="border-b border-[var(--border)] last:border-b-0">
                      <td className="px-[15px] py-[13px] align-middle font-semibold text-[var(--text)]">
                        {row.id}
                      </td>
                      <td className="px-[15px] py-[13px] align-middle text-[var(--text)]">{row.customer}</td>
                      <td className="px-[15px] py-[13px] align-middle font-semibold text-[var(--text)]">
                        {formatINR(row.amount)}
                      </td>
                      <td className="px-[15px] py-[13px] align-middle text-[var(--text)]">
                        {formatStatus(row.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-[15px] py-[20px] text-center text-[var(--text2)]">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="min-w-0 flex-1 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)]">
          <div className="mb-[18px] flex items-start justify-between">
            <div>
              <div className="font-['DM_Serif_Display',serif] text-[16px] text-[var(--text)]">
                Top Sellers
              </div>
              <div className="mt-[2px] text-[12px] text-[var(--text2)]">By revenue (from order lines)</div>
            </div>
          </div>
          <div>
            {topSellers?.length ? (
              topSellers.map((p, i) => {
                const pct = Math.round((p.revenue / maxTopRev) * 100);
                const gold = i === 0;
                return (
                  <div
                    key={`${p.name}-${p.rank}`}
                    className="flex items-center gap-[11px] border-b border-[var(--border)] py-[10px] last:border-b-0"
                  >
                    <div
                      className={`flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[8px] text-[11px] font-bold ${
                        gold
                          ? 'bg-[rgba(246,189,96,0.2)] text-[var(--gold)]'
                          : 'bg-[var(--surface2)] text-[#9ca3af]'
                      }`}
                    >
                      {p.rank}
                    </div>
                    <div className="text-[22px]">{p.emoji || '🕯️'}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-[var(--text)]">{p.name}</div>
                      <div className="text-[11px] text-[var(--text2)]">{p.category || '—'}</div>
                      <div className="mt-[4px] h-[5px] rounded-[3px] bg-[var(--border)]">
                        <div
                          className="h-[5px] rounded-[3px] transition-[width] duration-[1200ms] ease-out"
                          style={{ width: `${pct}%`, background: TOP_BAR_COLORS[i % TOP_BAR_COLORS.length] }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-semibold text-[var(--text)]">
                        {formatCompactINR(p.revenue)}
                      </div>
                      <div className="text-[11px] text-[var(--text2)]">{p.units} sold</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-[16px] text-[13px] text-[var(--text2)]">No product sales recorded yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
