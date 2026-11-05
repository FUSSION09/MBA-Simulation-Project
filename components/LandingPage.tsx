'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Play,
  Users,
  Award,
  TrendingUp,
  ShieldCheck,
  Cpu,
  BarChart3,
  Scale,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Globe2,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Sliders,
  DollarSign,
  Briefcase,
  AlertTriangle,
  ArrowUp,
  Check,
  Activity,
  Zap,
  RotateCw,
  Layers,
  LineChart,
  Percent,
  Compass,
  FileSpreadsheet
} from 'lucide-react';
import { FactoryApparatus3D } from '@/components/FactoryApparatus3D';

interface LandingPageProps {
  onStartSolo: () => void;
  onJoinCohort: () => void;
  onOpenInstructor: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSolo,
  onJoinCohort,
  onOpenInstructor,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showStickyBottomCta, setShowStickyBottomCta] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Hero Cockpit Preview Interactive State
  const [heroMockupTab, setHeroMockupTab] = useState<'stock' | 'segments' | 'income'>('stock');
  const [chartRenderKey, setChartRenderKey] = useState(0);

  // Interactive Live Strategy Sandbox State
  const [sandboxSegment, setSandboxSegment] = useState<'economy' | 'mainstream' | 'premium'>('mainstream');
  const [sandboxPrice, setSandboxPrice] = useState(85);
  const [sandboxAdSpend, setSandboxAdSpend] = useState(350); // in thousands
  const [sandboxAutomation, setSandboxAutomation] = useState(4); // Lvl 1 to 10
  const [isSimulatingShock, setIsSimulatingShock] = useState(false);

  // Interactive 3D Apparatus Live Run State
  const [factoryRunning, setFactoryRunning] = useState(false);
  const [factoryProduction, setFactoryProduction] = useState(87500);
  const [factoryCapacity] = useState(100000);
  const [factoryAutomation, setFactoryAutomation] = useState(5);

  // Interactive Dilemma Preview State
  const [activeDilemmaTab, setActiveDilemmaTab] = useState<number>(0);

  // IntersectionObserver for scroll animations
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowScrollTop(scrollY > 400);
      setShowStickyBottomCta(scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Set up scroll observer for .scroll-reveal elements
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  // Sandbox Real-time Calculations
  const baseDemand = sandboxSegment === 'economy' ? 45000 : sandboxSegment === 'mainstream' ? 40000 : 20000;
  const benchmarkPrice = sandboxSegment === 'economy' ? 45 : sandboxSegment === 'mainstream' ? 85 : 150;
  const shockMultiplier = isSimulatingShock ? 0.8 : 1.0;
  const priceRatio = benchmarkPrice / Math.max(10, sandboxPrice);
  const adEffect = 1 + Math.log10(Math.max(1, sandboxAdSpend / 100)) * 0.28;
  const simulatedUnits = Math.round(baseDemand * Math.pow(priceRatio, 1.35) * adEffect * shockMultiplier);
  const projectedRevenue = Math.round(simulatedUnits * sandboxPrice);
  const unitLaborCost = Math.max(7, 28 - sandboxAutomation * 2.1);
  const projectedCost = Math.round(simulatedUnits * (unitLaborCost + (sandboxSegment === 'premium' ? 35 : 20)));
  const projectedGrossMargin = Math.round(projectedRevenue - projectedCost);
  const marginPct = projectedRevenue > 0 ? ((projectedGrossMargin / projectedRevenue) * 100).toFixed(1) : '0';
  const marketSharePct = Math.min(58, Math.max(12, Math.round((simulatedUnits / 120000) * 100)));

  // Run dynamic factory test cycle
  function handleTriggerFactoryCycle() {
    if (factoryRunning) return;
    setFactoryRunning(true);
    let step = 0;
    const stages = [65000, 85000, 105000, 95000, 87500];
    const interval = setInterval(() => {
      if (step < stages.length) {
        setFactoryProduction(stages[step]);
        step++;
      } else {
        clearInterval(interval);
        setFactoryRunning(false);
      }
    }, 600);
  }

  // Trigger simulated macroeconomic shock
  function handleTriggerMarketShock() {
    setIsSimulatingShock(true);
    setTimeout(() => {
      setIsSimulatingShock(false);
    }, 2500);
  }

  const dilemmas = [
    {
      title: 'Global Supply Chain vs. ESG Decarbonization',
      subtitle: 'Q2 Strategic Choice',
      scenario: 'A premier green packaging supplier offers 100% net-zero recycled composites at a 15% unit cost premium. Adopting enhances ESG brand perception by +14 points across all segments.',
      optionA: 'Adopt Green Sourcing: Boost ESG and brand loyalty; trade off $180k operating cash.',
      optionB: 'Retain Standard Supplier: Protect gross margin and preserve cash reserves.'
    },
    {
      title: 'Factory Automation & Labor Union Compromise',
      subtitle: 'Q4 Workforce Dilemma',
      scenario: 'Implementing Level 7 robotic assembly reduces manufacturing labor headcount by 25%, sparking union strike threats and employee morale dips.',
      optionA: 'Deploy Retraining Buffer: Allocate $120k for employee transition grants; maintain 95% morale.',
      optionB: 'Aggressive Automation: Enforce immediate robotic transition to maximize unit cost advantage.'
    },
    {
      title: 'Hostile Takeover Threat & Solvency Defense',
      subtitle: 'Q6 Capital Markets Crisis',
      scenario: 'Rising benchmark interest rates increase short-term debt servicing costs while rival Apex Dynamics accumulates a 12% stake in your equity.',
      optionA: 'Issue Long-Term Fixed Bonds: Lock in 10-year debt to restructure bank lines and buy back shares.',
      optionB: 'Emergency Dividend Cut: Preserve $450k cash flow to reinforce balance sheet liquidity.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Background Animated Radial Light Cones */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[140px] rounded-full pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[850px] right-[-150px] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none animate-float-slow" />
      <div className="absolute top-[1900px] left-[-150px] w-[650px] h-[500px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse-glow" />

      {/* Top Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Sub-tagline */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md ring-1 ring-white/15 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-blue-300 transition-colors">STRATEX</span>
                <span className="text-blue-400 font-mono text-[10px] uppercase px-1.5 py-0.2 rounded bg-blue-950/80 border border-blue-800/80 font-bold">
                  MBA
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">Enterprise Strategy & Dynamic Market Simulator</span>
            </div>
          </div>

          {/* Desktop Nav Jump Links */}
          <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-400 font-medium">
            <a href="#cockpit" className="hover:text-blue-400 transition cursor-pointer flex items-center space-x-1">
              <span>Cockpit</span>
            </a>
            <a href="#curriculum" className="hover:text-blue-400 transition cursor-pointer">Curriculum</a>
            <a href="#loop" className="hover:text-blue-400 transition cursor-pointer">Round Loop</a>
            <a href="#sandbox" className="hover:text-blue-400 transition cursor-pointer flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sandbox</span>
            </a>
            <a href="#modes" className="hover:text-blue-400 transition cursor-pointer">Sim Modes</a>
            <a href="#factory" className="hover:text-blue-400 transition cursor-pointer">3D Factory</a>
            <a href="#dilemmas" className="hover:text-blue-400 transition cursor-pointer">Case Dilemmas</a>
          </div>

          {/* Desktop Direct Mode Launch Buttons */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenInstructor}
              className="text-xs text-slate-300 hover:text-emerald-400 font-semibold px-3 py-2 rounded-lg hover:bg-slate-900 transition cursor-pointer flex items-center space-x-1.5 border border-transparent hover:border-slate-800 active:scale-95"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instructor Portal</span>
            </button>
            <button
              onClick={onJoinCohort}
              className="text-xs text-slate-300 hover:text-purple-400 font-semibold px-3 py-2 rounded-lg hover:bg-slate-900 transition cursor-pointer flex items-center space-x-1.5 border border-transparent hover:border-slate-800 active:scale-95"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Cohort Room</span>
            </button>
            <button
              onClick={onStartSolo}
              className="min-h-[40px] px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center space-x-2 transition cursor-pointer active:scale-95 shadow-md ring-1 ring-blue-400/40 hover:shadow-blue-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Solo Simulator</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onStartSolo}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer active:scale-95 shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Solo</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg border border-slate-800 bg-slate-900/60 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-900 bg-slate-950/95 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="#cockpit"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-2"
              >
                <LineChart className="w-4 h-4 text-emerald-400" />
                <span>Cockpit View</span>
              </a>
              <a
                href="#curriculum"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>5 Pillars</span>
              </a>
              <a
                href="#sandbox"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-2"
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Live Sandbox</span>
              </a>
              <a
                href="#modes"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-2"
              >
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span>Solo vs Cohort</span>
              </a>
              <a
                href="#factory"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-2"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>3D Apparatus</span>
              </a>
              <a
                href="#dilemmas"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Case Dilemmas</span>
              </a>
            </div>

            <div className="pt-2 border-t border-slate-900 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartSolo();
                }}
                className="w-full min-h-[44px] bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Solo Simulation (Practice)</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onJoinCohort();
                }}
                className="w-full min-h-[44px] bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 active:scale-95"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Join Student Cohort Room</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInstructor();
                }}
                className="w-full min-h-[44px] bg-slate-900/60 text-slate-300 border border-slate-800/80 rounded-xl text-xs font-medium flex items-center justify-center space-x-2 active:scale-95"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Open Instructor Console</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Academic & Macroeconomic Marquee Ticker */}
        <div className="bg-slate-900/50 border-t border-b border-slate-900 overflow-hidden py-1.5 text-[11px] text-slate-400 select-none">
          <div className="animate-marquee flex items-center space-x-8 whitespace-nowrap">
            <span className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>MACRO ENVIRONMENT: <strong>GDP GROWTH +2.8%</strong></span>
            </span>
            <span className="text-slate-700">•</span>
            <span>BENCHMARK FED INTEREST RATE: <strong>4.75%</strong></span>
            <span className="text-slate-700">•</span>
            <span>ACCOUNTING: <strong>100% GAAP DOUBLE-ENTRY BALANCING</strong></span>
            <span className="text-slate-700">•</span>
            <span>RIVAL ARCHETYPES: <strong>APEX (COST LEADER) • NOVUS (INNOVATOR) • VANGUARD (INCUMBENT)</strong></span>
            <span className="text-slate-700">•</span>
            <span>BALANCED SCORECARD: <strong>FINANCIAL • CUSTOMER • INTERNAL PROCESS • LEARNING & GROWTH</strong></span>
            <span className="text-slate-700">•</span>
            <span>ACADEMIC FOCUS: <strong>AACSB & HBS CASE METHOD COMPLIANT</strong></span>
            <span className="text-slate-700">•</span>
            <span>MULTI-TENANT: <strong>LIVE COHORT ROOMS & INSTRUCTOR ROUND LOCK</strong></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          {/* Graduate School Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium shadow-sm animate-in fade-in zoom-in-95 duration-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Built for Graduate Business Programs & Executive MBA Cohorts</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] animate-in fade-in slide-in-from-bottom-3 duration-700">
            Lead the Enterprise. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              Master Executive C-Suite Strategy.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-4 duration-700">
            Step into the executive war-room. Manage capital allocation, pricing elasticity,
            supply chain automation, and audited GAAP financial statements across competitive quarterly rounds against autonomous AI rivals or live student teams.
          </p>

          {/* CTA Buttons (3 Distinct Modes) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <button
              onClick={onStartSolo}
              className="w-full sm:w-auto min-h-[50px] px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2.5 transition cursor-pointer active:scale-95 shadow-lg ring-1 ring-blue-400/50 hover:shadow-blue-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Solo Simulation (Free Practice)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onJoinCohort}
              className="w-full sm:w-auto min-h-[50px] px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition cursor-pointer active:scale-95 hover:border-slate-700"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Join Live Cohort Room</span>
            </button>

            <button
              onClick={onOpenInstructor}
              className="w-full sm:w-auto min-h-[50px] px-5 py-3 text-slate-400 hover:text-emerald-300 hover:bg-slate-900/80 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer border border-transparent hover:border-slate-800 active:scale-95"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Instructor Portal</span>
            </button>
          </div>

          {/* Hero Live Financial Terminal Cockpit Preview */}
          <div id="cockpit" className="pt-8 scroll-reveal">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-left max-w-4xl mx-auto backdrop-blur-xl relative group">
              {/* Top Cockpit Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono font-bold text-slate-300 ml-2">STRATEX C-SUITE TERMINAL • Q4 ACTIVE</span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => { setHeroMockupTab('stock'); setChartRenderKey(k => k + 1); }}
                    className={`px-3 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                      heroMockupTab === 'stock' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Stock Price (8 Quarters)
                  </button>
                  <button
                    onClick={() => setHeroMockupTab('segments')}
                    className={`px-3 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                      heroMockupTab === 'segments' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Market Share Breakdown
                  </button>
                </div>
              </div>

              {/* 4 Live KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Share Price</span>
                  <div className="text-lg font-mono font-extrabold text-white flex items-center space-x-1">
                    <span>$28.40</span>
                    <span className="text-[11px] text-emerald-400 font-bold">▲ +$3.40</span>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cash Reserves</span>
                  <div className="text-lg font-mono font-extrabold text-emerald-400">
                    $6.8M
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Market Share</span>
                  <div className="text-lg font-mono font-extrabold text-blue-400">
                    34.2%
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Scorecard</span>
                  <div className="text-lg font-mono font-extrabold text-amber-300 flex items-center space-x-1">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>84 / 100</span>
                  </div>
                </div>
              </div>

              {/* Visual Graphic Representation */}
              {heroMockupTab === 'stock' ? (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Historical Valuation Trajectory vs. AI Rivals</span>
                    <span className="font-mono text-emerald-400 font-bold">Player Firm (#1 in Market)</span>
                  </div>
                  {/* Animated SVG Stock Curve */}
                  <div className="h-32 w-full relative">
                    <svg key={chartRenderKey} className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="stockGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      <line x1="0" y1="25" x2="500" y2="25" stroke="#1e293b" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeDasharray="3 3" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="3 3" />

                      {/* Apex Dynamics Rival (Red line) */}
                      <path
                        d="M0,70 Q120,65 250,55 T500,60"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        opacity="0.6"
                      />

                      {/* Novus Tech Rival (Purple line) */}
                      <path
                        d="M0,60 Q120,55 250,45 T500,48"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        opacity="0.6"
                      />

                      {/* Player Gradient Fill Area */}
                      <path
                        d="M0,80 Q100,70 200,45 T350,30 T500,15 L500,100 L0,100 Z"
                        fill="url(#stockGlow)"
                      />

                      {/* Player Animated Line */}
                      <path
                        d="M0,80 Q100,70 200,45 T350,30 T500,15"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        className="animate-line-draw"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <span>Q1 (Baseline)</span>
                    <span>Q2</span>
                    <span>Q3</span>
                    <span>Q4</span>
                    <span>Q5</span>
                    <span>Q6</span>
                    <span>Q7</span>
                    <span>Q8 (Final Resolution)</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="text-xs font-semibold text-slate-300">Market Share Distribution across Segments</div>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300 font-medium">Economy Segment</span>
                        <span className="font-mono text-blue-400 font-bold">36.5% Share (Apex rival: 38.0%)</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full transition-all duration-700" style={{ width: '36.5%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300 font-medium">Mainstream Segment</span>
                        <span className="font-mono text-emerald-400 font-bold">42.0% Share (Market Leader)</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: '42%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300 font-medium">Premium Segment</span>
                        <span className="font-mono text-purple-400 font-bold">24.1% Share (Novus Tech: 48.0%)</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full transition-all duration-700" style={{ width: '24.1%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Micro Trust Stats */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto text-left border-t border-slate-900/80">
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3.5 hover:border-slate-700 transition glow-card">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Decisions</span>
              <span className="text-base sm:text-lg font-bold text-slate-100 font-mono">5 C-Suite</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">CMO, COO, CFO, CTO, HR</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3.5 hover:border-slate-700 transition glow-card">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Financials</span>
              <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">100% GAAP</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">P&L, Balance Sheet, Cash Flow</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3.5 hover:border-slate-700 transition glow-card">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Rival Bots</span>
              <span className="text-base sm:text-lg font-bold text-purple-400 font-mono">3 Archetypes</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Cost Leader, Innovator, Incumbent</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3.5 hover:border-slate-700 transition glow-card">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Multiplayer</span>
              <span className="text-base sm:text-lg font-bold text-blue-400 font-mono">PIN Rooms</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Instructor Round Execution</span>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Step-by-Step Round Loop Flowchart */}
      <section id="loop" className="py-16 sm:py-20 border-b border-slate-900 bg-slate-950/70 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono">Round Simulation Pipeline</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              How Each Quarterly Round Executes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A complete, synchronized four-phase cycle replicating corporate executive committee operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 relative glow-card">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Phase 1</span>
              </div>
              <h3 className="font-bold text-sm text-white">Macro Brief & Dilemma</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Review macroeconomic shifts (GDP, inflation, benchmark rates) and resolve the quarterly strategic case dilemma.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 relative glow-card">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 font-mono font-bold text-xs flex items-center justify-center">
                  02
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Phase 2</span>
              </div>
              <h3 className="font-bold text-sm text-white">5 C-Suite Decisions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Input marketing pricing, plant capacity & robotics automation, R&D allocation, workforce salaries, and corporate financing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 relative glow-card">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Phase 3</span>
              </div>
              <h3 className="font-bold text-sm text-white">Market Clearing Engine</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Econometric elasticity solves customer demand across competitors. Orders are filled; stockouts and scrap are tabulated.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 relative glow-card">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                  04
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Phase 4</span>
              </div>
              <h3 className="font-bold text-sm text-white">GAAP Statements & Debrief</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Double-entry financial statements are computed, Balanced Scorecards updated, and valuation recalculates for round debriefing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive C-Suite Sandbox Test Drive Section */}
      <section id="sandbox" className="py-16 sm:py-24 border-b border-slate-900 bg-slate-950/80 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono flex items-center justify-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Interactive Decision Test-Drive</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Test-Drive the Strategy Engine Live
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Drag the decision controls below to preview how econometric price elasticity and robotics automation project revenue and operating margins in real time.
            </p>
          </div>

          {/* Sandbox Widget Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center backdrop-blur-xl">
            {/* Left: Interactive Controls */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Target Product Segment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['economy', 'mainstream', 'premium'] as const).map((seg) => (
                    <button
                      key={seg}
                      onClick={() => {
                        setSandboxSegment(seg);
                        setSandboxPrice(seg === 'economy' ? 45 : seg === 'mainstream' ? 85 : 150);
                      }}
                      className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold capitalize transition cursor-pointer active:scale-95 ${
                        sandboxSegment === seg
                          ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-400'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {seg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 1: Unit Price */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Unit Price</span>
                  <span className="font-mono font-bold text-blue-400">${sandboxPrice} / unit</span>
                </div>
                <input
                  type="range"
                  min={sandboxSegment === 'economy' ? 25 : sandboxSegment === 'mainstream' ? 50 : 100}
                  max={sandboxSegment === 'economy' ? 70 : sandboxSegment === 'mainstream' ? 130 : 250}
                  value={sandboxPrice}
                  onChange={(e) => setSandboxPrice(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              {/* Slider 2: Advertising Budget */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Quarterly Ad Spend</span>
                  <span className="font-mono font-bold text-indigo-400">${sandboxAdSpend}k</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={800}
                  step={25}
                  value={sandboxAdSpend}
                  onChange={(e) => setSandboxAdSpend(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              {/* Slider 3: Automation Level */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Robotics Automation</span>
                  <span className="font-mono font-bold text-emerald-400">Level {sandboxAutomation} of 10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={sandboxAutomation}
                  onChange={(e) => setSandboxAutomation(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              {/* Shock Market Action Button */}
              <button
                type="button"
                onClick={handleTriggerMarketShock}
                className={`w-full min-h-[38px] px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer border ${
                  isSimulatingShock
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800 animate-pulse'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSimulatingShock ? 'Market Shock Active (-20% Demand Disruption)...' : 'Simulate Competitor Price Shock'}</span>
              </button>
            </div>

            {/* Right: Simulated Real-Time Outputs */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Engine Projection</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE REACTION</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/70">
                  <span className="text-[10px] text-slate-400 uppercase block">Projected Sales</span>
                  <span className="font-mono font-extrabold text-base text-slate-100">{simulatedUnits.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 block">units demand</span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/70">
                  <span className="text-[10px] text-slate-400 uppercase block">Gross Margin</span>
                  <span className="font-mono font-extrabold text-base text-emerald-400">{marginPct}%</span>
                  <span className="text-[10px] text-slate-500 block">${(projectedGrossMargin / 1000).toFixed(0)}k profit</span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/70">
                  <span className="text-[10px] text-slate-400 uppercase block">Unit Labor Cost</span>
                  <span className="font-mono font-extrabold text-base text-blue-400">${unitLaborCost.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-500 block">per unit built</span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/70">
                  <span className="text-[10px] text-slate-400 uppercase block">Quarterly Revenue</span>
                  <span className="font-mono font-extrabold text-base text-purple-400">${(projectedRevenue / 1000).toFixed(0)}k</span>
                  <span className="text-[10px] text-slate-500 block">gross top-line</span>
                </div>
              </div>

              {/* Live Market Share Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Estimated Market Share:</span>
                  <span className="font-mono font-bold text-blue-400">{marketSharePct}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${marketSharePct}%` }}
                  />
                </div>
              </div>

              <button
                onClick={onStartSolo}
                className="w-full min-h-[44px] mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer active:scale-95 shadow-md"
              >
                <span>Launch Full 5-Pillar Decision Terminal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5 C-Suite Decision Pillars Curriculum Architecture */}
      <section id="curriculum" className="py-16 sm:py-24 border-b border-slate-900 bg-slate-950/60 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono">Curriculum Architecture</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Holistic Enterprise Decision Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Each quarterly round requires synthesizing cross-functional trade-offs between profitability, market share, operations, and balance sheet solvency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 1: Marketing & Pricing */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3.5 shadow-sm hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300 glow-card">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Marketing & Pricing (CMO)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tune price elasticity across <strong>Economy</strong>, <strong>Mainstream</strong>, and <strong>Premium</strong> segments.
                Allocate advertising spend across channels and size regional sales teams to build customer brand awareness.
              </p>
              <div className="pt-2 text-[11px] text-slate-400 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Demand elasticity curves & multivariate attractiveness</span>
              </div>
            </div>

            {/* Pillar 2: Operations & 3D Plant */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3.5 shadow-sm hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 glow-card">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Operations & Supply Chain (COO)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Schedule production targets against plant capacity. Invest in <strong>Robotics Automation (Level 1–10)</strong> to permanently drive down unit labor costs, and invest in TQM to eliminate defect scrap.
              </p>
              <div className="pt-2 text-[11px] text-slate-400 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Features live 3D isometric automated factory apparatus</span>
              </div>
            </div>

            {/* Pillar 3: Finance & Treasury */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3.5 shadow-sm hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-300 glow-card">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Treasury & Financing (CFO)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Issue or repay corporate bonds, manage bank operating lines, execute accretive share buybacks to boost EPS, and distribute quarterly dividends without risking solvency penalties.
              </p>
              <div className="pt-2 text-[11px] text-slate-400 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Strict double-entry balancing: Assets = Liabilities + Equity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Isometric Factory Apparatus Showcase with Interactive Live Cycle */}
      <section id="factory" className="py-16 sm:py-24 border-b border-slate-900 bg-slate-950 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
                Anatomy Skill Powered
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                3D Factory Automation & Capacity Apparatus
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unlike abstract business games with static spreadsheets, STRATEX visualizes your enterprise infrastructure as a precision physical apparatus: dual guide rails, gantry carriage travel, an analog capacity dial indicator, and high-speed robotic manipulators.
              </p>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Physical Carriage Travel:</strong> Reflects scheduled production batches along the cast iron base.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Analog Capacity Needle:</strong> Visually swings from 0% to 120% overtime with live warning indicators.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Reactive Automation Level:</strong> Upgrades with multi-axis articulated robotic arms.</span>
                </li>
              </ul>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleTriggerFactoryCycle}
                  disabled={factoryRunning}
                  className="min-h-[44px] px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer active:scale-95 shadow-md disabled:opacity-50"
                >
                  <RotateCw className={`w-4 h-4 ${factoryRunning ? 'animate-spin' : ''}`} />
                  <span>{factoryRunning ? 'Simulating Production Batch...' : 'Simulate Live Factory Run'}</span>
                </button>

                <button
                  onClick={onStartSolo}
                  className="min-h-[44px] px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer active:scale-95"
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Operate Factory in Solo Sim</span>
                </button>
              </div>
            </div>

            {/* Live 3D Apparatus Canvas */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative glow-card">
              <FactoryApparatus3D
                plantCapacity={factoryCapacity}
                totalProduction={factoryProduction}
                automationLevel={factoryAutomation}
              />

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400">Test Robotics Level:</span>
                  <div className="flex space-x-1">
                    {[2, 5, 8, 10].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setFactoryAutomation(lvl)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                          factoryAutomation === lvl
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        L{lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 font-mono">
                  Production: <strong className="text-cyan-400">{factoryProduction.toLocaleString()}</strong> / {factoryCapacity.toLocaleString()} units
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Game Modes Section */}
      <section id="modes" className="py-16 sm:py-24 border-b border-slate-900 bg-slate-950/70 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 font-mono">Flexible Delivery</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Solo Practice vs. Live Cohort War Rooms
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Complete separation of single-player mastery and competitive multiplayer classrooms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Solo Mode Card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 flex flex-col justify-between hover:border-blue-500/60 transition-all duration-300 shadow-lg glow-card">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Mode 1 • Individual Student Practice
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Solo Terminal vs Autonomous AI</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Compete at your own pace against 3 autonomous competitor archetypes calibrated on real market dynamics:
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Apex Dynamics (Cost Leader):</strong> Relentless scale, heavy automation, and aggressive price cuts.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Novus Tech (Premium Innovator):</strong> High R&D spend, premium pricing, and high ESG brand equity.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Vanguard Industries (Balanced Incumbent):</strong> Conservative leverage and steady market share defense.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <button
                  onClick={onStartSolo}
                  className="w-full min-h-[46px] px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer active:scale-95 shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Solo Simulation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Multiplayer Mode Card */}
            <div className="bg-gradient-to-br from-slate-900 to-purple-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 flex flex-col justify-between hover:border-purple-500/60 transition-all duration-300 shadow-lg glow-card">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Mode 2 • Live MBA Classroom Cohort
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Live Cohort Rooms & Instructor Console</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Divide your section into executive management teams competing in the exact same market:
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Student Team War Rooms:</strong> Dedicated team cockpits with PIN-protected cohort access.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Decision Lock System:</strong> Real-time submission status tracking before round deadlines.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Instructor Console:</strong> Protected PIN controls, macro shock injection, and debriefing.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2">
                <button
                  onClick={onJoinCohort}
                  className="min-h-[46px] px-3 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer active:scale-95 shadow-md"
                >
                  <Users className="w-4 h-4" />
                  <span>Student Room</span>
                </button>
                <button
                  onClick={onOpenInstructor}
                  className="min-h-[46px] px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer active:scale-95"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Instructor Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Case Dilemmas Callout */}
      <section id="dilemmas" className="py-16 sm:py-20 border-b border-slate-900 bg-slate-950/80 scroll-reveal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
            Harvard Business School Style Scenarios
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Quarterly Strategic Dilemmas & Macro Shocks
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Between quarters, executive teams confront unforeseen strategic dilemmas with quantifiable trade-offs:
          </p>

          {/* Dilemma Selector Tabs */}
          <div className="flex justify-center space-x-2">
            {dilemmas.map((d, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDilemmaTab(idx)}
                className={`min-h-[38px] px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 ${
                  activeDilemmaTab === idx
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                Case #{idx + 1}
              </button>
            ))}
          </div>

          {/* Dilemma Card Preview */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 text-left space-y-4 shadow-xl glow-card animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">{dilemmas[activeDilemmaTab].subtitle}</span>
              <h3 className="font-extrabold text-base text-white mt-0.5">{dilemmas[activeDilemmaTab].title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{dilemmas[activeDilemmaTab].scenario}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-bold text-blue-400 block">Strategic Path A</span>
                <p className="text-xs text-slate-300">{dilemmas[activeDilemmaTab].optionA}</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 block">Strategic Path B</span>
                <p className="text-xs text-slate-300">{dilemmas[activeDilemmaTab].optionB}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 text-center text-xs text-slate-500 space-y-3">
        <div className="flex items-center justify-center space-x-2 text-slate-300 font-semibold text-sm">
          <Building2 className="w-4 h-4 text-blue-500" />
          <span>STRATEX MBA Business Simulator</span>
        </div>
        <p className="text-slate-500 text-[11px] max-w-lg mx-auto">
          Built for Master of Business Administration programs, Executive Leadership courses, and Corporate War-Room Seminars.
        </p>
        <div className="text-[10px] text-slate-600 font-mono">
          © 2026 STRATEX Dynamics • Antigravity Enterprise Suite
        </div>
      </footer>

      {/* Floating Sticky Mobile Quick Action Bar (Reveals on Mobile when Scrolled Down) */}
      {showStickyBottomCta && (
        <div className="md:hidden fixed bottom-3 left-3 right-3 z-50 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-2 flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={onStartSolo}
            className="flex-1 min-h-[44px] bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer mr-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Solo</span>
          </button>
          <button
            onClick={onJoinCohort}
            className="min-h-[44px] px-3.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 active:scale-95 cursor-pointer mr-1.5"
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Cohort</span>
          </button>
          <button
            onClick={onOpenInstructor}
            className="min-h-[44px] px-3 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center active:scale-95 cursor-pointer"
            title="Instructor Console"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      )}

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 w-10 h-10 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-full flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer backdrop-blur-md animate-in fade-in zoom-in-75 duration-200"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
