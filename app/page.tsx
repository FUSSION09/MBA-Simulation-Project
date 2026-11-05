'use client';

import React, { useState, useEffect } from 'react';
import { CompanyDecision, CompanyReport, SimulationState } from '@/lib/engine/types';
import { Header } from '@/components/Header';
import { OverviewTab } from '@/components/OverviewTab';
import { DecisionsTab } from '@/components/DecisionsTab';
import { FinancialsTab } from '@/components/FinancialsTab';
import { MarketIntelTab } from '@/components/MarketIntelTab';
import { DilemmasTab } from '@/components/DilemmasTab';
import { LandingPage } from '@/components/LandingPage';
import { InstructorPortal } from '@/components/InstructorPortal';
import { StudentMultiplayerView } from '@/components/StudentMultiplayerView';
import { DilemmaChoice } from '@/lib/engine/dilemmas';
import {
  BarChart3,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  X
} from 'lucide-react';

export default function Home() {
  const [appMode, setAppMode] = useState<'portal' | 'solo' | 'multiplayer' | 'instructor'>('portal');
  const [simState, setSimState] = useState<SimulationState | null>(null);
  const [currentCompanyId, setCurrentCompanyId] = useState<string>('player-company');
  const [activeTab, setActiveTab] = useState<'overview' | 'decisions' | 'financials' | 'intel' | 'dilemmas'>('overview');
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Debrief alert state
  const [completedQuarterAlert, setCompletedQuarterAlert] = useState<string | null>(null);
  const [selectedDilemmaId, setSelectedDilemmaId] = useState<string | undefined>();

  // Player draft decisions
  const [playerDecisions, setPlayerDecisions] = useState<CompanyDecision | null>(null);

  useEffect(() => {
    async function initSim() {
      try {
        const res = await fetch('/api/sim/solo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'init' }),
        });
        const data = await res.json();
        if (data.success && data.state) {
          setSimState(data.state);
          const pComp = data.state.companies['player-company'];
          resetDecisions(pComp, data.state.currentQuarter);
        }
      } catch (err) {
        console.error('Failed to init sim:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initSim();
  }, []);

  function resetDecisions(company: CompanyReport, quarter: number) {
    const draft: CompanyDecision = {
      companyId: company.companyId,
      quarter,
      products: {
        economy: {
          price: 45,
          adSpend: 200_000,
          salesForce: 10,
          targetProduction: Math.round(company.plantCapacity * 0.35),
          rdInvestment: 120_000,
        },
        mainstream: {
          price: 85,
          adSpend: 350_000,
          salesForce: 15,
          targetProduction: Math.round(company.plantCapacity * 0.45),
          rdInvestment: 250_000,
        },
        premium: {
          price: 150,
          adSpend: 250_000,
          salesForce: 12,
          targetProduction: Math.round(company.plantCapacity * 0.20),
          rdInvestment: 200_000,
        },
      },
      operations: {
        capacityExpansion: 0,
        automationLevel: company.automationLevel,
        tqmSpend: 100_000,
        esgSpend: 80_000,
      },
      hr: {
        salaryIncreasePct: 3.0,
        bonusPool: 50_000,
        trainingSpendPerEmployee: 800,
      },
      finance: {
        shortTermLoanChange: 0,
        bondIssueOrRepay: 0,
        sharesIssuedOrRepurchased: 0,
        dividendPerShare: 0.15,
      },
    };
    setPlayerDecisions(draft);
  }

  async function handleAdvance() {
    if (!simState || !playerDecisions || isAdvancing) return;

    setIsAdvancing(true);
    const priorQuarter = simState.currentQuarter;

    try {
      const res = await fetch('/api/sim/solo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'advance',
          currentState: simState,
          playerDecision: playerDecisions,
        }),
      });

      const data = await res.json();
      if (data.success && data.state) {
        setSimState(data.state);
        const pComp = data.state.companies[currentCompanyId];
        resetDecisions(pComp, data.state.currentQuarter);
        setSelectedDilemmaId(undefined);
        setCompletedQuarterAlert(`Quarter ${priorQuarter} market resolution complete! Review your latest financial statements and market share below.`);
        setActiveTab('overview');
      } else {
        alert(data.error || 'Failed to simulate quarter');
      }
    } catch (err) {
      console.error(err);
      alert('Error advancing quarter');
    } finally {
      setIsAdvancing(false);
    }
  }

  function handleSelectDilemma(choice: DilemmaChoice) {
    setSelectedDilemmaId(choice.id);
    if (!playerDecisions) return;

    const updated = { ...playerDecisions };
    if (choice.effect.cashDelta) {
      updated.operations.esgSpend += choice.id.includes('green') ? 100_000 : 0;
    }
    setPlayerDecisions(updated);
  }

  if (isLoading || !simState || !playerDecisions) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <h2 className="font-semibold text-sm">Bootstrapping MBA Business Simulator...</h2>
      </div>
    );
  }

  // 1. Render Portal Landing Page
  if (appMode === 'portal') {
    return (
      <LandingPage
        onStartSolo={() => {
          setAppMode('solo');
          setActiveTab('overview');
        }}
        onJoinCohort={() => {
          setAppMode('multiplayer');
        }}
        onOpenInstructor={() => {
          setAppMode('instructor');
        }}
      />
    );
  }

  // 2. Render Dedicated Instructor Portal
  if (appMode === 'instructor') {
    return (
      <InstructorPortal
        onReturnToPortal={() => setAppMode('portal')}
      />
    );
  }

  // 3. Render Dedicated Student Cohort Multiplayer
  if (appMode === 'multiplayer') {
    return (
      <StudentMultiplayerView
        onReturnToPortal={() => setAppMode('portal')}
      />
    );
  }

  // 4. Render Solo Simulation Mode (Pure Single-Player vs AI Bots, No Multiplayer Elements)
  const currentCompany = simState.companies[currentCompanyId] || Object.values(simState.companies)[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Header */}
      <Header
        company={currentCompany}
        macro={simState.macro}
        quarter={simState.currentQuarter}
        maxQuarters={simState.maxQuarters}
        gameMode="solo"
        onAdvance={handleAdvance}
        isAdvancing={isAdvancing}
        onReturnToPortal={() => setAppMode('portal')}
      />

      {/* Desktop / Tablet Navigation Bar (Pure Solo Tabs) */}
      <nav className="hidden md:block bg-slate-900/60 border-b border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Executive Cockpit</span>
          </button>

          <button
            onClick={() => setActiveTab('decisions')}
            className={`py-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'decisions'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>C-Suite Decisions</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`py-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'financials'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financial Statements</span>
          </button>

          <button
            onClick={() => setActiveTab('intel')}
            className={`py-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'intel'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Market Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab('dilemmas')}
            className={`py-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'dilemmas'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Strategic Dilemmas</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 space-y-4">
        {/* Quarter Advancement Flash Debrief */}
        {completedQuarterAlert && (
          <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-300 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center space-x-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{completedQuarterAlert}</span>
            </div>
            <button
              onClick={() => setCompletedQuarterAlert(null)}
              className="text-emerald-400 hover:text-emerald-200 cursor-pointer ml-3 p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'overview' && (
          <OverviewTab
            company={currentCompany}
            macro={simState.macro}
            allCompanies={simState.companies}
            onNavigateToDecisions={() => setActiveTab('decisions')}
            onNavigateToDilemma={() => setActiveTab('dilemmas')}
          />
        )}

        {activeTab === 'decisions' && (
          <DecisionsTab
            company={currentCompany}
            decisions={playerDecisions}
            onChange={setPlayerDecisions}
            onReset={() => resetDecisions(currentCompany, simState.currentQuarter)}
          />
        )}

        {activeTab === 'financials' && (
          <FinancialsTab company={currentCompany} />
        )}

        {activeTab === 'intel' && (
          <MarketIntelTab
            currentCompany={currentCompany}
            allCompanies={simState.companies}
            macro={simState.macro}
          />
        )}

        {activeTab === 'dilemmas' && (
          <DilemmasTab
            quarter={simState.currentQuarter}
            company={currentCompany}
            onSelectChoice={handleSelectDilemma}
            selectedChoiceId={selectedDilemmaId}
          />
        )}
      </main>

      {/* Fixed Mobile Bottom App Bar (Optimized for Thumb Reach on Phones - 5 Solo Tabs) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'overview' ? 'text-blue-400 font-semibold bg-slate-800/80' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>Cockpit</span>
        </button>

        <button
          onClick={() => setActiveTab('decisions')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'decisions' ? 'text-blue-400 font-semibold bg-slate-800/80' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4 mb-0.5" />
          <span>Decisions</span>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'financials' ? 'text-blue-400 font-semibold bg-slate-800/80' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4 mb-0.5" />
          <span>Statements</span>
        </button>

        <button
          onClick={() => setActiveTab('intel')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'intel' ? 'text-blue-400 font-semibold bg-slate-800/80' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 mb-0.5" />
          <span>Intel</span>
        </button>

        <button
          onClick={() => setActiveTab('dilemmas')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'dilemmas' ? 'text-blue-400 font-semibold bg-slate-800/80' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 mb-0.5 text-amber-400" />
          <span>Dilemma</span>
        </button>
      </div>

      {/* Desktop Footer */}
      <footer className="hidden md:block border-t border-slate-900 bg-slate-950/90 py-3 text-center text-[11px] text-slate-500">
        MBA Business Strategy & Enterprise Dynamics Simulator • Antigravity
      </footer>
    </div>
  );
}
