'use client';

import React from 'react';
import { CompanyReport, MacroEnvironment, MarketSegment } from '@/lib/engine/types';
import { BarChart2, Globe2, ShieldCheck, Zap, Info, TrendingUp, Users2 } from 'lucide-react';

interface MarketIntelTabProps {
  currentCompany: CompanyReport;
  allCompanies: Record<string, CompanyReport>;
  macro: MacroEnvironment;
}

export const MarketIntelTab: React.FC<MarketIntelTabProps> = ({
  currentCompany,
  allCompanies,
  macro,
}) => {
  const companiesList = Object.values(allCompanies);
  const segments: MarketSegment[] = ['economy', 'mainstream', 'premium'];

  return (
    <div className="space-y-6">
      {/* Macro Outlook & Sector Demand Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <Globe2 className="w-4 h-4 text-blue-400" />
            <span>Macroeconomic Climate & Industry Total Demand</span>
          </h2>
          <div className="text-xs text-slate-400 mt-0.5">
            Real GDP Growth: <strong className="text-slate-200">+{macro.gdpGrowthPct}%</strong> • 
            Benchmark Interest Rate: <strong className="text-slate-200">{macro.benchmarkInterestRate}%</strong> • 
            Inflation Rate: <strong className="text-slate-200">{macro.inflationPct}%</strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-sans">Economy: </span>
            <span className="text-emerald-400 font-bold">{macro.segmentDemandBase.economy.toLocaleString()} units</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-sans">Mainstream: </span>
            <span className="text-blue-400 font-bold">{macro.segmentDemandBase.mainstream.toLocaleString()} units</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-sans">Premium: </span>
            <span className="text-purple-400 font-bold">{macro.segmentDemandBase.premium.toLocaleString()} units</span>
          </div>
        </div>
      </div>

      {/* Segment Market Share Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {segments.map((seg) => {
          const avgPrice = currentCompany.segmentResults[seg]?.averagePrice || 0;
          return (
            <div key={seg} className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="font-bold text-sm capitalize text-slate-100">{seg} Market</span>
                  <div className="text-[11px] text-slate-400">Industry Avg Price: ${avgPrice}</div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {macro.segmentDemandBase[seg].toLocaleString()} units
                </span>
              </div>

              <div className="space-y-3">
                {companiesList.map((comp) => {
                  const segResult = comp.segmentResults[seg];
                  const sharePct = segResult ? Math.round(segResult.companyShare * 100) : 0;
                  const isPlayer = comp.companyId === currentCompany.companyId;

                  return (
                    <div key={comp.companyId} className="text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-medium flex items-center space-x-1.5 ${isPlayer ? 'text-blue-400 font-bold' : 'text-slate-300'}`}>
                          <span>{comp.companyName}</span>
                          {isPlayer && <span className="text-[10px] bg-blue-900/50 text-blue-300 px-1 rounded">(You)</span>}
                        </span>
                        <span className="font-mono text-slate-200 font-semibold">{sharePct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isPlayer ? 'bg-blue-500' : 'bg-slate-500'
                          }`}
                          style={{ width: `${Math.min(100, sharePct)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Sold: {segResult?.unitsSold.toLocaleString()} units</span>
                        {segResult?.stockoutUnits > 0 ? (
                          <span className="text-rose-400 font-medium">Lost {segResult.stockoutUnits.toLocaleString()} units (Stockout)</span>
                        ) : (
                          <span className="text-slate-500">Inv: {segResult?.endingInventory.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Competitor Capabilities & Strategic Profiles */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
          <BarChart2 className="w-4 h-4 text-purple-400" />
          <span>Competitor Intelligence & Benchmark Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2.5 font-medium">Enterprise</th>
                <th className="pb-2.5 font-medium">Strategic Focus</th>
                <th className="pb-2.5 font-medium text-center">Plant Capacity</th>
                <th className="pb-2.5 font-medium text-center">Automation Level</th>
                <th className="pb-2.5 font-medium text-center">Workforce Morale</th>
                <th className="pb-2.5 font-medium text-center">Brand Awareness (E/M/P)</th>
                <th className="pb-2.5 font-medium text-center">Product Quality (E/M/P)</th>
                <th className="pb-2.5 font-medium text-center">Credit Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {companiesList.map((comp) => {
                const isPlayer = comp.companyId === currentCompany.companyId;
                return (
                  <tr key={comp.companyId} className={isPlayer ? 'bg-blue-950/30' : 'text-slate-300'}>
                    <td className="py-2.5 font-sans font-medium flex items-center space-x-2">
                      {isPlayer && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                      <span className={isPlayer ? 'text-blue-300 font-bold' : ''}>{comp.companyName}</span>
                    </td>
                    <td className="py-2.5 font-sans text-slate-400 capitalize">
                      {comp.aiArchetype === 'cost_leader' ? 'Cost Leader (Low Cost/Scale)' :
                       comp.aiArchetype === 'differentiator' ? 'Premium Innovator (High R&D)' :
                       comp.aiArchetype === 'balanced' ? 'Balanced Incumbent' : 'Human Executive Team'}
                    </td>
                    <td className="py-2.5 text-center text-slate-200">{(comp.plantCapacity / 1_000).toFixed(0)}k units</td>
                    <td className="py-2.5 text-center text-emerald-400 font-semibold">Lvl {comp.automationLevel}</td>
                    <td className="py-2.5 text-center text-amber-300">{comp.employeeMorale}%</td>
                    <td className="py-2.5 text-center text-blue-300">
                      {comp.brandAwareness.economy}% / {comp.brandAwareness.mainstream}% / {comp.brandAwareness.premium}%
                    </td>
                    <td className="py-2.5 text-center text-purple-300">
                      {comp.productQuality.economy} / {comp.productQuality.mainstream} / {comp.productQuality.premium}
                    </td>
                    <td className="py-2.5 text-center font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {comp.creditRating}
                      </span>
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
