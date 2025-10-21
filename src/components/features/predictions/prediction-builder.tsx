'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  rectIntersection,
  pointerWithin,
} from '@dnd-kit/core';
import { Team } from '@/lib/data/teams';
import { ConferenceList } from './conference-list';
import { DraggablePlayInBadge } from './play-in-badge';
import { Button } from '@/components/ui/button';
import { reorderTeams, getTeamIds } from '@/lib/utils/team-helpers';
import { createPrediction } from '@/lib/actions/predictions/create-prediction';
import { CURRENT_SEASON } from '@/lib/utils/constants';
import { toast } from 'sonner';

interface PredictionBuilderProps {
  initialEastTeams: Team[];
  initialWestTeams: Team[];
  isEditing?: boolean;
  initialPlayInOutcomes?: Record<number, 'makes_playoffs' | 'out_in_playins'>;
}

export function PredictionBuilder({
  initialEastTeams,
  initialWestTeams,
  isEditing = false,
  initialPlayInOutcomes = {},
}: PredictionBuilderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [eastTeams, setEastTeams] = useState<Team[]>(initialEastTeams);
  const [westTeams, setWestTeams] = useState<Team[]>(initialWestTeams);
  const [playInOutcomes, setPlayInOutcomes] = useState<Record<number, 'makes_playoffs' | 'out_in_playins'>>(initialPlayInOutcomes);
  const [isDraggingBadge, setIsDraggingBadge] = useState(false);

  // Configure sensors for drag-and-drop (works on desktop and mobile)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  // Handle drag start (detect when badge starts dragging)
  const handleDragStart = (event: any) => {
    const isBadge = event.active?.data?.current?.isBadge;
    console.log('🚀 Drag started - Is Badge?', isBadge, '| Event:', event);
    if (isBadge) {
      setIsDraggingBadge(true);
    }
  };

  // Handle drag over event (for visual feedback)
  const handleDragOver = (event: DragOverEvent) => {
    // Visual feedback is handled by the droppable component
  };

  // Handle drag end event - COMPLETE DEBUG VERSION
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('=== DRAG END EVENT ===');
    console.log('Active:', active);
    console.log('Active ID:', active.id);
    console.log('Over:', over);
    console.log('Over ID:', over?.id);
    console.log('Active data:', active.data?.current);
    console.log('Over data:', over?.data?.current);
    
    // Reset dragging state
    setIsDraggingBadge(false);
    
    if (!over) {
      console.log('❌ No "over" target - drop failed');
      return;
    }

    const isBadge = active.data?.current?.isBadge;
    console.log('Is Badge?', isBadge);
    console.log('Is Play-in Team?', over.data?.current?.isPlayInTeam);

    // Handle badge drop
    if (isBadge) {
      console.log('🎯 Badge detected, checking drop target...');
      
      // Check if dropping on a droppable team item OR a sortable team in play-in position
      const isDroppableTeam = over.data?.current?.isPlayInTeam;
      const isTeamId = typeof over.id === 'number'; // Team IDs are numbers
      
      console.log('Is Droppable Team?', isDroppableTeam);
      console.log('Is Team ID (number)?', isTeamId);
      
      if (isDroppableTeam || isTeamId) {
        let teamId: number;
        let rank: number;
        
        // Get teamId and rank from either source
        if (isDroppableTeam && over.data?.current) {
          teamId = over.data.current.teamId;
          rank = over.data.current.rank;
        } else if (isTeamId) {
          // Dropped on sortable - find team in our lists
          teamId = over.id as number;
          const allTeams = [...eastTeams, ...westTeams];
          const teamIndex = allTeams.findIndex(t => t.id === teamId);
          rank = (teamIndex % 15) + 1;
        } else {
          console.log('❌ Could not determine team ID');
          return;
        }
        
        console.log('Found Team ID:', teamId, '| Rank:', rank);
        
        // Validate rank is 7-10
        if (rank < 7 || rank > 10) {
          console.log('❌ Invalid rank - must be 7-10');
          toast.error('Can only drop badges on teams ranked 7-10');
          return;
        }
        
        const badgeType = active.data?.current?.type as 'makes_playoffs' | 'out_in_playins';
        
        console.log('✅ Valid drop! TeamID:', teamId, '| Badge:', badgeType, '| Rank:', rank);
        
        setPlayInOutcomes(prev => {
          const updated = {
            ...prev,
            [teamId]: badgeType,
          };
          console.log('📊 Updated playInOutcomes:', updated);
          return updated;
        });
        
        toast.success(`Badge applied to rank ${rank} team!`);
        return;
      } else {
        console.log('❌ Not a valid team target');
        toast.error('Can only drop badges on teams ranked 7-10');
        return;
      }
    }

    // Handle team reordering
    console.log('🔄 Team reordering...');
    if (active.id === over.id) return;

    const isEastTeam = eastTeams.some(t => t.id === active.id);
    const teams = isEastTeam ? eastTeams : westTeams;
    const setTeams = isEastTeam ? setEastTeams : setWestTeams;

    const oldIndex = teams.findIndex(t => t.id === active.id);
    const newIndex = teams.findIndex(t => t.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      setTeams(reorderTeams(teams, oldIndex, newIndex));
    }
  };

  // Handle save prediction
  const handleSave = async () => {
    // Validate play-in outcomes for teams in positions 7-10
    const allTeams = [...eastTeams, ...westTeams];
    const playInTeams = allTeams.filter((team, index) => {
      const rank = (index % 15) + 1;
      return rank >= 7 && rank <= 10;
    });

    const missingOutcomes = playInTeams.filter(team => !playInOutcomes[team.id]);
    
    if (missingOutcomes.length > 0) {
      toast.error(`Please assign play-in outcomes to all teams ranked 7-10`);
      return;
    }

    startTransition(async () => {
      const result = await createPrediction({
        eastConference: getTeamIds(eastTeams),
        westConference: getTeamIds(westTeams),
        season: CURRENT_SEASON,
        playInOutcomes,
      });

      if (result.success) {
        toast.success(isEditing ? 'Prediction updated successfully!' : 'Prediction saved successfully!');
        router.push('/');
      } else {
        toast.error(result.error || 'Failed to save prediction');
      }
    });
  };

  // Reset to alphabetical order
  const handleReset = () => {
    setEastTeams([...initialEastTeams]);
    setWestTeams([...initialWestTeams]);
    setPlayInOutcomes({});
    toast.info('Reset to alphabetical order');
  };

  // Custom collision detection for debugging
  const customCollision = (args: any) => {
    console.log('🔍 Collision detection called:', args);
    const pointerCollisions = pointerWithin(args);
    console.log('Pointer collisions:', pointerCollisions);
    
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    
    return rectIntersection(args);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollision}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-8">
        {/* Instructions */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            {isEditing ? 'Edit Your Prediction' : 'Make Your Prediction'}
          </h1>
          <p className="text-gray-400">
            Drag and drop teams to rank them in order from 1st to 15th place
          </p>
          {isEditing && (
            <p className="text-sm text-yellow-500">
              You're editing your existing prediction
            </p>
          )}
          {isDraggingBadge && (
            <p className="text-sm text-blue-400 animate-pulse">
              Drop on teams ranked 7-10 to assign play-in outcome
            </p>
          )}
        </div>

        {/* Draggable Badges */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Play-in Outcomes (Drag to teams ranked 7-10)
          </h3>
          <div className="flex gap-4 flex-wrap">
            <DraggablePlayInBadge type="makes_playoffs" />
            <DraggablePlayInBadge type="out_in_playins" />
          </div>
          <p className="text-sm text-gray-400 mt-3">
            Drag these badges onto teams in play-in positions (7-10) to indicate whether they'll make the playoffs or be eliminated.
          </p>
        </div>

        {/* Two Conference Columns */}
        <div className="grid md:grid-cols-2 gap-8">
          <ConferenceList 
            title="Eastern Conference" 
            teams={eastTeams}
            playInOutcomes={playInOutcomes}
            isDraggingBadge={isDraggingBadge}
          />
          <ConferenceList 
            title="Western Conference" 
            teams={westTeams}
            playInOutcomes={playInOutcomes}
            isDraggingBadge={isDraggingBadge}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isPending}
          >
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="min-w-32"
          >
            {isPending ? 'Saving...' : isEditing ? 'Update Prediction' : 'Save Prediction'}
          </Button>
        </div>
      </div>
    </DndContext>
  );
}