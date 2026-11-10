import React, { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import {
  ACUERDOS_COMERCIALES,
  ADMINISTRACIONES_ADUANA,
  CERTIFICADOS_ORIGEN_CATALOGO,
  CODIGOS_SA_CATALOGO,
  COMPRADORES_CATALOGO,
  EXPORTADORES_CATALOGO,
  PAISES_CATALOGO,
  PRODUCTOS_CATALOGO,
  PUERTOS_CATALOGO,
  REGIMENES_ADUANEROS,
  TRANSPORTISTAS_CATALOGO,
} from '../data/catalogs';
import { DeclaracionDUA } from '../types/siga';

export type LookupKind =
  | 'admin'
  | 'deposito'
  | 'puerto'
  | 'pais-destino'
  | 'pais-transportista'
  | 'pais-origen'
  | 'transportista'
  | 'exportador'
  | 'comprador'
  | 'regimen'
  | 'acuerdo'
  | 'codigo-sa'
  | 'producto'
  | 'certificado-origen'
  | 'formulario-referencia';

interface LookupModalProps {
  kind: LookupKind | null;
  onClose: () => void;
  onSelect: (item: unknown) => void;
  filterSA?: string;
  duas?: DeclaracionDUA[];
}

const TITLES: Record<LookupKind, string> = {
  admin: 'Búsqueda de Aduanas',
  deposito: '[wcIC050104] Buscar Información de Depósito / Destinatario',
  puerto: 'Buscar Información de Puerto',
  'pais-destino': 'Buscar País de Destino',
  'pais-transportista': 'Buscar Nacionalidad de Empresa Transportista',
  'pais-origen': 'Buscar País de Origen',
  transportista: 'Buscar Información de Empresa Transportista',
  exportador: 'Buscar Información de Exportador',
  comprador: 'Búsqueda Comprador',
  regimen: 'Buscar Información de Régimen',
  acuerdo: 'Buscar Información de Acuerdo Comercial',
  'codigo-sa': '[wcIC050113] Buscar Información Código de S.A.',
  producto: 'Buscar Información de Producto',
  'certificado-origen': '[wcIC050118] Buscar Información Certificado de Origen',
  'formulario-referencia': 'Buscar Formulario de Referencia (DUA Presentadas)',
};

export const LookupModal: React.FC<LookupModalProps> = ({
  kind,
  onClose,
  onSelect,
  filterSA,
  duas = [],
}) => {
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!kind) return [];
    switch (kind) {
      case 'admin':
        return ADMINISTRACIONES_ADUANA.filter(
          (a) =>
            a.codigo.toLowerCase().includes(q) ||
            a.nombre.toLowerCase().includes(q) ||
            a.localizacion.toLowerCase().includes(q)
        );
      case 'deposito':
      case 'puerto':
        return PUERTOS_CATALOGO.filter(
          (p) =>
            p.codigoPuerto.toLowerCase().includes(q) ||
            p.nombrePuerto.toLowerCase().includes(q) ||
            p.tipoPuertoUso.toLowerCase().includes(q)
        );
      case 'pais-destino':
      case 'pais-transportista':
      case 'pais-origen':
        return PAISES_CATALOGO.filter(
          (p) =>
            p.codigo.toLowerCase().includes(q) ||
            p.nombre.toLowerCase().includes(q) ||
            p.iso2.toLowerCase().includes(q)
        );
      case 'transportista':
        return TRANSPORTISTAS_CATALOGO.filter(
          (t) =>
            t.nombre.toLowerCase().includes(q) ||
            t.codigo.toLowerCase().includes(q) ||
            t.documentoNumero.toLowerCase().includes(q)
        );
      case 'exportador':
        return EXPORTADORES_CATALOGO.filter(
          (e) =>
            e.nombre.toLowerCase().includes(q) ||
            e.documentoNumero.toLowerCase().includes(q) ||
            e.ciudad.toLowerCase().includes(q)
        );
      case 'comprador':
        return COMPRADORES_CATALOGO.filter(
          (c) =>
            c.nombre.toLowerCase().includes(q) ||
            c.documentoNumero.toLowerCase().includes(q) ||
            c.nacionalidadNombre.toLowerCase().includes(q)
        );
      case 'regimen':
        return REGIMENES_ADUANEROS.filter(
          (r) =>
            r.codigo.toLowerCase().includes(q) ||
            r.nombre.toLowerCase().includes(q)
        );
      case 'acuerdo':
        return ACUERDOS_COMERCIALES.filter(
          (a) =>
            a.codigo.toLowerCase().includes(q) ||
            a.nombre.toLowerCase().includes(q)
        );
      case 'codigo-sa':
        return CODIGOS_SA_CATALOGO.filter(
          (s) =>
            s.codigo.toLowerCase().includes(q) ||
            s.categoria.toLowerCase().includes(q) ||
            s.subCategoria.toLowerCase().includes(q)
        );
      case 'producto':
        return PRODUCTOS_CATALOGO.filter((p) => {
          const saMatch = !filterSA || p.codigoSA.startsWith(filterSA.slice(0, 4));
          const qMatch =
            !q ||
            p.nombreProducto.toLowerCase().includes(q) ||
            p.codigoProducto.toLowerCase().includes(q) ||
            p.codigoSA.toLowerCase().includes(q);
          return saMatch && qMatch;
        });
      case 'certificado-origen':
        return CERTIFICADOS_ORIGEN_CATALOGO.filter(
          (c) =>
            c.noCertificado.toLowerCase().includes(q) ||
            c.codigoSA.toLowerCase().includes(q) ||
            c.acuerdoNombre.toLowerCase().includes(q)
        );
      case 'formulario-referencia':
        return duas
          .filter((d) => d.estado !== 'Temporal')
          .filter(
            (d) =>
              d.noDeclaracion.toLowerCase().includes(q) ||
              d.exportadorNombre.toLowerCase().includes(q) ||
              d.adminNombre.toLowerCase().includes(q)
          );
      default:
        return [];
    }
  }, [kind, query, filterSA, duas]);

  if (!kind) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lookup-modal-title"
    >
      <div className="bg-white border border-slate-300 rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* SIGA Dialog Header */}
        <div className="bg-[#0B3B60] text-white px-4 py-3 flex items-center justify-between gap-4">
          <h3 id="lookup-modal-title" className="text-sm font-semibold truncate">
            {TITLES[kind]}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de búsqueda"
            className="p-1 rounded hover:bg-white/15 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escriba código, nombre, RNC o descripción para filtrar..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B3B60]/20 focus:border-[#0B3B60]"
              autoFocus
            />
          </div>
          {kind === 'producto' && filterSA && (
            <span className="text-xs text-slate-600 font-mono">
              Filtrado por S.A.: {filterSA}
            </span>
          )}
          <button
            type="button"
            onClick={() => setQuery('')}
            className="px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-md hover:bg-slate-100 text-slate-700"
          >
            Ver Todos
          </button>
        </div>

        {/* Results table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-[#65A30D] text-white">
              {kind === 'admin' && (
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Área</th>
                  <th className="px-3 py-2.5 font-semibold">Nombre de Área</th>
                  <th className="px-3 py-2.5 font-semibold">Localización</th>
                  <th className="px-3 py-2.5 font-semibold">Tipo</th>
                </tr>
              )}
              {(kind === 'puerto' || kind === 'deposito') && (
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Tipo de puerto de uso</th>
                  <th className="px-3 py-2.5 font-semibold">Código</th>
                  <th className="px-3 py-2.5 font-semibold">Nombre de Puerto</th>
                  <th className="px-3 py-2.5 font-semibold">Cód. Int.</th>
                  <th className="px-3 py-2.5 font-semibold">País</th>
                </tr>
              )}
              {(kind === 'pais-destino' || kind === 'pais-transportista' || kind === 'pais-origen') && (
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Código País</th>
                  <th className="px-3 py-2.5 font-semibold">Nombre del País</th>
                  <th className="px-3 py-2.5 font-semibold">ISO</th>
                </tr>
              )}
              {(kind === 'transportista' || kind === 'exportador' || kind === 'comprador') && (
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Nombre</th>
                  <th className="px-3 py-2.5 font-semibold">Certificaciones</th>
                  <th className="px-3 py-2.5 font-semibold">Tipo Doc.</th>
                  <th className="px-3 py-2.5 font-semibold">Documento</th>
                </tr>
              )}
              {(kind === 'regimen' || kind === 'acuerdo') && (
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Código</th>
                  <th className="px-3 py-2.5 font-semibold">Nombre</th>
                  <th className="px-3 py-2.5 font-semibold">Descripción</th>
                </tr>
              )}
              {kind === 'codigo-sa' && (
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Código de S.A.</th>
                  <th className="px-3 py-2.5 font-semibold">Categoría</th>
                  <th className="px-3 py-2.5 font-semibold">Sub-Categoría</th>
                  <th className="px-3 py-2.5 font-semibold">Unidad</th>
                </tr>
              )}
              {kind === 'producto' && (
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Código Producto</th>
                  <th className="px-3 py-2.5 font-semibold">Nombre de Producto</th>
                  <th className="px-3 py-2.5 font-semibold">Marca / Modelo</th>
                  <th className="px-3 py-2.5 font-semibold">S.A.</th>
                </tr>
              )}
              {kind === 'certificado-origen' && (
                <tr>
                  <th className="px-3 py-2.5 font-semibold">No. de Certificado</th>
                  <th className="px-3 py-2.5 font-semibold">Código S.A.</th>
                  <th className="px-3 py-2.5 font-semibold">Tratamiento</th>
                  <th className="px-3 py-2.5 font-semibold">País</th>
                </tr>
              )}
              {kind === 'formulario-referencia' && (
                <tr>
                  <th className="px-3 py-2.5 font-semibold">No. Formulario de Referencia</th>
                  <th className="px-3 py-2.5 font-semibold">Estado</th>
                  <th className="px-3 py-2.5 font-semibold">Exportador</th>
                  <th className="px-3 py-2.5 font-semibold">Administración</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron registros que coincidan con "{query}".
                  </td>
                </tr>
              ) : (
                rows.map((row: any, idx) => (
                  <tr
                    key={idx}
                    onClick={() => {
                      onSelect(row);
                      onClose();
                    }}
                    className="hover:bg-sky-50 cursor-pointer transition-colors"
                  >
                    {kind === 'admin' && (
                      <>
                        <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60] tabular-nums">{row.codigo}</td>
                        <td className="px-3 py-2.5 font-medium text-slate-900">{row.nombre}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.localizacion}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.tipo}</td>
                      </>
                    )}
                    {(kind === 'puerto' || kind === 'deposito') && (
                      <>
                        <td className="px-3 py-2.5 text-slate-700">{row.tipoPuertoUso}</td>
                        <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60]">{row.codigoPuerto}</td>
                        <td className="px-3 py-2.5 font-medium text-slate-900">{row.nombrePuerto}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-600">{row.codigoInternacional}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.paisNombre}</td>
                      </>
                    )}
                    {(kind === 'pais-destino' || kind === 'pais-transportista' || kind === 'pais-origen') && (
                      <>
                        <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60] tabular-nums">{row.codigo}</td>
                        <td className="px-3 py-2.5 font-medium text-slate-900">{row.nombre}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-600">{row.iso2}</td>
                      </>
                    )}
                    {(kind === 'transportista' || kind === 'exportador' || kind === 'comprador') && (
                      <>
                        <td className="px-3 py-2.5 font-medium text-slate-900">{row.nombre}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.certificaciones}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-700">{row.documentoTipo}</td>
                        <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60] tabular-nums">{row.documentoNumero}</td>
                      </>
                    )}
                    {(kind === 'regimen' || kind === 'acuerdo') && (
                      <>
                        <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60] tabular-nums">{row.codigo}</td>
                        <td className="px-3 py-2.5 font-medium text-slate-900">{row.nombre}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.descripcion}</td>
                      </>
                    )}
                    {kind === 'codigo-sa' && (
                      <>
                        <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60] tabular-nums">{row.codigo}</td>
                        <td className="px-3 py-2.5 font-medium text-slate-900">{row.categoria}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.subCategoria}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.unidadDefault}</td>
                      </>
                    )}
                    {kind === 'producto' && (
                      <>
                        <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60]">{row.codigoProducto}</td>
                        <td className="px-3 py-2.5 font-medium text-slate-900">{row.nombreProducto}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.marca} / {row.modelo}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-600">{row.codigoSA}</td>
                      </>
                    )}
                    {kind === 'certificado-origen' && (
                      <>
                        <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60]">{row.noCertificado}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-700">{row.codigoSA}</td>
                        <td className="px-3 py-2.5 text-slate-800">{row.tratamiento}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.paisNombre}</td>
                      </>
                    )}
                    {kind === 'formulario-referencia' && (
                      <>
                        <td className="px-3 py-2.5 font-mono font-semibold text-[#0B3B60] tabular-nums">{row.noDeclaracion}</td>
                        <td className="px-3 py-2.5 text-slate-800">{row.estado}</td>
                        <td className="px-3 py-2.5 text-slate-700">{row.exportadorNombre}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.adminNombre}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Haga clic en cualquier fila para seleccionar automáticamente en el formulario.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
