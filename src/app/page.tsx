'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Cpu,
  RefreshCw,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Truck,
  FileCheck,
  Building2,
  HardDrive,
  BatteryCharging,
  Sparkles,
  Layers,
  Wrench,
  Award,
  Globe,
  Sliders,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { INITIAL_DEVICES } from '@/lib/initial-data';
import { getStateMetadata } from '@/lib/state-machine';

export default function LandingPage() {
  const sampleDevice = INITIAL_DEVICES[0]; // ThinkPad T14 Gen 2

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      <div>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 dark:border-slate-800 bg-radial from-emerald-50/50 via-white to-slate-50 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Vision & Pitch */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
                  <span>The Recommerce Infrastructure for Morocco</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Every physical device deserves a{' '}
                  <span className="text-emerald-700 dark:text-emerald-400 underline decoration-emerald-500/40 decoration-4">
                    persistent digital identity
                  </span>
                  .
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  Wathiq is the trusted device lifecycle and recommerce operating system for Morocco.
                  We acquire, diagnose, sanitize, repair, certify, finance, deliver, and recover IT hardware — replacing
                  spreadsheets with serialized end-to-end traceability.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/app"
                    className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 transition-all flex items-center gap-2 group"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Launch Operations OS</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/catalog"
                    className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
                  >
                    <span>Browse Certified Devices</span>
                  </Link>

                  <Link
                    href={`/verify/${sampleDevice.id}`}
                    className="px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium text-sm transition-colors flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View Digital Passport Demo</span>
                  </Link>
                </div>

                {/* Trust Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">100%</div>
                    <div className="text-xs text-slate-500 font-medium">NIST 800-88 Data Wiped</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">12 Mo.</div>
                    <div className="text-xs text-slate-500 font-medium">Hardware Swap Warranty</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">99.4%</div>
                    <div className="text-xs text-slate-500 font-medium">First-Time QA Pass</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">0</div>
                    <div className="text-xs text-slate-500 font-medium">Spreadsheets Needed</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Digital Passport Showcase */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                        WATHIQ PASSPORT
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      GRADE A
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      {sampleDevice.id}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {sampleDevice.model}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      SN: {sampleDevice.serialNumber} • {sampleDevice.specs.cpu.split('(')[0]}
                    </p>
                  </div>

                  {/* Vitals Gauges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Battery Health</span>
                      </div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {sampleDevice.batteryHealth}%
                      </div>
                      <div className="text-[10px] text-slate-400">{sampleDevice.batteryCycles} charge cycles</div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                        <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                        <span>NVMe Health</span>
                      </div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {sampleDevice.ssdHealth}%
                      </div>
                      <div className="text-[10px] text-slate-400">SMART Zero Bad Sectors</div>
                    </div>
                  </div>

                  {/* Verification Badges */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        17-Point Hardware Diagnostics
                      </span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">PASSED</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        NIST 800-88 Data Sanitization
                      </span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">CERTIFIED</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Final QA & Cosmetic Audit
                      </span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">PASSED</span>
                    </div>
                  </div>

                  {/* True Unit Economics (Demonstrating CTO Brief Section 15) */}
                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                      <span>Landed Refurbished Cost:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {sampleDevice.costs.landedCost} MAD
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-semibold mt-1">
                      <span>Selling Price:</span>
                      <span className="font-mono font-bold text-base text-emerald-700 dark:text-emerald-400">
                        {sampleDevice.pricing.sellingPrice} MAD (~€549)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/40">
                      <span>Gross Margin: 27.0%</span>
                      <span>Contribution: {sampleDevice.costs.contributionMargin} MAD</span>
                    </div>
                  </div>

                  <Link
                    href={`/verify/${sampleDevice.id}`}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Open Interactive Digital Passport</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE ARCHITECTURAL PRINCIPLE: DEVICE > SKU */}
        <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Architectural Principle #1
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Refurbished electronics are NOT ordinary SKUs.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3">
                A ThinkPad T14 is a product model. A specific ThinkPad with Serial <span className="font-mono font-semibold">PF-2947A890</span>,
                battery health 91%, replaced FR/AR keyboard, NIST wipe certificate, and 12-month warranty is an{' '}
                <span className="font-bold text-slate-900 dark:text-white">Individual Device Entity</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Conventional Ecommerce (The Wrong Way) */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 relative">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono mb-2">
                  Conventional E-Commerce (Fails in Refurbished)
                </div>
                <div className="space-y-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200">
                    Product: Lenovo ThinkPad T14
                  </div>
                  <div className="flex justify-center text-slate-400">↓</div>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200">
                    Generic SKU (Quantity: 40 in stock)
                  </div>
                  <div className="flex justify-center text-slate-400">↓</div>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200">
                    Order Placed
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-500 italic">
                  ❌ Blind lottery: customer doesn&apos;t know exact battery health, actual cosmetic flaws, or previous repair provenance.
                </div>
              </div>

              {/* Wathiq Device Lifecycle Architecture (The Right Way) */}
              <div className="p-6 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border-2 border-emerald-400/80 dark:border-emerald-800 relative">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-mono mb-2">
                  Wathiq Device-Centric Lifecycle OS
                </div>
                <div className="space-y-2 font-mono text-xs text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 flex justify-between items-center">
                    <span>Individual Physical Device ID</span>
                    <span className="text-emerald-700 font-bold">WTH-26-LPT-000184</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-emerald-200">
                      ✓ Serial: PF-2947A890
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-emerald-200">
                      ✓ Battery Health: 91%
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-emerald-200">
                      ✓ NIST 800-88 Wiped
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-emerald-200">
                      ✓ New FR/AR Keyboard
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-700 text-white font-semibold text-center">
                    Multi-Cycle Asset: Sale → Warranty → Recovery → Relisted
                  </div>
                </div>
                <div className="mt-4 text-xs text-emerald-900 dark:text-emerald-300 font-medium">
                  ✓ Full traceability, zero spreadsheets, true unit economics, and multi-cycle residual value capture.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 16-STAGE LIFECYCLE PIPELINE */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                End-to-End Operating Pipeline
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                The Complete Device Journey
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
                Controlled state transitions, enforced quality gates, and immutable audit logging at every step.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {[
                { step: '01', title: 'Acquire', desc: 'ITAD & Buyback', icon: Building2 },
                { step: '02', title: 'Receive', desc: 'Dock Barcode Scan', icon: Truck },
                { step: '03', title: 'Diagnose', desc: '17-Point HW Test', icon: Cpu },
                { step: '04', title: 'Data Wipe', desc: 'NIST 800-88 Purge', icon: HardDrive },
                { step: '05', title: 'Repair', desc: 'OEM Parts & Labor', icon: Wrench },
                { step: '06', title: 'QA & Cert', desc: 'Pass/Fail Check', icon: Award },
                { step: '07', title: 'Sell', desc: 'B2B Quotes & Cart', icon: Layers },
                { step: '08', title: 'Recover', desc: 'RMA / 2nd Lifecycle', icon: RefreshCw },
              ].map((item, idx) => (
                <div
                  key={item.step}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-mono font-bold text-slate-400">STEP {item.step}</div>
                    <item.icon className="w-5 h-5 text-emerald-600 my-2" />
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* B2B FLEET & ITAD SOLUTIONS FOR MOROCCO */}
        <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  Target B2B Infrastructure
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Empowering Morocco&apos;s Call Centers, Corporates & Universities
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  Call centers in Casablanca Nearshore, Tangier Med, and Rabat require rapid deployment, French/Arabic
                  standardized keyboards, and immediate 24-hour hardware swap SLAs. Wathiq provides guaranteed fleet consistency
                  at 50-60% the cost of brand-new OEM hardware.
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">ITAD & Corporate Buyback:</span>{' '}
                      Secure decommission of aging laptops with verified data wiping certificates and environmental ESG reporting.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">B2B Quotations & Invoicing:</span>{' '}
                      Instant multi-unit quotes with Moroccan TVA (20%), asset tagging, and custom OS image deployment.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">12-Month Replacement SLA:</span>{' '}
                      Express courier replacement across Morocco so your teams never suffer downtime.
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/app"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <span>View B2B Accounts & Quote Generator</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Sample B2B ITAD Manifest Card */}
              <div className="lg:col-span-6">
                <div className="bg-slate-950 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <div>
                      <div className="text-[10px] font-mono text-emerald-400 uppercase">ENTERPRISE ITAD BATCH</div>
                      <div className="text-base font-bold text-white">Bank of Africa Head Office Casablanca</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-mono text-xs border border-emerald-800">
                      284 Units
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <div className="text-slate-500">Manifest Number</div>
                      <div className="text-white font-semibold mt-0.5">MNF-BOA-2026-089</div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <div className="text-slate-500">Estimated Recovery</div>
                      <div className="text-emerald-400 font-semibold mt-0.5">890,000 MAD</div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <div className="text-slate-500">Wiped Certs Issued</div>
                      <div className="text-white font-semibold mt-0.5">210 / 284 Devices</div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <div className="text-slate-500">CO₂ Avoided</div>
                      <div className="text-emerald-400 font-semibold mt-0.5">42.6 Metric Tons</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
                    🔒 <strong className="text-slate-200">Chain of Custody Active:</strong> All storage drives purged in accordance with NIST Special Publication 800-88 Revision 1.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE CERTIFIED INVENTORY SHOWCASE */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  Live Certified Hardware
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Serialized Inventory in Stock
                </h2>
              </div>
              <Link
                href="/catalog"
                className="mt-3 sm:mt-0 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View Full Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {INITIAL_DEVICES.slice(0, 3).map((device) => (
                <div
                  key={device.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {device.id}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        GRADE {device.grade}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                        {device.model}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-1">
                        SN: {device.serialNumber} • {device.category}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                        <span className="text-slate-400 block text-[10px]">Battery Capacity</span>
                        <span className="font-bold text-slate-900 dark:text-white">{device.batteryHealth}%</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                        <span className="text-slate-400 block text-[10px]">Storage Health</span>
                        <span className="font-bold text-slate-900 dark:text-white">{device.ssdHealth}%</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {device.specs.cpu} • {device.specs.ram} • {device.specs.storage}
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-auto border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Selling Price</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {device.pricing.sellingPrice.toLocaleString()} MAD
                      </span>
                    </div>

                    <Link
                      href={`/verify/${device.id}`}
                      className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Passport</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER WITH MANDATORY EM300.CO REQUIREMENT */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-black text-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                  WATHIQ<span className="text-emerald-700">.</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                The trusted device lifecycle and recommerce operating system for Morocco. Verified diagnostics, certified data erasure, and persistent digital identity.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><Link href="/app" className="hover:text-emerald-700">Operations OS</Link></li>
                <li><Link href="/catalog" className="hover:text-emerald-700">Certified Hardware</Link></li>
                <li><Link href="/verify" className="hover:text-emerald-700">Digital Passport Verification</Link></li>
                <li><Link href="/docs" className="hover:text-emerald-700">Architecture & API Docs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                B2B & ITAD Services
              </h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>Corporate Fleet Buyback</li>
                <li>NIST 800-88 Secure Erasure</li>
                <li>Call Center Deployments</li>
                <li>12-Month Care & Warranty</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Hubs & Logistics
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Casablanca Central Hub: Nearshore Tech Park, Sidi Maarouf.<br />
                Tangier Med Logistics Depot: Free Zone Platform.<br />
                Coverage across Morocco (Casablanca, Rabat, Tangier, Marrakech, Fez).
              </p>
            </div>
          </div>

          {/* CRITICAL BOTTOM LINE AS INSTRUCTED */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 Wathiq Recommerce Technologies. All rights reserved.
            </div>

            {/* Exact instruction: "please at the botttom of the landing page "An EM300.co Company" , document dont push to git for now until we agree on final name" */}
            <div className="font-semibold text-slate-700 dark:text-slate-300 tracking-wide flex items-center gap-1.5">
              <span>An</span>
              <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700">
                EM300.co
              </span>
              <span>Company</span>
            </div>

            <div className="flex gap-4 text-slate-400 text-[11px]">
              <span>Privacy (CNDP / GDPR Compliant)</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
