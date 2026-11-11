export type UserRole = 'ciudadano' | 'recolector' | 'punto_acopio' | 'marca_aliada' | 'admin';

export interface UserProfile {
  id: number;
  nombre: string;
  email: string;
  rol: UserRole;
  avatar_url?: string;
  entidad?: string;
}

export type MaterialCategory =
  | 'Plástico PET'
  | 'Cartón y Papel'
  | 'Vidrio'
  | 'Aluminio / Latas'
  | 'Tetra Pak'
  | 'No reciclable';

export interface PuntoLimpio {
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
  distancia_metros?: number;
  dentro_de_geofence?: boolean;
}

export interface ClassificationResult {
  source: string;
  categoria: MaterialCategory;
  nombre_detectado: string;
  confianza: number;
  reciclable: boolean;
  peso_estimado_kg: number;
  puntos_estimados: number;
  co2_evitado_kg: number;
  consejo_preparacion: string;
  alternativas?: string[];
  huella_info?: string;
  imagen_preview?: string;
}

export interface Entrega {
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

export interface Transaccion {
  id: number;
  usuario_id: number;
  tipo: 'credito' | 'debito_canje';
  monto_puntos: number;
  descripcion: string;
  fecha: string;
  codigo_voucher?: string;
}

export interface Recompensa {
  id: string;
  sponsor: string;
  titulo: string;
  costo_ecocoins: number;
  categoria: string;
  descripcion: string;
  stock: number;
  marca_aliada_id: string;
  logo_svg: string;
}

export interface UserWalletData {
  saldo_ecocoins: number;
  nivel_rango: string;
  estadisticas_impacto: {
    kg_reciclados: number;
    co2_ahorrado_kg: number;
    entregas_totales: number;
    equivalencia_arboles: number;
  };
  transacciones: Transaccion[];
  catalogo_recompensas: Recompensa[];
}
