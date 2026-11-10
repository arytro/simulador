import React, { useState } from 'react';
import { ShieldCheck, KeyRound, UserCheck, ArrowRight, CheckCircle2, Info, Lock } from 'lucide-react';
import { AduaneroProfile, SessionUser } from '../types/siga';
import { DEMO_USERS } from '../data/catalogs';

interface ViafirmaLoginProps {
  onComplete: (user: SessionUser) => void;
  onCancel?: () => void;
}

const PERFILES: { id: AduaneroProfile; label: string; desc: string }[] = [
  { id: 'EXPORTADOR', label: 'EXPORTADOR', desc: 'Autocompleta la sección Exportador con su RNC/Cédula.' },
  { id: 'AGENTE DE ADUANAS', label: 'AGENTE DE ADUANAS', desc: 'Autocompleta Agente de Aduanas; permite elegir exportador cliente.' },
  { id: 'IMPORTADOR', label: 'IMPORTADOR', desc: 'Perfil para operaciones de importación y consultas.' },
  { id: 'CONSOLIDADOR', label: 'CONSOLIDADOR', desc: 'Gestión de carga consolidada y manifiestos.' },
  { id: 'NAVIERA', label: 'NAVIERA', desc: 'Línea marítima / conocimientos de embarque.' },
  { id: 'EMPRESA AERONAVE', label: 'EMPRESA AERONAVE', desc: 'Operador de aeronaves de carga.' },
  { id: 'EMPRESA DE LÍNEA AÉREA', label: 'EMPRESA DE LÍNEA AÉREA', desc: 'Guías aéreas (AWB) y vuelos.' },
  { id: 'EMPRESA EXPRÉS', label: 'EMPRESA EXPRÉS', desc: 'Envíos courier y despacho expreso.' },
];

