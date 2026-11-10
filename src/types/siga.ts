export type AduaneroProfile =
  | 'EXPORTADOR'
  | 'AGENTE DE ADUANAS'
  | 'IMPORTADOR'
  | 'CONSOLIDADOR'
  | 'NAVIERA'
  | 'EMPRESA AERONAVE'
  | 'EMPRESA DE LÍNEA AÉREA'
  | 'EMPRESA EXPRÉS';

export type DuaStatus =
  | 'Temporal'
  | 'Registrado/Aceptado'
  | 'Inspeccionando'
  | 'Despacho Aprobado'
  | 'Rechazado';

export type SelectivityChannel = 'Pendiente' | 'Verde (Documental)' | 'Amarillo (Revisión)' | 'Inspección física';

export type CorrectionStatus =
  | 'Temporal'
  | 'Registrado/Aceptado'
  | 'Aprobada'
  | 'Rechazada';

export type CargoEntryStatus =
  | 'Registro'
  | 'En Puerta'
  | 'Ingresada en Administración';

export type ActiveModule =
  | 'dua-register'
  | 'dua-search'
  | 'cargo-entry'
  | 'correction-register'
  | 'correction-search'
  | 'my-page'
  | 'dgii-bridge'
  | 'manual-guide';

export interface SessionUser {
  cedula: string;
  nombre: string;
  rncEmpresa: string;
  nombreEmpresa: string;
  direccionEmpresa: string;
  telefonoEmpresa: string;
  emailEmpresa: string;
  licenciaAgente?: string;
  perfil: AduaneroProfile;
}

export interface AdministracionAduana {
  codigo: string;
  nombre: string;
  localizacion: string;
  tipo: 'Marítima' | 'Terrestre' | 'Aérea' | 'Central';
  puertoDefault: string;
}

export interface PuertoInfo {
  tipoPuertoUso: 'Terminal Marítimo' | 'Aeropuerto' | 'Paso Fronterizo' | 'Depósito';
  codigoPuerto: string;
  nombrePuerto: string;
  codigoInternacional: string;
  nombreInternacional: string;
  paisCodigo: string;
  paisNombre: string;
  adminCodigo?: string;
}

export interface PaisInfo {
  codigo: string;
  nombre: string;
  iso2: string;
}

export interface EmpresaTransportista {
  codigo: string;
  tipo: string;
  documentoTipo: 'RNC' | 'TID';
  documentoNumero: string;
  nombre: string;
  certificaciones: string;
  nacionalidadCodigo: string;
  nacionalidadNombre: string;
  medioDefault: string;
}

export interface ExportadorInfo {
  codigo: string;
  tipo: string;
  documentoTipo: 'RNC' | 'CED';
  documentoNumero: string;
  nombre: string;
  certificaciones: string;
  direccion: string;
  ciudad: string;
  zona: string;
  telefono: string;
  fax: string;
  email: string;
  paisCodigo: string;
  paisNombre: string;
}

export interface CompradorInfo {
  codigo: string;
  tipo: string;
  documentoTipo: 'TID' | 'PASAPORTE' | 'RNC';
  documentoNumero: string;
  nombre: string;
  certificaciones: string;
  nacionalidadCodigo: string;
  nacionalidadNombre: string;
  direccion: string;
  email: string;
}

