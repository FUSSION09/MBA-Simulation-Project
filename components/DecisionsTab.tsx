'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CompanyDecision, CompanyReport, MarketSegment } from '@/lib/engine/types';
import { FactoryApparatus3D } from './FactoryApparatus3D';
import {
  DollarSign,
  Tag,
  Factory,
  Cpu,
  Users,
  Landmark,
  AlertCircle,
  RotateCcw,
  Plus,
  Minus
} from 'lucide-react';

interface DecisionsTabProps {
  company: CompanyReport;
  decisions: CompanyDecision;
  onChange: (updated: CompanyDecision) => void;
  onReset: () => void;
}

export const DecisionsTab: React.FC<DecisionsTabProps> = ({
  company,
  decisions,
  onChange,
  onReset,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'marketing' | 'operations' | 'hr' | 'finance'>('marketing');

  const totalProduction =
    decisions.products.economy.targetProduction +
    decisions.products.mainstream.targetProduction +
    decisions.products.premium.targetProduction;

  const capacityUtilization = Math.round((totalProduction / company.plantCapacity) * 100);
  const isOvertime = totalProduction > company.plantCapacity;

  const totalAdSpend =
    decisions.products.economy.adSpend +
    decisions.products.mainstream.adSpend +
    decisions.products.premium.adSpend;

  const totalRdSpend =
    decisions.products.economy.rdInvestment +
    decisions.products.mainstream.rdInvestment +
    decisions.products.premium.rdInvestment;

  const estimatedRevenue =
    decisions.products.economy.targetProduction * decisions.products.economy.price +
    decisions.products.mainstream.targetProduction * decisions.products.mainstream.price +
    decisions.products.premium.targetProduction * decisions.products.premium.price;

  const updateProduct = (seg: MarketSegment, field: keyof CompanyDecision['products'][MarketSegment], val: number) => {
    onChange({
      ...decisions,
      products: {
        ...decisions.products,
        [seg]: {
          ...decisions.products[seg],
          [field]: val,
        },
      },
    });
  };

  const updateOperations = (field: keyof CompanyDecision['operations'], val: number) => {
    onChange({
      ...decisions,
      operations: {
        ...decisions.operations,
        [field]: val,
      },
    });
  };

  const updateHr = (field: keyof CompanyDecision['hr'], val: number) => {
    onChange({
      ...decisions,
      hr: {
        ...decisions.hr,
        [field]: val,
      },
    });
  };

  const updateFinance = (field: keyof CompanyDecision['finance'], val: number) => {
    onChange({
      ...decisions,
      finance: {
        ...decisions.finance,
        [field]: val,
      },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Live Projected Operational Summary Strip */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Scheduled Prod</span>
            <span className="font-mono font-bold text-slate-100 text-sm sm:text-base">{totalProduction.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Plant Utilization</span>
            <span className={`font-mono font-bold text-sm sm:text-base ${capacityUtilization > 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {capacityUtilization}%
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Est. Revenue</span>
            <span className="font-mono font-bold text-sm sm:text-base text-blue-400">${(estimatedRevenue / 1_000_000).toFixed(2)}M</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Ad & R&D Budget</span>
            <span className="font-mono font-bold text-sm sm:text-base text-purple-400">${((totalAdSpend + totalRdSpend) / 1_000).toFixed(0)}k</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex justify-between items-center text-xs">
          <span className="text-slate-400 text-[11px]">Factory Base: {company.plantCapacity.toLocaleString()} units</span>
          <button
            onClick={onReset}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center space-x-1 cursor-pointer transition min-h-[36px] px-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* C-Suite Sub-navigation Tabs (Scrollable on small phones) */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 border-b border-slate-800">
        {[
          { id: 'marketing', label: 'Marketing (CMO)', icon: Tag },
          { id: 'operations', label: 'Operations (COO)', icon: Factory },
          { id: 'hr', label: 'Workforce (CHRO)', icon: Users },
          { id: 'finance', label: 'Treasury (CFO)', icon: Landmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`relative min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shrink-0 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSubTabPill"
                  className="absolute inset-0 bg-blue-600 rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overtime Alert with AnimatePresence */}
      <AnimatePresence>
        {isOvertime && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="bg-amber-950/40 border border-amber-800/80 text-amber-300 rounded-xl p-3 flex items-start space-x-2.5 text-xs"
          >
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Plant Overtime Active: </span>
              {(totalProduction - company.plantCapacity).toLocaleString()} units exceed standard capacity and will incur a 50% overtime labor surcharge.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtab 1: Marketing & Pricing */}
      {activeSubTab === 'marketing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {(['economy', 'mainstream', 'premium'] as MarketSegment[]).map((seg) => {
            const p = decisions.products[seg];
            const benchmark = seg === 'economy' ? { price: '$38 - $48', desc: 'Price Elastic • Volume Driven' }
                            : seg === 'mainstream' ? { price: '$78 - $95', desc: 'Balanced Quality & Price' }
                            : { price: '$140 - $185', desc: 'High Quality & Brand Brand' };

            return (
              <div key={seg} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm capitalize text-slate-100">{seg} Line</span>
                    <span className="text-[11px] font-mono text-blue-400 font-semibold">{benchmark.price}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{benchmark.desc}</div>
                </div>

                {/* Price */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span>Unit Selling Price</span>
                    <span className="font-bold font-mono text-emerald-400 text-sm">${p.price}</span>
                  </div>
                  <input
                    type="range"
                    min={seg === 'economy' ? 25 : seg === 'mainstream' ? 50 : 90}
                    max={seg === 'economy' ? 70 : seg === 'mainstream' ? 140 : 250}
                    value={p.price}
                    onChange={(e) => updateProduct(seg, 'price', Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* Advertising Spend */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span>Advertising & Brand Spend</span>
                    <span className="font-bold font-mono text-blue-400 text-sm">${(p.adSpend / 1_000).toFixed(0)}k</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={800_000}
                    step={25_000}
                    value={p.adSpend}
                    onChange={(e) => updateProduct(seg, 'adSpend', Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* Sales Force Reps */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span>Sales Force Headcount</span>
                    <span className="font-bold font-mono text-purple-400 text-sm">{p.salesForce} reps</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={p.salesForce}
                    onChange={(e) => updateProduct(seg, 'salesForce', Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                {/* R&D Feature Investment */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span>R&D Product Enhancements</span>
                    <span className="font-bold font-mono text-amber-400 text-sm">${(p.rdInvestment / 1_000).toFixed(0)}k</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={750_000}
                    step={25_000}
                    value={p.rdInvestment}
                    onChange={(e) => updateProduct(seg, 'rdInvestment', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtab 2: Operations & Plant */}
      {activeSubTab === 'operations' && (
        <div className="space-y-4 sm:space-y-5">
          {/* Anatomy-Style Isometric 3D Machine Instrument */}
          <FactoryApparatus3D
            plantCapacity={company.plantCapacity + decisions.operations.capacityExpansion}
            totalProduction={totalProduction}
            automationLevel={decisions.operations.automationLevel}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Production Targets */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Factory className="w-4 h-4 text-cyan-400" />
              <span>Production Targets by Segment</span>
            </h3>

            {(['economy', 'mainstream', 'premium'] as MarketSegment[]).map((seg) => {
              const p = decisions.products[seg];
              return (
                <div key={seg}>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span className="capitalize">{seg} Production</span>
                    <span className="font-bold font-mono text-cyan-400 text-sm">{p.targetProduction.toLocaleString()} units</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={company.plantCapacity}
                    step={1_000}
                    value={p.targetProduction}
                    onChange={(e) => updateProduct(seg, 'targetProduction', Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          {/* Plant Capacity & Automation */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Capacity, Automation & ESG</span>
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Expand Plant Capacity</span>
                <span className="font-bold font-mono text-purple-400 text-sm">+{decisions.operations.capacityExpansion.toLocaleString()} units</span>
              </div>
              <input
                type="range"
                min={0}
                max={40_000}
                step={5_000}
                value={decisions.operations.capacityExpansion}
                onChange={(e) => updateOperations('capacityExpansion', Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 mt-0.5">CAPEX: ${(decisions.operations.capacityExpansion * 55 / 1_000).toFixed(0)}k ($55/unit)</div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Robotics & Automation Level</span>
                <span className="font-bold font-mono text-emerald-400 text-sm">Level {decisions.operations.automationLevel} / 10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={decisions.operations.automationLevel}
                onChange={(e) => updateOperations('automationLevel', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 mt-0.5">Lowers unit labor costs by ~6% per level.</div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>TQM Quality Assurance</span>
                <span className="font-bold font-mono text-amber-400 text-sm">${(decisions.operations.tqmSpend / 1_000).toFixed(0)}k</span>
              </div>
              <input
                type="range"
                min={0}
                max={300_000}
                step={25_000}
                value={decisions.operations.tqmSpend}
                onChange={(e) => updateOperations('tqmSpend', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>ESG & Green Sourcing</span>
                <span className="font-bold font-mono text-teal-400 text-sm">${(decisions.operations.esgSpend / 1_000).toFixed(0)}k</span>
              </div>
              <input
                type="range"
                min={0}
                max={300_000}
                step={25_000}
                value={decisions.operations.esgSpend}
                onChange={(e) => updateOperations('esgSpend', Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Subtab 3: Human Resources */}
      {activeSubTab === 'hr' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4 max-w-2xl">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Workforce Strategy & Training</span>
          </h3>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Salary Raise %</span>
              <span className="font-bold font-mono text-amber-400 text-sm">{decisions.hr.salaryIncreasePct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={decisions.hr.salaryIncreasePct}
              onChange={(e) => updateHr('salaryIncreasePct', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Performance Bonus Pool</span>
              <span className="font-bold font-mono text-emerald-400 text-sm">${(decisions.hr.bonusPool / 1_000).toFixed(0)}k</span>
            </div>
            <input
              type="range"
              min={0}
              max={200_000}
              step={10_000}
              value={decisions.hr.bonusPool}
              onChange={(e) => updateHr('bonusPool', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Training Budget Per Worker</span>
              <span className="font-bold font-mono text-blue-400 text-sm">${decisions.hr.trainingSpendPerEmployee}</span>
            </div>
            <input
              type="range"
              min={0}
              max={2_500}
              step={100}
              value={decisions.hr.trainingSpendPerEmployee}
              onChange={(e) => updateHr('trainingSpendPerEmployee', Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Subtab 4: Finance & Treasury */}
      {activeSubTab === 'finance' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4 max-w-2xl">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Landmark className="w-4 h-4 text-emerald-400" />
            <span>Capital Structure & Treasury</span>
          </h3>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Short-Term Debt Adjustment</span>
              <span className="font-bold font-mono text-blue-400 text-sm">
                {decisions.finance.shortTermLoanChange >= 0 ? '+' : ''}${(decisions.finance.shortTermLoanChange / 1_000).toFixed(0)}k
              </span>
            </div>
            <input
              type="range"
              min={-500_000}
              max={1_500_000}
              step={100_000}
              value={decisions.finance.shortTermLoanChange}
              onChange={(e) => updateFinance('shortTermLoanChange', Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Corporate Bonds Issuance</span>
              <span className="font-bold font-mono text-purple-400 text-sm">
                {decisions.finance.bondIssueOrRepay >= 0 ? '+' : ''}${(decisions.finance.bondIssueOrRepay / 1_000).toFixed(0)}k
              </span>
            </div>
            <input
              type="range"
              min={-1_000_000}
              max={3_000_000}
              step={250_000}
              value={decisions.finance.bondIssueOrRepay}
              onChange={(e) => updateFinance('bondIssueOrRepay', Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Equity (Issue vs Buyback)</span>
              <span className="font-bold font-mono text-amber-400 text-sm">
                {decisions.finance.sharesIssuedOrRepurchased >= 0 ? 'Issue +' : 'Buyback -'}${Math.abs(decisions.finance.sharesIssuedOrRepurchased / 1_000).toFixed(0)}k
              </span>
            </div>
            <input
              type="range"
              min={-1_000_000}
              max={2_000_000}
              step={200_000}
              value={decisions.finance.sharesIssuedOrRepurchased}
              onChange={(e) => updateFinance('sharesIssuedOrRepurchased', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Dividend Per Share</span>
              <span className="font-bold font-mono text-emerald-400 text-sm">${decisions.finance.dividendPerShare.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1.50}
              step={0.05}
              value={decisions.finance.dividendPerShare}
              onChange={(e) => updateFinance('dividendPerShare', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
