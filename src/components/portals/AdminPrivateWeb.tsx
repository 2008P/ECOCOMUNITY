import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { LazySection } from '../LazySection';
import {
  ShieldAlert,
  Sliders,
  MapPin,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Users,
  Coins,
  Scale,
} from 'lucide-react';

interface AdminPrivateWebProps {
  currentUser: UserProfile;
}

export const AdminPrivateWeb: React.FC<AdminPrivateWebProps> = ({ currentUser }) => {
  const [rates, setRates] = useState({
    pet: 200,
    aluminio: 350,
    carton: 100,
    vidrio: 120,
    tetra: 180,
  });

  const [fraudLogs, setFraudLogs] = useState([
    {
      id: 'SEC-LOG-901',
      tipo: 'Geofence Breach Bloqueado',
      detalle: 'Intento de entrega a 184 metros del contenedor #02',
      resultado: 'Bloqueado por API (403)',
      hora: 'Hace 12 min',
      ip_o_dispositivo: 'GPS Móvil Lat: 40.4188, Lon: -3.7050',
    },
    {
      id: 'SEC-LOG-900',
      tipo: '24h Antifraud Rate Limit',
      detalle: 'Mismo usuario #42 intentó registrar Botella PET duplicada en contenedor #01',
      resultado: 'Rechazado por regla de 24 horas (429)',
      hora: 'Hace 45 min',
      ip_o_dispositivo: 'Usuario #42',
    },
    {
      id: 'SEC-LOG-899',
      tipo: 'Validación Gemini Exitosa',
      detalle: 'Empaque de jugo Tetra Brik clasificado con 96% de confianza',
      resultado: 'Aprobado & Acreditado',
      hora: 'Hace 1h 15m',
      ip_o_dispositivo: 'Modelo Gemini 3.8 Flash',
    },
  ]);

  const [pointsList, setPointsList] = useState([
    { id: 1, name: 'Estación Inteligente - Plaza Central', status: 'Activo (Online)', tolva: '38%', lat: 40.4153, lng: -3.7073 },
    { id: 2, name: 'Punto Limpio Municipal Parque Verde', status: 'Activo (Online)', tolva: '48%', lat: 40.4172, lng: -3.7025 },
    { id: 3, name: 'Centro de Acopio San Telmo', status: 'Activo (Online)', tolva: '56%', lat: 40.4191, lng: -3.7099 },
    { id: 4, name: 'Contenedor Campus Universitario', status: 'Activo (Online)', tolva: '32%', lat: 40.4132, lng: -3.7011 },
  ]);

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <LazySection>
        <div className="card-ecosia p-6 sm:p-10 rounded-[20px] border border-[#f0f0eb] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#333333] text-[#d7eb80] flex items-center justify-center font-bold text-xl shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full bg-[#333333] text-[#d7eb80] text-[10px] font-bold uppercase tracking-wider">
                  Consola Privada Super Administrador
                </span>
                <span className="text-xs text-[#6c6c6c]">Gobernanza Municipal Global</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#333333]">
                Panel de Auditoría & Control Central
              </h2>
              <p className="text-xs sm:text-sm text-[#6c6c6c] mt-0.5">
                Supervisión antifraude, fijación de tarifas de recompensa y gestión de la red de tolvas inteligentes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Puntos Activos</span>
              <span className="font-bold text-lg text-[#333333] tabular-nums">4 / 4</span>
            </div>
            <div className="w-px h-8 bg-[#f0f0eb]" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Incidentes Hoy</span>
              <span className="font-bold text-lg text-[#2d8c3a] tabular-nums">0 Críticos</span>
            </div>
            <div className="w-px h-8 bg-[#f0f0eb]" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">IA Status</span>
              <span className="font-bold text-lg text-[#2d8c3a]">Gemini 3.8</span>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Grid: Left Security & Anti-Fraud Logs, Right Rate Controls */}
      <LazySection delayMs={100}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Security & Antifraud Engine (7 cols) */}
          <div className="lg:col-span-7 bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f0eb]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#333333]" />
                <h3 className="text-xl font-bold text-[#333333]">Motor Antifraude & Auditoría en Vivo</h3>
              </div>
              <span className="text-xs font-semibold text-[#2d8c3a] bg-[#d7eb80]/40 px-3 py-1 rounded-full">
                Vigilancia Activa
              </span>
            </div>

            {/* Antifraud rules badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb]">
                <span className="text-[#6c6c6c] block text-[11px] font-semibold">Geofence Estricto</span>
                <span className="font-bold text-[#333333]">≤ 20 metros (Haversine)</span>
              </div>
              <div className="p-3.5 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb]">
                <span className="text-[#6c6c6c] block text-[11px] font-semibold">Duplicados</span>
                <span className="font-bold text-[#333333]">Ventana 24h por Ítem</span>
              </div>
              <div className="p-3.5 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb]">
                <span className="text-[#6c6c6c] block text-[11px] font-semibold">Criptografía</span>
                <span className="font-bold text-[#333333]">Sello Hash Inmutable</span>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6c6c6c] block">
                ÚLTIMOS EVENTOS DE SEGURIDAD
              </span>
              <div className="space-y-2">
                {fraudLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-[#333333]">{log.id}</span>
                        <span>·</span>
                        <span className="font-semibold text-[#333333]">{log.tipo}</span>
                        <span>·</span>
                        <span className="text-[#6c6c6c]">{log.hora}</span>
                      </div>
                      <p className="text-[#6c6c6c]">{log.detalle}</p>
                      <span className="font-mono text-[11px] text-[#6c6c6c] mt-0.5 block">{log.ip_o_dispositivo}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-[11px] shrink-0 self-start sm:self-auto ${
                        log.resultado.includes('Bloqueado') || log.resultado.includes('Rechazado')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#d7eb80] text-[#333333]'
                      }`}
                    >
                      {log.resultado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rate Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f0eb]">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#333333]" />
                  <h3 className="text-xl font-bold text-[#333333]">Tarifas de Incentivo (EC/kg)</h3>
                </div>
                <span className="text-xs text-[#6c6c6c]">Dinámicas</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb]">
                  <span className="font-semibold text-[#333333]">Plástico PET</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rates.pet}
                      onChange={(e) => setRates({ ...rates, pet: parseInt(e.target.value) || 0 })}
                      className="w-20 font-bold p-1.5 text-center rounded-full bg-[#ffffff] border border-[#f0f0eb] text-[#333333]"
                    />
                    <span className="text-[#6c6c6c] font-semibold">EC/kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb]">
                  <span className="font-semibold text-[#333333]">Aluminio / Latas</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rates.aluminio}
                      onChange={(e) => setRates({ ...rates, aluminio: parseInt(e.target.value) || 0 })}
                      className="w-20 font-bold p-1.5 text-center rounded-full bg-[#ffffff] border border-[#f0f0eb] text-[#333333]"
                    />
                    <span className="text-[#6c6c6c] font-semibold">EC/kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb]">
                  <span className="font-semibold text-[#333333]">Cartón y Papel</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rates.carton}
                      onChange={(e) => setRates({ ...rates, carton: parseInt(e.target.value) || 0 })}
                      className="w-20 font-bold p-1.5 text-center rounded-full bg-[#ffffff] border border-[#f0f0eb] text-[#333333]"
                    />
                    <span className="text-[#6c6c6c] font-semibold">EC/kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb]">
                  <span className="font-semibold text-[#333333]">Vidrio</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rates.vidrio}
                      onChange={(e) => setRates({ ...rates, vidrio: parseInt(e.target.value) || 0 })}
                      className="w-20 font-bold p-1.5 text-center rounded-full bg-[#ffffff] border border-[#f0f0eb] text-[#333333]"
                    />
                    <span className="text-[#6c6c6c] font-semibold">EC/kg</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert('¡Tarifas de compensación municipal actualizadas y propagadas a la red!')}
                className="w-full btn-pill-lime py-3 text-xs font-bold"
              >
                Actualizar Tarifas Municipales
              </button>
            </div>
          </div>
        </div>
      </LazySection>
    </div>
  );
};
