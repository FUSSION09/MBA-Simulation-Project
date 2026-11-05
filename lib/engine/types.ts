export type MarketSegment = 'economy' | 'mainstream' | 'premium';

export interface ProductDecision {
  price: number;
  adSpend: number;
  salesForce: number;
  targetProduction: number;
  rdInvestment: number;
}

export interface CompanyDecision {
  companyId: string;
  quarter: number;
  products: Record<MarketSegment, ProductDecision>;
  operations: {
    capacityExpansion: number; // additional units of plant capacity to build ($50/unit CAPEX)
    automationLevel: number;   // 1 to 10 scale (each level reduces unit labor cost by 7%)
    tqmSpend: number;          // Total Quality Management spend ($)
    esgSpend: number;          // Environmental, Social & Governance spend ($)
  };
  hr: {
    salaryIncreasePct: number; // e.g. 3.5%
    bonusPool: number;         // ($)
    trainingSpendPerEmployee: number; // ($)
  };
  finance: {
    shortTermLoanChange: number; // borrow (+) or repay (-)
    bondIssueOrRepay: number;    // long-term debt change ($)
    sharesIssuedOrRepurchased: number; // ($) positive = issue new shares, negative = buyback
    dividendPerShare: number;   // ($/share)
  };
}

export interface SegmentMarketResult {
  segment: MarketSegment;
  totalIndustryDemand: number;
  averagePrice: number;
  companyShare: number; // 0 to 1
  unitDemand: number;
  unitsSold: number;
  stockoutUnits: number;
  endingInventory: number;
  revenue: number;
}

export interface IncomeStatement {
  revenue: number;
  cogsMaterials: number;
  cogsLabor: number;
  cogsDepreciation: number;
  cogsInventoryHolding: number;
  totalCogs: number;
  grossProfit: number;
  grossMarginPct: number;
  // Operating Expenses
  rAndDExpense: number;
  marketingExpense: number;
  salesForceExpense: number;
  tqmExpense: number;
  esgExpense: number;
  hrTrainingExpense: number;
  generalAdminExpense: number;
  totalOpex: number;
  operatingIncomeEBIT: number;
  operatingMarginPct: number;
  // Financing & Tax
  interestExpense: number;
  emergencyLoanInterest: number;
  taxableIncome: number;
  incomeTax: number;
  netIncome: number;
  netMarginPct: number;
}

export interface BalanceSheet {
  // Assets
  cash: number;
  accountsReceivable: number;
  inventoryValue: number;
  plantAndEquipmentCost: number;
  accumulatedDepreciation: number;
  netPpe: number;
  totalAssets: number;
  // Liabilities
  accountsPayable: number;
  shortTermDebt: number;
  longTermDebt: number;
  emergencyCreditLine: number;
  totalLiabilities: number;
  // Shareholders Equity
  commonStock: number;
  retainedEarnings: number;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
}

export interface CashFlowStatement {
  operatingCashFlow: number;
  investingCashFlow: number; // CAPEX
  financingCashFlow: number; // Debt, Equity, Dividends
  netCashFlow: number;
  openingCash: number;
  closingCash: number;
}

export interface BalancedScorecard {
  financialScore: number;     // ROE, Net Margin, Debt ratio
  customerScore: number;      // Value proposition, Brand, Quality
  internalProcessScore: number; // Automation, Plant utilization, Stockout rate
  learningGrowthScore: number;  // HR morale, Training, ESG
  totalScore: number;         // 0 - 100
}

export interface CompanyReport {
  companyId: string;
  companyName: string;
  isAi: boolean;
  aiArchetype?: 'cost_leader' | 'differentiator' | 'balanced' | 'human';
  quarter: number;
  stockPrice: number;
  sharesOutstanding: number;
  marketCap: number;
  creditRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'D';
  plantCapacity: number;
  automationLevel: number;
  employeeHeadcount: number;
  employeeMorale: number; // 0 to 100
  brandAwareness: Record<MarketSegment, number>; // 0 to 100
  productQuality: Record<MarketSegment, number>; // 0 to 100
  inventoryUnits: Record<MarketSegment, number>;
  segmentResults: Record<MarketSegment, SegmentMarketResult>;
  incomeStatement: IncomeStatement;
  balanceSheet: BalanceSheet;
  cashFlowStatement: CashFlowStatement;
  scorecard: BalancedScorecard;
  decisionsSubmitted?: CompanyDecision;
}

export interface MacroEnvironment {
  quarter: number;
  year: number;
  quarterLabel: string; // e.g. "Year 1 - Q1"
  gdpGrowthPct: number; // e.g. 2.5%
  benchmarkInterestRate: number; // e.g. 4.0%
  inflationPct: number; // e.g. 3.0%
  segmentDemandBase: Record<MarketSegment, number>;
  dilemmaPrompt?: {
    id: string;
    title: string;
    description: string;
    options: {
      id: string;
      label: string;
      cost: number;
      impactSummary: string;
      statChanges: Partial<Record<string, number>>;
    }[];
  };
}

export interface SimulationState {
  gameId: string;
  gameMode: 'solo' | 'multiplayer';
  status: 'active' | 'completed';
  currentQuarter: number;
  maxQuarters: number;
  macro: MacroEnvironment;
  companies: Record<string, CompanyReport>;
  history: Record<number, {
    macro: MacroEnvironment;
    companies: Record<string, CompanyReport>;
  }>;
}
