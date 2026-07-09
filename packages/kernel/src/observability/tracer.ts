import { logger } from './structured-logger';

interface Span {
  name: string;
  traceId: string;
  spanId: string;
  parentSpanId: string | null;
  startTime: number;
  endTime: number | null;
  tags: Record<string, string>;
  status: 'OK' | 'ERROR';
  error?: string;
}

export class Tracer {
  private spans = new Map<string, Span[]>();

  startSpan(name: string, traceId: string, parentSpanId?: string): { traceId: string; spanId: string } {
    const spanId = `${traceId}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    const span: Span = { name, traceId, spanId, parentSpanId: parentSpanId ?? null, startTime: Date.now(), endTime: null, tags: {}, status: 'OK' };
    const spans = this.spans.get(traceId) ?? [];
    spans.push(span);
    this.spans.set(traceId, spans);
    return { traceId, spanId };
  }

  endSpan(traceId: string, spanId: string, status: 'OK' | 'ERROR' = 'OK', error?: string): void {
    const spans = this.spans.get(traceId);
    if (!spans) return;
    const span = spans.find(s => s.spanId === spanId);
    if (!span) return;
    span.endTime = Date.now();
    span.status = status;
    span.error = error;

    if (status === 'ERROR') {
      logger.error(`Span ${span.name} failed`, undefined, { traceId, spanId, duration: span.endTime - span.startTime });
    }
  }

  setTag(traceId: string, spanId: string, key: string, value: string): void {
    const spans = this.spans.get(traceId);
    if (!spans) return;
    const span = spans.find(s => s.spanId === spanId);
    if (!span) return;
    span.tags[key] = value;
  }

  getTrace(traceId: string): Span[] {
    return this.spans.get(traceId) ?? [];
  }

  generateTraceId(): string {
    return `trace-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

export const tracer = new Tracer();
