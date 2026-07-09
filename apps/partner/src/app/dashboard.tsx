import React from 'react';

// Principle 1: Task Driven UI — speaks "registrar una venta", not "create a referral"
// Principle 3: Workflow First — shows where the user is in their sales journey
// Principle 5: Live Platform — real-time activity feed showing platform is alive

const summaryKpis = [
  { label: 'Ventas este mes', value: 12, subtitle: '3 en proceso', trend: { value: 25, positive: true } },
  { label: 'Comisiones pendientes', value: '$2,450', subtitle: '5 comisiones en hold' },
  { label: 'Disponible para retirar', value: '$850', subtitle: 'Próximo pago: 5 días' },
  { label: 'Clientes activos', value: 8, subtitle: '0 cancelaciones' },
];

const recentActivity = [
  { action: 'Instalación completada', detail: 'Cliente: Pedro Martínez', time: 'Hace 2 horas', icon: '🔧' },
  { action: 'Comisión liberada', detail: 'Venta #SUB-2024-0124 — $12.50', time: 'Hace 5 horas', icon: '💰' },
  { action: 'Nueva venta registrada', detail: 'Cliente: Laura García — $49.99/mes', time: 'Hace 1 día', icon: '📋' },
  { action: 'Pago confirmado', detail: 'Factura INV-042 — $49.99', time: 'Hace 2 días', icon: '✅' },
];

const activeReferrals = [
  { client: 'Pedro Martínez', stage: 'Instalación', stageIdx: 4, totalStages: 7, status: 'Progreso' as const },
  { client: 'Laura García', stage: 'Validación', stageIdx: 1, totalStages: 7, status: 'Pendiente' as const },
  { client: 'Carlos Ruiz', stage: 'Comisión lista', stageIdx: 6, totalStages: 7, status: 'Listo' as const },
];

const allStages = ['Registrado', 'Cobertura', 'Validación', 'Aprobación', 'Instalación', 'Activación', 'Comisión'];

export function PartnerDashboard() {
  return (
    <div className="min-h-screen bg-neutral-50 p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">¡Hola, María! 👋</h1>
        <p className="text-sm text-neutral-500">Tus ventas van muy bien este mes</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {summaryKpis.map((kpi, i) => (
          <div key={i} className="rounded-xl bg-white p-3 shadow-sm border border-neutral-100">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">{kpi.label}</p>
            <p className="mt-1 text-xl font-bold text-neutral-900">{kpi.value}</p>
            {kpi.subtitle && <p className="text-[10px] text-neutral-400 mt-0.5">{kpi.subtitle}</p>}
            {kpi.trend && (
              <p className={`text-xs font-medium mt-1 ${kpi.trend.positive ? 'text-success-600' : 'text-danger-600'}`}>
                {kpi.trend.positive ? '↑' : '↓'} {kpi.trend.value}% vs mes anterior
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Task: Primary Action (Principle 1) */}
      <button className="w-full mb-6 rounded-xl bg-primary-500 py-4 text-center text-white font-semibold text-lg shadow-lg hover:bg-primary-600 active:scale-[0.98] transition-all">
        Registrar una venta
      </button>

      {/* Workflow Progress (Principle 3) */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-3">Tus ventas en progreso</h2>
        {activeReferrals.map((ref, i) => (
          <div key={i} className="mb-3 rounded-xl bg-white p-3 shadow-sm border border-neutral-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-neutral-900">{ref.client}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                ref.status === 'Listo' ? 'bg-success-100 text-success-700' :
                ref.status === 'Progreso' ? 'bg-primary-100 text-primary-700' :
                'bg-warning-100 text-warning-700'
              }`}>{ref.stage}</span>
            </div>
            <div className="flex gap-1">
              {allStages.map((s, j) => (
                <div key={j} className={`h-1.5 flex-1 rounded-full ${j < ref.stageIdx ? 'bg-success-400' : j === ref.stageIdx ? 'bg-primary-400' : 'bg-neutral-200'}`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Live Activity Feed (Principle 5) */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-700 mb-3">Actividad reciente</h2>
        {recentActivity.map((item, i) => (
          <div key={i} className="flex items-start gap-3 mb-3">
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900">{item.action}</p>
              <p className="text-xs text-neutral-500">{item.detail}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
