'use client';

import React, { useState } from 'react';
import { CohortRoom } from '@/lib/engine/room-manager';
import {
  GraduationCap,
  PlusCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Users,
  ShieldAlert,
  Award,
  Layers,
  KeyRound
} from 'lucide-react';

interface InstructorPortalProps {
  onReturnToPortal: () => void;
}

export const InstructorPortal: React.FC<InstructorPortalProps> = ({ onReturnToPortal }) => {
  const [activeTab, setActiveTab] = useState<'manage' | 'create'>('create');
  const [currentRoom, setCurrentRoom] = useState<CohortRoom | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create Room Form state
  const [createName, setCreateName] = useState('Fall 2026 MBA - Strategy Section A');
  const [createPin, setCreatePin] = useState('1234');
  const [createQuarters, setCreateQuarters] = useState(8);

  // Manage Room Form state
  const [lookupRoomId, setLookupRoomId] = useState('');
  const [instructorPinInput, setInstructorPinInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Handle Create Room
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/sim/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_room',
          roomName: createName,
          instructorPin: createPin,
          maxQuarters: createQuarters,
        }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        setCurrentRoom(data.room);
        setInstructorPinInput(createPin);
        setActiveTab('manage');
        setStatusMessage(`Cohort Room created! Share room code "${data.room.roomId}" with your students.`);
      } else {
        alert(data.error || 'Failed to create room');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating room');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle Lookup Room
  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/sim/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_room', roomId: lookupRoomId.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        setCurrentRoom(data.room);
        setStatusMessage(`Loaded room: ${data.room.roomName}`);
      } else {
        alert(data.error || 'Room not found');
      }
    } catch (err) {
      console.error(err);
      alert('Error finding room');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle Advance Round
  async function handleAdvanceQuarter() {
    if (!currentRoom) return;
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/sim/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'advance_round',
          roomId: currentRoom.roomId,
          instructorPin: instructorPinInput,
        }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        setCurrentRoom(data.room);
        setStatusMessage(`Successfully simulated Quarter ${data.room.quarter - 1}! Market results updated.`);
      } else {
        alert(data.error || 'Failed to advance round. Check instructor PIN.');
      }
    } catch (err) {
      console.error(err);
      alert('Error advancing round');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Refresh Room
  async function handleRefresh() {
    if (!currentRoom) return;
    try {
      const res = await fetch('/api/sim/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_room', roomId: currentRoom.roomId }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        setCurrentRoom(data.room);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const teams = currentRoom ? Object.values(currentRoom.teams) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Instructor Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onReturnToPortal}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-bold text-sm text-white">Instructor Administration Portal</h1>
                <span className="text-[10px] text-slate-400">Classroom Cohort Room Management & Round Control</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                activeTab === 'create' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New Room</span>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                activeTab === 'manage' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Manage Existing Room</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Status Notification */}
        {statusMessage && (
          <div className="bg-emerald-950/60 border border-emerald-800 rounded-xl p-3.5 text-xs text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Create Room Tab */}
        {activeTab === 'create' && (
          <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <PlusCircle className="w-4 h-4 text-blue-400" />
                <span>Launch a New MBA Cohort Room</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure your course name, simulation duration, and master instructor PIN for running rounds.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Course / Section Name</label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Instructor PIN (Required to advance rounds)</label>
                <input
                  type="password"
                  value={createPin}
                  onChange={(e) => setCreatePin(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Keep this secret. Only the instructor can advance quarters.</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Simulation Quarters</label>
                <select
                  value={createQuarters}
                  onChange={(e) => setCreateQuarters(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value={4}>4 Quarters (1 Year Accelerated Course)</option>
                  <option value={8}>8 Quarters (2 Years Standard MBA Course)</option>
                  <option value={12}>12 Quarters (3 Years Capstone Workshop)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition cursor-pointer mt-2 shadow-sm active:scale-95"
              >
                {isSubmitting ? 'Launching Room...' : 'Create Cohort Room'}
              </button>
            </form>
          </div>
        )}

        {/* Manage Existing Room Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            {!currentRoom ? (
              <div className="max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    <span>Access Active Cohort Room</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Enter your room code to open the instructor dashboard.</p>
                </div>

                <form onSubmit={handleLookup} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Room Code (e.g. ROOM-8492)</label>
                    <input
                      type="text"
                      placeholder="ROOM-XXXX"
                      value={lookupRoomId}
                      onChange={(e) => setLookupRoomId(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm font-mono uppercase focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[44px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition cursor-pointer"
                  >
                    {isSubmitting ? 'Locating...' : 'Load Room Console'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Active Room Info Bar */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <span className="font-bold text-base text-white">{currentRoom.roomName}</span>
                      <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-blue-950 text-blue-300 border border-blue-800">
                        {currentRoom.roomId}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center space-x-3 font-mono">
                      <span>Quarter: <strong className="text-amber-300">{currentRoom.quarter} of {currentRoom.maxQuarters}</strong></span>
                      <span>•</span>
                      <span>Enrolled Teams: <strong className="text-slate-200">{teams.length}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleRefresh}
                      className="min-h-[38px] px-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Team Roster & Decision Lock Status */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>Student Team Submissions (Quarter {currentRoom.quarter})</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {teams.filter(t => t.hasSubmitted).length} / {teams.length} Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {teams.map((t) => (
                      <div key={t.teamId} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-200 block text-sm">{t.teamName}</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{t.members.join(', ')}</span>
                        </div>
                        <div>
                          {t.hasSubmitted ? (
                            <span className="flex items-center text-emerald-400 font-semibold text-xs space-x-1 bg-emerald-950/50 px-2 py-1 rounded border border-emerald-800/80">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Decisions Locked</span>
                            </span>
                          ) : (
                            <span className="flex items-center text-amber-400 font-semibold text-xs space-x-1 bg-amber-950/50 px-2 py-1 rounded border border-amber-800/80">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Deliberating</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Round Advance Console */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Play className="w-4 h-4 text-purple-400" />
                    <span>Execute Market Simulation for Quarter {currentRoom.quarter}</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    When all student teams have locked their quarterly plans, enter your Instructor PIN to resolve the market shares, update GAAP statements, and advance the course to Quarter {currentRoom.quarter + 1}.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <input
                      type="password"
                      placeholder="Enter Instructor PIN"
                      value={instructorPinInput}
                      onChange={(e) => setInstructorPinInput(e.target.value)}
                      className="min-h-[44px] px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs sm:w-60 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      onClick={handleAdvanceQuarter}
                      disabled={isSubmitting}
                      className="min-h-[44px] px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isSubmitting ? 'Simulating Market...' : `Execute & Advance to Q${currentRoom.quarter + 1}`}</span>
                    </button>
                  </div>
                </div>

                {/* Cohort Leaderboard */}
                {currentRoom.simulation?.companies && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                    <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Current Cohort Standings (Quarter {currentRoom.quarter})</span>
                    </h3>
                    <div className="momentum-scroll">
                      <table className="w-full text-xs text-left min-w-[500px]">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="pb-2 font-medium">Team</th>
                            <th className="pb-2 font-medium text-right">Stock Price</th>
                            <th className="pb-2 font-medium text-right">Market Cap</th>
                            <th className="pb-2 font-medium text-right">Revenue</th>
                            <th className="pb-2 font-medium text-right">Net Income</th>
                            <th className="pb-2 font-medium text-right">Scorecard</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {Object.values(currentRoom.simulation.companies)
                            .sort((a, b) => b.scorecard.totalScore - a.scorecard.totalScore)
                            .map((comp, idx) => (
                              <tr key={comp.companyId} className="text-slate-300">
                                <td className="py-2.5 font-sans font-medium text-slate-200">
                                  #{idx + 1} {comp.companyName}
                                </td>
                                <td className="py-2.5 text-right">${comp.stockPrice.toFixed(2)}</td>
                                <td className="py-2.5 text-right">${(comp.marketCap / 1_000_000).toFixed(1)}M</td>
                                <td className="py-2.5 text-right">${(comp.incomeStatement.revenue / 1_000_000).toFixed(2)}M</td>
                                <td className={`py-2.5 text-right ${comp.incomeStatement.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  ${(comp.incomeStatement.netIncome / 1_000).toFixed(0)}k
                                </td>
                                <td className="py-2.5 text-right font-bold text-amber-400">{comp.scorecard.totalScore}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
