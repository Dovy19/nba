'use client';

import { useDraggable } from '@dnd-kit/core';

interface PlayInBadgeProps {
  type: 'makes_playoffs' | 'out_in_playins';
  isDragging?: boolean;
}

export function PlayInBadge({ type, isDragging = false }: PlayInBadgeProps) {
  const isMakesPlayoffs = type === 'makes_playoffs';
  
  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        ${isMakesPlayoffs 
          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' 
          : 'bg-red-500/20 text-red-300 border border-red-500/40'
        }
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <span className="text-base">{isMakesPlayoffs ? '🟡' : '🔴'}</span>
      <span>{isMakesPlayoffs ? 'Makes Playoffs' : 'Out in Play-ins'}</span>
    </div>
  );
}

export function DraggablePlayInBadge({ type }: { type: 'makes_playoffs' | 'out_in_playins' }) {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: `badge-${type}`,
    data: { type, isBadge: true },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-grab active:cursor-grabbing"
    >
      <PlayInBadge type={type} isDragging={isDragging} />
    </div>
  );
}