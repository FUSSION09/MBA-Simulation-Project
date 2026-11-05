'use client';

import React, { useState, useEffect } from 'react';
import { CohortRoom, CohortTeam } from '@/lib/engine/room-manager';
import { CompanyDecision, CompanyReport } from '@/lib/engine/types';
import { OverviewTab } from '@/components/OverviewTab';
import { DecisionsTab } from '@/components/DecisionsTab';
import { FinancialsTab } from '@/components/FinancialsTab';
import { DilemmasTab } from '@/components/DilemmasTab';
import { DilemmaChoice } from '@/lib/engine/dilemmas';
import {
  Users,
  Building2,
  Lock,
  CheckCircle2,
  Clock,
  ArrowLeft,
  RefreshCw,
  Copy,
  Check,
  Send,
  AlertTriangle,
  BarChart3,
  Sliders,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Award
} from 'lucide-react';

interface StudentMultiplayerViewProps {
  onReturnToPortal: () => void;
}

export const StudentMultiplayerView: React.FC<StudentMultiplayerViewProps> = ({ onReturnToPortal }) => {
  const [currentRoom, setCurrentRoom] = useState<CohortRoom | null>(null);
  const [myTeamId, setMyTeamId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'decisions' | 'financials' | 'standings' | 'dilemmas'>('overview');

  // Join form state
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinTeamName, setJoinTeamName] = useState('Titan Strategy Corp');
  const [joinMemberName, setJoinMemberName] = useState('Jordan Vance');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Decision draft state
  const [playerDecisions, setPlayerDecisions] = useState<CompanyDecision | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedDilemmaId, setSelectedDilemmaId] = useState<string | undefined>();
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState<string | null>(null);

  // Initialize draft decisions when team/quarter changes
  function resetTeamDecisions(company: CompanyReport, quarter: number) {
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

  // Handle joining room
  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setJoinError(null);
    setIsJoining(true);

    try {
      const res = await fetch('/api/sim/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join_room',
          roomId: joinRoomId.trim().toUpperCase(),
          teamName: joinTeamName.trim(),
          memberName: joinMemberName.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.room) {
        setCurrentRoom(data.room);
        setMyTeamId(data.teamId);
        const comp = data.room.simulation.companies[data.teamId];
        if (comp) {
          resetTeamDecisions(comp, data.room.quarter);
        }
      } else {
        setJoinError(data.error || 'Failed to join cohort room. Please verify the Room Code.');
      }
    } catch {
      setJoinError('Network error connecting to multiplayer server.');
    } finally {
      setIsJoining(false);
    }
  }

  // Quick Demo Room (creates or joins a test room for student preview)
  async function handleCreateDemoRoom() {
    setIsJoining(true);
    setJoinError(null);
    try {
      const createRes = await fetch('/api/sim/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_room',
          roomName: 'Live MBA Cohort - Alpha Section',
          instructorPin: '1234',
          maxQuarters: 8,
        }),
      });
      const createData = await createRes.json();
      if (createData.success && createData.room) {
        // Now join as student
        const joinRes = await fetch('/api/sim/multiplayer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'join_room',
            roomId: createData.room.roomId,
            teamName: 'Apex Capital Partners',
            memberName: 'Student Lead',
          }),
        });
        const joinData = await joinRes.json();
        if (joinData.success && joinData.room) {
          setCurrentRoom(joinData.room);
          setMyTeamId(joinData.teamId);
          const comp = joinData.room.simulation.companies[joinData.teamId];
          if (comp) {
            resetTeamDecisions(comp, joinData.room.quarter);
          }
        }
      }
    } catch {
      setJoinError('Failed to initialize demo cohort room.');
    } finally {
      setIsJoining(false);
    }
  }

  // Poll / refresh room state
  async function refreshRoom() {
    if (!currentRoom) return;
    try {
      const res = await fetch('/api/sim/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_room', roomId: currentRoom.roomId }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        // If quarter advanced, notify and reset draft
        if (data.room.quarter !== currentRoom.quarter) {
          setSubmitSuccessNotice(`Quarter ${data.room.quarter} has commenced! Review the updated market results below.`);
          if (myTeamId) {
            const comp = data.room.simulation.companies[myTeamId];
            if (comp) resetTeamDecisions(comp, data.room.quarter);
          }
        }
        setCurrentRoom(data.room);
      }
    } catch (e) {
      console.error('Error refreshing room:', e);
    }
  }

  // Submit decisions for current round
  async function handleSubmitDecisions() {
    if (!currentRoom || !myTeamId || !playerDecisions || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitSuccessNotice(null);

    try {
      const res = await fetch('/api/sim/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_decision',
          roomId: currentRoom.roomId,
          teamId: myTeamId,
          decision: playerDecisions,
        }),
      });

      const data = await res.json();
      if (data.success && data.room) {
        setCurrentRoom(data.room);
        setSubmitSuccessNotice(`Decisions successfully locked for Quarter ${data.room.quarter}! Waiting for other teams and instructor round advancement.`);
      } else {
        alert(data.error || 'Failed to submit decisions.');
      }
    } catch {
      alert('Error submitting decisions to cohort server.');
    } finally {
      setIsSubmitting(false);
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

  function copyRoomCode() {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom.roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  // SCREEN 1: JOIN ROOM LOBBY
  if (!currentRoom || !myTeamId) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
        {/* Top Bar */}
        <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={onReturnToPortal}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Main Portal</span>
          </button>
          <div className="flex items-center space-x-2 text-xs text-purple-400 font-semibold">
            <Users className="w-4 h-4" />
            <span>Student Cohort Multiplayer</span>
          </div>
        </header>

        {/* Join Container */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white mx-auto shadow-md ring-1 ring-white/10">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Join Cohort War Room
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Enter your course Room Code to enter the competitive simulation with your student team.
              </p>
            </div>

            {joinError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{joinError}</span>
              </div>
            )}

            <form onSubmit={handleJoin} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Room Code (from Instructor)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ROOM-8492"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono tracking-widest text-sm focus:outline-none focus:border-purple-500 uppercase placeholder:text-slate-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Team / Enterprise Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Titan Strategy Corp"
                  value={joinTeamName}
                  onChange={(e) => setJoinTeamName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-sans text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Your Name (or Team Members)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Vance & Alex Rivera"
                  value={joinMemberName}
                  onChange={(e) => setJoinMemberName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-sans text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isJoining}
                className="w-full min-h-[46px] bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer active:scale-95 shadow-md ring-1 ring-purple-400/30 disabled:opacity-50"
              >
                {isJoining ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting to Room...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Enter Cohort War Room</span>
                  </>
                )}
              </button>

              <div className="relative py-1 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <span className="relative bg-slate-900 px-2 text-[10px] text-slate-500 uppercase tracking-wider">
                  Or Test Now
                </span>
              </div>

              <button
                type="button"
                onClick={handleCreateDemoRoom}
                disabled={isJoining}
                className="w-full min-h-[42px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Launch Instant Practice Cohort</span>
              </button>
            </form>

            {/* How Multiplayer Works Card */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 space-y-2">
              <h3 className="font-bold text-slate-200 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>How Multiplayer Cohort Works</span>
              </h3>
              <ul className="space-y-1.5 text-[11px] list-disc list-inside text-slate-400">
                <li>All student teams compete in the exact same market.</li>
                <li>Your pricing, R&D, and marketing directly influence rival sales.</li>
                <li>Submit and lock your decisions before the quarter deadline.</li>
                <li>The professor advances the round when all teams are ready.</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // SCREEN 2: ACTIVE STUDENT COHORT COCKPIT
  const currentCompany = currentRoom.simulation.companies[myTeamId] || Object.values(currentRoom.simulation.companies)[0];
  const myTeam = currentRoom.teams[myTeamId];
  const hasSubmittedThisQuarter = myTeam?.hasSubmitted;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Student Cohort Header */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Team & Room Info */}
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10 shrink-0">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 truncate">
                  <span className="font-bold text-sm sm:text-base tracking-tight text-white truncate">
                    {currentCompany.companyName}
                  </span>
                  <button
                    onClick={copyRoomCode}
                    className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/80 flex items-center space-x-1 cursor-pointer hover:bg-purple-900"
                    title="Click to copy Room Code"
                  >
                    <span>{currentRoom.roomId}</span>
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="text-amber-300 font-semibold">{currentRoom.roomName}</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-slate-300">Q{currentRoom.quarter} / Q{currentRoom.maxQuarters}</span>
                </div>
              </div>
            </div>

            {/* Lock / Submission Status Pill */}
            <div className="hidden sm:flex items-center space-x-2">
              {hasSubmittedThisQuarter ? (
                <div className="px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Decisions Locked for Q{currentRoom.quarter}</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 animate-pulse">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Q{currentRoom.quarter} Decisions Pending</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={refreshRoom}
                className="h-9 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer active:scale-95"
                title="Refresh room updates from instructor"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-300" />
                <span className="hidden md:inline">Refresh</span>
              </button>

              <button
                onClick={onReturnToPortal}
                className="h-9 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1 transition cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="hidden md:block bg-slate-900/60 border-b border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto flex space-x-2 sm:space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'overview'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Team Cockpit</span>
          </button>

          <button
            onClick={() => setActiveTab('decisions')}
            className={`py-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer relative ${
              activeTab === 'decisions'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>C-Suite Decisions</span>
            {!hasSubmittedThisQuarter && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-2 right-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`py-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'financials'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financial Statements</span>
          </button>

          <button
            onClick={() => setActiveTab('standings')}
            className={`py-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'standings'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Cohort Standings</span>
          </button>

          <button
            onClick={() => setActiveTab('dilemmas')}
            className={`py-3 px-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'dilemmas'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Dilemmas</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 space-y-4">
        {/* Flash Notifications */}
        {submitSuccessNotice && (
          <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-300 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{submitSuccessNotice}</span>
            </div>
            <button
              onClick={() => setSubmitSuccessNotice(null)}
              className="text-emerald-400 hover:text-emerald-200 cursor-pointer ml-3 p-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <OverviewTab
            company={currentCompany}
            macro={currentRoom.simulation.macro}
            allCompanies={currentRoom.simulation.companies}
            onNavigateToDecisions={() => setActiveTab('decisions')}
            onNavigateToDilemma={() => setActiveTab('dilemmas')}
          />
        )}

        {/* Tab 2: Decisions */}
        {activeTab === 'decisions' && playerDecisions && (
          <div className="space-y-4">
            {/* Top Decision Submission Card */}
            <div className="bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span>Quarter {currentRoom.quarter} Decision Submission</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {hasSubmittedThisQuarter
                    ? 'Your team decisions are currently locked. You may update and resubmit prior to instructor round resolution.'
                    : 'Draft your strategy across the 5 C-suite tabs, then lock decisions to submit to the instructor.'}
                </p>
              </div>

              <button
                onClick={handleSubmitDecisions}
                disabled={isSubmitting}
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer active:scale-95 shadow-md ring-1 ring-purple-400/30 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Locking Decisions...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{hasSubmittedThisQuarter ? 'Resubmit & Lock Q' + currentRoom.quarter : 'Lock & Submit Q' + currentRoom.quarter + ' Decisions'}</span>
                  </>
                )}
              </button>
            </div>

            <DecisionsTab
              company={currentCompany}
              decisions={playerDecisions}
              onChange={setPlayerDecisions}
              onReset={() => resetTeamDecisions(currentCompany, currentRoom.quarter)}
            />
          </div>
        )}

        {/* Tab 3: Financials */}
        {activeTab === 'financials' && (
          <FinancialsTab company={currentCompany} />
        )}

        {/* Tab 4: Cohort Standings */}
        {activeTab === 'standings' && (
          <div className="space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
              <h2 className="font-bold text-sm text-white flex items-center space-x-2 mb-3">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Live Cohort Standings — Quarter {currentRoom.quarter}</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Team / Enterprise</th>
                      <th className="py-2.5 px-3">Members</th>
                      <th className="py-2.5 px-3 text-right">Stock Price</th>
                      <th className="py-2.5 px-3 text-right">Market Cap</th>
                      <th className="py-2.5 px-3 text-right">Scorecard</th>
                      <th className="py-2.5 px-3 text-center">Round Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {Object.values(currentRoom.teams).map((team) => {
                      const comp = currentRoom.simulation.companies[team.teamId];
                      const isMyTeam = team.teamId === myTeamId;
                      return (
                        <tr
                          key={team.teamId}
                          className={`hover:bg-slate-800/40 transition ${
                            isMyTeam ? 'bg-purple-950/20 font-semibold' : ''
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-200">{team.teamName}</span>
                              {isMyTeam && (
                                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded font-medium">
                                  Your Team
                                </span>
                              )}
                              {team.isAi && (
                                <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.2 rounded font-medium">
                                  AI
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-400">{team.members.join(', ')}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                            ${comp ? comp.stockPrice.toFixed(2) : '25.00'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-slate-300">
                            ${comp ? (comp.marketCap / 1_000_000).toFixed(1) : '250.0'}M
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-amber-300 font-bold">
                            {comp ? comp.scorecard.totalScore : 75}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {team.hasSubmitted ? (
                              <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Decisions Locked</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-full">
                                <Clock className="w-3 h-3" />
                                <span>Drafting</span>
                              </span>
                            )}
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

        {/* Tab 5: Dilemmas */}
        {activeTab === 'dilemmas' && (
          <DilemmasTab
            quarter={currentRoom.quarter}
            company={currentCompany}
            onSelectChoice={handleSelectDilemma}
            selectedChoiceId={selectedDilemmaId}
          />
        )}
      </main>

      {/* Mobile Bottom App Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'overview' ? 'text-purple-400 font-semibold bg-slate-800/80' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>Cockpit</span>
        </button>

        <button
          onClick={() => setActiveTab('decisions')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'decisions' ? 'text-purple-400 font-semibold bg-slate-800/80' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4 mb-0.5" />
          <span>Decisions</span>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'financials' ? 'text-purple-400 font-semibold bg-slate-800/80' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4 mb-0.5" />
          <span>Statements</span>
        </button>

        <button
          onClick={() => setActiveTab('standings')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'standings' ? 'text-purple-400 font-semibold bg-slate-800/80' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4 mb-0.5" />
          <span>Cohort</span>
        </button>

        <button
          onClick={() => setActiveTab('dilemmas')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'dilemmas' ? 'text-purple-400 font-semibold bg-slate-800/80' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 mb-0.5 text-amber-400" />
          <span>Dilemma</span>
        </button>
      </div>
    </div>
  );
};
