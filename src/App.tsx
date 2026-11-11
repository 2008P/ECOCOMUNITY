/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, ClassificationResult, Entrega, PuntoLimpio, UserWalletData } from './types';
import { Navbar } from './components/Navbar';
import { BottomTabBar } from './components/BottomTabBar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DashboardView } from './components/DashboardView';
import { DigitalReceiptModal } from './components/DigitalReceiptModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { AuthModal } from './components/AuthModal';
import { SiteLoadingSkeleton } from './components/SkeletonLoader';

// Dedicated Private Web Portals for each role
import { CitizenPrivateWeb } from './components/portals/CitizenPrivateWeb';
import { CollectorPrivateWeb } from './components/portals/CollectorPrivateWeb';
import { DropoffCenterPrivateWeb } from './components/portals/DropoffCenterPrivateWeb';
import { BrandPrivateWeb } from './components/portals/BrandPrivateWeb';
import { AdminPrivateWeb } from './components/portals/AdminPrivateWeb';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ecocommunity_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [walletData, setWalletData] = useState<UserWalletData | null>(null);
  const [recentDeliveries, setRecentDeliveries] = useState<Entrega[]>([]);
  const [scannedMaterial, setScannedMaterial] = useState<ClassificationResult | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Digital Receipt Modal
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<Entrega | null>(null);
  const [activePunto, setActivePunto] = useState<PuntoLimpio | null>(null);

  // Offline Mode & Local Queue
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('ecocommunity_offline_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        await Promise.all([fetchWallet(), new Promise((res) => setTimeout(res, 500))]);
      } finally {
        setIsInitialLoading(false);
      }
    };
    initData();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await fetch('/api/user/wallet');
      if (res.ok) {
        const data: UserWalletData = await res.json();
        setWalletData(data);
      }
      const esgRes = await fetch('/api/esg/report');
      if (esgRes.ok) {
        const esgData = await esgRes.json();
        if (esgData.cadena_de_custodia) {
          const mapped: Entrega[] = esgData.cadena_de_custodia.map((item: any, idx: number) => ({
            id: 200 + idx,
            uuid: item.entrega_id,
            usuario_id: 1,
            punto_id: 1,
            material_nombre: item.material,
            categoria: item.material.includes('PET')
              ? 'Plástico PET'
              : item.material.includes('Cartón')
              ? 'Cartón y Papel'
              : item.material.includes('Lata')
              ? 'Aluminio / Latas'
              : 'Vidrio',
            peso_kg: parseFloat(item.peso) || 0.15,
            puntos_otorgados: 30,
            co2_ahorrado_kg: 0.27,
            estado: 'confirmada',
            latitud_registro: 40.4153,
            longitud_registro: -3.7073,
            distancia_metros: 6,
            qr_hash: 'ECO-BIN-PLAZA-CENTRAL-01',
            fecha_entrega: item.fecha,
            cadena_custodia_paso: item.estado_actual,
            recibo_digital_hash: item.hash_verificacion,
          }));
          setRecentDeliveries(mapped);
        }
      }
    } catch (err) {
      console.warn('Backend loading, offline or fallback active:', err);
    }
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('ecocommunity_auth_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('ecocommunity_auth_user');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwitchRole = (newRole: UserRole) => {
    if (!currentUser) return;
    const updatedUser: UserProfile = {
      ...currentUser,
      rol: newRole,
      entidad:
        newRole === 'ciudadano'
          ? 'Reciclador Ciudadano'
          : newRole === 'recolector'
          ? 'Cooperativa Recicladores Urbanos'
          : newRole === 'punto_acopio'
          ? 'Centro de Acopio & Molienda Sur'
          : newRole === 'marca_aliada'
          ? 'GreenRoast Coffee Sostenible'
          : 'Consorcio Municipal Ambiental',
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('ecocommunity_auth_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeliveryComplete = (entrega: Entrega, punto: PuntoLimpio) => {
    setActiveReceipt(entrega);
    setActivePunto(punto);
    setReceiptModalOpen(true);
    setRecentDeliveries((prev) => [entrega, ...prev]);
    setScannedMaterial(null);
    fetchWallet();
  };

  const handleQueueOfflineDelivery = (payload: any) => {
    const updated = [...offlineQueue, { ...payload, timestamp: Date.now() }];
    setOfflineQueue(updated);
    try {
      localStorage.setItem('ecocommunity_offline_queue', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncPending = async () => {
    if (offlineQueue.length === 0 || isOffline) return;
    setIsSyncing(true);
    try {
      for (const item of offlineQueue) {
        await fetch('/api/entregas/validate-and-deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      setOfflineQueue([]);
      localStorage.removeItem('ecocommunity_offline_queue');
      fetchWallet();
      alert('¡Todas las entregas guardadas localmente se han sincronizado con éxito!');
    } catch (err) {
      console.error('Error syncing offline queue:', err);
      alert('Hubo un problema al sincronizar. Se mantendrán los registros locales para reintentar.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Called when user clicks "Escanear Residuo" on the navbar or landing page
  const handleScanActionClick = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      // If already logged in, stay or switch to citizen portal if needed
      if (currentUser.rol !== 'ciudadano') {
        handleSwitchRole('ciudadano');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#333333] flex flex-col font-sans selection:bg-[#d7eb80] selection:text-[#333333]">
      {/* Offline simulation & synchronization bar */}
      <OfflineIndicator
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        pendingSyncCount={offlineQueue.length}
        onSyncPending={handleSyncPending}
        isSyncing={isSyncing}
      />

      {/* Main Top Bar: clean navbar with ONLY "Escanear Residuo" button as requested */}
      <Navbar
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onNavigateHome={() => {
          if (!currentUser) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            handleScanActionClick();
          }
        }}
        onOpenRoleSwitcher={() => setRoleModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {isInitialLoading ? (
          <SiteLoadingSkeleton />
        ) : !currentUser ? (
          /* UNATHENTICATED PUBLIC SITE: Clicking any scan or action button triggers AuthModal */
          <DashboardView
            walletData={walletData}
            recentDeliveries={recentDeliveries}
            onNavigate={(_tab) => handleScanActionClick()}
            onSelectReceipt={(entrega) => {
              setActiveReceipt(entrega);
              setActivePunto(null);
              setReceiptModalOpen(true);
            }}
            onScanClick={handleScanActionClick}
          />
        ) : (
          /* AUTHENTICATED: Separate & Private Designated Web Portals for each role */
          <>
            {currentUser.rol === 'ciudadano' && (
              <CitizenPrivateWeb
                currentUser={currentUser}
                walletData={walletData}
                recentDeliveries={recentDeliveries}
                scannedMaterial={scannedMaterial}
                onClassificationSuccess={(res) => setScannedMaterial(res)}
                onDeliveryComplete={handleDeliveryComplete}
                isOffline={isOffline}
                onQueueOfflineDelivery={handleQueueOfflineDelivery}
                onRefreshWallet={fetchWallet}
                onSelectReceipt={(entrega) => {
                  setActiveReceipt(entrega);
                  setActivePunto(null);
                  setReceiptModalOpen(true);
                }}
              />
            )}

            {currentUser.rol === 'recolector' && (
              <CollectorPrivateWeb currentUser={currentUser} />
            )}

            {currentUser.rol === 'punto_acopio' && (
              <DropoffCenterPrivateWeb currentUser={currentUser} />
            )}

            {currentUser.rol === 'marca_aliada' && (
              <BrandPrivateWeb currentUser={currentUser} />
            )}

            {currentUser.rol === 'admin' && (
              <AdminPrivateWeb currentUser={currentUser} />
            )}
          </>
        )}
      </main>

      {/* Ecosia Minimal Editorial Footer */}
      <footer className="border-t border-[#f0f0eb] bg-[#ffffff] py-12 mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#6c6c6c]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d7eb80] ring-2 ring-[#333333]" />
            <span className="font-bold tracking-wider text-[#333333] uppercase">ECOCOMMUNITY</span>
            <span>· Plataforma de Economía Circular con Roles Privados</span>
          </div>
          <div className="flex items-center gap-5">
            {currentUser ? (
              <>
                <span>Sesión activa: <strong className="text-[#333333]">{currentUser.nombre}</strong> ({currentUser.rol})</span>
                <button
                  onClick={() => setRoleModalOpen(true)}
                  className="font-semibold text-[#333333] hover:underline"
                >
                  Cambiar de Web Privada
                </button>
                <button
                  onClick={handleLogout}
                  className="hover:text-[#333333] transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthModalOpen(true)} className="hover:text-[#333333] transition-colors font-medium">
                  Iniciar Sesión
                </button>
                <button onClick={() => setAuthModalOpen(true)} className="hover:text-[#333333] transition-colors font-medium">
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Mobile Tab Bar */}
      <BottomTabBar
        currentUser={currentUser}
        currentTab="inicio"
        onTabChange={(_tab) => handleScanActionClick()}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Auth Modal: Iniciar Sesión / Registro con 1-click test presets */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Digital Receipt Modal */}
      <DigitalReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        entrega={activeReceipt}
        punto={activePunto}
        onGoToWallet={() => {
          setReceiptModalOpen(false);
          if (!currentUser) {
            setAuthModalOpen(true);
          }
        }}
      />

      {/* Role Switcher Modal to explore all designated private webs with same session */}
      <RoleSwitcherModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        currentRole={currentUser?.rol ?? 'ciudadano'}
        onSelectRole={handleSwitchRole}
      />
    </div>
  );
}
