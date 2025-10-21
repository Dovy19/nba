'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Example {
  team: string;
  predicted: number;
  actual: number;
  predictedBadge?: '🟡 Makes Playoffs' | '🔴 Out';
  actualOutcome?: string;
  points: {
    exact: { earned: boolean; reason: string };
    category: { earned: boolean; reason: string };
    playoff: { earned: boolean; reason: string };
  };
  total: number;
  description: string;
}

const examples: Example[] = [
  {
    team: "Boston Celtics",
    predicted: 1,
    actual: 1,
    points: {
      exact: { earned: true, reason: "Exact seed match!" },
      category: { earned: true, reason: "Correct category (Seeds 1-6: Playoffs)" },
      playoff: { earned: true, reason: "Made playoffs (Seeds 1-6 auto-qualify)" },
    },
    total: 3,
    description: "Perfect prediction! Top 6 seeds automatically make playoffs. (✓✓✓)",
  },
  {
    team: "Miami Heat",
    predicted: 8,
    actual: 8,
    predictedBadge: '🟡 Makes Playoffs',
    actualOutcome: 'Won play-in games',
    points: {
      exact: { earned: true, reason: "Exact seed match!" },
      category: { earned: true, reason: "Correct category (Seeds 7-10: Play-in)" },
      playoff: { earned: true, reason: "Correct badge! They won play-in" },
    },
    total: 3,
    description: "Perfect play-in prediction! Badge was crucial here. (✓✓✓)",
  },
  {
    team: "Phoenix Suns",
    predicted: 7,
    actual: 7,
    predictedBadge: '🟡 Makes Playoffs',
    actualOutcome: 'Lost both play-in games',
    points: {
      exact: { earned: true, reason: "Exact seed match!" },
      category: { earned: true, reason: "Correct category (Play-in)" },
      playoff: { earned: false, reason: "Wrong badge - they lost play-in" },
    },
    total: 2,
    description: "Right seed and tier, but wrong badge hurt you. (✓✓✗)",
  },
  {
    team: "Los Angeles Lakers",
    predicted: 9,
    actual: 10,
    predictedBadge: '🔴 Out',
    actualOutcome: 'Lost both play-in games',
    points: {
      exact: { earned: false, reason: "Wrong seed (off by 1 spot)" },
      category: { earned: true, reason: "Correct category (Play-in)" },
      playoff: { earned: true, reason: "Correct badge! They lost play-in" },
    },
    total: 2,
    description: "Close on seed, right badge prediction saved points. (✗✓✓)",
  },
  {
    team: "Milwaukee Bucks",
    predicted: 3,
    actual: 5,
    points: {
      exact: { earned: false, reason: "Wrong seed (off by 2 spots)" },
      category: { earned: true, reason: "Correct category (Both Seeds 1-6)" },
      playoff: { earned: true, reason: "Made playoffs (Seeds 1-6 auto-qualify)" },
    },
    total: 2,
    description: "Close! Right tier and playoff status. (✗✓✓)",
  },
  {
    team: "Golden State Warriors",
    predicted: 5,
    actual: 8,
    predictedBadge: '🟡 Makes Playoffs',
    actualOutcome: 'Won play-in games',
    points: {
      exact: { earned: false, reason: "Wrong seed (off by 3 spots)" },
      category: { earned: false, reason: "Wrong category (predicted 1-6, finished 7-10)" },
      playoff: { earned: true, reason: "They made playoffs through play-in" },
    },
    total: 1,
    description: "Overestimated them, but they did make playoffs. (✗✗✓)",
  },
  {
    team: "Portland Trail Blazers",
    predicted: 9,
    actual: 13,
    predictedBadge: '🔴 Out',
    actualOutcome: 'Missed playoffs',
    points: {
      exact: { earned: false, reason: "Wrong seed (off by 4 spots)" },
      category: { earned: false, reason: "Wrong category (predicted 7-10, finished 11-15)" },
      playoff: { earned: true, reason: "Correct - they missed playoffs" },
    },
    total: 1,
    description: "Wrong placement but knew they'd miss playoffs. (✗✗✓)",
  },
  {
    team: "Detroit Pistons",
    predicted: 6,
    actual: 15,
    points: {
      exact: { earned: false, reason: "Completely wrong seed" },
      category: { earned: false, reason: "Way off - predicted playoffs, finished last" },
      playoff: { earned: false, reason: "Predicted playoffs, missed entirely" },
    },
    total: 0,
    description: "Ouch! Completely missed this one. (✗✗✗)",
  },
];

export function ExamplesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? examples.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === examples.length - 1 ? 0 : prev + 1));
  };

  const currentExample = examples[currentIndex];
  const isPlayIn = currentExample.predicted >= 7 && currentExample.predicted <= 10;

  return (
    <div className="space-y-4">
      {/* Example Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Example {currentIndex + 1} of {examples.length}
        </p>
        <div className="flex gap-2">
          {examples.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-600'
              }`}
              aria-label={`Go to example ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Example Content */}
      <div className="relative">
        <div className="space-y-4 text-gray-300">
          <div>
            <p className="mb-2">
              <strong className="text-white">Your Prediction:</strong>{' '}
              {currentExample.team} finish {currentExample.predicted}
              {currentExample.predicted === 1 ? 'st' : currentExample.predicted === 2 ? 'nd' : currentExample.predicted === 3 ? 'rd' : 'th'}
              {isPlayIn && currentExample.predictedBadge && (
                <span className="ml-2 text-sm">
                  ({currentExample.predictedBadge})
                </span>
              )}
            </p>
            <p className="mb-3">
              <strong className="text-white">Actual Result:</strong>{' '}
              {currentExample.team} finish {currentExample.actual}
              {currentExample.actual === 1 ? 'st' : currentExample.actual === 2 ? 'nd' : currentExample.actual === 3 ? 'rd' : 'th'}
              {currentExample.actualOutcome && (
                <span className="ml-2 text-sm text-gray-400">
                  ({currentExample.actualOutcome})
                </span>
              )}
            </p>
            
            <div className="pl-4 border-l-2 border-blue-500/30 space-y-2">
              <p className="text-sm">
                {currentExample.points.exact.earned ? '✅' : '❌'}{' '}
                <strong className={currentExample.points.exact.earned ? 'text-green-400' : 'text-red-400'}>
                  {currentExample.points.exact.earned ? '+1 point' : '+0 points'}
                </strong>{' '}
                - {currentExample.points.exact.reason}
              </p>
              <p className="text-sm">
                {currentExample.points.category.earned ? '✅' : '❌'}{' '}
                <strong className={currentExample.points.category.earned ? 'text-green-400' : 'text-red-400'}>
                  {currentExample.points.category.earned ? '+1 point' : '+0 points'}
                </strong>{' '}
                - {currentExample.points.category.reason}
              </p>
              <p className="text-sm">
                {currentExample.points.playoff.earned ? '✅' : '❌'}{' '}
                <strong className={currentExample.points.playoff.earned ? 'text-green-400' : 'text-red-400'}>
                  {currentExample.points.playoff.earned ? '+1 point' : '+0 points'}
                </strong>{' '}
                - {currentExample.points.playoff.reason}
              </p>
              <p className="text-sm font-semibold text-white mt-3 pt-3 border-t border-gray-700">
                Total: {currentExample.total} out of 3 points for {currentExample.team}
              </p>
              <p className="text-sm text-gray-400 italic mt-2">
                {currentExample.description}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}