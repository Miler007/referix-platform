import React from 'react';

type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  explain?: string;
  size?: 'sm' | 'md';
}

const variantMap: Record<string, StatusVariant> = {
  ACTIVE: 'success', APPROVED: 'success', COMPLETED: 'success', PAID: 'success',
  PENDING: 'warning', HELD: 'warning', IN_PROGRESS: 'warning', SCHEDULED: 'info',
  REJECTED: 'danger', FAILED: 'danger', CANCELLED: 'danger', SUSPENDED: 'warning',
  EXPIRED: 'neutral', LOST: 'danger',
};

export function StatusBadge({ status, variant, explain, size = 'md' }: StatusBadgeProps) {
  const v = variant ?? variantMap[status] ?? 'neutral';
  const colorMap: Record<StatusVariant, string> = {
    success: 'bg-success-100 text-success-700 border-success-300',
    warning: 'bg-warning-100 text-warning-700 border-warning-300',
    danger: 'bg-danger-100 text-danger-700 border-danger-300',
    info: 'bg-primary-100 text-primary-700 border-primary-300',
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorMap[v]} ${size === 'sm' ? 'text-[10px] px-2 py-0' : ''}`} title={explain ?? undefined}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current ${size === 'sm' ? 'h-1 w-1' : ''}`} />
      {status}
    </span>
  );
}
