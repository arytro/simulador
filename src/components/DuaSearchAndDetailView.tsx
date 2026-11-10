import React, { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Printer,
  CreditCard,
  Download,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  FileSpreadsheet,
  ArrowLeft,
} from 'lucide-react';
import { DeclaracionDUA, DuaStatus } from '../types/siga';
import { formatMoney, generateDuaXml } from '../utils/duaXml';

interface DuaSearchAndDetailViewProps {
  duas: DeclaracionDUA[];
  selectedDuaId: string | null;
  onSelectDua: (id: string | null) => void;
  onCreateNew: () => void;
  onEditTemporal: (dua: DeclaracionDUA) => void;
  onDeleteTemporal: (id: string) => void;
  onOpenPayment: (dua: DeclaracionDUA) => void;
  onOpenPrint: (dua: DeclaracionDUA) => void;
  onSimulateOfficerAction: (id: string, nextStatus: DuaStatus) => void;
  onOpenCorrectionForDua: (dua: DeclaracionDUA) => void;
  onOpenDgiiBridge: (dua: DeclaracionDUA) => void;
}

export const DuaSearchAndDetailView: React.FC<DuaSearchAndDetailViewProps> = ({
  duas,
  selectedDuaId,
  onSelectDua,
  onCreateNew,
  onEditTemporal,
  onDeleteTemporal,
  onOpenPayment,
  onOpenPrint,
  onSimulateOfficerAction,
  onOpenCorrectionForDua,
  onOpenDgiiBridge,
}) => {
  const [noDeclFilter, setNoDeclFilter] = useState('');
  const [adminFilter, setAdminFilter] = useState('');
  const [exportadorFilter, setExportadorFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<'ALL' | DuaStatus>('ALL');
  const [scFilter, setScFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return duas.filter((d) => {
      if (noDeclFilter && !d.noDeclaracion.toLowerCase().includes(noDeclFilter.toLowerCase())) return false;
      if (adminFilter && !d.adminCodigo.includes(adminFilter) && !d.adminNombre.toLowerCase().includes(adminFilter.toLowerCase())) return false;
      if (exportadorFilter && !d.exportadorNombre.toLowerCase().includes(exportadorFilter.toLowerCase()) && !d.exportadorDocNumero.includes(exportadorFilter)) return false;
      if (estadoFilter !== 'ALL' && d.estado !== estadoFilter) return false;
      if (scFilter !== 'ALL' && d.selectividad !== scFilter) return false;
      return true;
    });
  }, [duas, noDeclFilter, adminFilter, exportadorFilter, estadoFilter, scFilter]);

  const selectedDua = useMemo(
    () => duas.find((d) => d.id === selectedDuaId) || null,
    [duas, selectedDuaId]
  );

  const handleDownloadXml = (dua: DeclaracionDUA) => {
    const xml = generateDuaXml(dua);
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dua.noDeclaracion || 'DUA_SIGA'}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (selectedDua) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => onSelectDua(null)}
                className="text-[#0B3B60] hover:underline inline-flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver al listado [wcEC010102]
              </button>
              <span>·</span>
              <span className="font-mono font-semibold text-[#0B3B60]">[wcEC010103]</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 mt-0.5">
              Detalle Información Declaración de Exportación — <span className="font-mono">{selectedDua.noDeclaracion}</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedDua.estado === 'Temporal' && (
              <>
                <button
                  type="button"
                  onClick={() => onEditTemporal(selectedDua)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0B3B60] hover:bg-[#092e4b] rounded flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Modificar / Presentar
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTemporal(selectedDua.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-white border border-red-300 hover:bg-red-50 rounded flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Borrar
                </button>
              </>
            )}

            {selectedDua.estado !== 'Temporal' && !selectedDua.tasaPagada && (
              <button
                type="button"
                onClick={() => onOpenPayment(selectedDua)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Pagar Tasa DUA (RD$300)
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenPrint(selectedDua)}
              disabled={!selectedDua.tasaPagada}
              title={selectedDua.tasaPagada ? 'Imprimir Declaración' : 'Debe pagar la tasa de RD$300.00 para imprimir'}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-45 rounded flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>

            <button
              type="button"
              onClick={() => handleDownloadXml(selectedDua)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Firma / Descarga XML
            </button>

            {selectedDua.estado !== 'Temporal' && (
              <button
                type="button"
                onClick={() => onOpenCorrectionForDua(selectedDua)}
                className="px-3 py-1.5 text-xs font-medium text-[#0B3B60] bg-sky-50 border border-sky-200 hover:bg-sky-100 rounded"
              >
                Solicitar Corrección
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenDgiiBridge(selectedDua)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Cruce DGII (e-CF 46 / 607)
            </button>
          </div>
        </div>

        {/* Simulated Customs Officer Transition Controls (Cap. 11 - Page 30) */}
        {selectedDua.estado !== 'Temporal' && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-semibold text-slate-900">
                Simulador de Flujo Oficial DGA (Cap. 11 · Estados en SIGA)
              </div>
              <div className="text-slate-600 mt-0.5">
                Estado actual: <strong>{selectedDua.estado}</strong> · Canal S/C: <strong>{selectedDua.selectividad}</strong> · Solicitud Carga: <span className="font-mono">{selectedDua.noSolicitudEntradaCarga || 'N/A'}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onSimulateOfficerAction(selectedDua.id, 'Inspeccionando')}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded font-medium"
              >
                Asignar Inspección Física
              </button>
              <button
                type="button"
                onClick={() => onSimulateOfficerAction(selectedDua.id, 'Despacho Aprobado')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Aprobar Despacho (Subadm. Técnica)
              </button>
              <button
                type="button"
                onClick={() => onSimulateOfficerAction(selectedDua.id, 'Rechazado')}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-semibold flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                Rechazar
              </button>
            </div>
          </div>
        )}

        {/* Detail Summary Panels */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="space-y-1.5">
            <h3 className="font-bold text-[#0B3B60] uppercase border-b border-slate-200 pb-1">Datos Generales</h3>
            <div><span className="text-slate-500">Administración:</span> <span className="font-mono">[{selectedDua.adminCodigo}]</span> {selectedDua.adminNombre}</div>
            <div><span className="text-slate-500">Puerto Salida:</span> <span className="font-mono">[{selectedDua.puertoSalidaCodigo}]</span> {selectedDua.puertoSalidaNombre}</div>
            <div><span className="text-slate-500">País Destino:</span> <span className="font-mono">[{selectedDua.paisDestinoCodigo}]</span> {selectedDua.paisDestinoNombre}</div>
            <div><span className="text-slate-500">Doc. Embarque:</span> <span className="font-mono font-semibold">{selectedDua.docEmbarque || '—'}</span></div>
            <div><span className="text-slate-500">Transportista:</span> {selectedDua.empresaTransportistaNombre} ({selectedDua.noViajeVuelo})</div>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-[#0B3B60] uppercase border-b border-slate-200 pb-1">Exportador & Comprador</h3>
            <div className="font-semibold text-slate-900">{selectedDua.exportadorNombre}</div>
            <div>{selectedDua.exportadorDocTipo}: <span className="font-mono">{selectedDua.exportadorDocNumero}</span></div>
            <div className="text-slate-600">{selectedDua.exportadorDireccion}</div>
            <div className="pt-2 font-semibold text-slate-900">Comprador: {selectedDua.compradorNombre}</div>
            <div>{selectedDua.compradorDocTipo}: <span className="font-mono">{selectedDua.compradorDocNumero}</span> · {selectedDua.compradorNacionalidadNombre}</div>
          </div>

          <div className="space-y-1.5 font-mono tabular-nums">
            <h3 className="font-sans font-bold text-[#0B3B60] uppercase border-b border-slate-200 pb-1">Valores, Pesos y Tasa DUA</h3>
            <div className="flex justify-between"><span className="text-slate-500">FOB Total (US$):</span><span className="font-bold">${formatMoney(selectedDua.valorFobTotal)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">CIF Total (US$):</span><span>${formatMoney(selectedDua.valorCifTotalUsd)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">CIF Total (RD$):</span><span>RD$ {formatMoney(selectedDua.valorCifTotalRd)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Peso Bruto / Neto:</span><span>{formatMoney(selectedDua.pesoBrutoKg)} / {formatMoney(selectedDua.pesoNetoKg)} KG</span></div>
            <div className="flex justify-between pt-1 border-t border-slate-100">
              <span className="text-slate-500">Tasa Formulario DUA:</span>
              <span className={selectedDua.tasaPagada ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                {selectedDua.tasaPagada ? `PAGADA (${selectedDua.referenciaPago})` : 'PENDIENTE RD$ 300.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-xs font-bold text-[#0B3B60] uppercase">
            Partidas Arancelarias ({selectedDua.detalles.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#65A30D] text-white">
                <tr>
                  <th className="px-3 py-2">Sec.</th>
                  <th className="px-3 py-2">Código S.A.</th>
                  <th className="px-3 py-2">Producto y Descripción</th>
                  <th className="px-3 py-2 text-right">Cantidad</th>
                  <th className="px-3 py-2 text-right">FOB Unit</th>
                  <th className="px-3 py-2 text-right">FOB Total (US$)</th>
                  <th className="px-3 py-2 text-right">Peso (Kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedDua.detalles.map((d) => (
                  <tr key={d.id}>
                    <td className="px-3 py-2 font-mono">{d.sec}</td>
                    <td className="px-3 py-2 font-mono font-semibold text-[#0B3B60]">{d.codigoSA}</td>
                    <td className="px-3 py-2">{d.productoNombre} — <span className="text-slate-500">{d.descripcionMercancia}</span></td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">{formatMoney(d.cantidad)} {d.unidad}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">${formatMoney(d.fobUnitario, 4)}</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold tabular-nums">${formatMoney(d.cantidad * d.fobUnitario)}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">{formatMoney(d.pesoKg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono font-semibold text-[#0B3B60]">[wcEC010102]</div>
          <h1 className="text-base font-bold text-slate-900">Buscar Información Declaración de Exportación</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCreateNew}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div>
          <label className="block font-medium text-slate-700 mb-1">No. de Declaración</label>
          <input
            type="text"
            value={noDeclFilter}
            onChange={(e) => setNoDeclFilter(e.target.value)}
            placeholder="Ej. 10030-EC01..."
            className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Administración</label>
          <input
            type="text"
            value={adminFilter}
            onChange={(e) => setAdminFilter(e.target.value)}
            placeholder="Código o nombre..."
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Exportador / RNC</label>
          <input
            type="text"
            value={exportadorFilter}
            onChange={(e) => setExportadorFilter(e.target.value)}
            placeholder="Empresa o RNC..."
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">S/C (Selectividad)</label>
          <select
            value={scFilter}
            onChange={(e) => setScFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
          >
            <option value="ALL">=== Seleccione ===</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Verde (Documental)">Verde (Documental)</option>
            <option value="Amarillo (Revisión)">Amarillo (Revisión)</option>
            <option value="Inspección física">Inspección física</option>
          </select>
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Estado</label>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value as 'ALL' | DuaStatus)}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
          >
            <option value="ALL">=== Seleccione ===</option>
            <option value="Temporal">Temporal</option>
            <option value="Registrado/Aceptado">Registrado/Aceptado</option>
            <option value="Inspeccionando">Inspeccionando</option>
            <option value="Despacho Aprobado">Despacho Aprobado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#65A30D] text-white">
              <tr>
                <th className="px-3 py-2.5">Sec.</th>
                <th className="px-3 py-2.5">No. de Declaración</th>
                <th className="px-3 py-2.5">Fecha</th>
                <th className="px-3 py-2.5">Administración</th>
                <th className="px-3 py-2.5">Régimen</th>
                <th className="px-3 py-2.5">Exportador</th>
                <th className="px-3 py-2.5">S/C</th>
                <th className="px-3 py-2.5">Estado</th>
                <th className="px-3 py-2.5 text-right">FOB (US$)</th>
                <th className="px-3 py-2.5 text-right">Ver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                    Ningunos Datos de Resultado con los criterios actuales.
                  </td>
                </tr>
              ) : (
                filtered.map((d, idx) => (
                  <tr
                    key={d.id}
                    onClick={() => onSelectDua(d.id)}
                    className="hover:bg-sky-50/70 cursor-pointer transition-colors"
                  >
                    <td className="px-3 py-2.5 font-mono tabular-nums">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60] tabular-nums whitespace-nowrap">{d.noDeclaracion}</td>
                    <td className="px-3 py-2.5 font-mono tabular-nums">{d.fechaDeclaracion}</td>
                    <td className="px-3 py-2.5 text-slate-800">{d.adminNombre}</td>
                    <td className="px-3 py-2.5 text-slate-700">{d.regimenNombre}</td>
                    <td className="px-3 py-2.5 text-slate-900 font-medium">{d.exportadorNombre}</td>
                    <td className="px-3 py-2.5 text-slate-700">{d.selectividad}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-900">{d.estado}</td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold tabular-nums">${formatMoney(d.valorFobTotal)}</td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDua(d.id);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[#0B3B60] hover:bg-sky-100 rounded font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detalle
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Pulse sobre cualquier resultado para abrir el Detalle [wcEC010103], simular despacho o pagar tasa DUA.</span>
          <span className="font-mono">Total: {filtered.length}</span>
        </div>
      </div>
    </div>
  );
};
