import { Player, LineupSettings } from '../types/player';

export const calculateValue = (player: Player): number => {
  return (player.projection / player.salary) * 1000;
};

export const getPositionCounts = (players: Player[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  players.forEach((player) => {
    counts[player.position] = (counts[player.position] || 0) + 1;
  });
  return counts;
};

export const canAddPlayerToLineup = (
  player: Player,
  currentPlayers: Player[],
  settings: LineupSettings
): boolean => {
  const newLineup = [...currentPlayers, player];
  
  // Check salary cap
  const totalSalary = newLineup.reduce((sum, p) => sum + p.salary, 0);
  if (totalSalary > settings.salaryCap) return false;

  // Check team limits
  const teamCounts: Record<string, number> = {};
  newLineup.forEach((p) => {
    teamCounts[p.team] = (teamCounts[p.team] || 0) + 1;
  });
  if (teamCounts[player.team] > settings.maxFromTeam) return false;

  // Get current position counts
  const positionCounts = getPositionCounts(currentPlayers);
  
  // Check if adding this player would exceed position limits
  const positionReq = settings.positions.find(p => p.position === player.position);
  if (positionReq) {
    const currentCount = positionCounts[player.position] || 0;
    if (currentCount >= positionReq.count) {
      // Check if player can be added to FLEX
      if (isPlayerEligibleForFlex(player.position)) {
        const flexReq = settings.positions.find(p => p.position === 'FLEX');
        if (!flexReq) return false;
        
        // Count used FLEX spots
        const usedFlexSpots = Object.entries(positionCounts).reduce((count, [pos, num]) => {
          if (!isPlayerEligibleForFlex(pos)) return count;
          return count + Math.max(0, num - (settings.positions.find(p => p.position === pos)?.count || 0));
        }, 0);
        
        return usedFlexSpots < flexReq.count;
      }
      return false;
    }
  }

  return true;
};

export const validateLineup = (
  players: Player[],
  settings: LineupSettings
): boolean => {
  // Check salary cap
  const totalSalary = players.reduce((sum, player) => sum + player.salary, 0);
  if (totalSalary > settings.salaryCap) return false;

  // Check team limits
  const teamCounts: Record<string, number> = {};
  players.forEach((player) => {
    teamCounts[player.team] = (teamCounts[player.team] || 0) + 1;
  });
  if (Object.values(teamCounts).some(count => count > settings.maxFromTeam)) {
    return false;
  }

  // Get position counts
  const positionCounts = getPositionCounts(players);

  // Validate regular positions first
  const regularPositions = settings.positions.filter(p => p.position !== 'FLEX');
  for (const reqPos of regularPositions) {
    const count = positionCounts[reqPos.position] || 0;
    if (count < reqPos.count) return false;
  }

  // Validate FLEX position
  const flexReq = settings.positions.find(p => p.position === 'FLEX');
  if (flexReq) {
    let availableForFlex = 0;
    for (const [pos, count] of Object.entries(positionCounts)) {
      if (!isPlayerEligibleForFlex(pos)) continue;
      const reqCount = settings.positions.find(p => p.position === pos)?.count || 0;
      availableForFlex += Math.max(0, count - reqCount);
    }
    if (availableForFlex < flexReq.count) return false;
  }

  return true;
};

export const isPlayerEligibleForFlex = (position: string): boolean => {
  return ['RB', 'WR', 'TE'].includes(position);
};

export const getPositionDisplay = (position: string): string => {
  return position === 'DST' ? 'D/ST' : position;
};