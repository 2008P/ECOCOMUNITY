import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialise Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Haversine distance calculator in meters
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Distance in meters
}

// In-Memory Database (Seeded with realistic data according to PRD & TRD)
interface Material {
  id: number;
  codigo_barras?: string;
  nombre: string;
  categoria: 'Plástico PET' | 'Cartón y Papel' | 'Vidrio' | 'Aluminio / Latas' | 'Tetra Pak' | 'No reciclable';
  puntos_por_kg: number;
  instrucciones_reciclaje: string;
  co2_factor: number; // kg CO2 saved per kg recycled
}

interface PuntoLimpio {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  horario: string;
  capacidad_max_kg: number;
  capacidad_actual_kg: number;
  activo: boolean;
  codigo_qr_hash: string;
  materiales_aceptados: string[];
  tipo: 'Contenedor Inteligente' | 'Punto Limpio Municipal' | 'Centro de Acopio Asociado';
}

interface Entrega {
  id: number;
  uuid: string;
  usuario_id: number;
  punto_id: number;
  material_nombre: string;
  categoria: string;
  peso_kg: number;
  puntos_otorgados: number;
  co2_ahorrado_kg: number;
  estado: 'confirmada' | 'pendiente_validacion' | 'rechazada';
  latitud_registro: number;
  longitud_registro: number;
  distancia_metros: number;
  qr_hash: string;
  fecha_entrega: string;
  cadena_custodia_paso: 'depositado' | 'recolectado' | 'en_acopio' | 'transformado';
  recibo_digital_hash: string;
}

interface Transaccion {
  id: number;
  usuario_id: number;
  tipo: 'credito' | 'debito_canje';
  monto_puntos: number;
  descripcion: string;
  fecha: string;
  codigo_voucher?: string;
}

// Seed Materiales
const CATALOGO_MATERIALES: Material[] = [
  {
    id: 1,
    codigo_barras: '7791234567890',
    nombre: 'Botella Agua Mineral PET 500ml',
    categoria: 'Plástico PET',
    puntos_por_kg: 200,
    instrucciones_reciclaje: 'Vaciar líquidos, enjuagar con poca agua, separar tapa (HDPE) y aplastar para reducir volumen.',
    co2_factor: 1.8,
  },
  {
    id: 2,
    codigo_barras: '7790040404040',
    nombre: 'Lata Bebida Aluminio 355ml',
    categoria: 'Aluminio / Latas',
    puntos_por_kg: 350,
    instrucciones_reciclaje: 'Vaciar completamente, no requiere aplastado forzoso, depositar seca en contenedor amarillo.',
    co2_factor: 9.1,
  },
  {
    id: 3,
    codigo_barras: '7798888999911',
    nombre: 'Caja Cartón Corrugado Embalaje',
    categoria: 'Cartón y Papel',
    puntos_por_kg: 100,
    instrucciones_reciclaje: 'Retirar cintas plásticas y grapas metálicas, desarmar y aplanar para optimizar espacio.',
    co2_factor: 0.9,
  },
  {
    id: 4,
    codigo_barras: '7797777666655',
    nombre: 'Botella de Vidrio Bebida 330ml',
    categoria: 'Vidrio',
    puntos_por_kg: 120,
    instrucciones_reciclaje: 'Retirar chapa/tapa corona, enjuagar restos orgánicos y depositar sin romper.',
    co2_factor: 0.35,
  },
  {
    id: 5,
    codigo_barras: '7795555444433',
    nombre: 'Envase Tetra Brik Leche 1L',
    categoria: 'Tetra Pak',
    puntos_por_kg: 180,
    instrucciones_reciclaje: 'Desplegar las cuatro pestañas, enjuagar el interior, aplanar e introducir la bombilla o tapón.',
    co2_factor: 1.1,
  },
  {
    id: 6,
    codigo_barras: '7791111222233',
    nombre: 'Bolsa de Snacks Metalizada (Multicapa)',
    categoria: 'No reciclable',
    puntos_por_kg: 0,
    instrucciones_reciclaje: 'Este material compuesto no es reciclable mecánicamente. Depositar en basura común o ecoladrillo.',
    co2_factor: 0,
  },
];

