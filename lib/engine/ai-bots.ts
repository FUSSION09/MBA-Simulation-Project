import { CompanyDecision, CompanyReport, SimulationState } from './types';

export function generateAiDecision(company: CompanyReport, state: SimulationState): CompanyDecision {
  const archetype = company.aiArchetype || 'balanced';
  const q = state.currentQuarter;

  if (archetype === 'cost_leader') {
    // Apex Dynamics: High production, low prices, heavy automation
    return {
      companyId: company.companyId,
      quarter: q,
      products: {
        economy: {
          price: 38,
          adSpend: 250_000,
          salesForce: 14,
          targetProduction: Math.round(company.plantCapacity * 0.50),
          rdInvestment: 120_000,
        },
        mainstream: {
          price: 76,
          adSpend: 320_000,
          salesForce: 16,
          targetProduction: Math.round(company.plantCapacity * 0.40),
          rdInvestment: 180_000,
        },
        premium: {
          price: 135,
          adSpend: 100_000,
          salesForce: 6,
          targetProduction: Math.round(company.plantCapacity * 0.10),
          rdInvestment: 80_000,
        },
      },
      operations: {
        capacityExpansion: 15_000,
        automationLevel: Math.min(9, company.automationLevel + 1),
        tqmSpend: 140_000,
        esgSpend: 50_000,
      },
      hr: {
        salaryIncreasePct: 2.5,
        bonusPool: 40_000,
        trainingSpendPerEmployee: 600,
      },
      finance: {
        shortTermLoanChange: 0,
        bondIssueOrRepay: 500_000,
        sharesIssuedOrRepurchased: 0,
        dividendPerShare: 0.10,
      },
    };
  } else if (archetype === 'differentiator') {
    // Novus Tech: Premium pricing, top R&D, heavy ad spend, high ESG
    return {
      companyId: company.companyId,
      quarter: q,
      products: {
        economy: {
          price: 49,
          adSpend: 120_000,
          salesForce: 8,
          targetProduction: Math.round(company.plantCapacity * 0.15),
          rdInvestment: 150_000,
        },
        mainstream: {
          price: 94,
          adSpend: 400_000,
          salesForce: 18,
          targetProduction: Math.round(company.plantCapacity * 0.45),
          rdInvestment: 380_000,
        },
        premium: {
          price: 175,
          adSpend: 550_000,
          salesForce: 20,
          targetProduction: Math.round(company.plantCapacity * 0.40),
          rdInvestment: 650_000,
        },
      },
      operations: {
        capacityExpansion: 8_000,
        automationLevel: Math.min(7, company.automationLevel),
        tqmSpend: 250_000,
        esgSpend: 280_000,
      },
      hr: {
        salaryIncreasePct: 4.5,
        bonusPool: 90_000,
        trainingSpendPerEmployee: 1_200,
      },
      finance: {
        shortTermLoanChange: 0,
        bondIssueOrRepay: 0,
        sharesIssuedOrRepurchased: -200_000, // share buybacks to boost EPS
        dividendPerShare: 0.25,
      },
    };
  } else {
    // Vanguard Industries: Balanced incumbent
    return {
      companyId: company.companyId,
      quarter: q,
      products: {
        economy: {
          price: 44,
          adSpend: 180_000,
          salesForce: 10,
          targetProduction: Math.round(company.plantCapacity * 0.30),
          rdInvestment: 150_000,
        },
        mainstream: {
          price: 85,
          adSpend: 350_000,
          salesForce: 15,
          targetProduction: Math.round(company.plantCapacity * 0.50),
          rdInvestment: 260_000,
        },
        premium: {
          price: 155,
          adSpend: 280_000,
          salesForce: 12,
          targetProduction: Math.round(company.plantCapacity * 0.20),
          rdInvestment: 280_000,
        },
      },
      operations: {
        capacityExpansion: 10_000,
        automationLevel: Math.min(6, company.automationLevel),
        tqmSpend: 150_000,
        esgSpend: 120_000,
      },
      hr: {
        salaryIncreasePct: 3.2,
        bonusPool: 60_000,
        trainingSpendPerEmployee: 850,
      },
      finance: {
        shortTermLoanChange: -100_000, // paying down debt
        bondIssueOrRepay: 0,
        sharesIssuedOrRepurchased: 0,
        dividendPerShare: 0.40,
      },
    };
  }
}
