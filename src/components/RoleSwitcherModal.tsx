import React from 'react';
import { UserRole } from '../types';
import { User, Truck, Building2, Award, ShieldCheck, X, Check } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
}) => {
  if (!isOpen) return null;

  const rolesList: {
    id: UserRole;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
  }[] = [
    {
      id: 'ciudadano',
      title: 'Ciudadano / Reciclador Doméstico',
      description: 'Escanea residuos con IA Gemini, localiza puntos limpios con geofencing (<= 20m), gana ecocoins y canjea cupones.',
      icon: User,
      badge: 'B2C Principal',
    },
    {
      id: 'recolector',
      title: 'Reciclador Urbano / Gestor',
      description: 'Recepción de rutas de recolección en campo, pesaje de lotes y escaneo QR de transferencia.',
      icon: Truck,
      badge: 'Operativa',
    },
    {
      id: 'punto_acopio',
      title: 'Punto de Acopio / Terminal',
      description: 'Terminal de pesaje físico de lotes, capacidad de tolvas y emisión de manifiestos digitales de carga.',
      icon: Building2,
      badge: 'Terminal Físico',
    },
    {
      id: 'marca_aliada',
      title: 'Marca Aliada / Sponsor ESG',
      description: 'Dashboard corporativo de empaques recuperados, metas de neutralidad de plástico y campañas de cupones.',
      icon: Award,
      badge: 'B2B Partner',
    },
    {
      id: 'admin',
      title: 'Super Administrador',
      description: 'Supervisión del sistema, auditoría antifraude, reglas de puntos por kg y control de puntos limpios.',
      icon: ShieldCheck,
      badge: 'Admin Console',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#ffffff] rounded-[20px] overflow-hidden text-[#333333] border border-[#f0f0eb]">
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#f0f0eb]">
          <div>
            <h3 className="text-xl font-bold text-[#333333]">Perspectivas de Usuario (RBAC)</h3>
            <p className="text-xs text-[#6c6c6c] mt-0.5">Explora las funcionalidades de los diferentes roles de EcoCommunity</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6c6c6c] hover:text-[#333333] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {rolesList.map((r) => {
            const Icon = r.icon;
            const isSelected = currentRole === r.id;

            return (
              <button
                key={r.id}
                onClick={() => {
                  onSelectRole(r.id);
                  onClose();
                }}
                className={`w-full p-4 rounded-[18px] text-left transition-all border flex items-start gap-4 ${
                  isSelected
                    ? 'bg-[#d7eb80]/30 border-[#d7eb80]'
                    : 'bg-[#f8f8f6] hover:bg-[#f0f0eb] border-[#f0f0eb]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#333333] text-[#d7eb80]' : 'bg-[#ffffff] text-[#333333] border border-[#f0f0eb]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#333333] truncate">{r.title}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#333333] font-bold">{r.badge}</span>
                  </div>
                  <p className="text-xs text-[#6c6c6c] mt-1 leading-relaxed">{r.description}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#333333] text-[#d7eb80] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-8 py-5 bg-[#f8f8f6] border-t border-[#f0f0eb] flex items-center justify-end">
          <button
            onClick={onClose}
            className="btn-pill-ghost text-xs py-2 px-5"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
