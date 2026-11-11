import React from 'react';
import { UserProfile } from '../types';
import { Home, ScanLine, MapPin, Wallet, BarChart3 } from 'lucide-react';

interface BottomTabBarProps {
  currentUser: UserProfile | null;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAuthModal: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentUser,
  currentTab,
  onTabChange,
  onOpenAuthModal,
}) => {
  // If not citizen or not logged in, hide mobile bottom bar for complete focus
  if (!currentUser || currentUser.rol !== 'ciudadano') {
    return null;
  }

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'mapa', label: 'Puntos', icon: MapPin },
    { id: 'escanear', label: 'Escanear', icon: ScanLine, isPrimary: true },
    { id: 'billetera', label: 'Billetera', icon: Wallet },
    { id: 'impacto', label: 'Impacto', icon: BarChart3 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/98 backdrop-blur-lg border-t border-[#f0f0eb]">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center -mt-5 group"
                aria-label={tab.label}
              >
                <div className="w-12 h-12 rounded-full bg-[#d7eb80] text-[#333333] flex items-center justify-center border-2 border-[#ffffff] shadow-sm group-active:scale-95 transition-transform">
                  <Icon className="w-5 h-5 text-[#333333]" />
                </div>
                <span className="text-[10px] font-semibold text-[#333333] mt-1">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
                isActive ? 'text-[#333333] font-semibold' : 'text-[#6c6c6c] hover:text-[#333333]'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
