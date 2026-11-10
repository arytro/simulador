import React, { useState } from 'react';
import { CreditCard, Printer, X, CheckCircle2, FileText } from 'lucide-react';
import { DeclaracionDUA } from '../types/siga';
import { formatMoney } from '../utils/duaXml';

interface PaymentModalProps {
  dua: DeclaracionDUA | null;
  onClose: () => void;
  onConfirmPayment: (duaId: string, metodo: string, ref: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ dua, onClose, onConfirmPayment }) => {
  const [metodo, setMetodo] = useState<'e-Banking Popular' | 'e-Banking Banreservas' | 'e-Banking BHD' | 'Código Prepago DGA'>('e-Banking Popular');
  const [codigoPrepago, setCodigoPrepago] = useState('PRE-10030-98421');

  if (!dua) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const ref =
      metodo === 'Código Prepago DGA'
        ? codigoPrepago.trim() || `PRE-${Date.now().toString().slice(-6)}`
        : `EBK-${Date.now().toString().slice(-6)}`;
    onConfirmPayment(dua.id, metodo, ref);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-[#0B3B60] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <h3 className="text-sm font-semibold">Liquidación de Tasa Formulario DUA</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/15 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handlePay} className="p-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">No. Declaración DUA:</span>
              <span className="font-mono font-semibold text-slate-900">{dua.noDeclaracion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Concepto (Norma 01-2023):</span>
              <span className="font-medium text-slate-800">Tasa Formulario DUA Exportación</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-200">
              <span className="font-semibold text-slate-700">Total a Pagar:</span>
              <span className="font-mono font-bold text-base text-[#0B3B60] tabular-nums">
                RD$ {formatMoney(dua.tasaDuaMonto)}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Según el manual SIGA (pág. 22), la impresión de la declaración electrónica permanece deshabilitada hasta efectuar el pago vía <span className="font-medium">e-banking</span> o <span className="font-medium">código prepago</span>.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">Método de Pago Simulado</label>
            <select
              value={metodo}
              onChange={(e) => setMetodo(e.target.value as typeof metodo)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:border-[#0B3B60]"
            >
              <option value="e-Banking Popular">e-Banking Banco Popular</option>
              <option value="e-Banking Banreservas">e-Banking Banreservas</option>
              <option value="e-Banking BHD">e-Banking Banco BHD</option>
              <option value="Código Prepago DGA">Código Prepago (Cajas / Puertos DGA)</option>
            </select>
          </div>

          {metodo === 'Código Prepago DGA' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Número de Código Prepago</label>
              <input
                type="text"
                value={codigoPrepago}
                onChange={(e) => setCodigoPrepago(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md"
                required
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded-md transition-colors"
            >
              Confirmar Pago (RD$ {formatMoney(dua.tasaDuaMonto)})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PrintableDuaModalProps {
  dua: DeclaracionDUA | null;
  onClose: () => void;
}

export const PrintableDuaModal: React.FC<PrintableDuaModalProps> = ({ dua, onClose }) => {
  if (!dua) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        <div className="no-print bg-[#0B3B60] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-semibold">Vista Previa Oficial de Impresión · DUA Exportación</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-[#65A30D] hover:bg-[#4D7C0F] text-white text-xs font-semibold rounded flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / Guardar PDF
            </button>
            <button type="button" onClick={onClose} className="p-1.5 hover:bg-white/15 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto text-xs text-slate-900 space-y-5">
          {/* Official Header */}
          <div className="border-b-2 border-[#0B3B60] pb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="text-lg font-bold text-[#0B3B60]">REPÚBLICA DOMINICANA · DIRECCIÓN GENERAL DE ADUANAS (DGA)</div>
              <div className="text-sm font-semibold text-slate-700 mt-0.5">
                DECLARACIÓN ÚNICA ADUANERA (DUA) DE EXPORTACIÓN — SIGARD
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Documento de práctica generado en el Simulador SIGA · No válido para despacho real en puerto.
              </div>
            </div>
            <div className="border border-slate-300 rounded p-2.5 bg-slate-50 text-right font-mono">
              <div className="text-[11px] text-slate-500">NO. DECLARACIÓN</div>
              <div className="text-sm font-bold text-[#0B3B60]">{dua.noDeclaracion}</div>
              <div className="text-[11px] text-emerald-700 mt-1 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3 h-3" />
                TASA DUA PAGADA ({dua.referenciaPago || 'PAGADO'})
              </div>
            </div>
          </div>

          {/* Datos Generales */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border border-slate-300 rounded p-3">
            <div>
              <span className="text-slate-500 block">Fecha Declaración</span>
              <span className="font-mono font-semibold">{dua.fechaDeclaracion}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Administración</span>
              <span className="font-semibold">[{dua.adminCodigo}] {dua.adminNombre}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Régimen / Acuerdo</span>
              <span className="font-semibold">[{dua.regimenCodigo}] {dua.regimenNombre} {dua.acuerdoNombre ? `· ${dua.acuerdoNombre}` : ''}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Estado / Entrada Carga</span>
              <span className="font-semibold">{dua.estado} · {dua.noSolicitudEntradaCarga || 'Pendiente'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Doc. Embarque (B/L - AWB)</span>
              <span className="font-mono font-semibold">{dua.docEmbarque || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Puerto de Salida</span>
              <span className="font-semibold">[{dua.puertoSalidaCodigo}] {dua.puertoSalidaNombre}</span>
            </div>
            <div>
              <span className="text-slate-500 block">País de Destino</span>
              <span className="font-semibold">[{dua.paisDestinoCodigo}] {dua.paisDestinoNombre}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Empresa Transportista</span>
              <span className="font-semibold">{dua.empresaTransportistaNombre} ({dua.noViajeVuelo})</span>
            </div>
          </div>

          {/* Partes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-300 rounded p-3 space-y-1">
              <div className="font-bold text-[#0B3B60] border-b border-slate-200 pb-1">EXPORTADOR</div>
              <div className="font-semibold">{dua.exportadorNombre}</div>
              <div>{dua.exportadorDocTipo}: <span className="font-mono">{dua.exportadorDocNumero}</span></div>
              <div className="text-slate-600">{dua.exportadorDireccion}</div>
              <div className="text-slate-600">{dua.exportadorTelefono} · {dua.exportadorEmail}</div>
            </div>
            <div className="border border-slate-300 rounded p-3 space-y-1">
              <div className="font-bold text-[#0B3B60] border-b border-slate-200 pb-1">COMPRADOR EXTRANJERO & AGENTE</div>
              <div className="font-semibold">{dua.compradorNombre}</div>
              <div>{dua.compradorDocTipo}: <span className="font-mono">{dua.compradorDocNumero}</span> · {dua.compradorNacionalidadNombre}</div>
              {dua.agenteNombre && (
                <div className="pt-1 text-slate-600">
                  Agente: {dua.agenteNombre} (Lic. {dua.agenteLicencia})
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="font-bold text-[#0B3B60] mb-1.5">DETALLE DE MERCANCÍAS</div>
            <table className="w-full border border-slate-300 border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 px-2 py-1.5 text-left">Sec.</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-left">Código S.A.</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-left">Descripción</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-right">Cantidad</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-right">Peso Neto (Kg)</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-right">FOB Unit (US$)</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-right">FOB Total (US$)</th>
                </tr>
              </thead>
              <tbody>
                {dua.detalles.map((d) => (
                  <tr key={d.id}>
                    <td className="border border-slate-300 px-2 py-1.5 font-mono">{d.sec}</td>
                    <td className="border border-slate-300 px-2 py-1.5 font-mono">{d.codigoSA}</td>
                    <td className="border border-slate-300 px-2 py-1.5">{d.productoNombre} — {d.descripcionMercancia}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right font-mono tabular-nums">{formatMoney(d.cantidad)} {d.unidad}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right font-mono tabular-nums">{formatMoney(d.pesoKg)}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right font-mono tabular-nums">{formatMoney(d.fobUnitario, 4)}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right font-mono font-semibold tabular-nums">{formatMoney(d.cantidad * d.fobUnitario)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals and Documents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-300 rounded p-3">
              <div className="font-bold text-[#0B3B60] mb-1">DOCUMENTOS SOPORTE & CONTENEDORES</div>
              {dua.documentos.map((doc) => (
                <div key={doc.id} className="flex justify-between py-0.5 border-b border-slate-100 last:border-0">
                  <span>{doc.tipoDocumento}</span>
                  <span className="font-mono font-semibold">{doc.noReferencia}</span>
                </div>
              ))}
              {!dua.aGranel && dua.contenedores.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  {dua.contenedores.map((c) => (
                    <div key={c.id} className="font-mono text-[11px]">
                      Contenedor: {c.numeroContenedor} ({c.tipoContenedor}) · Sello: {c.sello}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border border-slate-300 rounded p-3 space-y-1 font-mono tabular-nums">
              <div className="font-sans font-bold text-[#0B3B60] mb-1">RESUMEN DE VALOR Y PESO</div>
              <div className="flex justify-between"><span>Valor FOB Total (US$):</span><span>${formatMoney(dua.valorFobTotal)}</span></div>
              <div className="flex justify-between"><span>Flete + Seguro + Otros (US$):</span><span>${formatMoney(dua.flete + dua.seguro + dua.otroGasto)}</span></div>
              <div className="flex justify-between font-bold border-t border-slate-200 pt-1"><span>Valor CIF Total (US$):</span><span>${formatMoney(dua.valorCifTotalUsd)}</span></div>
              <div className="flex justify-between"><span>Tasa Cambio / CIF (RD$):</span><span>{dua.tasaCambio.toFixed(2)} · RD$ {formatMoney(dua.valorCifTotalRd)}</span></div>
              <div className="flex justify-between pt-1"><span>Peso Bruto / Peso Neto (KG):</span><span>{formatMoney(dua.pesoBrutoKg)} / {formatMoney(dua.pesoNetoKg)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
