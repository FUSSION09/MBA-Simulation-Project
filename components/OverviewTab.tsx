'use client';

import React from 'react';
import { CompanyReport, MacroEnvironment, MarketSegment } from '@/lib/engine/types';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Factory,
  Users,
  Target,
  BarChart3,
  Award,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface OverviewTabProps {
  company: CompanyReport;
  macro: MacroEnvironment;
  allCompanies: Record<string, CompanyReport>;
  onNavigateToDecisions: () => void;
  onNavigateToDilemma: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  company,
  macro,
  allCompanies,
  onNavigateToDecisions,
  onNavigateToDilemma
}) => {
  const is = company.incomeStatement;
  const bs = company.balanceSheet;
  const roe = bs.totalEquity > 0 ? ((is.netIncome * 4) / bs.totalEquity) * 100 : 0;
  const plantUtil = Math.round(
    ((company.segmentResults.economy.unitsSold +
      company.segmentResults.mainstream.unitsSold +
      company.segmentResults.premium.unitsSold) /
      company.plantCapacity) * 100
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Active Dilemma Banner */}
      {macro.dilemmaPrompt && (
        <div className="bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-800/60 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="bg-amber-600/30 p-2 rounded-lg text-amber-400 mt-0.5 shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-semibold text-amber-400 uppercase tracking-wider">Strategic Dilemma Active</div>
              <h3 className="font-bold text-slate-100 text-xs sm:text-sm">{macro.dilemmaPrompt.title}</h3>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 line-clamp-2 sm:line-clamp-none max-w-2xl">
                {macro.dilemmaPrompt.description}
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToDilemma}
            className="w-full sm:w-auto min-h-[38px] px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition shrink-0 cursor-pointer active:scale-95"
          >
            <span>Resolve Dilemma</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top 6 KPI Metric Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs">
            <span>Quarterly Rev</span>
            <DollarSign className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-100 mt-1 font-mono">
            ${(is.revenue / 1_000_000).toFixed(2)}M
          </div>
          <div className="text-[10px] sm:text-[11px] text-emerald-400 mt-0.5 font-medium">
            Gross: {is.grossMarginPct}%
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs">
            <span>Net Income</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className={`text-base sm:text-lg font-bold mt-1 font-mono ${is.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${(is.netIncome / 1_000).toFixed(0)}k
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
            Net Margin: {is.netMarginPct}%
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs">
            <span>ROE (Ann.)</span>
            <Target className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-purple-300 mt-1 font-mono">
            {roe.toFixed(1)}%
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
            Equity: ${(bs.totalEquity / 1_000_000).toFixed(1)}M
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs">
            <span>Utilization</span>
            <Factory className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-100 mt-1 font-mono">
            {plantUtil}%
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
            Cap: {(company.plantCapacity / 1_000).toFixed(0)}k units
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs">
            <span>Team Morale</span>
            <Users className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-amber-300 mt-1 font-mono">
            {company.employeeMorale}%
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
            Staff: {company.employeeHeadcount}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs">
            <span>Scorecard</span>
            <Award className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-emerald-400 mt-1 font-mono">
            {company.scorecard.totalScore}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
            Rank #{Object.values(allCompanies).filter(c => c.scorecard.totalScore > company.scorecard.totalScore).length + 1} of 4
          </div>
        </div>
      </div>

      {/* Balanced Scorecard + Market Segments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Balanced Scorecard Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xs sm:text-sm text-slate-100 flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Balanced Scorecard</span>
              </h2>
              <span className="text-[11px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-mono font-bold border border-slate-700">
                {company.scorecard.totalScore} / 100
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1.5">
                  <span>Financial Health</span>
                  <span className="font-semibold text-emerald-400 font-mono">{company.scorecard.financialScore}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, company.scorecard.financialScore))}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1.5">
                  <span>Customer Loyalty & Quality</span>
                  <span className="font-semibold text-blue-400 font-mono">{company.scorecard.customerScore}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, company.scorecard.customerScore))}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1.5">
                  <span>Operational Efficiency</span>
                  <span className="font-semibold text-purple-400 font-mono">{company.scorecard.internalProcessScore}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, company.scorecard.internalProcessScore))}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1.5">
                  <span>Innovation, ESG & Culture</span>
                  <span className="font-semibold text-amber-400 font-mono">{company.scorecard.learningGrowthScore}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, company.scorecard.learningGrowthScore))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Automation: <strong className="text-slate-200 font-mono">Lvl {company.automationLevel}</strong></span>
            <span>Credit Tier: <strong className="text-emerald-400 font-mono">{company.creditRating}</strong></span>
          </div>
        </div>

        {/* Product Segments Overview */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xs sm:text-sm text-slate-100 flex items-center space-x-1.5">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Segment Operations & Share</span>
              </h2>
              <button
                onClick={onNavigateToDecisions}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer font-medium"
              >
                <span>Edit Decisions</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {(['economy', 'mainstream', 'premium'] as MarketSegment[]).map((seg) => {
                const res = company.segmentResults[seg];
                const sharePct = (res.companyShare * 100).toFixed(1);
                return (
                  <div key={seg} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold capitalize text-slate-200 text-sm tracking-tight">{seg}</span>
                      <span className="bg-blue-950/80 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded font-mono text-[11px] font-semibold">
                        {sharePct}% Share
                      </span>
                    </div>

                    <div className="space-y-1.5 text-slate-400 text-[11px]">
                      <div className="flex justify-between">
                        <span>Units Sold:</span>
                        <span className="text-slate-200 font-mono">{res.unitsSold.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stockout Loss:</span>
                        <span className={res.stockoutUnits > 0 ? 'text-rose-400 font-mono font-medium' : 'text-slate-500 font-mono'}>
                          {res.stockoutUnits.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Brand Awareness:</span>
                        <span className="text-blue-400 font-mono">{company.brandAwareness[seg]}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality Rating:</span>
                        <span className="text-purple-400 font-mono">{company.productQuality[seg]} pts</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800/80 pt-1.5 text-slate-200 font-medium">
                        <span>Net Revenue:</span>
                        <span className="text-emerald-400 font-mono font-bold">${(res.revenue / 1_000).toLocaleString()}k</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Competitor League Table with momentum touch scrolling */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <h2 className="font-bold text-xs sm:text-sm text-slate-100 flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-purple-400" />
          <span>Industry Competitor League Table</span>
        </h2>
        <div className="momentum-scroll">
          <table className="w-full text-xs text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-medium">Enterprise</th>
                <th className="pb-2 font-medium">Strategy</th>
                <th className="pb-2 font-medium text-right">Share Price</th>
                <th className="pb-2 font-medium text-right">Market Cap</th>
                <th className="pb-2 font-medium text-right">Revenue</th>
                <th className="pb-2 font-medium text-right">Net Income</th>
                <th className="pb-2 font-medium text-center">Credit</th>
                <th className="pb-2 font-medium text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {Object.values(allCompanies)
                .sort((a, b) => b.scorecard.totalScore - a.scorecard.totalScore)
                .map((comp) => {
                  const isPlayer = comp.companyId === company.companyId;
                  return (
                    <tr key={comp.companyId} className={isPlayer ? 'bg-blue-950/30' : 'text-slate-300'}>
                      <td className="py-2.5 font-sans flex items-center space-x-1.5">
                        {isPlayer && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
                        <span className={isPlayer ? 'text-blue-300 font-bold' : ''}>{comp.companyName}</span>
                      </td>
                      <td className="py-2.5 font-sans text-slate-400 capitalize text-[11px]">{comp.aiArchetype || 'Human Team'}</td>
                      <td className="py-2.5 text-right">${comp.stockPrice.toFixed(2)}</td>
                      <td className="py-2.5 text-right">${(comp.marketCap / 1_000_000).toFixed(1)}M</td>
                      <td className="py-2.5 text-right">${(comp.incomeStatement.revenue / 1_000_000).toFixed(2)}M</td>
                      <td className={`py-2.5 text-right font-medium ${comp.incomeStatement.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${(comp.incomeStatement.netIncome / 1_000).toFixed(0)}k
                      </td>
                      <td className="py-2.5 text-center font-sans">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {comp.creditRating}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-bold text-amber-400">
                        {comp.scorecard.totalScore}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
