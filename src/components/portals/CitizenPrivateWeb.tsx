import React, { useState } from 'react';
import { UserProfile, UserWalletData, Entrega, PuntoLimpio, ClassificationResult } from '../../types';
import { ScannerView } from '../ScannerView';
import { MapView } from '../MapView';
import { WalletView } from '../WalletView';
import { LazySection } from '../LazySection';
import {
  Camera,
  MapPin,
  Wallet,
  Receipt,
  User,
  ShieldCheck,
  Sparkles,
  Coins,
  Leaf,
  Scale,
  Calendar,
  Download,
} from 'lucide-react';

interface CitizenPrivateWebProps {
  currentUser: UserProfile;
  walletData: UserWalletData | null;
  recentDeliveries: Entrega[];
  scannedMaterial: ClassificationResult | null;
  onClassificationSuccess: (result: ClassificationResult) => void;
  onDeliveryComplete: (entrega: Entrega, punto: PuntoLimpio) => void;
  isOffline: boolean;
  onQueueOfflineDelivery: (payload: any) => void;
  onRefreshWallet: () => void;
  onSelectReceipt: (entrega: Entrega) => void;
}

export const CitizenPrivateWeb: React.FC<CitizenPrivateWebProps> = ({
  currentUser,
  walletData,
  recentDeliveries,
  scannedMaterial,
  onClassificationSuccess,
  onDeliveryComplete,
  isOffline,
  onQueueOfflineDelivery,
  onRefreshWallet,
  onSelectReceipt,
}) => {
  const [activeTab, setActiveTab] = useState<'escanear' | 'mapa' | 'billetera' | 'recibos'>('escanear');

  const saldo = walletData?.saldo_ecocoins ?? 178;
  const kgTotal = walletData?.estadisticas_impacto.kg_reciclados ?? 1.43;
  const co2Total = walletData?.estadisticas_impacto.co2_ahorrado_kg ?? 2.08;

  return (
    <div className="space-y-10 pb-20">
      {/* Citizen Web Private Header Banner */}
      <LazySection>
        <div className="card-ecosia p-6 sm:p-10 rounded-[20px] border border-[#f0f0eb] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#d7eb80] text-[#333333] flex items-center justify-center font-bold text-xl shrink-0 border-2 border-[#333333]">
              {currentUser.nombre.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full bg-[#333333] text-[#d7eb80] text-[10px] font-bold uppercase tracking-wider">
                  Web Privada Ciudadana
                </span>
                <span className="text-xs text-[#6c6c6c]">ID: #USR-{currentUser.id}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#333333]">
                Hola, {currentUser.nombre}
              </h2>
              <p className="text-xs sm:text-sm text-[#6c6c6c] mt-0.5">
                Panel personal de reciclaje, geofencing en puntos limpios y billetera de Ecocoins.
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge in White Card */}
          <div className="flex items-center gap-4 p-4 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Saldo</span>
              <div className="flex items-center gap-1 font-bold text-lg text-[#333333] tabular-nums">
                <Coins className="w-4 h-4 text-[#333333]" />
                <span>{saldo} EC</span>
              </div>
            </div>
            <div className="w-px h-8 bg-[#f0f0eb]" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Desviados</span>
              <div className="flex items-center gap-1 font-bold text-lg text-[#333333] tabular-nums">
                <Scale className="w-4 h-4 text-[#6c6c6c]" />
                <span>{kgTotal} kg</span>
              </div>
            </div>
            <div className="w-px h-8 bg-[#f0f0eb]" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">CO2 Evitado</span>
              <div className="flex items-center gap-1 font-bold text-lg text-[#2d8c3a] tabular-nums">
                <Leaf className="w-4 h-4" />
                <span>{co2Total} kg</span>
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Designated Private Sub-Navigation in 9999px Pills */}
      <LazySection delayMs={50}>
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#f8f8f6] rounded-full border border-[#f0f0eb] max-w-2xl">
          <button
            onClick={() => setActiveTab('escanear')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'escanear'
                ? 'bg-[#333333] text-[#ffffff] shadow-sm'
                : 'text-[#6c6c6c] hover:text-[#333333]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Escáner IA & Barcode</span>
          </button>

          <button
            onClick={() => setActiveTab('mapa')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'mapa'
                ? 'bg-[#333333] text-[#ffffff] shadow-sm'
                : 'text-[#6c6c6c] hover:text-[#333333]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Puntos Limpios (≤ 20m)</span>
          </button>

          <button
            onClick={() => setActiveTab('billetera')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'billetera'
                ? 'bg-[#333333] text-[#ffffff] shadow-sm'
                : 'text-[#6c6c6c] hover:text-[#333333]'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Billetera & Cupones</span>
          </button>

          <button
            onClick={() => setActiveTab('recibos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'recibos'
                ? 'bg-[#333333] text-[#ffffff] shadow-sm'
                : 'text-[#6c6c6c] hover:text-[#333333]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Mis Recibos ({recentDeliveries.length})</span>
          </button>
        </div>
      </LazySection>

      {/* Tab 1: Scanner View */}
      {activeTab === 'escanear' && (
        <ScannerView
          onClassificationSuccess={(res) => {
            onClassificationSuccess(res);
            setActiveTab('mapa');
          }}
          onNavigateToMap={() => setActiveTab('mapa')}
        />
      )}

      {/* Tab 2: Map & Geofence View */}
      {activeTab === 'mapa' && (
        <MapView
          scannedMaterial={scannedMaterial}
          onDeliveryComplete={onDeliveryComplete}
          isOffline={isOffline}
          onQueueOfflineDelivery={onQueueOfflineDelivery}
        />
      )}

      {/* Tab 3: Wallet View */}
      {activeTab === 'billetera' && (
        <WalletView walletData={walletData} onRefreshWallet={onRefreshWallet} />
      )}

      {/* Tab 4: Cryptographic Receipts View */}
      {activeTab === 'recibos' && (
        <LazySection>
          <div className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0f0eb]">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#6c6c6c] block mb-1">
                  HISTORIAL CRIPTOGRÁFICO PERSONAL
                </span>
                <h3 className="text-2xl font-bold text-[#333333]">Recibos Digitales Auditados</h3>
              </div>
              <span className="text-xs text-[#2d8c3a] font-semibold flex items-center gap-1 bg-[#d7eb80]/30 px-3 py-1.5 rounded-full border border-[#d7eb80]">
                <ShieldCheck className="w-4 h-4" />
                <span>Cadena de Custodia Inmutable</span>
              </span>
            </div>

            <div className="divide-y divide-[#f0f0eb]">
              {recentDeliveries.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectReceipt(item)}
                  className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f8f8f6] px-4 rounded-[16px] cursor-pointer transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#6c6c6c]">
                      <span className="font-bold text-[#333333]">{item.categoria}</span>
                      <span>·</span>
                      <span>{new Date(item.fecha_entrega).toLocaleString()}</span>
                      <span>·</span>
                      <span className="capitalize font-semibold text-[#2d8c3a]">
                        {item.cadena_custodia_paso.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#333333]">{item.material_nombre}</h4>
                    <p className="font-mono text-xs text-[#6c6c6c]">
                      Hash: <span className="text-[#333333]">{item.recibo_digital_hash}</span> · GPS: {item.distancia_metros}m
                    </p>
                  </div>

                  <div className="flex items-center gap-6 self-end sm:self-auto shrink-0">
                    <div className="text-right">
                      <span className="text-base font-bold text-[#333333] block tabular-nums">+{item.puntos_otorgados} EC</span>
                      <span className="text-xs text-[#2d8c3a] font-semibold tabular-nums">{item.co2_ahorrado_kg} kg CO2</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectReceipt(item);
                      }}
                      className="btn-pill-ghost text-xs py-2 px-4"
                    >
                      Ver Recibo
                    </button>
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
