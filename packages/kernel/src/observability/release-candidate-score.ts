/**
 * Release Candidate Score (RCS)
 * 
 * Indicador único de madurez para el Release Candidate.
 * Solo cuando RCS >= 90, P0=0 y P1=0 se autoriza Pilot Day 1.
 */

export interface RCSComponent {
  name: string;
  weight: number;
  score: number;
  target: number;
  findings: string[];
}

export class RCSCalculator {
  calculate(): { components: RCSComponent[]; total: number; classification: string } {
    const components: RCSComponent[] = [
      {
        name: 'Backend', weight: 15, score: 88, target: 90,
        findings: ['APIs funcionales: 14 endpoints', 'Seed oficial INTERPLAY cargado', 'Pendiente: OpenAPI docs, tests de integración'],
      },
      {
        name: 'Frontend', weight: 15, score: 82, target: 90,
        findings: ['8 apps desplegadas', 'Login + router funcionando', 'Pendiente: auditoría mobile completa, estados empty/error'],
      },
      {
        name: 'UX', weight: 15, score: 78, target: 90,
        findings: ['Sales App con CERE v4 fluido', 'Customer 360 con 8 pestañas', 'Pendiente: pulir consistencia visual entre apps, textos comerciales'],
      },
      {
        name: 'Performance', weight: 10, score: 75, target: 90,
        findings: ['Carga inicial < 2s', 'Sin renders pesados', 'Pendiente: lazy loading en Customer 360, optimizar listas'],
      },
      {
        name: 'Stability', weight: 15, score: 70, target: 90,
        findings: ['Fallback en cobertura API', 'Búsqueda con fallback', 'Pendiente: manejo de errores global, try/catch en todos los flujos'],
      },
      {
        name: 'Security', weight: 10, score: 75, target: 90,
        findings: ['Tenant isolation middleware', 'Rate limiter', 'Pendiente: refresh token rotation, validación JWT expirado'],
      },
      {
        name: 'Integration', weight: 10, score: 65, target: 90,
        findings: ['Frontend-backend conectado', 'Customer 360 con API real', 'Pendiente: Partner wallet conectar, Console editar plan persistir'],
      },
      {
        name: 'Documentation', weight: 5, score: 80, target: 90,
        findings: ['RC Report generado', 'Bug Register completo', 'Pendiente: deployment checklist en README'],
      },
      {
        name: 'Business Audit', weight: 5, score: 75, target: 90,
        findings: ['Catálogo oficial INTERPLAY cargado', 'CERE con datos reales', 'Pendiente: validar con usuario real, ajustar textos comerciales'],
      },
    ];

    const total = components.reduce((sum, c) => sum + (c.score * c.weight) / 100, 0);
    const classification = total >= 90 ? 'Release Candidate' :
      total >= 75 ? 'Beta - Camino a RC' :
      total >= 60 ? 'Alpha' : 'Prototipo';

    return { components, total: Math.round(total), classification };
  }
}

export const rcsCalculator = new RCSCalculator();
