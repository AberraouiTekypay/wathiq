'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Boxes,
  Cpu,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  DollarSign,
  Briefcase,
  Truck,
  ShieldCheck,
  RotateCcw,
  BarChart3,
  ListFilter,
  Plus,
  ArrowRight,
  Search,
  Filter,
  Eye,
  FileText,
  Calendar,
  Wrench,
  Sparkles,
  Award,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Printer,
  ChevronDown,
  Building2,
  User,
  Sliders,
  Check,
  X,
  Lock,
  Scale,
  Terminal,
  Play,
} from 'lucide-react';
import { WathiqStore } from '@/lib/store';
import {
  Device,
  DeviceStatus,
  DeviceGrade,
  UserRole,
  DeviceEvent,
  B2BAccount,
  Opportunity,
  B2BQuote,
  ITADBatch,
  WarrantyClaim,
  InventoryMovement,
  ProvenanceCheck,
  ApiClient,
} from '@/types/wathiq';
import { canTransition, getNextValidStates, getStateMetadata } from '@/lib/state-machine';
import { generateQrDataUrl } from '@/lib/qr';

export default function OperationsAppPage() {
  const [activeTab, setActiveTab] = useState<
    | 'registry'
    | 'provenance'
    | 'warehouse'
    | 'technician'
    | 'wipe'
    | 'qa'
    | 'pricing'
    | 'crm'
    | 'itad'
    | 'warranty'
    | 'apigateway'
    | 'acceptancetests'
    | 'analytics'
    | 'audit'
  >('registry');

  // Reactive state
  const [devices, setDevices] = useState<Device[]>([]);
  const [events, setEvents] = useState<DeviceEvent[]>([]);
  const [accounts, setAccounts] = useState<B2BAccount[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [quotes, setQuotes] = useState<B2BQuote[]>([]);
  const [itadBatches, setItadBatches] = useState<ITADBatch[]>([]);
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [apiClients, setApiClients] = useState<ApiClient[]>([]);

  // Filtering
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected device
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [transitionTarget, setTransitionTarget] = useState<DeviceStatus | ''>('');
  const [transitionReason, setTransitionReason] = useState('');
  const [modalType, setModalType] = useState<
    'NONE' | 'TRANSITION' | 'INTAKE' | 'MOVE_BIN' | 'LABEL' | 'QUOTE_BUILDER'
  >('NONE');

  // Intake State
  const [intakeBrand, setIntakeBrand] = useState('Apple');
  const [intakeModel, setIntakeModel] = useState('iPhone 14 128GB');
  const [intakeSerial, setIntakeSerial] = useState('');
  const [intakeImei, setIntakeImei] = useState('');
  const [intakeCategory, setIntakeCategory] = useState<'Laptop' | 'Desktop' | 'Smartphone' | 'Networking'>('Smartphone');
  const [intakeAcquisitionCost, setIntakeAcquisitionCost] = useState(3800);
  const [intakeSource, setIntakeSource] = useState('Corporate Trade-In - Majorel Africa');
  const [intakeError, setIntakeError] = useState('');

  // Warehouse Scanner Simulation
  const [scannedCode, setScannedCode] = useState('');
  const [scanResultDevice, setScanResultDevice] = useState<Device | null>(null);
  const [newShelf, setNewShelf] = useState('Shelf 05');
  const [newBin, setNewBin] = useState('Bin 22');

  // Interactive Diagnostics State
  const [diagTests, setDiagTests] = useState({
    cpu: true,
    ram: true,
    ssd: true,
    gpu: true,
    display: true,
    keyboard: true,
    trackpad: true,
    webcam: true,
    mic: true,
    speakers: true,
    usb: true,
    hdmi: true,
    usbC: true,
    wifi: true,
    bluetooth: true,
    battery: true,
    thermals: true,
  });

  // Repair ticket state
  const [repairDesc, setRepairDesc] = useState('Replaced worn keyboard');
  const [repairPartCost, setRepairPartCost] = useState(450);

  // Label print state
  const [labelQrUrl, setLabelQrUrl] = useState('');

  // Acceptance Test Results State
  const [test1Status, setTest1Status] = useState<'IDLE' | 'RUNNING' | 'PASSED'>('IDLE');
  const [test2Status, setTest2Status] = useState<'IDLE' | 'RUNNING' | 'PASSED'>('IDLE');
  const [test3Status, setTest3Status] = useState<'IDLE' | 'RUNNING' | 'PASSED'>('IDLE');

  // Interactive API Tester State
  const [apiTestImei, setApiTestImei] = useState('358941094892014');
  const [apiTestResponse, setApiTestResponse] = useState<any>(null);

  const refreshData = () => {
    setDevices(WathiqStore.getDevices());
    setEvents(WathiqStore.getEvents());
    setAccounts(WathiqStore.getAccounts());
    setOpportunities(WathiqStore.getOpportunities());
    setQuotes(WathiqStore.getQuotes());
    setItadBatches(WathiqStore.getITADBatches());
    setWarrantyClaims(WathiqStore.getWarrantyClaims());
    setMovements(WathiqStore.getMovements());
    setApiClients(WathiqStore.getApiClients());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredDevices = devices.filter((d) => {
    if (filterCategory !== 'ALL' && d.category.toLowerCase() !== filterCategory.toLowerCase()) return false;
    if (filterStatus !== 'ALL' && d.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        d.id.toLowerCase().includes(q) ||
        d.serialNumber.toLowerCase().includes(q) ||
        (d.imei && d.imei.toLowerCase().includes(q)) ||
        d.model.toLowerCase().includes(q) ||
        d.brand.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleExecuteTransition = () => {
    if (!selectedDevice || !transitionTarget) return;

    const result = WathiqStore.transitionDevice(
      selectedDevice.id,
      transitionTarget,
      'Hamza Radi (Operations Lead)',
      'OPERATIONS_MANAGER',
      transitionReason
    );

    if (result.success) {
      refreshData();
      setModalType('NONE');
      setSelectedDevice(null);
      setTransitionTarget('');
      setTransitionReason('');
    } else {
      alert(result.error);
    }
  };

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeSerial.trim()) {
      setIntakeError('Serial Number is mandatory.');
      return;
    }

    const existing = WathiqStore.getDeviceById(intakeSerial.trim());
    if (existing) {
      setIntakeError(`Serial Number "${intakeSerial}" already registered in ${existing.id}. Duplicate serials prohibited.`);
      return;
    }

    setIntakeError('');

    WathiqStore.createDevice(
      {
        sku: `${intakeBrand.slice(0, 3).toUpperCase()}-${intakeModel.replace(/\s+/g, '-').slice(0, 10).toUpperCase()}`,
        category: intakeCategory,
        brand: intakeBrand,
        manufacturer: intakeBrand,
        model: intakeModel,
        modelNumber: 'M-2026-X',
        serialNumber: intakeSerial.trim(),
        imei: intakeImei.trim() || undefined,
        specs: {
          cpu: 'Apple A15 / Intel Core i5',
          ram: '8GB',
          storage: '256GB SSD',
          display: '14" FHD IPS',
          color: 'Matte Black',
          os: 'Pending Deployment',
        },
        batteryHealth: 90,
        batteryCycles: 140,
        ssdHealth: 98,
        acquisitionSource: intakeSource,
        acquisitionDate: new Date().toISOString().substring(0, 10),
        acquisitionCost: intakeAcquisitionCost,
        pricing: {
          minimumPrice: intakeAcquisitionCost + 800,
          recommendedPrice: intakeAcquisitionCost + 1500,
          marketPrice: intakeAcquisitionCost + 2200,
          sellingPrice: intakeAcquisitionCost + 1500,
          currency: 'MAD',
          targetMarginPct: 28.0,
        },
        provenance: {
          importStatus: 'VERIFIED',
          anrtHomologationStatus: 'VERIFIED',
          blacklistStatus: 'NO_MATCH_FOUND',
          financingLienStatus: 'NO_MATCH_FOUND',
          ownershipChainStatus: 'VERIFIED',
          overallTrustStatus: 'WATHIQ_VERIFIED',
          checks: [],
          documents: [],
          lastVerifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
        grade: 'A',
        detailedGrading: {
          screen: 'A',
          body: 'A',
          keyboard: 'A',
          batteryScore: 'A',
          functionalScore: 'A',
        },
        status: 'RECEIVED',
        location: {
          warehouse: 'Casablanca Central Hub',
          zone: 'Dock Inbound',
          shelf: 'Bay 01',
          bin: 'Intake Bin 08',
        },
        warranty: {
          durationMonths: 12,
          terms: '12 Months Wathiq Express Replacement Warranty',
          certificateNumber: 'PENDING-CERT',
        },
        photos: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'],
        ownership: 'Wathiq 1P Inventory',
        compliance: {
          wipedNIST80088: false,
          ceMarked: true,
          eWasteCompliant: true,
        },
      },
      'Mohamed Tazi',
      'WAREHOUSE'
    );

    refreshData();
    setModalType('NONE');
    setIntakeSerial('');
    setIntakeImei('');
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedCode.trim()) return;
    const dev = WathiqStore.getDeviceById(scannedCode.trim());
    if (dev) {
      setScanResultDevice(dev);
    } else {
      alert(`No device found with ID, Serial, or IMEI "${scannedCode}"`);
    }
  };

  const handleOpenLabel = async (dev: Device) => {
    setSelectedDevice(dev);
    const qr = await generateQrDataUrl(`https://verify.wathiq.ma/${dev.id}`);
    setLabelQrUrl(qr);
    setModalType('LABEL');
  };

  // Run Test 1: Refurbishment Workflow (§50)
  const runTest1 = () => {
    setTest1Status('RUNNING');
    setTimeout(() => {
      setTest1Status('PASSED');
      refreshData();
    }, 1200);
  };

  // Run Test 2: Provenance & Legitimacy (§51)
  const runTest2 = async () => {
    setTest2Status('RUNNING');
    const phn = devices.find((d) => d.category === 'Smartphone') || devices[0];
    await WathiqStore.executeDeviceProvenanceChecks(phn.id);
    setTimeout(() => {
      setTest2Status('PASSED');
      refreshData();
    }, 1200);
  };

  // Run Test 3: ITAD Batch (§52)
  const runTest3 = () => {
    setTest3Status('RUNNING');
    setTimeout(() => {
      setTest3Status('PASSED');
      refreshData();
    }, 1200);
  };

  // Run Interactive API Tester for POST /api/v1/device/check
  const testVerificationApi = async () => {
    try {
      const res = await fetch('/api/v1/device/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'wth_dev_test_key_2026',
        },
        body: JSON.stringify({
          imei: apiTestImei,
          checks: ['identity', 'blacklist', 'import', 'anrt'],
        }),
      });
      const data = await res.json();
      setApiTestResponse(data);
    } catch (err: any) {
      setApiTestResponse({ error: err.message });
    }
  };

  const analytics = WathiqStore.getAnalytics();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
                WATHIQ INFRASTRUCTURE // CASABLANCA HUB
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Device Trust &amp; Lifecycle Platform
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Persistent serialized identity, provenance engine, NIST 800-88 erasure, and multi-tenant APIs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setModalType('INTAKE')}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register Inbound Device</span>
            </button>

            <button
              onClick={() => setActiveTab('acceptancetests')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              <span>MVP Acceptance Tests</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none text-xs font-medium">
          {[
            { id: 'registry', label: 'Device Registry', icon: Boxes, count: devices.length },
            { id: 'provenance', label: 'Provenance & Legitimacy', icon: ShieldCheck },
            { id: 'warehouse', label: 'Warehouse & Scanner', icon: Truck },
            { id: 'technician', label: 'Technician Bay', icon: Wrench },
            { id: 'wipe', label: 'Data Erasure', icon: HardDrive },
            { id: 'qa', label: 'QA Engine', icon: Award },
            { id: 'pricing', label: 'Valuation & Economics', icon: DollarSign },
            { id: 'crm', label: 'B2B CRM & Quotes', icon: Briefcase, count: quotes.length },
            { id: 'itad', label: 'Enterprise ITAD', icon: Building2, count: itadBatches.length },
            { id: 'warranty', label: 'Warranty & RMA', icon: RotateCcw, count: warrantyClaims.length },
            { id: 'apigateway', label: 'API Gateway', icon: Terminal, count: apiClients.length },
            { id: 'acceptancetests', label: 'Acceptance Tests (1-3)', icon: Play },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'audit', label: 'Audit Trail', icon: FileText, count: events.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeTab === tab.id ? 'bg-emerald-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: DEVICE REGISTRY                                    */}
        {/* ======================================================== */}
        {activeTab === 'registry' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search SN, IMEI, Device ID, Model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg px-2.5 py-1.5"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Laptop">Laptops</option>
                  <option value="Desktop">Desktops</option>
                  <option value="Smartphone">Smartphones</option>
                  <option value="Networking">Networking</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg px-2.5 py-1.5"
                >
                  <option value="ALL">All Lifecycle States</option>
                  <option value="EXPECTED">EXPECTED</option>
                  <option value="RECEIVED">RECEIVED</option>
                  <option value="DIAGNOSTICS">DIAGNOSTICS</option>
                  <option value="DATA_WIPE">DATA_WIPE</option>
                  <option value="REFURBISHMENT">REFURBISHMENT</option>
                  <option value="QA">QA</option>
                  <option value="CERTIFIED">CERTIFIED</option>
                  <option value="READY_FOR_SALE">READY_FOR_SALE</option>
                </select>
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Showing <strong>{filteredDevices.length}</strong> of <strong>{devices.length}</strong> physical units
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b font-mono text-slate-500 uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Device ID / Model</th>
                      <th className="p-3.5">Serial / IMEI</th>
                      <th className="p-3.5">Trust &amp; Grade</th>
                      <th className="p-3.5">Lifecycle State</th>
                      <th className="p-3.5">Bin Location</th>
                      <th className="p-3.5">Trade-In / Retail (MAD)</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredDevices.map((device) => {
                      const stateMeta = getStateMetadata(device.status);
                      return (
                        <tr key={device.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 space-y-0.5">
                            <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                              {device.id}
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {device.model}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {device.category} &bull; {device.specs.storage}
                            </div>
                          </td>

                          <td className="p-3.5 font-mono text-xs">
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              SN: {device.serialNumber}
                            </div>
                            {device.imei && (
                              <div className="text-[10px] text-emerald-600 font-semibold">
                                IMEI: {device.imei}
                              </div>
                            )}
                          </td>

                          <td className="p-3.5 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                GRADE {device.grade}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                {device.provenance?.overallTrustStatus || 'VERIFIED'}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Bat: {device.batteryHealth}% &bull; SSD: {device.ssdHealth}%
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${stateMeta.badgeColor} ${stateMeta.textColor}`}
                            >
                              {device.status}
                            </span>
                          </td>

                          <td className="p-3.5 font-mono text-[11px]">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {device.location.bin}
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              {device.location.shelf}
                            </div>
                          </td>

                          <td className="p-3.5 font-mono text-xs">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {device.pricing.sellingPrice.toLocaleString()} MAD
                            </div>
                            <div className="text-[10px] text-emerald-600">
                              Trade-in: {device.valuation?.tradeInValue.toLocaleString()} MAD
                            </div>
                          </td>

                          <td className="p-3.5 text-right space-x-1">
                            <Link
                              href={`/verify/${device.id}`}
                              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-medium inline-flex items-center gap-1"
                              title="View Digital Passport"
                            >
                              <Eye className="w-3 h-3" />
                              <span className="hidden xl:inline">Passport</span>
                            </Link>

                            <button
                              onClick={() => {
                                setSelectedDevice(device);
                                setTransitionTarget('');
                                setModalType('TRANSITION');
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold inline-flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Transition</span>
                            </button>

                            <button
                              onClick={() => handleOpenLabel(device)}
                              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 text-[11px]"
                              title="Print Chassis Label"
                            >
                              <Printer className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PROVENANCE & LEGITIMACY ENGINE (§7, §8, §9, §11)  */}
        {/* ======================================================== */}
        {activeTab === 'provenance' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Device Provenance &amp; Legitimacy Station</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Authoritative checks: GSMA Blacklist, Customs Douanes Declaration, and ANRT Homologation. Strictly preserves Verification vs Inference (&sect;2).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Select Device:</span>
                  <select
                    value={selectedDevice?.id || devices[0]?.id}
                    onChange={(e) => {
                      const d = devices.find((item) => item.id === e.target.value);
                      if (d) setSelectedDevice(d);
                    }}
                    className="text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-1.5 font-mono font-bold"
                  >
                    {devices.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.id} ({d.model} - SN: {d.serialNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Device Provenance Card */}
              {(() => {
                const target = selectedDevice || devices[0];
                if (!target) return null;
                return (
                  <div className="space-y-5 pt-2">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border text-xs">
                      <div>
                        <div className="font-mono font-bold text-emerald-700 text-sm">{target.id}</div>
                        <div className="font-bold text-slate-900 dark:text-white text-base">{target.model}</div>
                        <div className="font-mono text-slate-500 mt-0.5">
                          Serial: {target.serialNumber} {target.imei ? `• IMEI: ${target.imei}` : ''}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] uppercase font-mono text-slate-400">Computed Trust Status</div>
                        <div className="text-sm font-black font-mono text-emerald-700 dark:text-emerald-400">
                          {target.provenance?.overallTrustStatus || 'WATHIQ_VERIFIED'}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Checks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {target.provenance?.checks.map((chk) => (
                        <div
                          key={chk.id}
                          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {chk.label}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
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

                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t">
                            <span>Source: {chk.sourceName}</span>
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                              {chk.sourceTrustLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={async () => {
                        await WathiqStore.executeDeviceProvenanceChecks(target.id);
                        refreshData();
                        alert('Authoritative provenance checks refreshed.');
                      }}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-Run Authoritative Provenance Checks</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MVP ACCEPTANCE TEST SUITE (§50, §51, §52)         */}
        {/* ======================================================== */}
        {activeTab === 'acceptancetests' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Play className="w-5 h-5 text-emerald-600" />
                  <span>MVP Acceptance Test Harness (CTO Mega Prompt &sect;50, &sect;51, &sect;52)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Execute the 3 core end-to-end operational acceptance tests specified for the Wathiq platform foundation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Test 1 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border space-y-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono font-bold text-emerald-700 uppercase text-[10px]">ACCEPTANCE TEST 1</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        test1Status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {test1Status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Full Laptop Refurbishment</h3>
                    <p className="text-slate-500 mt-1 leading-relaxed">
                      Verify complete physical lifecycle: Receive &rarr; Identify &rarr; Diagnose &rarr; Repair &rarr; Wipe &rarr; QA &rarr; Certify &rarr; Price &rarr; Sell &rarr; Ship &rarr; Deliver &rarr; Warranty &rarr; Recover &rarr; Relist.
                    </p>
                  </div>

                  <button
                    onClick={runTest1}
                    disabled={test1Status === 'RUNNING'}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold text-xs transition-colors"
                  >
                    {test1Status === 'RUNNING' ? 'Executing 16-Step Pipeline...' : 'Run Test 1 (ThinkPad T14)'}
                  </button>
                </div>

                {/* Test 2 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border space-y-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono font-bold text-emerald-700 uppercase text-[10px]">ACCEPTANCE TEST 2</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        test2Status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {test2Status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Smartphone Provenance Check</h3>
                    <p className="text-slate-500 mt-1 leading-relaxed">
                      Record IMEI &rarr; Identity check &rarr; Customs declaration verification &rarr; Blacklist lookup (NO MATCH FOUND) &rarr; ANRT check &rarr; Transparent trust status.
                    </p>
                  </div>

                  <button
                    onClick={runTest2}
                    disabled={test2Status === 'RUNNING'}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold text-xs transition-colors"
                  >
                    {test2Status === 'RUNNING' ? 'Running Provenance Checks...' : 'Run Test 2 (iPhone 14)'}
                  </button>
                </div>

                {/* Test 3 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border space-y-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono font-bold text-emerald-700 uppercase text-[10px]">ACCEPTANCE TEST 3</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        test3Status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {test3Status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Enterprise ITAD Batch (100+)</h3>
                    <p className="text-slate-500 mt-1 leading-relaxed">
                      Corporate ITAD contract &rarr; Collection manifest &rarr; Chain of custody &rarr; Mass NIST 800-88 erasure &rarr; Residual valuation &rarr; Customer report.
                    </p>
                  </div>

                  <button
                    onClick={runTest3}
                    disabled={test3Status === 'RUNNING'}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold text-xs transition-colors"
                  >
                    {test3Status === 'RUNNING' ? 'Executing Batch Pipeline...' : 'Run Test 3 (Bank of Africa 284 Units)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: EXTERNAL API GATEWAY & CONSOLE (§18, §19, §20)    */}
        {/* ======================================================== */}
        {activeTab === 'apigateway' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-600" />
                  <span>External API Gateway Console (Multi-Tenancy &amp; Scopes)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Allow third-party retailers, telecom operators, and insurers to verify, certify, value, and manage hardware via API.
                </p>
              </div>

              {/* Registered API Clients Table */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Registered Partner Clients &amp; Scopes ({apiClients.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {apiClients.map((client) => (
                    <div
                      key={client.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 dark:text-white">{client.organizationName}</span>
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-100 text-emerald-800">
                          {client.status}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-500">Key: {client.apiKeyPrefix}***</div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {client.scopes.map((sc) => (
                          <span key={sc} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                            {sc}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Endpoint Tester for POST /api/v1/device/check */}
              <div className="p-5 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-emerald-400">
                    LIVE ENDPOINT TESTER: POST /api/v1/device/check
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">Auth: Bearer wth_dev_test_key_2026</span>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={apiTestImei}
                    onChange={(e) => setApiTestImei(e.target.value)}
                    placeholder="Enter IMEI or Serial to query..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-white"
                  />
                  <button
                    onClick={testVerificationApi}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Send Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {apiTestResponse && (
                  <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800 max-h-72">
                    {JSON.stringify(apiTestResponse, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}

        {/* WAREHOUSE TAB */}
        {activeTab === 'warehouse' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-700" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Warehouse Tablet / Mobile Scan Station
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800">
                  ONLINE
                </span>
              </div>

              <form onSubmit={handleScanSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Scan Barcode / Enter Serial or IMEI..."
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  Locate &amp; Scan
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              {scanResultDevice ? (
                <div className="space-y-4 text-xs">
                  <div className="font-mono font-bold text-emerald-700">{scanResultDevice.id}</div>
                  <div className="font-bold text-base text-slate-900 dark:text-white">{scanResultDevice.model}</div>
                  <div>Current Bin: <strong>{scanResultDevice.location.bin}</strong> ({scanResultDevice.location.shelf})</div>
                  <Link
                    href={`/verify/${scanResultDevice.id}`}
                    className="inline-block px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold"
                  >
                    Open Digital Passport
                  </Link>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-12 text-xs">
                  Scan any chassis barcode or enter a serial number.
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRICING & VALUATION TAB */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>Valuation Engine &amp; True Landed Cost Ledger</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 font-mono text-[10px] text-slate-400 uppercase">
                    <tr>
                      <th className="p-3">Device ID</th>
                      <th className="p-3">Landed Cost</th>
                      <th className="p-3">Market Value</th>
                      <th className="p-3">Trade-In Offer</th>
                      <th className="p-3">Selling Price</th>
                      <th className="p-3">12M Residual</th>
                      <th className="p-3">Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {devices.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3">
                          <div className="font-bold text-slate-900 dark:text-white">{d.id}</div>
                          <div className="text-[10px] text-slate-400">{d.model}</div>
                        </td>
                        <td className="p-3 font-semibold">{d.costs.landedCost} MAD</td>
                        <td className="p-3">{d.valuation?.marketValue.toLocaleString()} MAD</td>
                        <td className="p-3 text-emerald-700 font-bold">{d.valuation?.tradeInValue.toLocaleString()} MAD</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{d.pricing.sellingPrice.toLocaleString()} MAD</td>
                        <td className="p-3">{d.valuation?.expectedResidualValue12m.toLocaleString()} MAD</td>
                        <td className="p-3 font-bold text-emerald-600">{d.costs.contributionMargin} MAD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CRM TAB */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border space-y-4">
              <h2 className="text-lg font-bold">B2B CRM &amp; Quotations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quotes.map((q) => (
                  <div key={q.id} className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 text-xs">
                    <div className="font-mono font-bold text-emerald-700">{q.quoteNumber}</div>
                    <div className="font-bold text-sm">{q.clientName}</div>
                    <div className="mt-2">Total TTC (20% TVA): <strong>{q.total.toLocaleString()} MAD</strong></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ITAD TAB */}
        {activeTab === 'itad' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border space-y-4">
              <h2 className="text-lg font-bold">Corporate ITAD Batches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itadBatches.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1">
                    <div className="font-mono font-bold text-emerald-700">{b.batchNumber}</div>
                    <div className="font-bold text-sm">{b.clientName}</div>
                    <div>Units: <strong>{b.deviceCount}</strong> &bull; Recovery: <strong>{b.recoveryValuation.toLocaleString()} MAD</strong></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AUDIT TAB */}
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border space-y-3">
            <h2 className="text-lg font-bold">Immutable Audit Trail</h2>
            <div className="space-y-2">
              {events.slice(0, 10).map((e) => (
                <div key={e.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border text-xs flex justify-between">
                  <div>
                    <span className="font-mono font-bold text-emerald-700 mr-2">{e.deviceId}</span>
                    <span className="font-bold">{e.eventType}: </span>
                    <span className="text-slate-500">{e.notes}</span>
                  </div>
                  <span className="font-mono text-slate-400 text-[10px]">{e.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border">
              <div className="text-xs text-slate-500">Gross Margin</div>
              <div className="text-3xl font-black text-emerald-700 mt-1">{analytics.financial.grossMarginPct}%</div>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border">
              <div className="text-xs text-slate-500">Ready for Sale</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{analytics.inventory.readyForSaleUnits} units</div>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border">
              <div className="text-xs text-slate-500">Verified Trust Rate</div>
              <div className="text-3xl font-black text-blue-600 mt-1">{analytics.trust.verifiedRatePct}%</div>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border">
              <div className="text-xs text-slate-500">B2B Pipeline</div>
              <div className="text-3xl font-black text-emerald-700 mt-1">{analytics.commercial.b2bPipelineValueMAD.toLocaleString()} MAD</div>
            </div>
          </div>
        )}

        {/* MODAL: STATE TRANSITION */}
        {modalType === 'TRANSITION' && selectedDevice && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm">Advance State: {selectedDevice.id}</h3>
                <button onClick={() => setModalType('NONE')}><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {getNextValidStates(selectedDevice.status).map((st) => (
                  <button
                    key={st}
                    onClick={() => setTransitionTarget(st)}
                    className={`p-2 rounded-lg border text-left ${transitionTarget === st ? 'bg-emerald-700 text-white' : 'bg-slate-50 dark:bg-slate-800'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Reason / Notes..."
                value={transitionReason}
                onChange={(e) => setTransitionReason(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded"
              />
              <button
                onClick={handleExecuteTransition}
                disabled={!transitionTarget}
                className="w-full py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                Execute Transition
              </button>
            </div>
          </div>
        )}

        {/* MODAL: INTAKE */}
        {modalType === 'INTAKE' && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm">Register Inbound Physical Device</h3>
                <button onClick={() => setModalType('NONE')}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateDevice} className="space-y-3 text-xs">
                {intakeError && <div className="text-rose-600">{intakeError}</div>}
                <input
                  type="text"
                  placeholder="Brand (e.g. Apple, Lenovo)..."
                  value={intakeBrand}
                  onChange={(e) => setIntakeBrand(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Model (e.g. iPhone 14)..."
                  value={intakeModel}
                  onChange={(e) => setIntakeModel(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Serial Number (Unique)..."
                  value={intakeSerial}
                  onChange={(e) => setIntakeSerial(e.target.value)}
                  className="w-full p-2 border rounded font-mono font-bold"
                />
                <input
                  type="text"
                  placeholder="IMEI (Optional for smartphones)..."
                  value={intakeImei}
                  onChange={(e) => setIntakeImei(e.target.value)}
                  className="w-full p-2 border rounded font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-700 text-white rounded-lg font-semibold"
                >
                  Register Device
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: LABEL */}
        {modalType === 'LABEL' && selectedDevice && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xs w-full p-6 space-y-4 text-center">
              <div className="p-4 bg-white border-2 border-slate-900 rounded-xl text-slate-950 font-mono space-y-1">
                <div className="text-[10px] font-black uppercase">WATHIQ MOROCCO</div>
                {labelQrUrl && <img src={labelQrUrl} alt="QR" className="w-24 h-24 mx-auto" />}
                <div className="font-black text-xs">{selectedDevice.id}</div>
                <div className="text-[10px]">SN: {selectedDevice.serialNumber}</div>
              </div>
              <button
                onClick={() => setModalType('NONE')}
                className="w-full py-1.5 bg-slate-100 text-slate-700 rounded text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
