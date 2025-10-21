'use client';

import dynamic from 'next/dynamic';
import { Team } from '@/lib/data/teams';

const PredictionBuilder = dynamic(
  () => import('./prediction-builder').then(mod => ({ default: mod.PredictionBuilder })),
  { ssr: false }
);

interface PredictionBuilderWrapperProps {
  initialEastTeams: Team[];
  initialWestTeams: Team[];
  isEditing: boolean;
  initialPlayInOutcomes: Record<number, 'makes_playoffs' | 'out_in_playins'>;
}

export function PredictionBuilderWrapper(props: PredictionBuilderWrapperProps) {
  return <PredictionBuilder {...props} />;
}