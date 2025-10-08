import { Team } from '@/lib/data/teams';

interface CompactTeamListProps {
  teams: Team[];
  title: string;
}

export function CompactTeamList({ teams, title }: CompactTeamListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="space-y-1">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className="flex items-center gap-2 p-2 rounded bg-[#1E1E1E] border border-[#2A2A2A]"
          >
            {/* Rank Number */}
            <div className="flex-shrink-0 w-6 text-center">
              <span className="text-sm font-bold text-white">
                {index + 1}
              </span>
            </div>

            {/* Team Name with Colored Border */}
            <div className="flex-1 min-w-0">
              <div
                className="border-b-2 pb-0.5 inline-block"
                style={{ borderColor: team.colors.primary }}
              >
                <span className="text-sm text-white/95 font-medium truncate">
                  {team.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}