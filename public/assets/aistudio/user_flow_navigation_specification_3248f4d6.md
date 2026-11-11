# User Flow & Especificación de Navegación - EcoCommunity

## 1. Punto de Partida y Sesión (Entry Point)

```text
                             +-----------------------+
                             |  Usuario llega a App  |
                             +-----------+-----------+
                                         |
                                         v
                             /?Esta autenticado?
                            /                   \
                        (NO)                     (SI)
                        /                         \
                       v                           v
          +------------------------+  +------------------------+
          | Landing / Onboarding   |  | Dashboard Principal    |
          | - Explicacion del valor|  | - Balance Ecocoins     |
          | - Boton Login/Registro |  | - Resumen de impacto   |
          +-----------+------------+  | - Acceso rapido a Scan |
                      |               +------------------------+
                      v
          +------------------------+
          |  Formulario Login/Auth |
          |  - Email / Password    |
          |  - Consentimiento GDPR |
          +------------------------+
```

---

## 2. The Happy Path (Camino Crítico de Reciclaje)

```text
[Inicio] -> (Dashboard)
   |
   +---> 1. Presiona boton "Escanear Residuo"
   |
   +---> 2. La camara se activa:
   |        a) Escanea codigo de barras EAN/UPC  --> (Retorna info en 1.5s)
   |        b) Toma fotografia de objeto         --> (Envía a Gemini AI)
   |
   +---> 3. PANTALLA DE RESULTADO DE CLASIFICACION:
   |        - Muestra Categoria (Ej. PET)
   |        - Muestra Puntos a ganar
   |        - Muestra Instrucciones de Limpieza
   |        - Boton: "Buscar Punto Limpio Cercano"
   |
   +---> 4. PANTALLA DE MAPA & GEOFENCING:
   |        - Muestra puntos limpios ordenados por distancia
   |        - Usuario camina hacia el punto seleccionado (GPS activo)
   |        - Al estar a <= 20 metros, el boton "Depositar Ahora" se ACTIVA
   |
   +---> 5. CONFIRMACION DE ENTREGA:
   |        - Usuario escanea el codigo QR pegado en el contenedor
   |        - Sistema valida QR + GPS + Timestamp
   |
   +---> 6. PANTALLA DE ÉXITO & RECOMPENSA:
            - Animacion de Ecocoins acreditadas
            - Muestra resumen de CO2 evitado
            - Boton: "Ver mi Billetera" o "Volver al Inicio"
```

---

## 3. Escenarios Alternativos y Bifurcaciones (Edge Cases)

### 3.1 Fallo de Clasificación por IA / Material No Identificado
* **Condición:** Gemini AI responde con nivel de confianza $< 60\%$ o error de red.
* **Flujo:** La interfaz muestra el mensaje: *"No pudimos identificar con certeza el residuo"* y presenta 3 botones de selección manual (Plástico, Vidrio, Cartón) + opción de reportar foto para revisión.

### 3.2 Usuario Fuera del Radio del Punto Limpio (Geofencing Error)
* **Condición:** El usuario intenta presionar "Depositar Ahora" estando a una distancia $> 20\text{ m}$ del punto seleccionado.
* **Flujo:** El botón permanece inactivo en color gris. Se muestra una alerta flotante: *"Te encuentras a [X] metros del contenedor. Acércate un poco más para habilitar el depósito."*

### 3.3 Pérdida de Conexión a Internet (Modo Offline)
* **Condición:** Dispositivo sin cobertura 4G/5G al momento de la entrega.
* **Flujo:** La app registra los datos del escaneo y la coordenada GPS cifrada en el almacenamiento local. Muestra el aviso: *"Entrega guardada localmente. Se sincronizará automáticamente cuando recuperes señal."*

---

## 4. Estados de la Interfaz (UI States)

| Pantalla | Estado Loading | Estado Vacío (Empty State) | Estado de Error |
| :--- | :--- | :--- | :--- |
| **Escaneo IA** | Skeleton animado con texto *"Analizando empaque con IA..."* | *"Coloque el objeto dentro del recuadro"* | *"Error de conexión con el servicio de IA. Intente de nuevo."* |
| **Mapa de Puntos** | Spinner sobre el mapa cargando coordenadas. | *"No encontramos puntos limpios en un radio de 10 km."* | *"No pudimos obtener su ubicación GPS. Verifique los permisos."* |
| **Billetera** | Marcador de posición brillando en el saldo. | *"Aún no has registrado entregas. ¡Escanea tu primer residuo!"* | *"No se pudieron actualizar los saldos. Deslice para reintentar."* |

---

## 5. Puntos de Salida y Feedback de Cierre

Una vez completado el flujo de reciclaje de forma exitosa, la plataforma ejecuta el bucle de retención:
1. **Feedback Visual:** Banner animado de felicitación con el total acumulado de puntos.
2. **Impacto Ambiental:** Muestra una frase motivacional (*"Con esta entrega salvaste el equivalente a 3 botellas de plástico en el océano"*).
3. **Llamado a la Acción Secundario:** Sugerencia contextual en pantalla: *"¿Quieres canjear tus puntos por un cupón de café?"* enviando directo a la Billetera de Recompensas.