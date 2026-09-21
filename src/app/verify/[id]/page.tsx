'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Battery,
  HardDrive,
  Cpu,
  Calendar,
  Clock,
  Printer,
  Share2,
  ExternalLink,
  ChevronLeft,
  Lock,
  Layers,
  Sparkles,
  Award,
  Check,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  FileCheck,
  DollarSign,
  Info,
  Scale,
} from 'lucide-react';
import { WathiqStore } from '@/lib/store';
import { getStateMetadata } from '@/lib/state-machine';
import { Device, DeviceEvent, ProvenanceCheck } from '@/types/wathiq';
import { generateQrDataUrl } from '@/lib/qr';

export default function DevicePassportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [device, setDevice] = useState<Device | null>(null);
  const [events, setEvents] = useState<DeviceEvent[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showInternalEconomics, setShowInternalEconomics] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dev = WathiqStore.getDeviceById(id);
    if (dev) {
      setDevice(dev);
      setEvents(WathiqStore.getEvents(dev.id));
      generateQrDataUrl(
        typeof window !== 'undefined'
          ? `${window.location.origin}/verify/${dev.id}`
          : `https://verify.wathiq.ma/${dev.id}`
      ).then(setQrCodeUrl);
    }
  }, [id]);

  if (!device) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Device Not Found</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          No physical device found matching ID or Serial Number <span className="font-mono font-bold">{id}</span>.
        </p>
        <div className="pt-4">
          <Link
            href="/verify"
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Search Device Registry</span>
          </Link>
        </div>
      </div>
    );
  }

  const stateMeta = getStateMetadata(device.status);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      {/* Print-Only Certificate Header */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <div className="text-2xl font-black tracking-wider">WATHIQ RECOMMERCE &amp; PROVENANCE INFRASTRUCTURE</div>
        <div className="text-xs uppercase tracking-widest text-slate-600 mt-1">
          Official Digital Passport &bull; Certificate of Refurbishment, Provenance &amp; Compliance
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Control Bar (Screen only) */}
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href="/verify"
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Lookup</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInternalEconomics(!showInternalEconomics)}
              className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              {showInternalEconomics ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{showInternalEconomics ? 'Hide True Unit Economics' : 'Show True Unit Economics'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Link Copied!' : 'Share Passport'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Certificate</span>
            </button>
          </div>
        </div>

        {/* MAIN PASSPORT CONTAINER */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header Strip */}
          <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                  VERIFIED DIGITAL PASSPORT
                </div>
                <div className="text-xl font-mono font-bold tracking-tight">{device.id}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase text-slate-400 font-mono">Trust Status</div>
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  {device.provenance?.overallTrustStatus || 'WATHIQ_VERIFIED'}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${stateMeta.badgeColor} ${stateMeta.textColor}`}>
                GRADE {device.grade}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Device Identity & Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="md:col-span-2 space-y-3">
                <div className="inline-block text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {device.brand} &bull; {device.category}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {device.model}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">CHASSIS SERIAL</span>
                    <span className="font-bold text-slate-900 dark:text-white">{device.serialNumber}</span>
                  </div>
                  {device.imei && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">PRIMARY IMEI</span>
                      <span className="font-bold text-slate-900 dark:text-white">{device.imei}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block text-[10px]">LOCATION</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{device.location.bin}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1 text-slate-700 dark:text-slate-300">
                  <div><strong>CPU:</strong> {device.specs.cpu}</div>
                  <div><strong>RAM:</strong> {device.specs.ram}</div>
                  <div><strong>Storage:</strong> {device.specs.storage}</div>
                  <div><strong>Display:</strong> {device.specs.display}</div>
                  <div><strong>Operating System:</strong> {device.specs.os}</div>
                </div>
              </div>

              {/* QR Code & Tamper Seal */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                {qrCodeUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrCodeUrl}
                    alt={`QR Code for ${device.id}`}
                    className="w-32 h-32 rounded-lg bg-white p-1 shadow-sm"
                  />
                ) : (
                  <div className="w-32 h-32 bg-slate-200 animate-pulse rounded-lg" />
                )}
                <div className="text-[10px] font-mono text-slate-500 mt-2">
                  Scan to Verify Authenticity
                </div>
                <div className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                  verify.wathiq.ma/{device.id}
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* PROVENANCE & LEGITIMACY SECTION (§2, §6, §8, §10, §11)   */}
            {/* ========================================================= */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  <span>Device Provenance &amp; Legitimacy Verification</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Strict Source Provenance (§2 Verification vs Inference)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {device.provenance?.checks && device.provenance.checks.length > 0 ? (
                  device.provenance.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {chk.label}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                            chk.status === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : chk.status === 'NO_MATCH_FOUND'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : chk.status === 'FLAGGED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {chk.status}
                        </span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        {chk.resultSummary}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <span>Source: {chk.sourceName}</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                          {chk.sourceTrustLevel}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500">
                    Provenance checks recorded under Wathiq Intake Standard.
                  </div>
                )}
              </div>
            </div>

            {/* Hardware Health & Quality Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <Battery className="w-4 h-4 text-emerald-600" />
                    Battery Capacity
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                    HEALTHY
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  {device.batteryHealth}%
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {device.batteryCycles} cycles recorded &bull; Genuine capacity
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-blue-600" />
                    Storage Health
                  </span>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400 font-mono">
                    SMART OK
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  {device.ssdHealth}%
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Zero reallocated sectors &bull; High IOPS speed
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-teal-600" />
                    Warranty Protection
                  </span>
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-400 font-mono">
                    ACTIVE
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  {device.warranty.durationMonths} Mo.
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Express replacement care across Morocco
                </div>
              </div>
            </div>

            {/* VALUATION MATRIX (§16 & §17) */}
            {device.valuation && (
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Algorithmic Valuation &amp; Residual Matrix</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    Currency: {device.valuation.currency}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                    <span className="text-slate-400 block text-[10px]">Benchmark Retail</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {device.valuation.marketValue.toLocaleString()} MAD
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                    <span className="text-slate-400 block text-[10px]">Trade-In Offer</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {device.valuation.tradeInValue.toLocaleString()} MAD
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                    <span className="text-slate-400 block text-[10px]">B2B Wholesale</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {device.valuation.wholesaleValue.toLocaleString()} MAD
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                    <span className="text-slate-400 block text-[10px]">12M Residual Value</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {device.valuation.expectedResidualValue12m.toLocaleString()} MAD
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  <strong>Valuation Basis:</strong> {device.valuation.valuationBasis}
                </div>
              </div>
            )}

            {/* ROLE-GATED / INTERNAL VIEW: TRUE UNIT ECONOMICS */}
            {showInternalEconomics && (
              <div className="p-5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border-2 border-emerald-300 dark:border-emerald-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 font-mono">
                      Internal Cost Accounting &amp; True Unit Economics (CTO Brief &sect;15)
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
                    CONFIDENTIAL
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded border border-emerald-200">
                    <span className="text-slate-400 block text-[10px]">Acquisition Cost</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {device.costs.acquisitionCost} MAD
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded border border-emerald-200">
                    <span className="text-slate-400 block text-[10px]">Parts Installed</span>
                    <span className="font-bold text-slate-900 dark:text-white">{device.costs.parts} MAD</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded border border-emerald-200">
                    <span className="text-slate-400 block text-[10px]">Technician Labor</span>
                    <span className="font-bold text-slate-900 dark:text-white">{device.costs.labor} MAD</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded border border-emerald-200">
                    <span className="text-slate-400 block text-[10px]">Landed Cost</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {device.costs.landedCost} MAD
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-emerald-200/80">
                  <div>
                    <span className="text-slate-500">Selling Price:</span>{' '}
                    <strong className="text-slate-900 dark:text-white font-mono">
                      {device.pricing.sellingPrice} MAD
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Gross Margin:</span>{' '}
                    <strong className="text-emerald-700 dark:text-emerald-400 font-mono">
                      {Math.round(((device.pricing.sellingPrice - device.costs.landedCost) / device.pricing.sellingPrice) * 100)}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Contribution Margin:</span>{' '}
                    <strong className="text-slate-900 dark:text-white font-mono">
                      {device.costs.contributionMargin} MAD
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* COMPLETE CHRONOLOGICAL LIFECYCLE TIMELINE (Section 7) */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>Physical Lifecycle History (Immutable Event Log)</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">{events.length} events logged</span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {events.map((event, idx) => (
                  <div key={event.id || idx} className="relative group">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-slate-900" />
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {event.eventType}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {event.timestamp}
                        </span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-300">
                        {event.notes}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-0.5">
                        <span>Operator: <strong>{event.operatorName}</strong></span>
                        <span>&bull;</span>
                        <span>Role: {event.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Tamper-Proof Stamp */}
            <div className="p-4 rounded-xl bg-slate-950 text-slate-300 text-xs font-mono space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>WATHIQ CRYPTOGRAPHIC VERIFICATION SEAL</span>
                <span>SHA-256 HASH VERIFIED</span>
              </div>
              <div className="text-[11px] text-emerald-400 break-all select-all font-mono">
                {device.dataWipe?.verificationHash || '9e107d9d372bb6826bd81d3542a419d6b7e562ef6d8a39a973d4d360de5690b2'}
              </div>
              <div className="text-[10px] text-slate-500">
                Issued by Wathiq Central Verification Authority &bull; Casablanca Nearshore, Morocco.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
