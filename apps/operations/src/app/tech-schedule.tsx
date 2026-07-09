import React from 'react';

// Principle 3: Workflow First — technician sees their day as a workflow
// Principle 4: Explainability — each installation shows what's needed
// Offline First — all data preloaded for offline work

const todayJobs = [
  {
    id: 'INS-001', client: 'Pedro Martínez', address: 'Av. Reforma 123, Centro',
    time: '09:00 - 11:00', type: 'FTTH', status: 'pending' as const,
    requirements: ['ONT', 'Router', 'Fibra 20m'],
    sla: '48h desde solicitud',
  },
  {
    id: 'INS-002', client: 'Laura García', address: 'Calle 5 de Mayo 45, Norte',
    time: '11:30 - 13:30', type: 'FTTH', status: 'ready' as const,
    requirements: ['ONT', 'Router', 'Mástil'],
    sla: '12h restante',
  },
  {
    id: 'INS-003', client: 'Carlos Ruiz', address: 'Av. Insurgentes 789, Sur',
    time: '14:00 - 16:00', type: 'HFC', status: 'completed' as const,
    requirements: ['Amplificador', 'Cable'],
    sla: 'Completada',
  },
];

export function TechSchedule() {
  const statusColors = { pending: 'bg-warning-100 text-warning-700', ready: 'bg-primary-100 text-primary-700', completed: 'bg-success-100 text-success-700' };
  const statusLabels = { pending: 'Pendiente', ready: 'Lista', completed: 'Completada' };

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">Buenos días, Carlos 👷</h1>
        <p className="text-sm text-neutral-500">Tienes 3 instalaciones hoy</p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="rounded-lg bg-white p-3 border text-center">
          <p className="text-2xl font-bold text-primary-600">3</p>
          <p className="text-[10px] text-neutral-500">Asignadas</p>
        </div>
        <div className="rounded-lg bg-white p-3 border text-center">
          <p className="text-2xl font-bold text-success-600">1</p>
          <p className="text-[10px] text-neutral-500">Completadas</p>
        </div>
        <div className="rounded-lg bg-white p-3 border text-center">
          <p className="text-2xl font-bold text-warning-600">2</p>
          <p className="text-[10px] text-neutral-500">Pendientes</p>
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {todayJobs.map((job) => (
          <div key={job.id} className={`rounded-xl bg-white border p-4 shadow-sm ${job.status === 'ready' ? 'ring-2 ring-primary-200' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-neutral-900">{job.client}</h3>
                <p className="text-xs text-neutral-500">{job.address}</p>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[job.status]}`}>{statusLabels[job.status]}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-600 mb-3">
              <span>🕐 {job.time}</span>
              <span>📡 {job.type}</span>
              <span>⏱ {job.sla}</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {job.requirements.map((req, i) => (
                <span key={i} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">{req}</span>
              ))}
            </div>

            {job.status !== 'completed' && (
              <div className="flex gap-2">
                <button className="flex-1 rounded-lg bg-primary-500 py-2.5 text-white text-sm font-medium">▶ Iniciar</button>
                <button className="rounded-lg border border-neutral-300 py-2.5 px-3 text-sm">📍</button>
                <button className="rounded-lg border border-neutral-300 py-2.5 px-3 text-sm">📞</button>
              </div>
            )}

            {job.status === 'completed' && (
              <div className="flex items-center gap-2 text-success-600 text-sm">
                <span>✅ Completada — 3 evidencias, 1 firma</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Offline indicator */}
      <div className="mt-6 rounded-xl bg-warning-50 border border-warning-200 p-3 text-sm text-warning-700 flex items-center gap-2">
        <span>📶</span>
        <span>Modo offline — Los cambios se sincronizarán automáticamente cuando tengas conexión</span>
      </div>
    </div>
  );
}
