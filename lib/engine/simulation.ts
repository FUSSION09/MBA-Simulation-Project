import {
  CompanyDecision,
  CompanyReport,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  BalancedScorecard,
  MacroEnvironment,
  MarketSegment,
  SegmentMarketResult,
  SimulationState
} from './types';

const SEGMENTS: MarketSegment[] = ['economy', 'mainstream', 'premium'];

// Econometric elasticities
const ELASTICITIES = {
  economy: { price: 2.2, quality: 0.8, brand: 0.7, esg: 0.4, baseUnitCost: { mat: 16, labor: 14 } },
  mainstream: { price: 1.5, quality: 1.4, brand: 1.1, esg: 0.8, baseUnitCost: { mat: 32, labor: 24 } },
  premium: { price: 0.9, quality: 2.1, brand: 1.6, esg: 1.3, baseUnitCost: { mat: 60, labor: 42 } },
};

export function simulateQuarter(
  currentState: SimulationState,
  decisionsByCompany: Record<string, CompanyDecision>
): SimulationState {
  const nextQuarter = currentState.currentQuarter + 1;
  const currentMacro = currentState.macro;

  // Advance macro environment slightly
  const nextMacro: MacroEnvironment = {
    quarter: nextQuarter,
    year: Math.ceil(nextQuarter / 4),
    quarterLabel: `Year ${Math.ceil(nextQuarter / 4)} - Q${((nextQuarter - 1) % 4) + 1}`,
    gdpGrowthPct: Math.round((currentMacro.gdpGrowthPct + (Math.sin(nextQuarter) * 0.4)) * 10) / 10,
    benchmarkInterestRate: Math.max(2.5, Math.min(7.0, Math.round((currentMacro.benchmarkInterestRate + (Math.cos(nextQuarter) * 0.25)) * 10) / 10)),
    inflationPct: Math.max(1.5, Math.min(5.5, Math.round((currentMacro.inflationPct + (Math.sin(nextQuarter * 0.5) * 0.2)) * 10) / 10)),
    segmentDemandBase: {
      economy: Math.round(currentMacro.segmentDemandBase.economy * (1 + (currentMacro.gdpGrowthPct * 0.005))),
      mainstream: Math.round(currentMacro.segmentDemandBase.mainstream * (1 + (currentMacro.gdpGrowthPct * 0.008))),
      premium: Math.round(currentMacro.segmentDemandBase.premium * (1 + (currentMacro.gdpGrowthPct * 0.012))),
    },
  };

  const companies = { ...currentState.companies };
  const companyIds = Object.keys(companies);

  // 1. Calculate Product Qualities, Brand Awareness, and Attractiveness for all companies
  type AttractivenessMap = Record<MarketSegment, Record<string, number>>;
  const attractiveness: AttractivenessMap = { economy: {}, mainstream: {}, premium: {} };

  const updatedQualities: Record<string, Record<MarketSegment, number>> = {};
  const updatedBrand: Record<string, Record<MarketSegment, number>> = {};

  for (const cid of companyIds) {
    const prev = companies[cid];
    const dec = decisionsByCompany[cid];
    updatedQualities[cid] = { ...prev.productQuality };
    updatedBrand[cid] = { ...prev.brandAwareness };

    for (const seg of SEGMENTS) {
      const pdec = dec.products[seg];
      // Quality increases with R&D and TQM, decays slightly by 3% if neglected
      const rdBoost = Math.sqrt(pdec.rdInvestment / 10_000) * 1.5;
      const tqmBoost = Math.sqrt(dec.operations.tqmSpend / 15_000) * 0.8;
      updatedQualities[cid][seg] = Math.min(99, Math.max(30, Math.round(prev.productQuality[seg] * 0.97 + rdBoost + tqmBoost)));

      // Brand awareness increases with Ad spend and sales force, decays by 5%
      const adBoost = Math.sqrt(pdec.adSpend / 15_000) * 2.5;
      const sfBoost = Math.sqrt(pdec.salesForce) * 1.2;
      updatedBrand[cid][seg] = Math.min(98, Math.max(20, Math.round(prev.brandAwareness[seg] * 0.95 + adBoost + sfBoost)));

      // Attractiveness Calculation
      const el = ELASTICITIES[seg];
      const benchmarkPrice = seg === 'economy' ? 45 : seg === 'mainstream' ? 85 : 155;
      const priceFactor = Math.pow(Math.max(0.2, benchmarkPrice / Math.max(1, pdec.price)), el.price);
      const qualityFactor = Math.pow(updatedQualities[cid][seg] / 60, el.quality);
      const brandFactor = Math.pow(updatedBrand[cid][seg] / 50, el.brand);
      const esgFactor = Math.pow(1 + (dec.operations.esgSpend / 500_000), el.esg);

      const score = Math.max(0.01, priceFactor * qualityFactor * brandFactor * esgFactor);
      attractiveness[seg][cid] = score;
    }
  }

  // 2. Resolve Market Share and Segment Sales
  const segmentSalesByCompany: Record<string, Record<MarketSegment, SegmentMarketResult>> = {};
  for (const cid of companyIds) {
    segmentSalesByCompany[cid] = {} as Record<MarketSegment, SegmentMarketResult>;
  }

  for (const seg of SEGMENTS) {
    const totalSegDemand = nextMacro.segmentDemandBase[seg];
    const totalAttractiveness = Object.values(attractiveness[seg]).reduce((a, b) => a + b, 0);

    const prices = companyIds.map(cid => decisionsByCompany[cid].products[seg].price);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

    for (const cid of companyIds) {
      const prev = companies[cid];
      const dec = decisionsByCompany[cid];
      const pdec = dec.products[seg];

      const share = totalAttractiveness > 0 ? (attractiveness[seg][cid] / totalAttractiveness) : (1 / companyIds.length);
      const unitDemand = Math.round(totalSegDemand * share);

      // Available units = Beginning Inventory + Target Production
      const beginningInv = prev.inventoryUnits[seg] || 0;
      const availableUnits = beginningInv + Math.max(0, pdec.targetProduction);

      const unitsSold = Math.min(unitDemand, availableUnits);
      const stockoutUnits = Math.max(0, unitDemand - availableUnits);
      const endingInventory = Math.max(0, availableUnits - unitsSold);
      const revenue = unitsSold * pdec.price;

      segmentSalesByCompany[cid][seg] = {
        segment: seg,
        totalIndustryDemand: totalSegDemand,
        averagePrice: avgPrice,
        companyShare: Math.round(share * 1000) / 1000,
        unitDemand,
        unitsSold,
        stockoutUnits,
        endingInventory,
        revenue,
      };
    }
  }

  // 3. Financial Statements and Company Report Updates
  const nextCompanies: Record<string, CompanyReport> = {};

  for (const cid of companyIds) {
    const prev = companies[cid];
    const dec = decisionsByCompany[cid];

    // Capacity & Automation Updates
    const addedCapacity = Math.max(0, dec.operations.capacityExpansion);
    const plantCapacity = prev.plantCapacity + addedCapacity;
    const capex = addedCapacity * 55; // $55 per unit capacity expansion

    // Automation upgrade cost: $200,000 per level
    const autoLevel = Math.max(1, Math.min(10, dec.operations.automationLevel || prev.automationLevel));
    const autoUpgradeCost = Math.max(0, autoLevel - prev.automationLevel) * 200_000;
    const totalCapex = capex + autoUpgradeCost;

    // Production details
    let totalTargetProduction = 0;
    let totalMaterialsCost = 0;
    let totalLaborCost = 0;

    for (const seg of SEGMENTS) {
      const targetProd = Math.max(0, dec.products[seg].targetProduction);
      totalTargetProduction += targetProd;

      const el = ELASTICITIES[seg];
      const unitMatCost = el.baseUnitCost.mat * (1 + nextMacro.inflationPct * 0.01);
      // Labor cost decreases with automation (6% per level above 1)
      const laborDiscount = Math.max(0.4, 1 - (autoLevel - 1) * 0.06);
      const unitLaborCost = el.baseUnitCost.labor * laborDiscount;

      totalMaterialsCost += targetProd * unitMatCost;
      totalLaborCost += targetProd * unitLaborCost;
    }

    // Overtime penalty if production exceeds plant capacity
    if (totalTargetProduction > plantCapacity) {
      const overtimeUnits = totalTargetProduction - plantCapacity;
      const avgLaborCost = totalLaborCost / Math.max(1, totalTargetProduction);
      totalLaborCost += overtimeUnits * avgLaborCost * 0.5; // 50% overtime premium
    }

    // Inventory holding cost ($2.50 per unit ending inventory across all segments)
    const endingInvUnits = {
      economy: segmentSalesByCompany[cid].economy.endingInventory,
      mainstream: segmentSalesByCompany[cid].mainstream.endingInventory,
      premium: segmentSalesByCompany[cid].premium.endingInventory,
    };
    const totalEndingInvCount = endingInvUnits.economy + endingInvUnits.mainstream + endingInvUnits.premium;
    const cogsInventoryHolding = totalEndingInvCount * 2.5;

    // Depreciation: 2.5% per quarter on gross PP&E
    const grossPpe = prev.balanceSheet.plantAndEquipmentCost + totalCapex;
    const cogsDepreciation = Math.round(grossPpe * 0.025);
    const totalAccumDepreciation = prev.balanceSheet.accumulatedDepreciation + cogsDepreciation;
    const netPpe = grossPpe - totalAccumDepreciation;

    // Total COGS
    const totalCogs = Math.round(totalMaterialsCost + totalLaborCost + cogsDepreciation + cogsInventoryHolding);

    // Total Revenue
    const totalRevenue = SEGMENTS.reduce((sum, seg) => sum + segmentSalesByCompany[cid][seg].revenue, 0);
    const grossProfit = totalRevenue - totalCogs;
    const grossMarginPct = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 1000) / 10 : 0;

    // Operating Expenses
    const rAndDExpense = SEGMENTS.reduce((sum, s) => sum + dec.products[s].rdInvestment, 0);
    const marketingExpense = SEGMENTS.reduce((sum, s) => sum + dec.products[s].adSpend, 0);
    const totalSalesForceReps = SEGMENTS.reduce((sum, s) => sum + dec.products[s].salesForce, 0);
    const salesForceExpense = totalSalesForceReps * 24_000;
    const tqmExpense = dec.operations.tqmSpend;
    const esgExpense = dec.operations.esgSpend;
    const hrTrainingExpense = dec.hr.trainingSpendPerEmployee * Math.max(50, prev.employeeHeadcount);
    const generalAdminExpense = 280_000 + Math.round(totalRevenue * 0.015);

    const totalOpex = Math.round(rAndDExpense + marketingExpense + salesForceExpense + tqmExpense + esgExpense + hrTrainingExpense + generalAdminExpense);
    const operatingIncomeEBIT = grossProfit - totalOpex;
    const operatingMarginPct = totalRevenue > 0 ? Math.round((operatingIncomeEBIT / totalRevenue) * 1000) / 10 : 0;

    // Debt & Interest Expense
    const shortTermRate = (nextMacro.benchmarkInterestRate + 1.5) / 100 / 4;
    const longTermRate = 0.068 / 4;
    const emergencyRate = 0.16 / 4;

    const shortTermDebt = Math.max(0, prev.balanceSheet.shortTermDebt + dec.finance.shortTermLoanChange);
    const longTermDebt = Math.max(0, prev.balanceSheet.longTermDebt + dec.finance.bondIssueOrRepay);
    const prevEmergencyDebt = prev.balanceSheet.emergencyCreditLine || 0;

    const interestExpense = Math.round(shortTermDebt * shortTermRate + longTermDebt * longTermRate);
    const emergencyLoanInterest = Math.round(prevEmergencyDebt * emergencyRate);

    const taxableIncome = operatingIncomeEBIT - interestExpense - emergencyLoanInterest;
    const incomeTax = taxableIncome > 0 ? Math.round(taxableIncome * 0.21) : 0;
    const netIncome = taxableIncome - incomeTax;
    const netMarginPct = totalRevenue > 0 ? Math.round((netIncome / totalRevenue) * 1000) / 10 : 0;

    // Cash Flow Calculations
    const deltaAccountsReceivable = Math.round(totalRevenue * 0.22) - prev.balanceSheet.accountsReceivable;
    const deltaAccountsPayable = Math.round((totalMaterialsCost + totalOpex) * 0.18) - prev.balanceSheet.accountsPayable;
    const inventoryVal = Math.round(totalEndingInvCount * 35);
    const deltaInventory = inventoryVal - prev.balanceSheet.inventoryValue;

    const operatingCashFlow = netIncome + cogsDepreciation - deltaAccountsReceivable + deltaAccountsPayable - deltaInventory;
    const investingCashFlow = -totalCapex;

    // Equity and Dividends
    let sharesOutstanding = prev.sharesOutstanding;
    let commonStock = prev.balanceSheet.commonStock;
    if (dec.finance.sharesIssuedOrRepurchased > 0) {
      // Issue shares at current stock price
      const newShares = Math.round(dec.finance.sharesIssuedOrRepurchased / prev.stockPrice);
      sharesOutstanding += newShares;
      commonStock += dec.finance.sharesIssuedOrRepurchased;
    } else if (dec.finance.sharesIssuedOrRepurchased < 0) {
      // Repurchase
      const buybackCost = Math.abs(dec.finance.sharesIssuedOrRepurchased);
      const retiredShares = Math.min(sharesOutstanding * 0.2, Math.round(buybackCost / prev.stockPrice));
      sharesOutstanding -= retiredShares;
      commonStock = Math.max(1_000_000, commonStock - buybackCost);
    }

    const dividendPayout = Math.max(0, dec.finance.dividendPerShare * sharesOutstanding);
    const financingCashFlow = (shortTermDebt - prev.balanceSheet.shortTermDebt) +
                             (longTermDebt - prev.balanceSheet.longTermDebt) +
                             dec.finance.sharesIssuedOrRepurchased - dividendPayout;

    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
    let closingCash = prev.balanceSheet.cash + netCashFlow;

    // Emergency credit line if cash is negative
    let newEmergencyCreditLine = 0;
    if (closingCash < 0) {
      newEmergencyCreditLine = Math.abs(closingCash);
      closingCash = 0;
    }

    // Retained Earnings (Double-entry check)
    const retainedEarnings = prev.balanceSheet.retainedEarnings + netIncome - dividendPayout;
    const totalEquity = commonStock + retainedEarnings;
    const totalLiabilities = shortTermDebt + longTermDebt + (prev.balanceSheet.accountsPayable + deltaAccountsPayable) + newEmergencyCreditLine;
    const totalAssets = closingCash + (prev.balanceSheet.accountsReceivable + deltaAccountsReceivable) + inventoryVal + netPpe;

    // Ensure Balance Sheet balances exactly by aligning AP or AR rounding
    const balanceGap = totalAssets - (totalLiabilities + totalEquity);
    const adjustedAP = (prev.balanceSheet.accountsPayable + deltaAccountsPayable) + balanceGap;
    const finalTotalLiabilities = shortTermDebt + longTermDebt + adjustedAP + newEmergencyCreditLine;

    const incomeStatement: IncomeStatement = {
      revenue: totalRevenue,
      cogsMaterials: Math.round(totalMaterialsCost),
      cogsLabor: Math.round(totalLaborCost),
      cogsDepreciation,
      cogsInventoryHolding: Math.round(cogsInventoryHolding),
      totalCogs,
      grossProfit,
      grossMarginPct,
      rAndDExpense,
      marketingExpense,
      salesForceExpense,
      tqmExpense,
      esgExpense,
      hrTrainingExpense,
      generalAdminExpense,
      totalOpex,
      operatingIncomeEBIT,
      operatingMarginPct,
      interestExpense,
      emergencyLoanInterest,
      taxableIncome,
      incomeTax,
      netIncome,
      netMarginPct,
    };

    const balanceSheet: BalanceSheet = {
      cash: Math.round(closingCash),
      accountsReceivable: Math.round(prev.balanceSheet.accountsReceivable + deltaAccountsReceivable),
      inventoryValue: inventoryVal,
      plantAndEquipmentCost: Math.round(grossPpe),
      accumulatedDepreciation: Math.round(totalAccumDepreciation),
      netPpe: Math.round(netPpe),
      totalAssets: Math.round(totalAssets),
      accountsPayable: Math.round(adjustedAP),
      shortTermDebt: Math.round(shortTermDebt),
      longTermDebt: Math.round(longTermDebt),
      emergencyCreditLine: Math.round(newEmergencyCreditLine),
      totalLiabilities: Math.round(finalTotalLiabilities),
      commonStock: Math.round(commonStock),
      retainedEarnings: Math.round(retainedEarnings),
      totalEquity: Math.round(totalEquity),
      totalLiabilitiesAndEquity: Math.round(finalTotalLiabilities + totalEquity),
    };

    const cashFlowStatement: CashFlowStatement = {
      operatingCashFlow: Math.round(operatingCashFlow),
      investingCashFlow: Math.round(investingCashFlow),
      financingCashFlow: Math.round(financingCashFlow),
      netCashFlow: Math.round(netCashFlow),
      openingCash: prev.balanceSheet.cash,
      closingCash: Math.round(closingCash),
    };

    // Credit Rating evaluation
    const interestCoverage = interestExpense > 0 ? (operatingIncomeEBIT / interestExpense) : 15;
    const debtToEquity = totalEquity > 0 ? (finalTotalLiabilities / totalEquity) : 5;
    let creditRating: CompanyReport['creditRating'] = 'BBB';
    if (newEmergencyCreditLine > 0) creditRating = 'CCC';
    else if (interestCoverage > 10 && debtToEquity < 0.6) creditRating = 'AAA';
    else if (interestCoverage > 6 && debtToEquity < 0.9) creditRating = 'AA';
    else if (interestCoverage > 4 && debtToEquity < 1.3) creditRating = 'A';
    else if (interestCoverage > 2.5 && debtToEquity < 1.8) creditRating = 'BBB';
    else if (interestCoverage > 1.5) creditRating = 'BB';
    else if (interestCoverage > 0) creditRating = 'B';
    else creditRating = 'D';

    // Stock Price & Valuation
    const annualizedEps = (netIncome * 4) / Math.max(1, sharesOutstanding);
    const bookValuePerShare = totalEquity / Math.max(1, sharesOutstanding);
    const roe = totalEquity > 0 ? (netIncome * 4) / totalEquity : -0.1;
    let peMultiple = 16;
    if (roe > 0.20) peMultiple = 22;
    else if (roe > 0.12) peMultiple = 18;
    else if (roe < 0.05) peMultiple = 11;
    if (creditRating === 'CCC' || creditRating === 'D') peMultiple = 6;

    let computedStockPrice = annualizedEps > 0 ? annualizedEps * peMultiple : bookValuePerShare * 0.7;
    computedStockPrice = Math.max(2.00, Math.round(computedStockPrice * 100) / 100);

    // Morale
    const salaryBoost = (dec.hr.salaryIncreasePct - nextMacro.inflationPct) * 1.5;
    const bonusBoost = Math.min(10, dec.hr.bonusPool / 50_000);
    const employeeMorale = Math.min(99, Math.max(20, Math.round(prev.employeeMorale + salaryBoost + bonusBoost)));

    // Balanced Scorecard (each pillar 0 - 100, overall total is average out of 100)
    const finScore = Math.min(100, Math.max(0, Math.round((roe * 200) + (netMarginPct * 3.0) + (creditRating.startsWith('A') ? 25 : 15))));
    const custScore = Math.min(100, Math.max(0, Math.round(
      ((updatedBrand[cid].economy + updatedBrand[cid].mainstream + updatedBrand[cid].premium) / 3) * 0.5 +
      ((updatedQualities[cid].economy + updatedQualities[cid].mainstream + updatedQualities[cid].premium) / 3) * 0.5
    )));
    const plantUtilization = Math.min(1.2, totalTargetProduction / Math.max(1, plantCapacity));
    const internalScore = Math.min(100, Math.max(0, Math.round((plantUtilization * 60) + (autoLevel * 4.0))));
    const learnScore = Math.min(100, Math.max(0, Math.round((employeeMorale * 0.6) + Math.min(40, (dec.operations.esgSpend + rAndDExpense) / 20_000))));
    const totalScore = Math.round(((finScore + custScore + internalScore + learnScore) / 4) * 10) / 10;

    nextCompanies[cid] = {
      companyId: cid,
      companyName: prev.companyName,
      isAi: prev.isAi,
      aiArchetype: prev.aiArchetype,
      quarter: nextQuarter,
      stockPrice: computedStockPrice,
      sharesOutstanding,
      marketCap: Math.round(computedStockPrice * sharesOutstanding),
      creditRating,
      plantCapacity,
      automationLevel: autoLevel,
      employeeHeadcount: prev.employeeHeadcount,
      employeeMorale,
      brandAwareness: updatedBrand[cid],
      productQuality: updatedQualities[cid],
      inventoryUnits: endingInvUnits,
      segmentResults: segmentSalesByCompany[cid],
      incomeStatement,
      balanceSheet,
      cashFlowStatement,
      scorecard: {
        financialScore: finScore,
        customerScore: custScore,
        internalProcessScore: internalScore,
        learningGrowthScore: learnScore,
        totalScore,
      },
      decisionsSubmitted: dec,
    };
  }

  // Record history
  const history = { ...currentState.history };
  history[nextQuarter] = {
    macro: nextMacro,
    companies: JSON.parse(JSON.stringify(nextCompanies)),
  };

  return {
    ...currentState,
    currentQuarter: nextQuarter,
    macro: nextMacro,
    companies: nextCompanies,
    history,
    status: nextQuarter >= currentState.maxQuarters ? 'completed' : 'active',
  };
}
