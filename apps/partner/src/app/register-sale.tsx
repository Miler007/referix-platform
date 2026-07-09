import React, { useState } from 'react';

// Principle 1: Task Driven UI — "Registrar una venta", not "Create Referral"
// Principle 2: Zero Training — Self-explanatory flow, 5 minutes
// Principle 3: Workflow First — Shows current step and progress
// Principle 4: Explainability — Every decision explains itself

type Step = 'coverage' | 'prospect' | 'confirm' | 'result';

export function RegisterSale() {
  const [step, setStep] = useState<Step>('coverage');
  const [address, setAddress] = useState('');
  const [coverageResult, setCoverageResult] = useState<{ available: boolean; explanation: string[] } | null>(null);

  const checkCoverage = () => {
    setCoverageResult({
      available: true,
      explanation: [
        'Zona: Centro (FTTH) — Cobertura disponible',
        'Caja: CT-42 — 3 puertos libres de 16',
        'Velocidad máxima: 1 Gbps',
        'Instalación estimada: 48 horas',
      ],
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      {/* Step indicator (Principle 3) */}
      <div className="flex items-center gap-2 mb-6">
        {(['coverage', 'prospect', 'confirm', 'result'] as Step[]).map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step === s ? 'bg-primary-500 text-white ring-2 ring-primary-200' :
              ['coverage', 'prospect', 'confirm'].indexOf(step) >= i ? 'bg-success-500 text-white' :
              'bg-neutral-200 text-neutral-500'
            }`}>{i + 1}</div>
            {i < 3 && <div className={`h-0.5 flex-1 ${['coverage', 'prospect', 'confirm'].indexOf(step) > i ? 'bg-success-400' : 'bg-neutral-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <h1 className="text-lg font-bold text-neutral-900 mb-1">Registrar una venta</h1>
      <p className="text-sm text-neutral-500 mb-6">Completa los datos del cliente para registrar la venta</p>

      {/* Step 1: Coverage (Principle 4 — explainability) */}
      {step === 'coverage' && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Dirección del cliente</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Ej: Av. Reforma 123, Col. Centro"
            className="w-full rounded-xl border border-neutral-300 p-3 text-sm mb-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
          />
          <button onClick={checkCoverage} disabled={!address} className="w-full rounded-xl bg-primary-500 py-3 text-white font-medium disabled:opacity-50 mb-4">
            Verificar cobertura
          </button>

          {coverageResult && (
            <div className={`rounded-xl border p-4 ${coverageResult.available ? 'bg-success-50 border-success-200' : 'bg-danger-50 border-danger-200'}`}>
              <p className={`font-semibold mb-2 ${coverageResult.available ? 'text-success-700' : 'text-danger-700'}`}>
                {coverageResult.available ? '✅ ¡Cobertura disponible!' : '❌ Sin cobertura'}
              </p>
              <ul className="space-y-1">
                {coverageResult.explanation.map((line, i) => (
                  <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                    <span className="text-success-500 mt-0.5">•</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {coverageResult?.available && (
            <button onClick={() => setStep('prospect')} className="w-full mt-4 rounded-xl bg-success-500 py-3 text-white font-medium">
              Continuar — Cliente tiene cobertura
            </button>
          )}
        </div>
      )}

      {/* Step 2: Prospect data */}
      {step === 'prospect' && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre completo</label>
          <input className="w-full rounded-xl border border-neutral-300 p-3 text-sm mb-3 focus:border-primary-500 outline-none" placeholder="Nombre del cliente" />

          <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono</label>
          <input className="w-full rounded-xl border border-neutral-300 p-3 text-sm mb-3 focus:border-primary-500 outline-none" placeholder="+52 55 1234 5678" type="tel" />

          <label className="block text-sm font-medium text-neutral-700 mb-1">Correo (opcional)</label>
          <input className="w-full rounded-xl border border-neutral-300 p-3 text-sm mb-3 focus:border-primary-500 outline-none" placeholder="cliente@email.com" type="email" />

          <label className="block text-sm font-medium text-neutral-700 mb-1">Plan seleccionado</label>
          <select className="w-full rounded-xl border border-neutral-300 p-3 text-sm mb-4 focus:border-primary-500 outline-none bg-white">
            <option>Fibra 100MB — $299/mes</option>
            <option>Fibra 300MB — $449/mes</option>
            <option>Fibra 1GB — $699/mes</option>
          </select>

          <div className="flex gap-3 mb-4">
            <button className="flex-1 rounded-xl border border-neutral-300 p-3 text-sm text-center text-neutral-600 hover:bg-neutral-50">
              📷 Agregar foto (opcional)
            </button>
            <div className="flex-1 rounded-xl border border-neutral-300 p-3 text-sm text-center text-neutral-400 bg-neutral-50">
              📍 GPS automático
            </div>
          </div>

          <button onClick={() => setStep('confirm')} className="w-full rounded-xl bg-primary-500 py-3 text-white font-medium">
            Continuar
          </button>
        </div>
      )}

      {/* Step 3: Confirmation (Principle 4 — explainability) */}
      {step === 'confirm' && (
        <div>
          <div className="rounded-xl bg-white border border-neutral-200 p-4 mb-4">
            <h3 className="font-semibold text-neutral-900 mb-3">Resumen de la venta</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Cliente</span><span>Pedro Martínez</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Dirección</span><span>Av. Reforma 123, Centro</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Plan</span><span>Fibra 300MB</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Precio</span><span className="font-semibold">$449/mes</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Tu comisión estimada</span><span className="font-semibold text-success-600">$67.35</span></div>
            </div>
          </div>

          {/* Explainability (Principle 4) */}
          <div className="rounded-xl bg-primary-50 border border-primary-200 p-3 mb-4 text-sm text-primary-800">
            💡 La comisión se liberará automáticamente cuando el cliente pague su primera factura.
            Tiempo estimado: 30 días.
          </div>

          <button onClick={() => setStep('result')} className="w-full rounded-xl bg-success-500 py-4 text-white font-semibold text-lg">
            ✅ Confirmar y registrar venta
          </button>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 'result' && (
        <div className="text-center pt-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">¡Venta registrada!</h2>
          <p className="text-neutral-500 mb-6">Tu venta ha sido registrada con éxito. Ahora sigue estos pasos:</p>

          <div className="text-left rounded-xl bg-white border border-neutral-200 p-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center text-success-600 font-semibold">1</div>
                <div><p className="font-medium text-sm">Validación de cobertura</p><p className="text-xs text-neutral-500">Completado automáticamente</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">2</div>
                <div><p className="font-medium text-sm">Aprobación del supervisor</p><p className="text-xs text-neutral-500">En proceso — recibirás notificación</p></div>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 font-semibold">3</div>
                <div><p className="font-medium text-sm text-neutral-400">Instalación</p><p className="text-xs text-neutral-400">Pendiente de agendar</p></div>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 font-semibold">4</div>
                <div><p className="font-medium text-sm text-neutral-400">Comisión disponible</p><p className="text-xs text-neutral-400">Después de primera factura pagada</p></div>
              </div>
            </div>
          </div>

          <button className="w-full rounded-xl bg-primary-500 py-3 text-white font-medium">
            Volver al inicio
          </button>
        </div>
      )}
    </div>
  );
}
