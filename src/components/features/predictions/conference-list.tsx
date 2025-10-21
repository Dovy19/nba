'use client';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Team } from '@/lib/data/teams';
import { DraggableTeamItem } from './draggable-team-item';

interface ConferenceListProps {
  title: string;
  teams: Team[];
  playInOutcomes: Record<number, 'makes_playoffs' | 'out_in_playins'>;
  isDraggingBadge?: boolean;
}

export function ConferenceList({ title, teams, playInOutcomes, isDraggingBadge = false }: ConferenceListProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Conference Title */}
      <h2 className="text-2xl font-semibold text-white tracking-tight">
        {title}
      </h2>

      {/* Sortable Team List */}
      <SortableContext
        items={teams.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {teams.map((team, index) => (
            <DraggableTeamItem
              key={team.id}
              team={team}
              rank={index + 1}
              playInOutcome={playInOutcomes[team.id]}
              isDraggingBadge={isDraggingBadge}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}