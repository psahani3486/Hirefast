"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';
import { useUnreadMessageCount } from '@/hooks/useMessages';

const primaryLinks = [
  { href: '/', icon: '🏠', label: 'Home' },
  { href: '/network', icon: '🤝', label: 'My Network' },
  { href: '/jobs', icon: '💼', label: 'Jobs' },
  { href: '/messages', icon: '💬', label: 'Messaging' },
  { href: '/notifications', icon: '🔔', label: 'Notifications' }
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const notifications = useNotifications();
  const unreadMessages = useUnreadMessageCount();

  const unreadNotifications = useMemo(
    () => (notifications.data || []).filter((item) => !item.read).length,
    [notifications.data]
  );

  const unreadMessageCount = unreadMessages.data || 0;
  const currentPath = pathname || '/';
  const isActive = (href: string) => {
    if (href === '/') return currentPath === '/';
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        background: 'white',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        zIndex: 30,
        paddingBlock: '0.75rem'
      }}
    >
      <nav className="navbar-root" style={{ maxWidth: '1400px', margin: '0 auto', paddingInline: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        {/* Logo & Search */}
        <div className="navbar-brand-wrap" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 0.35 }}>
          <Link href="/" style={{ fontWeight: 900, fontSize: '1.3rem', color: '#0a66c2', textDecoration: 'none' }}>
            HireFast
          </Link>
          <div className="navbar-search-wrap" style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search"
              style={{
                width: '100%',
                padding: '0.6rem 1rem',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                background: '#f3f2ef',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        {/* Center Navigation */}
        <div className="navbar-center-links" style={{ display: 'flex', gap: '2rem', flex: 0.4, justifyContent: 'center' }}>
          {primaryLinks.map((link) => (
            <div key={link.href} style={{ position: 'relative' }}>
              <Link href={link.href} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.3rem',
                textDecoration: 'none',
                color: isActive(link.href) ? '#0a66c2' : 'var(--muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                transition: 'color 0.2s',
                borderBottom: isActive(link.href) ? '2px solid #0a66c2' : '2px solid transparent',
                paddingBottom: '0.25rem'
              }}>
                <span style={{ fontSize: '1.3rem' }}>{link.icon}</span>
                {link.label}
              </Link>
              {link.href === '/notifications' && unreadNotifications > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-8px',
                  background: '#b45309',
                  color: 'white',
                  borderRadius: '999px',
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.35rem',
                  fontWeight: 700
                }}>
                  {unreadNotifications}
                </span>
              )}
              {link.href === '/messages' && unreadMessageCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-8px',
                  background: '#0f766e',
                  color: 'white',
                  borderRadius: '999px',
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.35rem',
                  fontWeight: 700
                }}>
                  {unreadMessageCount}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Right Actions */}
        <div className="navbar-right-actions" style={{ display: 'flex', gap: '1rem', flex: 0.25, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Link href="/profile" style={{
            padding: '0.6rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: isActive('/profile') ? '#0a66c2' : 'var(--muted)',
            background: isActive('/profile') ? '#eef6ff' : 'transparent',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}>
            👤 Me
          </Link>
          <Link href="/companies" style={{
            padding: '0.6rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: isActive('/companies') ? '#0a66c2' : 'var(--muted)',
            background: isActive('/companies') ? '#eef6ff' : 'transparent',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}>
            🏢 For Business
          </Link>
          <button style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '20px',
            border: '1px solid #0a66c2',
            background: 'white',
            color: '#0a66c2',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Try Premium
          </button>
        </div>

        <button
          className="navbar-mobile-toggle"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {mobileOpen ? (
        <div className="navbar-mobile-panel">
          <div className="navbar-mobile-links">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  background: isActive(link.href) ? '#eef6ff' : 'transparent',
                  color: isActive(link.href) ? '#0a66c2' : 'var(--muted)'
                }}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              style={{
                background: isActive('/profile') ? '#eef6ff' : 'transparent',
                color: isActive('/profile') ? '#0a66c2' : 'var(--muted)'
              }}
            >
              👤 Me
            </Link>
            <Link
              href="/companies"
              onClick={() => setMobileOpen(false)}
              style={{
                background: isActive('/companies') ? '#eef6ff' : 'transparent',
                color: isActive('/companies') ? '#0a66c2' : 'var(--muted)'
              }}
            >
              🏢 For Business
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              style={{
                background: isActive('/search') ? '#eef6ff' : 'transparent',
                color: isActive('/search') ? '#0a66c2' : 'var(--muted)'
              }}
            >
              🔎 Search
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
