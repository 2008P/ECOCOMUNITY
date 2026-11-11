import React, { useState, useEffect } from 'react';
import { PuntoLimpio, ClassificationResult, Entrega } from '../types';
import { LazySection } from './LazySection';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Navigation,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Clock,
  Battery,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface MapViewProps {
  scannedMaterial?: ClassificationResult | null;
  onDeliveryComplete: (entrega: Entrega, punto: PuntoLimpio) => void;
  isOffline: boolean;
  onQueueOfflineDelivery: (deliveryPayload: any) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  scannedMaterial,
  onDeliveryComplete,
  isOffline,
  onQueueOfflineDelivery,
}) => {
  const [puntos, setPuntos] = useState<PuntoLimpio[]>([]);
  const [selectedPunto, setSelectedPunto] = useState<PuntoLimpio | null>(null);
  const [materialFilter, setMaterialFilter] = useState<string>(scannedMaterial?.categoria || 'todos');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 40.41539,
    lng: -3.70735,
  });
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrInputValue, setQrInputValue] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);

  useEffect(() => {
    fetchPuntos(userLocation.lat, userLocation.lng);
  }, [userLocation]);

  const fetchPuntos = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/puntos?userLat=${lat}&userLng=${lng}`);
      const data = await res.json();
      if (data.puntos) {
        setPuntos(data.puntos);
        if (!selectedPunto && data.puntos.length > 0) {
          const match = data.puntos.find((p: PuntoLimpio) =>
            scannedMaterial ? p.materiales_aceptados.includes(scannedMaterial.categoria) : true
          );
          setSelectedPunto(match || data.puntos[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching puntos:', err);
    }
  };

  const handleUseRealGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          alert('No se pudo acceder al GPS del dispositivo. Usando simulador.');
          console.warn(err);
        }
      );
    }
  };

  const handleTeleportNear = (targetPunto: PuntoLimpio) => {
    setUserLocation({
      lat: targetPunto.latitud + 0.00008,
      lng: targetPunto.longitud + 0.00007,
    });
  };

  const handleSimulateFar = (targetPunto: PuntoLimpio) => {
    setUserLocation({
      lat: targetPunto.latitud + 0.0016,
      lng: targetPunto.longitud + 0.0015,
    });
  };

  const filteredPuntos = puntos.filter((p) => {
    if (materialFilter === 'todos') return true;
    return p.materiales_aceptados.includes(materialFilter);
  });

  const currentDistance = selectedPunto?.distancia_metros ?? 999;
  const isWithinGeofence = currentDistance <= 20;

  const handleExecuteDeposit = async () => {
    if (!selectedPunto) return;

    if (qrInputValue !== selectedPunto.codigo_qr_hash) {
      setDepositError(`Código QR inválido. En el contenedor físico dice: "${selectedPunto.codigo_qr_hash}".`);
      return;
    }

    const payload = {
      usuario_id: 1,
      punto_id: selectedPunto.id,
      material_nombre: scannedMaterial?.nombre_detectado || 'Botella de Plástico PET',
      categoria: scannedMaterial?.categoria || 'Plástico PET',
      peso_kg: scannedMaterial?.peso_estimado_kg || 0.15,
      puntos_otorgados: scannedMaterial?.puntos_estimados || 30,
      co2_ahorrado_kg: scannedMaterial?.co2_evitado_kg || 0.27,
      userLat: userLocation.lat,
      userLng: userLocation.lng,
      qr_hash: qrInputValue,
    };

    if (isOffline) {
      onQueueOfflineDelivery(payload);
      setQrModalOpen(false);
      setDepositError(null);
      alert('Entrega encolada en modo offline local. Se sincronizará al reconectar.');
      return;
    }

    setIsDepositing(true);
    setDepositError(null);

    try {
      const res = await fetch('/api/entregas/validate-and-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.mensaje || data.error || 'Fallo en la validación de entrega.');
      }

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d7eb80', '#333333', '#2d8c3a', '#ffffff'],
        });
      } catch (e) {
        // Safe fallback
      }

      setQrModalOpen(false);
      onDeliveryComplete(data.entrega, selectedPunto);
      fetchPuntos(userLocation.lat, userLocation.lng);
    } catch (err: any) {
      setDepositError(err.message || 'Error al validar la entrega');
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header and GPS Toolbar */}
      <LazySection>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-[#f0f0eb]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#6c6c6c] block mb-1">
              GEOLOCALIZACIÓN HIPERLOCAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#333333]">Red de Puntos Limpios & Geofence</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#f0f0eb] rounded-full self-start lg:self-auto">
            <button
              onClick={() => selectedPunto && handleTeleportNear(selectedPunto)}
              className="btn-pill-lime text-xs py-2 px-4 shadow-none"
              title="Colocar GPS a 10 metros del contenedor seleccionado"
            >
              Simular GPS a 10m (≤ 20m)
            </button>

            <button
              onClick={() => selectedPunto && handleSimulateFar(selectedPunto)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#ffffff] hover:bg-[#f8f8f6] text-[#333333] border border-[#bebeb9] transition-all"
              title="Colocar GPS a 180 metros para probar bloqueo"
            >
              Simular GPS a 180m (Fuera)
            </button>

            <button
              onClick={handleUseRealGps}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#ffffff] hover:bg-[#f8f8f6] text-[#6c6c6c] hover:text-[#333333] border border-[#bebeb9] transition-all flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5 text-[#333333]" />
              <span>GPS Real</span>
            </button>
          </div>
        </div>
      </LazySection>

      {/* Filter Tabs */}
      <LazySection delayMs={50}>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-[#6c6c6c] flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#333333]" /> Filtrar:
          </span>
          {['todos', 'Plástico PET', 'Cartón y Papel', 'Vidrio', 'Aluminio / Latas', 'Tetra Pak'].map((cat) => (
            <button
              key={cat}
              onClick={() => setMaterialFilter(cat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                materialFilter === cat
                  ? 'bg-[#333333] text-[#ffffff]'
                  : 'bg-[#f0f0eb] text-[#6c6c6c] hover:text-[#333333]'
              }`}
            >
              {cat === 'todos' ? 'Todos los Puntos' : cat}
            </button>
          ))}
        </div>
      </LazySection>

      {/* Active Material Scanned Notice */}
      {scannedMaterial && (
        <LazySection delayMs={100}>
          <div className="p-4 rounded-[20px] bg-[#d7eb80]/40 border border-[#d7eb80] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#333333] shrink-0" />
              <span>
                Residuo activo para entrega: <strong className="text-[#333333]">{scannedMaterial.nombre_detectado}</strong> ({scannedMaterial.categoria})
              </span>
            </div>
            <span className="font-bold text-[#333333] tabular-nums">+{scannedMaterial.puntos_estimados} Ecocoins al depositar</span>
          </div>
        </LazySection>
      )}

      {/* Map Layout: Left Interactive Map Canvas, Right Points List */}
      <LazySection delayMs={150}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Map Visual (7 cols) */}
          <div className="lg:col-span-7 card-ecosia p-4 sm:p-6 rounded-[20px] flex flex-col">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#ffffff] rounded-[20px] overflow-hidden select-none border border-[#f0f0eb]">
              {/* Clean Map Grid & Vector Corridors */}
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="clean-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0eb" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="#ffffff" />
                <rect width="100%" height="100%" fill="url(#clean-grid)" />

                {/* Parks / Green areas in subtle verdant tone */}
                <rect x="20%" y="15%" width="28%" height="32%" rx="16" fill="#d7eb80" opacity="0.35" stroke="#d7eb80" strokeWidth="1" />
                <rect x="65%" y="55%" width="25%" height="35%" rx="16" fill="#f0f0eb" opacity="0.9" stroke="#bebeb9" strokeWidth="1" />

                {/* Main Avenues */}
                <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#f0f0eb" strokeWidth="16" strokeLinecap="round" />
                <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
                <line x1="45%" y1="0" x2="45%" y2="100%" stroke="#f0f0eb" strokeWidth="14" strokeLinecap="round" />
                <line x1="45%" y1="0" x2="45%" y2="100%" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />

                <line x1="15%" y1="90%" x2="85%" y2="10%" stroke="#f0f0eb" strokeWidth="10" strokeLinecap="round" />
              </svg>

              {/* User GPS Pin with Avatar Pointer Motif */}
              <div
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out flex flex-col items-center pointer-events-none"
                style={{
                  top: selectedPunto
                    ? isWithinGeofence
                      ? '46%'
                      : '22%'
                    : '46%',
                  left: selectedPunto
                    ? isWithinGeofence
                      ? '46%'
                      : '18%'
                    : '46%',
                }}
              >
                <div className="w-16 h-16 rounded-full bg-[#d7eb80]/40 border border-[#d7eb80] animate-ping absolute -inset-2" />
                <div className="w-8 h-8 rounded-full bg-[#333333] text-[#ffffff] flex items-center justify-center border-2 border-white relative z-10 shadow-md">
                  <Navigation className="w-3.5 h-3.5 fill-white rotate-45" />
                </div>
                <span className="text-[10px] font-semibold bg-[#333333] text-white px-2 py-0.5 rounded-full mt-1 whitespace-nowrap shadow-sm">
                  Tú estás aquí
                </span>
              </div>

              {/* Collection Points Pins */}
              {filteredPuntos.map((punto, index) => {
                const isSelected = selectedPunto?.id === punto.id;
                const coords = [
                  { top: '48%', left: '48%' },
                  { top: '30%', left: '68%' },
                  { top: '72%', left: '32%' },
                  { top: '65%', left: '78%' },
                ][index % 4];

                return (
                  <button
                    key={punto.id}
                    onClick={() => setSelectedPunto(punto)}
                    className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 group transition-transform ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                    style={{ top: coords.top, left: coords.left }}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors border ${
                        isSelected
                          ? 'bg-[#d7eb80] border-[#333333] text-[#333333] ring-2 ring-[#333333]/20'
                          : 'bg-[#ffffff] border-[#bebeb9] text-[#333333] hover:border-[#333333]'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 whitespace-nowrap transition-colors shadow-sm ${
                        isSelected ? 'bg-[#333333] text-white' : 'bg-white text-[#333333] border border-[#f0f0eb]'
                      }`}
                    >
                      {punto.nombre.split('-')[0]}
                    </div>
                  </button>
                );
              })}

              {/* Floating Geofence Banner on Map */}
              <div className="absolute bottom-3 inset-x-3 z-20">
                <div
                  className={`p-4 rounded-[16px] border backdrop-blur-md flex items-center justify-between gap-3 text-xs shadow-sm ${
                    isWithinGeofence
                      ? 'bg-[#ffffff]/98 border-[#d7eb80] text-[#333333]'
                      : 'bg-[#ffffff]/98 border-[#f0f0eb] text-[#333333]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isWithinGeofence ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2d8c3a] shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#6c6c6c] shrink-0" />
                    )}
                    <div>
                      <span className="font-bold block">
                        {isWithinGeofence
                          ? 'Dentro del Radio de Depósito (Geofence Activo)'
                          : 'Fuera del Radio de Depósito'}
                      </span>
                      <span className="text-[11px] text-[#6c6c6c]">
                        Distancia al contenedor: <strong className="text-[#333333] tabular-nums">{currentDistance} metros</strong> (≤ 20m)
                      </span>
                    </div>
                  </div>

                  {isWithinGeofence ? (
                    <button
                      onClick={() => {
                        if (selectedPunto) {
                          setQrInputValue(selectedPunto.codigo_qr_hash);
                          setQrModalOpen(true);
                        }
                      }}
                      className="btn-pill-lime text-xs py-2 px-4 whitespace-nowrap"
                    >
                      Depositar Ahora
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded-full bg-[#f0f0eb] text-[#6c6c6c] font-semibold text-xs cursor-not-allowed whitespace-nowrap"
                    >
                      Bloqueado (&gt; 20m)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Punto Card & List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {selectedPunto && (
              <div className="card-ecosia p-6 sm:p-8 rounded-[20px] space-y-5">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#6c6c6c] mb-1">
                    <span className="font-semibold">{selectedPunto.tipo}</span>
                    <span aria-hidden="true">·</span>
                    <span className={`font-bold ${isWithinGeofence ? 'text-[#2d8c3a]' : 'text-[#6c6c6c]'}`}>
                      {currentDistance}m de distancia
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#333333]">{selectedPunto.nombre}</h3>
                  <p className="text-xs text-[#6c6c6c] mt-0.5">{selectedPunto.direccion}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-[#ffffff] border border-[#f0f0eb] rounded-[16px]">
                    <div className="flex items-center gap-1.5 text-[#6c6c6c] mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold uppercase">Horario</span>
                    </div>
                    <span className="font-semibold text-[#333333]">{selectedPunto.horario}</span>
                  </div>

                  <div className="p-3.5 bg-[#ffffff] border border-[#f0f0eb] rounded-[16px]">
                    <div className="flex items-center gap-1.5 text-[#6c6c6c] mb-1">
                      <Battery className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold uppercase">Capacidad</span>
                    </div>
                    <span className="font-semibold text-[#333333] tabular-nums">
                      {Math.round((selectedPunto.capacidad_actual_kg / selectedPunto.capacidad_max_kg) * 100)}% ({selectedPunto.capacidad_actual_kg} kg)
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6c6c6c] block mb-2">Materiales Aceptados:</span>
                  <div className="flex flex-wrap gap-1.5 text-xs text-[#333333]">
                    {selectedPunto.materiales_aceptados.map((mat, i) => (
                      <span key={mat} className="font-semibold">
                        {mat}
                        {i < selectedPunto.materiales_aceptados.length - 1 && <span className="text-[#bebeb9] mx-1">·</span>}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  {isWithinGeofence ? (
                    <button
                      onClick={() => {
                        setQrInputValue(selectedPunto.codigo_qr_hash);
                        setQrModalOpen(true);
                      }}
                      className="w-full btn-pill-lime text-xs py-3.5 flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-4 h-4 text-[#333333]" />
                      <span>Confirmar Depósito (Dentro de Geofence: {currentDistance}m)</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-full bg-[#f0f0eb] text-[#6c6c6c] font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-2 border border-[#bebeb9]/30"
                      >
                        <span>Depositar Deshabilitado (Estás a {currentDistance}m)</span>
                      </button>
                      <p className="text-[11px] text-[#6c6c6c] text-center">
                        Te encuentras a {currentDistance}m. Presiona "Simular GPS a 10m" para habilitar.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* List of other clean points */}
            <div className="card-ecosia p-5 rounded-[20px] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6c6c6c] block mb-2">
                PUNTOS DISPONIBLES ({filteredPuntos.length})
              </span>
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {filteredPuntos.map((punto) => (
                  <div
                    key={punto.id}
                    onClick={() => setSelectedPunto(punto)}
                    className={`p-3.5 rounded-[16px] text-left cursor-pointer transition-all ${
                      selectedPunto?.id === punto.id
                        ? 'bg-[#ffffff] border border-[#d7eb80]'
                        : 'bg-[#ffffff]/60 hover:bg-[#ffffff] border border-[#f0f0eb]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-semibold text-[#333333] truncate">{punto.nombre}</h5>
                      <span className="text-[11px] font-bold text-[#2d8c3a] shrink-0 tabular-nums">
                        {punto.distancia_metros}m
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6c6c6c] mt-0.5 truncate">{punto.direccion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* CONFIRMATION & QR SCANNER MODAL */}
      {qrModalOpen && selectedPunto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#ffffff] p-8 rounded-[20px] space-y-6 border border-[#f0f0eb]">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-[#f8f8f6] text-[#333333] flex items-center justify-center mx-auto mb-2 border border-[#bebeb9]/30">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#333333]">Validar Código QR del Contenedor</h3>
              <p className="text-xs text-[#6c6c6c]">
                Escaneo del código adherido al contenedor físico en <strong>{selectedPunto.nombre}</strong>
              </p>
            </div>

            <div className="p-6 bg-[#f8f8f6] rounded-[20px] border border-[#f0f0eb] text-center space-y-2">
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-[16px] border border-[#f0f0eb] flex items-center justify-center shadow-sm">
                <svg className="w-full h-full text-[#333333]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-5 0h2v3h-2v-3zm3 3h2v3h-2v-3zm-3 2h2v1h-2v-1zm5 1h1v2h-1v-2zm-2 2h2v1h-2v-1zm-3-2h1v3h-1v-3z" />
                </svg>
              </div>
              <div className="text-xs pt-1">
                <span className="text-[#6c6c6c] block">Identificador QR verificado:</span>
                <span className="font-mono font-semibold text-[#333333]">{selectedPunto.codigo_qr_hash}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-full bg-[#d7eb80] text-xs text-[#333333]">
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#333333]" />
                <span>GPS Validado: ≤ 20m</span>
              </span>
              <span className="font-bold tabular-nums">{currentDistance} metros</span>
            </div>

            {depositError && (
              <div className="p-3 bg-[#f8f8f6] rounded-[16px] border border-red-200 text-xs text-red-600">
                {depositError}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setQrModalOpen(false);
                  setDepositError(null);
                }}
                className="flex-1 btn-pill-ghost text-xs py-3"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteDeposit}
                disabled={isDepositing}
                className="flex-1 btn-pill-lime text-xs py-3 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDepositing ? (
                  <span>Validando Entrega...</span>
                ) : (
                  <>
                    <span>Confirmar Depósito</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#333333]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