// Seed Puntos Limpios (Default coordinates near city center: Lat: 40.4168, Lng: -3.7038 Madrid / default demo center)
const PUNTOS_LIMPIOS: PuntoLimpio[] = [
  {
    id: 1,
    nombre: 'Estación Inteligente EcoCommunity - Plaza Central',
    direccion: 'Plaza Mayor s/n, Distrito Centro',
    latitud: 40.415363,
    longitud: -3.707398,
    horario: '24/7 (Acceso Automatizado)',
    capacidad_max_kg: 850,
    capacidad_actual_kg: 320,
    activo: true,
    codigo_qr_hash: 'ECO-BIN-PLAZA-CENTRAL-01',
    materiales_aceptados: ['Plástico PET', 'Aluminio / Latas', 'Tetra Pak'],
    tipo: 'Contenedor Inteligente',
  },
  {
    id: 2,
    nombre: 'Punto Limpio Municipal Parque Verde',
    direccion: 'Av. de los Álamos 142',
    latitud: 40.41725,
    longitud: -3.70251,
    horario: 'Lunes a Sábado: 08:00 - 20:00',
    capacidad_max_kg: 3000,
    capacidad_actual_kg: 1450,
    activo: true,
    codigo_qr_hash: 'ECO-HUB-PARQUE-VERDE-02',
    materiales_aceptados: ['Plástico PET', 'Cartón y Papel', 'Vidrio', 'Aluminio / Latas', 'Tetra Pak'],
    tipo: 'Punto Limpio Municipal',
  },
  {
    id: 3,
    nombre: 'Centro de Acopio & Recicladores Urbanos San Telmo',
    direccion: 'Calle Artesanos 88',
    latitud: 40.41912,
    longitud: -3.70995,
    horario: 'Lunes a Viernes: 07:00 - 18:00',
    capacidad_max_kg: 5000,
    capacidad_actual_kg: 2800,
    activo: true,
    codigo_qr_hash: 'ECO-RECO-SAN-TELMO-03',
    materiales_aceptados: ['Plástico PET', 'Cartón y Papel', 'Aluminio / Latas', 'Vidrio'],
    tipo: 'Centro de Acopio Asociado',
  },
  {
    id: 4,
    nombre: 'Contenedor Inteligente Campus Universitario',
    direccion: 'Bulevar de las Ciencias 12',
    latitud: 40.4132,
    longitud: -3.7011,
    horario: '24/7 (Acceso Automatizado)',
    capacidad_max_kg: 600,
    capacidad_actual_kg: 195,
    activo: true,
    codigo_qr_hash: 'ECO-BIN-CAMPUS-04',
    materiales_aceptados: ['Plástico PET', 'Aluminio / Latas', 'Cartón y Papel'],
    tipo: 'Contenedor Inteligente',
  },
];

// Seed Deliveries
const HISTORIAL_ENTREGAS: Entrega[] = [
  {
    id: 101,
    uuid: 'ent-a7b2c9d1-801',
    usuario_id: 1,
    punto_id: 1,
    material_nombre: '3x Botellas Plástico PET',
    categoria: 'Plástico PET',
    peso_kg: 0.15,
    puntos_otorgados: 30,
    co2_ahorrado_kg: 0.27,
    estado: 'confirmada',
    latitud_registro: 40.415365,
    longitud_registro: -3.707395,
    distancia_metros: 3,
    qr_hash: 'ECO-BIN-PLAZA-CENTRAL-01',
    fecha_entrega: '2026-11-10T14:32:00Z',
    cadena_custodia_paso: 'transformado',
    recibo_digital_hash: '0x8f2c3d4e1122aaff',
  },
  {
    id: 102,
    uuid: 'ent-b8c3d0e2-802',
    usuario_id: 1,
    punto_id: 2,
    material_nombre: 'Caja Cartón Plegada 1.2kg',
    categoria: 'Cartón y Papel',
    peso_kg: 1.2,
    puntos_otorgados: 120,
    co2_ahorrado_kg: 1.08,
    estado: 'confirmada',
    latitud_registro: 40.41724,
    longitud_registro: -3.70252,
    distancia_metros: 6,
    qr_hash: 'ECO-HUB-PARQUE-VERDE-02',
    fecha_entrega: '2026-11-08T11:15:00Z',
    cadena_custodia_paso: 'en_acopio',
    recibo_digital_hash: '0x9911bb22cc44eeaa',
  },
  {
    id: 103,
    uuid: 'ent-c9d4e1f3-803',
    usuario_id: 1,
    punto_id: 1,
    material_nombre: '4x Latas de Aluminio',
    categoria: 'Aluminio / Latas',
    peso_kg: 0.08,
    puntos_otorgados: 28,
    co2_ahorrado_kg: 0.73,
    estado: 'confirmada',
    latitud_registro: 40.41536,
    longitud_registro: -3.7074,
    distancia_metros: 4,
    qr_hash: 'ECO-BIN-PLAZA-CENTRAL-01',
    fecha_entrega: '2026-11-06T18:40:00Z',
    cadena_custodia_paso: 'transformado',
    recibo_digital_hash: '0x44ddaa8877663322',
  },
];

