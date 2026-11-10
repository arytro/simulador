import React, { useMemo, useRef, useState } from 'react';
import {
  Search,
  Eraser,
  Upload,
  Save,
  Send,
  List,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Download,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  Paperclip,
  CreditCard,
  Printer,
} from 'lucide-react';
import {
  AcuerdoComercial,
  AdministracionAduana,
  CertificadoOrigenCatalogo,
  CodigoSA,
  CompradorInfo,
  ContenedorItem,
  DeclaracionDUA,
  DetalleMercanciaItem,
  DocumentoAdjuntoItem,
  ExportadorInfo,
  PaisInfo,
  ProductoCatalogo,
  PuertoInfo,
  RegimenAduanero,
  SessionUser,
  EmpresaTransportista,
} from '../types/siga';
import {
  CODIGOS_SA_CATALOGO,
  SAMPLE_DUA_XML,
  TIPOS_CONTENEDOR,
  TIPOS_DOCUMENTO,
} from '../data/catalogs';
import {
  formatMoney,
  generateDeclarationNumber,
  generateDuaXml,
  getTodayDdMmYyyy,
  parseDuaXml,
  recalculateDuaTotals,
  validateDuaForSubmission,
  validateEcfOrNcf,
  validateRncOrCedula,
} from '../utils/duaXml';
import { LookupKind, LookupModal } from './LookupModal';

interface DuaFormViewProps {
  sessionUser: SessionUser;
  initialDua: DeclaracionDUA | null;
  existingDuas: DeclaracionDUA[];
  onSaveTemporal: (dua: DeclaracionDUA) => DeclaracionDUA;
  onPresentDua: (dua: DeclaracionDUA) => { dua: DeclaracionDUA; eged: string };
  onGoToList: () => void;
  onOpenPayment: (dua: DeclaracionDUA) => void;
  onOpenPrint: (dua: DeclaracionDUA) => void;
  onOpenDgiiBridge: (dua: DeclaracionDUA) => void;
}

export function createEmptyDua(user: SessionUser): DeclaracionDUA {
  const isExportador = user.perfil === 'EXPORTADOR';
  const isAgente = user.perfil === 'AGENTE DE ADUANAS';

  return {
    id: `dua-${Date.now()}`,
    fechaDeclaracion: getTodayDdMmYyyy(),
    tipoDespacho: 'General',
    adminCodigo: '10030',
    adminNombre: 'ADMINISTRACION HAINA ORIENTAL',
    noDeclaracion: '',
    generarAuto: true,
    docEmbarque: '',
    depositoOrigenCodigo: 'DOHAI',
    depositoOrigenNombre: 'RIO HAINA',
    puertoSalidaCodigo: 'DOHAI',
    puertoSalidaNombre: 'RIO HAINA',
    paisDestinoCodigo: '840',
    paisDestinoNombre: 'ESTADOS UNIDOS',
    empresaTransportistaCodigo: '',
    empresaTransportistaNombre: '',
    noViajeVuelo: '',
    nacionalidadTransportistaCodigo: '214',
    nacionalidadTransportistaNombre: 'REPÚBLICA DOMINICANA',
    medioTransporte: '[HR32-1] MARÍTIMAS',
    fechaLlegada: '',
    exportadorNombre: isExportador ? user.nombreEmpresa : '',
    exportadorDocTipo: 'RNC',
    exportadorDocNumero: isExportador ? user.rncEmpresa : '',
    exportadorDireccion: isExportador ? user.direccionEmpresa : '',
    exportadorTelefono: isExportador ? user.telefonoEmpresa : '',
    exportadorFax: '',
    exportadorEmail: isExportador ? user.emailEmpresa : '',
    agenteEmpresa: isAgente ? user.nombreEmpresa : '',
    agenteNombre: isAgente ? `${user.licenciaAgente || 'CED0950'} - ${user.nombre}` : '',
    agenteLicencia: isAgente ? user.licenciaAgente || 'CED0950' : '',
    agenteDocTipo: isAgente ? 'CED' : '',
    agenteDocNumero: isAgente ? user.cedula : '',
    compradorNombre: '',
    compradorNacionalidadCodigo: '',
    compradorNacionalidadNombre: '',
    compradorDocTipo: 'TID',
    compradorDocNumero: '',
    regimenCodigo: '16',
    regimenNombre: 'EXPORTACION NACIONAL',
    acuerdoCodigo: '1',
    acuerdoNombre: 'DR-CAFTA',
    detalles: [],
    aGranel: false,
    contenedores: [],
    documentos: [],
    tasaCambio: 60.2,
    valorFobTotal: 0,
    flete: 0,
    seguro: 0,
    otroGasto: 0,
    valorCifTotalUsd: 0,
    valorCifTotalRd: 0,
    pesoBrutoKg: 0,
    pesoNetoKg: 0,
    observacion: '',
    estado: 'Temporal',
    selectividad: 'Pendiente',
    tasaDuaMonto: 300,
    tasaPagada: false,
  };
}

const emptyDetalleDraft = (): Omit<DetalleMercanciaItem, 'id' | 'sec'> => ({
  temporalProducto: false,
  codigoSA: '',
  saCategoria: '',
  codigoProducto: '',
  productoNombre: '',
  marca: 'N/A',
  modelo: 'N/A',
  estado: 'NUEVO',
  anio: 0,
  especificacion: '',
  unidad: 'Unidades',
  cantidad: 1,
  fobUnitario: 0,
  pesoKg: 0,
  certificadoOrigen: false,
  certificadoSecuencia: '',
  organica: false,
  gradoAlcohol: 0,
  noSerie: '',
  precioPorMenor: 0,
  paisOrigenCodigo: '214',
  paisOrigenNombre: 'REPÚBLICA DOMINICANA',
  tipoVehiculo: '',
  chasisVehiculo: '',
  colorVehiculo: '',
  motorVehiculo: '',
  vehiculoCC: 0,
  descripcion: '',
  descripcionMercancia: '',
});

const emptyContenedorDraft = (): Omit<ContenedorItem, 'id' | 'sec'> => ({
  tipoContenedor: "FURGON CERRADO DE 20'",
  numeroContenedor: '',
  sello: '',
  noPlaca: '',
});

const emptyDocumentoDraft = (user: SessionUser): Omit<DocumentoAdjuntoItem, 'id' | 'sec'> => ({
  tipoDocumento: 'COMPROBANTE FISCAL DGII (e-CF 46 / NCF 16)',
  otrosTipoDocumento: '',
  noReferencia: '',
  emitidoPor: user.nombreEmpresa,
  email: user.emailEmpresa,
  telefono: user.telefonoEmpresa,
  archivoNombre: '',
  archivoTamano: '',
});

