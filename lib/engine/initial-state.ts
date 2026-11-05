import { CompanyReport, MacroEnvironment, MarketSegment, SimulationState } from './types';

export const INITIAL_MACRO: MacroEnvironment = {
  quarter: 1,
  year: 1,
  quarterLabel: 'Year 1 - Q1',
  gdpGrowthPct: 2.8,
  benchmarkInterestRate: 4.5,
  inflationPct: 2.5,
  segmentDemandBase: {
    economy: 120_000,
    mainstream: 160_000,
    premium: 70_000,
  },
  dilemmaPrompt: {
    id: 'dilemma-q1',
    title: 'Supply Chain Sourcing Dilemma',
    description: 'A major component supplier offers a 15% discount on raw materials if you commit to a 2-year exclusive contract, but their ESG rating is low and lead times may fluctuate.',
    options: [
      {
        id: 'opt_discount',
        label: 'Accept the discounted contract',
        cost: 0,
        impactSummary: 'Reduces raw materials cost by 10%, but ESG score drops by 8 points and risk of stockout increases.',
        statChanges: { esgPenalty: 8, materialCostDiscount: 0.10 }
      },
      {
        id: 'opt_sustainable',
        label: 'Partner with a certified green domestic supplier',
        cost: 250_000,
        impactSummary: 'Costs $250k upfront, but boosts brand reputation & ESG score by 12 points across premium customers.',
        statChanges: { esgBonus: 12, brandBonus: 5 }
      },
      {
        id: 'opt_status_quo',
        label: 'Maintain current multi-vendor roster',
        cost: 0,
        impactSummary: 'No change in cost or ESG. Standard operational stability.',
        statChanges: {}
      }
    ]
  }
};

export function createInitialCompany(id: string, name: string, isAi: boolean, archetype: CompanyReport['aiArchetype'] = 'balanced'): CompanyReport {
  return {
    companyId: id,
    companyName: name,
    isAi,
    aiArchetype: archetype,
    quarter: 1,
    stockPrice: 25.00,
    sharesOutstanding: 1_000_000,
    marketCap: 25_000_000,
    creditRating: 'A',
    plantCapacity: 90_000,
    automationLevel: 4,
    employeeHeadcount: 180,
    employeeMorale: 75,
    brandAwareness: {
      economy: 60,
      mainstream: 65,
      premium: 50,
    },
    productQuality: {
      economy: 55,
      mainstream: 70,
      premium: 80,
    },
    inventoryUnits: {
      economy: 5_000,
      mainstream: 8_000,
      premium: 2_000,
    },
    segmentResults: {
      economy: {
        segment: 'economy',
        totalIndustryDemand: 120_000,
        averagePrice: 45,
        companyShare: 0.25,
        unitDemand: 30_000,
        unitsSold: 30_000,
        stockoutUnits: 0,
        endingInventory: 5_000,
        revenue: 1_350_000,
      },
      mainstream: {
        segment: 'mainstream',
        totalIndustryDemand: 160_000,
        averagePrice: 85,
        companyShare: 0.25,
        unitDemand: 40_000,
        unitsSold: 40_000,
        stockoutUnits: 0,
        endingInventory: 8_000,
        revenue: 3_400_000,
      },
      premium: {
        segment: 'premium',
        totalIndustryDemand: 70_000,
        averagePrice: 150,
        companyShare: 0.25,
        unitDemand: 17_500,
        unitsSold: 17_500,
        stockoutUnits: 0,
        endingInventory: 2_000,
        revenue: 2_625_000,
      },
    },
    incomeStatement: {
      revenue: 7_375_000,
      cogsMaterials: 2_400_000,
      cogsLabor: 1_850_000,
      cogsDepreciation: 375_000,
      cogsInventoryHolding: 75_000,
      totalCogs: 4_700_000,
      grossProfit: 2_675_000,
      grossMarginPct: 36.27,
      rAndDExpense: 450_000,
      marketingExpense: 600_000,
      salesForceExpense: 350_000,
      tqmExpense: 100_000,
      esgExpense: 75_000,
      hrTrainingExpense: 120_000,
      generalAdminExpense: 300_000,
      totalOpex: 1_995_000,
      operatingIncomeEBIT: 680_000,
      operatingMarginPct: 9.22,
      interestExpense: 60_000,
      emergencyLoanInterest: 0,
      taxableIncome: 620_000,
      incomeTax: 130_200, // 21%
      netIncome: 489_800,
      netMarginPct: 6.64,
    },
    balanceSheet: {
      cash: 4_500_000,
      accountsReceivable: 1_800_000,
      inventoryValue: 1_200_000,
      plantAndEquipmentCost: 15_000_000,
      accumulatedDepreciation: 3_750_000,
      netPpe: 11_250_000,
      totalAssets: 18_750_000,
      accountsPayable: 1_200_000,
      shortTermDebt: 500_000,
      longTermDebt: 3_500_000,
      emergencyCreditLine: 0,
      totalLiabilities: 5_200_000,
      commonStock: 10_000_000,
      retainedEarnings: 3_550_000,
      totalEquity: 13_550_000,
      totalLiabilitiesAndEquity: 18_750_000,
    },
    cashFlowStatement: {
      operatingCashFlow: 820_000,
      investingCashFlow: -350_000,
      financingCashFlow: -150_000,
      netCashFlow: 320_000,
      openingCash: 4_180_000,
      closingCash: 4_500_000,
    },
    scorecard: {
      financialScore: 78,
      customerScore: 72,
      internalProcessScore: 75,
      learningGrowthScore: 74,
      totalScore: 74.8,
    },
  };
}

export function createInitialSimulation(gameMode: 'solo' | 'multiplayer' = 'solo'): SimulationState {
  const player = createInitialCompany('player-company', 'Vertex Enterprises', false, 'human');
  const ai1 = createInitialCompany('ai-apex', 'Apex Dynamics (Cost Leader)', true, 'cost_leader');
  const ai2 = createInitialCompany('ai-novus', 'Novus Tech (Premium Innovator)', true, 'differentiator');
  const ai3 = createInitialCompany('ai-vanguard', 'Vanguard Industries (Incumbent)', true, 'balanced');

  const companies = {
    [player.companyId]: player,
    [ai1.companyId]: ai1,
    [ai2.companyId]: ai2,
    [ai3.companyId]: ai3,
  };

  return {
    gameId: 'sim-' + Math.random().toString(36).substring(2, 9),
    gameMode,
    status: 'active',
    currentQuarter: 1,
    maxQuarters: 8,
    macro: INITIAL_MACRO,
    companies,
    history: {
      1: {
        macro: INITIAL_MACRO,
        companies: JSON.parse(JSON.stringify(companies)),
      }
    }
  };
}