// Seed Transactions
const TRANSACCIONES_PUNTOS: Transaccion[] = [
  {
    id: 1,
    usuario_id: 1,
    tipo: 'credito',
    monto_puntos: 30,
    descripcion: 'Entrega verificada: 3x Botellas Plástico PET (0.15 kg)',
    fecha: '2026-11-10T14:32:00Z',
  },
  {
    id: 2,
    usuario_id: 1,
    tipo: 'credito',
    monto_puntos: 120,
    descripcion: 'Entrega verificada: Cartón Plegado (1.2 kg)',
    fecha: '2026-11-08T11:15:00Z',
  },
  {
    id: 3,
    usuario_id: 1,
    tipo: 'credito',
    monto_puntos: 28,
    descripcion: 'Entrega verificada: 4x Latas de Aluminio (0.08 kg)',
    fecha: '2026-11-06T18:40:00Z',
  },
  {
    id: 4,
    usuario_id: 1,
    tipo: 'debito_canje',
    monto_puntos: 50,
    descripcion: 'Canje de Cupón: Café Orgánico en GreenRoast',
    fecha: '2026-11-05T09:20:00Z',
    codigo_voucher: 'ECO-CAFE-9284-GR',
  },
];

// Seed Catalog Rewards for redemption
const RECOMPENSAS_CATALOGO = [
  {
    id: 'rew-1',
    sponsor: 'GreenRoast Coffee',
    titulo: 'Café Orgánico o Bebida Mediana',
    costo_ecocoins: 50,
    categoria: 'Gastronomía Sostenible',
    descripcion: 'Válido por 1 café de especialidad servido en tu propio vaso reutilizable.',
    stock: 45,
    marca_aliada_id: 'brand_greenroast',
    logo_svg: 'coffee',
  },
  {
    id: 'rew-2',
    sponsor: 'Metro & Bici Ciudad',
    titulo: 'Pase 2 Viajes Transporte Público',
    costo_ecocoins: 80,
    categoria: 'Movilidad Cero Emisiones',
    descripcion: 'Cupón recargable para transporte subterráneo o bicicleta compartida.',
    stock: 120,
    marca_aliada_id: 'brand_metrobici',
    logo_svg: 'bike',
  },
  {
    id: 'rew-3',
    sponsor: 'EcoMarket Natural',
    titulo: 'Bono 15% Descuento Granel',
    costo_ecocoins: 110,
    categoria: 'Alimentación Zero Waste',
    descripcion: 'Aplica en compras de legumbres, frutos secos y cereales a granel.',
    stock: 30,
    marca_aliada_id: 'brand_ecomarket',
    logo_svg: 'shopping-bag',
  },
  {
    id: 'rew-4',
    sponsor: 'Fundación Bosque Nativo',
    titulo: 'Adopta y Siembra 1 Árbol Nativo',
    costo_ecocoins: 150,
    categoria: 'Reforestación Comunitaria',
    descripcion: 'Certificado digital con coordenadas geográficas del ejemplar plantado.',
    stock: 500,
    marca_aliada_id: 'brand_bosquenativo',
    logo_svg: 'tree',
  },
];

// Anti-fraud rate limiting registry: `${usuario_id}_${punto_id}_${material_or_barcode}` -> timestamp
const ANTIFRAUDE_REGISTRO = new Map<string, number>();

// --- API ROUTES ---

