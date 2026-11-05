export interface DilemmaChoice {
  id: string;
  label: string;
  cost: number;
  impactSummary: string;
  effect: {
    cashDelta?: number;
    opexDelta?: number;
    moraleDelta?: number;
    brandDelta?: number;
    qualityDelta?: number;
  };
}

export interface ExecutiveDilemma {
  quarter: number;
  title: string;
  description: string;
  context: string;
  options: DilemmaChoice[];
}

export const DILEMMAS_BY_QUARTER: Record<number, ExecutiveDilemma> = {
  1: {
    quarter: 1,
    title: 'Component Sourcing & Supplier ESG Compliance',
    context: 'Operations & Procurement Strategy',
    description: 'A Tier-1 supplier offers a 12% price reduction if you sign a 2-year sole-source agreement. However, an independent audit flags workplace safety and environmental concerns at their primary facility.',
    options: [
      {
        id: 'sole_source_cheap',
        label: 'Accept Sole-Source Discount (Cost Focus)',
        cost: 0,
        impactSummary: 'Reduces raw materials cost by $200k, but ESG rating drops by 10 points and employee morale decreases.',
        effect: { opexDelta: -200_000, moraleDelta: -5, brandDelta: -4 }
      },
      {
        id: 'dual_source_green',
        label: 'Transition to Certified Green Domestic Suppliers (ESG Focus)',
        cost: 300_000,
        impactSummary: 'Incurs $300k one-time qualification expense, but elevates brand prestige and customer willingness-to-pay in Premium segment.',
        effect: { cashDelta: -300_000, brandDelta: 8, moraleDelta: 6 }
      },
      {
        id: 'maintain_roster',
        label: 'Maintain Current Multi-Vendor Strategy (Risk Mitigation)',
        cost: 50_000,
        impactSummary: '$50k supplier audit cost. No change in core metrics.',
        effect: { cashDelta: -50_000 }
      }
    ]
  },
  2: {
    quarter: 2,
    title: 'Manufacturing Labor Union Collective Bargaining',
    context: 'Human Capital & Plant Productivity',
    description: 'The plant labor union demands a 6% wage increase and upgraded pension contributions citing recent inflation. Plant managers warn of potential work slow-downs if demands are rejected.',
    options: [
      {
        id: 'grant_wage_hike',
        label: 'Accept Full Union Demands (Workforce Stability)',
        cost: 250_000,
        impactSummary: 'Increases quarterly labor costs by $250k, but boosts workforce morale by 15 points and improves assembly quality.',
        effect: { opexDelta: 250_000, moraleDelta: 15, qualityDelta: 5 }
      },
      {
        id: 'compromise_incentive',
        label: 'Offer Performance-Linked Profit Sharing (Balanced Compromise)',
        cost: 120_000,
        impactSummary: 'Modest $120k cost; aligns employee incentives with company profitability.',
        effect: { opexDelta: 120_000, moraleDelta: 8 }
      },
      {
        id: 'accelerate_robotics',
        label: 'Stand Firm & Fast-Track Plant Robotics Automation',
        cost: 450_000,
        impactSummary: 'High upfront CAPEX of $450k; short-term strike risk (-12 morale), but permanently reduces future direct labor costs.',
        effect: { cashDelta: -450_000, moraleDelta: -12 }
      }
    ]
  },
  3: {
    quarter: 3,
    title: 'Competitor Patent Infringement Challenge',
    context: 'Intellectual Property & Corporate Defense',
    description: 'Rival firm Novus Tech files a patent infringement lawsuit claiming your mainstream product utilizes their proprietary thermal dissipation design. They offer a private licensing settlement.',
    options: [
      {
        id: 'settle_license',
        label: 'Settle and Pay Royalty License ($400,000)',
        cost: 400_000,
        impactSummary: 'Instant legal certainty. Prevents injunction risks and protects ongoing quarterly sales.',
        effect: { cashDelta: -400_000 }
      },
      {
        id: 'fight_litigation',
        label: 'Counter-Sue and Contest in Federal Court',
        cost: 250_000,
        impactSummary: '$250k legal defense retainers. 50% chance of invalidating competitor patent, but distracts executive attention.',
        effect: { cashDelta: -250_000, brandDelta: -3 }
      },
      {
        id: 'redesign_architecture',
        label: 'Fast-Track Internal R&D Architecture Workaround',
        cost: 500_000,
        impactSummary: 'Pours $500k into R&D redesign. Completely eliminates patent dependency and improves product efficiency.',
        effect: { cashDelta: -500_000, qualityDelta: 10 }
      }
    ]
  },
  4: {
    quarter: 4,
    title: 'Macroeconomic Inflation & Federal Reserve Rate Hike',
    context: 'Treasury & Working Capital Risk',
    description: 'Central banks raise the benchmark lending rate by 150 basis points to cool inflation. Debt financing costs spike, while consumers become noticeably more price-sensitive.',
    options: [
      {
        id: 'deleverage_debt',
        label: 'Aggressively Pay Down Short-Term Debt ($600,000)',
        cost: 600_000,
        impactSummary: 'Protects interest coverage ratio and upgrades company credit rating.',
        effect: { cashDelta: -600_000 }
      },
      {
        id: 'absorb_inflation',
        label: 'Absorb Input Costs to Capture Competitor Market Share',
        cost: 200_000,
        impactSummary: 'Keeps consumer prices flat despite inflation. Compresses margins temporarily but wins customer loyalty.',
        effect: { opexDelta: 200_000, brandDelta: 10 }
      },
      {
        id: 'pass_through_pricing',
        label: 'Pass 8% Price Increase Through to All Customer Segments',
        cost: 0,
        impactSummary: 'Maintains gross margins, but risks volume elasticity drop in the Economy segment.',
        effect: {}
      }
    ]
  }
};
