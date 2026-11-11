# Product Requirements Document (PRD) - EcoCommunity

## 1. El Problema y Objetivos de Negocio (El "Porqué")

### 1.1 Declaración del Problema
El reciclaje ciudadano enfrenta tres fricciones críticas:
1. **Desinformación y duda en la separación:** Desconocimiento sobre la reciclabilidad hiperlocal de un residuo, causando contaminación en los contenedores.
2. **Falta de incentivos tangibles:** Ausencia de retorno directo o gratificación por el esfuerzo, tiempo y almacenamiento dedicados a la separación.
3. **Falta de trazabilidad y desconfianza:** Percepción de que los residuos terminan mezclados en rellenos sanitarios, destruyendo el hábito de reciclar.

### 1.2 Propuesta de Valor
*"Hacer que reciclar sea tan intuitivo, transparente y gratificante como realizar un pago digital."*
Una plataforma móvil integral que combina reconocimiento de materiales asistido por IA (Google Gemini Vision API) con un sistema de recompensas verificadas por geolocalización e impacto en tiempo real.

### 1.3 Indicadores Clave de Rendimiento (KPIs)
* **Impacto y Operación:**
  * Volumen total desviado de rellenos sanitarios ($\text{kg}$ / Toneladas).
  * Precisión de la IA en clasificación visual ($\ge 95\%$).
  * Reducción de tasa de contaminación en lotes recolectados.
* **Adopción y Retención:**
  * Usuarios Activos Mensuales (MAU) y Diarios (DAU).
  * Retención a 30, 60 y 90 días.
  * Frecuencia media de entregas verificadas por usuario al mes.
* **Sostenibilidad Económica:**
  * Tasa de canje de recompensas (puntos/ecocoins en aliados).
  * Relación Costo de Adquisición de Usuario (CAC) vs. Valor del Tiempo de Vida (LTV).
  * Número de marcas sponsors vinculadas al programa ESG.

---

## 2. Usuarios, Roles y Permisos (RBAC)

### 2.1 Matriz de Roles y Permisos

| Rol | Plataforma | Descripción y Permisos Principales |
| :--- | :--- | :--- |
| **Ciudadano / Reciclador Doméstico** | App Móvil (B2C) | Escaneo por código de barras/IA, mapa de puntos limpios, solicitud de recolección, registro de entregas, billetera de puntos y métricas de impacto individual. |
| **Reciclador Urbano / Gestor** | App Operativa | Recepción de solicitudes geolocalizadas, confirmación de peso/entrega en campo, escaneo QR de transferencia y control de historial de rutas. |
| **Punto de Recolección / Acopio** | Web / App Terminal | Validación física y pesaje de lotes, aprobación de transacciones de puntos, gestión de stock temporal y emisión de manifiestos digitales de carga. |
| **Marca Aliada / Sponsor ESG** | Partner Dashboard (B2B) | Configuración de campañas de cupones, analíticas de trazabilidad de sus empaques y descarga de reportes de cumplimiento ESG. |
| **Super Administrador** | Admin Console | Control global de usuarios, reglas de clasificación por municipio, alertas antifraude, auditoría de transacciones y configuración del sistema. |

---

## 3. Funcionalidades Clave y Criterios de Aceptación (DoD)

### 3.1 Módulo de Identificación y Clasificación por IA
* **Descripción:** Identificación instantánea de reciclabilidad por código de barras (EAN/UPC) o análisis de imagen por IA.
* **Criterios de Aceptación (Definition of Done):**
  * Respuesta de lectura por código de barras en $\le 1.5\text{ s}$.
  * Inferencia visual por IA con precisión comprobada de $\ge 95\%$ o retorno de máximo 3 alternativas sugeridas.
  * Personalización automática de instrucciones según la ubicación GPS activa del usuario (normativa municipal).