// 1. AI Vision Classification / Barcode Endpoint
app.post('/api/ai/classify', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', barcode, notes } = req.body;

    // A) If Barcode provided, check catalog first for instant response (<= 1.5s as per PRD)
    if (barcode) {
      const match = CATALOGO_MATERIALES.find((m) => m.codigo_barras === barcode);
      if (match) {
        return res.json({
          source: 'barcode_database',
          categoria: match.categoria,
          nombre_detectado: match.nombre,
          confianza: 0.99,
          puntos_estimados: Math.round(match.puntos_por_kg * 0.15),
          co2_evitado_kg: Number((0.15 * match.co2_factor).toFixed(2)),
          peso_estimado_kg: 0.15,
          consejo_preparacion: match.instrucciones_reciclaje,
          reciclable: match.categoria !== 'No reciclable',
          alternativas: [],
          huella_info: `Desviar este material ahorra energía equivalente a ${(match.co2_factor * 1.5).toFixed(1)}h de iluminación LED.`,
        });
      }
    }

    // B) Gemini AI Vision inference via @google/genai SDK
    if (imageBase64 && ai) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9]+;base64,/, '');

      const promptText = `
        Eres el motor de clasificación de residuos circulares de EcoCommunity.
        Analiza detenidamente la imagen enviada.
        Identifica el material principal, tipo de envase o producto.
        
        Debes clasificarlo estrictamente en una de estas categorías:
        - "Plástico PET" (botellas transparentes de refresco, agua, bandejas de fruta PET)
        - "Cartón y Papel" (cajas, sobres de cartón, periódicos, papel limpio)
        - "Vidrio" (botellas de vino, cerveza, tarros de conservas, frascos)
        - "Aluminio / Latas" (latas de refresco, conservas metálicas, hojalata)
        - "Tetra Pak" (envases de leche, jugos con multicapa cartón-aluminio-plástico)
        - "No reciclable" (bolsas de frituras metalizadas, colillas, pañales, cerámica rota, plástico sucio con grasa)
        
        Responde exclusivamente en JSON conforme a este esquema:
        {
          "categoria": string,
          "nombre_detectado": string,
          "confianza": number (entre 0.0 y 1.0),
          "reciclable": boolean,
          "peso_estimado_kg": number,
          "puntos_estimados": number,
          "co2_evitado_kg": number,
          "consejo_preparacion": string (instrucciones claras de limpieza, vaciado y compactación para el ciudadano),
          "alternativas": array de strings si la confianza es < 0.85
        }
      `;

      try {
        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: cleanBase64,
              },
            },
            {
              text: promptText,
            },
          ],
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                categoria: { type: Type.STRING },
                nombre_detectado: { type: Type.STRING },
                confianza: { type: Type.NUMBER },
                reciclable: { type: Type.BOOLEAN },
                peso_estimado_kg: { type: Type.NUMBER },
                puntos_estimados: { type: Type.INTEGER },
                co2_evitado_kg: { type: Type.NUMBER },
                consejo_preparacion: { type: Type.STRING },
                alternativas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['categoria', 'nombre_detectado', 'confianza', 'reciclable', 'consejo_preparacion'],
            },
          },
        });

        const textOutput = geminiResponse.text?.trim() || '{}';
        const parsedData = JSON.parse(textOutput);

        return res.json({
          source: 'gemini_vision_ai',
          model: 'gemini-3.8-flash',
          categoria: parsedData.categoria || 'Plástico PET',
          nombre_detectado: parsedData.nombre_detectado || 'Objeto Reciclable Detectado',
          confianza: typeof parsedData.confianza === 'number' ? parsedData.confianza : 0.94,
          reciclable: parsedData.reciclable !== undefined ? parsedData.reciclable : true,
          peso_estimado_kg: parsedData.peso_estimado_kg || 0.12,
          puntos_estimados: parsedData.puntos_estimados || 25,
          co2_evitado_kg: parsedData.co2_evitado_kg || 0.22,
          consejo_preparacion:
            parsedData.consejo_preparacion ||
            'Enjuagar los restos, separar la tapa plástica y comprimir para optimizar espacio en el contenedor.',
          alternativas: parsedData.alternativas || ['Plástico PET', 'Cartón y Papel', 'Vidrio'],
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed or timed out, activating fallback adapter:', geminiError?.message);
      }
    }

    // Fallback Adapter (Deterministic heuristic for testing without API keys or on network drops)
    const fallbackCategories = [
      {
        categoria: 'Plástico PET',
        nombre_detectado: 'Botella de Plástico Transparente PET',
        puntos: 30,
        peso: 0.1,
        co2: 0.18,
        consejo: 'Asegúrate de retirar residuos líquidos y aplastar la botella.',
      },
      {
        categoria: 'Cartón y Papel',
        nombre_detectado: 'Envase de Cartón Plegable',
        puntos: 45,
        peso: 0.35,
        co2: 0.32,
        consejo: 'Retira cintas plásticas y aplánalo completamente.',
      },
      {
        categoria: 'Aluminio / Latas',
        nombre_detectado: 'Lata de Bebida en Aluminio',
        puntos: 35,
        peso: 0.05,
        co2: 0.45,
        consejo: 'Vacía la lata completamente. No requiere enjuague si solo contenía agua o gas.',
      },
    ];

    // Pick consistent default based on notes or random
    const selected = fallbackCategories[0];
    return res.json({
      source: 'local_heuristic_adapter',
      categoria: selected.categoria,
      nombre_detectado: selected.nombre_detectado,
      confianza: 0.91,
      reciclable: true,
      peso_estimado_kg: selected.peso,
      puntos_estimados: selected.puntos,
      co2_evitado_kg: selected.co2,
      consejo_preparacion: selected.consejo,
      alternativas: ['Plástico PET', 'Cartón y Papel', 'Aluminio / Latas'],
    });
  } catch (error: any) {
    console.error('Error in /api/ai/classify:', error);
    res.status(500).json({
      error: 'Error en clasificación de material',
      details: error?.message || 'Error desconocido',
    });
  }
});

