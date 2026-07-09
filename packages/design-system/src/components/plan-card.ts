/**
 * PlanCard — Componente inteligente de tarjeta de plan
 * 
 * Muestra no solo velocidad y precio, sino:
 * - Perfil recomendado (personas, dispositivos)
 * - Si incluye TV Digital HD
 * - Tecnología (GPON/Radio)
 * - Compatibilidad CERE
 * - Riesgo de soporte
 * - Comisión (según permisos)
 * - Instalación y documentos
 */

export interface PlanCardProps {
  name: string;
  price: number;
  downloadSpeed: number;
  isSymmetric: boolean;
  technology: string;
  hasTv: boolean;
  tvLabel?: string;
  
  // Perfil recomendado
  suggestedPeople?: string;
  suggestedDevices?: string;
  suggestedUses?: string[];
  
  // CERE
  compatibility?: number;
  risk?: string;
  estimatedLifeYears?: number;
  
  // Comercial
  commission?: number;
  commissionLabel?: string;
  
  // Operativo
  installDays?: string;
  requiredDocs?: string[];
  
  // Badges
  badges?: string[];
  
  // Estado
  selected?: boolean;
  onClick?: () => void;
}

export function renderPlanCard(props: PlanCardProps): string {
  const {
    name, price, downloadSpeed, isSymmetric, technology, hasTv, tvLabel,
    suggestedPeople, suggestedDevices, suggestedUses,
    compatibility, risk, estimatedLifeYears,
    commission, commissionLabel,
    installDays, requiredDocs,
    selected, onClick,
  } = props;

  const commAmount = commission ?? Math.round((price || 0) * 0.1);

  return `
    <div class="ds-plan-card ${selected ? 'ds-plan-card--selected' : ''}" 
         onclick="${onClick ? 'window.handlePlanClick && window.handlePlanClick()' : ''}"
         style="background:#fff;border:2px solid ${selected ? '#0066FF' : '#F0F0F0'};border-radius:16px;padding:24px;margin-bottom:16px;cursor:pointer;transition:all .2s">
      
      <!-- Badges -->
      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        <span style="background:#EFF6FF;color:#0066FF;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600">🔵 ${technology || 'GPON'}</span>
        ${isSymmetric ? '<span style="background:#ECFDF5;color:#059669;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600">⚡ Simétrico</span>' : ''}
        ${hasTv ? '<span style="background:#FEF3C7;color:#D97706;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600">🟢 TV GRATIS</span>' : ''}
        ${compatibility && compatibility >= 90 ? '<span style="background:#F3E8FF;color:#9333EA;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600">⭐ CERE</span>' : ''}
        ${(badges || []).map(b => `<span style="background:#F3F4F6;color:#374151;padding:3px 10px;border-radius:999px;font-size:11px">${b}</span>`).join('')}
      </div>

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
        <div>
          <p style="font-size:18px;font-weight:700;color:#111827;margin-bottom:2px">${name}</p>
          <p style="font-size:13px;color:#6B7280">${downloadSpeed} Mbps Simétricos · ${technology || 'Fibra Óptica'}</p>
        </div>
        <div style="text-align:right">
          <p style="font-size:28px;font-weight:800;color:#0066FF">$${price.toLocaleString('es-CO')}</p>
          <p style="font-size:12px;color:#9CA3AF">/mes · $${Math.round(price/30).toLocaleString('es-CO')}/día</p>
        </div>
      </div>

      <!-- Perfil recomendado -->
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
        ${suggestedPeople ? `<span style="background:#F3F4F6;padding:4px 10px;border-radius:6px;font-size:12px">👥 ${suggestedPeople}</span>` : ''}
        ${suggestedDevices ? `<span style="background:#F3F4F6;padding:4px 10px;border-radius:6px;font-size:12px">📱 ${suggestedDevices}</span>` : ''}
        ${(suggestedUses || []).map(u => `<span style="background:#F3F4F6;padding:4px 10px;border-radius:6px;font-size:12px">${u}</span>`).join('')}
      </div>

      <!-- TV Status -->
      <div style="margin-bottom:12px">
        ${hasTv 
          ? '<span style="color:#059669;font-size:13px">✅ TV Digital HD GRATIS (120+ canales)</span>'
          : '<span style="color:#6B7280;font-size:13px">📺 TV no incluida — puede agregarse posteriormente</span>'}
      </div>

      <!-- Beneficios -->
      <hr style="border:none;border-top:1px solid #F0F0F0;margin:12px 0">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-bottom:12px">
        <span style="font-size:13px;color:#374151">✓ ${downloadSpeed} Mbps ${isSymmetric ? 'Simétricos' : ''}</span>
        <span style="font-size:13px;color:#374151">✓ Internet Ilimitado</span>
        <span style="font-size:13px;color:#374151">✓ Router WiFi incluido</span>
        <span style="font-size:13px;color:#374151">🛠 Instalación profesional</span>
      </div>

      <!-- CERE Metrics -->
      ${compatibility ? `
      <hr style="border:none;border-top:1px solid #F0F0F0;margin:12px 0">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        <div style="background:#ECFDF5;padding:8px;border-radius:8px;text-align:center">
          <p style="font-size:14px;font-weight:700;color:#059669">${compatibility}%</p>
          <p style="font-size:10px;color:#059669">Compatibilidad</p>
        </div>
        <div style="background:#EFF6FF;padding:8px;border-radius:8px;text-align:center">
          <p style="font-size:14px;font-weight:700;color:#0066FF">${risk || 'Bajo'}</p>
          <p style="font-size:10px;color:#0066FF">Riesgo</p>
        </div>
        <div style="background:#F3F4F6;padding:8px;border-radius:8px;text-align:center">
          <p style="font-size:14px;font-weight:700;color:#374151">${estimatedLifeYears || 3}+ años</p>
          <p style="font-size:10px;color:#6B7280">Vida útil</p>
        </div>
      </div>` : ''}

      <!-- Comisión -->
      <hr style="border:none;border-top:1px solid #F0F0F0;margin:12px 0">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px;font-weight:600;color:#059669">💰 Comisión: $${commAmount.toLocaleString('es-CO')}</span>
        <span style="font-size:11px;color:#9CA3AF">${commissionLabel || 'según reglas vigentes'}</span>
      </div>

      <!-- Instalación y documentos -->
      <div style="display:flex;justify-content:space-between;margin-top:8px">
        <span style="font-size:11px;color:#6B7280">⏱ ${installDays || '2-3 días hábiles'}</span>
        <span style="font-size:11px;color:#6B7280">📄 ${(requiredDocs || ['Cédula', 'Recibo']).join(' · ')}</span>
      </div>
    </div>`;
}
