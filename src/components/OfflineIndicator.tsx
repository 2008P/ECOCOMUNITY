import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface OfflineIndicatorProps {
  isOffline: boolean;
  onToggleOffline: () => void;
  pendingSyncCount: number;
  onSyncPending: () => void;
  isSyncing: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOffline,
  onToggleOffline,
  pendingSyncCount,
  onSyncPending,
  isSyncing,
}) => {
  return (
    <div className="bg-[#f8f8f6] text-[#333333] text-xs px-4 py-2 border-b border-[#f0f0eb]">
      <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isOffline ? (
            <span className="flex items-center gap-1.5 text-[#333333] font-semibold bg-[#d7eb80] px-3 py-1 rounded-full">
              <WifiOff className="w-3.5 h-3.5 text-[#333333]" />
              <span className="text-[11px]">Modo Offline Activo (Entregas almacenadas localmente)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[#6c6c6c]">
              <Wifi className="w-3.5 h-3.5 text-[#333333]" />
              <span className="text-[11px]">Sincronización en tiempo real activa</span>
            </span>
          )}
          {pendingSyncCount > 0 && (
            <span className="text-[#6c6c6c]">
              · <span className="font-semibold text-[#333333]">{pendingSyncCount}</span> pendiente(s) por sincronizar
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {pendingSyncCount > 0 && !isOffline && (
            <button
              onClick={onSyncPending}
              disabled={isSyncing}
              className="flex items-center gap-1 px-3 py-1 rounded-full btn-pill-lime text-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sincronizar</span>
            </button>
          )}

          <button
            onClick={onToggleOffline}
            className="px-3.5 py-1 rounded-full bg-transparent hover:bg-[#ffffff] text-[#6c6c6c] hover:text-[#333333] text-[11px] font-medium border border-[#bebeb9] transition-colors"
          >
            {isOffline ? 'Reconectar en Línea' : 'Simular Corte de Red (Offline)'}
          </button>
        </div>
      </div>
    </div>
  );
};