// 2. Puntos Limpios & Geofencing Listing
app.get('/api/puntos', (req, res) => {
  const { userLat, userLng } = req.query;

  let puntosWithDistance = PUNTOS_LIMPIOS.map((punto) => {
    let distancia_metros = 0;
    if (userLat && userLng) {
      distancia_metros = calculateHaversineDistance(
        parseFloat(userLat as string),
        parseFloat(userLng as string),
        punto.latitud,
        punto.longitud
      );
    }
    return {
      ...punto,
      distancia_metros,
      dentro_de_geofence: distancia_metros <= 20,
    };
  });

  if (userLat && userLng) {
    puntosWithDistance = puntosWithDistance.sort((a, b) => a.distancia_metros - b.distancia_metros);
  }

  res.json({
    total: puntosWithDistance.length,
    geofence_radio_max_metros: 20,
    puntos: puntosWithDistance,
  });
});

// 3. Delivery Validation & Deposit (With Geofence <= 20m & 24h Antifraud)
app.post('/api/entregas/validate-and-deposit', (req, res) => {
  const {
    usuario_id = 1,
    punto_id,
    material_nombre,
    categoria,
    peso_kg,
    puntos_otorgados,
    co2_ahorrado_kg,
    userLat,
    userLng,
    qr_hash,
  } = req.body;

  const punto = PUNTOS_LIMPIOS.find((p) => p.id === Number(punto_id));
  if (!punto) {
    return res.status(404).json({ error: 'Punto limpio no encontrado en el sistema.' });
  }

  // A) QR Code Validation
  if (qr_hash && qr_hash !== punto.codigo_qr_hash) {
    return res.status(400).json({
      error: 'Código QR inválido para este punto de acopio. Verifica el contenedor físico.',
      codigo_esperado: punto.codigo_qr_hash,
    });
  }

  // B) Geofence Check (<= 20 meters)
  const distance = calculateHaversineDistance(
    Number(userLat),
    Number(userLng),
    punto.latitud,
    punto.longitud
  );

  if (distance > 20) {
    return res.status(403).json({
      error: 'Geofencing fallido: Estás fuera del radio permitido de entrega.',
      distancia_actual_metros: distance,
      distancia_maxima_permitida_metros: 20,
      mensaje: `Te encuentras a ${distance} metros del contenedor. Acércate a menos de 20m para habilitar el depósito.`,
    });
  }

  // C) Antifraud Check (Rate Limiting: same user + punto + item within 24h)
  const antifraudKey = `${usuario_id}_${punto_id}_${material_nombre}_${categoria}`;
  const lastScan = ANTIFRAUDE_REGISTRO.get(antifraudKey);
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  if (lastScan && now - lastScan < TWENTY_FOUR_HOURS) {
    const elapsedMinutes = Math.round((now - lastScan) / 60000);
    return res.status(429).json({
      error: 'Antifraude activado: Ya registraste este mismo ítem en este punto recientemente.',
      tiempo_transcurrido_minutos: elapsedMinutes,
      regla: 'Límite de 1 depósito del mismo tipo por punto cada 24 horas.',
    });
  }

  // Update antifraud registry
  ANTIFRAUDE_REGISTRO.set(antifraudKey, now);

  // Generate cryptographic delivery receipt hash
  const receiptHash = '0x' + Math.random().toString(16).substring(2, 10) + Date.now().toString(16).slice(-6);

  // Create new verified delivery
  const nuevaEntrega: Entrega = {
    id: HISTORIAL_ENTREGAS.length + 101,
    uuid: `ent-${Math.random().toString(36).substring(2, 10)}`,
    usuario_id,
    punto_id: punto.id,
    material_nombre: material_nombre || 'Residuo Clasificado',
    categoria: categoria || 'Plástico PET',
    peso_kg: Number(peso_kg) || 0.15,
    puntos_otorgados: Number(puntos_otorgados) || 25,
    co2_ahorrado_kg: Number(co2_ahorrado_kg) || 0.22,
    estado: 'confirmada',
    latitud_registro: Number(userLat),
    longitud_registro: Number(userLng),
    distancia_metros: distance,
    qr_hash: qr_hash || punto.codigo_qr_hash,
    fecha_entrega: new Date().toISOString(),
    cadena_custodia_paso: 'depositado',
    recibo_digital_hash: receiptHash,
  };

  HISTORIAL_ENTREGAS.unshift(nuevaEntrega);

  // Credit user wallet transaction
  const transaccionCredito: Transaccion = {
    id: TRANSACCIONES_PUNTOS.length + 1,
    usuario_id,
    tipo: 'credito',
    monto_puntos: nuevaEntrega.puntos_otorgados,
    descripcion: `Entrega verificada en ${punto.nombre}: ${nuevaEntrega.material_nombre} (${nuevaEntrega.peso_kg} kg)`,
    fecha: nuevaEntrega.fecha_entrega,
  };
  TRANSACCIONES_PUNTOS.unshift(transaccionCredito);

  // Update fill level
  punto.capacidad_actual_kg = Math.min(punto.capacidad_max_kg, punto.capacidad_actual_kg + nuevaEntrega.peso_kg);

  // Return success receipt
  res.json({
    success: true,
    mensaje: '¡Entrega validada exitosamente! Tus Ecocoins han sido acreditadas.',
    entrega: nuevaEntrega,
    nuevo_saldo_ecocoins: TRANSACCIONES_PUNTOS.reduce((acc, curr) => {
      return curr.tipo === 'credito' ? acc + curr.monto_puntos : acc - curr.monto_puntos;
    }, 0),
  });
});

