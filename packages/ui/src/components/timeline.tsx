import React from 'react';

interface TimelineStep {
  event: string;
  description: string;
  timestamp: Date;
  actorId?: string | null;
  active?: boolean;
}

interface TimelineProps {
  steps: TimelineStep[];
}

const eventIcons: Record<string, string> = {
  REFERRAL_CREATED: '📋', CONTACTED: '📞', QUALIFIED: '✅', WON: '🏆', LOST: '❌',
  INSTALLED: '🔧', COMPLETED: '✅', FAILED: '⚠️', ACTIVATED: '🚀',
  COMMISSION_GENERATED: '💰', COMMISSION_PAID: '💵',
};

export function Timeline({ steps }: TimelineProps) {
  return (
    <ol className="relative border-l border-neutral-200 ml-3">
      {steps.map((step, i) => (
        <li key={i} className={`mb-6 ml-6 ${step.active ? 'opacity-100' : 'opacity-60'}`}>
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-2 ring-neutral-200 text-sm">
            {eventIcons[step.event] ?? '•'}
          </span>
          <div className="text-sm">
            <p className="font-medium text-neutral-900">{step.description}</p>
            <p className="text-neutral-500 text-xs mt-0.5">
              {step.timestamp.toLocaleString()} {step.actorId ? `· ${step.actorId}` : ''}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
