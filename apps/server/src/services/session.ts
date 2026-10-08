import { v4 as uuidv4 } from 'uuid';

export interface PlayerSession {
  sessionToken: string;
  playerId: string;
  roomCode: string;
  createdAt: number;
}

export class SessionService {
  private sessions = new Map<string, PlayerSession>(); // key: sessionToken

  public createSession(playerId: string, roomCode: string): string {
    const sessionToken = `ses_${uuidv4()}`;
    this.sessions.set(sessionToken, {
      sessionToken,
      playerId,
      roomCode,
      createdAt: Date.now(),
    });
    return sessionToken;
  }

  public getSession(sessionToken: string): PlayerSession | undefined {
    return this.sessions.get(sessionToken);
  }

  public removeSession(sessionToken: string): boolean {
    return this.sessions.delete(sessionToken);
  }

  public removeSessionsForRoom(roomCode: string): void {
    for (const [token, session] of this.sessions.entries()) {
      if (session.roomCode === roomCode) {
        this.sessions.delete(token);
      }
    }
  }
}

export const sessionService = new SessionService();