export interface RegimenAduanero {
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface AcuerdoComercial {
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface CodigoSA {
  codigo: string;
  categoria: string;
  subCategoria: string;
  unidadDefault: string;
  esAlcohol?: boolean;
  esVehiculo?: boolean;
}

export interface ProductoCatalogo {
  codigoProducto: string;
  codigoSA: string;
  nombreProducto: string;
  marca: string;
  modelo: string;
  origenCodigo: string;
  origenNombre: string;
  unidad: string;
  organica: boolean;
  especificacion: string;
}

export interface CertificadoOrigenCatalogo {
  secuencia: string;
  noCertificado: string;
  codigoSA: string;
  tratamiento: string;
  acuerdoCodigo: string;
  acuerdoNombre: string;
  paisCodigo: string;
  paisNombre: string;
  fechaEmision: string;
}

export interface DetalleMercanciaItem {
  id: string;
  sec: number;
  temporalProducto: boolean;
  codigoSA: string;
  saCategoria?: string;
  codigoProducto: string;
  productoNombre: string;
  marca: string;
  modelo: string;
  estado: 'NUEVO' | 'USADO' | 'RECONSTRUIDO';
  anio: number;
  especificacion: string;
  unidad: string;
  cantidad: number;
  fobUnitario: number;
  pesoKg: number;
  certificadoOrigen: boolean;
  certificadoSecuencia: string;
  organica: boolean;
  gradoAlcohol: number;
  noSerie: string;
  precioPorMenor: number;
  paisOrigenCodigo: string;
  paisOrigenNombre: string;
  tipoVehiculo: string;
  chasisVehiculo: string;
  colorVehiculo: string;
  motorVehiculo: string;
  vehiculoCC: number;
  descripcion: string;
  descripcionMercancia: string;
}

export interface ContenedorItem {
  id: string;
  sec: number;
  tipoContenedor: string;
  numeroContenedor: string;
  sello: string;
  noPlaca: string;
}

export interface DocumentoAdjuntoItem {
  id: string;
  sec: number;
  tipoDocumento: string;
  otrosTipoDocumento: string;
  noReferencia: string;
  emitidoPor: string;
  email: string;
  telefono: string;
  archivoNombre?: string;
  archivoTamano?: string;
  ncfTipo?: 'E46' | 'B16' | 'E32' | 'B02' | 'OTRO';
  montoFacturaRD?: number;
}

export interface DeclaracionDUA {
  id: string;
  fechaDeclaracion: string;
  tipoDespacho: 'General' | 'Centro Logístico';
  adminCodigo: string;
  adminNombre: string;
  noDeclaracion: string;
  generarAuto: boolean;
  docEmbarque: string;
  depositoOrigenCodigo: string;
  depositoOrigenNombre: string;
  puertoSalidaCodigo: string;
  puertoSalidaNombre: string;
  paisDestinoCodigo: string;
  paisDestinoNombre: string;
  empresaTransportistaCodigo: string;
  empresaTransportistaNombre: string;
  noViajeVuelo: string;
  nacionalidadTransportistaCodigo: string;
  nacionalidadTransportistaNombre: string;
  medioTransporte: string;
  fechaLlegada: string;
  // Exportador
  exportadorNombre: string;
  exportadorDocTipo: 'RNC' | 'CED';
  exportadorDocNumero: string;
  exportadorDireccion: string;
  exportadorTelefono: string;
  exportadorFax: string;
  exportadorEmail: string;
  // Agente de Aduanas
  agenteEmpresa: string;
  agenteNombre: string;
  agenteLicencia: string;
  agenteDocTipo: string;
  agenteDocNumero: string;
  // Comprador
  compradorNombre: string;
  compradorNacionalidadCodigo: string;
  compradorNacionalidadNombre: string;
  compradorDocTipo: string;
  compradorDocNumero: string;
  // Regimen y Acuerdo
  regimenCodigo: string;
  regimenNombre: string;
  acuerdoCodigo: string;
  acuerdoNombre: string;
  // Grids
  detalles: DetalleMercanciaItem[];
  aGranel: boolean;
  contenedores: ContenedorItem[];
  documentos: DocumentoAdjuntoItem[];
  // Valor y Peso
  tasaCambio: number;
  valorFobTotal: number;
  flete: number;
  seguro: number;
  otroGasto: number;
  valorCifTotalUsd: number;
  valorCifTotalRd: number;
  pesoBrutoKg: number;
  pesoNetoKg: number;
  observacion: string;
  // Estado y Operaciones
  estado: DuaStatus;
  selectividad: SelectivityChannel;
  noSolicitudEntradaCarga?: string;
  tasaDuaMonto: number; // RD$300.00
  tasaPagada: boolean;
  metodoPago?: string;
  referenciaPago?: string;
  fechaPresentacion?: string;
  fechaInspeccion?: string;
}

export interface CargaEntradaRegistro {
  id: string;
  sec: number;
  noSolicitud: string;
  fechaTentativaEntrada: string;
  noDeclaracion: string;
  aduanaSalidaCodigo: string;
  aduanaSalidaNombre: string;
  empresaTransportista: string;
  noViaje: string;
  tipoCarga: string;
  noContenedor: string;
  noPlaca: string;
  noSello: string;
  cantidadBultos: number;
  estadoSolicitud: CargoEntryStatus;
}

export interface SolicitudCorreccion {
  id: string;
  sec: number;
  noSolicitudCorreccion: string;
  fechaCorreccion: string;
  fechaVencimiento: string;
  fechaTermino: string;
  tipoSolicitud: string;
  noFormularioReferencia: string;
  tipoFormularioReferencia: string;
  adminCodigo: string;
  adminNombre: string;
  depositoDestinoCodigo: string;
  depositoDestinoNombre: string;
  detalleCorreccion: string;
  archivoNombre?: string;
  agenteEmpresa?: string;
  agenteNombre?: string;
  agenteLicencia?: string;
  estado: CorrectionStatus;
  observacionOficial?: string;
}

export interface NotificationItem {
  id: string;
  fecha: string;
  titulo: string;
  mensaje: string;
  documentoRef: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  leida: boolean;
}
