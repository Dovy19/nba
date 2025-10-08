'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { Team } from '@/lib/data/teams';
import { ConferenceList } from './conference-list';
import { Button } from '@/components/ui/button';
import { reorderTeams, getTeamIds } from '@/lib/utils/team-helpers';
import { createPrediction } from '@/lib/actions/predictions/create-prediction';
import { CURRENT_SEASON } from '@/lib/utils/constants';
import { toast } from 'sonner';

interface PredictionBuilderProps {
  initialEastTeams: Team[];
  initialWestTeams: Team[];
  isEditing?: boolean;
}

export function PredictionBuilder({
  initialEastTeams,
  initialWestTeams,
  isEditing = false,
}: PredictionBuilderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [eastTeams, setEastTeams] = useState<Team[]>(initialEastTeams);
  const [westTeams, setWestTeams] = useState<Team[]>(initialWestTeams);

  // Configure sensors for drag-and-drop (works on desktop and mobile)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms hold required on mobile
        tolerance: 5,
      },
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Determine which conference is being dragged
    const isEastTeam = eastTeams.some(t => t.id === active.id);
    const teams = isEastTeam ? eastTeams : westTeams;
    const setTeams = isEastTeam ? setEastTeams : setWestTeams;

    // Find indices
    const oldIndex = teams.findIndex(t => t.id === active.id);
    const newIndex = teams.findIndex(t => t.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      setTeams(reorderTeams(teams, oldIndex, newIndex));
    }
  };

  // Handle save prediction
  const handleSave = async () => {
    startTransition(async () => {
      const result = await createPrediction({
        eastConference: getTeamIds(eastTeams),
        westConference: getTeamIds(westTeams),
        season: CURRENT_SEASON,
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
    toast.info('Reset to alphabetical order');
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
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
        </div>

        {/* Two Conference Columns */}
        <div className="grid md:grid-cols-2 gap-8">
          <ConferenceList title="Eastern Conference" teams={eastTeams} />
          <ConferenceList title="Western Conference" teams={westTeams} />
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