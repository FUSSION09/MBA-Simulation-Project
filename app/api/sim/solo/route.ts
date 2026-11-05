import { NextResponse } from 'next/server';
import { createInitialSimulation } from '@/lib/engine/initial-state';
import { simulateQuarter } from '@/lib/engine/simulation';
import { generateAiDecision } from '@/lib/engine/ai-bots';
import { CompanyDecision, SimulationState } from '@/lib/engine/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action || 'init';

    if (action === 'init') {
      const state = createInitialSimulation('solo');
      return NextResponse.json({ success: true, state });
    }

    if (action === 'advance') {
      const { currentState, playerDecision } = body as { currentState: SimulationState; playerDecision: CompanyDecision };

      if (!currentState || !playerDecision) {
        return NextResponse.json({ success: false, error: 'Missing currentState or playerDecision' }, { status: 400 });
      }

      // Generate decisions for all AI competitor firms
      const decisionsByCompany: Record<string, CompanyDecision> = {
        [playerDecision.companyId]: playerDecision,
      };

      for (const [cid, comp] of Object.entries(currentState.companies)) {
        if (comp.isAi) {
          decisionsByCompany[cid] = generateAiDecision(comp, currentState);
        }
      }

      // Run simulation step
      const nextState = simulateQuarter(currentState, decisionsByCompany);
      return NextResponse.json({ success: true, state: nextState });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
