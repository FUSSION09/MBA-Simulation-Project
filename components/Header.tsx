'use client';

import React, { useState } from 'react';
import { CompanyReport, MacroEnvironment } from '@/lib/engine/types';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Award,
  Play,
  Building2,
  Users,
  Compass,
  Home,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Percent
} from 'lucide-react';

interface HeaderProps {
  company: CompanyReport;
  macro: MacroEnvironment;
  quarter: number;
  maxQuarters: number;
  gameMode: 'solo' | 'multiplayer';
  onAdvance: () => void;
  isAdvancing: boolean;
  onOpenRoomModal?: () => void;
  onReturnToPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  company,
  macro,
  quarter,
  maxQuarters,
  gameMode,
  onAdvance,
  isAdvancing,
  onOpenRoomModal,
  onReturnToPortal
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const stockDelta = company.stockPrice - 25.00; // baseline
  const isCompleted = quarter >= maxQuarters;
  const progressPct = Math.round((quarter / maxQuarters) * 100);

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 sticky top-0 z-50">
      {/* Top micro progress ticker */}
      <div className="w-full bg-slate-950 h-1">
        <div
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-1 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Company Branding & Quarter */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10 shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 truncate">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white truncate">
                  {company.companyName}
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                  {gameMode === 'solo' ? 'Solo' : 'Room'}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-0.5">
                <span className="font-semibold text-amber-300 whitespace-nowrap">{macro.quarterLabel}</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="hidden sm:inline">GDP +{macro.gdpGrowthPct}%</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="hidden sm:inline">Fed Rate {macro.benchmarkInterestRate}%</span>
              </div>
            </div>
          </div>

          {/* Key Tickers (Always visible) */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-xs">
            {/* Share Price */}
            <div className="text-right">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Stock</span>
              <div className="font-bold text-xs sm:text-sm text-white flex items-center justify-end font-mono">
                ${company.stockPrice.toFixed(2)}
                <span className={`text-[10px] sm:text-[11px] ml-1 flex items-center font-medium ${stockDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stockDelta >= 0 ? '+' : ''}{stockDelta.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Cash */}
            <div className="text-right">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Cash</span>
              <div className={`font-bold text-xs sm:text-sm font-mono flex items-center justify-end ${
                company.balanceSheet.cash < 500_000 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                ${(company.balanceSheet.cash / 1_000_000).toFixed(1)}M
              </div>
            </div>

            {/* Desktop-only tickers */}
            <div className="text-right hidden md:block">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Market Cap</span>
              <div className="font-bold text-sm text-slate-200 font-mono">
                ${(company.marketCap / 1_000_000).toFixed(1)}M
              </div>
            </div>

            <div className="text-center hidden lg:block">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Credit Tier</span>
              <span className="inline-block font-mono font-bold px-2 py-0.5 rounded text-[11px] mt-0.5 border bg-slate-800 text-slate-200 border-slate-700">
                {company.creditRating}
              </span>
            </div>

            <div className="text-center hidden lg:block">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Scorecard</span>
              <div className="font-bold text-sm text-amber-300 flex items-center justify-center font-mono">
                <Award className="w-3.5 h-3.5 mr-0.5 text-amber-400" />
                {company.scorecard.totalScore}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {onReturnToPortal && (
              <button
                onClick={onReturnToPortal}
                className="h-9 px-2.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg flex items-center space-x-1.5 transition active:scale-95 cursor-pointer"
                title="Return to Main Portal"
              >
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Portal</span>
              </button>
            )}

            {onOpenRoomModal && (
              <button
                onClick={onOpenRoomModal}
                className="hidden sm:flex h-9 px-3 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg items-center space-x-1 transition active:scale-95 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Rooms</span>
              </button>
            )}

            <button
              onClick={onAdvance}
              disabled={isAdvancing || isCompleted}
              className={`min-h-[38px] px-3 sm:px-4 rounded-lg font-semibold text-xs flex items-center space-x-1.5 shadow-sm transition active:scale-95 cursor-pointer ${
                isCompleted
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-1 ring-emerald-400/30'
              }`}
            >
              {isAdvancing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Simulating...</span>
                </>
              ) : isCompleted ? (
                <span>Finished</span>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span className="hidden sm:inline">End Q{quarter}</span>
                  <span className="sm:hidden">Q{quarter}</span>
                </>
              )}
            </button>

            {/* Mobile Expand Toggle */}
            <button
              onClick={() => setMobileExpanded(!mobileExpanded)}
              className="sm:hidden w-9 h-9 flex items-center justify-center bg-slate-800 text-slate-300 rounded-lg border border-slate-700 active:bg-slate-700 cursor-pointer"
              aria-label="Toggle mobile details"
            >
              {mobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileExpanded && (
          <div className="sm:hidden mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs animate-in slide-in-from-top-2 duration-150">
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Market Cap</span>
              <span className="font-mono font-bold text-slate-200">${(company.marketCap / 1_000_000).toFixed(1)}M</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Credit Tier</span>
              <span className="font-mono font-bold text-emerald-400">{company.creditRating}</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Scorecard</span>
              <span className="font-mono font-bold text-amber-300">{company.scorecard.totalScore} pts</span>
            </div>
            <div className="col-span-3 text-[10px] text-slate-400 bg-slate-950/40 py-1.5 px-2 rounded flex justify-between mt-1">
              <span>GDP Growth: +{macro.gdpGrowthPct}%</span>
              <span>Fed Rate: {macro.benchmarkInterestRate}%</span>
              <span>Inflation: {macro.inflationPct}%</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
