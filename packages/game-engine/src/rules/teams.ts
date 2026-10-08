import type { TeamConfig } from '@adipoly/shared';
import { DEFAULT_TEAMS } from '@adipoly/shared';

export interface TeamValidationResult {
  valid: boolean;
  message?: string;
}

export class TeamManager {
  public static getAvailableTeams(maxPlayers: number): TeamConfig[] {
    if (maxPlayers <= 4) {
      return DEFAULT_TEAMS.slice(0, 2); // 2 teams (Team Alpha, Team Beta)
    }
    if (maxPlayers <= 6) {
      return DEFAULT_TEAMS.slice(0, 3); // 3 teams
    }
    return DEFAULT_TEAMS; // 4 teams
  }

  public static validateTeamAssignments(
    playerTeamMap: Record<string, string | null | undefined>,
    playerCount: number
  ): TeamValidationResult {
    if (playerCount < 4) {
      return { valid: false, message: 'Team mode requires at least 4 players.' };
    }

    const teamCounts: Record<string, number> = {};
    for (const [playerId, teamId] of Object.entries(playerTeamMap)) {
      if (!teamId) {
        return { valid: false, message: `Player ${playerId} has not selected a team.` };
      }
      teamCounts[teamId] = (teamCounts[teamId] || 0) + 1;
    }

    const counts = Object.values(teamCounts);
    if (counts.length < 2) {
      return { valid: false, message: 'At least two teams must have members.' };
    }

    // Check balance
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);
    if (maxCount - minCount > 1) {
      return { valid: false, message: 'Teams must be evenly distributed.' };
    }

    return { valid: true };
  }
}
