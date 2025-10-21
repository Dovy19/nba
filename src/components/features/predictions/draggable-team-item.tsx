'use client';

import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Team } from '@/lib/data/teams';
import { GripVertical } from 'lucide-react';
import { PlayInBadge } from './play-in-badge';

interface DraggableTeamItemProps {
  team: Team;
  rank: number;
  playInOutcome?: 'makes_playoffs' | 'out_in_playins';
  isDraggingBadge?: boolean;
}

export function DraggableTeamItem({ team, rank, playInOutcome, isDraggingBadge = false }: DraggableTeamItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: team.id });

  // Make team droppable for badges when in positions 7-10
  const isPlayInPosition = rank >= 7 && rank <= 10;
  
  // Debug log for play-in teams
  if (isPlayInPosition) {
    console.log(`🏀 Team ${team.name} (ID: ${team.id}) - Rank: ${rank} - Badge:`, playInOutcome);
  }
  
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `droppable-team-${team.id}`,
    disabled: !isPlayInPosition,
    data: { teamId: team.id, rank, isPlayInTeam: true },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={(node) => {
        setSortableRef(node);
        if (isPlayInPosition) {
          setDroppableRef(node);
        }
      }}
      style={style}
      className={`
        flex items-center gap-3 p-3 rounded-lg
        bg-[#1E1E1E] border border-[#2A2A2A]
        ${isDragging ? 'opacity-50 shadow-lg' : ''}
        ${isOver && isPlayInPosition ? 'border-blue-500 bg-blue-500/10' : ''}
        ${isDraggingBadge && !isPlayInPosition ? 'opacity-30 pointer-events-none' : ''}
        ${isDraggingBadge && isPlayInPosition ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-[#121212]' : ''}
        hover:border-[#3A3A3A] transition-all duration-200
      `}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 transition-colors"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Rank Number */}
      <div className="flex-shrink-0 w-8 text-center">
        <span className="text-xl font-bold text-white font-feature-settings-['tnum']">
          {rank}
        </span>
      </div>

      {/* Team Name with Colored Border */}
      <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden">
        <div
          className="border-b-2 pb-1 inline-block flex-shrink-0"
          style={{ borderColor: team.colors.primary }}
        >
          <span className="text-sm text-white/95 font-medium">
            {team.name}
          </span>
        </div>
        
        {/* Smaller Badge next to team name for play-in teams */}
        {isPlayInPosition && playInOutcome && (
          <div className="flex-shrink-0">
            <div
              className={`
                inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
                ${playInOutcome === 'makes_playoffs'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }
              `}
            >
              <span className="text-xs">{playInOutcome === 'makes_playoffs' ? '🟡' : '🔴'}</span>
              <span className="whitespace-nowrap">{playInOutcome === 'makes_playoffs' ? 'Playoffs' : 'Out'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Placeholder for empty badge spots */}
      {isPlayInPosition && !playInOutcome && (
        <div className="flex-shrink-0 text-[10px] text-gray-500 italic">
          Drop badge
        </div>
      )}
    </div>
  );
}