# Roadmap de Desarrollo y Hoja de Ruta - EcoCommunity

## 1. Alcance por Fases (MVP vs. Futuro)

```text
+-------------------------------------------------------------------+
| FASE 1: MVP Núcleo (Meses 1 - 2)                                  |
| - Autenticación JWT y Roles básicos.                              |
| - Módulo de Escaneo por IA (Gemini Vision API) y Código de Barras.|
| - Geolocalización de Puntos Limpios (Leaflet.js / OpenStreetMap). |
| - Registro de Entregas con Geofencing (GPS <= 20m).              |
| - Monedero de Puntos y Registro Transaccional Básico.             |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
| FASE 2: Fidelización y Operación (Meses 3 - 4)                    |
| - Catálogo de Canje de Cupones con Marcas Socias.                |
| - App Terminal para Recicladores Urbanos y Puntos de Acopio.      |
| - Sistema de Colas Offline (SQLite local + Sincronización).       |
| - Notificaciones Push de Impacto y Trazabilidad de Materiales.    |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
| FASE 3: Escalabilidad y Plataforma B2B (Meses 5 - 6)              |
| - Partner Dashboard B2B para reporte ESG de marcas patrocinadoras. |
| - Analítica avanzada de volumen de residuos y predicción con IA.  |
| - Integración de API empresarial para gobiernos locales.          |
+-------------------------------------------------------------------+
```

---

## 2. Hitos Secuenciales (Milestones)

### Milestone 1: Infraestructura y Modelado de Datos (Semanas 1-2)
* Setup del repositorio y entorno virtual Python.
* Configuración de Flask con Blueprints y SQLAlchemy.
* Creación de migraciones iniciales de MySQL con Alembic.
* Implementación de Docker Compose para entorno local.

### Milestone 2: Autenticación y Módulo de Clasificación por IA (Semanas 3-4)
* Endpoints de Registro, Login y Gestión de JWT Tokens.
* Integración de `AIClassifierAdapter` consumiendo Gemini 2.5 Flash API.
* Implementación de caché Redis para catálogo de productos (EAN/UPC).
* Pruebas unitarias de inferencia con mocks de imágenes.

### Milestone 3: Geolocalización y Registro de Entregas (Semanas 5-6)
* Mapa interactivo de Puntos Limpios con filtros por tipo de residuo.
* Lógica de Geofencing ($\le 20\text{ m}$) para habilitar botón de entrega.
* Escaneo de QR del contenedor y generación de recibo digital.
* Mecanismo Antifraude: control de frecuencia (Rate Limiting) y bloqueo de escaneos repetidos en 24h.

### Milestone 4: Monedero de Recompensas y Transacciones (Semanas 7-8)
* Lógica de acreditación de ecocoins con bloqueo pesimista en MySQL.
* Catálogo de canje de incentivos y generación de cupones digitales.
* Pruebas de concurrencia y carga masiva utilizando Locust.
* Pruebas End-to-End de flujos críticos con Playwright.

### Milestone 5: Despliegue Staging y Pruebas Beta (Semanas 9-10)
* Configuración de CI/CD mediante GitHub Actions.
* Despliegue en servidor VPS con Nginx y SSL Let's Encrypt.
* Monitoreo de errores en tiempo real integrado con Sentry.
* Pruebas de usabilidad y accesibilidad (WCAG 2.2 AA).

---

## 3. Puertas de Calidad (Validation Gates)

Para avanzar entre hitos, el proyecto debe cumplir con los siguientes sensores de calidad:

1. **Clean Code & Linting:** `flake8` y `black` ejecutados exitosamente sin advertencias.
2. **Cobertura de Pruebas:** Mínimo $80\%$ de cobertura de pruebas unitarias (`pytest`).
3. **Compilación Limpia:** Construcción correcta de contenedores Docker sin alertas de seguridad (`docker scan`).
4. **Validación Humana (Human-in-the-Loop):** Demostración del Happy Path funcional probada en dispositivo móvil por el Product Owner antes del pase a producción.

---

## 4. Tamaño de Tareas (Backlog Granularity)

Las tareas en el backlog se estructurarán como **Micro-Tareas Atómicas** con un tiempo de desarrollo estimado entre 2 y 4 horas cada una:
* *Ejemplo Tarea 4.1:* "Crear endpoint POST `/api/v1/auth/login` con validación Argon2".
* *Ejemplo Tarea 4.2:* "Implementar clase `AIClassifierAdapter` con manejo de excepciones de timeout de Gemini".
* *Ejemplo Tarea 4.3:* "Agregar comprobación de distancia GPS por fórmula Haversine en endpoint `/api/v1/entregas`".