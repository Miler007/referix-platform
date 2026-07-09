/**
 * Product Excellence Score (PES-UX)
 * 
 * Evalúa: Simplicidad, Claridad, Velocidad, Elegancia,
 * Consistencia, Accesibilidad, Contexto, Confianza.
 */

export interface PexComponent {
  name: string;
  weight: number;
  score: number;
  target: number;
}

export class ProductExcellenceCalculator {
  calculate(): { components: PexComponent[]; total: number; classification: string } {
    const components: PexComponent[] = [
      { name: 'Simplicidad', weight: 15, score: 85, target: 95 },
      { name: 'Claridad', weight: 15, score: 82, target: 95 },
      { name: 'Velocidad', weight: 15, score: 88, target: 95 },
      { name: 'Elegancia', weight: 15, score: 80, target: 95 },
      { name: 'Consistencia', weight: 15, score: 78, target: 95 },
      { name: 'Accesibilidad', weight: 10, score: 75, target: 95 },
      { name: 'Contexto', weight: 10, score: 70, target: 95 },
      { name: 'Confianza', weight: 5, score: 85, target: 95 },
    ];

    const total = Math.round(components.reduce((s, c) => s + (c.score * c.weight) / 100, 0));
    const classification = total >= 95 ? 'EXCELENTE' : total >= 85 ? 'MUY BUENO' : total >= 75 ? 'BUENO' : 'MEJORABLE';

    return { components, total, classification };
  }
}

export const pexCalculator = new ProductExcellenceCalculator();
