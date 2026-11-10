import {
  ContenedorItem,
  DeclaracionDUA,
  DetalleMercanciaItem,
  DocumentoAdjuntoItem,
} from '../types/siga';

export function formatMoney(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0);
}

export function getTodayDdMmYyyy(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function getCurrentYyMm(): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yy}${mm}`;
}

export function generateDeclarationNumber(adminCodigo: string, existingDuas: DeclaracionDUA[]): string {
  const code = adminCodigo || '10030';
  const yymm = getCurrentYyMm();
  const prefix = `${code}-EC01-${yymm}-`;
  let maxSeq = 189;
  for (const dua of existingDuas) {
    if (dua.noDeclaracion.startsWith(prefix)) {
      const tail = parseInt(dua.noDeclaracion.slice(prefix.length), 10);
      if (!Number.isNaN(tail) && tail > maxSeq) maxSeq = tail;
    }
  }
  return `${prefix}${String(maxSeq + 1).padStart(6, '0')}`;
}

export function generateCargoEntryNumber(existingNumbers: string[]): string {
  const yymm = getCurrentYyMm();
  const prefix = `EGED-${yymm}-`;
  let maxSeq = 14;
  for (const num of existingNumbers) {
    if (num.startsWith(prefix)) {
      const tail = parseInt(num.slice(prefix.length), 10);
      if (!Number.isNaN(tail) && tail > maxSeq) maxSeq = tail;
    }
  }
  return `${prefix}${String(maxSeq + 1).padStart(6, '0')}`;
}

export function generateCorrectionNumber(adminCodigo: string, existingNumbers: string[]): string {
  const code = adminCodigo || '10030';
  const yymm = getCurrentYyMm();
  const prefix = `${code}-EC02-${yymm}-`;
  let maxSeq = 26;
  for (const num of existingNumbers) {
    if (num.startsWith(prefix)) {
      const tail = parseInt(num.slice(prefix.length), 10);
      if (!Number.isNaN(tail) && tail > maxSeq) maxSeq = tail;
    }
  }
  return `${prefix}${String(maxSeq + 1).padStart(6, '0')}`;
}

export interface RncValidationResult {
  valid: boolean;
  isManualDemo: boolean;
  message: string;
}

export function validateRncOrCedula(docTipo: 'RNC' | 'CED', raw: string): RncValidationResult {
  const clean = raw.replace(/[^0-9]/g, '');
  if (!clean) {
    return { valid: false, isManualDemo: false, message: 'Debe ingresar un número de identificación.' };
  }
  if (clean === '123456789' || clean === '0909090909' || clean === '0987654321') {
    return {
      valid: true,
      isManualDemo: true,
      message: 'Identificador de ejemplo del Manual Oficial SIGA DGA (válido para práctica).',
    };
  }
  if (docTipo === 'RNC') {
    if (clean.length !== 9) {
      return { valid: false, isManualDemo: false, message: 'El RNC ante DGII debe tener exactamente 9 dígitos.' };
    }
    const weights = [7, 9, 8, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += Number(clean[i]) * weights[i];
    }
    const rem = sum % 11;
    const expected = rem === 0 ? 2 : rem === 1 ? 1 : 11 - rem;
    if (Number(clean[8]) === expected) {
      return { valid: true, isManualDemo: false, message: 'RNC válido (dígito verificador Módulo 11 DGII correcto).' };
    }
    return {
      valid: false,
      isManualDemo: false,
      message: `RNC de 9 dígitos con dígito verificador inválido (esperado ${expected}, recibido ${clean[8]}).`,
    };
  }

  // CEDULA 11 digitos
  if (clean.length !== 11) {
    return { valid: false, isManualDemo: false, message: 'La Cédula dominicana debe tener 11 dígitos.' };
  }
  const mult = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let total = 0;
  for (let i = 0; i < 10; i++) {
    let prod = Number(clean[i]) * mult[i];
    if (prod >= 10) prod = Math.floor(prod / 10) + (prod % 10);
    total += prod;
  }
  const nextTen = Math.ceil(total / 10) * 10;
  const expectedDigit = (nextTen - total) % 10;
  if (Number(clean[10]) === expectedDigit) {
    return { valid: true, isManualDemo: false, message: 'Cédula válida (dígito verificador JCE/DGII correcto).' };
  }
  return {
    valid: false,
    isManualDemo: false,
    message: `Cédula de 11 dígitos con verificador inválido (esperado ${expectedDigit}).`,
  };
}

export interface NcfValidationResult {
  valid: boolean;
  tipo: 'E46' | 'B16' | 'E32' | 'B02' | 'DESCONOCIDO';
  severity: 'ok' | 'warning' | 'error';
  message: string;
}

export function validateEcfOrNcf(raw: string): NcfValidationResult {
  const clean = raw.trim().toUpperCase();
  if (!clean) {
    return {
      valid: false,
      tipo: 'DESCONOCIDO',
      severity: 'error',
      message: 'Ingrese un e-CF (E46...) o NCF (B16...) para validar ante DGII.',
    };
  }
  if (/^E46\d{10}$/.test(clean)) {
    return {
      valid: true,
      tipo: 'E46',
      severity: 'ok',
      message: 'e-CF Tipo 46 válido (Comprobante Electrónico para Exportaciones · ITBIS 0%).',
    };
  }
  if (/^B16\d{8}$/.test(clean)) {
    return {
      valid: true,
      tipo: 'B16',
      severity: 'ok',
      message: 'NCF Tipo 16 válido (Comprobante de Exportaciones tradicional · ITBIS 0%).',
    };
  }
  if (/^E32\d{10}$/.test(clean) || /^B02\d{8}$/.test(clean)) {
    return {
      valid: false,
      tipo: clean.startsWith('E32') ? 'E32' : 'B02',
      severity: 'warning',
      message: 'Atención DGII: E32/B02 corresponde a Consumo (usado en servicios). Para exportación de bienes en DUA use e-CF 46 o B16.',
    };
  }
  return {
    valid: false,
    tipo: 'DESCONOCIDO',
    severity: 'error',
    message: 'Formato inválido. Use E46 + 10 dígitos (ej. E460000000189) o B16 + 8 dígitos (ej. B1600000189).',
  };
}

export function recalculateDuaTotals(dua: DeclaracionDUA): DeclaracionDUA {
  const valorFobTotal = Number(
    dua.detalles.reduce((acc, item) => acc + item.cantidad * item.fobUnitario, 0).toFixed(4)
  );
  const pesoNetoKg = Number(
    dua.detalles.reduce((acc, item) => acc + Number(item.pesoKg || 0), 0).toFixed(4)
  );
  const flete = Number(dua.flete || 0);
  const seguro = Number(dua.seguro || 0);
  const otroGasto = Number(dua.otroGasto || 0);
  const tasa = Number(dua.tasaCambio || 60.2);
  const valorCifTotalUsd = Number((valorFobTotal + flete + seguro + otroGasto).toFixed(4));
  const valorCifTotalRd = Number((valorCifTotalUsd * tasa).toFixed(4));

  return {
    ...dua,
    valorFobTotal,
    pesoNetoKg,
    valorCifTotalUsd,
    valorCifTotalRd,
  };
}

export function validateDuaForSubmission(dua: DeclaracionDUA): string[] {
  const errors: string[] = [];
  if (!dua.adminCodigo) errors.push('Administración Aduanera (*) es obligatoria.');
  if (!dua.depositoOrigenCodigo) errors.push('Depósito de Origen (*) es obligatorio.');
  if (!dua.puertoSalidaCodigo) errors.push('Puerto de Salida (*) es obligatorio.');
  if (!dua.paisDestinoCodigo) errors.push('País de Destino (*) es obligatorio.');
  if (!dua.empresaTransportistaCodigo) errors.push('Empresa Transportista (*) es obligatoria.');
  if (!dua.exportadorNombre || !dua.exportadorDocNumero) {
    errors.push('Datos del Exportador (Nombre y RNC/CED *) son obligatorios.');
  }
  if (!dua.compradorNombre) errors.push('Nombre del Comprador (*) es obligatorio.');
  if (!dua.regimenCodigo) errors.push('Régimen Aduanero (*) es obligatorio.');
  if (dua.detalles.length === 0) {
    errors.push('Debe agregar al menos una partida arancelaria en Detalle de Mercancía.');
  }
  if (!dua.aGranel && dua.contenedores.length === 0) {
    errors.push('Debe agregar al menos un Contenedor o marcar "Carga a Granel".');
  }
  if (dua.documentos.length === 0) {
    errors.push('Debe registrar al menos un documento soporte (ej. Factura Comercial / e-CF 46).');
  }
  if (Number(dua.pesoBrutoKg || 0) <= 0) {
    errors.push('Peso Bruto (KG) (*) debe ser mayor que 0.');
  } else if (Number(dua.pesoBrutoKg) < Number(dua.pesoNetoKg)) {
    errors.push(`Peso Bruto (${dua.pesoBrutoKg} kg) no puede ser menor que Peso Neto (${dua.pesoNetoKg} kg).`);
  }
  return errors;
}

function escapeXml(str: string | number | boolean | undefined): string {
  const val = String(str ?? '');
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateDuaXml(dua: DeclaracionDUA): string {
  const itemsXml = dua.detalles
    .map(
      (item) => `    <Item>
      <CodigoSA>${escapeXml(item.codigoSA)}</CodigoSA>
      <CodigoProducto>${escapeXml(item.codigoProducto)}</CodigoProducto>
      <ProductoNombre>${escapeXml(item.productoNombre)}</ProductoNombre>
      <Marca>${escapeXml(item.marca)}</Marca>
      <Modelo>${escapeXml(item.modelo)}</Modelo>
      <Estado>${escapeXml(item.estado)}</Estado>
      <Anio>${escapeXml(item.anio)}</Anio>
      <Especificacion>${escapeXml(item.especificacion)}</Especificacion>
      <Unidad>${escapeXml(item.unidad)}</Unidad>
      <Cantidad>${escapeXml(item.cantidad)}</Cantidad>
      <FobUnitario>${escapeXml(item.fobUnitario)}</FobUnitario>
      <PesoKg>${escapeXml(item.pesoKg)}</PesoKg>
      <CertificadoOrigen>${escapeXml(item.certificadoOrigen)}</CertificadoOrigen>
      <CertificadoSecuencia>${escapeXml(item.certificadoSecuencia)}</CertificadoSecuencia>
      <Organica>${escapeXml(item.organica)}</Organica>
      <GradoAlcohol>${escapeXml(item.gradoAlcohol)}</GradoAlcohol>
      <PaisOrigenCodigo>${escapeXml(item.paisOrigenCodigo)}</PaisOrigenCodigo>
      <PaisOrigenNombre>${escapeXml(item.paisOrigenNombre)}</PaisOrigenNombre>
      <Descripcion>${escapeXml(item.descripcion)}</Descripcion>
      <DescripcionMercancia>${escapeXml(item.descripcionMercancia)}</DescripcionMercancia>
    </Item>`
    )
    .join('\n');

  const contXml = dua.contenedores
    .map(
      (c) => `    <Contenedor>
      <Tipo>${escapeXml(c.tipoContenedor)}</Tipo>
      <Numero>${escapeXml(c.numeroContenedor)}</Numero>
      <Sello>${escapeXml(c.sello)}</Sello>
      <NoPlaca>${escapeXml(c.noPlaca)}</NoPlaca>
    </Contenedor>`
    )
    .join('\n');

  const docsXml = dua.documentos
    .map(
      (d) => `    <Documento>
      <Tipo>${escapeXml(d.tipoDocumento)}</Tipo>
      <NoReferencia>${escapeXml(d.noReferencia)}</NoReferencia>
      <EmitidoPor>${escapeXml(d.emitidoPor)}</EmitidoPor>
      <Email>${escapeXml(d.email)}</Email>
      <Telefono>${escapeXml(d.telefono)}</Telefono>
    </Documento>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<DUAExportacion xmlns="http://aduanas.gob.do/siga/ec01">
  <Cabecera>
    <FechaDeclaracion>${escapeXml(dua.fechaDeclaracion)}</FechaDeclaracion>
    <TipoDespacho>${escapeXml(dua.tipoDespacho)}</TipoDespacho>
    <AdministracionCodigo>${escapeXml(dua.adminCodigo)}</AdministracionCodigo>
    <AdministracionNombre>${escapeXml(dua.adminNombre)}</AdministracionNombre>
    <NoDeclaracion>${escapeXml(dua.noDeclaracion)}</NoDeclaracion>
    <DocEmbarque>${escapeXml(dua.docEmbarque)}</DocEmbarque>
    <DepositoOrigenCodigo>${escapeXml(dua.depositoOrigenCodigo)}</DepositoOrigenCodigo>
    <DepositoOrigenNombre>${escapeXml(dua.depositoOrigenNombre)}</DepositoOrigenNombre>
    <PuertoSalidaCodigo>${escapeXml(dua.puertoSalidaCodigo)}</PuertoSalidaCodigo>
    <PuertoSalidaNombre>${escapeXml(dua.puertoSalidaNombre)}</PuertoSalidaNombre>
    <PaisDestinoCodigo>${escapeXml(dua.paisDestinoCodigo)}</PaisDestinoCodigo>
    <PaisDestinoNombre>${escapeXml(dua.paisDestinoNombre)}</PaisDestinoNombre>
    <EmpresaTransportistaCodigo>${escapeXml(dua.empresaTransportistaCodigo)}</EmpresaTransportistaCodigo>
    <EmpresaTransportistaNombre>${escapeXml(dua.empresaTransportistaNombre)}</EmpresaTransportistaNombre>
    <NoViajeVuelo>${escapeXml(dua.noViajeVuelo)}</NoViajeVuelo>
    <NacionalidadTransportistaCodigo>${escapeXml(dua.nacionalidadTransportistaCodigo)}</NacionalidadTransportistaCodigo>
    <NacionalidadTransportistaNombre>${escapeXml(dua.nacionalidadTransportistaNombre)}</NacionalidadTransportistaNombre>
    <MedioTransporte>${escapeXml(dua.medioTransporte)}</MedioTransporte>
    <FechaLlegada>${escapeXml(dua.fechaLlegada)}</FechaLlegada>
  </Cabecera>
  <Exportador>
    <Nombre>${escapeXml(dua.exportadorNombre)}</Nombre>
    <DocumentoTipo>${escapeXml(dua.exportadorDocTipo)}</DocumentoTipo>
    <DocumentoNumero>${escapeXml(dua.exportadorDocNumero)}</DocumentoNumero>
    <Direccion>${escapeXml(dua.exportadorDireccion)}</Direccion>
    <Telefono>${escapeXml(dua.exportadorTelefono)}</Telefono>
    <Fax>${escapeXml(dua.exportadorFax)}</Fax>
    <Email>${escapeXml(dua.exportadorEmail)}</Email>
  </Exportador>
  <Comprador>
    <Nombre>${escapeXml(dua.compradorNombre)}</Nombre>
    <NacionalidadCodigo>${escapeXml(dua.compradorNacionalidadCodigo)}</NacionalidadCodigo>
    <NacionalidadNombre>${escapeXml(dua.compradorNacionalidadNombre)}</NacionalidadNombre>
    <DocumentoTipo>${escapeXml(dua.compradorDocTipo)}</DocumentoTipo>
    <DocumentoNumero>${escapeXml(dua.compradorDocNumero)}</DocumentoNumero>
  </Comprador>
  <RegimenYAcuerdo>
    <RegimenCodigo>${escapeXml(dua.regimenCodigo)}</RegimenCodigo>
    <RegimenNombre>${escapeXml(dua.regimenNombre)}</RegimenNombre>
    <AcuerdoCodigo>${escapeXml(dua.acuerdoCodigo)}</AcuerdoCodigo>
    <AcuerdoNombre>${escapeXml(dua.acuerdoNombre)}</AcuerdoNombre>
  </RegimenYAcuerdo>
  <Detalles>