### 3.2 Módulo de Geolocalización y Puntos Limpios
* **Descripción:** Mapa interactivo de contenedores inteligentes, centros de acopio y recolectores en tiempo real.
* **Criterios de Aceptación:**
  * Filtro de puntos por tipo de residuo en un radio ajustable de $1$ a $10\text{ km}$.
  * Despliegue de estado de disponibilidad, horarios y capacidad del punto en tiempo real.
  * Integración fluida de navegación hacia Google Maps, Waze o Apple Maps.

### 3.3 Módulo de Registro de Entregas y Validación Antifraude
* **Descripción:** Mecanismo de validación física de depósitos mediante Geofencing y códigos QR.
* **Criterios de Aceptación:**
  * Habilitación del registro de entrega únicamente si la distancia GPS al punto es $\le 20\text{ metros}$.
  * Bloqueo automático de re-escaneo del mismo ítem por el mismo usuario durante $24\text{ horas}$.
  * Emisión de recibo digital inmediato con sello de tiempo, ubicación, material y peso estimado.

### 3.4 Billetera de Recompensas (Rewards Wallet)
* **Descripción:** Acreditación de puntos (ecocoins) y catálogo de canje por incentivos.
* **Criterios de Aceptación:**
  * Acreditación de saldo en tiempo real tras la validación de entrega.
  * Catálogo multicanje: cupones comerciales, cashback y donaciones ambientales.
  * Reversión transaccional automática en $< 5\text{ s}$ ante fallas de proveedores de cupones.

### 3.5 Módulo de Trazabilidad e Impacto ESG
* **Descripción:** Cálculo de huella ecológica individual y manifiesto de cadena de custodia.
* **Criterios de Aceptación:**
  * Actualización en vivo de kilogramos reciclados y $CO_2$ evitado en la app del ciudadano.
  * Notificaciones Push de actualización de estado cuando el lote es transformado en planta final.
  * Generación de reportes PDF para usuarios y reportes CSV auditables para empresas socias.

---

## 4. Límites, Restricciones y Exclusiones (NFRs)

### 4.1 Privacidad de Datos y Normativas
* **GDPR / CCPA:** Consentimiento explícito para Cookies y analíticas; botón transparente de "Do Not Sell/Share My Personal Information".
* **Geolocalización:** Cifrado en tránsito (TLS 1.3) y en reposo (AES-256) de coordenadas GPS. Prohibido almacenar histórico de ubicación continua sin anonimizar.

### 4.2 Accesibilidad e Inclusión
* Cumplimiento estricto de **WCAG 2.2 Nivel AA** (lectores de pantalla, contraste dinámico, soporte multi-idioma).

### 4.3 Rendimiento y Operativo
* Latencia de clasificación visual $\le 1.5\text{ s}$ en redes 4G/5G.
* Soporte para modo **Offline Parcial**: almacenamiento cifrado local en SQLite/Dispositivo y sincronización idempotente en segundo plano al recuperar red.
* Disponibilidad del backend del 99.9% SLA.

### 4.4 Exclusiones y Prácticas Prohibidas
* 🚫 **Prohibido:** Almacenar tokens, passwords o credenciales en texto plano.
* 🚫 **Prohibido:** Acoplar lógica de negocio a proveedores externos de IA o Mapas sin Capa de Abstracción (Adapter Pattern).
* 🚫 **Prohibido:** Permitir peticiones ilimitadas en la API sin mecanismos de Rate Limiting.

---

## 5. Expectativas de Pruebas y Comportamientos Críticos

1. **Prevención de Carrera de Condiciones (Race Conditions):** Pruebas de carga con Locust enviando peticiones simultáneas de canje para garantizar transacciones atómicas (ACID) sin saldos negativos.
2. **Detección de GPS Spoofing:** Bloqueo de peticiones que utilicen librerías de Mock Location o que presenten discrepancias en triangulación de celdas de red.
3. **Recuperación Offline:** Simulación de corte de conexión durante la secuencia de entrega; las transacciones deben encolarse y procesarse secuencialmente al reconectar sin duplicar puntos.
4. **Resiliencia de APIs Externas:** Enrutamiento hacia fallbacks de clasificación por IA local o revisión manual si el catálogo de códigos de barras (GS1/Open Food Facts) experimenta *timeouts*.