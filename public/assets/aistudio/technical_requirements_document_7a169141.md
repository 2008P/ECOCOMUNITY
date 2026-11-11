# Technical Requirements Document (TRD) - EcoCommunity

## 1. Stack Tecnológico y Arquitectura de Software

### 1.1 Arquitectura del Sistema
Monolito Modular en Python/Flask estructurado con **Blueprints**, combinado con los patrones de diseño **Repository** y **Adapter** para aislar integraciones externas.

```text
               +-------------------------------------------------+
               |              Cliente Móvil / Web                |
               +-----------------------+-------------------------+
                                       | HTTPS / WSS (TLS 1.3)
                                       v
               +-------------------------------------------------+
               |            Nginx (Reverse Proxy + SSL)          |
               +-----------------------+-------------------------+
                                       |
                                       v
               +-------------------------------------------------+
               |           BFF Layer (Flask Web App)             |
               |  - Auth Blueprint    - Materiales Blueprint     |
               |  - Puntos Blueprint  - Entregas Blueprint       |
               +-----------+-------------------------+-----------+
                           |                         |
              +------------v------------+   +--------v--------+
              | Adapters (IA, Maps, EAN)|   | SQLAlchemy ORM  |
              +------------+------------+   +--------+--------+
                           |                         |
             +-------------v-------------+  +--------v--------+
             | APIs Externas (Gemini,    |  | MySQL 8.0 Engine|
             | Mapbox, Open Food Facts)  |  | (ACID / InnoDB) |
             +---------------------------+  +-----------------+
                           |
             +-------------v-------------+
             | Redis Cache (TTL / Queue) |
             +---------------------------+
```

### 1.2 Stack Tecnológico
* **Backend Framework:** Python 3.11+ / Flask 3.0.x
* **Estructura Modular:** Flask Blueprints
* **ORM:** Flask-SQLAlchemy 3.1.x / Alembic (Flask-Migrate)
* **Base de Datos Relacional:** MySQL 8.0 (Motor InnoDB con soporte JSON)
* **Caché y Mensajería:** Redis 7.x
* **Clasificación por IA:** Google GenAI SDK (`gemini-2.5-flash`) mediante `AIClassifierAdapter`
* **Servidor WSGI & Proxy:** Gunicorn + Nginx
* **Seguridad:** Flask-JWT-Extended, PyJWT, Passlib (Argon2 / Bcrypt)

---

## 2. Modelo de Datos y Persistencia (ERD)

### 2.1 Esquema Relacional de Base de Datos

```sql
-- Tablas Principales de EcoCommunity

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('ciudadano', 'recolector', 'punto_acopio', 'marca_aliada', 'admin') DEFAULT 'ciudadano',
    puntos_acumulados INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_uuid (uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE materiales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barras VARCHAR(50) UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    puntos_por_kg INT DEFAULT 10,
    instrucciones_reciclaje TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_codigo_barras (codigo_barras)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE puntos_recoleccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    horario VARCHAR(100),
    capacidad_max_kg DECIMAL(8, 2),
    activo BOOLEAN DEFAULT TRUE,
    codigo_qr_hash VARCHAR(255) UNIQUE NOT NULL,
    INDEX idx_geolocalizacion (latitud, longitud)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE entregas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    usuario_id INT NOT NULL,
    punto_id INT NOT NULL,
    material_id INT NOT NULL,
    peso_kg DECIMAL(6, 2) NOT NULL,
    puntos_otorgados INT NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'rechazada') DEFAULT 'confirmada',
    latitud_registro DECIMAL(10, 8) NOT NULL,
    longitud_registro DECIMAL(11, 8) NOT NULL,
    fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (punto_id) REFERENCES puntos_recoleccion(id) ON DELETE RESTRICT,
    FOREIGN KEY (material_id) REFERENCES materiales(id) ON DELETE RESTRICT,
    INDEX idx_usuario_entrega (usuario_id),
    INDEX idx_fecha (fecha_entrega)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE transacciones_puntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    entrega_id INT NULL,
    tipo ENUM('credito', 'debito_canje', 'reversion') NOT NULL,
    monto_puntos INT NOT NULL,
    descripcion VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (entrega_id) REFERENCES entregas(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 3. Integración de APIs y Seguridad

### 3.1 Patrón Backend-for-Frontend (BFF) y Secret Manager
Todas las credenciales sensibles (`GEMINI_API_KEY`, `MYSQL_PASSWORD`, `JWT_SECRET_KEY`) se cargan mediante variables de entorno desde un archivo `.env` o Secret Manager seguro. Ninguna llave es expuesta al cliente.

### 3.2 Adaptador de IA (Google Gemini Vision Integration)
```python
# app/utils/ai_classifier.py
from google import genai
from PIL import Image
import os
import json

class AIClassifierAdapter:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def clasificar_imagen(self, ruta_imagen: str) -> dict:
        imagen = Image.open(ruta_imagen)
        prompt = (
            "Analiza esta imagen y clasifica el material reciclable. "
            "Responde estrictamente en formato JSON con la siguiente estructura: "
            "{\"categoria\": \"Plástico PET|Cartón|Vidrio|Aluminio|No reciclable\", "
            "\"confianza\": float, \"consejo_preparacion\": \"texto\"}"
        )
        response = self.client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[imagen, prompt]
        )
        try:
            return json.loads(response.text)
        except Exception:
            return {
                "categoria": "Desconocido",
                "confianza": 0.0,
                "consejo_preparacion": "Consulte manualmente en el punto de acopio."
            }
```

### 3.3 Autenticación y Rate Limiting
* **JWT Token Duration:** Access Token valid por 15 minutos; Refresh Token valid por 7 días almacenado en `HttpOnly` Secure Cookie.
* **Rate Limiting:** Implementado con `Flask-Limiter` + Redis (Máximo 5 escaneos por minuto por IP/Usuario).

---

## 4. Estrategia de Pruebas y Validaciones

1. **Validación de Schemas con Pydantic:** Estructuración estricta de JSON recibidos en las peticiones HTTP.
2. **Pruebas Unitarias e Integración (Pytest):** Cobertura $>80\%$ en módulos de entrega y transacciones de puntos.
3. **Mocks de Integración:** Aislamiento de llamadas externas a la API de Gemini mediante `unittest.mock`.
4. **Pruebas de Carga (Locust):** Escenarios de concurrencia simulando 500 solicitudes simultáneas de entregas y canjes de puntos para validar bloqueo pesimista en base de datos.

---

## 5. Entorno de Despliegue, DevOps y Observabilidad

### 5.1 Despliegue con Docker Compose
```yaml
version: '3.8'

services:
  web:
    build: .
    command: gunicorn --workers 4 --bind 0.0.0.0:5000 run:app
    environment:
      - DATABASE_URL=mysql+pymysql://ecouser:ecopass@db/ecocomunity_db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    restart: always

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: ecocomunity_db
      MYSQL_USER: ecouser
      MYSQL_PASSWORD: ecopass
      MYSQL_ROOT_PASSWORD: rootpass
    volumes:
      - mysql_data:/var/lib/mysql
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

volumes:
  mysql_data:
```

### 5.2 Observabilidad
* **Logs Estructurados:** Formato JSON registrado en consola y archivo mediante la librería estándar `logging`.
* **Monitoreo de Excepciones:** Integración con SDK de **Sentry** para captura de errores no controlados en producción.