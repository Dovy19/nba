import { Team } from '@/lib/data/teams';

/**
 * Reorder teams array after drag-and-drop
 */
export function reorderTeams(teams: Team[], fromIndex: number, toIndex: number): Team[] {
  const result = [...teams];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Get teams by their IDs in order
 */
export function getTeamsByIds(ids: number[], allTeams: Team[]): Team[] {
  return ids.map(id => allTeams.find(t => t.id === id)).filter((t): t is Team => t !== undefined);
}

/**
 * Extract team IDs from ordered team array
 */
export function getTeamIds(teams: Team[]): number[] {
  return teams.map(t => t.id);
}