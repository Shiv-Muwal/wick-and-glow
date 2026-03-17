import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { DASHBOARD_STATS, RECENT_ORDERS, TOP_SELLERS } from '../dashboardConfig.js';

function Dashboard() {
  const salesRef = useRef(null);
  const categoryRef = useRef(null);
  const salesChartRef = useRef(null);
  const categoryChartRef = useRef(null);

  useEffect(() => {
    const salesCtx = salesRef.current;
    const categoryCtx = categoryRef.current;

    if (salesCtx) {
      salesChartRef.current = new Chart(salesCtx, {
        type: 'line',
        data: {
          labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          datasets: [
            {
              label: 'Revenue',
              data: [
                12000, 18000, 25000, 21000, 28000, 32000, 29000, 35000, 31000, 38000, 42000,
                48000,
              ],
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
                label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString()}`,
              },
            },
          },
          scales: {
            y: {
              grid: { color: 'rgba(132,165,157,0.1)' },
              ticks: {
                color: '#9ca3af',
                font: { family: 'Poppins', size: 11 },
                callback: (v) => `₹${v / 1000}k`,
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

    if (categoryCtx) {
      categoryChartRef.current = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
          labels: ['Floral', 'Woody', 'Citrus', 'Herbal', 'Oriental', 'Tropical'],
          datasets: [
            {
              data: [32, 24, 18, 12, 8, 6],
              backgroundColor: [
                '#f5cac3',
                '#84a59d',
                '#f6bd60',
                '#a8c5bf',
                '#e8c17a',
                '#c9d6e3',
              ],
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
                label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
              },
            },
          },
        },
      });
    }

    return () => {
      if (salesChartRef.current) {
        salesChartRef.current.destroy();
      }
      if (categoryChartRef.current) {
        categoryChartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-[18px]">
        {DASHBOARD_STATS.map((card, idx) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
          >
            <div
              className={`mb-[14px] flex h-[44px] w-[44px] items-center justify-center rounded-[12px] text-[20px] ${card.badgeColor}`}
            >
              {card.badgeIcon || ['🕯️', '📦', '💰', '👥'][idx]}
            </div>
            <div className="stat-label text-[11.5px] font-medium uppercase tracking-[0.05em] text-[var(--text2)]">
              {card.label}
            </div>
            <div className="stat-value mb-[8px] text-[27px] font-bold text-[var(--text)]">
              {card.value}
            </div>
            <div className="stat-change text-[12px] text-[var(--text2)]">{card.change}</div>
          </div>
        ))}
      </div>

      {/* Charts row - Revenue + By Category on one line */}
      <div className="flex gap-[18px]">
        <div className="flex-[2] rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)]">
          <div className="mb-[18px] flex items-start justify-between">
            <div>
              <div className="font-['DM_Serif_Display',serif] text-[16px] text-[var(--text)]">
                Monthly Revenue
              </div>
              <div className="mt-[2px] text-[12px] text-[var(--text2)]">Jan – Dec 2024</div>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <canvas ref={salesRef} />
          </div>
        </div>

        <div className="flex-1 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)]">
          <div className="mb-[18px] flex items-start justify-between">
            <div>
              <div className="font-['DM_Serif_Display',serif] text-[16px] text-[var(--text)]">
                By Category
              </div>
              <div className="mt-[2px] text-[12px] text-[var(--text2)]">Sales distribution</div>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <canvas ref={categoryRef} />
          </div>
        </div>
      </div>

      {/* Recent orders + Top sellers in a row */}
      <div className="flex gap-[18px]">
        {/* Recent Orders */}
        <div className="flex-[2] rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)]">
          <div className="mb-[18px] flex items-start justify-between">
            <div>
              <div className="font-['DM_Serif_Display',serif] text-[16px] text-[var(--text)]">
                Recent Orders
              </div>
              <div className="mt-[2px] text-[12px] text-[var(--text2)]">
                Latest 5 transactions
              </div>
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
                {RECENT_ORDERS.map(([id, name, amount, status]) => (
                  <tr
                    key={id}
                    className="border-b border-[var(--border)] last:border-b-0"
                  >
                    <td className="px-[15px] py-[13px] align-middle font-semibold text-[var(--text)]">
                      {id}
                    </td>
                    <td className="px-[15px] py-[13px] align-middle text-[var(--text)]">
                      {name}
                    </td>
                    <td className="px-[15px] py-[13px] align-middle font-semibold text-[var(--text)]">
                      {amount}
                    </td>
                    <td className="px-[15px] py-[13px] align-middle text-[var(--text)]">
                      {status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="flex-1 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)]">
          <div className="mb-[18px] flex items-start justify-between">
            <div>
              <div className="font-['DM_Serif_Display',serif] text-[16px] text-[var(--text)]">
                Top Sellers
              </div>
              <div className="mt-[2px] text-[12px] text-[var(--text2)]">By revenue</div>
            </div>
          </div>
          <div>
            {TOP_SELLERS.map((p) => (
              <div
                key={p.rank}
                className="flex items-center gap-[11px] border-b border-[var(--border)] py-[10px] last:border-b-0"
              >
                <div
                  className={`flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[8px] text-[11px] font-bold ${
                    p.gold
                      ? 'bg-[rgba(246,189,96,0.2)] text-[var(--gold)]'
                      : 'bg-[var(--surface2)] text-[#9ca3af]'
                  }`}
                >
                  {p.rank}
                </div>
                <div className="text-[22px]">{p.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-[var(--text)]">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-[var(--text2)]">{p.cat}</div>
                  <div className="mt-[4px] h-[5px] rounded-[3px] bg-[var(--border)]">
                    <div
                      className="h-[5px] rounded-[3px] transition-[width] duration-[1200ms] ease-out"
                      style={{ width: p.width, background: p.bar }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-[var(--text)]">
                    {p.revenue}
                  </div>
                  <div className="text-[11px] text-[var(--text2)]">{p.units}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

