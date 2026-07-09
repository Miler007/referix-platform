/**
 * EH-005: Chaos Engineering — Escenarios de falla validados
 * 
 * Documenta el comportamiento esperado vs observado bajo condiciones de falla.
 */

export interface ChaosScenario {
  id: string;
  name: string;
  target: string;
  fault: string;
  expectedBehavior: string;
  observedBehavior?: string;
  recovery: string;
  dataLoss: boolean;
  rto?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'not_tested' | 'passed' | 'failed' | 'mitigated';
}

export const chaosScenarios: ChaosScenario[] = [
  {
    id: 'CHAOS-001', name: 'PostgreSQL no disponible',
    target: 'Base de datos', fault: 'Conexión a PostgreSQL interrumpida',
    expectedBehavior: 'HealthCheck reporta unhealthy. API devuelve 503. No hay pérdida de datos.',
    recovery: 'Restaurar conexión PostgreSQL. HealthCheck reporta healthy.',
    dataLoss: false, severity: 'critical', status: 'not_tested',
  },
  {
    id: 'CHAOS-002', name: 'Redis fuera de servicio',
    target: 'Cache', fault: 'Redis no responde',
    expectedBehavior: 'CacheService falla a L1 (memoria). Aplicación sigue funcionando con datos en memoria.',
    recovery: 'Redis restaurado. Cache L2 se repuebla automáticamente.',
    dataLoss: false, rto: '<1min', severity: 'medium', status: 'not_tested',
  },
  {
    id: 'CHAOS-003', name: 'Google Maps lento',
    target: 'Cobertura', fault: 'API de Google Maps responde en >5s',
    expectedBehavior: 'CoverageService usa datos cacheados. El usuario ve cobertura basada en última respuesta válida.',
    recovery: 'Timeout configurable. Fallback a datos locales.',
    dataLoss: false, severity: 'medium', status: 'not_tested',
  },
  {
    id: 'CHAOS-004', name: 'Provisioning provider caído',
    target: 'Provisioning', fault: 'MikroTik/Huawei no responde',
    expectedBehavior: 'ProvisioningRequest queda en estado FAILED con rollback automático. Installation no pierde datos.',
    recovery: 'Reintento automático cada 5 min (hasta 3 intentos). Notificación al coordinador.',
    dataLoss: false, severity: 'high', status: 'not_tested',
  },
  {
    id: 'CHAOS-005', name: 'Payment gateway rechaza',
    target: 'Financiero', fault: 'Wompi/Stripe devuelve error',
    expectedBehavior: 'Payment queda en estado PENDING. Commission no se genera. Se reintenta de forma asíncrona.',
    recovery: 'Reprocesar pago manualmente desde Console.',
    dataLoss: false, severity: 'high', status: 'not_tested',
  },
  {
    id: 'CHAOS-006', name: 'Email/SMS no disponible',
    target: 'Notificaciones', fault: 'Proveedor de correo fuera de servicio',
    expectedBehavior: 'NotificationCenter registra el envío como fallido. Los eventos de negocio no se pierden.',
    recovery: 'Reintento automático. Notificación en Console de integración caída.',
    dataLoss: false, severity: 'low', status: 'not_tested',
  },
  {
    id: 'CHAOS-007', name: 'Event Bus detenido',
    target: 'Eventos', fault: 'Cola de eventos no procesa mensajes',
    expectedBehavior: 'Outbox acumula eventos no procesados. Aplicación sigue funcionando. Eventos no se pierden.',
    recovery: 'Event Bus restaurado. Outbox Relay publica eventos pendientes.',
    dataLoss: false, severity: 'high', status: 'not_tested',
  },
  {
    id: 'CHAOS-008', name: 'Cola saturada',
    target: 'Jobs', fault: '10,000 mensajes encolados simultáneamente',
    expectedBehavior: 'Consumer procesa en lotes. Throughput se degrada pero no hay pérdida.',
    recovery: 'Cola se drena automáticamente. Monitoreo alerta sobre profundidad.',
    dataLoss: false, severity: 'medium', status: 'not_tested',
  },
  {
    id: 'CHAOS-009', name: 'Disco lleno',
    target: 'Infraestructura', fault: 'Disco al 100% de capacidad',
    expectedBehavior: 'HealthCheck reporta unhealthy. Operaciones de escritura fallan controladamente.',
    recovery: 'Liberar espacio. Verificar integridad de datos.',
    dataLoss: true, severity: 'critical', status: 'not_tested',
  },
  {
    id: 'CHAOS-010', name: 'Webhook duplicado',
    target: 'Integraciones', fault: 'Mismo webhook recibido dos veces',
    expectedBehavior: 'IdempotencyKey previene doble procesamiento. No se generan comisiones duplicadas.',
    recovery: 'Automático — el segundo evento se ignora.',
    dataLoss: false, severity: 'high', status: 'not_tested',
  },
];
