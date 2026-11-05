import { CompanyDecision, CompanyReport, SimulationState } from './types';
import { createInitialCompany, INITIAL_MACRO } from './initial-state';
import { simulateQuarter } from './simulation';
import { generateAiDecision } from './ai-bots';

export interface CohortTeam {
  teamId: string;
  teamName: string;
  members: string[];
  isAi: boolean;
  hasSubmitted: boolean;
  currentDecision?: CompanyDecision;
}

export interface CohortRoom {
  roomId: string;
  roomName: string;
  instructorPin: string;
  quarter: number;
  maxQuarters: number;
  status: 'lobby' | 'active' | 'completed';
  teams: Record<string, CohortTeam>;
  simulation: SimulationState;
  createdAt: string;
}

// In-memory global store for room management across API routes
declare global {
  // eslint-disable-next-line no-var
  var __COHORT_ROOMS__: Record<string, CohortRoom> | undefined;
}

const rooms: Record<string, CohortRoom> = global.__COHORT_ROOMS__ || {};
if (process.env.NODE_ENV !== 'production') {
  global.__COHORT_ROOMS__ = rooms;
}

export function createCohortRoom(roomName: string, instructorPin: string, maxQuarters = 8): CohortRoom {
  const roomId = 'ROOM-' + Math.floor(1000 + Math.random() * 9000);

  const initialSim: SimulationState = {
    gameId: 'sim-' + roomId,
    gameMode: 'multiplayer',
    status: 'active',
    currentQuarter: 1,
    maxQuarters,
    macro: INITIAL_MACRO,
    companies: {},
    history: {},
  };

  const room: CohortRoom = {
    roomId,
    roomName,
    instructorPin,
    quarter: 1,
    maxQuarters,
    status: 'lobby',
    teams: {},
    simulation: initialSim,
    createdAt: new Date().toISOString(),
  };

  rooms[roomId] = room;
  return room;
}

export function getRoom(roomId: string): CohortRoom | null {
  return rooms[roomId] || null;
}

export function joinRoom(roomId: string, teamName: string, memberName: string): { success: boolean; teamId?: string; error?: string } {
  const room = rooms[roomId];
  if (!room) return { success: false, error: 'Room not found.' };

  // Check if team already exists
  const existingTeam = Object.values(room.teams).find(t => t.teamName.toLowerCase() === teamName.toLowerCase());
  if (existingTeam) {
    if (!existingTeam.members.includes(memberName)) {
      existingTeam.members.push(memberName);
    }
    return { success: true, teamId: existingTeam.teamId };
  }

  const teamId = 'team-' + Math.random().toString(36).substring(2, 7);
  room.teams[teamId] = {
    teamId,
    teamName,
    members: [memberName],
    isAi: false,
    hasSubmitted: false,
  };

  // Add corresponding initial company to simulation state
  const company = createInitialCompany(teamId, teamName, false, 'human');
  room.simulation.companies[teamId] = company;

  return { success: true, teamId };
}

export function startRoomSession(roomId: string, instructorPin: string): { success: boolean; error?: string } {
  const room = rooms[roomId];
  if (!room) return { success: false, error: 'Room not found.' };
  if (room.instructorPin !== instructorPin) return { success: false, error: 'Invalid instructor PIN.' };

  // If fewer than 4 teams, add AI rival teams to reach 4 competing firms
  const teamCount = Object.keys(room.teams).length;
  if (teamCount < 4) {
    const aiArchetypes: Array<{ name: string; archetype: CompanyReport['aiArchetype'] }> = [
      { name: 'Apex Dynamics', archetype: 'cost_leader' },
      { name: 'Novus Tech', archetype: 'differentiator' },
      { name: 'Vanguard Inc', archetype: 'balanced' },
    ];
    for (let i = 0; i < (4 - teamCount); i++) {
      const aiId = 'ai-rival-' + (i + 1);
      const arche = aiArchetypes[i % aiArchetypes.length];
      room.teams[aiId] = {
        teamId: aiId,
        teamName: `${arche.name} (AI)`,
        members: ['Autonomous AI'],
        isAi: true,
        hasSubmitted: true,
      };
      room.simulation.companies[aiId] = createInitialCompany(aiId, `${arche.name} (AI)`, true, arche.archetype);
    }
  }

  room.status = 'active';
  room.simulation.history[1] = {
    macro: room.simulation.macro,
    companies: JSON.parse(JSON.stringify(room.simulation.companies)),
  };

  return { success: true };
}

export function submitDecision(roomId: string, teamId: string, decision: CompanyDecision): { success: boolean; error?: string } {
  const room = rooms[roomId];
  if (!room) return { success: false, error: 'Room not found.' };
  const team = room.teams[teamId];
  if (!team) return { success: false, error: 'Team not found in room.' };

  team.currentDecision = decision;
  team.hasSubmitted = true;
  return { success: true };
}

export function advanceRoomRound(roomId: string, instructorPin: string): { success: boolean; error?: string; newQuarter?: number } {
  const room = rooms[roomId];
  if (!room) return { success: false, error: 'Room not found.' };
  if (room.instructorPin !== instructorPin) return { success: false, error: 'Invalid instructor PIN.' };

  const decisionsByCompany: Record<string, CompanyDecision> = {};

  for (const [teamId, team] of Object.entries(room.teams)) {
    if (team.isAi) {
      decisionsByCompany[teamId] = generateAiDecision(room.simulation.companies[teamId], room.simulation);
    } else if (team.currentDecision) {
      decisionsByCompany[teamId] = team.currentDecision;
    } else {
      // Auto-submit previous decision or balanced default if student failed to submit in time
      decisionsByCompany[teamId] = generateAiDecision(room.simulation.companies[teamId], room.simulation);
    }
  }

  const nextSim = simulateQuarter(room.simulation, decisionsByCompany);
  room.simulation = nextSim;
  room.quarter = nextSim.currentQuarter;

  // Reset team submission flags for the new quarter
  for (const team of Object.values(room.teams)) {
    team.hasSubmitted = team.isAi;
    team.currentDecision = undefined;
  }

  if (room.quarter >= room.maxQuarters) {
    room.status = 'completed';
  }

  return { success: true, newQuarter: room.quarter };
}
