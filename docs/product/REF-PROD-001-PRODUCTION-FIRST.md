# REF-PROD-001 — Production First

**Status:** Plan oficial
**Date:** 2024-07-09
**Stage:** XIII — Production Ready

---

## 1. Objetivo

Preparar Referix para la operación real de INTERPLAY. Toda decisión debe responder: **"¿Esto acerca a Referix a ser utilizado todos los días por el equipo de INTERPLAY?"**

## 2. Regla Principal

Queda prohibido desarrollar nuevas funcionalidades si alguna existente:
- tiene datos simulados
- presenta errores
- no funciona en móviles
- requiere demasiados clics
- no está conectada al backend
- tiene problemas de accesibilidad o rendimiento

## 3. Procesos Mínimos para Operar

| Área | Procesos |
|---|---|
| **Comercial** | Reclutar, crear usuario, asignar rol, prospectos, seguimiento, venta, instalación, comisión |
| **Operaciones** | Agenda, técnicos, estados, materiales, reagendamientos, cierre |
| **Soporte** | Buscar cliente, abrir caso, diagnóstico, historial, escalamiento, solución |
| **Administración** | Usuarios, roles, catálogo, comisiones, reportes, configuración |

## 4. Mobile First

- Diseñado para celular desde el inicio
- Usable con un dedo, sin zoom, sin scroll horizontal
- Botones grandes, lectura inmediata
- Tablet: aprovecha espacio
- PC: más contexto, no estirar móvil

## 5. Offline

- Catálogo descargado
- Oportunidades sin conexión
- Documentos y fotos offline
- Sincronización automática al recuperar conexión

## 6. Rendimiento

- Abrir en < 2 segundos
- Cero bloqueos
- Caché inteligente

## 7. Calidad

Probar en: Chrome, Edge, Safari, Android, iPhone, Tablet Android, iPad, Windows

## 8. Definición de v1.0

> Primera venta real desde un teléfono Android, un iPhone y un computador, usando el mismo backend, con datos reales y sin intervención manual.