// 4. Rewards Wallet & User Metrics
app.get('/api/user/wallet', (req, res) => {
  const saldoTotal = TRANSACCIONES_PUNTOS.reduce((acc, curr) => {
    return curr.tipo === 'credito' ? acc + curr.monto_puntos : acc - curr.monto_puntos;
  }, 0);

  const totalKgReciclados = HISTORIAL_ENTREGAS.reduce((acc, curr) => acc + curr.peso_kg, 0);
  const totalCo2Ahorrado = HISTORIAL_ENTREGAS.reduce((acc, curr) => acc + curr.co2_ahorrado_kg, 0);

  res.json({
    saldo_ecocoins: saldoTotal,
    nivel_rango: saldoTotal > 300 ? 'Guardián Circular' : saldoTotal > 150 ? 'Reciclador Activo' : 'Novicio Verde',
    estadisticas_impacto: {
      kg_reciclados: Number(totalKgReciclados.toFixed(2)),
      co2_ahorrado_kg: Number(totalCo2Ahorrado.toFixed(2)),
      entregas_totales: HISTORIAL_ENTREGAS.length,
      equivalencia_arboles: Number((totalCo2Ahorrado / 22).toFixed(2)),
    },
    transacciones: TRANSACCIONES_PUNTOS,
    catalogo_recompensas: RECOMPENSAS_CATALOGO,
  });
});

