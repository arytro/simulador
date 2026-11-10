import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Copy,
  FileSpreadsheet,
  ArrowLeftRight,
} from 'lucide-react';
import { DeclaracionDUA } from '../types/siga';
import {
  buildDgii607Line,
  formatMoney,
  validateEcfOrNcf,
  validateRncOrCedula,
} from '../utils/duaXml';

interface DgiiBridgeViewProps {
  duas: DeclaracionDUA[];
  activeDuaId: string | null;
  onSelectDua: (id: string) => void;
  onAttachEcfToDua?: (duaId: string, ecfNumero: string, montoRd: number) => void;
}

export const DgiiBridgeView: React.FC<DgiiBridgeViewProps> = ({
  duas,
  activeDuaId,
  onSelectDua,
}) => {
  const selectedDua = useMemo(
    () => duas.find((d) => d.id === activeDuaId) || duas[0] || null,
    [duas, activeDuaId]
  );

  const existingDgiiDoc = useMemo(() => {
    if (!selectedDua) return null;
    return selectedDua.documentos.find(
      (doc) =>
        doc.noReferencia.toUpperCase().startsWith('E46') ||
        doc.noReferencia.toUpperCase().startsWith('B16') ||
        doc.tipoDocumento.includes('DGII')
    );
  }, [selectedDua]);

  const [testRnc, setTestRnc] = useState(selectedDua?.exportadorDocNumero || '130000018');
  const [testNcf, setTestNcf] = useState(existingDgiiDoc?.noReferencia || 'E460000000189');
  const [tipoOperacion, setTipoOperacion] = useState<'bienes' | 'servicios'>('bienes');
  const [montoFacturaUsd, setMontoFacturaUsd] = useState<number>(selectedDua?.valorFobTotal || 30000);
  const [tasaCambio, setTasaCambio] = useState<number>(selectedDua?.tasaCambio || 60.2);
  const [compradorTid, setCompradorTid] = useState(selectedDua?.compradorDocNumero || '11-1111111');
  const [copied607, setCopied607] = useState(false);

  useEffect(() => {
    if (!selectedDua) return;
    setTestRnc(selectedDua.exportadorDocNumero || '');
    const doc = selectedDua.documentos.find(
      (d) =>
        d.noReferencia.toUpperCase().startsWith('E46') ||
        d.noReferencia.toUpperCase().startsWith('B16') ||
        d.tipoDocumento.includes('DGII')
    );
    setTestNcf(doc?.noReferencia || 'E460000000001');
    setMontoFacturaUsd(selectedDua.valorFobTotal);
    setTasaCambio(selectedDua.tasaCambio);
    setCompradorTid(selectedDua.compradorDocNumero || '');
  }, [selectedDua?.id]);

  const handleDuaChange = (newId: string) => {
    onSelectDua(newId);
  };

  const rncCheck = useMemo(() => validateRncOrCedula('RNC', testRnc), [testRnc]);
  const ncfCheck = useMemo(() => validateEcfOrNcf(testNcf), [testNcf]);

  const montoFacturaRd = Number((montoFacturaUsd * tasaCambio).toFixed(2));
  const duaFobRd = selectedDua ? Number((selectedDua.valorFobTotal * selectedDua.tasaCambio).toFixed(2)) : 0;
  const difUsd = selectedDua ? Math.abs(montoFacturaUsd - selectedDua.valorFobTotal) : 0;
  const cuadreExacto = difUsd < 0.01;

  const line607 = useMemo(() => {
    if (!selectedDua) return '';
    const simulatedDua: DeclaracionDUA = {
      ...selectedDua,
      valorFobTotal: montoFacturaUsd,
      tasaCambio,
      compradorDocNumero: compradorTid,
    };
    return buildDgii607Line(simulatedDua, testNcf);
  }, [selectedDua, montoFacturaUsd, tasaCambio, compradorTid, testNcf]);

  const handleDownload607 = () => {
    const header = 'RNC_PASAPORTE|TIPO_ID|NCF|NCF_MODIFICADO|TIPO_INGRESO|FECHA_COMPROBANTE|FECHA_RETENCION|MONTO_FACTURADO|ITBIS_FACTURADO\n';
    const blob = new Blob([header + line607 + '\n'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DGII_607_EXP_${selectedDua?.noDeclaracion || 'SIMULADOR'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy607 = () => {
    navigator.clipboard?.writeText(line607);
    setCopied607(true);
    setTimeout(() => setCopied607(false), 1800);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono font-semibold text-[#0B3B60]">
            Integración Fiscal y Aduanera RD · DGII ↔ DGA (SIGA)
          </div>
          <h1 className="text-base font-bold text-slate-900 mt-0.5">
            Validador Cruzado DGII (e-CF 46 / NCF 16 / Formato 607 / IT-1) y DUA Exportación
          </h1>
        </div>
        {selectedDua && (
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="dgii-dua-select" className="text-slate-600 font-medium">
              DUA vinculada:
            </label>
            <select
              id="dgii-dua-select"
              value={selectedDua.id}
              onChange={(e) => handleDuaChange(e.target.value)}
              className="px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-slate-900"
            >
              {duas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.noDeclaracion} — {d.exportadorNombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Explanatory Architecture Strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-bold text-[#0B3B60]">1. Emisión en DGII (e-CF 46 / NCF 16)</div>
          <p className="text-slate-600 leading-relaxed">
            Toda exportación de <strong>bienes</strong> debe respaldarse con un Comprobante para Exportaciones (<strong>e-CF 46</strong> electrónico o tradicional <strong>B16</strong>) gravado a <strong>Tasa 0% de ITBIS</strong>, consignando el Tax ID / Pasaporte del comprador extranjero.
          </p>
        </div>
        <div className="space-y-1">
          <div className="font-bold text-[#0B3B60]">2. Cruce en DGA SIGA (DUA EC01)</div>
          <p className="text-slate-600 leading-relaxed">
            Al registrar la DUA en SIGA, el valor FOB en US$ y la referencia del e-CF 46 / Factura Comercial deben coincidir exactamente para evitar bloqueos de inventario y acreditar la salida de mercancía.
          </p>
        </div>
        <div className="space-y-1">
          <div className="font-bold text-[#0B3B60]">3. Reporte Formato 607 & IT-1</div>
          <p className="text-slate-600 leading-relaxed">
            Mensualmente, el e-CF 46 se remite en el <strong>Formato 607</strong> (Tipo ID <span className="font-mono">3</span> Extranjero, ITBIS <span className="font-mono">0.00</span>) cuadrando con la casilla de Exportaciones del <strong>IT-1</strong>.
          </p>
        </div>
      </div>

      {/* Interactive Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Input Controls */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-4 space-y-3.5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="font-bold text-[#0B3B60] uppercase flex items-center gap-1.5">
              <ArrowLeftRight className="w-4 h-4" />
              Datos Fiscales del Comprobante DGII
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Tipo de Exportación</label>
              <select
                value={tipoOperacion}
                onChange={(e) => setTipoOperacion(e.target.value as 'bienes' | 'servicios')}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
              >
                <option value="bienes">Exportación de Bienes (Aplica DUA + e-CF 46)</option>
                <option value="servicios">Exportación de Servicios (Usa e-CF 32 / B02, no DUA)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">RNC Exportador (9 dígitos)</label>
              <input
                type="text"
                value={testRnc}
                onChange={(e) => setTestRnc(e.target.value)}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">No. e-CF / NCF de Exportación</label>
              <input
                type="text"
                value={testNcf}
                onChange={(e) => setTestNcf(e.target.value.toUpperCase())}
                placeholder="E460000000189 o B1600000189"
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Tax ID / Pasaporte Comprador (607)</label>
              <input
                type="text"
                value={compradorTid}
                onChange={(e) => setCompradorTid(e.target.value)}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Monto Factura Comercial (US$ FOB)</label>
              <input
                type="number"
                step="0.01"
                value={montoFacturaUsd}
                onChange={(e) => setMontoFacturaUsd(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-right tabular-nums"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Tasa de Cambio BCRD (RD$)</label>
              <input
                type="number"
                step="0.01"
                value={tasaCambio}
                onChange={(e) => setTasaCambio(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-right tabular-nums"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-3 flex items-center justify-between font-mono tabular-nums">
            <span className="font-sans text-slate-600">Total Facturado en RD$ (Base IT-1 / 607):</span>
            <span className="text-sm font-bold text-[#0B3B60]">RD$ {formatMoney(montoFacturaRd)}</span>
          </div>
        </div>

        {/* Right: Real-time Validation Checklist */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-4 space-y-3 text-xs">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="font-bold text-[#0B3B60] uppercase">Resultado de Validación Cruzada DGII ↔ DGA</h2>
          </div>

          <ul className="space-y-2.5">
            {/* Check 1: Tipo operacion */}
            <li className="flex items-start gap-2.5 p-2.5 rounded border border-slate-200 bg-slate-50/70">
              {tipoOperacion === 'bienes' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-semibold text-slate-900">
                  Régimen de Operación: {tipoOperacion === 'bienes' ? 'Exportación de Bienes (Correcto para DUA)' : 'Exportación de Servicios (No usa DUA ni e-CF 46)'}
                </div>
                <div className="text-slate-600 mt-0.5">
                  {tipoOperacion === 'bienes'
                    ? 'Aplica DUA en SIGA + Comprobante e-CF 46 / B16 exento (ITBIS 0%).'
                    : 'Según Norma DGII, los servicios exportados se facturan con Consumo (e-CF 32 / B02) y no generan DUA aduanero.'}
                </div>
              </div>
            </li>

            {/* Check 2: RNC */}
            <li className="flex items-start gap-2.5 p-2.5 rounded border border-slate-200 bg-slate-50/70">
              {rncCheck.valid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-semibold text-slate-900">Validación RNC Exportador ({testRnc})</div>
                <div className="text-slate-600 mt-0.5">{rncCheck.message}</div>
              </div>
            </li>

            {/* Check 3: e-CF 46 */}
            <li className="flex items-start gap-2.5 p-2.5 rounded border border-slate-200 bg-slate-50/70">
              {ncfCheck.severity === 'ok' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              ) : ncfCheck.severity === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-semibold text-slate-900">Estructura e-CF / NCF ({testNcf})</div>
                <div className="text-slate-600 mt-0.5">{ncfCheck.message}</div>
              </div>
            </li>

            {/* Check 4: FOB Reconciliation */}
            {selectedDua && (
              <li className="flex items-start gap-2.5 p-2.5 rounded border border-slate-200 bg-slate-50/70">
                {cuadreExacto ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-slate-900">
                    Cuadre FOB DUA ({selectedDua.noDeclaracion}) vs Factura DGII
                  </div>
                  <div className="text-slate-600 mt-0.5 font-mono tabular-nums">
                    DUA FOB: US$ {formatMoney(selectedDua.valorFobTotal)} (RD$ {formatMoney(duaFobRd)}) · Factura: US$ {formatMoney(montoFacturaUsd)} (RD$ {formatMoney(montoFacturaRd)})
                    {!cuadreExacto && ` · Diferencia: US$ ${formatMoney(difUsd)}`}
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Formato 607 & IT-1 Preview */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-[#0B3B60] uppercase flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4" />
              Vista Previa Formato de Envío 607 (DGII) y Casilla IT-1
            </h2>
            <p className="text-slate-500 mt-0.5">
              Registro listo para remitir en la Oficina Virtual DGII sin inconsistencias frente al DUA aduanero.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy607}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-medium inline-flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied607 ? 'Copiado' : 'Copiar Línea 607'}
            </button>
            <button
              type="button"
              onClick={handleDownload607}
              className="px-3 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white rounded font-semibold inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar .TXT 607
            </button>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-100 rounded p-3 font-mono text-xs overflow-x-auto">
          <div className="text-slate-400 mb-1">
            # RNC_PASAPORTE | TIPO_ID | NCF | NCF_MOD | TIPO_INGRESO | FECHA | RETENCION | MONTO_FACTURADO_RD | ITBIS
          </div>
          <div className="text-emerald-300">{line607}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 font-mono tabular-nums">
          <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
            <div className="font-sans text-[11px] text-slate-500">IT-1 · Operaciones Exportación (Tasa 0%)</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">RD$ {formatMoney(montoFacturaRd)}</div>
          </div>
          <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
            <div className="font-sans text-[11px] text-slate-500">IT-1 · ITBIS Facturado en Exportación</div>
            <div className="text-sm font-bold text-emerald-700 mt-0.5">RD$ 0.00 (Exento Art. 342 CT)</div>
          </div>
          <div className="border border-slate-200 rounded p-2.5 bg-slate-50">
            <div className="font-sans text-[11px] text-slate-500">Tipo Identificación Cliente (Formato 607)</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">3 · Extranjero / Pasaporte ({compradorTid})</div>
          </div>
        </div>
      </div>
    </div>
  );
};
