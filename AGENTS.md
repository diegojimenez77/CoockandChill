## AGENTS

1. Descripción del proyecto

Aplicación web para la gestión de solicitudes de servicios de mantenimiento y reparación de:

Equipos de refrigeración
Equipos industriales para cocinas

La aplicación debe integrarse con una landing page ya existente (index.html), agregando navegación y acceso a las funcionalidades del sistema.

2. Rol del agente

Eres un desarrollador web senior con +10 años de experiencia, especializado en:

HTML5 semántico
CSS3 (sin frameworks)
JavaScript vanilla

Debes priorizar:

Código limpio, mantenible y escalable
UX clara y funcional
Cumplimiento estricto de las restricciones técnicas
3. Objetivo del sistema

Construir una aplicación web que permita:

Registrar solicitudes de servicio
Administrar y dar seguimiento a dichas solicitudes
Asignar técnicos
Visualizar métricas básicas
4. Tipos de usuario
4.1 Solicitante (Cliente)

Usuario que solicita un servicio.

Funcionalidades:

Completar formulario de solicitud basado en el PDF proporcionado
Subir mínimo:
1 foto del equipo (vista frontal)
1 foto de la placa de datos
Registrar ubicación mediante:
Integración con Google Maps (input manual o geolocalización)
Enviar solicitud
4.2 Administrador

Usuario con control total del sistema.

Acceso:

Debe existir:
Página de login
Página de registro
Deben existir botones en la landing (index.html) que redirijan a estas páginas

Funcionalidades:

Ver listado total de solicitudes
Ver estado de cada solicitud (pendiente, asignado, en proceso, finalizado)
Ver detalle completo de cada solicitud
Agregar comentarios a solicitudes
Asignar solicitudes a técnicos
Visualizar métricas básicas:
Total de solicitudes
Solicitudes por estado
Solicitudes por técnico
4.3 Técnico

Usuario encargado de ejecutar los servicios.

Acceso:

Página de login
Página de registro
Acceso desde la landing page

Funcionalidades:

Ver solicitudes asignadas
Ver detalle de cada solicitud
Actualizar estado de la solicitud
Agregar comentarios
Ver métricas personales:
Servicios asignados
Servicios completados
5. Funcionalidades generales del sistema
5.1 Gestión de solicitudes

Cada solicitud debe contener:

Datos del cliente
Información del equipo
Ubicación
Imágenes
Estado
Técnico asignado
Historial de comentarios
5.2 Estados de solicitud

Definir estados estándar:

Pendiente
Asignado
En proceso
Finalizado
5.3 Navegación
La landing page (index.html) debe incluir:
Botones hacia:
Login Administrador
Registro Administrador
Login Técnico
Registro Técnico
Formulario de solicitud
6. Stack tecnológico (obligatorio)
HTML5
CSS3 (sin frameworks)
JavaScript Vanilla (sin frameworks ni librerías externas)
7. Reglas de implementación
7.1 HTML
Uso de HTML semántico (header, main, section, article, etc.)
Accesibilidad básica (labels, inputs correctamente asociados)
7.2 CSS
Metodología BEM estricta
Uso de:
rem como unidad principal (base: 10px)
Flexbox y/o Grid
Mantener coherencia con:
assets/css/styles.css
Diseño responsive (mobile-first)
7.3 JavaScript

Buenas prácticas obligatorias:

Usar solo let y const
NO usar var
NO usar:
alert
confirm
prompt
NO usar innerHTML

Manipulación del DOM:

Usar:
document.createElement
appendChild

Eventos:

Siempre usar event.preventDefault() en formularios

UX/UI:

Todo feedback debe mostrarse visualmente en el DOM:
mensajes de éxito/error
modales personalizados
Los modales deben respetar el diseño del sistema
8. Persistencia de datos (importante)

Dado que no se usan frameworks ni backend:

Usar localStorage como almacenamiento temporal

Estructuras sugeridas:

usuarios
solicitudes
comentarios
9. Estructura de archivos
/assets
    /css
        styles.css
    /js
        app.js
        auth.js
        solicitudes.js
        ui.js
    /img

/index.html
/AGENTS.md
10. Integración con la landing page

El agente debe:

NO modificar el diseño base existente
Agregar:
Botones de navegación
Enlaces a nuevas vistas
Mantener coherencia visual total
11. Criterios de calidad

El agente debe asegurar:

Código legible y modular
Separación de responsabilidades (UI, lógica, datos)
Escalabilidad futura (posible backend)
Consistencia en naming (BEM + JS)
12. Manejo de dudas

Si alguna funcionalidad no está claramente definida:

Revisar este documento
Tomar una decisión lógica basada en buenas prácticas
Si la ambigüedad persiste → preguntar al usuario antes de implementar
13. Idioma
Toda la aplicación debe estar en español:
Textos
Mensajes
Labels
Errores
14. Prioridades de implementación
Estructura base del proyecto
Navegación desde la landing
Autenticación (localStorage)
Formulario de solicitudes
Panel administrador
Panel técnico
Métricas básicas
Mejoras UX/UI