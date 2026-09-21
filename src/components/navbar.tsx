'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Cpu,
  Layers,
  Search,
  QrCode,
  Sparkles,
  UserCheck,
  ChevronDown,
  ShoppingBag,
  FileText,
  Boxes,
  Menu,
  X,
} from 'lucide-react';
import { UserRole } from '@/types/wathiq';

const ROLES: { role: UserRole; label: string; badge: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', badge: 'bg-rose-100 text-rose-800' },
  { role: 'OPERATIONS_MANAGER', label: 'Operations Lead', badge: 'bg-purple-100 text-purple-800' },
  { role: 'WAREHOUSE', label: 'Warehouse Tech', badge: 'bg-amber-100 text-amber-800' },
  { role: 'TECHNICIAN', label: 'Diagnostics & Repair', badge: 'bg-blue-100 text-blue-800' },
  { role: 'QA', label: 'QA Officer', badge: 'bg-teal-100 text-teal-800' },
  { role: 'SALES', label: 'B2B Sales Lead', badge: 'bg-emerald-100 text-emerald-800' },
  { role: 'FINANCE', label: 'Finance & Pricing', badge: 'bg-indigo-100 text-indigo-800' },
  { role: 'B2B_CUSTOMER', label: 'B2B Client Portal', badge: 'bg-cyan-100 text-cyan-800' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPER_ADMIN');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist role in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wathiq_role') as UserRole;
    if (saved) setCurrentRole(saved);
  }, []);

  const selectRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('wathiq_role', role);
    setRoleMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/verify?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const currentRoleMeta = ROLES.find((r) => r.role === currentRole) || ROLES[0];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
      {/* Operations Quick Notification Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-400 font-semibold tracking-wider">WATHIQ OS v1.0</span>
          <span className="hidden sm:inline text-slate-400">• Morocco Device Recommerce Infrastructure</span>
          <span className="hidden md:inline text-slate-500">• Casablanca Hub Online (Bin Capacity: 94.2%)</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/verify/WTH-26-LPT-000184"
            className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px]"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Sample Passport</span>
          </Link>
          <div className="text-slate-500">|</div>
          <div className="text-[11px] text-slate-400">
            Currency: <span className="text-white font-medium">MAD</span> / EUR
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 group-hover:bg-emerald-600 transition-colors flex items-center justify-center text-white font-black shadow-sm shadow-emerald-500/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  WATHIQ<span className="text-emerald-700">.</span>
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase -mt-1">
                  Device Lifecycle OS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 pl-4">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Overview
              </Link>
              <Link
                href="/app"
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith('/app')
                    ? 'text-white bg-emerald-700 shadow-sm'
                    : 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/30 hover:bg-emerald-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Operations OS</span>
              </Link>
              <Link
                href="/catalog"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith('/catalog')
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Certified Catalog</span>
              </Link>
              <Link
                href="/verify"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith('/verify')
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Verify Passport</span>
              </Link>
              <Link
                href="/docs"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith('/docs')
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Docs</span>
              </Link>
            </nav>
          </div>

          {/* Right Actions: Quick Search & Role Selector */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Serial/ID Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Scan / Enter SN or Device ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800 dark:text-slate-200"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </form>

            {/* Role Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-500 hidden xl:inline">Role:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentRoleMeta.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                    Simulate Active Persona
                  </div>
                  {ROLES.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => selectRole(r.role)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg text-left transition-colors ${
                        currentRole === r.role
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{r.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${r.badge}`}>
                        {r.role.slice(0, 5)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Scan / Enter SN or Device ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 rounded-lg"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          <Link
            href="/app"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-700 text-white"
          >
            <Layers className="w-4 h-4" />
            <span>Launch Operations OS</span>
          </Link>
          <Link
            href="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Certified Catalog</span>
          </Link>
          <Link
            href="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <QrCode className="w-4 h-4" />
            <span>Verify Device Passport</span>
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <FileText className="w-4 h-4" />
            <span>Documentation</span>
          </Link>
        </div>
      )}
    </header>
  );
}
