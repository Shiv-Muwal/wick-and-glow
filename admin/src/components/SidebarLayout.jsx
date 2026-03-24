import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { clearAdminSessionToken, getAdminProfileEmail } from '../api/client.js';
import { LogoutIcon, SearchIcon, BellIcon, SettingsIcon } from './logos.jsx';
import { MAIN_LINKS, CONTENT_LINKS, SYSTEM_LINKS } from '../sidebarLinks.js';

const TITLE_MAP = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/orders': 'Orders',
  '/customers': 'Customers',
  '/contacts': 'Contacts',
  '/blogs': 'Blog Management',
  '/inventory': 'Inventory',
  '/reviews': 'Reviews',
  '/coupons': 'Coupons',
  '/settings': 'Settings',
};

const ADMIN_DISPLAY_NAME = import.meta.env.VITE_ADMIN_DISPLAY_NAME || 'Admin User';
const ADMIN_EMAIL_FALLBACK = import.meta.env.VITE_ADMIN_EMAIL || 'hello@wickandglow.com';

function initialsFromDisplayName(name) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return 'AD';
}

function SidebarLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const title =
    location.pathname.startsWith('/orders/') && location.pathname !== '/orders'
      ? 'Order details'
      : TITLE_MAP[location.pathname] || 'Dashboard';
  const [collapsed, setCollapsed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileMenuBox, setProfileMenuBox] = useState(null);
  const profileMenuRef = useRef(null);
  const avatarBtnRef = useRef(null);

  useLayoutEffect(() => {
    if (!profileMenuOpen) {
      setProfileMenuBox(null);
      return undefined;
    }
    function updateProfileMenuPosition() {
      const el = avatarBtnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const margin = 12;
      const width = Math.min(260, Math.max(0, vw - 2 * margin));
      let right = vw - rect.right;
      const left = rect.right - width;
      if (left < margin) right = vw - margin - width;
      if (right < margin) right = margin;
      setProfileMenuBox({
        top: rect.bottom + 8,
        right,
        width,
      });
    }
    updateProfileMenuPosition();
    window.addEventListener('resize', updateProfileMenuPosition);
    window.addEventListener('scroll', updateProfileMenuPosition, true);
    return () => {
      window.removeEventListener('resize', updateProfileMenuPosition);
      window.removeEventListener('scroll', updateProfileMenuPosition, true);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    if (!profileMenuOpen) return undefined;
    function handleClickOutside(e) {
      if (avatarBtnRef.current?.contains(e.target)) return;
      if (profileMenuRef.current?.contains(e.target)) return;
      setProfileMenuOpen(false);
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setProfileMenuOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [profileMenuOpen]);

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* Sidebar - Tailwind layout, HTML-like design */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] shadow-lg transition-[width] duration-300 ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
        aria-label="Admin navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-[18px] pb-[22px] pt-[26px]">
          <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--gold)] to-[#e8a830] text-[18px]">
            🕯️
          </div>
          <span
            className={`font-['DM_Serif_Display',serif] text-[18px] text-[var(--cream)] transition-opacity duration-300 ${
              collapsed ? 'opacity-0' : 'opacity-100'
            }`}
          >
            Wick &amp; Glow
          </span>
        </div>

        {/* Scrollable nav area */}
        <div className="flex flex-1 flex-col overflow-y-auto px-[10px] py-[14px]">
          <div
            className={`px-[10px] pb-[4px] pt-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60 transition-opacity duration-300 ${
              collapsed ? 'opacity-0' : 'opacity-100'
            }`}
          >
            Main
          </div>

          {MAIN_LINKS.map(({ to, label, icon: Icon, exact, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `mb-[2px] flex items-center gap-[11px] rounded-[10px] px-[10px] py-[11px] text-[13.5px] font-medium no-underline transition-colors ${
                  isActive
                    ? 'bg-[var(--sidebar-active)] text-[var(--gold)]'
                    : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--cream)]'
                }`
              }
            >
              <Icon className="nav-icon" />
              <span
                className={`whitespace-nowrap text-[13.5px] transition-opacity duration-300 ${
                  collapsed ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {label}
              </span>
              {!collapsed && badge && (
                <span className="ml-auto rounded-[20px] bg-[var(--gold)] px-[7px] py-[2px] text-[10px] font-bold text-[var(--dark)]">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}

          <div
            className={`px-[10px] pb-[4px] pt-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60 transition-opacity duration-300 ${
              collapsed ? 'opacity-0' : 'opacity-100'
            }`}
          >
            Content
          </div>

          {CONTENT_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `mb-[2px] flex items-center gap-[11px] rounded-[10px] px-[10px] py-[11px] text-[13.5px] font-medium no-underline transition-colors ${
                  isActive
                    ? 'bg-[var(--sidebar-active)] text-[var(--gold)]'
                    : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--cream)]'
                }`
              }
            >
              <Icon className="nav-icon" />
              <span
                className={`whitespace-nowrap text-[13.5px] transition-opacity duration-300 ${
                  collapsed ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {label}
              </span>
            </NavLink>
          ))}

          <div
            className={`px-[10px] pb-[4px] pt-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60 transition-opacity duration-300 ${
              collapsed ? 'opacity-0' : 'opacity-100'
            }`}
          >
            System
          </div>

          {SYSTEM_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `mb-[2px] flex items-center gap-[11px] rounded-[10px] px-[10px] py-[11px] text-[13.5px] font-medium no-underline transition-colors ${
                  isActive
                    ? 'bg-[var(--sidebar-active)] text-[var(--gold)]'
                    : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--cream)]'
                }`
              }
            >
              <Icon className="nav-icon" />
              <span
                className={`whitespace-nowrap text-[13.5px] transition-opacity duration-300 ${
                  collapsed ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {label}
              </span>
            </NavLink>
          ))}
        </div>

        {/* Fixed footer with logout pinned to bottom */}
        <div className="border-t border-white/10 px-[10px] py-[14px]">
          <button
            type="button"
            className="flex w-full items-center gap-[11px] rounded-[10px] px-[10px] py-[11px] text-[13.5px] font-medium text-[#ef4444] transition-colors hover:bg-[var(--sidebar-hover)]"
            onClick={() => {
              clearAdminSessionToken();
              navigate('/login', { replace: true });
            }}
          >
            <LogoutIcon className="nav-icon text-[#ef4444]" />
            {!collapsed && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className={`fixed top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--dark)] shadow-[var(--shadow)] transition-all duration-300 ${
          collapsed ? 'left-[56px]' : 'left-[244px]'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Main area with topbar */}
      <div
        className={`flex min-h-screen min-w-0 flex-1 flex-col transition-[margin-left] duration-300 ${
          collapsed ? 'ml-[72px]' : 'ml-[260px]'
        }`}
      >
        <header className="sticky top-0 z-40 flex h-[70px] min-w-0 items-center gap-[14px] border-b border-[var(--border)] bg-[var(--bg2)] px-[28px] backdrop-blur-[20px]">
          <h1
            id="page-title"
            className="min-w-0 flex-1 truncate font-['DM_Serif_Display',serif] text-[21px] text-[var(--text)]"
          >
            {title}
          </h1>

          {/* Search bar like original HTML */}
          <div className="flex w-[260px] items-center gap-[8px] rounded-[12px] border border-[var(--border)] bg-[var(--surface2)] px-[13px] py-[8px] transition-all focus-within:border-[var(--sage)] focus-within:shadow-[0_0_0_3px_rgba(132,165,157,0.12)]">
            <SearchIcon className="h-[16px] w-[16px] text-[var(--text3)]" />
            <input
              type="text"
              placeholder="Search anything…"
              className="w-full border-none bg-transparent text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--text3)]"
            />
          </div>

          {/* Right side actions – notifications, avatar */}
          <div className="flex items-center gap-[9px]">
            <button
              type="button"
              className="relative flex h-[39px] w-[39px] items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] text-[var(--text2)] transition-all hover:border-[var(--sage)] hover:bg-[var(--sage)] hover:text-white"
            >
              <BellIcon className="h-[17px] w-[17px]" />
              <div className="absolute right-[8px] top-[8px] h-[7px] w-[7px] rounded-full border-[1.5px] border-[var(--bg2)] bg-[#ef4444]" />
            </button>

            <div className="relative">
              <button
                ref={avatarBtnRef}
                type="button"
                onClick={() => setProfileMenuOpen((o) => !o)}
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
                className="flex h-[39px] w-[39px] items-center justify-center rounded-full border-2 border-[var(--border)] bg-gradient-to-br from-[var(--blush)] to-[var(--sage)] text-[13px] font-semibold text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--sage)] focus:ring-offset-2 focus:ring-offset-[var(--bg2)]"
              >
                {initialsFromDisplayName(ADMIN_DISPLAY_NAME)}
              </button>

              {profileMenuOpen && profileMenuBox
                ? createPortal(
                    <div
                      ref={profileMenuRef}
                      role="menu"
                      className="z-[60] rounded-[14px] border border-[var(--border)] bg-[var(--surface)] py-[12px] shadow-[0_12px_40px_rgba(15,23,42,0.14)]"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: 'fixed',
                        top: profileMenuBox.top,
                        right: profileMenuBox.right,
                        width: profileMenuBox.width,
                        boxSizing: 'border-box',
                      }}
                    >
                      <div className="px-[16px] pb-[12px]">
                        <div className="font-[600] text-[14px] text-[var(--text)]">{ADMIN_DISPLAY_NAME}</div>
                        <div className="mt-[4px] break-all text-[12px] leading-snug text-[var(--text2)]">
                          {getAdminProfileEmail() || ADMIN_EMAIL_FALLBACK}
                        </div>
                      </div>
                      <div className="mx-[12px] border-t border-[var(--border)]" />
                      <button
                        type="button"
                        role="menuitem"
                        className={`mx-[6px] mt-[4px] flex w-[calc(100%-12px)] cursor-pointer items-center gap-[10px] rounded-[10px] px-[10px] py-[10px] text-left text-[13px] font-medium transition-colors hover:bg-[var(--surface2)] ${
                          location.pathname === '/settings'
                            ? 'bg-[var(--surface2)] text-[var(--sage)]'
                            : 'bg-transparent text-[var(--text)]'
                        }`}
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate('/settings');
                        }}
                      >
                        <SettingsIcon className="h-[16px] w-[16px] shrink-0 text-[var(--text2)]" />
                        Settings
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="mx-[6px] flex w-[calc(100%-12px)] items-center gap-[10px] rounded-[10px] px-[10px] py-[10px] text-left text-[13px] font-medium text-[#dc2626] transition-colors hover:bg-[rgba(239,68,68,0.08)]"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          clearAdminSessionToken();
                          navigate('/login', { replace: true });
                        }}
                      >
                        <LogoutIcon className="h-[16px] w-[16px] shrink-0 text-[#dc2626]" />
                        Logout
                      </button>
                    </div>,
                    document.body
                  )
                : null}
            </div>
          </div>
        </header>
        <main className="flex-1 px-[28px] py-[28px]">{children}</main>
      </div>
    </div>
  );
}

export default SidebarLayout;

