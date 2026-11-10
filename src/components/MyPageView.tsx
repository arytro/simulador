import React, { useMemo, useState } from 'react';
import { Bell, Calendar, FileCheck2, Eye, CheckCheck } from 'lucide-react';
import {
  DeclaracionDUA,
  NotificationItem,
  SessionUser,
  SolicitudCorreccion,
} from '../types/siga';

interface MyPageViewProps {
  sessionUser: SessionUser;
  duas: DeclaracionDUA[];
  correcciones: SolicitudCorreccion[];
  notifications: NotificationItem[];
  onOpenDuaDetail: (duaId: string) => void;
  onMarkAllRead: () => void;
}

export const MyPageView: React.FC<MyPageViewProps> = ({
  sessionUser,
  duas,
  correcciones,
  notifications,
  onOpenDuaDetail,
  onMarkAllRead,
}) => {
  const [tab, setTab] = useState<'listado' | 'notificaciones' | 'calendario' | 'perfil'>('listado');
  const [actividadFilter, setActividadFilter] = useState<'TODAS' | 'Despacho de Exportación' | 'Solicitud de Corrección'>('TODAS');
  const [noDocFilter, setNoDocFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('ALL');

  const unifiedDocs = useMemo(() => {
    const duaRows = duas.map((d) => ({
      id: d.id,
      kind: 'DUA' as const,
      actividad: 'Despacho de Exportación',
      clase: 'Declaración de Exportación',
      noDocumento: d.noDeclaracion,
      estado: d.estado,
      fechaRegistro: d.fechaDeclaracion,
      detalle: `${d.exportadorNombre} · ${d.adminNombre}`,
    }));
    const corrRows = correcciones.map((c) => ({
      id: c.id,
      kind: 'CORR' as const,
      actividad: 'Solicitud de Corrección',
      clase: c.tipoSolicitud,
      noDocumento: c.noSolicitudCorreccion,
      estado: c.estado,
      fechaRegistro: c.fechaCorreccion,
      detalle: `Ref: ${c.noFormularioReferencia}`,
    }));
    return [...duaRows, ...corrRows].filter((row) => {
      if (actividadFilter !== 'TODAS' && row.actividad !== actividadFilter) return false;
      if (noDocFilter && !row.noDocumento.toLowerCase().includes(noDocFilter.toLowerCase())) return false;
      if (estadoFilter !== 'ALL' && row.estado !== estadoFilter) return false;
      return true;
    });
  }, [duas, correcciones, actividadFilter, noDocFilter, estadoFilter]);

  const inspectionCalendar = useMemo(
    () => duas.filter((d) => d.estado === 'Inspeccionando' || d.selectividad === 'Inspección física'),
    [duas]
  );

  const unreadCount = notifications.filter((n) => !n.leida).length;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono font-semibold text-[#0B3B60]">Cap. 12 · Mi Página (Pág. 31)</div>
          <h1 className="text-base font-bold text-slate-900">
            Seguimiento al Expediente — Bandeja de Documento y Notificaciones
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setTab('listado')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              tab === 'listado' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Listado de Doc.
          </button>
          <button
            type="button"
            onClick={() => setTab('notificaciones')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              tab === 'notificaciones' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Caja de Notificación ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setTab('calendario')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              tab === 'calendario' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Calendario de Inspección ({inspectionCalendar.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('perfil')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              tab === 'perfil' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Perfil de Usuario
          </button>
        </div>
      </div>

      {tab === 'listado' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">* Actividad</label>
              <select
                value={actividadFilter}
                onChange={(e) => setActividadFilter(e.target.value as typeof actividadFilter)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
              >
                <option value="TODAS">=== Todas ===</option>
                <option value="Despacho de Exportación">Despacho de Exportación</option>
                <option value="Solicitud de Corrección">Solicitud de Corrección</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">No. del Documento</label>
              <input
                type="text"
                value={noDocFilter}
                onChange={(e) => setNoDocFilter(e.target.value)}
                placeholder="Ej. 10030-EC01..."
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Estado</label>
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
              >
                <option value="ALL">=== Todo ===</option>
                <option value="Temporal">Temporal</option>
                <option value="Registrado/Aceptado">Registrado/Aceptado</option>
                <option value="Inspeccionando">Inspeccionando</option>
                <option value="Despacho Aprobado">Despacho Aprobado</option>
                <option value="Rechazado">Rechazado</option>
                <option value="Aprobada">Aprobada (Corrección)</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#65A30D] text-white">
                <tr>
                  <th className="px-3 py-2.5">Sec.</th>
                  <th className="px-3 py-2.5">Actividad</th>
                  <th className="px-3 py-2.5">Clase de Documento</th>
                  <th className="px-3 py-2.5">No. del Documento</th>
                  <th className="px-3 py-2.5">Estado</th>
                  <th className="px-3 py-2.5">Fecha de Registro</th>
                  <th className="px-3 py-2.5 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {unifiedDocs.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-mono">{idx + 1}</td>
                    <td className="px-3 py-2.5">{row.actividad}</td>
                    <td className="px-3 py-2.5">{row.clase}</td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60]">{row.noDocumento}</td>
                    <td className="px-3 py-2.5 font-semibold">{row.estado}</td>
                    <td className="px-3 py-2.5 font-mono tabular-nums">{row.fechaRegistro}</td>
                    <td className="px-3 py-2.5 text-right">
                      {row.kind === 'DUA' ? (
                        <button
                          type="button"
                          onClick={() => onOpenDuaDetail(row.id)}
                          className="inline-flex items-center gap-1 text-[#0B3B60] hover:underline font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver Expediente
                        </button>
                      ) : (
                        <span className="text-slate-500">{row.detalle}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'notificaciones' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#0B3B60] uppercase flex items-center gap-1.5">
              <Bell className="w-4 h-4" />
              Caja de Notificación SIGA
            </h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-xs font-medium text-[#0B3B60] hover:underline inline-flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar todas como leídas
              </button>
            )}
          </div>
          <div className="divide-y divide-slate-200">
            {notifications.map((n) => (
              <div key={n.id} className={`p-4 text-xs ${n.leida ? 'bg-white' : 'bg-sky-50/50'}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900">{n.titulo}</span>
                  <span className="font-mono text-slate-500 tabular-nums">{n.fecha}</span>
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed">{n.mensaje}</p>
                <div className="mt-1.5 font-mono text-[11px] text-[#0B3B60]">Ref: {n.documentoRef}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'calendario' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2 text-xs font-bold text-[#0B3B60] uppercase">
            <Calendar className="w-4 h-4" />
            Calendario de Inspección Aduanera
          </div>
          <div className="divide-y divide-slate-200">
            {inspectionCalendar.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No hay inspecciones físicas programadas en este momento.
              </div>
            ) : (
              inspectionCalendar.map((d) => (
                <div key={d.id} className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-mono font-semibold text-[#0B3B60]">{d.noDeclaracion}</div>
                    <div className="text-slate-700 mt-0.5">
                      {d.adminNombre} · {d.exportadorNombre}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-slate-700">{d.fechaInspeccion || 'Por asignar horario'}</span>
                    <button
                      type="button"
                      onClick={() => onOpenDuaDetail(d.id)}
                      className="px-3 py-1.5 bg-[#0B3B60] text-white rounded font-medium"
                    >
                      Abrir Expediente
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'perfil' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 text-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0B3B60]">
            <FileCheck2 className="w-4 h-4" />
            Perfil Certificado Digital Activo
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div><span className="text-slate-500 block">Usuario Certificado</span><strong className="text-slate-900">{sessionUser.nombre}</strong></div>
            <div><span className="text-slate-500 block">Cédula</span><span className="font-mono font-semibold">{sessionUser.cedula}</span></div>
            <div><span className="text-slate-500 block">Perfil Aduanero Activo</span><strong className="text-[#0B3B60]">{sessionUser.perfil}</strong></div>
            <div><span className="text-slate-500 block">Empresa / RNC</span><span className="font-semibold">{sessionUser.nombreEmpresa}</span> (<span className="font-mono">{sessionUser.rncEmpresa}</span>)</div>
            <div><span className="text-slate-500 block">Dirección</span><span>{sessionUser.direccionEmpresa}</span></div>
            <div><span className="text-slate-500 block">Contacto</span><span>{sessionUser.telefonoEmpresa} · {sessionUser.emailEmpresa}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
