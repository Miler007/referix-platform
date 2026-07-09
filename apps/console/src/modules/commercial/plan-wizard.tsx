import React, { useState } from 'react';

type WizardStep = 'info' | 'speed' | 'price' | 'coverage' | 'commission' | 'review';

const steps: { id: WizardStep; label: string; icon: string }[] = [
  { id: 'info', label: 'Información', icon: '📋' },
  { id: 'speed', label: 'Velocidad', icon: '🚀' },
  { id: 'price', label: 'Precio', icon: '💰' },
  { id: 'coverage', label: 'Cobertura', icon: '🗺️' },
  { id: 'commission', label: 'Comisión', icon: '📊' },
  { id: 'review', label: 'Confirmar', icon: '✅' },
];

export function PlanWizard() {
  const [step, setStep] = useState<WizardStep>('info');
  const [plan, setPlan] = useState({ name: '', technology: 'FTTH', speed: 100, price: 299, zoneIds: [] as string[], commissionRate: 15 });

  const currentIdx = steps.findIndex(s => s.id === step);

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < steps.length) setStep(steps[nextIdx].id);
  };

  const handleBack = () => {
    if (currentIdx > 0) setStep(steps[currentIdx - 1].id);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Centro de Gobierno / Comercial</p>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Crear nuevo plan</h1>
      <p className="text-sm text-neutral-500 mb-6">Configura un nuevo plan de internet para tus clientes</p>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              i === currentIdx ? 'bg-primary-500 text-white' :
              i < currentIdx ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-400'
            }`}>
              <span>{s.icon}</span>
              <span className={i < currentIdx ? '' : 'hidden sm:inline'}>{s.label}</span>
              {i < currentIdx && <span>✓</span>}
            </div>
            {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${i < currentIdx ? 'bg-success-300' : 'bg-neutral-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Info */}
      {step === 'info' && (
        <div className="rounded-xl bg-white border p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Información general</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Nombre del plan</label>
              <input value={plan.name} onChange={e => setPlan({ ...plan, name: e.target.value })} className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm" placeholder="Ej: Fibra 300MB" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Tecnología</label>
              <select value={plan.technology} onChange={e => setPlan({ ...plan, technology: e.target.value })} className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm bg-white">
                <option>FTTH</option><option>HFC</option><option>FWA</option><option>LTE</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Descripción</label>
              <textarea className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm" rows={3} placeholder="Descripción del plan para los referidores..." />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex justify-end">
            <button onClick={handleNext} className="rounded-lg bg-primary-500 text-white px-6 py-2.5 text-sm font-medium">Continuar →</button>
          </div>
        </div>
      )}

      {/* Step 2: Speed */}
      {step === 'speed' && (
        <div className="rounded-xl bg-white border p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Velocidad y tecnología</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Velocidad de descarga (Mbps)</label>
              <div className="flex items-center gap-3">
                <input type="range" min="10" max="1000" value={plan.speed} onChange={e => setPlan({ ...plan, speed: Number(e.target.value) })} className="flex-1" />
                <span className="text-lg font-bold text-primary-600 w-16 text-right">{plan.speed} Mbps</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Velocidad de subida (Mbps)</label>
              <input type="number" defaultValue={Math.round(plan.speed * 0.5)} className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm" />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex justify-between">
            <button onClick={handleBack} className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm">← Atrás</button>
            <button onClick={handleNext} className="rounded-lg bg-primary-500 text-white px-6 py-2.5 text-sm font-medium">Continuar →</button>
          </div>
        </div>
      )}

      {/* Step 3: Price */}
      {step === 'price' && (
        <div className="rounded-xl bg-white border p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Precio</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Precio mensual</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-neutral-500">$</span>
                <input type="number" value={plan.price} onChange={e => setPlan({ ...plan, price: Number(e.target.value) })} className="w-full rounded-lg border border-neutral-300 pl-8 pr-3 py-2.5 text-lg font-bold" />
              </div>
            </div>
            <div className="rounded-lg bg-primary-50 border border-primary-200 p-3 text-sm text-primary-800">
              💡 Sugerencia: Los planes entre $299 y $699 tienen la mejor tasa de conversión en INTERPLAY.
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex justify-between">
            <button onClick={handleBack} className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm">← Atrás</button>
            <button onClick={handleNext} className="rounded-lg bg-primary-500 text-white px-6 py-2.5 text-sm font-medium">Continuar →</button>
          </div>
        </div>
      )}

      {/* Step 4: Coverage */}
      {step === 'coverage' && (
        <div className="rounded-xl bg-white border p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Zonas de cobertura</h2>
          <p className="text-sm text-neutral-500 mb-4">¿En qué zonas estará disponible este plan?</p>
          <div className="space-y-2">
            {[
              { id: 'z1', name: 'Centro', tech: 'FTTH', boxes: 16 },
              { id: 'z2', name: 'Norte', tech: 'FTTH', boxes: 8 },
              { id: 'z3', name: 'Sur', tech: 'HFC', boxes: 12 },
            ].map(z => (
              <label key={z.id} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${plan.zoneIds.includes(z.id) ? 'border-primary-500 bg-primary-50' : 'hover:bg-neutral-50'}`}>
                <input type="checkbox" checked={plan.zoneIds.includes(z.id)} onChange={e => setPlan({ ...plan, zoneIds: e.target.checked ? [...plan.zoneIds, z.id] : plan.zoneIds.filter(id => id !== z.id) })} className="rounded accent-primary-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">{z.name}</p>
                  <p className="text-xs text-neutral-500">{z.tech} · {z.boxes} cajas</p>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t flex justify-between">
            <button onClick={handleBack} className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm">← Atrás</button>
            <button onClick={handleNext} className="rounded-lg bg-primary-500 text-white px-6 py-2.5 text-sm font-medium">Continuar →</button>
          </div>
        </div>
      )}

      {/* Step 5: Commission */}
      {step === 'commission' && (
        <div className="rounded-xl bg-white border p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Comisión para referidores</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Porcentaje de comisión</label>
              <div className="flex items-center gap-3">
                <input type="range" min="5" max="50" value={plan.commissionRate} onChange={e => setPlan({ ...plan, commissionRate: Number(e.target.value) })} className="flex-1" />
                <span className="text-lg font-bold text-success-600 w-16 text-right">{plan.commissionRate}%</span>
              </div>
            </div>
            <div className="rounded-lg bg-success-50 border border-success-200 p-3">
              <p className="text-sm text-success-800 font-medium">Comisión estimada por venta</p>
              <p className="text-2xl font-bold text-success-600 mt-1">${(plan.price * plan.commissionRate / 100).toFixed(2)}</p>
              <p className="text-xs text-success-700 mt-1">Basado en el precio mensual de ${plan.price}/mes</p>
            </div>
            <div className="rounded-lg bg-neutral-50 border p-3 text-xs text-neutral-600">
              ⏱ Período de garantía: La comisión se liberará 15 días después del primer pago confirmado.
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex justify-between">
            <button onClick={handleBack} className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm">← Atrás</button>
            <button onClick={handleNext} className="rounded-lg bg-primary-500 text-white px-6 py-2.5 text-sm font-medium">Revisar →</button>
          </div>
        </div>
      )}

      {/* Step 6: Review */}
      {step === 'review' && (
        <div className="rounded-xl bg-white border p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Confirma el nuevo plan</h2>
          <div className="rounded-lg border divide-y mb-6">
            <div className="flex justify-between p-3"><span className="text-sm text-neutral-500">Nombre</span><span className="text-sm font-medium">{plan.name || 'Fibra 300MB'}</span></div>
            <div className="flex justify-between p-3"><span className="text-sm text-neutral-500">Tecnología</span><span className="text-sm font-medium">{plan.technology}</span></div>
            <div className="flex justify-between p-3"><span className="text-sm text-neutral-500">Velocidad</span><span className="text-sm font-medium">{plan.speed} Mbps</span></div>
            <div className="flex justify-between p-3"><span className="text-sm text-neutral-500">Precio</span><span className="text-sm font-bold">${plan.price}/mes</span></div>
            <div className="flex justify-between p-3"><span className="text-sm text-neutral-500">Zonas</span><span className="text-sm font-medium">{plan.zoneIds.length} seleccionadas</span></div>
            <div className="flex justify-between p-3"><span className="text-sm text-neutral-500">Comisión</span><span className="text-sm font-medium text-success-600">{plan.commissionRate}% (${(plan.price * plan.commissionRate / 100).toFixed(2)})</span></div>
          </div>

          {/* Explainability Administrativa */}
          <div className="rounded-lg bg-primary-50 border border-primary-200 p-3 text-sm text-primary-800 mb-6">
            ℹ️ Este plan estará disponible para todos los referidores aprobados. Las comisiones se calcularán automáticamente según la política configurada. Los planes existentes no serán modificados.
          </div>

          <div className="flex justify-between">
            <button onClick={handleBack} className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm">← Atrás</button>
            <button className="rounded-lg bg-success-500 text-white px-8 py-2.5 text-sm font-semibold">✅ Crear plan</button>
          </div>
        </div>
      )}
    </div>
  );
}
