import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { X, Lock, Mail, User, Shield, Truck, Building2, Award, Check, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('ciudadano');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickPresetLogin = (role: UserRole) => {
    const roleProfiles: Record<UserRole, UserProfile> = {
      ciudadano: {
        id: 1,
        nombre: 'Valen Vargas',
        email: 'valen.ciudadana@ecocommunity.org',
        rol: 'ciudadano',
        entidad: 'Vecindario Centro',
      },
      recolector: {
        id: 2,
        nombre: 'Carlos Gestor',
        email: 'carlos.recolector@ecocommunity.org',
        rol: 'recolector',
        entidad: 'Cooperativa Recicladores Urbanos',
      },
      punto_acopio: {
        id: 3,
        nombre: 'Ing. Elena Morales',
        email: 'elena.acopio@ecocommunity.org',
        rol: 'punto_acopio',
        entidad: 'Centro de Acopio & Molienda Sur',
      },
      marca_aliada: {
        id: 4,
        nombre: 'Dirección Sostenibilidad GreenRoast',
        email: 'esg@greenroast.com',
        rol: 'marca_aliada',
        entidad: 'GreenRoast Coffee International',
      },
      admin: {
        id: 5,
        nombre: 'Admin Municipal',
        email: 'superadmin@ecocommunity.gov',
        rol: 'admin',
        entidad: 'Consorcio Gestión Ambiental Municipal',
      },
    };

    onLoginSuccess(roleProfiles[role]);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tab === 'register' && !name.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    const user: UserProfile = {
      id: Math.floor(100 + Math.random() * 900),
      nombre: tab === 'register' ? name : email.split('@')[0],
      email: email.trim(),
      rol: selectedRole,
      entidad: selectedRole === 'ciudadano' ? 'Reciclador Ciudadano' : 'Organización Registrada',
    };

    onLoginSuccess(user);
    onClose();
  };

  const rolesCatalog: { id: UserRole; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'ciudadano',
      label: 'Ciudadano / Doméstico',
      desc: 'Escanear con IA, geofence ≤ 20m, billetera y canje de cupones.',
      icon: User,
    },
    {
      id: 'recolector',
      label: 'Recolector Urbano',
      desc: 'Rutas de recogida, pesaje de lotes y escaneo de transferencias.',
      icon: Truck,
    },
    {
      id: 'punto_acopio',
      label: 'Centro de Acopio',
      desc: 'Terminal de pesaje con báscula, capacidad de silos y manifiestos.',
      icon: Building2,
    },
    {
      id: 'marca_aliada',
      label: 'Marca Aliada ESG',
      desc: 'Métricas de REP, metas de neutralidad de empaques y cupones.',
      icon: Award,
    },
    {
      id: 'admin',
      label: 'Super Administrador',
      desc: 'Auditoría antifraude, gobernanza y tarifas por kg.',
      icon: Shield,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#ffffff] rounded-[20px] overflow-hidden text-[#333333] border border-[#f0f0eb] shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#f0f0eb] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d7eb80] ring-2 ring-[#333333]" />
            <h3 className="text-xl font-bold text-[#333333]">Acceso a EcoCommunity</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6c6c6c] hover:text-[#333333] hover:bg-[#f8f8f6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers: Iniciar Sesión vs Registrarse */}
        <div className="p-4 pt-3 pb-0 bg-[#f8f8f6]">
          <div className="flex rounded-full bg-[#f0f0eb] p-1">
            <button
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
                tab === 'login' ? 'bg-[#333333] text-[#ffffff] shadow-sm' : 'text-[#6c6c6c] hover:text-[#333333]'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setTab('register');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
                tab === 'register' ? 'bg-[#333333] text-[#ffffff] shadow-sm' : 'text-[#6c6c6c] hover:text-[#333333]'
              }`}
            >
              Crear Cuenta (Registro)
            </button>
          </div>
        </div>

        {/* Form Body with Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Preset Buttons for Instant Testing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6c6c6c]">
                ACCESO RÁPIDO PARA PRUEBAS (1-CLIC):
              </span>
              <span className="text-[11px] text-[#2d8c3a] font-semibold">5 Webs Privadas</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPresetLogin('ciudadano')}
                className="p-2.5 rounded-[14px] bg-[#f8f8f6] hover:bg-[#d7eb80] border border-[#bebeb9]/30 text-left transition-colors flex items-center gap-2 group"
              >
                <User className="w-4 h-4 text-[#333333] shrink-0" />
                <span className="text-xs font-semibold text-[#333333] truncate">Ciudadano</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPresetLogin('recolector')}
                className="p-2.5 rounded-[14px] bg-[#f8f8f6] hover:bg-[#d7eb80] border border-[#bebeb9]/30 text-left transition-colors flex items-center gap-2 group"
              >
                <Truck className="w-4 h-4 text-[#333333] shrink-0" />
                <span className="text-xs font-semibold text-[#333333] truncate">Recolector</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPresetLogin('punto_acopio')}
                className="p-2.5 rounded-[14px] bg-[#f8f8f6] hover:bg-[#d7eb80] border border-[#bebeb9]/30 text-left transition-colors flex items-center gap-2 group"
              >
                <Building2 className="w-4 h-4 text-[#333333] shrink-0" />
                <span className="text-xs font-semibold text-[#333333] truncate">Centro Acopio</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPresetLogin('marca_aliada')}
                className="p-2.5 rounded-[14px] bg-[#f8f8f6] hover:bg-[#d7eb80] border border-[#bebeb9]/30 text-left transition-colors flex items-center gap-2 group"
              >
                <Award className="w-4 h-4 text-[#333333] shrink-0" />
                <span className="text-xs font-semibold text-[#333333] truncate">Marca ESG</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPresetLogin('admin')}
                className="p-2.5 rounded-[14px] bg-[#f8f8f6] hover:bg-[#d7eb80] border border-[#bebeb9]/30 text-left transition-colors flex items-center gap-2 group sm:col-span-2"
              >
                <Shield className="w-4 h-4 text-[#333333] shrink-0" />
                <span className="text-xs font-semibold text-[#333333] truncate">Super Administrador</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#f0f0eb]" />
            <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-[#6c6c6c] font-semibold">
              o ingresa tus credenciales
            </span>
            <div className="flex-grow border-t border-[#f0f0eb]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="text-xs font-bold text-[#333333] block mb-1">Nombre Completo</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6c6c6c]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Paula Valentina Vargas"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#f8f8f6] border border-[#f0f0eb] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#d7eb80]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#333333] block mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6c6c6c]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.correo@ejemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#f8f8f6] border border-[#f0f0eb] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#d7eb80]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#333333] block mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6c6c6c]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#f8f8f6] border border-[#f0f0eb] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#d7eb80]"
                />
              </div>
            </div>

            {/* Role Selection when Registering or Selecting Target Role */}
            <div>
              <label className="text-xs font-bold text-[#333333] block mb-1.5">
                {tab === 'register' ? 'Selecciona tu Rol Designado:' : 'Entrar al Portal Privado de:'}
              </label>
              <div className="space-y-1.5">
                {rolesCatalog.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-3 rounded-[16px] border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#d7eb80]/30 border-[#d7eb80]'
                          : 'bg-[#f8f8f6] hover:bg-[#f0f0eb] border-[#f0f0eb]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#333333] text-[#d7eb80]' : 'bg-[#ffffff] text-[#333333]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#333333] block truncate">{r.label}</span>
                          <span className="text-[11px] text-[#6c6c6c] block truncate">{r.desc}</span>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#333333] border-[#333333]' : 'border-[#bebeb9]'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-[#d7eb80] stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-[14px] bg-red-50 border border-red-200 text-xs text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-pill-lime py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#333333]" />
              <span>
                {tab === 'login' ? 'Entrar a mi Web Privada' : 'Crear Cuenta y Abrir Portal'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
