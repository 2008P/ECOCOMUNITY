import React, { useState } from 'react';
import { UserProfile, Recompensa } from '../../types';
import { LazySection } from '../LazySection';
import {
  Award,
  Sparkles,
  Plus,
  Coins,
  TrendingUp,
  Download,
  Building,
  CheckCircle2,
  PackageCheck,
  Leaf,
  BarChart2,
} from 'lucide-react';

interface BrandPrivateWebProps {
  currentUser: UserProfile;
}

export const BrandPrivateWeb: React.FC<BrandPrivateWebProps> = ({ currentUser }) => {
  const [coupons, setCoupons] = useState<Recompensa[]>([
    {
      id: 'brand-rew-1',
      sponsor: currentUser.nombre || 'GreenRoast Coffee',
      titulo: 'Café Orgánico o Bebida Mediana',
      costo_ecocoins: 50,
      categoria: 'Gastronomía Sostenible',
      descripcion: 'Válido por 1 café de especialidad servido en vaso reutilizable del cliente.',
      stock: 45,
      marca_aliada_id: 'brand_greenroast',
      logo_svg: 'coffee',
    },
    {
      id: 'brand-rew-2',
      sponsor: currentUser.nombre || 'GreenRoast Coffee',
      titulo: 'Bolsa de Café en Grano 250g (Empaque Compostable)',
      costo_ecocoins: 140,
      categoria: 'Productos Circulares',
      descripcion: 'Café de origen certificado con empaque 100% biodegradable.',
      stock: 20,
      marca_aliada_id: 'brand_greenroast',
      logo_svg: 'coffee',
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState(60);
  const [newStock, setNewStock] = useState(50);
  const [newDesc, setNewDesc] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReward: Recompensa = {
      id: `brand-rew-${Date.now()}`,
      sponsor: currentUser.nombre,
      titulo: newTitle,
      costo_ecocoins: newCost,
      categoria: 'Incentivo Comercial ESG',
      descripcion: newDesc || 'Canjeable en tiendas de la marca aliada.',
      stock: newStock,
      marca_aliada_id: 'brand_custom',
      logo_svg: 'shopping-bag',
    };

    setCoupons([newReward, ...coupons]);
    setModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <LazySection>
        <div className="card-ecosia p-6 sm:p-10 rounded-[20px] border border-[#f0f0eb] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#d7eb80] text-[#333333] flex items-center justify-center font-bold text-xl shrink-0 border-2 border-[#333333]">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full bg-[#333333] text-[#d7eb80] text-[10px] font-bold uppercase tracking-wider">
                  Web Privada de Marca Aliada & Sponsor ESG
                </span>
                <span className="text-xs text-[#6c6c6c]">Certificación REP ISO 14001</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#333333]">
                {currentUser.nombre}
              </h2>
              <p className="text-xs sm:text-sm text-[#6c6c6c] mt-0.5">
                Panel corporativo de Responsabilidad Extendida del Productor, neutralidad de plástico y campañas de cupones.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Recuperados</span>
              <span className="font-bold text-lg text-[#333333] tabular-nums">1,240 u</span>
            </div>
            <div className="w-px h-8 bg-[#f0f0eb]" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Neutralidad</span>
              <span className="font-bold text-lg text-[#2d8c3a] tabular-nums">88%</span>
            </div>
            <div className="w-px h-8 bg-[#f0f0eb]" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#6c6c6c] block">Campañas</span>
              <span className="font-bold text-lg text-[#333333]">{coupons.length} Activas</span>
            </div>
          </div>
        </div>
      </LazySection>

      {/* KPI Section */}
      <LazySection delayMs={100}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] space-y-3">
            <div className="flex justify-between items-center text-xs text-[#6c6c6c]">
              <span className="font-bold uppercase tracking-wider">Meta Anual de Neutralidad</span>
              <TrendingUp className="w-4 h-4 text-[#2d8c3a]" />
            </div>
            <div className="text-3xl font-bold text-[#333333] tabular-nums">
              88% <span className="text-sm font-semibold text-[#6c6c6c]">alcanzado</span>
            </div>
            <div className="w-full h-2 bg-[#f0f0eb] rounded-full overflow-hidden">
              <div className="h-full bg-[#d7eb80] rounded-full" style={{ width: '88%' }} />
            </div>
            <span className="text-xs text-[#6c6c6c] block">
              1,240 kg compensados de una meta anual de 1,400 kg.
            </span>
          </div>

          <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] space-y-3">
            <div className="flex justify-between items-center text-xs text-[#6c6c6c]">
              <span className="font-bold uppercase tracking-wider">Inversión en Cupones</span>
              <Coins className="w-4 h-4 text-[#333333]" />
            </div>
            <div className="text-3xl font-bold text-[#333333] tabular-nums">
              3,250 <span className="text-sm font-semibold text-[#6c6c6c]">EC emitidos</span>
            </div>
            <p className="text-xs text-[#6c6c6c]">
              65 usuarios han canjeado beneficios en tiendas físicas este mes.
            </p>
          </div>

          <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] space-y-3">
            <div className="flex justify-between items-center text-xs text-[#6c6c6c]">
              <span className="font-bold uppercase tracking-wider">Certificación Auditoría</span>
              <Leaf className="w-4 h-4 text-[#2d8c3a]" />
            </div>
            <div className="text-xl font-bold text-[#333333]">
              Sello Verde ISO 14001
            </div>
            <p className="text-xs text-[#6c6c6c]">
              Trazabilidad validada por la agencia municipal de medio ambiente.
            </p>
          </div>
        </div>
      </LazySection>

      {/* Coupon Campaign Manager */}
      <LazySection delayMs={150}>
        <div className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0f0eb]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6c6c6c] block">
                GESTIÓN DE INCENTIVOS COMERCIALES
              </span>
              <h3 className="text-2xl font-bold text-[#333333]">Tus Cupones en el Catálogo Ciudadano</h3>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="btn-pill-lime text-xs py-2.5 px-5 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Nuevo Cupón</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map((c) => (
              <div key={c.id} className="p-5 rounded-[20px] bg-[#f8f8f6] border border-[#f0f0eb] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6c6c6c]">{c.categoria}</span>
                  <span className="text-xs font-bold text-[#333333] bg-[#d7eb80] px-3 py-1 rounded-full tabular-nums">
                    {c.costo_ecocoins} Ecocoins
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#333333]">{c.titulo}</h4>
                <p className="text-xs text-[#6c6c6c] leading-relaxed">{c.descripcion}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[#f0f0eb] text-xs">
                  <span className="text-[#6c6c6c]">Stock restante: <strong>{c.stock} cupones</strong></span>
                  <span className="text-[#2d8c3a] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Activo en App Ciudadana
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LazySection>

      {/* MODAL CREAR CUPÓN */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#ffffff] rounded-[20px] max-w-md w-full p-8 border border-[#f0f0eb] space-y-5">
            <h3 className="text-xl font-bold text-[#333333]">Publicar Nuevo Cupón Promocional</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#333333] block mb-1">Título del Beneficio</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 20% Desc. en Producto Circular"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-full bg-[#f8f8f6] border border-[#f0f0eb] text-[#333333] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#333333] block mb-1">Costo en Ecocoins</label>
                  <input
                    type="number"
                    required
                    value={newCost}
                    onChange={(e) => setNewCost(parseInt(e.target.value) || 10)}
                    className="w-full text-xs p-3 rounded-full bg-[#f8f8f6] border border-[#f0f0eb] text-[#333333] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#333333] block mb-1">Cantidad (Stock)</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(parseInt(e.target.value) || 10)}
                    className="w-full text-xs p-3 rounded-full bg-[#f8f8f6] border border-[#f0f0eb] text-[#333333] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#333333] block mb-1">Instrucciones de Canje</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Presentar el código QR en caja antes de pagar."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs p-3 rounded-[16px] bg-[#f8f8f6] border border-[#f0f0eb] text-[#333333] outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 btn-pill-ghost text-xs py-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-pill-lime text-xs py-3 font-semibold"
                >
                  Publicar Cupón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