export const DuaFormView: React.FC<DuaFormViewProps> = ({
  sessionUser,
  initialDua,
  existingDuas,
  onSaveTemporal,
  onPresentDua,
  onGoToList,
  onOpenPayment,
  onOpenPrint,
  onOpenDgiiBridge,
}) => {
  const [dua, setDua] = useState<DeclaracionDUA>(() =>
    recalculateDuaTotals(initialDua || createEmptyDua(sessionUser))
  );
  const [showXmlPanel, setShowXmlPanel] = useState(false);
  const [xmlFeedback, setXmlFeedback] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [lookupKind, setLookupKind] = useState<LookupKind | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successDialog, setSuccessDialog] = useState<{ title: string; message: string; dua: DeclaracionDUA } | null>(null);

  // Item drafts
  const [detDraft, setDetDraft] = useState(emptyDetalleDraft());
  const [editingDetId, setEditingDetId] = useState<string | null>(null);

  const [contDraft, setContDraft] = useState(emptyContenedorDraft());
  const [editingContId, setEditingContId] = useState<string | null>(null);

  const [docDraft, setDocDraft] = useState(() => emptyDocumentoDraft(sessionUser));
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  const xmlFileRef = useRef<HTMLInputElement>(null);
  const docFileRef = useRef<HTMLInputElement>(null);

  const isLockedSubmitted = dua.estado !== 'Temporal';

  const rncValidation = useMemo(
    () => validateRncOrCedula(dua.exportadorDocTipo, dua.exportadorDocNumero),
    [dua.exportadorDocTipo, dua.exportadorDocNumero]
  );

  const ncfDraftValidation = useMemo(() => {
    if (!docDraft.tipoDocumento.includes('DGII')) return null;
    return validateEcfOrNcf(docDraft.noReferencia);
  }, [docDraft.tipoDocumento, docDraft.noReferencia]);

  const saMetadata = useMemo(
    () => CODIGOS_SA_CATALOGO.find((c) => c.codigo === detDraft.codigoSA),
    [detDraft.codigoSA]
  );

  const updateField = <K extends keyof DeclaracionDUA>(field: K, value: DeclaracionDUA[K]) => {
    setDua((prev) => recalculateDuaTotals({ ...prev, [field]: value }));
  };

  const handleGenerateDuaNumber = () => {
    const code = dua.adminCodigo || '10030';
    const generated = generateDeclarationNumber(code, existingDuas);
    updateField('noDeclaracion', generated);
  };

  const handleXmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const parsed = parseDuaXml(text, createEmptyDua(sessionUser));
      if (parsed.error || !parsed.dua) {
        setXmlFeedback({ type: 'error', text: parsed.error || 'Error al leer XML.' });
      } else {
        setDua(parsed.dua);
        setValidationErrors([]);
        setXmlFeedback({
          type: 'ok',
          text: `Archivo "${file.name}" cargado en [wcEC010101] correctamente (${parsed.dua.detalles.length} ítem(s), FOB US$ ${formatMoney(parsed.dua.valorFobTotal)}).`,
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLoadSampleXml = () => {
    const parsed = parseDuaXml(SAMPLE_DUA_XML, createEmptyDua(sessionUser));
    if (parsed.dua) {
      setDua(parsed.dua);
      setValidationErrors([]);
      setXmlFeedback({
        type: 'ok',
        text: 'XML de ejemplo (Exportación Cacao Orgánico bajo EPA) cargado en todos los bloques del DUA.',
      });
    }
  };

  const handleDownloadXml = () => {
    const xml = generateDuaXml(dua);
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dua.noDeclaracion || 'DUA_BORRADOR_SIGA'}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLookupSelect = (item: unknown) => {
    switch (lookupKind) {
      case 'admin': {
        const a = item as AdministracionAduana;
        setDua((prev) =>
          recalculateDuaTotals({
            ...prev,
            adminCodigo: a.codigo,
            adminNombre: a.nombre,
          })
        );
        break;
      }
      case 'deposito': {
        const p = item as PuertoInfo;
        setDua((prev) => ({
          ...prev,
          depositoOrigenCodigo: p.codigoPuerto,
          depositoOrigenNombre: p.nombrePuerto,
        }));
        break;
      }
      case 'puerto': {
        const p = item as PuertoInfo;
        setDua((prev) => ({
          ...prev,
          puertoSalidaCodigo: p.codigoPuerto,
          puertoSalidaNombre: p.nombrePuerto,
        }));
        break;
      }
      case 'pais-destino': {
        const p = item as PaisInfo;
        setDua((prev) => ({
          ...prev,
          paisDestinoCodigo: p.codigo,
          paisDestinoNombre: p.nombre,
        }));
        break;
      }
      case 'pais-transportista': {
        const p = item as PaisInfo;
        setDua((prev) => ({
          ...prev,
          nacionalidadTransportistaCodigo: p.codigo,
          nacionalidadTransportistaNombre: p.nombre,
        }));
        break;
      }
      case 'pais-origen': {
        const p = item as PaisInfo;
        setDetDraft((prev) => ({
          ...prev,
          paisOrigenCodigo: p.codigo,
          paisOrigenNombre: p.nombre,
        }));
        break;
      }
      case 'transportista': {
        const t = item as EmpresaTransportista;
        setDua((prev) => ({
          ...prev,
          empresaTransportistaCodigo: t.codigo,
          empresaTransportistaNombre: t.nombre,
          nacionalidadTransportistaCodigo: t.nacionalidadCodigo,
          nacionalidadTransportistaNombre: t.nacionalidadNombre,
          medioTransporte: t.medioDefault,
        }));
        break;
      }
      case 'exportador': {
        const ex = item as ExportadorInfo;
        setDua((prev) => ({
          ...prev,
          exportadorNombre: ex.nombre,
          exportadorDocTipo: ex.documentoTipo,
          exportadorDocNumero: ex.documentoNumero,
          exportadorDireccion: ex.direccion,
          exportadorTelefono: ex.telefono,
          exportadorFax: ex.fax,
          exportadorEmail: ex.email,
        }));
        break;
      }
      case 'comprador': {
        const c = item as CompradorInfo;
        setDua((prev) => ({
          ...prev,
          compradorNombre: c.nombre,
          compradorNacionalidadCodigo: c.nacionalidadCodigo,
          compradorNacionalidadNombre: c.nacionalidadNombre,
          compradorDocTipo: c.documentoTipo,
          compradorDocNumero: c.documentoNumero,
        }));
        break;
      }
      case 'regimen': {
        const r = item as RegimenAduanero;
        setDua((prev) => ({
          ...prev,
          regimenCodigo: r.codigo,
          regimenNombre: r.nombre,
        }));
        break;
      }
      case 'acuerdo': {
        const ac = item as AcuerdoComercial;
        setDua((prev) => ({
          ...prev,
          acuerdoCodigo: ac.codigo,
          acuerdoNombre: ac.nombre,
        }));
        break;
      }
      case 'codigo-sa': {
        const sa = item as CodigoSA;
        setDetDraft((prev) => ({
          ...prev,
          codigoSA: sa.codigo,
          saCategoria: `${sa.categoria} ${sa.subCategoria}`,
          unidad: sa.unidadDefault,
        }));
        break;
      }
      case 'producto': {
        const prod = item as ProductoCatalogo;
        setDetDraft((prev) => ({
          ...prev,
          codigoSA: prod.codigoSA,
          codigoProducto: prod.codigoProducto,
          productoNombre: prod.nombreProducto,
          marca: prod.marca,
          modelo: prod.modelo,
          unidad: prod.unidad,
          organica: prod.organica,
          paisOrigenCodigo: prod.origenCodigo,
          paisOrigenNombre: prod.origenNombre,
          especificacion: prod.especificacion,
          descripcion: prod.nombreProducto,
        }));
        break;
      }
      case 'certificado-origen': {
        const cert = item as CertificadoOrigenCatalogo;
        setDetDraft((prev) => ({
          ...prev,
          certificadoOrigen: true,
          certificadoSecuencia: cert.secuencia,
        }));
        break;
      }
    }
  };

  // Detalle Grid CRUD
  const handleSaveDetalle = () => {
    if (!detDraft.codigoSA || !detDraft.productoNombre || detDraft.cantidad <= 0) {
      setValidationErrors(['Para agregar una partida necesita Código S.A., Producto y Cantidad mayor a 0.']);
      return;
    }
    setValidationErrors([]);
    let updatedDetalles: DetalleMercanciaItem[];
    if (editingDetId) {
      updatedDetalles = dua.detalles.map((d) =>
        d.id === editingDetId ? { ...detDraft, id: editingDetId, sec: d.sec } : d
      );
    } else {
      const nextSec = dua.detalles.length + 1;
      updatedDetalles = [
        ...dua.detalles,
        { ...detDraft, id: `det-${Date.now()}`, sec: nextSec },
      ];
    }
    setDua((prev) => recalculateDuaTotals({ ...prev, detalles: updatedDetalles }));
    setDetDraft(emptyDetalleDraft());
    setEditingDetId(null);
  };

  const handleDeleteDetalle = (id: string) => {
    const filtered = dua.detalles
      .filter((d) => d.id !== id)
      .map((d, idx) => ({ ...d, sec: idx + 1 }));
    setDua((prev) => recalculateDuaTotals({ ...prev, detalles: filtered }));
    if (editingDetId === id) {
      setDetDraft(emptyDetalleDraft());
      setEditingDetId(null);
    }
  };

  // Contenedor Grid CRUD
  const handleSaveContenedor = () => {
    if (!contDraft.numeroContenedor.trim()) {
      setValidationErrors(['Digite el No. de Contenedor antes de pulsar Agregar.']);
      return;
    }
    setValidationErrors([]);
    let updated: ContenedorItem[];
    if (editingContId) {
      updated = dua.contenedores.map((c) =>
        c.id === editingContId ? { ...contDraft, id: editingContId, sec: c.sec } : c
      );
    } else {
      updated = [
        ...dua.contenedores,
        { ...contDraft, id: `cont-${Date.now()}`, sec: dua.contenedores.length + 1 },
      ];
    }
    setDua((prev) => ({ ...prev, contenedores: updated }));
    setContDraft(emptyContenedorDraft());
    setEditingContId(null);
  };

  const handleDeleteContenedor = (id: string) => {
    const filtered = dua.contenedores
      .filter((c) => c.id !== id)
      .map((c, idx) => ({ ...c, sec: idx + 1 }));
    setDua((prev) => ({ ...prev, contenedores: filtered }));
  };

  // Documentos Grid CRUD
  const handleSaveDocumento = () => {
    if (!docDraft.noReferencia.trim() || !docDraft.emitidoPor.trim()) {
      setValidationErrors(['Digite el Emisor y No. de Referencia del documento soporte.']);
      return;
    }
    setValidationErrors([]);
    let updated: DocumentoAdjuntoItem[];
    if (editingDocId) {
      updated = dua.documentos.map((d) =>
        d.id === editingDocId ? { ...docDraft, id: editingDocId, sec: d.sec } : d
      );
    } else {
      updated = [
        ...dua.documentos,
        { ...docDraft, id: `doc-${Date.now()}`, sec: dua.documentos.length + 1 },
      ];
    }
    setDua((prev) => ({ ...prev, documentos: updated }));
    setDocDraft(emptyDocumentoDraft(sessionUser));
    setEditingDocId(null);
  };

  const handleDeleteDocumento = (id: string) => {
    const filtered = dua.documentos
      .filter((d) => d.id !== id)
      .map((d, idx) => ({ ...d, sec: idx + 1 }));
    setDua((prev) => ({ ...prev, documentos: filtered }));
  };

  const handleDocFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocDraft((prev) => ({
      ...prev,
      archivoNombre: file.name,
      archivoTamano: `${Math.max(1, Math.round(file.size / 1024))} KB`,
    }));
    e.target.value = '';
  };

  const handleGuardarTemporal = () => {
    setValidationErrors([]);
    const toSave = {
      ...dua,
      noDeclaracion: dua.noDeclaracion || generateDeclarationNumber(dua.adminCodigo, existingDuas),
      estado: 'Temporal' as const,
    };
    const saved = onSaveTemporal(toSave);
    setDua(saved);
    setSuccessDialog({
      title: 'Declaración Guardada como Temporal',
      message: `La declaración ${saved.noDeclaracion} fue almacenada como Temporal. Puede modificarla, generar su XML o presentarla definitivamente cuando esté lista.`,
      dua: saved,
    });
  };

  const handlePresentar = () => {
    const errs = validateDuaForSubmission(dua);
    if (errs.length > 0) {
      setValidationErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setValidationErrors([]);
    const result = onPresentDua(dua);
    setDua(result.dua);
    setSuccessDialog({
      title: 'Información — Los datos fueron archivados',
      message: `La solicitud de entrada de la carga ha sido generada, su número de solicitud es: ${result.eged}. Declaración asignada: ${result.dua.noDeclaracion}. Se aplicó el cargo de Formulario DUA (RD$ 300.00).`,
      dua: result.dua,
    });
  };

  return (
    <div className="space-y-4">
      {/* SIGA Screen Header Bar */}
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono font-semibold text-[#0B3B60]">[wcEC010101]</span>
            <span>·</span>
            <span>Estado: <strong className="text-slate-800">{dua.estado}</strong></span>
            {dua.noDeclaracion && (
              <>
                <span>·</span>
                <span className="font-mono font-semibold text-slate-800">{dua.noDeclaracion}</span>
              </>
            )}
          </div>
          <h1 className="text-base font-bold text-slate-900 mt-0.5">
            Registrar Información Declaración de Exportación (DUA)
          </h1>
        </div>

        {/* SIGA Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowXmlPanel(!showXmlPanel)}
            disabled={isLockedSubmitted}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0B3B60] hover:bg-[#092e4b] disabled:opacity-50 rounded flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" />
            Adjuntar (XML)
          </button>
          <button
            type="button"
            onClick={handleDownloadXml}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar XML
          </button>
          <button
            type="button"
            onClick={handleGuardarTemporal}
            disabled={isLockedSubmitted}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0B3B60] hover:bg-[#092e4b] disabled:opacity-50 rounded flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Save className="w-3.5 h-3.5" />
            Guardar
          </button>
          <button
            type="button"
            onClick={handlePresentar}
            disabled={isLockedSubmitted}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 rounded flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            Presentar
          </button>
          {isLockedSubmitted && !dua.tasaPagada && (
            <button
              type="button"
              onClick={() => onOpenPayment(dua)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Pagar RD$300
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenPrint(dua)}
            disabled={!dua.tasaPagada}
            title={dua.tasaPagada ? 'Imprimir DUA' : 'Deshabilitado hasta efectuar el pago de RD$300.00 (Pág. 22)'}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-45 disabled:cursor-not-allowed rounded flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
          <button
            type="button"
            onClick={onGoToList}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <List className="w-3.5 h-3.5" />
            Listado
          </button>
        </div>
      </div>

      {/* XML Load From File Panel (Page 12) */}
      {showXmlPanel && (
        <div className="bg-white border border-slate-300 rounded-lg p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-[#0B3B60]" />
                Load From File (XML) — Llenado Electrónico DUA vía XML
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cargue un archivo .XML generado por su ERP o pruebe con la plantilla oficial simulada de DUA Exportación.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLoadSampleXml}
              className="px-3 py-1.5 text-xs font-semibold text-[#0B3B60] bg-sky-50 border border-sky-200 hover:bg-sky-100 rounded transition-colors"
            >
              Cargar XML de Ejemplo (Cacao Orgánico EPA)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200 rounded p-3">
            <span className="text-xs font-medium text-slate-700 min-w-[140px]">Load From File (XML):</span>
            <input
              ref={xmlFileRef}
              type="file"
              accept=".xml,text/xml"
              onChange={handleXmlUpload}
              className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-slate-300 file:text-xs file:font-medium file:bg-white file:text-slate-700 hover:file:bg-slate-100 flex-1"
            />
            <button
              type="button"
              onClick={() => xmlFileRef.current?.click()}
              className="px-4 py-1.5 bg-[#65A30D] hover:bg-[#4D7C0F] text-white text-xs font-semibold rounded transition-colors"
            >
              Explorar Archivo
            </button>
          </div>

          {xmlFeedback && (
            <div
              className={`p-3 rounded text-xs flex items-center gap-2 border ${
                xmlFeedback.type === 'ok'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              {xmlFeedback.type === 'ok' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-700" />
              )}
              <span>{xmlFeedback.text}</span>
            </div>
          )}
        </div>
      )}

      {/* Validation Errors Banner */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-red-900">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Alerta de Validación SIGA (Campos obligatorios * o reglas aduaneras)
          </div>
          <ul className="list-disc pl-5 text-xs text-red-800 space-y-0.5">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submitted Banner */}
      {isLockedSubmitted && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-sky-900">
          <div>
            <strong>Declaración Presentada ({dua.estado}):</strong> Según el Manual SIGA (pág. 3 y 12), tras pulsar Presentar los datos no pueden editarse directamente; debe enviar una <em>Solicitud de Corrección</em>.
          </div>
          <button
            type="button"
            onClick={() => onOpenDgiiBridge(dua)}
            className="px-3 py-1.5 bg-[#0B3B60] text-white font-semibold rounded hover:bg-[#092e4b]"
          >
            Validar Cruce DGII (e-CF 46 / 607)
          </button>
        </div>
      )}

      {/* SECTION 1: Datos Generales - Declaración */}
      <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#0B3B60] uppercase tracking-wide">
            Datos Generales — Declaración
          </h2>
          <span className="text-[11px] text-slate-500">Los campos con <span className="text-red-600 font-bold">*</span> son obligatorios</span>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 text-xs">
          {/* Fecha de Declaración */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">Fecha de Declaración</label>
            <div className="col-span-8">
              <input
                type="text"
                value={dua.fechaDeclaracion}
                onChange={(e) => updateField('fechaDeclaracion', e.target.value)}
                disabled={isLockedSubmitted}
                className="w-full px-2.5 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded text-slate-800"
              />
            </div>
          </div>

          {/* Tipo de Despacho */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">
              <span className="text-red-600 font-bold mr-1">*</span>Tipo de Despacho
            </label>
            <div className="col-span-8">
              <select
                value={dua.tipoDespacho}
                onChange={(e) => updateField('tipoDespacho', e.target.value as 'General' | 'Centro Logístico')}
                disabled={isLockedSubmitted}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800"
              >
                <option value="General">General</option>
                <option value="Centro Logístico">Centro Logístico</option>
              </select>
            </div>
          </div>

          {/* Administración */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">
              <span className="text-red-600 font-bold mr-1">*</span>Administración
            </label>
            <div className="col-span-8 flex items-center gap-1.5">
              <input
                type="text"
                value={dua.adminCodigo}
                readOnly
                className="w-20 px-2 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded text-slate-900"
              />
              <input
                type="text"
                value={dua.adminNombre}
                readOnly
                placeholder="Buscar administración..."
                className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 truncate"
              />
              <button
                type="button"
                onClick={() => setLookupKind('admin')}
                disabled={isLockedSubmitted}
                title="Buscar Administración Aduanera"
                className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60] disabled:opacity-40"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDua((p) => ({ ...p, adminCodigo: '', adminNombre: '' }))}
                disabled={isLockedSubmitted}
                title="Limpiar"
                className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* No. de Declaración */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">
              <span className="text-red-600 font-bold mr-1">*</span>No. de Declaración
            </label>
            <div className="col-span-8 flex items-center gap-1.5">
              <input
                type="text"
                value={dua.noDeclaracion}
                onChange={(e) => updateField('noDeclaracion', e.target.value)}
                placeholder="Se asigna al Generar o Presentar"
                disabled={isLockedSubmitted}
                className="flex-1 px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-slate-50 text-slate-900"
              />
              <button
                type="button"
                onClick={handleGenerateDuaNumber}
                disabled={isLockedSubmitted}
                className="px-2.5 py-1.5 text-xs font-medium bg-[#0B3B60] text-white rounded hover:bg-[#092e4b] disabled:opacity-40 whitespace-nowrap"
              >
                Generar
              </button>
            </div>
          </div>

          {/* Doc. de Embarque */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">Doc. de Embarque (B/L)</label>
            <div className="col-span-8">
              <input
                type="text"
                value={dua.docEmbarque}
                onChange={(e) => updateField('docEmbarque', e.target.value)}
                placeholder="Conocimiento de embarque o guía aérea"
                disabled={isLockedSubmitted}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Depósito de Origen */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">
              <span className="text-red-600 font-bold mr-1">*</span>Depósito de Origen
            </label>
            <div className="col-span-8 flex items-center gap-1.5">
              <input type="text" value={dua.depositoOrigenCodigo} readOnly className="w-20 px-2 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded" />
              <input type="text" value={dua.depositoOrigenNombre} readOnly className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded truncate" />
              <button type="button" onClick={() => setLookupKind('deposito')} disabled={isLockedSubmitted} className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60] disabled:opacity-40">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Puerto de Salida */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">
              <span className="text-red-600 font-bold mr-1">*</span>Puerto de Salida
            </label>
            <div className="col-span-8 flex items-center gap-1.5">
              <input type="text" value={dua.puertoSalidaCodigo} readOnly className="w-20 px-2 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded" />
              <input type="text" value={dua.puertoSalidaNombre} readOnly className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded truncate" />
              <button type="button" onClick={() => setLookupKind('puerto')} disabled={isLockedSubmitted} className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60] disabled:opacity-40">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* País de Destino */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">
              <span className="text-red-600 font-bold mr-1">*</span>País de Destino
            </label>
            <div className="col-span-8 flex items-center gap-1.5">
              <input type="text" value={dua.paisDestinoCodigo} readOnly className="w-20 px-2 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded" />
              <input type="text" value={dua.paisDestinoNombre} readOnly className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded truncate" />
              <button type="button" onClick={() => setLookupKind('pais-destino')} disabled={isLockedSubmitted} className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60] disabled:opacity-40">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Empresa Transportista */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">
              <span className="text-red-600 font-bold mr-1">*</span>Empresa Transportista
            </label>
            <div className="col-span-8 flex items-center gap-1.5">
              <input type="text" value={dua.empresaTransportistaCodigo} readOnly placeholder="Cód." className="w-20 px-2 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded" />
              <input type="text" value={dua.empresaTransportistaNombre} readOnly placeholder="Seleccione naviera o aerolínea..." className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded truncate" />
              <button type="button" onClick={() => setLookupKind('transportista')} disabled={isLockedSubmitted} className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60] disabled:opacity-40">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* No. de Viaje / Vuelo */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">No. de Viaje / Vuelo</label>
            <div className="col-span-8">
              <input
                type="text"
                value={dua.noViajeVuelo}
                onChange={(e) => updateField('noViajeVuelo', e.target.value)}
                placeholder="Ej. 226N"
                disabled={isLockedSubmitted}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
              />
            </div>
          </div>

          {/* Nacionalidad de Empresa Transportista */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">Nacionalidad Transportista</label>
            <div className="col-span-8 flex items-center gap-1.5">
              <input type="text" value={dua.nacionalidadTransportistaCodigo} readOnly className="w-20 px-2 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded" />
              <input type="text" value={dua.nacionalidadTransportistaNombre} readOnly className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded truncate" />
              <button type="button" onClick={() => setLookupKind('pais-transportista')} disabled={isLockedSubmitted} className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60] disabled:opacity-40">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Nombre Medio de Transporte */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">Nombre Medio de Transporte</label>
            <div className="col-span-8">
              <select
                value={dua.medioTransporte}
                onChange={(e) => updateField('medioTransporte', e.target.value)}
                disabled={isLockedSubmitted}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
              >
                <option value="[HR32-1] MARÍTIMAS">[HR32-1] MARÍTIMAS</option>
                <option value="[AR10-1] AÉREO">[AR10-1] AÉREO</option>
                <option value="[TR20-1] TERRESTRE">[TR20-1] TERRESTRE</option>
              </select>
            </div>
          </div>

          {/* Fecha de Llegada */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-4 text-slate-700 font-medium">Fecha de Llegada Estimada</label>
            <div className="col-span-8">
              <input
                type="text"
                value={dua.fechaLlegada}
                onChange={(e) => updateField('fechaLlegada', e.target.value)}
                placeholder="DD/MM/YYYY"
                disabled={isLockedSubmitted}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Exportador, Agente, Comprador, Régimen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Exportador */}
        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#0B3B60] uppercase tracking-wide">Exportador</h2>
            <span className="text-[11px] text-slate-500">Validación RNC DGII en vivo</span>
          </div>
          <div className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-4 text-slate-700 font-medium">
                <span className="text-red-600 font-bold mr-1">*</span>Nombre
              </label>
              <div className="col-span-8 flex items-center gap-1.5">
                <input
                  type="text"
                  value={dua.exportadorNombre}
                  onChange={(e) => updateField('exportadorNombre', e.target.value)}
                  disabled={isLockedSubmitted}
                  placeholder="Busque o digite exportador..."
                  className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
                <button type="button" onClick={() => setLookupKind('exportador')} disabled={isLockedSubmitted} className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60] disabled:opacity-40">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-4 text-slate-700 font-medium">
                <span className="text-red-600 font-bold mr-1">*</span>Documento
              </label>
              <div className="col-span-8 space-y-1">
                <div className="flex items-center gap-1.5">
                  <select
                    value={dua.exportadorDocTipo}
                    onChange={(e) => updateField('exportadorDocTipo', e.target.value as 'RNC' | 'CED')}
                    disabled={isLockedSubmitted}
                    className="w-20 px-2 py-1.5 border border-slate-300 rounded bg-white font-mono"
                  >
                    <option value="RNC">RNC</option>
                    <option value="CED">CED</option>
                  </select>
                  <input
                    type="text"
                    value={dua.exportadorDocNumero}
                    onChange={(e) => updateField('exportadorDocNumero', e.target.value)}
                    disabled={isLockedSubmitted}
                    className="flex-1 px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
                  />
                </div>
                {dua.exportadorDocNumero && (
                  <p className={`text-[11px] ${rncValidation.valid ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {rncValidation.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-4 text-slate-700 font-medium">Dirección</label>
              <div className="col-span-8">
                <input type="text" value={dua.exportadorDireccion} onChange={(e) => updateField('exportadorDireccion', e.target.value)} disabled={isLockedSubmitted} className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-slate-50" />
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-4 text-slate-700 font-medium">Teléfono / E-Mail</label>
              <div className="col-span-8 grid grid-cols-2 gap-1.5">
                <input type="text" value={dua.exportadorTelefono} onChange={(e) => updateField('exportadorTelefono', e.target.value)} disabled={isLockedSubmitted} placeholder="Teléfono" className="px-2.5 py-1.5 border border-slate-300 rounded bg-slate-50" />
                <input type="email" value={dua.exportadorEmail} onChange={(e) => updateField('exportadorEmail', e.target.value)} disabled={isLockedSubmitted} placeholder="E-Mail" className="px-2.5 py-1.5 border border-slate-300 rounded bg-slate-50" />
              </div>
            </div>
          </div>
        </section>

        {/* Comprador + Régimen + Agente */}
        <div className="space-y-4">
          <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2">
              <h2 className="text-xs font-bold text-[#0B3B60] uppercase tracking-wide">Comprador (Extranjero)</h2>
            </div>
            <div className="p-4 space-y-2.5 text-xs">
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-slate-700 font-medium">
                  <span className="text-red-600 font-bold mr-1">*</span>Nombre
                </label>
                <div className="col-span-8 flex items-center gap-1.5">
                  <input type="text" value={dua.compradorNombre} onChange={(e) => updateField('compradorNombre', e.target.value)} disabled={isLockedSubmitted} placeholder="Busque comprador extranjero..." className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded bg-white" />
                  <button type="button" onClick={() => setLookupKind('comprador')} disabled={isLockedSubmitted} className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60] disabled:opacity-40">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-slate-700 font-medium">Nacionalidad / Tax ID</label>
                <div className="col-span-8 flex items-center gap-1.5">
                  <input type="text" value={dua.compradorNacionalidadNombre} readOnly placeholder="País" className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded" />
                  <input type="text" value={dua.compradorDocNumero} onChange={(e) => updateField('compradorDocNumero', e.target.value)} disabled={isLockedSubmitted} placeholder="TID / Pasaporte" className="w-32 px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2">
              <h2 className="text-xs font-bold text-[#0B3B60] uppercase tracking-wide">Régimen Aduanero y Acuerdo</h2>
            </div>
            <div className="p-4 space-y-2.5 text-xs">
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-slate-700 font-medium">
                  <span className="text-red-600 font-bold mr-1">*</span>Régimen
                </label>
                <div className="col-span-8 flex items-center gap-1.5">
                  <input type="text" value={dua.regimenCodigo} readOnly className="w-14 px-2 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded text-center" />
                  <input type="text" value={dua.regimenNombre} readOnly className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded truncate" />
                  <button type="button" onClick={() => setLookupKind('regimen')} disabled={isLockedSubmitted} className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60] disabled:opacity-40">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-slate-700 font-medium">Acuerdo</label>
                <div className="col-span-8 flex items-center gap-1.5">
                  <input type="text" value={dua.acuerdoCodigo} readOnly className="w-14 px-2 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded text-center" />
                  <input type="text" value={dua.acuerdoNombre} readOnly className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded truncate" />
                  <button type="button" onClick={() => setLookupKind('acuerdo')} disabled={isLockedSubmitted} className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60] disabled:opacity-40">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* SECTION 3: Detalle de Mercancía (Pages 17-19) */}
      <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold text-[#0B3B60] uppercase tracking-wide">
            Detalle — Partidas Arancelarias y Mercancía
          </h2>
          {!isLockedSubmitted && (
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={handleSaveDetalle} className="px-2.5 py-1 bg-[#65A30D] hover:bg-[#4D7C0F] text-white text-xs font-semibold rounded flex items-center gap-1">
                {editingDetId ? <Pencil className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                {editingDetId ? 'Modificar' : 'Agregar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDetDraft(emptyDetalleDraft());
                  setEditingDetId(null);
                }}
                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Limpiar
              </button>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4 text-xs">
          {!isLockedSubmitted && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-2.5 bg-slate-50/70 border border-slate-200 rounded p-3.5">
              {/* Código S.A. */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700"><span className="text-red-600 font-bold mr-1">*</span>Código de S.A. (8 dígitos)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={detDraft.codigoSA}
                    onChange={(e) => setDetDraft((p) => ({ ...p, codigoSA: e.target.value }))}
                    placeholder="Ej. 6205.20.00"
                    className="flex-1 px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
                  />
                  <button type="button" onClick={() => setLookupKind('codigo-sa')} className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60]">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Producto */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700"><span className="text-red-600 font-bold mr-1">*</span>Producto</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={detDraft.productoNombre}
                    onChange={(e) => setDetDraft((p) => ({ ...p, productoNombre: e.target.value, descripcion: e.target.value }))}
                    placeholder="Busque o digite producto..."
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                  <button type="button" onClick={() => setLookupKind('producto')} className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60]">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Estado */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700"><span className="text-red-600 font-bold mr-1">*</span>Estado</label>
                <select
                  value={detDraft.estado}
                  onChange={(e) => setDetDraft((p) => ({ ...p, estado: e.target.value as 'NUEVO' | 'USADO' | 'RECONSTRUIDO' }))}
                  className="px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="NUEVO">NUEVO</option>
                  <option value="USADO">USADO</option>
                  <option value="RECONSTRUIDO">RECONSTRUIDO</option>
                </select>
              </div>

              {/* Unidad & Cantidad & FOB */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700"><span className="text-red-600 font-bold mr-1">*</span>Unidad y Cantidad</label>
                <div className="flex gap-1.5">
                  <input type="text" value={detDraft.unidad} onChange={(e) => setDetDraft((p) => ({ ...p, unidad: e.target.value }))} className="w-28 px-2 py-1.5 border border-slate-300 rounded bg-white" />
                  <input type="number" step="any" min="0" value={detDraft.cantidad} onChange={(e) => setDetDraft((p) => ({ ...p, cantidad: Number(e.target.value) }))} className="flex-1 px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-right" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700"><span className="text-red-600 font-bold mr-1">*</span>FOB Unitario (US$) & Peso Neto (Kg)</label>
                <div className="flex gap-1.5">
                  <input type="number" step="any" min="0" value={detDraft.fobUnitario} onChange={(e) => setDetDraft((p) => ({ ...p, fobUnitario: Number(e.target.value) }))} placeholder="FOB US$" className="flex-1 px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-right" />
                  <input type="number" step="any" min="0" value={detDraft.pesoKg} onChange={(e) => setDetDraft((p) => ({ ...p, pesoKg: Number(e.target.value) }))} placeholder="Kg" className="flex-1 px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-right" />
                </div>
              </div>

              {/* País de Origen */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700"><span className="text-red-600 font-bold mr-1">*</span>País de Origen</label>
                <div className="flex items-center gap-1">
                  <input type="text" value={detDraft.paisOrigenNombre} readOnly className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded bg-white" />
                  <button type="button" onClick={() => setLookupKind('pais-origen')} className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60]">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Certificado de Origen */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-slate-700 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={detDraft.certificadoOrigen}
                    onChange={(e) => setDetDraft((p) => ({ ...p, certificadoOrigen: e.target.checked }))}
                  />
                  Certificado de Origen (Secuencia)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={detDraft.certificadoSecuencia}
                    onChange={(e) => setDetDraft((p) => ({ ...p, certificadoSecuencia: e.target.value }))}
                    disabled={!detDraft.certificadoOrigen}
                    placeholder="CO-2026-..."
                    className="flex-1 px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white disabled:bg-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setLookupKind('certificado-origen')}
                    disabled={!detDraft.certificadoOrigen}
                    className="p-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-[#0B3B60] disabled:opacity-40"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Descripción Mercancía */}
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="font-medium text-slate-700">Descripción Comercial de la Mercancía</label>
                <input
                  type="text"
                  value={detDraft.descripcionMercancia}
                  onChange={(e) => setDetDraft((p) => ({ ...p, descripcionMercancia: e.target.value }))}
                  placeholder="Detalle comercial, empaque, marcas, presentación..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>

              {/* Conditional Alcohol / Vehicle fields (Pages 18-19) */}
              {saMetadata?.esAlcohol && (
                <div className="md:col-span-3 grid grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Grado de Alcohol (%)</label>
                    <input type="number" step="0.1" value={detDraft.gradoAlcohol} onChange={(e) => setDetDraft((p) => ({ ...p, gradoAlcohol: Number(e.target.value) }))} className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white" />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Precio al por Menor (&gt; 1)</label>
                    <input type="number" step="0.01" value={detDraft.precioPorMenor} onChange={(e) => setDetDraft((p) => ({ ...p, precioPorMenor: Number(e.target.value) }))} className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white" />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">No. de Serie (Bebida Alcohólica)</label>
                    <input type="text" value={detDraft.noSerie} onChange={(e) => setDetDraft((p) => ({ ...p, noSerie: e.target.value }))} className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white" />
                  </div>
                </div>
              )}

              {saMetadata?.esVehiculo && (
                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 border-t border-slate-200">
                  <input type="text" placeholder="Tipo Vehículo" value={detDraft.tipoVehiculo} onChange={(e) => setDetDraft((p) => ({ ...p, tipoVehiculo: e.target.value }))} className="px-2 py-1.5 border border-slate-300 rounded bg-white" />
                  <input type="text" placeholder="Chasis (VIN)" value={detDraft.chasisVehiculo} onChange={(e) => setDetDraft((p) => ({ ...p, chasisVehiculo: e.target.value }))} className="px-2 py-1.5 font-mono border border-slate-300 rounded bg-white" />
                  <input type="text" placeholder="Color" value={detDraft.colorVehiculo} onChange={(e) => setDetDraft((p) => ({ ...p, colorVehiculo: e.target.value }))} className="px-2 py-1.5 border border-slate-300 rounded bg-white" />
                  <input type="text" placeholder="No. Motor" value={detDraft.motorVehiculo} onChange={(e) => setDetDraft((p) => ({ ...p, motorVehiculo: e.target.value }))} className="px-2 py-1.5 font-mono border border-slate-300 rounded bg-white" />
                  <input type="number" placeholder="CC / Año" value={detDraft.vehiculoCC || ''} onChange={(e) => setDetDraft((p) => ({ ...p, vehiculoCC: Number(e.target.value) }))} className="px-2 py-1.5 font-mono border border-slate-300 rounded bg-white" />
                </div>
              )}
            </div>
          )}

          {/* Items Table */}
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#65A30D] text-white">
                <tr>
                  <th className="px-2.5 py-2">Sec.</th>
                  <th className="px-2.5 py-2">Código S.A.</th>
                  <th className="px-2.5 py-2">Producto</th>
                  <th className="px-2.5 py-2 text-right">FOB Unit (US$)</th>
                  <th className="px-2.5 py-2 text-right">Cantidad</th>
                  <th className="px-2.5 py-2 text-right">FOB Subtotal</th>
                  <th className="px-2.5 py-2 text-right">Peso (Kg)</th>
                  <th className="px-2.5 py-2">Origen</th>
                  {!isLockedSubmitted && <th className="px-2.5 py-2 text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dua.detalles.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-slate-500">
                      No hay partidas arancelarias agregadas. Use la lupa de Código de S.A. y Producto y pulse <strong>Agregar</strong>.
                    </td>
                  </tr>
                ) : (
                  dua.detalles.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="px-2.5 py-2 font-mono tabular-nums">{d.sec}</td>
                      <td className="px-2.5 py-2 font-mono font-semibold text-[#0B3B60] tabular-nums">{d.codigoSA}</td>
                      <td className="px-2.5 py-2">
                        <div className="font-medium text-slate-900">{d.productoNombre}</div>
                        {d.descripcionMercancia && <div className="text-[11px] text-slate-500">{d.descripcionMercancia}</div>}
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono tabular-nums">${formatMoney(d.fobUnitario, 4)}</td>
                      <td className="px-2.5 py-2 text-right font-mono tabular-nums">{formatMoney(d.cantidad)} {d.unidad}</td>
                      <td className="px-2.5 py-2 text-right font-mono font-semibold tabular-nums">${formatMoney(d.cantidad * d.fobUnitario)}</td>
                      <td className="px-2.5 py-2 text-right font-mono tabular-nums">{formatMoney(d.pesoKg)}</td>
                      <td className="px-2.5 py-2 text-slate-700">{d.paisOrigenNombre}</td>
                      {!isLockedSubmitted && (
                        <td className="px-2.5 py-2 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              const { id: _id, sec: _sec, ...rest } = d;
                              setDetDraft(rest);
                              setEditingDetId(d.id);
                            }}
                            className="p-1 text-[#0B3B60] hover:bg-sky-50 rounded mr-1"
                            title="Editar ítem"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDetalle(d.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Borrar ítem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 4: Contenedor & Documentos (Pages 19-20) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contenedor */}
        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#0B3B60] uppercase tracking-wide">Contenedor</h2>
            <label className="text-xs text-slate-700 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={dua.aGranel}
                disabled={isLockedSubmitted}
                onChange={(e) => updateField('aGranel', e.target.checked)}
              />
              Carga a granel (dejar en blanco)
            </label>
          </div>
          <div className="p-4 space-y-3 text-xs">
            {!dua.aGranel && !isLockedSubmitted && (
              <div className="grid grid-cols-2 gap-2.5 bg-slate-50 border border-slate-200 rounded p-3">
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">* Tipo de Contenedor</label>
                  <select
                    value={contDraft.tipoContenedor}
                    onChange={(e) => setContDraft((p) => ({ ...p, tipoContenedor: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    {TIPOS_CONTENEDOR.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">* No. de Contenedor</label>
                  <input type="text" value={contDraft.numeroContenedor} onChange={(e) => setContDraft((p) => ({ ...p, numeroContenedor: e.target.value.toUpperCase() }))} placeholder="Ej. MSCU1234567" className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Sello / No. Placa</label>
                  <div className="flex gap-1.5">
                    <input type="text" value={contDraft.sello} onChange={(e) => setContDraft((p) => ({ ...p, sello: e.target.value }))} placeholder="Sello" className="w-1/2 px-2 py-1.5 font-mono border border-slate-300 rounded bg-white" />
                    <input type="text" value={contDraft.noPlaca} onChange={(e) => setContDraft((p) => ({ ...p, noPlaca: e.target.value }))} placeholder="Placa" className="w-1/2 px-2 py-1.5 font-mono border border-slate-300 rounded bg-white" />
                  </div>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button type="button" onClick={handleSaveContenedor} className="px-3 py-1 bg-[#65A30D] hover:bg-[#4D7C0F] text-white font-semibold rounded">
                    {editingContId ? 'Modificar' : 'Agregar'}
                  </button>
                </div>
              </div>
            )}

            <table className="w-full text-left border-collapse border border-slate-200">
              <thead className="bg-[#65A30D] text-white">
                <tr>
                  <th className="px-2.5 py-1.5">Tipo</th>
                  <th className="px-2.5 py-1.5">No. Contenedor</th>
                  <th className="px-2.5 py-1.5">Sello</th>
                  {!isLockedSubmitted && <th className="px-2.5 py-1.5 text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dua.contenedores.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-slate-500">
                      {dua.aGranel ? 'Mercancía declarada a granel.' : 'Sin contenedores registrados.'}
                    </td>
                  </tr>
                ) : (
                  dua.contenedores.map((c) => (
                    <tr key={c.id}>
                      <td className="px-2.5 py-1.5">{c.tipoContenedor}</td>
                      <td className="px-2.5 py-1.5 font-mono font-semibold">{c.numeroContenedor}</td>
                      <td className="px-2.5 py-1.5 font-mono">{c.sello || '—'}</td>
                      {!isLockedSubmitted && (
                        <td className="px-2.5 py-1.5 text-right">
                          <button type="button" onClick={() => handleDeleteContenedor(c.id)} className="text-red-600 hover:underline">
                            Borrar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Documentos & Adjuntar (with DGII e-CF 46 / NCF 16 validator) */}
        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#0B3B60] uppercase tracking-wide">Documentos y Adjuntos (DGII / Comercial)</h2>
          </div>
          <div className="p-4 space-y-3 text-xs">
            {!isLockedSubmitted && (
              <div className="grid grid-cols-2 gap-2.5 bg-slate-50 border border-slate-200 rounded p-3">
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">* Tipo de Doc.</label>
                  <select
                    value={docDraft.tipoDocumento}
                    onChange={(e) => setDocDraft((p) => ({ ...p, tipoDocumento: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    {TIPOS_DOCUMENTO.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">* No. de Referencia (e-CF / Factura)</label>
                  <input
                    type="text"
                    value={docDraft.noReferencia}
                    onChange={(e) => setDocDraft((p) => ({ ...p, noReferencia: e.target.value.toUpperCase() }))}
                    placeholder="Ej. E460000000189"
                    className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">* Emitido por</label>
                  <input
                    type="text"
                    value={docDraft.emitidoPor}
                    onChange={(e) => setDocDraft((p) => ({ ...p, emitidoPor: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>

                {ncfDraftValidation && docDraft.noReferencia && (
                  <div
                    className={`col-span-2 text-[11px] px-2.5 py-1.5 rounded border ${
                      ncfDraftValidation.severity === 'ok'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : ncfDraftValidation.severity === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {ncfDraftValidation.message}
                  </div>
                )}

                <div className="col-span-2 flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <input ref={docFileRef} type="file" onChange={handleDocFilePick} className="hidden" />
                    <button
                      type="button"
                      onClick={() => docFileRef.current?.click()}
                      className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-slate-700 flex items-center gap-1"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      {docDraft.archivoNombre ? docDraft.archivoNombre : 'Elegir Archivo'}
                    </button>
                  </div>
                  <button type="button" onClick={handleSaveDocumento} className="px-3 py-1 bg-[#65A30D] hover:bg-[#4D7C0F] text-white font-semibold rounded">
                    {editingDocId ? 'Modificar' : 'Agregar'}
                  </button>
                </div>
              </div>
            )}

            <table className="w-full text-left border-collapse border border-slate-200">
              <thead className="bg-[#65A30D] text-white">
                <tr>
                  <th className="px-2.5 py-1.5">Tipo Doc.</th>
                  <th className="px-2.5 py-1.5">No. Referencia</th>
                  <th className="px-2.5 py-1.5">Adjunto</th>
                  {!isLockedSubmitted && <th className="px-2.5 py-1.5 text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dua.documentos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-slate-500">
                      Agregue su Factura Comercial y Comprobante DGII (e-CF 46 / B16).
                    </td>
                  </tr>
                ) : (
                  dua.documentos.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-2.5 py-1.5">{doc.tipoDocumento}</td>
                      <td className="px-2.5 py-1.5 font-mono font-semibold">{doc.noReferencia}</td>
                      <td className="px-2.5 py-1.5 text-slate-600">{doc.archivoNombre || 'Digital'}</td>
                      {!isLockedSubmitted && (
                        <td className="px-2.5 py-1.5 text-right">
                          <button type="button" onClick={() => handleDeleteDocumento(doc.id)} className="text-red-600 hover:underline">
                            Borrar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* SECTION 5: Valor (US$) & Peso de Mercancía & Observación (Page 21) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2">
            <h2 className="text-xs font-bold text-[#0B3B60] uppercase tracking-wide">Valor (US$ / RD$)</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Tasa de Cambio (RD$)</label>
              <input
                type="number"
                step="0.01"
                value={dua.tasaCambio}
                onChange={(e) => updateField('tasaCambio', Number(e.target.value))}
                disabled={isLockedSubmitted}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-right tabular-nums"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1"><span className="text-red-600 font-bold mr-1">*</span>Valor FOB Total (US$)</label>
              <input
                type="text"
                value={formatMoney(dua.valorFobTotal)}
                readOnly
                className="w-full px-2.5 py-1.5 font-mono font-bold border border-slate-300 rounded bg-slate-50 text-right tabular-nums text-[#0B3B60]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Flete (US$)</label>
              <input
                type="number"
                step="0.01"
                value={dua.flete}
                onChange={(e) => updateField('flete', Number(e.target.value))}
                disabled={isLockedSubmitted}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-right tabular-nums"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Seguro (US$)</label>
              <input
                type="number"
                step="0.01"
                value={dua.seguro}
                onChange={(e) => updateField('seguro', Number(e.target.value))}
                disabled={isLockedSubmitted}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-right tabular-nums"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Otro (US$)</label>
              <input
                type="number"
                step="0.01"
                value={dua.otroGasto}
                onChange={(e) => updateField('otroGasto', Number(e.target.value))}
                disabled={isLockedSubmitted}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-right tabular-nums"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Valor CIF Total (US$ / RD$)</label>
              <div className="flex gap-1.5">
                <input type="text" value={`$${formatMoney(dua.valorCifTotalUsd)}`} readOnly className="w-1/2 px-2 py-1.5 font-mono font-semibold bg-slate-50 border border-slate-300 rounded text-right tabular-nums" />
                <input type="text" value={`RD$${formatMoney(dua.valorCifTotalRd)}`} readOnly className="w-1/2 px-2 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded text-right tabular-nums" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2">
            <h2 className="text-xs font-bold text-[#0B3B60] uppercase tracking-wide">Peso de Mercancía y Observación</h2>
          </div>
          <div className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1"><span className="text-red-600 font-bold mr-1">*</span>Peso Bruto (KG)</label>
                <input
                  type="number"
                  step="any"
                  value={dua.pesoBrutoKg}
                  onChange={(e) => updateField('pesoBrutoKg', Number(e.target.value))}
                  disabled={isLockedSubmitted}
                  className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-right tabular-nums"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Peso Neto (KG)</label>
                <input
                  type="text"
                  value={formatMoney(dua.pesoNetoKg)}
                  readOnly
                  className="w-full px-2.5 py-1.5 font-mono bg-slate-50 border border-slate-300 rounded text-right tabular-nums"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Observación</label>
              <textarea
                rows={3}
                value={dua.observacion}
                onChange={(e) => updateField('observacion', e.target.value)}
                disabled={isLockedSubmitted}
                placeholder="Aclaraciones del exportador o notas aduaneras..."
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Lookup Modal */}
      <LookupModal
        kind={lookupKind}
        onClose={() => setLookupKind(null)}
        onSelect={handleLookupSelect}
        filterSA={detDraft.codigoSA}
        duas={existingDuas}
      />

      {/* SIGA Information Dialog (Page 22) */}
      {successDialog && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white border border-slate-300 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-[#0B3B60] text-white px-4 py-3 text-sm font-semibold">
              {successDialog.title}
            </div>
            <div className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-[#0B3B60] flex items-center justify-center shrink-0 font-bold text-lg">
                i
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{successDialog.message}</p>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-end gap-2">
              {successDialog.dua.estado !== 'Temporal' && !successDialog.dua.tasaPagada && (
                <button
                  type="button"
                  onClick={() => {
                    const target = successDialog.dua;
                    setSuccessDialog(null);
                    onOpenPayment(target);
                  }}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded"
                >
                  Pagar Tasa RD$300.00 Ahora
                </button>
              )}
              <button
                type="button"
                onClick={() => setSuccessDialog(null)}
                className="px-5 py-1.5 bg-[#0B3B60] hover:bg-[#092e4b] text-white text-xs font-semibold rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
