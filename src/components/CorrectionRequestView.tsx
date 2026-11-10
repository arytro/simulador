import React, { useMemo, useRef, useState } from 'react';
import {
  Search,
  Send,
  List,
  Plus,
  Paperclip,
  Eye,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';
import {
  CorrectionStatus,
  DeclaracionDUA,
  SessionUser,
  SolicitudCorreccion,
} from '../types/siga';
import { formatMoney, generateCorrectionNumber } from '../utils/duaXml';
import { LookupModal } from './LookupModal';

interface CorrectionRequestViewProps {
  mode: 'register' | 'search';
  sessionUser: SessionUser;
  duas: DeclaracionDUA[];
  correcciones: SolicitudCorreccion[];
  preselectedDuaNo?: string | null;
  onSwitchMode: (mode: 'register' | 'search') => void;
  onSubmitCorrection: (corr: Omit<SolicitudCorreccion, 'id' | 'sec' | 'noSolicitudCorreccion' | 'fechaCorreccion' | 'fechaVencimiento' | 'fechaTermino' | 'estado'>) => SolicitudCorreccion;
  onSimulateOfficerDecision: (id: string, status: CorrectionStatus) => void;
}

export const CorrectionRequestView: React.FC<CorrectionRequestViewProps> = ({
  mode,
  sessionUser,
  duas,
  correcciones,
  preselectedDuaNo,
  onSwitchMode,
  onSubmitCorrection,
  onSimulateOfficerDecision,
}) => {
  const initialRefDua = useMemo(
    () => duas.find((d) => d.noDeclaracion === preselectedDuaNo) || duas.find((d) => d.estado !== 'Temporal') || null,
    [duas, preselectedDuaNo]
  );

  const [noFormRef, setNoFormRef] = useState(initialRefDua?.noDeclaracion || '');
  const [adminCodigo, setAdminCodigo] = useState(initialRefDua?.adminCodigo || '10030');
  const [adminNombre, setAdminNombre] = useState(initialRefDua?.adminNombre || 'ADMINISTRACION HAINA ORIENTAL');
  const [depositoCodigo, setDepositoCodigo] = useState(initialRefDua?.depositoOrigenCodigo || 'DOHAI');
  const [depositoNombre, setDepositoNombre] = useState(initialRefDua?.depositoOrigenNombre || 'RIO HAINA');
  const [detalleCorreccion, setDetalleCorreccion] = useState('');
  const [archivoNombre, setArchivoNombre] = useState('');
  const [showRefLookup, setShowRefLookup] = useState(false);
  const [showRefDetail, setShowRefDetail] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successDialog, setSuccessDialog] = useState<SolicitudCorreccion | null>(null);

  // Search filters
  const [searchAdmin, setSearchAdmin] = useState('');
  const [searchEstado, setSearchEstado] = useState<'ALL' | CorrectionStatus>('ALL');
  const [searchDoc, setSearchDoc] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const referencedDua = useMemo(
    () => duas.find((d) => d.noDeclaracion === noFormRef) || null,
    [duas, noFormRef]
  );

  const filteredCorrecciones = useMemo(() => {
    return correcciones.filter((c) => {
      if (searchAdmin && !c.adminCodigo.includes(searchAdmin) && !c.adminNombre.toLowerCase().includes(searchAdmin.toLowerCase())) return false;
      if (searchEstado !== 'ALL' && c.estado !== searchEstado) return false;
      if (searchDoc && !c.noSolicitudCorreccion.toLowerCase().includes(searchDoc.toLowerCase()) && !c.noFormularioReferencia.toLowerCase().includes(searchDoc.toLowerCase())) return false;
      return true;
    });
  }, [correcciones, searchAdmin, searchEstado, searchDoc]);

  const handleSelectRefDua = (item: unknown) => {
    const dua = item as DeclaracionDUA;
    setNoFormRef(dua.noDeclaracion);
    setAdminCodigo(dua.adminCodigo);
    setAdminNombre(dua.adminNombre);
    setDepositoCodigo(dua.depositoOrigenCodigo);
    setDepositoNombre(dua.depositoOrigenNombre);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noFormRef.trim() || !detalleCorreccion.trim()) {
      setErrorMsg('Debe seleccionar el No. Formulario de Referencia (*) y digitar el Detalle de Corrección (*).');
      return;
    }
    setErrorMsg('');
    const created = onSubmitCorrection({
      tipoSolicitud: 'Solicitud de Corrección para Declaración de Exportación',
      noFormularioReferencia: noFormRef,
      tipoFormularioReferencia: 'Declaración de Exportación',
      adminCodigo,
      adminNombre,
      depositoDestinoCodigo: depositoCodigo,
      depositoDestinoNombre: depositoNombre,
      detalleCorreccion,
      archivoNombre: archivoNombre || undefined,
      agenteEmpresa: sessionUser.perfil === 'AGENTE DE ADUANAS' ? sessionUser.nombreEmpresa : undefined,
      agenteNombre: sessionUser.perfil === 'AGENTE DE ADUANAS' ? sessionUser.nombre : undefined,
      agenteLicencia: sessionUser.perfil === 'AGENTE DE ADUANAS' ? sessionUser.licenciaAgente : undefined,
    });
    setDetalleCorreccion('');
    setArchivoNombre('');
    setSuccessDialog(created);
  };

  if (mode === 'search') {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-semibold text-[#0B3B60]">[wcIC011402]</div>
            <h1 className="text-base font-bold text-slate-900">Buscar Información Solicitud de Corrección</h1>
          </div>
          <button
            type="button"
            onClick={() => onSwitchMode('register')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Administración</label>
            <input
              type="text"
              value={searchAdmin}
              onChange={(e) => setSearchAdmin(e.target.value)}
              placeholder="Ej. 10030 o Haina..."
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">No. de Solicitud / DUA</label>
            <input
              type="text"
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
              placeholder="10030-EC02-..."
              className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Estado</label>
            <select
              value={searchEstado}
              onChange={(e) => setSearchEstado(e.target.value as 'ALL' | CorrectionStatus)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
            >
              <option value="ALL">=== Todo ===</option>
              <option value="Registrado/Aceptado">Registrado/Aceptado</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Rechazada">Rechazada</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#65A30D] text-white">
                <tr>
                  <th className="px-3 py-2.5">Sec.</th>
                  <th className="px-3 py-2.5">Fecha Corrección</th>
                  <th className="px-3 py-2.5">No. Solicitud Corrección</th>
                  <th className="px-3 py-2.5">DUA Referencia</th>
                  <th className="px-3 py-2.5">Administración</th>
                  <th className="px-3 py-2.5">Detalle</th>
                  <th className="px-3 py-2.5">Estado</th>
                  <th className="px-3 py-2.5 text-right">Simular Oficial DGA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCorrecciones.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      No hay solicitudes de corrección registradas.
                    </td>
                  </tr>
                ) : (
                  filteredCorrecciones.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-mono">{c.sec}</td>
                      <td className="px-3 py-2.5 font-mono tabular-nums">{c.fechaCorreccion}</td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60] whitespace-nowrap">{c.noSolicitudCorreccion}</td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap">{c.noFormularioReferencia}</td>
                      <td className="px-3 py-2.5">{c.adminNombre}</td>
                      <td className="px-3 py-2.5 max-w-xs truncate" title={c.detalleCorreccion}>{c.detalleCorreccion}</td>
                      <td className="px-3 py-2.5 font-semibold">{c.estado}</td>
                      <td className="px-3 py-2.5 text-right whitespace-nowrap space-x-1">
                        {c.estado === 'Registrado/Aceptado' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onSimulateOfficerDecision(c.id, 'Aprobada')}
                              className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Aprobar
                            </button>
                            <button
                              type="button"
                              onClick={() => onSimulateOfficerDecision(c.id, 'Rechazada')}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] inline-flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              Rechazar
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-500 font-mono text-[11px]">{c.fechaTermino || 'Procesada'}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono font-semibold text-[#0B3B60]">[wcIC011401]</div>
          <h1 className="text-base font-bold text-slate-900">Registrar Información Solicitud de Corrección</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Presentar
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode('search')}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded flex items-center gap-1.5"
          >
            <List className="w-3.5 h-3.5" />
            Listado
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
          {errorMsg}
        </div>
      )}

      {/* Información Básica */}
      <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-xs font-bold text-[#0B3B60] uppercase">
          Información Básica
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">No. Solicitud Corrección</label>
            <input
              type="text"
              readOnly
              value={`Se genera al presentar (${generateCorrectionNumber(adminCodigo, correcciones.map((c) => c.noSolicitudCorreccion))})`}
              className="col-span-8 px-2.5 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded text-slate-500"
            />
          </div>

          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">
              <span className="text-red-600 font-bold mr-1">*</span>Tipo de Solicitud
            </label>
            <input
              type="text"
              readOnly
              value="Solicitud de Corrección para Declaración de Exportación"
              className="col-span-8 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800"
            />
          </div>

          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">
              <span className="text-red-600 font-bold mr-1">*</span>No. Formulario Referencia
            </label>
            <div className="col-span-8 flex items-center gap-1.5">
              <input
                type="text"
                value={noFormRef}
                readOnly
                placeholder="Seleccione DUA presentada..."
                className="flex-1 px-2.5 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowRefLookup(true)}
                className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60]"
                title="Buscar Formulario de Referencia"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={!referencedDua}
                onClick={() => setShowRefDetail(true)}
                className="px-2.5 py-1.5 bg-[#0B3B60] hover:bg-[#092e4b] disabled:opacity-40 text-white rounded font-medium flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                Detalle
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">
              <span className="text-red-600 font-bold mr-1">*</span>Administración
            </label>
            <div className="col-span-8 flex gap-1.5">
              <input type="text" value={adminCodigo} readOnly className="w-20 px-2 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded" />
              <input type="text" value={adminNombre} readOnly className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded truncate" />
            </div>
          </div>
        </div>
      </section>

      {/* Información de Corrección */}
      <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-xs font-bold text-[#0B3B60] uppercase">
          Información de Corrección
        </div>
        <div className="p-4 space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              <span className="text-red-600 font-bold mr-1">*</span>Detalle de Corrección (Motivo y campos a modificar)
            </label>
            <textarea
              rows={4}
              value={detalleCorreccion}
              onChange={(e) => setDetalleCorreccion(e.target.value)}
              placeholder="Ej. Solicitud de corrección de peso bruto o cantidad según factura corregida..."
              className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-slate-700">Archivo Adjuntado:</span>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setArchivoNombre(f.name);
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-700 flex items-center gap-1.5"
            >
              <Paperclip className="w-3.5 h-3.5" />
              {archivoNombre || 'Elegir Archivo de Soporte'}
            </button>
          </div>
        </div>
      </section>

      <LookupModal
        kind={showRefLookup ? 'formulario-referencia' : null}
        onClose={() => setShowRefLookup(false)}
        onSelect={handleSelectRefDua}
        duas={duas}
      />

      {/* Preview DUA Detail Modal (Page 27) */}
      {showRefDetail && referencedDua && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="bg-[#0B3B60] text-white px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-semibold">
                [wcEC010103] Detalle Información Declaración — {referencedDua.noDeclaracion}
              </span>
              <button type="button" onClick={() => setShowRefDetail(false)} className="p-1 hover:bg-white/15 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 text-xs space-y-3">
              <div className="grid grid-cols-2 gap-3 border-b border-slate-200 pb-3">
                <div><span className="text-slate-500">Exportador:</span> <strong>{referencedDua.exportadorNombre}</strong></div>
                <div><span className="text-slate-500">RNC:</span> <span className="font-mono">{referencedDua.exportadorDocNumero}</span></div>
                <div><span className="text-slate-500">Administración:</span> {referencedDua.adminNombre}</div>
                <div><span className="text-slate-500">Estado Actual:</span> <strong>{referencedDua.estado}</strong></div>
                <div><span className="text-slate-500">FOB Total:</span> <span className="font-mono">${formatMoney(referencedDua.valorFobTotal)}</span></div>
                <div><span className="text-slate-500">Peso Bruto / Neto:</span> <span className="font-mono">{referencedDua.pesoBrutoKg} / {referencedDua.pesoNetoKg} KG</span></div>
              </div>
              <div className="text-slate-600">
                Documento de Embarque: <span className="font-mono font-semibold text-slate-800">{referencedDua.docEmbarque || 'N/A'}</span> · País Destino: {referencedDua.paisDestinoNombre}
              </div>
            </div>
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button type="button" onClick={() => setShowRefDetail(false)} className="px-4 py-1.5 bg-[#0B3B60] text-white text-xs font-semibold rounded">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog (Page 28) */}
      {successDialog && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-[#0B3B60] text-white px-4 py-3 text-sm font-semibold">
              Información — Los datos fueron procesados con éxito
            </div>
            <div className="p-5 flex items-start gap-4 text-xs text-slate-700">
              <div className="w-9 h-9 rounded-full bg-sky-100 text-[#0B3B60] flex items-center justify-center font-bold text-base shrink-0">
                i
              </div>
              <div>
                Se registró su solicitud de corrección <strong className="font-mono">{successDialog.noSolicitudCorreccion}</strong> vinculada al DUA <strong className="font-mono">{successDialog.noFormularioReferencia}</strong>. Puede simular su aprobación por el oficial en el Listado.
              </div>
            </div>
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSuccessDialog(null);
                  onSwitchMode('search');
                }}
                className="px-4 py-1.5 bg-[#0B3B60] text-white text-xs font-semibold rounded"
              >
                OK (Ir al Listado)
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
