import React from 'react';

interface MoneyProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'positive' | 'negative' | 'muted';
}

export function Money({ amount, currency = 'USD', size = 'md', variant = 'default' }: MoneyProps) {
  const formatted = new Intl.NumberFormat('es-MX', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);
  const colorMap = { default: 'text-neutral-900', positive: 'text-success-600', negative: 'text-danger-600', muted: 'text-neutral-500' };
  const sizeMap = { sm: 'text-sm', md: 'text-base font-semibold', lg: 'text-2xl font-bold' };

  return <span className={`${colorMap[variant]} ${sizeMap[size]}`}>{formatted}</span>;
}
