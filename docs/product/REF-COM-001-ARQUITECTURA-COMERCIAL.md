# REF-COM-001 — Arquitectura Comercial de Referix

**Status:** Aprobado (Blueprint oficial del módulo comercial)
**Autor:** Miler (Chief Product & Enterprise Architect)
**Date:** 2024-07-09

---

## 1. Misión

Referix no es un sistema para registrar ventas. Es el sistema operativo del área comercial de INTERPLAY. Su objetivo es acompañar al asesor desde que ingresa hasta que construye una cartera de clientes satisfechos.

## 2. Filosofía

- El asesor no vende megas — recomienda la mejor solución de conectividad
- Nunca se premiará vender un plan superior si el cliente no lo necesita
- Nunca se permitirá recomendar un plan insuficiente
- CERE es el asesor técnico del vendedor, no un recomendador de planes

## 3. Ciclo de Vida Comercial

18 etapas: Reclutamiento → Creación del usuario → Onboarding → Certificación → Asignación de zona → Inicio de operaciones → Prospección → Diagnóstico del cliente → Recomendación CERE → Venta → Validación documental → Instalación → Activación → Seguimiento → Fidelización → Upgrade → Referidos

## 4. Módulos (Fase 1 — Implementado)

| Módulo | Estado |
|---|---|
| Sales App | ✅ |
| Catálogo Comercial | ✅ |
| CERE (Recomendación) | ✅ |
| Oportunidades | ✅ |
| Comisiones | ✅ |
| Dashboard | ✅ |
| Customer 360 | ✅ |

## 5. Módulos (Fase 2 — Pendiente)

- Agenda inteligente
- Integración con WhatsApp
- Firma digital
- Geolocalización de visitas
- Escaneo automático de documentos

## 6. Índice Integral del Asesor (IIA)

| Indicador | Peso |
|---|---|
| Ventas | 35% |
| Calidad de recomendación (CERE) | 20% |
| Conversión | 10% |
| Seguimiento de oportunidades | 10% |
| Documentación correcta | 10% |
| Satisfacción del cliente | 10% |
| Fidelización | 5% |

## 7. Directriz de desarrollo

Toda nueva funcionalidad comercial debe responder:

1. ¿Reduce el tiempo del asesor?
2. ¿Disminuye errores?
3. ¿Ayuda a recomendar el plan correcto?
4. ¿Mejora la experiencia del cliente?

Si la respuesta es "no" a alguna, debe replantearse.