${itemsXml}
  </Detalles>
  <Contenedores>
    <AGranel>${escapeXml(dua.aGranel)}</AGranel>
${contXml}
  </Contenedores>
  <Documentos>
${docsXml}
  </Documentos>
  <ValoresYPeso>
    <TasaCambio>${escapeXml(dua.tasaCambio)}</TasaCambio>
    <Flete>${escapeXml(dua.flete)}</Flete>
    <Seguro>${escapeXml(dua.seguro)}</Seguro>
    <OtroGasto>${escapeXml(dua.otroGasto)}</OtroGasto>
    <PesoBrutoKg>${escapeXml(dua.pesoBrutoKg)}</PesoBrutoKg>
    <Observacion>${escapeXml(dua.observacion)}</Observacion>
  </ValoresYPeso>
</DUAExportacion>`;
}

function getTagText(parent: Element | Document | null, tagName: string): string {
  if (!parent) return '';
  const el = parent.getElementsByTagName(tagName)[0];
  return el?.textContent?.trim() ?? '';
}

export function parseDuaXml(xmlString: string, baseDua: DeclaracionDUA): { dua?: DeclaracionDUA; error?: string } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');
    const parserError = doc.getElementsByTagName('parsererror')[0];
    if (parserError) {
      return { error: 'El archivo XML contiene errores de sintaxis y no pudo ser procesado por SIGA.' };
    }

    const cab = doc.getElementsByTagName('Cabecera')[0] || doc;
    const exp = doc.getElementsByTagName('Exportador')[0];
    const cmp = doc.getElementsByTagName('Comprador')[0];
    const reg = doc.getElementsByTagName('RegimenYAcuerdo')[0];
    const val = doc.getElementsByTagName('ValoresYPeso')[0];

    const itemNodes = Array.from(doc.getElementsByTagName('Item'));
    const detalles: DetalleMercanciaItem[] = itemNodes.map((node, idx) => ({
      id: `xml-det-${Date.now()}-${idx}`,
      sec: idx + 1,
      temporalProducto: false,
      codigoSA: getTagText(node, 'CodigoSA') || '6205.20.00',
      codigoProducto: getTagText(node, 'CodigoProducto') || `PRT-XML-${idx + 1}`,
      productoNombre: getTagText(node, 'ProductoNombre') || getTagText(node, 'Descripcion') || 'MERCANCÍA IMPORTADA XML',
      marca: getTagText(node, 'Marca') || 'N/A',
      modelo: getTagText(node, 'Modelo') || 'N/A',
      estado: (getTagText(node, 'Estado') as 'NUEVO' | 'USADO' | 'RECONSTRUIDO') || 'NUEVO',
      anio: Number(getTagText(node, 'Anio') || 0),
      especificacion: getTagText(node, 'Especificacion'),
      unidad: getTagText(node, 'Unidad') || 'Unidades',
      cantidad: Number(getTagText(node, 'Cantidad') || 1),
      fobUnitario: Number(getTagText(node, 'FobUnitario') || 0),
      pesoKg: Number(getTagText(node, 'PesoKg') || 0),
      certificadoOrigen: getTagText(node, 'CertificadoOrigen') === 'true',
      certificadoSecuencia: getTagText(node, 'CertificadoSecuencia'),
      organica: getTagText(node, 'Organica') === 'true',
      gradoAlcohol: Number(getTagText(node, 'GradoAlcohol') || 0),
      noSerie: getTagText(node, 'NoSerie'),
      precioPorMenor: Number(getTagText(node, 'PrecioPorMenor') || 0),
      paisOrigenCodigo: getTagText(node, 'PaisOrigenCodigo') || '214',
      paisOrigenNombre: getTagText(node, 'PaisOrigenNombre') || 'REPÚBLICA DOMINICANA',
      tipoVehiculo: getTagText(node, 'TipoVehiculo'),
      chasisVehiculo: getTagText(node, 'ChasisVehiculo'),
      colorVehiculo: getTagText(node, 'ColorVehiculo'),
      motorVehiculo: getTagText(node, 'MotorVehiculo'),
      vehiculoCC: Number(getTagText(node, 'VehiculoCC') || 0),
      descripcion: getTagText(node, 'Descripcion') || getTagText(node, 'ProductoNombre'),
      descripcionMercancia: getTagText(node, 'DescripcionMercancia'),
    }));

    const contNodes = Array.from(doc.getElementsByTagName('Contenedor'));
    const contenedores: ContenedorItem[] = contNodes.map((node, idx) => ({
      id: `xml-cont-${Date.now()}-${idx}`,
      sec: idx + 1,
      tipoContenedor: getTagText(node, 'Tipo') || "FURGON CERRADO DE 20'",
      numeroContenedor: getTagText(node, 'Numero'),
      sello: getTagText(node, 'Sello'),
      noPlaca: getTagText(node, 'NoPlaca'),
    }));

    const docNodes = Array.from(doc.getElementsByTagName('Documento'));
    const documentos: DocumentoAdjuntoItem[] = docNodes.map((node, idx) => ({
      id: `xml-doc-${Date.now()}-${idx}`,
      sec: idx + 1,
      tipoDocumento: getTagText(node, 'Tipo') || 'FACTURA COMERCIAL',
      otrosTipoDocumento: '',
      noReferencia: getTagText(node, 'NoReferencia'),
      emitidoPor: getTagText(node, 'EmitidoPor'),
      email: getTagText(node, 'Email'),
      telefono: getTagText(node, 'Telefono'),
      archivoNombre: 'Cargado_via_XML.xml',
      archivoTamano: 'XML',
    }));

    const merged: DeclaracionDUA = {
      ...baseDua,
      fechaDeclaracion: getTagText(cab, 'FechaDeclaracion') || baseDua.fechaDeclaracion,
      tipoDespacho: (getTagText(cab, 'TipoDespacho') as 'General' | 'Centro Logístico') || baseDua.tipoDespacho,
      adminCodigo: getTagText(cab, 'AdministracionCodigo') || baseDua.adminCodigo,
      adminNombre: getTagText(cab, 'AdministracionNombre') || baseDua.adminNombre,
      docEmbarque: getTagText(cab, 'DocEmbarque') || baseDua.docEmbarque,
      depositoOrigenCodigo: getTagText(cab, 'DepositoOrigenCodigo') || baseDua.depositoOrigenCodigo,
      depositoOrigenNombre: getTagText(cab, 'DepositoOrigenNombre') || baseDua.depositoOrigenNombre,
      puertoSalidaCodigo: getTagText(cab, 'PuertoSalidaCodigo') || baseDua.puertoSalidaCodigo,
      puertoSalidaNombre: getTagText(cab, 'PuertoSalidaNombre') || baseDua.puertoSalidaNombre,
      paisDestinoCodigo: getTagText(cab, 'PaisDestinoCodigo') || baseDua.paisDestinoCodigo,
      paisDestinoNombre: getTagText(cab, 'PaisDestinoNombre') || baseDua.paisDestinoNombre,
      empresaTransportistaCodigo: getTagText(cab, 'EmpresaTransportistaCodigo') || baseDua.empresaTransportistaCodigo,
      empresaTransportistaNombre: getTagText(cab, 'EmpresaTransportistaNombre') || baseDua.empresaTransportistaNombre,
      noViajeVuelo: getTagText(cab, 'NoViajeVuelo') || baseDua.noViajeVuelo,
      nacionalidadTransportistaCodigo: getTagText(cab, 'NacionalidadTransportistaCodigo') || baseDua.nacionalidadTransportistaCodigo,
      nacionalidadTransportistaNombre: getTagText(cab, 'NacionalidadTransportistaNombre') || baseDua.nacionalidadTransportistaNombre,
      medioTransporte: getTagText(cab, 'MedioTransporte') || baseDua.medioTransporte,
      fechaLlegada: getTagText(cab, 'FechaLlegada') || baseDua.fechaLlegada,
      exportadorNombre: getTagText(exp, 'Nombre') || baseDua.exportadorNombre,
      exportadorDocTipo: (getTagText(exp, 'DocumentoTipo') as 'RNC' | 'CED') || baseDua.exportadorDocTipo,
      exportadorDocNumero: getTagText(exp, 'DocumentoNumero') || baseDua.exportadorDocNumero,
      exportadorDireccion: getTagText(exp, 'Direccion') || baseDua.exportadorDireccion,
      exportadorTelefono: getTagText(exp, 'Telefono') || baseDua.exportadorTelefono,
      exportadorFax: getTagText(exp, 'Fax') || baseDua.exportadorFax,
      exportadorEmail: getTagText(exp, 'Email') || baseDua.exportadorEmail,
      compradorNombre: getTagText(cmp, 'Nombre') || baseDua.compradorNombre,
      compradorNacionalidadCodigo: getTagText(cmp, 'NacionalidadCodigo') || baseDua.compradorNacionalidadCodigo,
      compradorNacionalidadNombre: getTagText(cmp, 'NacionalidadNombre') || baseDua.compradorNacionalidadNombre,
      compradorDocTipo: getTagText(cmp, 'DocumentoTipo') || baseDua.compradorDocTipo,
      compradorDocNumero: getTagText(cmp, 'DocumentoNumero') || baseDua.compradorDocNumero,
      regimenCodigo: getTagText(reg, 'RegimenCodigo') || baseDua.regimenCodigo,
      regimenNombre: getTagText(reg, 'RegimenNombre') || baseDua.regimenNombre,
      acuerdoCodigo: getTagText(reg, 'AcuerdoCodigo') || baseDua.acuerdoCodigo,
      acuerdoNombre: getTagText(reg, 'AcuerdoNombre') || baseDua.acuerdoNombre,
      detalles: detalles.length > 0 ? detalles : baseDua.detalles,
      aGranel: getTagText(doc, 'AGranel') === 'true',
      contenedores: contenedores.length > 0 ? contenedores : baseDua.contenedores,
      documentos: documentos.length > 0 ? documentos : baseDua.documentos,
      tasaCambio: Number(getTagText(val, 'TasaCambio') || baseDua.tasaCambio || 60.2),
      flete: Number(getTagText(val, 'Flete') || 0),
      seguro: Number(getTagText(val, 'Seguro') || 0),
      otroGasto: Number(getTagText(val, 'OtroGasto') || 0),
      pesoBrutoKg: Number(getTagText(val, 'PesoBrutoKg') || 0),
      observacion: getTagText(val, 'Observacion') || baseDua.observacion,
    };

    return { dua: recalculateDuaTotals(merged) };
  } catch {
    return { error: 'No se pudo leer el archivo XML de DUA.' };
  }
}

export function buildDgii607Line(dua: DeclaracionDUA, ncfOverride?: string): string {
  const docDgii = dua.documentos.find((d) =>
    d.noReferencia.toUpperCase().startsWith('E46') || d.noReferencia.toUpperCase().startsWith('B16')
  );
  const ncf = (ncfOverride || docDgii?.noReferencia || 'E460000000001').toUpperCase();
  const taxId = (dua.compradorDocNumero || '111111111').replace(/\s+/g, '');
  const tipoId = '3'; // 3 = Extranjero / Pasaporte / TID en Formato 607 DGII
  const parts = dua.fechaDeclaracion.split('/');
  const yyyymmdd = parts.length === 3 ? `${parts[2]}${parts[1]}${parts[0]}` : '20261110';
  const montoFacturadoRd = (dua.valorFobTotal * dua.tasaCambio).toFixed(2);
  // RNC/Cedula o Pasaporte | Tipo Id | NCF | NCF Modificado | Tipo Ingreso (01 Operaciones) | Fecha Comprobante | Fecha Retencion | Monto Facturado | ITBIS Facturado (0.00 Exportacion)
  return `${taxId}|${tipoId}|${ncf}||01|${yyyymmdd}||${montoFacturadoRd}|0.00`;
}
