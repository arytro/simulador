import React, { useMemo, useState } from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { CargaEntradaRegistro, CargoEntryStatus } from '../types/siga';

interface CargoEntryViewProps {
  registros: CargaEntradaRegistro[];
  onAdvanceStatus: (id: string, nextStatus: CargoEntryStatus) => void;
}

export const CargoEntryView: React.FC<CargoEntryViewProps> = ({ registros, onAdvanceStatus }) => {
  const [adminFilter, setAdminFilter] = useState('');
  const [noSolFilter, setNoSolFilter] = useState('');
  const [noDeclFilter, setNoDeclFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<'ALL' | CargoEntryStatus>('ALL');

  const filtered = useMemo(() => {
    return registros.filter((r) => {
      if (adminFilter && !r.aduanaSalidaCodigo.includes(adminFilter) && !r.aduanaSalidaNombre.toLowerCase().includes(adminFilter.toLowerCase())) return false;
      if (noSolFilter && !r.noSolicitud.toLowerCase().includes(noSolFilter.toLowerCase())) return false;
      if (noDeclFilter && !r.noDeclaracion.toLowerCase().includes(noDeclFilter.toLowerCase())) return false;
      if (estadoFilter !== 'ALL' && r.estadoSolicitud !== estadoFilter) return false;
      return true;
    });
  }, [registros, adminFilter, noSolFilter, noDeclFilter, estadoFilter]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono font-semibold text-[#0B3B60]">Cap. 7 · Manual SIGA (Pág. 23)</div>
          <h1 className="text-base font-bold text-slate-900">
            Consulta de Entrada de la Carga de Exportación a la Administración
          </h1>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block font-medium text-slate-700 mb-1">Administración</label>
          <input
            type="text"
            value={adminFilter}
            onChange={(e) => setAdminFilter(e.target.value)}
            placeholder="Ej. 10030 o Haina..."
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">No. de Solicitud (EGED)</label>
          <input
            type="text"
            value={noSolFilter}
            onChange={(e) => setNoSolFilter(e.target.value)}
            placeholder="EGED-2611-..."
            className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Declaración de Exportación</label>
          <input
            type="text"
            value={noDeclFilter}
            onChange={(e) => setNoDeclFilter(e.target.value)}
            placeholder="10030-EC01-..."
            className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Estado de la Solicitud</label>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value as 'ALL' | CargoEntryStatus)}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
          >
            <option value="ALL">=== Todos ===</option>
            <option value="Registro">Registro</option>
            <option value="En Puerta">En Puerta</option>
            <option value="Ingresada en Administración">Ingresada en Administración</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#65A30D] text-white">
              <tr>
                <th className="px-3 py-2.5">Sec.</th>
                <th className="px-3 py-2.5">No. Solicitud</th>
                <th className="px-3 py-2.5">Fecha Tentativa</th>
                <th className="px-3 py-2.5">No. de Declaración</th>
                <th className="px-3 py-2.5">Aduana Salida</th>
                <th className="px-3 py-2.5">Empresa Transportista</th>
                <th className="px-3 py-2.5">Contenedor / Sello</th>
                <th className="px-3 py-2.5 text-right">Bultos</th>
                <th className="px-3 py-2.5">Estado Solicitud</th>
                <th className="px-3 py-2.5 text-right">Simular Puerta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                    No existen solicitudes de entrada de carga con los filtros ingresados.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-mono tabular-nums">{row.sec}</td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60] whitespace-nowrap">{row.noSolicitud}</td>
                    <td className="px-3 py-2.5 font-mono tabular-nums">{row.fechaTentativaEntrada}</td>
                    <td className="px-3 py-2.5 font-mono tabular-nums whitespace-nowrap">{row.noDeclaracion}</td>
                    <td className="px-3 py-2.5 font-mono">{row.aduanaSalidaCodigo}</td>
                    <td className="px-3 py-2.5">{row.empresaTransportista}</td>
                    <td className="px-3 py-2.5 font-mono">{row.noContenedor} / {row.noSello}</td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums">{row.cantidadBultos}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-800">{row.estadoSolicitud}</td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">
                      {row.estadoSolicitud === 'Registro' && (
                        <button
                          type="button"
                          onClick={() => onAdvanceStatus(row.id, 'En Puerta')}
                          className="px-2.5 py-1 bg-[#0B3B60] text-white rounded text-[11px] font-medium inline-flex items-center gap-1 hover:bg-[#092e4b]"
                        >
                          <Truck className="w-3 h-3" />
                          Registrar en Puerta
                        </button>
                      )}
                      {row.estadoSolicitud === 'En Puerta' && (
                        <button
                          type="button"
                          onClick={() => onAdvanceStatus(row.id, 'Ingresada en Administración')}
                          className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-medium inline-flex items-center gap-1 hover:bg-emerald-800"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Confirmar Ingreso
                        </button>
                      )}
                      {row.estadoSolicitud === 'Ingresada en Administración' && (
                        <span className="text-emerald-700 text-[11px] font-medium">Completado</span>
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
};
