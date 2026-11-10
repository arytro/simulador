import React from 'react';
import { BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { ActiveModule } from '../types/siga';

interface ManualGuideViewProps {
  onNavigateModule: (mod: ActiveModule) => void;
  onOpenViafirmaSim: () => void;
}

const CHAPTERS: {
  num: string;
  title: string;
  pages: string;
  summary: string;
  actionLabel: string;
  onAction: 'login' | ActiveModule;
}[] = [
  {
    num: '01–02',
    title: 'Iconografía e Introducción SIGA',
    pages: 'Págs. 3–5',
    summary: 'Botones estándar (lupa, limpiar, calendario, Guardar Temporal vs Presentar Definitiva, Adjuntar y campos obligatorios *).',
    actionLabel: 'Ir al Formulario DUA',
    onAction: 'dua-register',
  },
  {
    num: '03',
    title: 'Entrar al Portal SIGA DGA (Viafirma Fortress)',
    pages: 'Págs. 6–9',
    summary: 'Ingreso por www.aduanas.gob.do, Certificado Digital por cédula, autorización SIGA OTP con PIN y selección de Perfil Aduanero.',
    actionLabel: 'Probar Login Viafirma',
    onAction: 'login',
  },
  {
    num: '04–05',
    title: 'Acceso al Formulario [wcEC010101] y Carga XML',
    pages: 'Págs. 10–13',
    summary: 'Uso de Adjuntar > Load From File (XML) para autocompletar el DUA desde su sistema ERP o plantilla XML.',
    actionLabel: 'Abrir DUA / Cargar XML',
    onAction: 'dua-register',
  },
  {
    num: '06',
    title: 'Registrar Información Declaración de Exportación',
    pages: 'Págs. 14–22',
    summary: 'Captura de Administración (10030, 10150, etc.), Exportador, Comprador, Régimen (16, 11, etc.), Partidas S.A., Contenedores, Documentos y Pago RD$300.',
    actionLabel: 'Practicar Llenado DUA',
    onAction: 'dua-register',
  },
  {
    num: '07',
    title: 'Consulta de Entrada de la Carga (EGED)',
    pages: 'Pág. 23',
    summary: 'Seguimiento automático del número EGED-YYMM-XXXXXX generado al presentar el DUA para el ingreso al puerto.',
    actionLabel: 'Ver Entrada de Carga',
    onAction: 'cargo-entry',
  },
  {
    num: '08–11',
    title: 'Buscar DUA, Solicitud de Corrección y Estados',
    pages: 'Págs. 24–30',
    summary: 'Búsqueda [wcEC010102], Detalle [wcEC010103], Solicitud de Corrección [wcIC011401] (EC02) y estados (Registrado/Aceptado, Despacho Aprobado, Rechazado).',
    actionLabel: 'Solicitudes de Corrección',
    onAction: 'correction-register',
  },
  {
    num: '12',
    title: 'Seguimiento en Mi Página y Cruce DGII',
    pages: 'Pág. 31 + DGII',
    summary: 'Listado de Documentos, Caja de Notificaciones, Calendario de Inspección y conciliación fiscal con e-CF 46 / NCF 16 / Formato 607 / IT-1.',
    actionLabel: 'Abrir Cruce DGII ↔ DUA',
    onAction: 'dgii-bridge',
  },
];

export const ManualGuideView: React.FC<ManualGuideViewProps> = ({
  onNavigateModule,
  onOpenViafirmaSim,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono font-semibold text-[#0B3B60]">
            Documentación Oficial DGA SIGARD (Septiembre 2022)
          </div>
          <h1 className="text-base font-bold text-slate-900 mt-0.5">
            Guía Interactiva del Manual Declaración de Exportación & Visor PDF
          </h1>
        </div>
        <a
          href="/assets/aistudio/manual-declaracio-n-de-exportacio-n_0f20d6e7.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0B3B60] hover:bg-[#092e4b] rounded inline-flex items-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Abrir PDF en Pestaña Nueva
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Chapter quick-launch index */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-100 text-xs font-bold text-[#0B3B60] uppercase flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Mapa Práctico del Manual (12 Capítulos)
          </div>
          {CHAPTERS.map((ch) => (
            <div key={ch.num} className="p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-900">
                  {ch.num}. {ch.title}
                </span>
                <span className="font-mono text-[11px] text-slate-500">{ch.pages}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{ch.summary}</p>
              <button
                type="button"
                onClick={() =>
                  ch.onAction === 'login' ? onOpenViafirmaSim() : onNavigateModule(ch.onAction)
                }
                className="inline-flex items-center gap-1 text-[#0B3B60] font-semibold hover:underline pt-0.5"
              >
                {ch.actionLabel}
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Right: Embedded PDF */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col min-h-[640px]">
          <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 text-xs font-bold text-[#0B3B60] uppercase">
            Manual Oficial Adjunto (32 Páginas)
          </div>
          <iframe
            src="/assets/aistudio/manual-declaracio-n-de-exportacio-n_0f20d6e7.pdf"
            title="Manual Declaración de Exportación DGA SIGA"
            className="w-full flex-1 min-h-[600px] border-0"
          />
        </div>
      </div>
    </div>
  );
};
