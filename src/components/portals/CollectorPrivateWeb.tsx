import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { LazySection } from '../LazySection';
import {
  Truck,
  MapPin,
  QrCode,
  CheckCircle2,
  Clock,
  Battery,
  FileText,
  AlertCircle,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';

interface CollectorPrivateWebProps {
  currentUser: UserProfile;
}

export const CollectorPrivateWeb: React.FC<CollectorPrivateWebProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'ruta' | 'transferencia' | 'manifiestos'>('ruta');
  const [scannedBin, setScannedBin] = useState<string | null>(null);
  const [transferWeight, setTransferWeight] = useState<number>(45.8);
  const [transferSuccess, setTransferSuccess] = useState(false);

  const routeStops = [
    {
      id: 1,
      orden: '01',
      nombre: 'Estación Inteligente EcoCommunity - Plaza Central',
      direccion: 'Plaza Mayor s/n, Distrito Centro',
      capacidadPct: 82,
      kgEstimados: 320,
      materiales: 'Plástico PET y Latas',
      estado: 'Crítico (Retiro Inmediato)',
      codigoQr: 'ECO-BIN-PLAZA-CENTRAL-01',
    },
    {
      id: 2,
      orden: '02',
      nombre: 'Punto Limpio Municipal Parque Verde',
      direccion: 'Av. de los Álamos 142',
      capacidadPct: 68,
      kgEstimados: 450,
      materiales: 'Cartón, Vidrio y PET',
      estado: 'Programado 14:30h',
      codigoQr: 'ECO-HUB-PARQUE-VERDE-02',
    },
    {
      id: 3,
      orden: '03',
      nombre: 'Contenedor Campus Universitario',
      direccion: 'Bulevar de las Ciencias 12',
      capacidadPct: 45,
      kgEstimados: 195,
      materiales: 'Plástico PET y Cartón',
      estado: 'Ruta secundaria 16:00h',
      codigoQr: 'ECO-BIN-CAMPUS-04',
    },
  ];

  const handleExecuteTransfer = () => {
    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      setScannedBin(null);
    }, 3500);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <LazySection>
        <div className="card-ecosia p-6 sm:p-10 rounded-[20px] border border-[#f0f0eb] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#d7eb80] text-[#333333] flex items-center justify-center font-bold text-xl shrink-0 border-2 border-[#333333]">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full bg-[#333333] text-[#d7eb80] text-[10px] font-bold uppercase tracking-wider">
                  Web Privada de Recolección & Logística
                </span>
                <span className="text-xs text-[#6c6c6c]">Unidad #ECO-CAMION-04</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#333333]">
                Terminal de Campo: {currentUser.nombre}
              </h2>
              <p className="text-xs sm:text-sm text-[#6c6c6c] mt-0.5">
                {currentUser.entidad || 'Cooperativa de Recicladores Urbanos Certificados'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Paradas Hoy</span>
              <span className="font-bold text-lg text-[#333333] tabular-nums">3 Activas</span>
            </div>
            <div className="w-px h-8 bg-[#f0f0eb]" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Carga Camión</span>
              <span className="font-bold text-lg text-[#333333] tabular-nums">965 kg</span>
            </div>
            <div className="w-px h-8 bg-[#f0f0eb]" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Estado</span>
              <span className="font-bold text-lg text-[#2d8c3a]">En Ruta</span>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Sub-Navigation Pills */}
      <LazySection delayMs={50}>
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#f8f8f6] rounded-full border border-[#f0f0eb] max-w-xl">
          <button
            onClick={() => setActiveTab('ruta')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'ruta'
                ? 'bg-[#333333] text-[#ffffff] shadow-sm'
                : 'text-[#6c6c6c] hover:text-[#333333]'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Ruta Asignada (3)</span>
          </button>

          <button
            onClick={() => setActiveTab('transferencia')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'transferencia'
                ? 'bg-[#333333] text-[#ffffff] shadow-sm'
                : 'text-[#6c6c6c] hover:text-[#333333]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Escanear Transferencia QR</span>
          </button>

          <button
            onClick={() => setActiveTab('manifiestos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'manifiestos'
                ? 'bg-[#333333] text-[#ffffff] shadow-sm'
                : 'text-[#6c6c6c] hover:text-[#333333]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Manifiestos de Carga</span>
          </button>
        </div>
      </LazySection>

      {/* Tab 1: Collection Route */}
      {activeTab === 'ruta' && (
        <LazySection delayMs={100}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {routeStops.map((stop) => (
                <div
                  key={stop.id}
                  className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-6 space-y-4 flex flex-col justify-between hover:border-[#d7eb80] transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-full bg-[#333333] text-[#d7eb80] font-bold text-xs flex items-center justify-center">
                        {stop.orden}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          stop.capacidadPct > 80
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-[#d7eb80]/40 text-[#333333]'
                        }`}
                      >
                        {stop.estado}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#333333] leading-snug">{stop.nombre}</h4>
                      <p className="text-xs text-[#6c6c6c] mt-0.5">{stop.direccion}</p>
                    </div>

                    <div className="p-3 bg-[#f8f8f6] rounded-[16px] space-y-1.5 text-xs">
                      <div className="flex justify-between text-[#6c6c6c]">
                        <span>Nivel de tolva:</span>
                        <strong className="text-[#333333] tabular-nums">{stop.capacidadPct}% ({stop.kgEstimados} kg)</strong>
                      </div>
                      <div className="w-full h-1.5 bg-[#f0f0eb] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${stop.capacidadPct > 80 ? 'bg-red-500' : 'bg-[#d7eb80]'}`}
                          style={{ width: `${stop.capacidadPct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#6c6c6c] block pt-1">
                        Materiales: {stop.materiales}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setScannedBin(stop.codigoQr);
                      setActiveTab('transferencia');
                    }}
                    className="w-full btn-pill-lime text-xs py-2.5 flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Llegada & Transferir Lote</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </LazySection>
      )}

      {/* Tab 2: Transfer QR Scanner Terminal */}
      {activeTab === 'transferencia' && (
        <LazySection delayMs={100}>
          <div className="card-ecosia p-8 sm:p-12 rounded-[20px] max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-[#ffffff] text-[#333333] flex items-center justify-center mx-auto mb-2 border border-[#bebeb9]/30">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#333333]">Confirmar Transferencia Tolva → Camión</h3>
              <p className="text-xs text-[#6c6c6c]">
                Escanea o confirma el código de tolva para registrar el vaciado en la cadena de custodia.
              </p>
            </div>

            <div className="p-6 bg-[#ffffff] rounded-[20px] border border-[#f0f0eb] space-y-4">
              <div>
                <label className="text-xs font-bold text-[#333333] block mb-1">Identificador de Contenedor QR</label>
                <input
                  type="text"
                  value={scannedBin || 'ECO-BIN-PLAZA-CENTRAL-01'}
                  onChange={(e) => setScannedBin(e.target.value)}
                  className="w-full font-mono text-sm p-3 rounded-full bg-[#f8f8f6] border border-[#f0f0eb] text-[#333333] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#333333] block mb-1">Peso Retirado Estimado / Balanza Móvil (kg)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={transferWeight}
                    onChange={(e) => setTransferWeight(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold p-3 rounded-full bg-[#f8f8f6] border border-[#f0f0eb] text-[#333333] outline-none tabular-nums"
                  />
                  <span className="text-sm font-semibold text-[#6c6c6c]">kilogramos</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#f8f8f6] rounded-[16px] text-xs text-[#6c6c6c] flex items-center justify-between">
                <span>Operador en cabina:</span>
                <strong className="text-[#333333]">{currentUser.nombre}</strong>
              </div>

              <button
                onClick={handleExecuteTransfer}
                className="w-full btn-pill-lime text-xs py-3.5 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#333333]" />
                <span>Firmar Digitalmente & Vaciado Exitoso</span>
              </button>

              {transferSuccess && (
                <div className="p-4 rounded-[16px] bg-[#d7eb80]/40 border border-[#d7eb80] text-xs text-[#333333] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2d8c3a] shrink-0" />
                  <span>Transferencia registrada en blockchain de custodia. Lote incorporado a carga #TRUCK-04.</span>
                </div>
              )}
            </div>
          </div>
        </LazySection>
      )}

      {/* Tab 3: Manifests */}
      {activeTab === 'manifiestos' && (
        <LazySection delayMs={100}>
          <div className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#f0f0eb]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6c6c6c] block">
                  REGISTROS DE TRASLADO MUNICIPAL
                </span>
                <h3 className="text-xl font-bold text-[#333333]">Manifiestos de Carga Emitidos</h3>
              </div>
              <span className="text-xs text-[#6c6c6c]">Ley 20.920 / Trazabilidad REP</span>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'MAN-2026-081',
                  fecha: 'Hoy, 10:45 AM',
                  origen: 'Estación Plaza Central',
                  destino: 'Centro de Acopio Sur',
                  peso: '320.5 kg',
                  material: 'Plástico PET y Latas',
                  hash: '0xfa8822bb1133',
                },
                {
                  id: 'MAN-2026-079',
                  fecha: 'Ayer, 16:30 PM',
                  origen: 'Parque Verde',
                  destino: 'Planta de Compactación Ecológica',
                  peso: '540.0 kg',
                  material: 'Cartón Corrugado',
                  hash: '0xee9933cc4455',
                },
              ].map((man) => (
                <div key={man.id} className="p-4 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#6c6c6c] mb-1">
                      <span className="font-bold text-[#333333]">{man.id}</span>
                      <span>·</span>
                      <span>{man.fecha}</span>
                    </div>
                    <h5 className="text-sm font-bold text-[#333333]">
                      {man.origen} → {man.destino}
                    </h5>
                    <p className="font-mono text-xs text-[#6c6c6c] mt-0.5">
                      Hash Sello: {man.hash} · Material: {man.material}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-[#333333] block tabular-nums">{man.peso}</span>
                    <span className="text-[11px] text-[#2d8c3a] font-semibold">Descargado Conforme</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </LazySection>
      )}
    </div>
  );
};
