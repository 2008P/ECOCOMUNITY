import React, { useState } from 'react';
import { UserRole } from '../types';
import { LazySection } from './LazySection';
import {
  Truck,
  Building2,
  Award,
  ShieldAlert,
  Scale,
  CheckCircle2,
  FileText,
  RotateCw,
} from 'lucide-react';

interface OperatorTerminalViewProps {
  userRole: UserRole;
  onSwitchToCitizen: () => void;
}

export const OperatorTerminalView: React.FC<OperatorTerminalViewProps> = ({
  userRole,
  onSwitchToCitizen,
}) => {
  const [scaleWeight, setScaleWeight] = useState(12.5);
  const [batchMaterial, setBatchMaterial] = useState('Plástico PET');
  const [manifestSuccess, setManifestSuccess] = useState(false);

  const handleGenerateManifest = () => {
    setManifestSuccess(true);
    setTimeout(() => setManifestSuccess(false), 3500);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Role Notice Banner in Ecosia Warm Mist */}
      <LazySection>
        <div className="p-8 rounded-[20px] card-ecosia border border-[#f0f0eb] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#6c6c6c] block mb-1">
              INFRAESTRUCTURA OPERATIVA (RBAC)
            </span>
            <h3 className="text-2xl font-bold text-[#333333]">
              {userRole === 'recolector' && 'Terminal Operativo de Reciclador Urbano / Gestor'}
              {userRole === 'punto_acopio' && 'Terminal de Pesaje y Acopio Físico'}
              {userRole === 'marca_aliada' && 'Partner Dashboard B2B — Marcas Patrocinadoras'}
              {userRole === 'admin' && 'Consola de Super Administración & Auditoría'}
            </h3>
          </div>
          <button
            onClick={onSwitchToCitizen}
            className="btn-pill-lime text-xs py-2.5 px-5 self-start sm:self-auto"
          >
            Volver a Modo Ciudadano (B2C)
          </button>
        </div>
      </LazySection>

      {userRole === 'punto_acopio' && (
        <LazySection delayMs={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#333333]" />
                <h4 className="text-xl font-bold text-[#333333]">Báscula Industrial Homologada</h4>
              </div>
              <p className="text-xs text-[#6c6c6c]">
                Simulador de pesaje de lotes en recepción para certificación de cadena de custodia.
              </p>

              <div className="p-8 bg-[#f8f8f6] rounded-[20px] border border-[#f0f0eb] text-center space-y-4">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#6c6c6c] block">Lectura Actual de Celda de Carga</span>
                <div className="text-5xl font-bold text-[#333333] tabular-nums tracking-tight">
                  {scaleWeight.toFixed(2)} kg
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setScaleWeight((prev) => Math.max(1, prev - 2.5))}
                    className="px-3.5 py-1.5 bg-[#ffffff] border border-[#bebeb9] rounded-full text-xs font-semibold text-[#333333] hover:bg-[#f0f0eb]"
                  >
                    -2.5 kg
                  </button>
                  <button
                    onClick={() => setScaleWeight((prev) => prev + 5.0)}
                    className="px-3.5 py-1.5 bg-[#ffffff] border border-[#bebeb9] rounded-full text-xs font-semibold text-[#333333] hover:bg-[#f0f0eb]"
                  >
                    +5.0 kg
                  </button>
                  <button
                    onClick={() => setScaleWeight(12.5)}
                    className="px-3.5 py-1.5 bg-[#ffffff] border border-[#bebeb9] rounded-full text-xs font-semibold text-[#333333] hover:bg-[#f0f0eb] flex items-center gap-1"
                  >
                    <RotateCw className="w-3 h-3 text-[#333333]" /> Tara
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#6c6c6c] block mb-1.5">
                  Tipo de Material del Lote:
                </label>
                <select
                  value={batchMaterial}
                  onChange={(e) => setBatchMaterial(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-[16px] border border-[#f0f0eb] bg-[#ffffff] text-[#333333] outline-none"
                >
                  <option value="Plástico PET">Plástico PET Fardos</option>
                  <option value="Cartón y Papel">Cartón Corrugado Compactado</option>
                  <option value="Aluminio / Latas">Aluminio Densificado</option>
                  <option value="Vidrio">Vidrio Triturado Cullet</option>
                </select>
              </div>

              <button
                onClick={handleGenerateManifest}
                className="w-full btn-pill-lime text-xs py-3 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#333333]" />
                <span>Emitir Manifiesto Digital</span>
              </button>

              {manifestSuccess && (
                <div className="p-4 bg-[#d7eb80]/40 border border-[#d7eb80] rounded-[16px] text-xs text-[#333333] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2d8c3a]" />
                  <span>Manifiesto #MAN-2026-881 emitido con éxito y sellado criptográficamente.</span>
                </div>
              )}
            </div>

            {/* Storage Bays */}
            <div className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-8 space-y-6">
              <h4 className="text-xl font-bold text-[#333333]">Estado de Silos y Tolvas de Acopio</h4>
              <div className="space-y-4">
                {[
                  { name: 'Silo A — Plástico PET', current: 320, max: 850, pct: 38 },
                  { name: 'Silo B — Cartón y Papel', current: 1450, max: 3000, pct: 48 },
                  { name: 'Silo C — Aluminio / Metales', current: 410, max: 1200, pct: 34 },
                  { name: 'Silo D — Vidrio a Granel', current: 2800, max: 5000, pct: 56 },
                ].map((silo, idx) => (
                  <div key={idx} className="p-4 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#333333]">{silo.name}</span>
                      <span className="font-mono text-[#6c6c6c] tabular-nums">
                        {silo.current} / {silo.max} kg ({silo.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#f0f0eb] rounded-full overflow-hidden">
                      <div className="h-full bg-[#d7eb80] rounded-full" style={{ width: `${silo.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </LazySection>
      )}

      {userRole === 'recolector' && (
        <LazySection delayMs={100}>
          <div className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold text-[#333333]">Ruta Asignada de Recolección en Campo</h4>
                <p className="text-xs text-[#6c6c6c]">Paradas optimizadas por proximidad y nivel de llenado</p>
              </div>
              <span className="text-[11px] font-bold text-[#333333] bg-[#d7eb80] px-3.5 py-1.5 rounded-full">
                3 Paradas Pendientes
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  punto: 'Estación Inteligente EcoCommunity - Plaza Central',
                  fill: '38% (320 kg)',
                  estado: 'Listo para retiro',
                },
                {
                  punto: 'Punto Limpio Municipal Parque Verde',
                  fill: '48% (1450 kg)',
                  estado: 'Programado 15:30h',
                },
                {
                  punto: 'Contenedor Campus Universitario',
                  fill: '32% (195 kg)',
                  estado: 'Ruta secundaria',
                },
              ].map((route, idx) => (
                <div key={idx} className="p-4 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-[#333333] block">{route.punto}</span>
                    <span className="text-[11px] text-[#6c6c6c]">
                      Carga estimada: {route.fill} · {route.estado}
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Escaneando transferencia de lote en ${route.punto}... Transferencia confirmada.`)}
                    className="btn-pill-lime text-xs py-2 px-4 shrink-0"
                  >
                    Registrar Retiro QR
                  </button>
                </div>
              ))}
            </div>
          </div>
        </LazySection>
      )}

      {(userRole === 'marca_aliada' || userRole === 'admin') && (
        <LazySection delayMs={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-8 space-y-6">
              <div className="flex items-center gap-2 text-[#333333]">
                <ShieldAlert className="w-5 h-5 text-[#333333]" />
                <h4 className="text-xl font-bold">Alertas Antifraude & Auditoría</h4>
              </div>
              <p className="text-xs text-[#6c6c6c]">
                Mecanismos activos de prevención de falsificación de entregas y geofencing.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb] flex items-center justify-between">
                  <span className="text-[#6c6c6c]">Restricción de duplicados en 24h:</span>
                  <span className="font-bold text-[#2d8c3a]">ACTIVA</span>
                </div>
                <div className="p-4 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb] flex items-center justify-between">
                  <span className="text-[#6c6c6c]">Radio Geofence estricto:</span>
                  <span className="font-bold text-[#333333]">≤ 20 metros</span>
                </div>
                <div className="p-4 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb] flex items-center justify-between">
                  <span className="text-[#6c6c6c]">Motor de Inferencia Visual:</span>
                  <span className="font-bold text-[#333333]">Gemini 3.8 Flash</span>
                </div>
              </div>
            </div>

            <div className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-8 space-y-6">
              <h4 className="text-xl font-bold text-[#333333]">Factores de Recompensa por Categoría</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb]">
                  <span className="text-[#6c6c6c]">Plástico PET:</span>
                  <span className="font-bold text-sm text-[#333333] tabular-nums">200 EC / kg</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb]">
                  <span className="text-[#6c6c6c]">Aluminio / Latas:</span>
                  <span className="font-bold text-sm text-[#333333] tabular-nums">350 EC / kg</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb]">
                  <span className="text-[#6c6c6c]">Tetra Pak:</span>
                  <span className="font-bold text-sm text-[#333333] tabular-nums">180 EC / kg</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb]">
                  <span className="text-[#6c6c6c]">Cartón y Papel:</span>
                  <span className="font-bold text-sm text-[#333333] tabular-nums">100 EC / kg</span>
                </div>
              </div>
            </div>
          </div>
        </LazySection>
      )}
    </div>
  );
};
