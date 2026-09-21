'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';
import { INITIAL_DEVICES } from '@/lib/initial-data';

export default function VerifyLookupPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter a Wathiq Device ID or Serial Number.');
      return;
    }
    setError('');
    router.push(`/verify/${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <QrCode className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verify Device Digital Passport
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Scan the QR code printed on the physical device label or enter the unique Wathiq Device ID / Serial Number below to inspect its complete refurbishment history.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. WTH-26-LPT-000184 or PF-2947A890"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-28 py-3.5 text-sm bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 font-mono shadow-sm text-slate-900 dark:text-white"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-4" />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Verify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        </form>

        {/* Quick Sample Devices */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">
            Or select a sample verified unit to inspect:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INITIAL_DEVICES.slice(0, 4).map((device) => (
              <Link
                key={device.id}
                href={`/verify/${device.id}`}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {device.id}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {device.model}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    SN: {device.serialNumber} • Grade {device.grade}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
