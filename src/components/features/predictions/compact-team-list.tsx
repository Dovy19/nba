import { Team } from '@/lib/data/teams';

interface CompactTeamListProps {
  teams: Team[];
  title: string;
  playInOutcomes?: Record<number, 'makes_playoffs' | 'out_in_playins'>;
}

export function CompactTeamList({ teams, title, playInOutcomes = {} }: CompactTeamListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="space-y-1">
        {teams.map((team, index) => {
          const rank = index + 1;
          const isPlayIn = rank >= 7 && rank <= 10;
          const outcome = playInOutcomes[team.id];
          
          return (
            <div
              key={team.id}
              className="flex items-center gap-2 p-2 rounded bg-[#1E1E1E] border border-[#2A2A2A]"
            >
              {/* Rank Number */}
              <div className="flex-shrink-0 w-6 text-center">
                <span className="text-sm font-bold text-white">
                  {rank}
                </span>
              </div>

              {/* Team Name with Colored Border */}
              <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden">
                <div
                  className="border-b-2 pb-0.5 inline-block flex-shrink-0"
                  style={{ borderColor: team.colors.primary }}
                >
                  <span className="text-sm text-white/95 font-medium">
                    {team.name}
                  </span>
                </div>

                {/* Smaller Badge next to team name for play-in teams */}
                {isPlayIn && outcome && (
                  <div className="flex-shrink-0">
                    <div
                      className={`
                        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
                        ${outcome === 'makes_playoffs'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                        }
                      `}
                    >
                      <span className="text-xs">{outcome === 'makes_playoffs' ? '🟡' : '🔴'}</span>
                      <span className="whitespace-nowrap">{outcome === 'makes_playoffs' ? 'Playoffs' : 'Out'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}