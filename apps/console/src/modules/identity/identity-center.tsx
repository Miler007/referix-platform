import React from 'react';

export function IdentityCenter() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Centro de Gobierno / Seguridad</p>
        <h1 className="text-2xl font-bold text-neutral-900">Seguridad y acceso</h1>
        <p className="text-sm text-neutral-500 mt-1">Administra usuarios, roles y políticas de seguridad</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Usuarios activos', value: 12, icon: '👤' },
          { label: 'Roles', value: 4, icon: '🔖' },
          { label: 'Sesiones activas', value: 8, icon: '🔑' },
          { label: 'Auditoría registrada', value: '1,247', icon: '📋' },
        ].map((k, i) => (
          <div key={i} className="rounded-xl bg-white border p-4">
            <div className="flex items-center justify-between mb-1"><p className="text-xs text-neutral-500">{k.label}</p><span>{k.icon}</span></div>
            <p className="text-2xl font-bold text-neutral-900">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Users */}
        <div className="rounded-xl bg-white border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-neutral-900">Usuarios</h2>
            <button className="rounded-lg bg-primary-500 text-white px-3 py-1.5 text-xs font-medium">+ Invitar</button>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Admin INTERPLAY', email: 'admin@interplay.com', role: 'Administrador', status: 'online' as const },
              { name: 'María García', email: 'maria@referix.com', role: 'Referidor', status: 'online' as const },
              { name: 'Carlos Ruiz', email: 'carlos@referix.com', role: 'Técnico', status: 'offline' as const },
              { name: 'Ana López', email: 'ana@referix.com', role: 'Supervisor', status: 'online' as const },
            ].map((u, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-600">{u.name.charAt(0)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-900">{u.name}</p>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'online' ? 'bg-success-500' : 'bg-neutral-300'}`} />
                  </div>
                  <p className="text-xs text-neutral-500">{u.email} · {u.role}</p>
                </div>
                <button className="text-xs text-primary-600">Editar</button>
              </div>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="rounded-xl bg-white border p-5">
          <h2 className="font-semibold text-neutral-900 mb-4">Roles y permisos</h2>
          <div className="space-y-2">
            {[
              { role: 'Administrador', users: 2, perms: 16 },
              { role: 'Supervisor', users: 3, perms: 8 },
              { role: 'Técnico', users: 5, perms: 3 },
              { role: 'Referidor', users: 4, perms: 4 },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{r.role}</p>
                  <p className="text-xs text-neutral-500">{r.users} usuarios · {r.perms} permisos</p>
                </div>
                <button className="text-xs text-primary-600">Configurar</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Permission matrix preview */}
      <div className="rounded-xl bg-white border p-5 mt-6">
        <h2 className="font-semibold text-neutral-900 mb-4">Matriz de permisos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-neutral-500 uppercase">
                <th className="text-left py-2 font-medium">Permiso</th>
                <th className="text-center py-2 font-medium">Admin</th>
                <th className="text-center py-2 font-medium">Supervisor</th>
                <th className="text-center py-2 font-medium">Técnico</th>
                <th className="text-center py-2 font-medium">Referidor</th>
              </tr>
            </thead>
            <tbody>
              {[
                { perm: 'Crear ventas', admin: '✅', sup: '✅', tech: '❌', ref: '✅' },
                { perm: 'Aprobar ventas', admin: '✅', sup: '✅', tech: '❌', ref: '❌' },
                { perm: 'Iniciar instalación', admin: '✅', sup: '❌', tech: '✅', ref: '❌' },
                { perm: 'Liberar comisiones', admin: '✅', sup: '❌', tech: '❌', ref: '❌' },
                { perm: 'Configurar empresa', admin: '✅', sup: '❌', tech: '❌', ref: '❌' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-neutral-50">
                  <td className="py-2.5 text-neutral-900">{row.perm}</td>
                  <td className="text-center py-2.5">{row.admin}</td>
                  <td className="text-center py-2.5">{row.sup}</td>
                  <td className="text-center py-2.5">{row.tech}</td>
                  <td className="text-center py-2.5">{row.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