export const ViafirmaLogin: React.FC<ViafirmaLoginProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'cedula' | 'usuario' | 'pin' | 'perfil'>('cedula');
  const [cedula, setCedula] = useState('0909090909');
  const [selectedUserIdx, setSelectedUserIdx] = useState(0);
  const [pin, setPin] = useState('1234');
  const [pinError, setPinError] = useState('');
  const [selectedPerfil, setSelectedPerfil] = useState<AduaneroProfile>('EXPORTADOR');
  const [showSslInfo, setShowSslInfo] = useState(false);

  const matchedUser = DEMO_USERS[selectedUserIdx] || DEMO_USERS[0];

  const handleCedulaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cedula.replace(/[^0-9]/g, '');
    const foundIdx = DEMO_USERS.findIndex((u) => u.cedula === clean);
    if (foundIdx >= 0) {
      setSelectedUserIdx(foundIdx);
      setPin(DEMO_USERS[foundIdx].pin);
    }
    setStep('usuario');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim().length < 4) {
      setPinError('Introduzca un PIN válido de al menos 4 dígitos (demo: 1234).');
      return;
    }
    setPinError('');
    setStep('perfil');
  };

  const handleFinish = () => {
    const cleanCed = cedula.replace(/[^0-9]/g, '') || matchedUser.cedula;
    onComplete({
      cedula: cleanCed,
      nombre: matchedUser.nombre,
      rncEmpresa: matchedUser.rncEmpresa,
      nombreEmpresa: matchedUser.nombreEmpresa,
      direccionEmpresa: matchedUser.direccionEmpresa,
      telefonoEmpresa: matchedUser.telefonoEmpresa,
      emailEmpresa: matchedUser.emailEmpresa,
      licenciaAgente: matchedUser.licenciaAgente,
      perfil: selectedPerfil,
    });
  };

  const handleQuickEnter = (perfil: AduaneroProfile, idx: number) => {
    const u = DEMO_USERS[idx];
    onComplete({
      cedula: u.cedula,
      nombre: u.nombre,
      rncEmpresa: u.rncEmpresa,
      nombreEmpresa: u.nombreEmpresa,
      direccionEmpresa: u.direccionEmpresa,
      telefonoEmpresa: u.telefonoEmpresa,
      emailEmpresa: u.emailEmpresa,
      licenciaAgente: u.licenciaAgente,
      perfil,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 px-4 sm:px-6">
      <div className="max-w-4xl w-full mx-auto">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {/* Header strip */}
          <div className="bg-[#0B3B60] text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-sky-200 font-medium tracking-wide">
                Dirección General de Aduanas · SIGARD
              </p>
              <h1 className="text-xl font-bold mt-1 text-white">
                Simulador de Acceso al Portal SIGA DGA
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-sky-100">
              <span>Cap. 3 del Manual Oficial (Págs. 6–9)</span>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="ml-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-white font-medium transition-colors whitespace-nowrap"
                >
                  Volver al Espacio de Trabajo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left column: Stepper progress + Quick entry */}
            <div className="lg:col-span-5 bg-slate-50/80 border-b lg:border-b-0 lg:border-r border-slate-200 p-6 flex flex-col justify-between gap-6">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 mb-4">
                  Flujo de Autenticación con Firma Digital
                </h2>
                <ol className="space-y-3 text-sm">
                  {[
                    { key: 'cedula', num: '1', title: 'Certificado Digital', desc: 'Ingreso de número de cédula' },
                    { key: 'usuario', num: '2', title: 'Viafirma Fortress', desc: 'Selección de certificado del usuario' },
                    { key: 'pin', num: '3', title: 'Autorización SIGA OTP', desc: 'Validación de PIN de acceso' },
                    { key: 'perfil', num: '4', title: 'Perfil Aduanero', desc: 'Exportador, Agente de Aduanas o Naviera' },
                  ].map((item) => {
                    const order = ['cedula', 'usuario', 'pin', 'perfil'];
                    const activeIdx = order.indexOf(step);
                    const itemIdx = order.indexOf(item.key);
                    const isDone = itemIdx < activeIdx;
                    const isCurrent = itemIdx === activeIdx;
                    return (
                      <li
                        key={item.key}
                        className={`flex items-start gap-3 p-2.5 rounded-md border transition-colors ${
                          isCurrent
                            ? 'bg-white border-[#0B3B60]/30 text-slate-900'
                            : isDone
                            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                            : 'border-transparent text-slate-500'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-semibold shrink-0 mt-0.5 ${
                            isCurrent
                              ? 'bg-[#0B3B60] text-white'
                              : isDone
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isDone ? '✓' : item.num}
                        </span>
                        <div>
                          <div className="font-medium leading-snug">{item.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <p className="text-xs font-semibold text-slate-700">
                  Acceso Directo de Práctica
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Puede recorrer los 4 pasos de Viafirma o ingresar directamente con un perfil configurado:
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickEnter('EXPORTADOR', 0)}
                    className="w-full px-3 py-2 text-xs font-medium text-left bg-white border border-slate-200 hover:border-[#0B3B60] rounded-md text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span>Entrar como Exportador (DFG S.R.L.)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0B3B60]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickEnter('AGENTE DE ADUANAS', 1)}
                    className="w-full px-3 py-2 text-xs font-medium text-left bg-white border border-slate-200 hover:border-[#0B3B60] rounded-md text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span>Entrar como Agente de Aduanas (CED0950)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0B3B60]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right column: Active SIGA/Viafirma screen */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
              {step === 'cedula' && (
                <form onSubmit={handleCedulaSubmit} className="space-y-6 max-w-md mx-auto w-full">
                  <div className="text-center space-y-1">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-sky-50 text-[#0B3B60] mb-2">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0284C7] tracking-tight">
                      CERTIFICADO DIGITAL
                    </h2>
                    <p className="text-sm text-slate-500">
                      Introduzca su número de cédula registrado ante la DGA para validar su certificado SSL/Token.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="siga-cedula" className="block text-xs font-medium text-slate-700">
                      Número de Cédula (sin guiones)
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="siga-cedula"
                        type="text"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        placeholder="INGRESE SU NUMERO DE CEDULA"
                        className="flex-1 px-3.5 py-2.5 text-sm font-mono tabular-nums border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B3B60]/20 focus:border-[#0B3B60]"
                        required
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#65A30D] hover:bg-[#4D7C0F] text-white text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
                      >
                        ENTRAR
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Ejemplo del manual: <span className="font-mono text-slate-700">0909090909</span> (Exportador) o <span className="font-mono text-slate-700">00112233445</span> (Agente).
                    </p>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSslInfo(!showSslInfo)}
                      className="text-xs text-slate-600 underline hover:text-slate-900 inline-flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      ACERCA DE LOS CERTIFICADOS SSL
                    </button>
                    {showSslInfo && (
                      <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md text-left text-xs text-slate-600 leading-relaxed">
                        SIGARD opera en navegadores modernos (Google Chrome) mediante certificados digitales custodiados en Viafirma Fortress o dispositivos Token criptográficos reconocidos por INDOTEL y la DGA.
                      </div>
                    )}
                  </div>
                </form>
              )}

              {step === 'usuario' && (
                <div className="space-y-6 max-w-md mx-auto w-full">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-lg font-bold text-[#0B3B60]">viafirma</span>
                      <span className="text-sm font-medium text-sky-600 ml-1.5">fortress</span>
                    </div>
                    <span className="text-xs text-slate-500">Custodia de Certificados</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-slate-700 font-medium">Continuar con el usuario:</p>
                    <button
                      type="button"
                      onClick={() => setStep('pin')}
                      className="w-full p-4 border-2 border-dashed border-rose-300 hover:border-[#0B3B60] bg-slate-50 hover:bg-sky-50/40 rounded-md flex items-center gap-4 text-left transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#0B3B60] text-white flex items-center justify-center shrink-0">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                          {cedula || matchedUser.cedula}
                        </div>
                        <div className="text-sm font-bold text-slate-800 truncate">
                          {matchedUser.nombre}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B3B60]" />
                    </button>
                    <p className="text-xs text-slate-500">
                      Pulse sobre el nombre del usuario para solicitar la autorización del certificado en SIGA OTP.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUserIdx((prev) => (prev === 0 ? 1 : 0));
                        setCedula(DEMO_USERS[selectedUserIdx === 0 ? 1 : 0].cedula);
                      }}
                      className="text-xs font-medium text-[#0B3B60] hover:underline"
                    >
                      Seleccionar otro usuario
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('cedula')}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                </div>
              )}

              {step === 'pin' && (
                <form onSubmit={handlePinSubmit} className="space-y-6 max-w-md mx-auto w-full">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-lg font-bold text-[#0B3B60]">viafirma</span>
                      <span className="text-sm font-medium text-sky-600 ml-1.5">fortress</span>
                    </div>
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                    <p className="text-xs text-slate-600">
                      El sistema <span className="font-semibold text-slate-800">SIGA OTP</span> está solicitando su autorización para:
                    </p>
                    <p className="text-sm font-semibold text-[#0B3B60]">
                      Obtener la información de uno de sus certificados
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="siga-pin" className="block text-xs font-medium text-slate-700">
                      Por favor, introduzca su PIN (Demo: <span className="font-mono">{matchedUser.pin}</span>)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="siga-pin"
                          type="password"
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          placeholder="••••"
                          className="w-full pl-9 pr-3 py-2.5 text-sm font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B3B60]/20 focus:border-[#0B3B60]"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#0B3B60] hover:bg-[#092e4b] text-white text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
                      >
                        ✓ Validar
                      </button>
                    </div>
                    {pinError && <p className="text-xs text-red-600">{pinError}</p>}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setStep('usuario')}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      ← Volver a usuario
                    </button>
                  </div>
                </form>
              )}

              {step === 'perfil' && (
                <div className="space-y-5 max-w-md mx-auto w-full">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-[#0284C7]">PERFIL ADUANERO</h2>
                    <p className="text-xs text-slate-600">
                      Seleccione el perfil correspondiente (Exportador autocompleta su empresa; Agente de Aduanas habilita selección de clientes).
                    </p>
                  </div>

                  <div className="border border-slate-300 rounded-md overflow-hidden divide-y divide-slate-200 max-h-64 overflow-y-auto">
                    {PERFILES.map((p) => {
                      const active = selectedPerfil === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPerfil(p.id)}
                          className={`w-full px-4 py-2.5 text-left transition-colors flex items-center justify-between gap-3 ${
                            active
                              ? 'bg-[#0284C7] text-white'
                              : 'bg-white text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="text-sm font-semibold">{p.label}</div>
                            <div className={`text-xs ${active ? 'text-sky-100' : 'text-slate-500'}`}>
                              {p.desc}
                            </div>
                          </div>
                          {active && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('pin')}
                      className="px-4 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="px-6 py-2 bg-[#65A30D] hover:bg-[#4D7C0F] text-white text-sm font-semibold rounded-md transition-colors"
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
