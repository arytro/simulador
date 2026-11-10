/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FilePlus2,
  Search,
  Truck,
  FileEdit,
  FolderSearch,
  UserCircle2,
  FileSpreadsheet,
  BookOpen,
  RotateCcw,
  Menu,
  X,
} from 'lucide-react';
import {
  ActiveModule,
  CargaEntradaRegistro,
  CargoEntryStatus,
  CorrectionStatus,
  DeclaracionDUA,
  DuaStatus,
  NotificationItem,
  SessionUser,
  SolicitudCorreccion,
} from './types/siga';
import {
  INITIAL_CARGA_ENTRADA,
  INITIAL_CORRECCIONES,
  INITIAL_DUAS,
  INITIAL_NOTIFICATIONS,
} from './data/catalogs';
import {
  generateCargoEntryNumber,
  generateCorrectionNumber,
  generateDeclarationNumber,
  getTodayDdMmYyyy,
} from './utils/duaXml';
import { ViafirmaLogin } from './components/ViafirmaLogin';
import { DuaFormView } from './components/DuaFormView';
import { DuaSearchAndDetailView } from './components/DuaSearchAndDetailView';
import { CargoEntryView } from './components/CargoEntryView';
import { CorrectionRequestView } from './components/CorrectionRequestView';
import { MyPageView } from './components/MyPageView';
import { DgiiBridgeView } from './components/DgiiBridgeView';
import { ManualGuideView } from './components/ManualGuideView';
import { PaymentModal, PrintableDuaModal } from './components/PrintableDuaModal';

const STORAGE_KEY = 'siga_dua_dgii_sim_v1';

interface StoredState {
  sessionUser: SessionUser | null;
  duas: DeclaracionDUA[];
  cargaEntrada: CargaEntradaRegistro[];
  correcciones: SolicitudCorreccion[];
  notifications: NotificationItem[];
}

function loadInitialState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredState;
      if (parsed && Array.isArray(parsed.duas)) {
        return parsed;
      }
    }
  } catch {
    // ignore corrupted local storage
  }
  return {
    sessionUser: null,
    duas: INITIAL_DUAS,
    cargaEntrada: INITIAL_CARGA_ENTRADA,
    correcciones: INITIAL_CORRECCIONES,
    notifications: INITIAL_NOTIFICATIONS,
  };
}

