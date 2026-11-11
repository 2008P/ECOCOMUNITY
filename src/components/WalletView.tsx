import React, { useState } from 'react';
import { UserWalletData, Recompensa } from '../types';
import { LazySection } from './LazySection';
import {
  Coins,
  Award,
  ArrowUpRight,
  ArrowDownLeft,
  Coffee,
  Bike,
  ShoppingBag,
  TreePine,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

interface WalletViewProps {
  walletData: UserWalletData | null;
  onRefreshWallet: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({ walletData, onRefreshWallet }) => {
  const [redeeming, setRedeeming] = useState(false);
  const [redeemedVoucher, setRedeemedVoucher] = useState<{
    codigo: string;
    titulo: string;
    sponsor: string;
    instrucciones: string;
    valido_hasta: string;
  } | null>(null);

  const saldo = walletData?.saldo_ecocoins ?? 0;
  const nivel = walletData?.nivel_rango ?? 'Novicio Verde';
  const catalogo = walletData?.catalogo_recompensas ?? [];
  const transacciones = walletData?.transacciones ?? [];

  const getRewardIcon = (logo: string) => {
    switch (logo) {
      case 'coffee':
        return Coffee;
      case 'bike':
        return Bike;
      case 'shopping-bag':
        return ShoppingBag;
      case 'tree':
        return TreePine;
      default:
        return Award;
    }
  };

  const handleRedeem = async (reward: Recompensa) => {
    if (saldo < reward.costo_ecocoins) {
      alert(`Saldo insuficiente. Requieres ${reward.costo_ecocoins} EC y dispones de ${saldo} EC.`);
      return;
    }

    setRedeeming(true);

    try {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: reward.id, usuario_id: 1 }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al canjear recompensa.');
      }

      setRedeemedVoucher(data.voucher);
      onRefreshWallet();
    } catch (err: any) {
      alert(err.message || 'Error en la transacción');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Wallet Balance Hero Banner in Ecosia Warm Mist (#f8f8f6, 20px radius) */}
      <LazySection>
        <div className="card-ecosia p-8 sm:p-14 rounded-[20px] flex flex-col md:flex-row md:items-center justify-between gap-8 border border-[#f0f0eb]">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#6c6c6c] block">
              BILLETERA DE RECOMPENSAS
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-bold tracking-tight tabular-nums text-[#333333]">
                {saldo}
              </span>
              <span className="text-xl font-semibold text-[#6c6c6c]">EC</span>
            </div>
            <p className="text-xs sm:text-sm text-[#6c6c6c]">
              Rango actual: <strong className="text-[#333333] font-semibold">{nivel}</strong> · Canjeables en comercios de impacto y economía circular
            </p>
          </div>

          {/* Tier Progress in White Card */}
          <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] max-w-xs w-full space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6c6c6c]">Progreso a Guardián</span>
              <span className="font-bold text-[#333333]">{saldo >= 300 ? '100%' : `${Math.round((saldo / 300) * 100)}%`}</span>
            </div>
            <div className="w-full h-2 bg-[#f0f0eb] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#d7eb80] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((saldo / 300) * 100))}%` }}
              />
            </div>
            <span className="text-[11px] text-[#6c6c6c] block">
              {saldo < 300 ? `Faltan ${300 - saldo} EC para la insignia Guardián` : '¡Nivel máximo alcanzado!'}
            </span>
          </div>
        </div>
      </LazySection>

      {/* Rewards Catalog */}
      <LazySection delayMs={100}>
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#6c6c6c] block mb-1">
              CANJE DE INCENTIVOS
            </span>
            <h3 className="text-3xl font-bold text-[#333333]">Catálogo de Marcas Aliadas</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {catalogo.map((reward) => {
              const Icon = getRewardIcon(reward.logo_svg);
              const canAfford = saldo >= reward.costo_ecocoins;

              return (
                <div
                  key={reward.id}
                  className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-6 flex flex-col justify-between hover:border-[#d7eb80] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#f8f8f6] text-[#333333] flex items-center justify-center border border-[#bebeb9]/30">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-bold text-[#333333] tabular-nums">
                        {reward.costo_ecocoins} EC
                      </span>
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6c6c6c] block mb-1">
                      {reward.sponsor}
                    </span>
                    <h4 className="text-base font-bold text-[#333333] leading-snug mb-2">{reward.titulo}</h4>
                    <p className="text-xs text-[#6c6c6c] leading-relaxed line-clamp-3">
                      {reward.descripcion}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#f0f0eb] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#6c6c6c]">Stock: {reward.stock}</span>
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford || redeeming}
                      className={`text-xs py-2 px-4 rounded-full font-semibold transition-all ${
                        canAfford
                          ? 'btn-pill-lime'
                          : 'bg-[#f0f0eb] text-[#bebeb9] cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Canjear' : 'Faltan EC'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </LazySection>

      {/* Transaction History Ledger */}
      <LazySection delayMs={150}>
        <div className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-8 sm:p-10 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#6c6c6c] block mb-1">
              LIBRO MAYOR INMUTABLE
            </span>
            <h3 className="text-2xl font-bold text-[#333333]">Historial de Movimientos</h3>
          </div>

          <div className="divide-y divide-[#f0f0eb]">
            {transacciones.map((tx) => {
              const isCredit = tx.tipo === 'credito';

              return (
                <div key={tx.id} className="py-4 flex items-center justify-between gap-4 hover:bg-[#f8f8f6] px-3 rounded-[16px] transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isCredit ? 'bg-[#d7eb80] text-[#333333]' : 'bg-[#f0f0eb] text-[#333333]'
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-semibold text-[#333333] block truncate">
                        {tx.descripcion}
                      </span>
                      <span className="text-[11px] text-[#6c6c6c]">
                        {new Date(tx.fecha).toLocaleString()} {tx.codigo_voucher && `· Código: ${tx.codigo_voucher}`}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        isCredit ? 'text-[#2d8c3a]' : 'text-[#6c6c6c]'
                      }`}
                    >
                      {isCredit ? `+${tx.monto_puntos}` : `-${tx.monto_puntos}`} EC
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </LazySection>

      {/* REDEEMED VOUCHER MODAL */}
      {redeemedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#ffffff] p-8 rounded-[20px] text-center space-y-6 border border-[#f0f0eb]">
            <button
              onClick={() => setRedeemedVoucher(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#6c6c6c] hover:text-[#333333]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#d7eb80] text-[#333333] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 stroke-[2]" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6c6c6c] block">{redeemedVoucher.sponsor}</span>
              <h3 className="text-xl font-bold text-[#333333] mt-1">{redeemedVoucher.titulo}</h3>
            </div>

            <div className="p-6 bg-[#f8f8f6] rounded-[20px] border border-[#f0f0eb] space-y-3">
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-[16px] border border-[#f0f0eb] flex items-center justify-center shadow-sm">
                <svg className="w-full h-full text-[#333333]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-5 0h2v3h-2v-3zm3 3h2v3h-2v-3zm-3 2h2v1h-2v-1zm5 1h1v2h-1v-2zm-2 2h2v1h-2v-1zm-3-2h1v3h-1v-3z" />
                </svg>
              </div>
              <span className="font-mono text-sm font-bold text-[#333333] tracking-wider block">
                {redeemedVoucher.codigo}
              </span>
              <span className="text-[11px] text-[#6c6c6c] block">Válido hasta: {redeemedVoucher.valido_hasta}</span>
            </div>

            <p className="text-xs text-[#6c6c6c] leading-relaxed">
              {redeemedVoucher.instrucciones}
            </p>

            <button
              onClick={() => setRedeemedVoucher(null)}
              className="w-full btn-pill-lime text-xs py-3"
            >
              Listo, Guardar Cupón
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
