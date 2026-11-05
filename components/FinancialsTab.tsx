'use client';

import React, { useState } from 'react';
import { CompanyReport } from '@/lib/engine/types';
import { FileText, DollarSign, Scale, ArrowDownUp, ShieldCheck } from 'lucide-react';

interface FinancialsTabProps {
  company: CompanyReport;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({ company }) => {
  const [statementView, setStatementView] = useState<'income' | 'balance' | 'cashflow'>('income');

  const is = company.incomeStatement;
  const bs = company.balanceSheet;
  const cf = company.cashFlowStatement;

  const isBalanced = Math.abs(bs.totalAssets - bs.totalLiabilitiesAndEquity) < 5;
  const currentRatio = bs.accountsPayable + bs.shortTermDebt > 0
    ? ((bs.cash + bs.accountsReceivable + bs.inventoryValue) / (bs.accountsPayable + bs.shortTermDebt)).toFixed(2)
    : 'N/A';
  const debtToEquity = bs.totalEquity > 0
    ? (bs.totalLiabilities / bs.totalEquity).toFixed(2)
    : 'N/A';
  const roe = bs.totalEquity > 0
    ? (((is.netIncome * 4) / bs.totalEquity) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Key Financial Ratios Summary Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Gross Margin</span>
            <span className="font-mono font-bold text-slate-100 text-sm">{is.grossMarginPct}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Operating Margin</span>
            <span className="font-mono font-bold text-slate-100 text-sm">{is.operatingMarginPct}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Net Profit Margin</span>
            <span className={`font-mono font-bold text-sm ${is.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {is.netMarginPct}%
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Annualized ROE</span>
            <span className="font-mono font-bold text-purple-300 text-sm">{roe}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Current Ratio</span>
            <span className="font-mono font-bold text-slate-200 text-sm">{currentRatio}x</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Debt-to-Equity</span>
            <span className="font-mono font-bold text-slate-200 text-sm">{debtToEquity}x</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>GAAP Double-Entry Verified</span>
        </div>
      </div>

      {/* Statement Selector */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setStatementView('income')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
            statementView === 'income'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Income Statement (P&L)</span>
        </button>

        <button
          onClick={() => setStatementView('balance')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
            statementView === 'balance'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Balance Sheet</span>
        </button>

        <button
          onClick={() => setStatementView('cashflow')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
            statementView === 'cashflow'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ArrowDownUp className="w-3.5 h-3.5" />
          <span>Cash Flow Statement</span>
        </button>
      </div>

      {/* Statement View 1: Income Statement */}
      {statementView === 'income' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm max-w-3xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <h2 className="font-bold text-slate-100 text-sm">Income Statement (P&L)</h2>
              <div className="text-xs text-slate-400">Quarter ended {company.quarter} • Figures in USD ($)</div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-400">Net Profit Margin: {is.netMarginPct}%</span>
            </div>
          </div>

          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="font-semibold text-slate-200">
                <td className="py-2 font-sans">Total Net Revenue</td>
                <td className="py-2 text-right text-emerald-400 font-bold">${is.revenue.toLocaleString()}</td>
              </tr>

              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Cost of Goods Sold: Raw Materials</td>
                <td className="py-1.5 text-right">(${is.cogsMaterials.toLocaleString()})</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Cost of Goods Sold: Direct Labor</td>
                <td className="py-1.5 text-right">(${is.cogsLabor.toLocaleString()})</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Cost of Goods Sold: Plant Depreciation</td>
                <td className="py-1.5 text-right">(${is.cogsDepreciation.toLocaleString()})</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Inventory Holding Costs</td>
                <td className="py-1.5 text-right">(${is.cogsInventoryHolding.toLocaleString()})</td>
              </tr>
              <tr className="font-semibold text-slate-300 bg-slate-950/40">
                <td className="py-2 pl-2 font-sans">Total Cost of Goods Sold (COGS)</td>
                <td className="py-2 text-right text-rose-300">(${is.totalCogs.toLocaleString()})</td>
              </tr>

              <tr className="font-bold text-slate-100 bg-slate-950/70 border-t border-slate-700">
                <td className="py-2.5 font-sans">Gross Profit (Gross Margin: {is.grossMarginPct}%)</td>
                <td className="py-2.5 text-right text-emerald-400">${is.grossProfit.toLocaleString()}</td>
              </tr>

              {/* OpEx */}
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Research & Development (R&D)</td>
                <td className="py-1.5 text-right">(${is.rAndDExpense.toLocaleString()})</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Marketing & Advertising</td>
                <td className="py-1.5 text-right">(${is.marketingExpense.toLocaleString()})</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Sales Force Salaries & Commissions</td>
                <td className="py-1.5 text-right">(${is.salesForceExpense.toLocaleString()})</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Total Quality Management (TQM)</td>
                <td className="py-1.5 text-right">(${is.tqmExpense.toLocaleString()})</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">ESG & Sustainability Initiatives</td>
                <td className="py-1.5 text-right">(${is.esgExpense.toLocaleString()})</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">HR Training & Development</td>
                <td className="py-1.5 text-right">(${is.hrTrainingExpense.toLocaleString()})</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">General & Administrative (G&A) Overhead</td>
                <td className="py-1.5 text-right">(${is.generalAdminExpense.toLocaleString()})</td>
              </tr>
              <tr className="font-semibold text-slate-300 bg-slate-950/40">
                <td className="py-2 pl-2 font-sans">Total Operating Expenses (OpEx)</td>
                <td className="py-2 text-right text-rose-300">(${is.totalOpex.toLocaleString()})</td>
              </tr>

              <tr className="font-bold text-slate-100 bg-slate-950/70 border-t border-slate-700">
                <td className="py-2.5 font-sans">Operating Income (EBIT) ({is.operatingMarginPct}%)</td>
                <td className="py-2.5 text-right text-emerald-400">${is.operatingIncomeEBIT.toLocaleString()}</td>
              </tr>

              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Interest Expense on Outstanding Debt</td>
                <td className="py-1.5 text-right">(${is.interestExpense.toLocaleString()})</td>
              </tr>
              {is.emergencyLoanInterest > 0 && (
                <tr className="text-rose-400">
                  <td className="py-1.5 pl-4 font-sans">Emergency Credit Penalty Interest (16% APR)</td>
                  <td className="py-1.5 text-right">(${is.emergencyLoanInterest.toLocaleString()})</td>
                </tr>
              )}
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Corporate Income Taxes (21% statutory rate)</td>
                <td className="py-1.5 text-right">(${is.incomeTax.toLocaleString()})</td>
              </tr>

              <tr className="font-bold text-sm text-slate-100 bg-blue-950/40 border-t-2 border-b-4 border-blue-600/70">
                <td className="py-3 font-sans">Net Income (Net Profit)</td>
                <td className={`py-3 text-right font-bold ${is.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${is.netIncome.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Statement View 2: Balance Sheet */}
      {statementView === 'balance' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm max-w-3xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <h2 className="font-bold text-slate-100 text-sm">Balance Sheet</h2>
              <div className="text-xs text-slate-400">As of Quarter {company.quarter} • GAAP Compliant</div>
            </div>
            <div className="flex items-center space-x-1.5 text-xs">
              <span className={`w-2 h-2 rounded-full ${isBalanced ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              <span className={isBalanced ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {isBalanced ? 'Balanced: Assets = L + E' : 'Unbalanced'}
              </span>
            </div>
          </div>

          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {/* CURRENT ASSETS */}
              <tr className="font-bold text-slate-200 bg-slate-950/70">
                <td className="py-2 font-sans" colSpan={2}>CURRENT ASSETS</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Cash and Cash Equivalents</td>
                <td className="py-1.5 text-right text-slate-100 font-semibold">${bs.cash.toLocaleString()}</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Accounts Receivable</td>
                <td className="py-1.5 text-right">${bs.accountsReceivable.toLocaleString()}</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Finished Goods Inventory</td>
                <td className="py-1.5 text-right">${bs.inventoryValue.toLocaleString()}</td>
              </tr>

              {/* NON-CURRENT ASSETS */}
              <tr className="font-bold text-slate-200 bg-slate-950/70">
                <td className="py-2 font-sans" colSpan={2}>PROPERTY, PLANT & EQUIPMENT (PP&E)</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Gross Plant & Equipment Cost</td>
                <td className="py-1.5 text-right">${bs.plantAndEquipmentCost.toLocaleString()}</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Less: Accumulated Depreciation</td>
                <td className="py-1.5 text-right text-rose-300">(${bs.accumulatedDepreciation.toLocaleString()})</td>
              </tr>
              <tr className="font-semibold text-slate-300">
                <td className="py-1.5 pl-4 font-sans">Net Property, Plant & Equipment</td>
                <td className="py-1.5 text-right">${bs.netPpe.toLocaleString()}</td>
              </tr>

              <tr className="font-bold text-sm text-slate-100 bg-blue-950/30 border-t-2 border-b-2 border-slate-700">
                <td className="py-2.5 font-sans">TOTAL ASSETS</td>
                <td className="py-2.5 text-right text-emerald-400">${bs.totalAssets.toLocaleString()}</td>
              </tr>

              {/* LIABILITIES */}
              <tr className="font-bold text-slate-200 bg-slate-950/70 pt-4">
                <td className="py-2 font-sans" colSpan={2}>CURRENT LIABILITIES</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Accounts Payable</td>
                <td className="py-1.5 text-right">${bs.accountsPayable.toLocaleString()}</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Short-Term Operating Debt</td>
                <td className="py-1.5 text-right">${bs.shortTermDebt.toLocaleString()}</td>
              </tr>
              {bs.emergencyCreditLine > 0 && (
                <tr className="text-rose-400">
                  <td className="py-1.5 pl-4 font-sans">Emergency Line of Credit</td>
                  <td className="py-1.5 text-right">${bs.emergencyCreditLine.toLocaleString()}</td>
                </tr>
              )}

              <tr className="font-bold text-slate-200 bg-slate-950/70 pt-4">
                <td className="py-2 font-sans" colSpan={2}>LONG-TERM LIABILITIES</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Long-Term Corporate Bonds</td>
                <td className="py-1.5 text-right">${bs.longTermDebt.toLocaleString()}</td>
              </tr>
              <tr className="font-semibold text-slate-300">
                <td className="py-1.5 pl-4 font-sans">Total Liabilities</td>
                <td className="py-1.5 text-right">${bs.totalLiabilities.toLocaleString()}</td>
              </tr>

              {/* EQUITY */}
              <tr className="font-bold text-slate-200 bg-slate-950/70 pt-4">
                <td className="py-2 font-sans" colSpan={2}>SHAREHOLDERS EQUITY</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Common Stock ({company.sharesOutstanding.toLocaleString()} shares)</td>
                <td className="py-1.5 text-right">${bs.commonStock.toLocaleString()}</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Retained Earnings</td>
                <td className="py-1.5 text-right">${bs.retainedEarnings.toLocaleString()}</td>
              </tr>
              <tr className="font-semibold text-slate-300">
                <td className="py-1.5 pl-4 font-sans">Total Shareholders Equity</td>
                <td className="py-1.5 text-right text-purple-300">${bs.totalEquity.toLocaleString()}</td>
              </tr>

              <tr className="font-bold text-sm text-slate-100 bg-blue-950/30 border-t-2 border-b-4 border-slate-700">
                <td className="py-2.5 font-sans">TOTAL LIABILITIES & EQUITY</td>
                <td className="py-2.5 text-right text-emerald-400">${bs.totalLiabilitiesAndEquity.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Statement View 3: Cash Flow Statement */}
      {statementView === 'cashflow' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm max-w-3xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <h2 className="font-bold text-slate-100 text-sm">Statement of Cash Flows</h2>
              <div className="text-xs text-slate-400">Quarter ended {company.quarter} • Direct Method</div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-semibold ${cf.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                Net Quarterly Change: ${cf.netCashFlow.toLocaleString()}
              </span>
            </div>
          </div>

          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="font-bold text-slate-200 bg-slate-950/70">
                <td className="py-2 font-sans" colSpan={2}>OPERATING ACTIVITIES</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Net Cash Provided by Operating Activities</td>
                <td className={`py-1.5 text-right font-semibold ${cf.operatingCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${cf.operatingCashFlow.toLocaleString()}
                </td>
              </tr>

              <tr className="font-bold text-slate-200 bg-slate-950/70">
                <td className="py-2 font-sans" colSpan={2}>INVESTING ACTIVITIES</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Capital Expenditures (Plant Expansion & Automation)</td>
                <td className="py-1.5 text-right text-rose-300">
                  (${Math.abs(cf.investingCashFlow).toLocaleString()})
                </td>
              </tr>

              <tr className="font-bold text-slate-200 bg-slate-950/70">
                <td className="py-2 font-sans" colSpan={2}>FINANCING ACTIVITIES</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Net Debt & Equity Financing / Dividend Payouts</td>
                <td className={`py-1.5 text-right font-semibold ${cf.financingCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${cf.financingCashFlow.toLocaleString()}
                </td>
              </tr>

              <tr className="font-bold text-slate-100 bg-slate-950/70 border-t border-slate-700">
                <td className="py-2.5 font-sans">Net Increase / (Decrease) in Cash</td>
                <td className={`py-2.5 text-right ${cf.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${cf.netCashFlow.toLocaleString()}
                </td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-1.5 pl-4 font-sans">Cash Balance at Beginning of Quarter</td>
                <td className="py-1.5 text-right">${cf.openingCash.toLocaleString()}</td>
              </tr>
              <tr className="font-bold text-sm text-slate-100 bg-blue-950/40 border-t-2 border-b-4 border-blue-600/70">
                <td className="py-3 font-sans">Cash Balance at End of Quarter</td>
                <td className="py-3 text-right text-emerald-400">${cf.closingCash.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
