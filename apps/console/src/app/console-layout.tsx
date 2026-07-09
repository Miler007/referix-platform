import React, { useState } from 'react';

const modules = [
  { id: 'org', label: 'Organización', icon: '🏢', color: 'bg-primary-500' },
  { id: 'commercial', label: 'Comercial', icon: '📊', color: 'bg-success-500' },
  { id: 'operations', label: 'Operaciones', icon: '🔧', color: 'bg-warning-600' },
  { id: 'financial', label: 'Financiero', icon: '💰', color: 'bg-emerald-500' },
  { id: 'identity', label: 'Seguridad', icon: '🔐', color: 'bg-danger-500' },
  { id: 'integrations', label: 'Integraciones', icon: '🔗', color: 'bg-indigo-500' },
  { id: 'workflow', label: 'Workflows', icon: '🔄', color: 'bg-purple-500' },
  { id: 'features', label: 'Features', icon: '🚩', color: 'bg-cyan-500' },
  { id: 'monitoring', label: 'Monitoreo', icon: '📈', color: 'bg-neutral-600' },
  { id: 'ai', label: 'IA', icon: '🤖', color: 'bg-violet-500' },
];

interface ConsoleLayoutProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
  children: React.ReactNode;
}

export function ConsoleLayout({ activeModule, onModuleChange, children }: ConsoleLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-4 border-b border-neutral-100">
          <h1 className="text-lg font-bold text-primary-600">Referix</h1>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Console</p>
        </div>

        {/* Global Search */}
        <div className="px-3 pt-3">
          <button onClick={() => setSearchOpen(true)} className="w-full flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-200 transition-colors">
            <span>🔍</span>
            <span>Buscar en Referix...</span>
            <span className="ml-auto text-[10px] text-neutral-400 bg-white px-1.5 py-0.5 rounded">⌘K</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {modules.map(m => (
            <button
              key={m.id}
              onClick={() => onModuleChange(m.id)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                activeModule === m.id ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <span className="text-lg">{m.icon}</span>
              {m.label}
              {activeModule === m.id && <span className={`ml-auto w-1.5 h-1.5 rounded-full ${m.color}`} />}
            </button>
          ))}
        </nav>

        {/* Tenant info */}
        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">I</div>
            <div>
              <p className="font-medium text-neutral-900">INTERPLAY</p>
              <p className="text-[10px] text-neutral-400">Demo · Plan Enterprise</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-20" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-4 border-b">
              <span className="text-lg">🔍</span>
              <input autoFocus className="flex-1 outline-none text-lg placeholder-neutral-300" placeholder="Buscar usuarios, planes, instalaciones..." />
              <span className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">ESC</span>
            </div>
            <div className="p-2">
              {[
                { icon: '👤', text: 'María García — Referidor', type: 'Usuario' },
                { icon: '📡', text: 'Fibra 300MB — Plan', type: 'Plan' },
                { icon: '🔧', text: 'INS-0042 — Instalación', type: 'Instalación' },
                { icon: '💰', text: 'COM-0012 — Comisión', type: 'Comisión' },
              ].map((r, i) => (
                <button key={i} className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-neutral-50 text-left">
                  <span className="text-lg">{r.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">{r.text}</p>
                    <p className="text-[10px] text-neutral-400">{r.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
