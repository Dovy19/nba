'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Team } from '@/lib/data/teams';
import { GripVertical } from 'lucide-react';

interface DraggableTeamItemProps {
  team: Team;
  rank: number;
}

export function DraggableTeamItem({ team, rank }: DraggableTeamItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: team.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 p-3 rounded-lg
        bg-[#1E1E1E] border border-[#2A2A2A]
        ${isDragging ? 'opacity-50 shadow-lg' : ''}
        hover:border-[#3A3A3A] transition-colors
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
      <div className="flex-1">
        <div
          className="border-b-2 pb-1 inline-block"
          style={{ borderColor: team.colors.primary }}
        >
          <span className="text-white/95 font-medium">{team.name}</span>
        </div>
      </div>
    </div>
  );
}