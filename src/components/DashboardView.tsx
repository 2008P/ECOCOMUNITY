import React, { useState } from 'react';
import { Entrega, UserWalletData } from '../types';
import { LazySection } from './LazySection';
import {
  Camera,
  MapPin,
  Search,
  Sparkles,
  Coins,
  Leaf,
  Scale,
  CheckCircle2,
  TreePine,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface DashboardViewProps {
  walletData: UserWalletData | null;
  recentDeliveries: Entrega[];
  onNavigate: (tab: string) => void;
  onSelectReceipt: (entrega: Entrega) => void;
  onScanClick: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  walletData,
  recentDeliveries,
  onNavigate,
  onSelectReceipt,
  onScanClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const saldo = walletData?.saldo_ecocoins ?? 178;
  const kgTotal = walletData?.estadisticas_impacto.kg_reciclados ?? 1.43;
  const co2Total = walletData?.estadisticas_impacto.co2_ahorrado_kg ?? 2.08;
  const arboles = walletData?.estadisticas_impacto.equivalencia_arboles ?? 0.1;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScanClick();
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION: Full-bleed leaf photography + Search clearing + Floating Dark Stats */}
      <LazySection>
        <div className="relative rounded-[20px] overflow-hidden min-h-[520px] sm:min-h-[580px] flex flex-col justify-between p-6 sm:p-12 text-center">
          {/* Nature Photo Backdrop */}
          <img
            src="/src/assets/images/eco_hub_hero_1794427467724.jpg"
            alt="Follaje verde natural de bosque"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Subtle gradient vignette to assure contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60 pointer-events-none" />

          {/* Centered Headline in Founders Grotesk / Inter Tight 48-54px weight 700 */}
          <div className="relative z-10 max-w-2xl mx-auto pt-8 sm:pt-14 space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#d7eb80]" />
              Economía Circular Comunitaria
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#ffffff] tracking-[-0.03em] leading-[1.10]">
              Recicla. Impacta. Transforma tu Entorno.
            </h1>

            <p className="text-base sm:text-lg text-[#ffffff]/90 max-w-lg mx-auto font-normal leading-relaxed">
              La plataforma ciudadana que recompensa cada empaque reciclado con visión artificial Gemini y puntos limpios con geofence.
            </p>

            {/* Massive White Pill Search & Scan Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="pt-3 max-w-xl mx-auto"
            >
              <div className="bg-[#ffffff] rounded-full h-14 sm:h-16 px-5 flex items-center gap-3 shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-[#d7eb80]">
                <Search className="w-5 h-5 text-[#333333] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busca un residuo, botella PET o punto limpio..."
                  className="w-full bg-transparent text-sm sm:text-base text-[#333333] placeholder-[#6c6c6c] outline-none"
                />
                <button
                  type="button"
                  onClick={onScanClick}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#333333] text-xs font-medium text-[#333333] hover:bg-[#f8f8f6] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#333333]" />
                  <span>+ IA Visión</span>
                </button>
              </div>
            </form>
          </div>

          {/* Floating Dark Translucent Stats Card over the Hero Photo (The single shadow token) */}
          <div className="relative z-10 max-w-3xl mx-auto w-full pt-8">
            <div className="hero-floating-stat p-5 sm:p-6 text-white grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
              <div className="flex items-center gap-3.5 justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <TreePine className="w-5 h-5 text-[#d7eb80]" />
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-bold tabular-nums text-white leading-tight">
                    {kgTotal} kg
                  </div>
                  <span className="text-[12px] text-[#d7eb80] font-medium block">
                    Material desviado de vertedero
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 justify-center sm:justify-start pt-3 sm:pt-0 sm:pl-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5 text-[#d7eb80]" />
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-bold tabular-nums text-white leading-tight">
                    {saldo} EC
                  </div>
                  <span className="text-[12px] text-[#d7eb80] font-medium block">
                    Ecocoins en tu billetera
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 justify-center sm:justify-start pt-3 sm:pt-0 sm:pl-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-[#d7eb80]" />
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-bold tabular-nums text-white leading-tight">
                    {co2Total} kg
                  </div>
                  <span className="text-[12px] text-[#d7eb80] font-medium block">
                    Huella de CO2 compensada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* 2. VALUE PROPOSITION: 4-Column Nature Image Cards Grid */}
      <LazySection delayMs={100}>
        <div className="space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#6c6c6c]">
              ¿CÓMO FUNCIONA ECOCOMMUNITY?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#333333] leading-tight">
              El ciclo de reciclaje ciudadano en cuatro pasos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="card-ecosia p-4 space-y-4 flex flex-col justify-between group">
              <div>
                <div className="rounded-[20px] overflow-hidden aspect-[4/3] mb-4 bg-[#ffffff]">
                  <img
                    src="/src/assets/images/clean_point_center_1794427468143.jpg"
                    alt="Centro de clasificación asistido por IA"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[11px] font-bold text-[#6c6c6c] uppercase tracking-wider block mb-1">
                  PASO 01
                </span>
                <h3 className="text-lg font-bold text-[#333333] mb-2 leading-snug">
                  Clasificación con IA Gemini
                </h3>
                <p className="text-sm text-[#6c6c6c] leading-relaxed">
                  Fotografía el empaque o escanea su código de barras. Nuestro modelo identifica el polímero exacto y guía su limpieza.
                </p>
              </div>

              <button
                onClick={() => onNavigate('escanear')}
                className="mt-4 text-xs font-semibold text-[#333333] flex items-center gap-1 group-hover:underline"
              >
                <span>Probar escáner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step 2 */}
            <div className="card-ecosia p-4 space-y-4 flex flex-col justify-between group">
              <div>
                <div className="rounded-[20px] overflow-hidden aspect-[4/3] mb-4 bg-[#ffffff]">
                  <img
                    src="/src/assets/images/smart_deposit_bin_1794427469235.jpg"
                    alt="Contenedor inteligente de depósito"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[11px] font-bold text-[#6c6c6c] uppercase tracking-wider block mb-1">
                  PASO 02
                </span>
                <h3 className="text-lg font-bold text-[#333333] mb-2 leading-snug">
                  Geofencing Hiperlocal
                </h3>
                <p className="text-sm text-[#6c6c6c] leading-relaxed">
                  Ubica el punto limpio más cercano en el mapa. La tolva física solo se autoriza cuando tu GPS confirma menos de 20 metros reales.
                </p>
              </div>

              <button
                onClick={() => onNavigate('mapa')}
                className="mt-4 text-xs font-semibold text-[#333333] flex items-center gap-1 group-hover:underline"
              >
                <span>Explorar mapa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step 3 */}
            <div className="card-ecosia p-4 space-y-4 flex flex-col justify-between group">
              <div>
                <div className="rounded-[20px] overflow-hidden aspect-[4/3] mb-4 bg-[#ffffff]">
                  <img
                    src="/src/assets/images/circular_goods_1794427468847.jpg"
                    alt="Recompensas y marcas circulares"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[11px] font-bold text-[#6c6c6c] uppercase tracking-wider block mb-1">
                  PASO 03
                </span>
                <h3 className="text-lg font-bold text-[#333333] mb-2 leading-snug">
                  Recompensas Ecocoins
                </h3>
                <p className="text-sm text-[#6c6c6c] leading-relaxed">
                  Escanea el código QR adherido al contenedor y recibe de inmediato Ecocoins para canjear en café orgánico y transporte sostenible.
                </p>
              </div>

              <button
                onClick={() => onNavigate('billetera')}
                className="mt-4 text-xs font-semibold text-[#333333] flex items-center gap-1 group-hover:underline"
              >
                <span>Ver catálogo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step 4 */}
            <div className="card-ecosia p-4 space-y-4 flex flex-col justify-between group">
              <div>
                <div className="rounded-[20px] overflow-hidden aspect-[4/3] mb-4 bg-[#ffffff]">
                  <img
                    src="/src/assets/images/eco_hub_hero_1794427467724.jpg"
                    alt="Impacto ambiental y cadena de custodia"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[11px] font-bold text-[#6c6c6c] uppercase tracking-wider block mb-1">
                  PASO 04
                </span>
                <h3 className="text-lg font-bold text-[#333333] mb-2 leading-snug">
                  Trazabilidad Auditada ESG
                </h3>
                <p className="text-sm text-[#6c6c6c] leading-relaxed">
                  Cada entrega genera un recibo criptográfico con cadena de custodia hasta la planta de valorización bajo directivas ISO 14001.
                </p>
              </div>

              <button
                onClick={() => onNavigate('impacto')}
                className="mt-4 text-xs font-semibold text-[#333333] flex items-center gap-1 group-hover:underline"
              >
                <span>Revisar auditoría</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </LazySection>

      {/* 3. TRANSPARENCY DONUT CHART SPLIT: Ecosia Signature Visualization */}
      <LazySection delayMs={150}>
        <div className="card-ecosia p-8 sm:p-14 rounded-[20px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Donut Chart Visualization (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Segments: #2d8c3a (PET 45%), #e44b4b (Aluminio 20%), #f5c542 (Cartón 18%), #3aa8e0 (Vidrio 12%), #f0a0a0 (TetraPak 5%) */}
                {/* Circumference = 2 * PI * 40 ~= 251.3 */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#2d8c3a"
                  strokeWidth="12"
                  strokeDasharray="113.1 251.3"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#e44b4b"
                  strokeWidth="12"
                  strokeDasharray="50.2 251.3"
                  strokeDashoffset="-113.1"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#f5c542"
                  strokeWidth="12"
                  strokeDasharray="45.2 251.3"
                  strokeDashoffset="-163.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#3aa8e0"
                  strokeWidth="12"
                  strokeDasharray="30.1 251.3"
                  strokeDashoffset="-208.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#f0a0a0"
                  strokeWidth="12"
                  strokeDasharray="12.6 251.3"
                  strokeDashoffset="-238.6"
                />
              </svg>
              {/* Center Metric Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-3xl sm:text-4xl font-bold text-[#333333] tabular-nums">
                  {kgTotal} kg
                </span>
                <span className="text-xs text-[#6c6c6c] font-medium leading-tight mt-0.5">
                  residuos valorizados este mes
                </span>
              </div>
            </div>

            {/* Natural Palette Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-6 text-xs text-[#333333]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2d8c3a]" />
                <span>Plástico PET (45%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e44b4b]" />
                <span>Aluminio (20%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f5c542]" />
                <span>Cartón (18%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3aa8e0]" />
                <span>Vidrio (12%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f0a0a0]" />
                <span>Tetra Pak (5%)</span>
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Explanation (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#6c6c6c] block">
              REPORTE MENSUAL DE TRANSPARENCIA
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#333333] leading-tight">
              Somos 100% transparentes con el destino de cada gramo.
            </h2>
            <p className="text-base text-[#6c6c6c] leading-relaxed">
              Al igual que los informes forestales de Ecosia, publicamos periódicamente nuestros balances de masa, registros de báscula en plantas de acopio y auditorías criptográficas de recibos ciudadanos.
            </p>
            <p className="text-sm text-[#6c6c6c] leading-relaxed">
              Cada kilogramo desviado genera créditos de carbono verificados y reduce la necesidad de materias primas vírgenes en la industria del embalaje.
            </p>

            <div className="pt-3 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('impacto')}
                className="btn-pill-ghost text-xs py-3 px-6"
              >
                <span>Ver informe de trazabilidad</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <button
                onClick={() => onNavigate('escanear')}
                className="btn-pill-lime text-xs py-3 px-6"
              >
                <Sparkles className="w-4 h-4 mr-2 text-[#333333]" />
                <span>Contribuir Hoy</span>
              </button>
            </div>
          </div>
        </div>
      </LazySection>

      {/* 4. RECENT CITIZEN DELIVERIES & ALLIED REWARDS */}
      <LazySection delayMs={200}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Deliveries Audit List (7 cols) */}
          <div className="lg:col-span-7 card-ecosia p-6 sm:p-8 rounded-[20px] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#bebeb9]/40">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6c6c6c] block">
                  REGISTRO AUDITADO
                </span>
                <h3 className="text-xl font-bold text-[#333333]">Entregas Recientes</h3>
              </div>
              <button
                onClick={() => onNavigate('billetera')}
                className="text-xs font-semibold text-[#333333] hover:underline"
              >
                Ver todas →
              </button>
            </div>

            <div className="divide-y divide-[#bebeb9]/30">
              {recentDeliveries.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectReceipt(item)}
                  className="py-4 flex items-center justify-between gap-4 hover:bg-[#ffffff] px-3 rounded-[16px] cursor-pointer transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#6c6c6c] mb-1">
                      <span className="font-semibold text-[#333333]">{item.categoria}</span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(item.fecha_entrega).toLocaleDateString()}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize text-[#333333]">{item.cadena_custodia_paso.replace('_', ' ')}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#333333] truncate">{item.material_nombre}</h4>
                    <p className="text-xs text-[#6c6c6c]">
                      Peso: <span className="tabular-nums font-semibold text-[#333333]">{item.peso_kg} kg</span> · GPS: {item.distancia_metros}m
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#333333] block tabular-nums">+{item.puntos_otorgados} EC</span>
                    <span className="text-[11px] text-[#2d8c3a] font-semibold tabular-nums">{item.co2_ahorrado_kg} kg CO2</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Allied Rewards Teaser (5 cols) */}
          <div className="lg:col-span-5 card-ecosia p-6 sm:p-8 rounded-[20px] flex flex-col justify-between">
            <div>
              <div className="mb-4 pb-3 border-b border-[#bebeb9]/40">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6c6c6c] block">
                  CANJES DE ECONOMÍA CIRCULAR
                </span>
                <h3 className="text-xl font-bold text-[#333333]">Recompensas Populares</h3>
              </div>

              <div className="rounded-[20px] overflow-hidden mb-5 bg-[#ffffff]">
                <img
                  src="/src/assets/images/circular_goods_1794427468847.jpg"
                  alt="Productos de economía circular"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-[16px] bg-[#ffffff] border border-[#bebeb9]/30 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-[#333333]">Café Orgánico Especial</h5>
                    <p className="text-[11px] text-[#6c6c6c]">GreenRoast Coffee · 100% compostable</p>
                  </div>
                  <span className="text-xs font-bold text-[#333333] tabular-nums">50 EC</span>
                </div>

                <div className="p-3.5 rounded-[16px] bg-[#ffffff] border border-[#bebeb9]/30 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-[#333333]">Adopta 1 Árbol Nativo</h5>
                    <p className="text-[11px] text-[#6c6c6c]">Fundación Bosque Nativo · Reforestación</p>
                  </div>
                  <span className="text-xs font-bold text-[#333333] tabular-nums">150 EC</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('billetera')}
              className="w-full mt-6 btn-pill-lime text-xs py-3 flex items-center justify-center gap-1.5"
            >
              <span>Explorar Todos los Cupones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </LazySection>
    </div>
  );
};
