import React from 'react';

interface Stage {
  name: string;
  status: 'completed' | 'current' | 'pending';
  explain?: string;
}

interface ProgressTrackerProps {
  stages: Stage[];
}

export function ProgressTracker({ stages }: ProgressTrackerProps) {
  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1">
            <div className={`h-3 w-3 rounded-full border-2 transition-colors duration-300 ${
              stage.status === 'completed' ? 'bg-success-500 border-success-500' :
              stage.status === 'current' ? 'bg-primary-500 border-primary-500 ring-2 ring-primary-200' :
              'bg-white border-neutral-300'
            }`} title={stage.explain} />
            <span className={`text-[10px] whitespace-nowrap ${stage.status === 'completed' ? 'text-success-600 font-medium' : stage.status === 'current' ? 'text-primary-600 font-medium' : 'text-neutral-400'}`}>
              {stage.name}
            </span>
          </div>
          {i < stages.length - 1 && (
            <div className={`h-0.5 flex-1 ${stage.status === 'completed' ? 'bg-success-300' : 'bg-neutral-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
