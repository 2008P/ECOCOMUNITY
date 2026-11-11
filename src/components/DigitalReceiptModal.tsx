import React from 'react';
import { Entrega, PuntoLimpio } from '../types';
import { CheckCircle2, ShieldCheck, MapPin, Calendar, Scale, Coins, Leaf, Download, X } from 'lucide-react';

interface DigitalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  entrega: Entrega | null;
  punto: PuntoLimpio | null;
  onGoToWallet: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  isOpen,
  onClose,
  entrega,
  punto,
  onGoToWallet,
}) => {
  if (!isOpen || !entrega) return null;

  const handleDownload = () => {
    const dataStr = `data:text/json;charset=utf-8,` + encodeURIComponent(JSON.stringify(entrega, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `recibo_ecocommunity_${entrega.uuid}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#ffffff] rounded-[20px] overflow-hidden text-[#333333] border border-[#f0f0eb]">
        {/* Header — Signature Lime Canopy Accent */}
        <div className="bg-[#d7eb80] px-8 py-6 text-center relative border-b border-[#333333]/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[#333333] hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-full bg-[#ffffff] mx-auto flex items-center justify-center mb-2 shadow-sm text-[#333333]">
            <CheckCircle2 className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-xl font-bold text-[#333333]">Depósito Verificado con Éxito</h3>
          <p className="text-xs text-[#333333]/80 mt-0.5 font-medium">Recibo Digital y Acreditación de Ecocoins</p>
        </div>

        {/* Content Details */}
        <div className="p-8 space-y-5">
          {/* Points & CO2 Banner */}
          <div className="grid grid-cols-2 gap-3.5 p-4 rounded-[20px] bg-[#f8f8f6] border border-[#f0f0eb]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ffffff] text-[#333333] flex items-center justify-center shrink-0 border border-[#bebeb9]/30">
                <Coins className="w-4 h-4 text-[#333333]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6c6c6c] block leading-tight font-semibold">Ganados</span>
                <span className="text-base font-bold text-[#333333] tabular-nums">+{entrega.puntos_otorgados} EC</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ffffff] text-[#2d8c3a] flex items-center justify-center shrink-0 border border-[#bebeb9]/30">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6c6c6c] block leading-tight font-semibold">CO2 Evitado</span>
                <span className="text-base font-bold text-[#333333] tabular-nums">{entrega.co2_ahorrado_kg} kg</span>
              </div>
            </div>
          </div>

          {/* Item & Station details */}
          <div className="space-y-2.5 text-xs text-[#6c6c6c] border-t border-b border-[#f0f0eb] py-4">
            <div className="flex items-center justify-between">
              <span>Material entregado:</span>
              <span className="font-semibold text-[#333333]">{entrega.material_nombre}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Categoría:</span>
              <span className="font-semibold text-[#333333]">{entrega.categoria}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" /> Peso registrado:
              </span>
              <span className="font-semibold text-[#333333] tabular-nums">{entrega.peso_kg} kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Contenedor:
              </span>
              <span className="font-semibold text-[#333333] truncate max-w-[200px] text-right">
                {punto ? punto.nombre : `Punto #${entrega.punto_id}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Distancia GPS validada:</span>
              <span className="font-semibold text-[#2d8c3a] tabular-nums">{entrega.distancia_metros} m (≤ 20m)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Fecha y Hora:
              </span>
              <span className="font-mono text-[#6c6c6c]">{new Date(entrega.fecha_entrega).toLocaleString()}</span>
            </div>
          </div>

          {/* Cryptographic Hash */}
          <div className="p-3.5 bg-[#f8f8f6] rounded-[16px] border border-[#f0f0eb]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#333333] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2d8c3a]" />
              <span>Sello Criptográfico Inmutable</span>
            </div>
            <p className="font-mono text-[10px] text-[#6c6c6c] break-all select-all">
              {entrega.recibo_digital_hash}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#f8f8f6] border-t border-[#f0f0eb] flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 btn-pill-ghost text-xs py-3"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>Descargar JSON</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onGoToWallet();
            }}
            className="flex-1 btn-pill-lime text-xs py-3"
          >
            Ver Mi Billetera
          </button>
        </div>
      </div>
    </div>
  );
};
