'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { UserRole } from '@/types';
import { useAccent } from './AccentProvider';
import { EchoMark } from './EchoMark';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const SCHOOL_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '◐' },
  { href: '/surveys', label: 'Surveys', icon: '◇' },
  { href: '/ect', label: 'ECT Tracker', icon: '◈' },
  { href: '/newsletter', label: 'Newsletter', icon: '◉' },
  { href: '/share', label: 'Share', icon: '✦' },
  { href: '/blog', label: 'Review queue', icon: '◆' },
  { href: '/settings', label: 'Settings', icon: '◍' },
];

const MAT_NAV: NavItem[] = [
  { href: '/mat', label: 'Trust Overview', icon: '◐' },
  { href: '/settings', label: 'Settings', icon: '◍' },
];

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole, logoDataUrl, orgName } = useAccent();

  const isMat = role === 'mat_admin';
  const nav = isMat ? MAT_NAV : SCHOOL_NAV;
  const userName = isMat ? 'Tom Hadley' : 'Sarah Mitchell';
  const roleLabel = isMat ? 'MAT admin' : 'Headteacher';

  function switchRole(next: UserRole) {
    if (next === role) return;
    setRole(next);
    router.push(next === 'mat_admin' ? '/mat' : '/dashboard');
  }

  return (
    <div className="flex h-screen">
      <aside className="flex w-64 flex-col overflow-y-auto border-r border-border bg-surface px-5 py-6">
        <div className="mb-10 text-text">
          <EchoMark size="md" />
        </div>

        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-text-subtle">
            {isMat ? 'Trust' : 'School'}
          </div>
          <div className="mt-1 font-display text-base leading-tight text-text">{orgName}</div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-input px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-surface-2 text-text border border-primary/40'
                    : 'text-text-muted hover:bg-surface-2 hover:text-text border border-transparent'
                }`}
              >
                <span className={active ? 'text-primary-light' : 'text-text-subtle'}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 flex flex-col gap-3 rounded-card border border-border p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-pill border border-border bg-surface-2">
              {logoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoDataUrl}
                  alt={`${orgName} logo`}
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <span className="font-display text-base" style={{ color: 'var(--color-pop)' }}>
                  ✦
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wider text-text-muted">Signed in</div>
              <div className="truncate text-sm text-text">{userName}</div>
              <div className="truncate text-[11px] text-text-subtle">{roleLabel}</div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-border pt-3">
            <div className="text-[10px] uppercase tracking-wider text-text-subtle">
              Demo: view as
            </div>
            <div className="flex rounded-input border border-border bg-bg p-0.5">
              <button
                onClick={() => switchRole('mat_admin')}
                className={`flex-1 rounded-[6px] px-2 py-1 text-[11px] transition-colors ${
                  isMat ? 'bg-surface-2 text-text' : 'text-text-muted'
                }`}
              >
                MAT
              </button>
              <button
                onClick={() => switchRole('school_admin')}
                className={`flex-1 rounded-[6px] px-2 py-1 text-[11px] transition-colors ${
                  !isMat ? 'bg-surface-2 text-text' : 'text-text-muted'
                }`}
              >
                School
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-10 py-8">{children}</main>
    </div>
  );
}