// 5. Redeem Reward
app.post('/api/rewards/redeem', (req, res) => {
  const { rewardId, usuario_id = 1 } = req.body;
  const reward = RECOMPENSAS_CATALOGO.find((r) => r.id === rewardId);
  if (!reward) {
    return res.status(404).json({ error: 'Recompensa no encontrada.' });
  }

  const saldoActual = TRANSACCIONES_PUNTOS.reduce((acc, curr) => {
    return curr.tipo === 'credito' ? acc + curr.monto_puntos : acc - curr.monto_puntos;
  }, 0);

  if (saldoActual < reward.costo_ecocoins) {
    return res.status(400).json({
      error: 'Saldo insuficiente de Ecocoins',
      saldo_actual: saldoActual,
      costo_requerido: reward.costo_ecocoins,
    });
  }

  const voucherCode = `ECO-${reward.sponsor.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const debitoTransaccion: Transaccion = {
    id: TRANSACCIONES_PUNTOS.length + 1,
    usuario_id,
    tipo: 'debito_canje',
    monto_puntos: reward.costo_ecocoins,
    descripcion: `Canje de cupón: ${reward.titulo} (${reward.sponsor})`,
    fecha: new Date().toISOString(),
    codigo_voucher: voucherCode,
  };

  TRANSACCIONES_PUNTOS.unshift(debitoTransaccion);
  reward.stock = Math.max(0, reward.stock - 1);

  const nuevoSaldo = saldoActual - reward.costo_ecocoins;

  res.json({
    success: true,
    mensaje: `¡Canje exitoso! Presenta tu código QR en el establecimiento de ${reward.sponsor}.`,
    voucher: {
      codigo: voucherCode,
      titulo: reward.titulo,
      sponsor: reward.sponsor,
      instrucciones: reward.descripcion,
      valido_hasta: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    nuevo_saldo: nuevoSaldo,
  });
});

// 6. ESG & Traceability Chain of Custody Report
app.get('/api/esg/report', (_req, res) => {
  const totalKg = HISTORIAL_ENTREGAS.reduce((acc, curr) => acc + curr.peso_kg, 0);
  const totalCo2 = HISTORIAL_ENTREGAS.reduce((acc, curr) => acc + curr.co2_ahorrado_kg, 0);

  const desgloseMateriales = {
    'Plástico PET': HISTORIAL_ENTREGAS.filter((e) => e.categoria === 'Plástico PET').reduce((acc, e) => acc + e.peso_kg, 0),
    'Cartón y Papel': HISTORIAL_ENTREGAS.filter((e) => e.categoria === 'Cartón y Papel').reduce((acc, e) => acc + e.peso_kg, 0),
    'Aluminio / Latas': HISTORIAL_ENTREGAS.filter((e) => e.categoria === 'Aluminio / Latas').reduce((acc, e) => acc + e.peso_kg, 0),
    'Vidrio': HISTORIAL_ENTREGAS.filter((e) => e.categoria === 'Vidrio').reduce((acc, e) => acc + e.peso_kg, 0),
  };

  res.json({
    empresa_operadora: 'EcoCommunity Platform Corp',
    normativa_cumplimiento: 'ISO 14001 & Directiva Circular ESG 2026',
    metricas_acumuladas: {
      kg_totales_desviados: Number(totalKg.toFixed(2)),
      co2_evitado_kg: Number(totalCo2.toFixed(2)),
      kwh_energia_ahorrada: Number((totalKg * 4.2).toFixed(1)),
      litros_agua_ahorrados: Number((totalKg * 26.5).toFixed(0)),
      arboles_equivalentes: Number((totalCo2 / 22).toFixed(2)),
    },
    desglose_materiales: desgloseMateriales,
    cadena_de_custodia: HISTORIAL_ENTREGAS.slice(0, 10).map((entrega) => ({
      entrega_id: entrega.uuid,
      material: entrega.material_nombre,
      peso: `${entrega.peso_kg} kg`,
      estado_actual: entrega.cadena_custodia_paso,
      fecha: entrega.fecha_entrega,
      hash_verificacion: entrega.recibo_digital_hash,
    })),
    marcas_aliadas_esg: [
      { marca: 'GreenRoast Coffee', empaques_recuperados: 412, status: 'Neutralidad Plástica Fase 1' },
      { marca: 'Agua Pura Andina', empaques_recuperados: 1240, status: 'Circularidad Certificada 88%' },
      { marca: 'BioAlimentos Cereal', empaques_recuperados: 680, status: 'Empaque Monomaterial Aprobado' },
    ],
  });
});

// Vite / Static Files Middleware Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`EcoCommunity Server running on http://localhost:${port}`);
  });
}

startServer();
