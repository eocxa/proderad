# Documentación Backend - ProDental Radiología

## Índice

| Documento | Descripción |
|-----------|-------------|
| [Arquitectura Backend](./BACKEND_ARCHITECTURE.md) | Stack Next.js+Supabase, integración Google Calendar, n8n, WhatsApp, chatbot |
| [Estructura de APIs](./API_STRUCTURE.md) | 8 grupos de endpoints: services, offices, rentals, chatbot, whatsapp, n8n, calendar, notifications |
| [Modelo de Datos](./DATA_MODEL.md) | 7 tablas: users, services, offices, rentals, whatsapp_messages, n8n_workflows, notifications |
| [Diagrama ER](./ER_DIAGRAM.md) | Diagrama entidad-relación + flujos chatbot, renta y WhatsApp |

## Plan de Ejecución

- [Plan de Ejecución Dental Corregido](./PLAN_EJECUCION_DENTAL_CORREGIDO.pdf) — Timeline 9 semanas, roles del equipo

## Resumen del Sistema

**ProDental Radiología** es una plataforma que complementa lo que el cliente ya tiene:

| El cliente ya tiene | Lo que construimos nosotros |
|---------------------|-----------------------------|
| DentalPro360 (expedientes, notas, reportes) | No se toca |
| Google Calendar (agenda de citas) | Chatbot web + WhatsApp que consultan Calendar |
| | Página web moderna con catálogo de servicios |
| | Sistema de renta de consultorios |
| | ~8 automatizaciones n8n (recordatorios, confirmaciones) |
| | Panel admin (gestionar rentas, ver logs) |

### Tecnologías
- **Frontend + Backend**: Next.js 16 + React 19 + TailwindCSS 4
- **Base de Datos**: Supabase (PostgreSQL, 7 tablas)
- **Agenda**: Google Calendar API (solo lectura, fuente del cliente)
- **Automatizaciones**: n8n en Docker / Raspberry Pi 5
- **WhatsApp**: WhatsApp Business API (Meta)
- **Despliegue**: Vercel (free tier)

### Roles
- `admin` — Gestiona rentas, ve logs
- `super_admin` — Nosotros (acceso total)

### Costo operativo mensual: $0 USD

## Próximos Pasos

1. Configurar proyecto Supabase y crear 7 tablas
2. Obtener Google Calendar ID + API Key del cliente
3. Configurar WhatsApp Business Account + webhook
4. Instalar n8n en Raspberry Pi y crear 8 flujos
5. Desarrollar página web (servicios, renta consultorios)
6. Integrar chatbot web en la página
7. Probar webhook WhatsApp con Meta
8. Panel admin simple para gestionar rentas
