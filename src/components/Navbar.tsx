'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Database, Home, MessageCircle } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Directory', icon: Home, activeColor: 'text-sky-400' },
    { href: '/compare', label: 'Compare', icon: BarChart3, activeColor: 'text-emerald-400' },
    { href: '/community', label: 'Community', icon: MessageCircle, activeColor: 'text-violet-400' },
    { href: '/admin', label: 'Pipeline', icon: Database, activeColor: 'text-amber-400' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-neutral-950/40 backdrop-blur-xl py-3 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 shadow-[0_0_15px_rgba(255,255,255,0.08)] transition-all duration-300 group-hover:scale-105 border border-white/20 group-hover:border-white/40 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Praxis Grad Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-outfit font-black tracking-tight text-white leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-300">Praxis</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 font-black">Grad</span>
            </span>
            <span className="hidden sm:block text-[8px] text-neutral-500 font-bold uppercase tracking-[0.18em] mt-1">
              B.Tech Alternative Colleges
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-300 border ${
                  isActive
                    ? 'text-white bg-white/[0.04] border-white/10 shadow-lg shadow-black/25 backdrop-blur-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.02] border-transparent hover:border-white/5'
                }`}
              >
                <Icon className={`h-4 w-4 transition-colors duration-300 ${isActive ? item.activeColor : 'text-neutral-500'}`} />
                <span className="hidden md:inline">{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-[3px] w-5 -translate-x-1-2 bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
