import React, { useState } from 'react';

type OrgSection = 'general' | 'branding' | 'coverage' | 'hours';

export function OrganizationCenter() {
  const [section, setSection] = useState<OrgSection>('general');

  const sections = [
    { id: 'general' as const, label: 'Información general', icon: '🏢' },
    { id: 'branding' as const, label: 'Branding', icon: '🎨' },
    { id: 'coverage' as const, label: 'Zonas de cobertura', icon: '🗺️' },
    { id: 'hours' as const, label: 'Horarios y festivos', icon: '🕐' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Centro de Gobierno / Organización</p>
        <h1 className="text-2xl font-bold text-neutral-900">Organización</h1>
        <p className="text-sm text-neutral-500 mt-1">Administra la configuración general de INTERPLAY</p>
      </div>

      {/* Completude indicator */}
      <div className="rounded-xl bg-white border p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">Configuración completa</span>
          <span className="text-sm font-semibold text-primary-600">65%</span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full" style={{ width: '65%' }} />
        </div>
        <p className="text-xs text-neutral-400 mt-2">Faltan: Branding (logo), Zonas de cobertura (3 polígonos), Festivos (5 días)</p>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
            section === s.id ? 'bg-primary-500 text-white' : 'bg-white border text-neutral-600 hover:bg-neutral-50'
          }`}>
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Section content */}
      {section === 'general' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl bg-white border p-5">
            <h2 className="font-semibold text-neutral-900 mb-4">Información de la empresa</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Nombre de la empresa</label>
                <input defaultValue="INTERPLAY Telecomunicaciones" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Moneda</label>
                  <select defaultValue="MXN" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white">
                    <option>MXN</option><option>USD</option><option>COP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Zona horaria</label>
                  <select defaultValue="America/Mexico_City" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white">
                    <option>America/Mexico_City</option><option>America/Bogota</option><option>America/Santiago</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">RFC / Tax ID</label>
                <input defaultValue="INT-20240101-ABC" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t flex justify-end gap-3">
              <button className="rounded-lg border border-neutral-300 px-4 py-2 text-sm">Cancelar</button>
              <button className="rounded-lg bg-primary-500 text-white px-4 py-2 text-sm font-medium">Guardar cambios</button>
            </div>
          </div>

          <div className="rounded-xl bg-white border p-5">
            <h2 className="font-semibold text-neutral-900 mb-4">Sucursales</h2>
            <div className="space-y-3">
              {[
                { name: 'Matriz', city: 'Ciudad de México', techs: 5, active: true },
                { name: 'Sucursal Norte', city: 'Monterrey', techs: 3, active: true },
                { name: 'Sucursal Sur', city: 'Guadalajara', techs: 2, active: false },
              ].map((b, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-neutral-900">{b.name}</p>
                      {b.active ? <span className="text-[10px] bg-success-100 text-success-700 px-1.5 py-0.5 rounded-full">Activa</span> : <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-full">Inactiva</span>}
                    </div>
                    <p className="text-xs text-neutral-500">{b.city} · {b.techs} técnicos</p>
                  </div>
                  <button className="text-xs text-primary-600 font-medium">Editar</button>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-lg border-2 border-dashed border-neutral-300 py-3 text-sm text-neutral-500 hover:border-primary-300 hover:text-primary-600 transition-colors">
              + Agregar sucursal
            </button>
          </div>
        </div>
      )}

      {section === 'branding' && (
        <div className="rounded-xl bg-white border p-5">
          <h2 className="font-semibold text-neutral-900 mb-4">Identidad de marca</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Logo principal</label>
              <div className="rounded-lg border-2 border-dashed border-neutral-300 p-8 text-center hover:border-primary-300 cursor-pointer transition-colors">
                <div className="text-4xl mb-2">🏢</div>
                <p className="text-sm text-neutral-500">Arrastra o selecciona el logo</p>
                <p className="text-xs text-neutral-400 mt-1">PNG, SVG. Máx 2MB</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Colores de marca</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500 border" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Color primario</p>
                    <p className="text-xs text-neutral-400">#0066FF · Aplica a botones, enlaces, encabezados</p>
                  </div>
                  <input defaultValue="#0066FF" className="w-24 rounded-lg border px-2 py-1 text-xs font-mono" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success-500 border" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Color de éxito</p>
                    <p className="text-xs text-neutral-400">#10B981 · Estados positivos, comisiones</p>
                  </div>
                  <input defaultValue="#10B981" className="w-24 rounded-lg border px-2 py-1 text-xs font-mono" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {section === 'coverage' && (
        <div className="rounded-xl bg-white border p-5">
          <h2 className="font-semibold text-neutral-900 mb-4">Zonas de cobertura</h2>
          <div className="space-y-3">
            {[
              { name: 'Centro', tech: 'FTTH', boxes: 16, saturation: '18%', color: 'bg-success-100 text-success-700' },
              { name: 'Norte', tech: 'FTTH', boxes: 8, saturation: '100%', color: 'bg-danger-100 text-danger-700' },
              { name: 'Sur', tech: 'HFC', boxes: 12, saturation: '45%', color: 'bg-warning-100 text-warning-700' },
            ].map((z, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-lg">🗺️</div>
                  <div>
                    <p className="font-medium text-sm text-neutral-900">{z.name}</p>
                    <p className="text-xs text-neutral-500">{z.tech} · {z.boxes} cajas</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${z.color}`}>{z.saturation} saturado</span>
                  <button className="text-xs text-primary-600 font-medium">Editar</button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-lg border-2 border-dashed border-neutral-300 py-3 text-sm text-neutral-500 hover:border-primary-300 hover:text-primary-600">
            + Agregar zona de cobertura
          </button>
        </div>
      )}

      {section === 'hours' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl bg-white border p-5">
            <h2 className="font-semibold text-neutral-900 mb-4">Horarios de atención</h2>
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, i) => (
              <div key={day} className={`flex items-center gap-3 py-2 ${i < 6 ? 'border-b border-neutral-100' : ''}`}>
                <span className="w-20 text-sm text-neutral-700">{day}</span>
                <input defaultValue={i < 6 ? '09:00' : ''} className="w-20 rounded-lg border px-2 py-1 text-sm" />
                <span className="text-neutral-400">a</span>
                <input defaultValue={i < 5 ? '18:00' : i === 5 ? '14:00' : ''} className="w-20 rounded-lg border px-2 py-1 text-sm" />
                {i >= 5 && <span className="text-xs text-neutral-400 ml-2">(Descanso)</span>}
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-white border p-5">
            <h2 className="font-semibold text-neutral-900 mb-4">Días festivos</h2>
            <div className="space-y-2">
              {[
                { date: '2024-01-01', name: 'Año Nuevo' },
                { date: '2024-02-05', name: 'Constitución' },
                { date: '2024-03-21', name: 'Natalicio de Juárez' },
                { date: '2024-05-01', name: 'Día del Trabajo' },
                { date: '2024-09-16', name: 'Independencia' },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{h.name}</p>
                    <p className="text-[10px] text-neutral-400">{h.date}</p>
                  </div>
                  <button className="text-xs text-danger-600 hover:text-danger-700">Eliminar</button>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-lg border-2 border-dashed border-neutral-300 py-2 text-sm text-neutral-500 hover:border-primary-300">
              + Agregar festivo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
