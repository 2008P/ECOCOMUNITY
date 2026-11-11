import React from 'react';
import { UserRole, UserProfile } from '../types';
import { Leaf, LogOut, Shield, User, Truck, Building2, Award } from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onOpenRoleSwitcher: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuthModal,
  onLogout,
  onNavigateHome,
  onOpenRoleSwitcher,
}) => {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'ciudadano':
        return 'Web Ciudadana';
      case 'recolector':
        return 'Web Recolector';
      case 'punto_acopio':
        return 'Web Centro Acopio';
      case 'marca_aliada':
        return 'Web Marca ESG';
      case 'admin':
        return 'Consola Admin';
      default:
        return 'Usuario';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ciudadano':
        return User;
      case 'recolector':
        return Truck;
      case 'punto_acopio':
        return Building2;
      case 'marca_aliada':
        return Award;
      case 'admin':
        return Shield;
      default:
        return User;
    }
  };

  const RoleIcon = currentUser ? getRoleIcon(currentUser.rol) : User;

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/98 backdrop-blur-md border-b border-[#f0f0eb]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          {/* Brand Wordmark */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-lg sm:text-xl font-bold tracking-[0.05em] uppercase text-[#333333] whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#d7eb80] ring-2 ring-[#333333]" />
            <span>ECOCOMMUNITY</span>
          </button>

          {/* Right Action: ONLY "Escanear Residuo" as requested, plus user auth status */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <>
                {/* Active Role Portal Badge (Pill with quick switch) */}
                <button
                  onClick={onOpenRoleSwitcher}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8f8f6] hover:bg-[#f0f0eb] border border-[#bebeb9]/40 text-xs text-[#333333] transition-colors"
                  title="Cambiar a otra web privada designada"
                >
                  <RoleIcon className="w-3.5 h-3.5 text-[#333333]" />
                  <span className="hidden sm:inline font-semibold">{currentUser.nombre}:</span>
                  <span className="font-bold text-[#2d8c3a]">{getRoleLabel(currentUser.rol)}</span>
                  <span className="text-[10px] text-[#6c6c6c] underline">Cambiar</span>
                </button>

                {/* Primary Action Button */}
                <button
                  onClick={() => onNavigateHome()}
                  className="btn-pill-lime text-xs px-5 py-2.5 shadow-none whitespace-nowrap shrink-0"
                >
                  <Leaf className="w-3.5 h-3.5 text-[#333333] mr-1.5" />
                  <span>Escanear Residuo</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="btn-pill-ghost text-xs px-3.5 py-2 whitespace-nowrap shrink-0"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-3.5 h-3.5 sm:mr-1 text-[#333333]" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            ) : (
              /* Unauthenticated user: ONLY ONE primary button "Escanear Residuo" */
              <button
                onClick={onOpenAuthModal}
                className="btn-pill-lime text-xs sm:text-sm px-6 py-2.5 sm:py-3 shadow-none whitespace-nowrap shrink-0 font-semibold flex items-center gap-2"
              >
                <Leaf className="w-4 h-4 text-[#333333]" />
                <span>Escanear Residuo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