export default function App() {
  const [initial] = useState<StoredState>(() => loadInitialState());
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(initial.sessionUser);
  const [showViafirmaLogin, setShowViafirmaLogin] = useState<boolean>(!initial.sessionUser);

  const [duas, setDuas] = useState<DeclaracionDUA[]>(initial.duas);
  const [cargaEntrada, setCargaEntrada] = useState<CargaEntradaRegistro[]>(initial.cargaEntrada);
  const [correcciones, setCorrecciones] = useState<SolicitudCorreccion[]>(initial.correcciones);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initial.notifications);

  const [activeModule, setActiveModule] = useState<ActiveModule>('dua-register');
  const [editingDua, setEditingDua] = useState<DeclaracionDUA | null>(null);
  const [selectedDuaId, setSelectedDuaId] = useState<string | null>(null);
  const [preselectedCorrDuaNo, setPreselectedCorrDuaNo] = useState<string | null>(null);

  const [paymentTargetDua, setPaymentTargetDua] = useState<DeclaracionDUA | null>(null);
  const [printTargetDua, setPrintTargetDua] = useState<DeclaracionDUA | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportExpanded, setExportExpanded] = useState(true);

  useEffect(() => {
    try {
      const state: StoredState = {
        sessionUser,
        duas,
        cargaEntrada,
        correcciones,
        notifications,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }
  }, [sessionUser, duas, cargaEntrada, correcciones, notifications]);

  const pushNotification = (
    titulo: string,
    mensaje: string,
    documentoRef: string,
    tipo: NotificationItem['tipo'] = 'info'
  ) => {
    const now = new Date();
    const hora = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        fecha: `${getTodayDdMmYyyy()} ${hora}`,
        titulo,
        mensaje,
        documentoRef,
        tipo,
        leida: false,
      },
      ...prev,
    ]);
  };

  const handleLoginComplete = (user: SessionUser) => {
    setSessionUser(user);
    setShowViafirmaLogin(false);
    setEditingDua(null);
  };

  const handleSaveTemporal = (draft: DeclaracionDUA): DeclaracionDUA => {
    const exists = duas.some((d) => d.id === draft.id);
    const saved: DeclaracionDUA = {
      ...draft,
      noDeclaracion: draft.noDeclaracion || generateDeclarationNumber(draft.adminCodigo, duas),
      estado: 'Temporal',
    };
    setDuas((prev) => (exists ? prev.map((d) => (d.id === saved.id ? saved : d)) : [saved, ...prev]));
    pushNotification(
      'Declaración Guardada (Temporal)',
      `El borrador ${saved.noDeclaracion} fue guardado. Puede editarlo o presentarlo cuando esté completo.`,
      saved.noDeclaracion,
      'info'
    );
    return saved;
  };

  const handlePresentDua = (draft: DeclaracionDUA): { dua: DeclaracionDUA; eged: string } => {
    const noDeclaracion =
      draft.noDeclaracion || generateDeclarationNumber(draft.adminCodigo, duas);
    const eged = generateCargoEntryNumber(cargaEntrada.map((c) => c.noSolicitud));
    const now = new Date();
    const hora = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const presented: DeclaracionDUA = {
      ...draft,
      noDeclaracion,
      estado: 'Registrado/Aceptado',
      selectividad: 'Amarillo (Revisión)',
      noSolicitudEntradaCarga: eged,
      tasaDuaMonto: 300,
      tasaPagada: false,
      fechaPresentacion: `${getTodayDdMmYyyy()} ${hora}`,
    };

    setDuas((prev) => {
      const exists = prev.some((d) => d.id === presented.id);
      return exists ? prev.map((d) => (d.id === presented.id ? presented : d)) : [presented, ...prev];
    });

    const firstContainer = presented.contenedores[0];
    const totalCantidad = presented.detalles.reduce((acc, item) => acc + item.cantidad, 0);
    setCargaEntrada((prev) => [
      {
        id: `cg-${Date.now()}`,
        sec: prev.length + 1,
        noSolicitud: eged,
        fechaTentativaEntrada: presented.fechaDeclaracion,
        noDeclaracion,
        aduanaSalidaCodigo: presented.adminCodigo,
        aduanaSalidaNombre: presented.adminNombre,
        empresaTransportista: `${presented.empresaTransportistaCodigo} · ${presented.empresaTransportistaNombre}`,
        noViaje: presented.noViajeVuelo || 'N/A',
        tipoCarga: presented.aGranel ? 'A Granel' : 'Contenedorizada',
        noContenedor: firstContainer?.numeroContenedor || 'CARGA SUELTA',
        noPlaca: firstContainer?.noPlaca || '—',
        noSello: firstContainer?.sello || '—',
        cantidadBultos: Math.round(totalCantidad),
        estadoSolicitud: 'Registro',
      },
      ...prev,
    ]);

    pushNotification(
      'DUA Presentada · Pago Pendiente RD$300.00',
      `Se presentó la DUA ${noDeclaracion} y se generó automáticamente la solicitud de entrada de carga ${eged}. Realice el pago de RD$300.00 para habilitar impresión.`,
      noDeclaracion,
      'warning'
    );

    return { dua: presented, eged };
  };

  const handleConfirmPayment = (duaId: string, metodo: string, ref: string) => {
    setDuas((prev) =>
      prev.map((d) =>
        d.id === duaId
          ? { ...d, tasaPagada: true, metodoPago: metodo, referenciaPago: ref }
          : d
      )
    );
    const paidDua = duas.find((d) => d.id === duaId);
    if (paidDua) {
      pushNotification(
        'Pago de Tasa DUA Confirmado',
        `Pago de RD$300.00 procesado vía ${metodo} (Ref: ${ref}). El botón Imprimir ya está habilitado.`,
        paidDua.noDeclaracion,
        'success'
      );
      if (editingDua && editingDua.id === duaId) {
        setEditingDua({ ...editingDua, tasaPagada: true, metodoPago: metodo, referenciaPago: ref });
      }
    }
    setPaymentTargetDua(null);
  };

  const handleSimulateOfficerAction = (duaId: string, nextStatus: DuaStatus) => {
    setDuas((prev) =>
      prev.map((d) => {
        if (d.id !== duaId) return d;
        const nextSelectividad =
          nextStatus === 'Inspeccionando'
            ? 'Inspección física'
            : nextStatus === 'Despacho Aprobado'
            ? 'Verde (Documental)'
            : d.selectividad;
        return {
          ...d,
          estado: nextStatus,
          selectividad: nextSelectividad,
          fechaInspeccion: nextStatus === 'Inspeccionando' ? `${getTodayDdMmYyyy()} 14:00` : d.fechaInspeccion,
        };
      })
    );
    const target = duas.find((d) => d.id === duaId);
    if (target) {
      pushNotification(
        `Cambio de Estado DUA: ${nextStatus}`,
        `La declaración ${target.noDeclaracion} cambió al estado ${nextStatus}.`,
        target.noDeclaracion,
        nextStatus === 'Despacho Aprobado' ? 'success' : nextStatus === 'Rechazado' ? 'error' : 'info'
      );
    }
  };

  const handleAdvanceCargoStatus = (id: string, nextStatus: CargoEntryStatus) => {
    setCargaEntrada((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estadoSolicitud: nextStatus } : c))
    );
  };

  const handleSubmitCorrection = (
    payload: Omit<
      SolicitudCorreccion,
      'id' | 'sec' | 'noSolicitudCorreccion' | 'fechaCorreccion' | 'fechaVencimiento' | 'fechaTermino' | 'estado'
    >
  ): SolicitudCorreccion => {
    const noSol = generateCorrectionNumber(
      payload.adminCodigo,
      correcciones.map((c) => c.noSolicitudCorreccion)
    );
    const now = new Date();
    const hora = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const created: SolicitudCorreccion = {
      ...payload,
      id: `corr-${Date.now()}`,
      sec: correcciones.length + 1,
      noSolicitudCorreccion: noSol,
      fechaCorreccion: `${getTodayDdMmYyyy()} ${hora}`,
      fechaVencimiento: `${getTodayDdMmYyyy()} 18:00`,
      fechaTermino: '',
      estado: 'Registrado/Aceptado',
    };
    setCorrecciones((prev) => [created, ...prev]);
    pushNotification(
      'Solicitud de Corrección Registrada',
      `Se radicó la solicitud ${noSol} para la declaración ${payload.noFormularioReferencia}.`,
      noSol,
      'info'
    );
    return created;
  };

  const handleSimulateCorrectionDecision = (id: string, status: CorrectionStatus) => {
    setCorrecciones((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, estado: status, fechaTermino: getTodayDdMmYyyy() }
          : c
      )
    );
    const found = correcciones.find((c) => c.id === id);
    if (found) {
      pushNotification(
        `Corrección ${status}`,
        `El oficial de aduanas marcó la solicitud ${found.noSolicitudCorreccion} como ${status}.`,
        found.noSolicitudCorreccion,
        status === 'Aprobada' ? 'success' : 'error'
      );
    }
  };

  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDuas(INITIAL_DUAS);
    setCargaEntrada(INITIAL_CARGA_ENTRADA);
    setCorrecciones(INITIAL_CORRECCIONES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setEditingDua(null);
    setSelectedDuaId(null);
    setActiveModule('dua-register');
  };

  const cornerSignature = (
    <div
      aria-label="Proyecto Grupo 3"
      className="no-print fixed bottom-3 right-4 z-40 pointer-events-none select-none bg-white/95 backdrop-blur-sm border border-slate-200 rounded-md px-3.5 py-1.5 shadow-sm"
    >
      <span className="font-signature italic font-semibold text-[15px] leading-none tracking-tight text-[#0B3B60]">
        Proyecto Grupo 3
      </span>
    </div>
  );

  if (showViafirmaLogin || !sessionUser) {
    return (
      <>
        <ViafirmaLogin
          onComplete={handleLoginComplete}
          onCancel={sessionUser ? () => setShowViafirmaLogin(false) : undefined}
        />
        {cornerSignature}
      </>
    );
  }

  const navigateTo = (mod: ActiveModule) => {
    setActiveModule(mod);
    setSidebarOpen(false);
    if (mod === 'dua-search') {
      setSelectedDuaId(null);
    }
  };

  const breadcrumbMap: Record<ActiveModule, string> = {
    'dua-register': 'e-Aduanas > Exportación > Declaración de Exportación > Nuevo [wcEC010101]',
    'dua-search': 'e-Aduanas > Exportación > Buscar Declaración [wcEC010102]',
    'cargo-entry': 'e-Aduanas > Exportación > Consulta de Entrada de la Carga',
    'correction-register': 'e-Aduanas > Exportación > Solicitud de Corrección > Nuevo [wcIC011401]',
    'correction-search': 'e-Aduanas > Exportación > Solicitud de Corrección > Buscar [wcIC011402]',
    'my-page': 'Mi Página > Bandeja de Documento > Listado de Doc.',
    'dgii-bridge': 'Integración Fiscal DGII > Cruce e-CF 46 / NCF 16 / Formato 607 / IT-1',
    'manual-guide': 'Ayuda > Guía Oficial Manual DGA Exportación (PDF)',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="no-print bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between gap-8 sticky top-0 z-30">
        {/* Zone 1: Brand Title (single line) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded"
            aria-label="Abrir menú lateral"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => navigateTo('dua-register')}
            className="text-base sm:text-lg font-bold tracking-tight text-[#0B3B60] whitespace-nowrap shrink-0"
          >
            SIGA DUA · Exportación RD
          </button>
        </div>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => {
              setEditingDua(null);
              navigateTo('dua-register');
            }}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
              activeModule === 'dua-register'
                ? 'border-[#0B3B60] text-[#0B3B60] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Declaración DUA
          </button>
          <button
            type="button"
            onClick={() => navigateTo('dua-search')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
              activeModule === 'dua-search'
                ? 'border-[#0B3B60] text-[#0B3B60] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Buscar DUA
          </button>
          <button
            type="button"
            onClick={() => navigateTo('dgii-bridge')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
              activeModule === 'dgii-bridge'
                ? 'border-[#0B3B60] text-[#0B3B60] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Cruce DGII
          </button>
          <button
            type="button"
            onClick={() => navigateTo('my-page')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
              activeModule === 'my-page'
                ? 'border-[#0B3B60] text-[#0B3B60] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Mi Página
          </button>
          <button
            type="button"
            onClick={() => navigateTo('manual-guide')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
              activeModule === 'manual-guide'
                ? 'border-[#0B3B60] text-[#0B3B60] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Manual PDF
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setShowViafirmaLogin(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0B3B60] hover:bg-[#092e4b] rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            Cambiar Perfil / Viafirma
          </button>
        </div>
      </header>

      {/* Workspace Sub-toolbar (Breadcrumb + Active User + Reset) */}
      <div className="no-print bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-slate-600 truncate">
          <span className="font-medium text-slate-800">Usted está :</span>{' '}
          <span>{breadcrumbMap[activeModule]}</span>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-slate-700">
          <span>
            Usuario: <strong className="text-slate-900">{sessionUser.nombre}</strong> ({sessionUser.perfil})
          </span>
          <button
            type="button"
            onClick={handleResetDemo}
            className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 underline"
          >
            <RotateCcw className="w-3 h-3" />
            Restablecer Demo
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar + Content Viewport */}
      <div className="flex-1 flex relative">
        {/* Left Navigation Tree (e-Aduanas & Mi Página) */}
        <aside
          className={`no-print w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col ${
            sidebarOpen
              ? 'fixed inset-y-14 left-0 z-40 shadow-xl'
              : 'hidden lg:flex'
          }`}
        >
          <div className="bg-[#0B3B60] text-white px-4 py-2.5 text-xs font-bold tracking-wide">
            e-Aduanas · SIGARD
          </div>

          <div className="p-2.5 space-y-1 text-xs flex-1 overflow-y-auto">
            {/* Exportación Group */}
            <div>
              <button
                type="button"
                onClick={() => setExportExpanded(!exportExpanded)}
                className="w-full px-2.5 py-2 font-bold text-slate-800 hover:bg-slate-100 rounded flex items-center justify-between"
              >
                <span>Exportación</span>
                {exportExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {exportExpanded && (
                <div className="pl-2 mt-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDua(null);
                      navigateTo('dua-register');
                    }}
                    className={`w-full px-2.5 py-2 rounded text-left flex items-center gap-2 transition-colors ${
                      activeModule === 'dua-register'
                        ? 'bg-sky-50 text-[#0B3B60] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FilePlus2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Declaración Exportación</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('dua-search')}
                    className={`w-full px-2.5 py-2 rounded text-left flex items-center gap-2 transition-colors ${
                      activeModule === 'dua-search'
                        ? 'bg-sky-50 text-[#0B3B60] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Buscar Declaraciones</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('cargo-entry')}
                    className={`w-full px-2.5 py-2 rounded text-left flex items-center gap-2 transition-colors ${
                      activeModule === 'cargo-entry'
                        ? 'bg-sky-50 text-[#0B3B60] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Entrada de Carga (EGED)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('correction-register')}
                    className={`w-full px-2.5 py-2 rounded text-left flex items-center gap-2 transition-colors ${
                      activeModule === 'correction-register'
                        ? 'bg-sky-50 text-[#0B3B60] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FileEdit className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Solicitud de Corrección</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('correction-search')}
                    className={`w-full px-2.5 py-2 rounded text-left flex items-center gap-2 transition-colors ${
                      activeModule === 'correction-search'
                        ? 'bg-sky-50 text-[#0B3B60] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FolderSearch className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Buscar Correcciones</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-0.5">
              <div className="px-2.5 py-1 text-[11px] font-bold text-slate-500 uppercase">
                DGII & Seguimiento
              </div>
              <button
                type="button"
                onClick={() => navigateTo('dgii-bridge')}
                className={`w-full px-2.5 py-2 rounded text-left flex items-center gap-2 transition-colors ${
                  activeModule === 'dgii-bridge'
                    ? 'bg-emerald-50 text-[#15803D] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Cruce DGII (e-CF 46 / 607)</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('my-page')}
                className={`w-full px-2.5 py-2 rounded text-left flex items-center gap-2 transition-colors ${
                  activeModule === 'my-page'
                    ? 'bg-sky-50 text-[#0B3B60] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <UserCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Mi Página / Expediente</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('manual-guide')}
                className={`w-full px-2.5 py-2 rounded text-left flex items-center gap-2 transition-colors ${
                  activeModule === 'manual-guide'
                    ? 'bg-sky-50 text-[#0B3B60] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Manual Oficial DGA (PDF)</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 pb-16 min-w-0 max-w-[1440px]">
          {activeModule === 'dua-register' && (
            <DuaFormView
              key={editingDua ? editingDua.id : `new-${sessionUser.perfil}`}
              sessionUser={sessionUser}
              initialDua={editingDua}
              existingDuas={duas}
              onSaveTemporal={handleSaveTemporal}
              onPresentDua={handlePresentDua}
              onGoToList={() => navigateTo('dua-search')}
              onOpenPayment={(d) => setPaymentTargetDua(d)}
              onOpenPrint={(d) => setPrintTargetDua(d)}
              onOpenDgiiBridge={(d) => {
                setSelectedDuaId(d.id);
                navigateTo('dgii-bridge');
              }}
            />
          )}

          {activeModule === 'dua-search' && (
            <DuaSearchAndDetailView
              duas={duas}
              selectedDuaId={selectedDuaId}
              onSelectDua={(id) => setSelectedDuaId(id)}
              onCreateNew={() => {
                setEditingDua(null);
                navigateTo('dua-register');
              }}
              onEditTemporal={(d) => {
                setEditingDua(d);
                navigateTo('dua-register');
              }}
              onDeleteTemporal={(id) => {
                setDuas((prev) => prev.filter((d) => d.id !== id));
                setSelectedDuaId(null);
              }}
              onOpenPayment={(d) => setPaymentTargetDua(d)}
              onOpenPrint={(d) => setPrintTargetDua(d)}
              onSimulateOfficerAction={handleSimulateOfficerAction}
              onOpenCorrectionForDua={(d) => {
                setPreselectedCorrDuaNo(d.noDeclaracion);
                navigateTo('correction-register');
              }}
              onOpenDgiiBridge={(d) => {
                setSelectedDuaId(d.id);
                navigateTo('dgii-bridge');
              }}
            />
          )}

          {activeModule === 'cargo-entry' && (
            <CargoEntryView
              registros={cargaEntrada}
              onAdvanceStatus={handleAdvanceCargoStatus}
            />
          )}

          {(activeModule === 'correction-register' || activeModule === 'correction-search') && (
            <CorrectionRequestView
              mode={activeModule === 'correction-register' ? 'register' : 'search'}
              sessionUser={sessionUser}
              duas={duas}
              correcciones={correcciones}
              preselectedDuaNo={preselectedCorrDuaNo}
              onSwitchMode={(m) =>
                navigateTo(m === 'register' ? 'correction-register' : 'correction-search')
              }
              onSubmitCorrection={handleSubmitCorrection}
              onSimulateOfficerDecision={handleSimulateCorrectionDecision}
            />
          )}

          {activeModule === 'my-page' && (
            <MyPageView
              sessionUser={sessionUser}
              duas={duas}
              correcciones={correcciones}
              notifications={notifications}
              onOpenDuaDetail={(duaId) => {
                setSelectedDuaId(duaId);
                navigateTo('dua-search');
              }}
              onMarkAllRead={() =>
                setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })))
              }
            />
          )}

          {activeModule === 'dgii-bridge' && (
            <DgiiBridgeView
              duas={duas}
              activeDuaId={selectedDuaId}
              onSelectDua={(id) => setSelectedDuaId(id)}
            />
          )}

          {activeModule === 'manual-guide' && (
            <ManualGuideView
              onNavigateModule={navigateTo}
              onOpenViafirmaSim={() => setShowViafirmaLogin(true)}
            />
          )}
        </main>
      </div>

      {/* Payment & Printable Modals */}
      <PaymentModal
        dua={paymentTargetDua}
        onClose={() => setPaymentTargetDua(null)}
        onConfirmPayment={handleConfirmPayment}
      />

      <PrintableDuaModal
        dua={printTargetDua}
        onClose={() => setPrintTargetDua(null)}
      />

      {cornerSignature}
    </div>
  );
}
