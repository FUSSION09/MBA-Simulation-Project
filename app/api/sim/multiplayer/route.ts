import { NextResponse } from 'next/server';
import {
  createCohortRoom,
  getRoom,
  joinRoom,
  startRoomSession,
  submitDecision,
  advanceRoomRound
} from '@/lib/engine/room-manager';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'create_room') {
      const { roomName, instructorPin, maxQuarters } = body;
      const room = createCohortRoom(roomName || 'MBA Cohort Room', instructorPin || '1234', maxQuarters || 8);
      return NextResponse.json({ success: true, room });
    }

    if (action === 'get_room') {
      const { roomId } = body;
      const room = getRoom(roomId);
      if (!room) return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
      return NextResponse.json({ success: true, room });
    }

    if (action === 'join_room') {
      const { roomId, teamName, memberName } = body;
      const res = joinRoom(roomId, teamName, memberName);
      if (!res.success) return NextResponse.json(res, { status: 400 });
      const room = getRoom(roomId);
      return NextResponse.json({ success: true, teamId: res.teamId, room });
    }

    if (action === 'start_session') {
      const { roomId, instructorPin } = body;
      const res = startRoomSession(roomId, instructorPin);
      if (!res.success) return NextResponse.json(res, { status: 400 });
      const room = getRoom(roomId);
      return NextResponse.json({ success: true, room });
    }

    if (action === 'submit_decision') {
      const { roomId, teamId, decision } = body;
      const res = submitDecision(roomId, teamId, decision);
      if (!res.success) return NextResponse.json(res, { status: 400 });
      const room = getRoom(roomId);
      return NextResponse.json({ success: true, room });
    }

    if (action === 'advance_round') {
      const { roomId, instructorPin } = body;
      const res = advanceRoomRound(roomId, instructorPin);
      if (!res.success) return NextResponse.json(res, { status: 400 });
      const room = getRoom(roomId);
      return NextResponse.json({ success: true, room });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
