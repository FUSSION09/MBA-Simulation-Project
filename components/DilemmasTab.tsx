'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CompanyReport } from '@/lib/engine/types';
import { DILEMMAS_BY_QUARTER, DilemmaChoice } from '@/lib/engine/dilemmas';
import { AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';

interface DilemmasTabProps {
  quarter: number;
  company: CompanyReport;
  onSelectChoice: (choice: DilemmaChoice) => void;
  selectedChoiceId?: string;
}

export const DilemmasTab: React.FC<DilemmasTabProps> = ({
  quarter,
  company,
  onSelectChoice,
  selectedChoiceId,
}) => {
  const dilemma = DILEMMAS_BY_QUARTER[quarter] || DILEMMAS_BY_QUARTER[1];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-amber-400 font-semibold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Quarter {quarter} Strategic Case Dilemma • {dilemma.context}</span>
        </div>

        <h2 className="text-base sm:text-xl font-bold text-slate-100">{dilemma.title}</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 sm:p-4 rounded-xl border border-slate-800/80">
          {dilemma.description}
        </p>

        <div className="pt-2">
          <h3 className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Select Your Executive Course of Action:
          </h3>

          <div className="space-y-3">
            {dilemma.options.map((opt) => {
              const isSelected = selectedChoiceId === opt.id;
              return (
                <motion.div
                  key={opt.id}
                  onClick={() => onSelectChoice(opt)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`min-h-[56px] p-3.5 sm:p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-950/50 border-blue-500 ring-1 ring-blue-500/50 shadow-sm'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-600'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-100">{opt.label}</h4>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-300 pl-6 leading-relaxed">
                      {opt.impactSummary}
                    </p>
                  </div>

                  <div className="text-left sm:text-right pl-6 sm:pl-0 shrink-0">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {opt.cost > 0 ? `-$${(opt.cost / 1_000).toFixed(0)}k upfront` : 'No direct cost'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
