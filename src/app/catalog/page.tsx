'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Filter,
  Search,
  Battery,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  QrCode,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { INITIAL_DEVICES } from '@/lib/initial-data';
import { DeviceCategory, DeviceGrade } from '@/types/wathiq';

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [minBattery, setMinBattery] = useState<number>(80);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter available devices that are ready for sale or certified
  const availableDevices = INITIAL_DEVICES.filter((d) => {
    if (selectedCategory !== 'ALL' && d.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (selectedGrade !== 'ALL' && d.grade !== selectedGrade) return false;
    if (d.batteryHealth < minBattery) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        d.model.toLowerCase().includes(q) ||
        d.brand.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
                WATHIQ CERTIFIED RECOMMERCE
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Serialized Certified Hardware
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Every unit below is individually photographed, 17-point diagnostics verified, and backed by our 12-Month Replacement Warranty.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500">
            <strong>{availableDevices.length}</strong> verified serialized units available
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search model, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg px-2.5 py-1.5"
            >
              <option value="ALL">All Categories</option>
              <option value="Laptop">Laptops</option>
              <option value="Desktop">Desktops</option>
              <option value="Smartphone">Smartphones</option>
              <option value="Networking">Networking</option>
            </select>

            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg px-2.5 py-1.5"
            >
              <option value="ALL">All Cosmetic Grades</option>
              <option value="A+">Grade A+ (Like-New)</option>
              <option value="A">Grade A (Excellent)</option>
              <option value="B">Grade B (Very Good)</option>
              <option value="C">Grade C (Functional)</option>
            </select>

            {/* Battery Health Threshold */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <span>Min Battery:</span>
              <select
                value={minBattery}
                onChange={(e) => setMinBattery(Number(e.target.value))}
                className="text-xs bg-slate-50 dark:bg-slate-800 border rounded px-2 py-1 font-mono"
              >
                <option value={70}>70%+</option>
                <option value={80}>80%+</option>
                <option value={85}>85%+</option>
                <option value={90}>90%+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableDevices.map((device) => (
            <div
              key={device.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Product Photo & Badge */}
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={device.photos[0]}
                  alt={device.model}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-1 rounded-md font-bold">
                  {device.id}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-mono px-2 py-1 rounded-md font-bold shadow-sm">
                  GRADE {device.grade}
                </div>
              </div>

              {/* Specs & Hardware Attributes */}
              <div className="p-5 space-y-4">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {device.brand} • {device.category}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mt-0.5">
                    {device.model}
                  </h3>
                  <div className="text-xs font-mono text-slate-500 mt-1">
                    Chassis Serial: {device.serialNumber}
                  </div>
                </div>

                {/* Specs Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Battery className="w-3 h-3 text-emerald-600" />
                      <span>Battery Health</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {device.batteryHealth}%
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <HardDrive className="w-3 h-3 text-blue-600" />
                      <span>SSD Health</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {device.ssdHealth}%
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {device.specs.cpu} • {device.specs.ram} • {device.specs.storage} • {device.specs.display}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>12-Month Moroccan Express Warranty Included</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-auto flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Selling Price</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                    {device.pricing.sellingPrice.toLocaleString()} MAD
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/verify/${device.id}`}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    title="View Device Passport"
                  >
                    <QrCode className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/verify/${device.id}`}
                    className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>View Exact Unit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
