'use client';

import React, { useState } from 'react';
import { CohortRoom } from '@/lib/engine/room-manager';
import { Users, PlusCircle, LogIn, Play, CheckCircle2, Clock, ShieldCheck, RotateCcw } from 'lucide-react';

interface CohortRoomTabProps {
  currentRoom: CohortRoom | null;
  currentTeamId?: string;
  onCreateRoom: (roomName: string, pin: string, maxQuarters: number) => Promise<void>;
  onJoinRoom: (roomId: string, teamName: string, memberName: string) => Promise<void>;
  onAdvanceQuarter: (pin: string) => Promise<void>;
  onRefreshRoom: () => Promise<void>;
  isSubmitting: boolean;
}

export const CohortRoomTab: React.FC<CohortRoomTabProps> = ({
  currentRoom,
  currentTeamId,
  onCreateRoom,
  onJoinRoom,
  onAdvanceQuarter,
  onRefreshRoom,
  isSubmitting,
}) => {
  const [mode, setMode] = useState<'view' | 'create' | 'join'>(currentRoom ? 'view' : 'create');

  // Form states
  const [createName, setCreateName] = useState('Fall 2026 MBA - Section A');
  const [createPin, setCreatePin] = useState('1234');
  const [createQuarters, setCreateQuarters] = useState(8);

  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinTeamName, setJoinTeamName] = useState('Titan Capital');
  const [joinMemberName, setJoinMemberName] = useState('Alex & Jordan');

  const [instructorPinInput, setInstructorPinInput] = useState('');

  if (!currentRoom) {
    return (
      <div className="max-w-xl mx-auto space-y-4 sm:space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-3 mb-5">
            <button
              onClick={() => setMode('create')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                mode === 'create'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Room (Instructor)</span>
            </button>

            <button
              onClick={() => setMode('join')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                mode === 'join'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Join Room (Team)</span>
            </button>
          </div>

          {mode === 'create' ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onCreateRoom(createName, createPin, createQuarters);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Cohort / Course Name</label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-sans focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Instructor PIN (for advancing rounds)</label>
                <input
                  type="password"
                  value={createPin}
                  onChange={(e) => setCreatePin(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-sans focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Simulation Duration</label>
                <select
                  value={createQuarters}
                  onChange={(e) => setCreateQuarters(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-sans focus:outline-none focus:border-blue-500 text-sm cursor-pointer"
                >
                  <option value={4}>4 Quarters (1 Year Accelerated)</option>
                  <option value={8}>8 Quarters (2 Years Standard MBA)</option>
                  <option value={12}>12 Quarters (3 Years Extended)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition cursor-pointer mt-3 active:scale-95 shadow-sm"
              >
                {isSubmitting ? 'Creating Room...' : 'Launch Cohort Room'}
              </button>
            </form>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onJoinRoom(joinRoomId.trim().toUpperCase(), joinTeamName, joinMemberName);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Room Code (e.g. ROOM-1234)</label>
                <input
                  type="text"
                  placeholder="ROOM-XXXX"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono uppercase focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Your Team Name</label>
                <input
                  type="text"
                  value={joinTeamName}
                  onChange={(e) => setJoinTeamName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-sans focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Student Names / Roles</label>
                <input
                  type="text"
                  value={joinMemberName}
                  onChange={(e) => setJoinMemberName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-sans focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-sm transition cursor-pointer mt-3 active:scale-95 shadow-sm"
              >
                {isSubmitting ? 'Joining Room...' : 'Enter Cohort Competition'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const teams = Object.values(currentRoom.teams);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Room Status Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-bold text-sm sm:text-base text-slate-100">{currentRoom.roomName}</h2>
            <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-blue-950 text-blue-300 border border-blue-800">
              {currentRoom.roomId}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center space-x-3">
            <span>Quarter <strong>{currentRoom.quarter} of {currentRoom.maxQuarters}</strong></span>
            <span>•</span>
            <span>Teams Enrolled: <strong>{teams.length}</strong></span>
          </div>
        </div>

        <button
          onClick={onRefreshRoom}
          className="min-h-[38px] px-3.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Roster</span>
        </button>
      </div>

      {/* Team Roster & Submission Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-3.5">
        <h3 className="font-bold text-xs sm:text-sm text-slate-100 flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span>Cohort Submissions (Quarter {currentRoom.quarter})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teams.map((t) => {
            const isMyTeam = t.teamId === currentTeamId;
            return (
              <div
                key={t.teamId}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                  isMyTeam ? 'bg-blue-950/40 border-blue-500/80 ring-1 ring-blue-500/40' : 'bg-slate-950/40 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5 font-bold text-slate-200">
                    <span>{t.teamName}</span>
                    {isMyTeam && <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.2 rounded">(You)</span>}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {t.members.join(', ')}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {t.hasSubmitted ? (
                    <span className="flex items-center text-emerald-400 font-semibold space-x-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Decisions Locked</span>
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-400 font-semibold space-x-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Deliberating</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructor Console */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-xs sm:text-sm text-slate-100 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Instructor Console: Advance Quarter</span>
        </h3>
        <p className="text-xs text-slate-300">
          When teams lock decisions, enter your instructor PIN to execute market resolution and advance the quarter.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
          <input
            type="password"
            placeholder="Instructor Admin PIN"
            value={instructorPinInput}
            onChange={(e) => setInstructorPinInput(e.target.value)}
            className="min-h-[44px] px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs sm:w-52 focus:outline-none focus:border-blue-500 font-mono"
          />
          <button
            onClick={() => onAdvanceQuarter(instructorPinInput)}
            disabled={isSubmitting}
            className="min-h-[44px] px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSubmitting ? 'Resolving Round...' : 'Advance Quarter'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
