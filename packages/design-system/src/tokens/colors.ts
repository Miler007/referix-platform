/**
 * Referix Design Tokens — Colors
 * 
 * Paleta oficial de Referix.
 * Todos los componentes usan estos tokens, nunca valores directos.
 */

export const colors = {
  // Primary — Acción, confianza, profesionalismo
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#0066FF',   // Primary base
    600: '#0052CC',
    700: '#003DA6',
    800: '#002980',
    900: '#001A59',
  },
  // Success — Comisiones, activo, positivo
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  // Warning — Oportunidades, pending, hold
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  // Danger — Errores, cancelaciones, riesgo
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  // Neutral — Fondos, textos, bordes
  neutral: {
    50: '#F8F9FA',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  // Surface — Fondos de tarjetas y superficies
  surface: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    elevated: '#FFFFFF',
    modal: '#FFFFFF',
  },
} as const;

export type ColorToken = keyof typeof colors;
