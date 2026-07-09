import React from 'react';

const kpis = [
  { label: 'Ventas del mes', value: '47', subtitle: '12 vs mes anterior', trend: { value: 34, positive: true } },
  { label: 'Ingreso recurrente', value: '$18,453', subtitle: 'Próximo mes estimado: $21,200', trend: { value: 15, positive: true } },
  { label: 'Comisión pendiente', value: '$3,240', subtitle: '14 comisiones en hold' },
  { label: 'Técnicos activos', value: '8', subtitle: '3 en ruta ahora' },
];

const funnelData = [
  { stage: 'Registrados', count: 100, pct: 100 },
  { stage: 'Cobertura OK', count: 87, pct: 87 },
  { stage: 'Aprobados', count: 65, pct: 65 },
  { stage: 'Instalados', count: 52, pct: 52 },
  { stage: 'Activos', count: 47, pct: 47 },
  { stage: 'Comisión pagada', count: 39, pct: 39 },
];

const topReferidors = [
  { name: 'María García', sales: 12, commission: '$450', conversion: '75%' },
  { name: 'José Hernández', sales: 8, commission: '$312', conversion: '62%' },
  { name: 'Ana López', sales: 6, commission: '$225', conversion: '50%' },
];

export function ConsoleDashboard() {
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Panel de control — INTERPLAY</h1>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <div key={i} className="rounded-xl bg-white border p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{kpi.label}</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{kpi.value}</p>
            <p className="text-xs text-neutral-400 mt-1">{kpi.subtitle}</p>
            {kpi.trend && (
              <p className={`text-xs font-medium mt-1 ${kpi.trend.positive ? 'text-success-600' : 'text-danger-600'}`}>
                {kpi.trend.positive ? '↑' : '↓'} {kpi.trend.value}%
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Funnel + Referidors */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-4 shadow-sm">
          <h2 className="font-semibold text-neutral-900 mb-4">Embudo de ventas</h2>
          <div className="space-y-2">
            {funnelData.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-28 text-xs text-neutral-600 text-right">{f.stage}</span>
                <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full flex items-center justify-end pr-2 text-[10px] text-white font-medium" style={{ width: `${f.pct}%` }}>
                    {f.pct > 20 ? f.count : ''}
                  </div>
                </div>
                <span className="w-8 text-xs text-neutral-500">{f.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white border p-4 shadow-sm">
          <h2 className="font-semibold text-neutral-900 mb-4">Top referidores</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-neutral-500 uppercase border-b">
                <th className="text-left py-2 font-medium">Nombre</th>
                <th className="text-right py-2 font-medium">Ventas</th>
                <th className="text-right py-2 font-medium">Comisión</th>
                <th className="text-right py-2 font-medium">Conversión</th>
              </tr>
            </thead>
            <tbody>
              {topReferidors.map((r, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="py-2.5 font-medium">{r.name}</td>
                  <td className="py-2.5 text-right">{r.sales}</td>
                  <td className="py-2.5 text-right text-success-600 font-medium">{r.commission}</td>
                  <td className="py-2.5 text-right">{r.conversion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-white border p-4 shadow-sm">
        <h2 className="font-semibold text-neutral-900 mb-4">Actividad reciente</h2>
        <div className="space-y-3">
          {[
            { event: 'Venta registrada', detail: 'María García → Pedro Martínez', time: 'Hace 10 min', type: 'success' as const },
            { event: 'Instalación completada', detail: 'Técnico Carlos Ruiz → Laura García', time: 'Hace 45 min', type: 'success' as const },
            { event: 'Comisión liberada', detail: 'Venta #SUB-2024-0124 — $12.50', time: 'Hace 2h', type: 'success' as const },
            { event: 'Venta perdida', detail: 'Cliente rechazó precio', time: 'Hace 3h', type: 'danger' as const },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${a.type === 'success' ? 'bg-success-500' : 'bg-danger-500'}`} />
                <div>
                  <p className="text-sm font-medium text-neutral-900">{a.event}</p>
                  <p className="text-xs text-neutral-500">{a.detail}</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
