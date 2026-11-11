import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { LazySection } from '../LazySection';
import {
  Building2,
  Scale,
  RotateCw,
  FileText,
  CheckCircle2,
  Boxes,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface DropoffCenterPrivateWebProps {
  currentUser: UserProfile;
}

export const DropoffCenterPrivateWeb: React.FC<DropoffCenterPrivateWebProps> = ({ currentUser }) => {
  const [scaleWeight, setScaleWeight] = useState(18.4);
  const [batchMaterial, setBatchMaterial] = useState('Plástico PET Fardos');
  const [supplierName, setSupplierName] = useState('Ruta Camión #04 — Carlos Gestor');
  const [manifestSuccess, setManifestSuccess] = useState(false);
  const [lastManifestHash, setLastManifestHash] = useState('');

  const [silos, setSilos] = useState([
    { id: 'silo-pet', name: 'Silo A — Plástico PET', current: 420, max: 850, pct: 49 },
    { id: 'silo-carton', name: 'Silo B — Cartón Corrugado', current: 1680, max: 3000, pct: 56 },
    { id: 'silo-aluminio', name: 'Silo C — Aluminio Densificado', current: 510, max: 1200, pct: 42 },
    { id: 'silo-vidrio', name: 'Silo D — Vidrio Cullet', current: 3100, max: 5000, pct: 62 },
  ]);

  const handleEmitManifest = () => {
    const hash = '0x' + Math.random().toString(16).substring(2, 10) + Date.now().toString(16).slice(-4);
    setLastManifestHash(hash);
    setManifestSuccess(true);

    // Update corresponding silo
    setSilos((prev) =>
      prev.map((s) => {
        if (s.name.toLowerCase().includes(batchMaterial.split(' ')[0].toLowerCase())) {
          const nextVal = Math.min(s.max, Math.round(s.current + scaleWeight));
          return { ...s, current: nextVal, pct: Math.round((nextVal / s.max) * 100) };
        }
        return s;
      })
    );

    setTimeout(() => setManifestSuccess(false), 4000);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <LazySection>
        <div className="card-ecosia p-6 sm:p-10 rounded-[20px] border border-[#f0f0eb] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#d7eb80] text-[#333333] flex items-center justify-center font-bold text-xl shrink-0 border-2 border-[#333333]">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full bg-[#333333] text-[#d7eb80] text-[10px] font-bold uppercase tracking-wider">
                  Web Privada de Centro de Acopio & Pesaje
                </span>
                <span className="text-xs text-[#6c6c6c]">Terminal Industrial #TER-03</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#333333]">
                {currentUser.entidad || 'Centro de Acopio & Molienda Sur'}
              </h2>
              <p className="text-xs sm:text-sm text-[#6c6c6c] mt-0.5">
                Operador Responsable: <strong>{currentUser.nombre}</strong> · Homologación ISO 14001
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Capacidad Total</span>
              <span className="font-bold text-lg text-[#333333] tabular-nums">10,050 kg</span>
            </div>
            <div className="w-px h-8 bg-[#f0f0eb]" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Ocupación</span>
              <span className="font-bold text-lg text-[#2d8c3a] tabular-nums">57%</span>
            </div>
            <div className="w-px h-8 bg-[#f0f0eb]" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Báscula</span>
              <span className="font-bold text-lg text-[#333333]">Calibrada</span>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Main Grid: Left Scale Terminal, Right Storage Silos */}
      <LazySection delayMs={100}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Load Cell Weigh Scale (7 cols) */}
          <div className="lg:col-span-7 bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f0eb]">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#333333]" />
                <h3 className="text-xl font-bold text-[#333333]">Báscula de Recepción Industrial</h3>
              </div>
              <span className="text-xs font-semibold text-[#2d8c3a] bg-[#d7eb80]/40 px-3 py-1 rounded-full">
                Celda de Carga Activa
              </span>
            </div>

            {/* Huge Weight Readout */}
            <div className="p-8 bg-[#f8f8f6] rounded-[20px] border border-[#f0f0eb] text-center space-y-4">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#6c6c6c] block">
                PESO NETO EN PLATAFORMA DE PESAJE
              </span>
              <div className="text-5xl sm:text-6xl font-bold text-[#333333] tabular-nums tracking-tight">
                {scaleWeight.toFixed(2)} <span className="text-2xl text-[#6c6c6c]">kg</span>
              </div>

              {/* Incremental / Tare Controls */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setScaleWeight((prev) => Math.max(0, parseFloat((prev - 5.0).toFixed(2))))}
                  className="px-4 py-1.5 bg-[#ffffff] border border-[#bebeb9] rounded-full text-xs font-semibold text-[#333333] hover:bg-[#f0f0eb]"
                >
                  -5.0 kg
                </button>
                <button
                  type="button"
                  onClick={() => setScaleWeight((prev) => Math.max(0, parseFloat((prev - 1.0).toFixed(2))))}
                  className="px-4 py-1.5 bg-[#ffffff] border border-[#bebeb9] rounded-full text-xs font-semibold text-[#333333] hover:bg-[#f0f0eb]"
                >
                  -1.0 kg
                </button>
                <button
                  type="button"
                  onClick={() => setScaleWeight((prev) => parseFloat((prev + 5.0).toFixed(2)))}
                  className="px-4 py-1.5 bg-[#ffffff] border border-[#bebeb9] rounded-full text-xs font-semibold text-[#333333] hover:bg-[#f0f0eb]"
                >
                  +5.0 kg
                </button>
                <button
                  type="button"
                  onClick={() => setScaleWeight((prev) => parseFloat((prev + 20.0).toFixed(2)))}
                  className="px-4 py-1.5 bg-[#ffffff] border border-[#bebeb9] rounded-full text-xs font-semibold text-[#333333] hover:bg-[#f0f0eb]"
                >
                  +20.0 kg
                </button>
                <button
                  type="button"
                  onClick={() => setScaleWeight(0)}
                  className="px-4 py-1.5 bg-[#ffffff] border border-[#bebeb9] rounded-full text-xs font-semibold text-[#333333] hover:bg-[#f0f0eb] flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Tara (0.00)</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#333333] block mb-1">Tipo de Material del Lote</label>
                <select
                  value={batchMaterial}
                  onChange={(e) => setBatchMaterial(e.target.value)}
                  className="w-full text-xs p-3 rounded-full border border-[#f0f0eb] bg-[#f8f8f6] text-[#333333] outline-none font-semibold"
                >
                  <option value="Plástico PET Fardos">Plástico PET Fardos Prensados</option>
                  <option value="Cartón Corrugado">Cartón Corrugado Plegado</option>
                  <option value="Aluminio Densificado">Aluminio y Latas Densificadas</option>
                  <option value="Vidrio Cullet">Vidrio Cullet Triturado</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#333333] block mb-1">Proveedor / Transportista</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full text-xs p-3 rounded-full border border-[#f0f0eb] bg-[#f8f8f6] text-[#333333] outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleEmitManifest}
              className="w-full btn-pill-lime py-3.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#333333]" />
              <span>Emitir y Sellar Manifiesto de Recepción Criptográfico</span>
            </button>

            {manifestSuccess && (
              <div className="p-4 rounded-[16px] bg-[#d7eb80]/40 border border-[#d7eb80] text-xs text-[#333333] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#2d8c3a]" />
                  <span>¡Manifiesto de Acopio Generado Exitosamente!</span>
                </div>
                <p className="font-mono text-[11px] text-[#6c6c6c]">
                  Hash Sello: {lastManifestHash} · {scaleWeight} kg transferidos al silo correspondiente.
                </p>
              </div>
            )}
          </div>

          {/* Storage Silos & Capacity (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f0eb]">
                <div className="flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-[#333333]" />
                  <h3 className="text-xl font-bold text-[#333333]">Capacidad de Silos y Tolvas</h3>
                </div>
                <span className="text-xs text-[#6c6c6c]">Tiempo Real</span>
              </div>

              <div className="space-y-4">
                {silos.map((silo) => (
                  <div key={silo.id} className="p-4 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#333333]">{silo.name}</span>
                      <span className="font-mono text-[#6c6c6c] tabular-nums font-semibold">
                        {silo.current} / {silo.max} kg ({silo.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#f0f0eb] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          silo.pct > 80 ? 'bg-red-500' : 'bg-[#d7eb80]'
                        }`}
                        style={{ width: `${silo.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb] text-xs space-y-1.5 text-[#6c6c6c]">
                <div className="flex items-center gap-1.5 font-bold text-[#333333]">
                  <ShieldCheck className="w-4 h-4 text-[#2d8c3a]" />
                  <span>Protocolo de Certificación Saliente</span>
                </div>
                <p className="leading-relaxed">
                  Los lotes que superan el 85% de capacidad activan automáticamente la orden de recogida para la planta de molienda y granulación (rPET).
                </p>
              </div>
            </div>
          </div>
        </div>
      </LazySection>
    </div>
  );
};
