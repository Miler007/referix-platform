import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; positive: boolean };
  icon?: string;
}

export function KpiCard({ label, value, subtitle, trend, icon }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-neutral-400">{subtitle}</p>}
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trend.positive ? 'text-success-600' : 'text-danger-600'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  );
}
