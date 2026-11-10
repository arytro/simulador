import {
  AcuerdoComercial,
  AdministracionAduana,
  CargaEntradaRegistro,
  CertificadoOrigenCatalogo,
  CodigoSA,
  CompradorInfo,
  DeclaracionDUA,
  EmpresaTransportista,
  ExportadorInfo,
  NotificationItem,
  PaisInfo,
  ProductoCatalogo,
  PuertoInfo,
  RegimenAduanero,
  SolicitudCorreccion,
} from '../types/siga';

export const DEMO_USERS = [
  {
    cedula: '0909090909',
    pin: '1234',
    nombre: 'PERSONA PÉREZ',
    rncEmpresa: '130000018',
    nombreEmpresa: 'DFG EMPRESA EXPORTADORA S.R.L.',
    direccionEmpresa: 'CALLE ARRIBA #00, PARQUE INDUSTRIAL, SANTO DOMINGO',
    telefonoEmpresa: '809-555-0000',
    emailEmpresa: 'exportaciones@dfgempresa.com.do',
    licenciaAgente: 'CED0950',
  },
  {
    cedula: '00112233445',
    pin: '2026',
    nombre: 'CARMEN ELISA CABRERA HERNÁNDEZ',
    rncEmpresa: '101783338',
    nombreEmpresa: 'CABRERA & ASOCIADOS GESTIÓN ADUANAL S.R.L.',
    direccionEmpresa: 'AV. GEORGE WASHINGTON #412, GAZCUE, SANTO DOMINGO',
    telefonoEmpresa: '809-532-4810',
    emailEmpresa: 'operaciones@cabreraaduanas.com.do',
    licenciaAgente: 'CED0950',
  },
];

export const ADMINISTRACIONES_ADUANA: AdministracionAduana[] = [
  { codigo: '10000', nombre: 'DIRECCION GENERAL DE ADUANAS', localizacion: 'DIRECCION GENERAL DE ADUANAS (SEDE CENTRAL)', tipo: 'Central', puertoDefault: 'DOSDQ' },
  { codigo: '10010', nombre: 'ADMINISTRACION SANTO DOMINGO', localizacion: 'PUERTO DE SANTO DOMINGO / SANS SOUCI', tipo: 'Marítima', puertoDefault: 'DOSDQ' },
  { codigo: '10020', nombre: 'ADMINISTRACION HAINA OCCIDENTAL', localizacion: 'ADMINISTRACION HAINA OCCIDENTAL', tipo: 'Marítima', puertoDefault: 'DOHAI' },
  { codigo: '10030', nombre: 'ADMINISTRACION HAINA ORIENTAL', localizacion: 'ADMINISTRACION HAINA ORIENTAL', tipo: 'Marítima', puertoDefault: 'DOHAI' },
  { codigo: '10040', nombre: 'ADMINISTRACION BOCA CHICA', localizacion: 'ADMINISTRACION BOCA CHICA', tipo: 'Marítima', puertoDefault: 'DOBOC' },
  { codigo: '10060', nombre: 'ADMINISTRACION LA ROMANA', localizacion: 'ADMINISTRACION LA ROMANA', tipo: 'Marítima', puertoDefault: 'DOLRM' },
  { codigo: '10080', nombre: 'ADMINISTRACION AZUA', localizacion: 'ADMINISTRACION AZUA (PUERTO VIEJO)', tipo: 'Marítima', puertoDefault: 'DOAZU' },
  { codigo: '10090', nombre: 'ADMINISTRACION BARAHONA', localizacion: 'ADMINISTRACION BARAHONA', tipo: 'Marítima', puertoDefault: 'DOBRX' },
  { codigo: '10100', nombre: 'ADMINISTRACION CABO ROJO', localizacion: 'ADMINISTRACION CABO ROJO', tipo: 'Marítima', puertoDefault: 'DOCRJ' },
  { codigo: '10110', nombre: 'ADMINISTRACION MANZANILLO', localizacion: 'ADMINISTRACION MANZANILLO', tipo: 'Marítima', puertoDefault: 'DOMAN' },
  { codigo: '10130', nombre: 'ADMINISTRACION SANCHEZ', localizacion: 'ADMINISTRACION SANCHEZ (SAMANA)', tipo: 'Marítima', puertoDefault: 'DOSAN' },
  { codigo: '10140', nombre: 'ADMINISTRACION PEDERNALES', localizacion: 'ADMINISTRACION PEDERNALES (FRONTERA)', tipo: 'Terrestre', puertoDefault: 'DOPED' },
  { codigo: '10150', nombre: 'ADMINISTRACION PUERTO MULTIMODAL CAUCEDO', localizacion: 'ADMINISTRACION PUERTO MULTIMODAL CAUCEDO', tipo: 'Marítima', puertoDefault: 'DOCAU' },
  { codigo: '10160', nombre: 'ADMINISTRACION PUERTO LA CANA', localizacion: 'ADMINISTRACION PUERTO LA CANA', tipo: 'Marítima', puertoDefault: 'DOPLC' },
  { codigo: '20010', nombre: 'AEROPUERTO INTERNACIONAL GREGORIO LUPERON PUERTO PLATA', localizacion: 'AEROPUERTO INTERNACIONAL GREGORIO LUPERON', tipo: 'Aérea', puertoDefault: 'DOPOP' },
  { codigo: '20020', nombre: 'AEROPUERTO INTERNACIONAL LICEY', localizacion: 'AEROPUERTO INTERNACIONAL DEL CIBAO (LICEY)', tipo: 'Aérea', puertoDefault: 'DOSTI' },
  { codigo: '20030', nombre: 'AEROPUERTO INTERNACIONAL DR. JOAQUIN BALAGUER', localizacion: 'AEROPUERTO LA ISABELA (EL HIGUERO)', tipo: 'Aérea', puertoDefault: 'DOJBQ' },
  { codigo: '20040', nombre: 'AEROPUERTO INTERNACIONAL PUNTA CANA', localizacion: 'AEROPUERTO INTERNACIONAL PUNTA CANA', tipo: 'Aérea', puertoDefault: 'DOPUJ' },
  { codigo: '20050', nombre: 'AEROPUERTO INTERNACIONAL DE LAS AMERICAS (AILA)', localizacion: 'AILA DR. JOSE FRANCISCO PENA GOMEZ', tipo: 'Aérea', puertoDefault: 'DOSDQ' },
];

export const PUERTOS_CATALOGO: PuertoInfo[] = [
  { tipoPuertoUso: 'Terminal Marítimo', codigoPuerto: 'DOHAI', nombrePuerto: 'RIO HAINA', codigoInternacional: 'DOHAI', nombreInternacional: 'RIO HAINA', paisCodigo: '214', paisNombre: 'REPÚBLICA DOMINICANA', adminCodigo: '10030' },
  { tipoPuertoUso: 'Terminal Marítimo', codigoPuerto: 'DOCAU', nombrePuerto: 'MULTIMODAL CAUCEDO', codigoInternacional: 'DOCAU', nombreInternacional: 'CAUCEDO', paisCodigo: '214', paisNombre: 'REPÚBLICA DOMINICANA', adminCodigo: '10150' },
  { tipoPuertoUso: 'Terminal Marítimo', codigoPuerto: 'DOSDQ', nombrePuerto: 'PUERTO SANTO DOMINGO', codigoInternacional: 'DOSDQ', nombreInternacional: 'SANTO DOMINGO', paisCodigo: '214', paisNombre: 'REPÚBLICA DOMINICANA', adminCodigo: '10010' },
  { tipoPuertoUso: 'Terminal Marítimo', codigoPuerto: 'DOMAN', nombrePuerto: 'PUERTO MANZANILLO', codigoInternacional: 'DOMAN', nombreInternacional: 'MANZANILLO', paisCodigo: '214', paisNombre: 'REPÚBLICA DOMINICANA', adminCodigo: '10110' },
  { tipoPuertoUso: 'Terminal Marítimo', codigoPuerto: 'DOLRM', nombrePuerto: 'PUERTO LA ROMANA', codigoInternacional: 'DOLRM', nombreInternacional: 'LA ROMANA', paisCodigo: '214', paisNombre: 'REPÚBLICA DOMINICANA', adminCodigo: '10060' },
  { tipoPuertoUso: 'Terminal Marítimo', codigoPuerto: 'DOBOC', nombrePuerto: 'PUERTO BOCA CHICA', codigoInternacional: 'DOBOC', nombreInternacional: 'BOCA CHICA', paisCodigo: '214', paisNombre: 'REPÚBLICA DOMINICANA', adminCodigo: '10040' },
  { tipoPuertoUso: 'Aeropuerto', codigoPuerto: 'DOSDQ', nombrePuerto: 'AILA - LAS AMERICAS', codigoInternacional: 'SDQ', nombreInternacional: 'LAS AMERICAS INTL', paisCodigo: '214', paisNombre: 'REPÚBLICA DOMINICANA', adminCodigo: '20050' },
  { tipoPuertoUso: 'Aeropuerto', codigoPuerto: 'DOSTI', nombrePuerto: 'AEROPUERTO DEL CIBAO', codigoInternacional: 'STI', nombreInternacional: 'CIBAO INTL', paisCodigo: '214', paisNombre: 'REPÚBLICA DOMINICANA', adminCodigo: '20020' },
  { tipoPuertoUso: 'Aeropuerto', codigoPuerto: 'DOPUJ', nombrePuerto: 'AEROPUERTO PUNTA CANA', codigoInternacional: 'PUJ', nombreInternacional: 'PUNTA CANA INTL', paisCodigo: '214', paisNombre: 'REPÚBLICA DOMINICANA', adminCodigo: '20040' },
  { tipoPuertoUso: 'Aeropuerto', codigoPuerto: 'DOPOP', nombrePuerto: 'AEROPUERTO PUERTO PLATA', codigoInternacional: 'POP', nombreInternacional: 'GREGORIO LUPERON', paisCodigo: '214', paisNombre: 'REPÚBLICA DOMINICANA', adminCodigo: '20010' },
  { tipoPuertoUso: 'Paso Fronterizo', codigoPuerto: 'DOPED', nombrePuerto: 'PASO FRONTERIZO PEDERNALES', codigoInternacional: 'DOPED', nombreInternacional: 'PEDERNALES', paisCodigo: '214', paisNombre: 'REPÚBLICA DOMINICANA', adminCodigo: '10140' },
];

export const PAISES_CATALOGO: PaisInfo[] = [
  { codigo: '214', nombre: 'REPÚBLICA DOMINICANA', iso2: 'DO' },
  { codigo: '840', nombre: 'ESTADOS UNIDOS', iso2: 'US' },
  { codigo: '630', nombre: 'PUERTO RICO', iso2: 'PR' },
  { codigo: '724', nombre: 'ESPAÑA', iso2: 'ES' },
  { codigo: '528', nombre: 'PAÍSES BAJOS', iso2: 'NL' },
  { codigo: '276', nombre: 'ALEMANIA', iso2: 'DE' },
  { codigo: '826', nombre: 'REINO UNIDO', iso2: 'GB' },
  { codigo: '124', nombre: 'CANADÁ', iso2: 'CA' },
  { codigo: '332', nombre: 'HAITÍ', iso2: 'HT' },
  { codigo: '591', nombre: 'PANAMÁ', iso2: 'PA' },
  { codigo: '188', nombre: 'COSTA RICA', iso2: 'CR' },
  { codigo: '380', nombre: 'ITALIA', iso2: 'IT' },
  { codigo: '250', nombre: 'FRANCIA', iso2: 'FR' },
  { codigo: '156', nombre: 'CHINA', iso2: 'CN' },
];

export const TRANSPORTISTAS_CATALOGO: EmpresaTransportista[] = [
  { codigo: 'TRS19950', tipo: 'Naviera / Consolidadora', documentoTipo: 'RNC', documentoNumero: '130000018', nombre: 'ABC EMPRESA TRANSPORTISTA', certificaciones: 'OPERADORES ECONÓMICO AUTORIZADO (OEA)', nacionalidadCodigo: '214', nacionalidadNombre: 'REPÚBLICA DOMINICANA', medioDefault: '[HR32-1] MARÍTIMAS' },
  { codigo: 'MAEU001', tipo: 'Empresa Naviera', documentoTipo: 'RNC', documentoNumero: '101783338', nombre: 'MAERSK DOMINICANA S.A.S.', certificaciones: 'OPERADORES ECONÓMICO AUTORIZADO (OEA)', nacionalidadCodigo: '214', nacionalidadNombre: 'REPÚBLICA DOMINICANA', medioDefault: '[HR32-1] MARÍTIMAS' },
  { codigo: 'CRWL002', tipo: 'Empresa Naviera', documentoTipo: 'RNC', documentoNumero: '131452108', nombre: 'CROWLEY LINER SERVICES RD', certificaciones: 'OEA / BASC', nacionalidadCodigo: '840', nacionalidadNombre: 'ESTADOS UNIDOS', medioDefault: '[HR32-1] MARÍTIMAS' },
  { codigo: 'MSCU003', tipo: 'Empresa Naviera', documentoTipo: 'RNC', documentoNumero: '105012342', nombre: 'MSC MEDITERRANEAN SHIPPING RD', certificaciones: 'OPERADORES ECONÓMICO AUTORIZADO (OEA)', nacionalidadCodigo: '214', nacionalidadNombre: 'REPÚBLICA DOMINICANA', medioDefault: '[HR32-1] MARÍTIMAS' },
  { codigo: 'AMJ004', tipo: 'Empresa de Línea Aérea', documentoTipo: 'RNC', documentoNumero: '130445129', nombre: 'AMERIJET CARGO CARIBBEAN', certificaciones: 'OEA AÉREO', nacionalidadCodigo: '840', nacionalidadNombre: 'ESTADOS UNIDOS', medioDefault: '[AR10-1] AÉREO' },
  { codigo: 'TRD005', tipo: 'Transporte Terrestre', documentoTipo: 'RNC', documentoNumero: '130987651', nombre: 'TRANSFRONTERA CARIBE S.R.L.', certificaciones: 'REGISTRO DGA', nacionalidadCodigo: '214', nacionalidadNombre: 'REPÚBLICA DOMINICANA', medioDefault: '[TR20-1] TERRESTRE' },
];

export const EXPORTADORES_CATALOGO: ExportadorInfo[] = [
  {
    codigo: 'EXP001',
    tipo: 'Export Company',
    documentoTipo: 'RNC',
    documentoNumero: '130000018',
    nombre: 'DFG EMPRESA EXPORTADORA S.R.L.',
    certificaciones: 'OPERADORES ECONÓMICO AUTORIZADO (OEA)',
    direccion: 'CALLE ARRIBA #00, PARQUE INDUSTRIAL, SANTO DOMINGO',
    ciudad: 'SANTO DOMINGO',
    zona: 'DISTRITO NACIONAL',
    telefono: '809-555-0000',
    fax: '809-555-0001',
    email: 'exportaciones@dfgempresa.com.do',
    paisCodigo: '214',
    paisNombre: 'REPÚBLICA DOMINICANA',
  },
  {
    codigo: 'EXP002',
    tipo: 'Export Company',
    documentoTipo: 'RNC',
    documentoNumero: '101783338',
    nombre: 'TABACALERA DEL CIBAO S.A.',
    certificaciones: 'OEA / PRODOMINICANA',
    direccion: 'CARRETERA DUARTE KM 14, TAMBORIL, SANTIAGO',
    ciudad: 'SANTIAGO',
    zona: 'CIBAO',
    telefono: '809-580-2210',
    fax: '809-580-2211',
    email: 'aduanas@tabacaleracibao.com.do',
    paisCodigo: '214',
    paisNombre: 'REPÚBLICA DOMINICANA',
  },
  {
    codigo: 'EXP003',
    tipo: 'Zona Franca Industrial',
    documentoTipo: 'RNC',
    documentoNumero: '131452108',
    nombre: 'MEDTECH ZONA FRANCA LAS AMÉRICAS S.A.',
    certificaciones: 'CNZFE / OEA',
    direccion: 'PARQUE ZONA FRANCA LAS AMÉRICAS, NAVE 18, BOCA CHICA',
    ciudad: 'SANTO DOMINGO ESTE',
    zona: 'ESTE',
    telefono: '809-549-8840',
    fax: '809-549-8841',
    email: 'logistics@medtechzf.com.do',
    paisCodigo: '214',
    paisNombre: 'REPÚBLICA DOMINICANA',
  },
  {
    codigo: 'EXP004',
    tipo: 'Exportador Agrícola',
    documentoTipo: 'RNC',
    documentoNumero: '105012342',
    nombre: 'AGROEXPORTADORA BANANOS DEL NOROESTE S.R.L.',
    certificaciones: 'GLOBALG.A.P. / ORGÁNICO',
    direccion: 'FINCA LA CRUZ, KILÓMETRO 6, MAO, VALVERDE',
    ciudad: 'MAO',
    zona: 'NOROESTE',
    telefono: '809-572-3315',
    fax: '809-572-3316',
    email: 'despacho@bananosnoroeste.do',
    paisCodigo: '214',
    paisNombre: 'REPÚBLICA DOMINICANA',
  },
];

export const COMPRADORES_CATALOGO: CompradorInfo[] = [
  {
    codigo: 'CMP001',
    tipo: 'Empresa Compradora',
    documentoTipo: 'TID',
    documentoNumero: '11-1111111',
    nombre: '1EMPRESA COMPRADORA LLC',
    certificaciones: 'IMPORTADOR US CBP',
    nacionalidadCodigo: '840',
    nacionalidadNombre: 'ESTADOS UNIDOS',
    direccion: '1450 NW 78TH AVE, DORAL, FL 33126, USA',
    email: 'imports@1empresacompradora.com',
  },
  {
    codigo: 'CMP002',
    tipo: 'Empresa Compradora',
    documentoTipo: 'TID',
    documentoNumero: '84-2910452',
    nombre: 'ATLANTIC CIGAR DISTRIBUTORS INC.',
    certificaciones: 'TTB PERMIT',
    nacionalidadCodigo: '840',
    nacionalidadNombre: 'ESTADOS UNIDOS',
    direccion: '800 PORT BOULEVARD, MIAMI, FL 33132, USA',
    email: 'compliance@atlanticcigar.us',
  },
  {
    codigo: 'CMP003',
    tipo: 'Empresa Compradora',
    documentoTipo: 'TID',
    documentoNumero: 'NL812945012B01',
    nombre: 'EUROFRUIT ORGANIC ROTTERDAM B.V.',
    certificaciones: 'EORI NL',
    nacionalidadCodigo: '528',
    nacionalidadNombre: 'PAÍSES BAJOS',
    direccion: 'MAASVLAKTE WEG 42, 3199 DB ROTTERDAM, NETHERLANDS',
    email: 'customs@eurofruit.nl',
  },
  {
    codigo: 'CMP004',
    tipo: 'Empresa Compradora',
    documentoTipo: 'TID',
    documentoNumero: 'ESB82940112',
    nombre: 'CACAO IBÉRICO DE ALTURA S.L.',
    certificaciones: 'EORI ES',
    nacionalidadCodigo: '724',
    nacionalidadNombre: 'ESPAÑA',
    direccion: 'POLÍGONO ZONA FRANCA, BARCELONA, ESPAÑA',
    email: 'importacion@cacaoiberico.es',
  },
];

// Exact 7 Regimes shown on Page 17 of the DGA SIGA Manual
export const REGIMENES_ADUANEROS: RegimenAduanero[] = [
  { codigo: '16', nombre: 'EXPORTACION NACIONAL', descripcion: 'Exportación definitiva de mercancías de producción nacional o nacionalizadas.' },
  { codigo: '11', nombre: 'ZONAS FRANCAS INDUSTRIAL Y ESPECIALES', descripcion: 'Exportación de bienes manufacturados o procesados bajo régimen de Zonas Francas (Ley 8-90).' },
  { codigo: '20', nombre: 'CONSUMO DE REEXPORTACION', descripcion: 'Reexportación de mercancías previamente importadas bajo regímenes definitivos o especiales.' },
  { codigo: '2', nombre: 'ADMISION TEMPORAL', descripcion: 'Salida/cancelación de mercancías admitidas temporalmente para perfeccionamiento activo.' },
  { codigo: '4', nombre: 'DEPOSITO LOGISTICO', descripcion: 'Salida hacia el exterior desde un Centro Logístico o Depósito Aduanero autorizado.' },
  { codigo: '5', nombre: 'SALIDA TEMPORAL', descripcion: 'Exportación temporal de mercancías para reparación, exhibición o transformación con retorno.' },
  { codigo: '17', nombre: 'REEMBAQUE', descripcion: 'Reembarque directo de mercancías arribadas al territorio aduanero sin nacionalizar.' },
];

export const ACUERDOS_COMERCIALES: AcuerdoComercial[] = [
  { codigo: '1', nombre: 'DR-CAFTA', descripcion: 'Tratado de Libre Comercio República Dominicana - Centroamérica - Estados Unidos.' },
  { codigo: '2', nombre: 'EPA (CARIFORUM-UE)', descripcion: 'Acuerdo de Asociación Económica entre CARIFORUM y la Unión Europea.' },
  { codigo: '3', nombre: 'CARICOM', descripcion: 'Acuerdo de Libre Comercio entre República Dominicana y la Comunidad del Caribe.' },
  { codigo: '4', nombre: 'TLC RD-CENTROAMÉRICA', descripcion: 'Tratado de Libre Comercio con países centroamericanos.' },
  { codigo: '5', nombre: 'AAP RD-PANAMÁ', descripcion: 'Acuerdo de Alcance Parcial República Dominicana - Panamá.' },
  { codigo: '0', nombre: 'SIN ACUERDO', descripcion: 'Exportación bajo régimen general NMF sin preferencia arancelaria.' },
];

export const CODIGOS_SA_CATALOGO: CodigoSA[] = [
  { codigo: '6205.20.00', categoria: 'Camisas para hombres o niños', subCategoria: '- De algodón', unidadDefault: 'Unidades' },
  { codigo: '2402.10.00', categoria: 'Cigarros (puros) y cigarritos', subCategoria: 'Que contengan tabaco, hechos a mano', unidadDefault: 'Unidades' },
  { codigo: '1801.00.10', categoria: 'Cacao en grano, entero o partido', subCategoria: 'Crudo (incluye orgánico Certificado)', unidadDefault: 'Kilogramos' },
  { codigo: '0803.90.11', categoria: 'Bananas o plátanos frescos', subCategoria: 'Tipo Cavendish Valery frescos', unidadDefault: 'Cajas' },
  { codigo: '0804.40.00', categoria: 'Aguacates (paltas)', subCategoria: 'Frescos o secos', unidadDefault: 'Kilogramos' },
  { codigo: '9018.90.90', categoria: 'Instrumentos y aparatos de medicina', subCategoria: 'Dispositivos médicos descartables (Zona Franca)', unidadDefault: 'Unidades' },
  { codigo: '2208.40.10', categoria: 'Ron y demás aguardientes de caña', subCategoria: 'En recipientes con capacidad <= 2 litros', unidadDefault: 'Litros', esAlcohol: true },
  { codigo: '3004.90.99', categoria: 'Medicamentos dosificados', subCategoria: 'Uso humano preparados para la venta al por menor', unidadDefault: 'Unidades' },
  { codigo: '7204.49.00', categoria: 'Desperdicios y desechos de fundición', subCategoria: 'Chatarra ferrosa compactada', unidadDefault: 'Toneladas' },
  { codigo: '8703.23.90', categoria: 'Vehículos automóviles para transporte', subCategoria: 'Cilindrada superior a 1,500 cm3 pero <= 3,000 cm3', unidadDefault: 'Unidades', esVehiculo: true },
];

export const PRODUCTOS_CATALOGO: ProductoCatalogo[] = [
  { codigoProducto: 'PRT201103-2800EEDA99', codigoSA: '6205.20.00', nombreProducto: 'CAMISAS HOMBRE M/C 100% ALGODON', marca: 'N/A', modelo: 'N/A', origenCodigo: '214', origenNombre: 'REPÚBLICA DOMINICANA', unidad: 'Unidades', organica: false, especificacion: 'CAMISAS DE VESTIR MANGA CORTA 100% ALGODON TALLAS S-XL' },
  { codigoProducto: 'PRT202205-CIG00184', codigoSA: '2402.10.00', nombreProducto: 'CIGARROS PUROS PREMIUM HECHOS A MANO', marca: 'DON CARLOS RESERVE', modelo: 'ROBUSTO 5X50', origenCodigo: '214', origenNombre: 'REPÚBLICA DOMINICANA', unidad: 'Unidades', organica: false, especificacion: 'TABACO DOMINICANO COROJO CAPA MADURA EN CAJAS DE CEDRO X 25' },
  { codigoProducto: 'PRT202301-CAC00912', codigoSA: '1801.00.10', nombreProducto: 'CACAO EN GRANO HISPANIOLA ORGANICO', marca: 'N/A', modelo: 'FERMENTADO GRADO 1', origenCodigo: '214', origenNombre: 'REPÚBLICA DOMINICANA', unidad: 'Kilogramos', organica: true, especificacion: 'SACOS DE YUTE DE 70 KG CERTIFICADO USDA ORGANIC / EU' },
  { codigoProducto: 'PRT202304-BAN00410', codigoSA: '0803.90.11', nombreProducto: 'BANANO CAVENDISH FRESCO ORGANICO', marca: 'VALLEY FRESH RD', modelo: 'CAJA 18.14 KG', origenCodigo: '214', origenNombre: 'REPÚBLICA DOMINICANA', unidad: 'Cajas', organica: true, especificacion: 'BANANO ORGANICO FRESCO EMPACADO EN CAJA DE CARTON 40 LBS' },
  { codigoProducto: 'PRT202402-AGU00201', codigoSA: '0804.40.00', nombreProducto: 'AGUACATE CRIOLLO Y SEMIL 34 FRESCO', marca: 'N/A', modelo: 'CALIBRE 16-20', origenCodigo: '214', origenNombre: 'REPÚBLICA DOMINICANA', unidad: 'Kilogramos', organica: false, especificacion: 'AGUACATE FRESCO SELECCIONADO DE EXPORTACION EN CAJAS REFRIGERADAS' },
  { codigoProducto: 'PRT202408-MED00772', codigoSA: '9018.90.90', nombreProducto: 'SET INFUSION INTRAVENOSA ESTERIL', marca: 'MEDTECH RD', modelo: 'IV-SET-2026', origenCodigo: '214', origenNombre: 'REPÚBLICA DOMINICANA', unidad: 'Unidades', organica: false, especificacion: 'DISPOSITIVO MEDICO ESTERIL DE UN SOLO USO MANUFACTURADO EN ZONA FRANCA' },
  { codigoProducto: 'PRT202311-RON00150', codigoSA: '2208.40.10', nombreProducto: 'RON ANEJO RESERVA ESPECIAL 750ML', marca: 'RON QUISQUEYA', modelo: 'ANEJO 12 ANOS', origenCodigo: '214', origenNombre: 'REPÚBLICA DOMINICANA', unidad: 'Litros', organica: false, especificacion: 'RON DOMINICANO EN BOTELLA DE VIDRIO 750ML 40% ALC. VOL.' },
  { codigoProducto: 'PRT202405-VEH00019', codigoSA: '8703.23.90', nombreProducto: 'AUTOMOVIL SEDAN REEXPORTACION', marca: 'TOYOTA', modelo: 'COROLLA XLE', origenCodigo: '840', origenNombre: 'ESTADOS UNIDOS', unidad: 'Unidades', organica: false, especificacion: 'VEHICULO DE PASAJEROS PARA SALIDA TEMPORAL / REEXPORTACION' },
];

export const CERTIFICADOS_ORIGEN_CATALOGO: CertificadoOrigenCatalogo[] = [
  { secuencia: 'CO-2026-000412', noCertificado: 'DRCAFTA-26-10030-00412', codigoSA: '6205.20.00', tratamiento: 'PREFERENCIAL DR-CAFTA', acuerdoCodigo: '1', acuerdoNombre: 'DR-CAFTA', paisCodigo: '840', paisNombre: 'ESTADOS UNIDOS', fechaEmision: '15/10/2026' },
  { secuencia: 'CO-2026-000518', noCertificado: 'DRCAFTA-26-10150-00518', codigoSA: '2402.10.00', tratamiento: 'PREFERENCIAL DR-CAFTA', acuerdoCodigo: '1', acuerdoNombre: 'DR-CAFTA', paisCodigo: '840', paisNombre: 'ESTADOS UNIDOS', fechaEmision: '02/11/2026' },
  { secuencia: 'CO-2026-000609', noCertificado: 'EUR1-EPA-26-00609', codigoSA: '0803.90.11', tratamiento: 'PREFERENCIAL EPA CARIFORUM-UE', acuerdoCodigo: '2', acuerdoNombre: 'EPA (CARIFORUM-UE)', paisCodigo: '528', paisNombre: 'PAÍSES BAJOS', fechaEmision: '04/11/2026' },
  { secuencia: 'CO-2026-000645', noCertificado: 'EUR1-EPA-26-00645', codigoSA: '1801.00.10', tratamiento: 'PREFERENCIAL EPA CARIFORUM-UE', acuerdoCodigo: '2', acuerdoNombre: 'EPA (CARIFORUM-UE)', paisCodigo: '724', paisNombre: 'ESPAÑA', fechaEmision: '06/11/2026' },
];

export const TIPOS_CONTENEDOR = [
  "FURGON CERRADO DE 20'",
  "FURGON CERRADO DE 40'",
  "FURGON CERRADO DE 40' HIGH CUBE",
  "FURGON REFRIGERADO DE 40' HIGH CUBE",
  "FURGON CERRADO DE 10'",
  "FURGON CERRADO DE 10' REFRIGERADO",
  "CONTENEDOR OPEN TOP DE 40'",
  "ISOTANQUE 20'",
  "CARGA SUELTA / AÉREA (ULD)",
];

export const TIPOS_DOCUMENTO = [
  'FACTURA COMERCIAL',
  'COMPROBANTE FISCAL DGII (e-CF 46 / NCF 16)',
  'CERTIFICADO DE ORIGEN',
  'CONOCIMIENTO DE EMBARQUE (B/L)',
  'GUÍA AÉREA (AWB)',
  'LISTA DE EMPAQUE',
  'PERMISO FITOSANITARIO / AGRICULTURA',
  'AUTORIZACIÓN PROINDUSTRIA / CNZFE',
  'OTRO',
];

export const INITIAL_DUAS: DeclaracionDUA[] = [
  {
    id: 'dua-seed-1',
    fechaDeclaracion: '08/11/2026',
    tipoDespacho: 'General',
    adminCodigo: '10030',
    adminNombre: 'ADMINISTRACION HAINA ORIENTAL',
    noDeclaracion: '10030-EC01-2611-000189',
    generarAuto: true,
    docEmbarque: 'HLCURIO26110841',
    depositoOrigenCodigo: 'DOHAI',
    depositoOrigenNombre: 'RIO HAINA',
    puertoSalidaCodigo: 'DOHAI',
    puertoSalidaNombre: 'RIO HAINA',
    paisDestinoCodigo: '840',
    paisDestinoNombre: 'ESTADOS UNIDOS',
    empresaTransportistaCodigo: 'TRS19950',
    empresaTransportistaNombre: 'ABC EMPRESA TRANSPORTISTA',
    noViajeVuelo: '226N',
    nacionalidadTransportistaCodigo: '214',
    nacionalidadTransportistaNombre: 'REPÚBLICA DOMINICANA',
    medioTransporte: '[HR32-1] MARÍTIMAS',
    fechaLlegada: '14/11/2026',
    exportadorNombre: 'DFG EMPRESA EXPORTADORA S.R.L.',
    exportadorDocTipo: 'RNC',
    exportadorDocNumero: '130000018',
    exportadorDireccion: 'CALLE ARRIBA #00, PARQUE INDUSTRIAL, SANTO DOMINGO',
    exportadorTelefono: '809-555-0000',
    exportadorFax: '809-555-0001',
    exportadorEmail: 'exportaciones@dfgempresa.com.do',
    agenteEmpresa: 'CABRERA & ASOCIADOS GESTIÓN ADUANAL S.R.L.',
    agenteNombre: 'CED0950 - CARMEN ELISA CABRERA HERNÁNDEZ',
    agenteLicencia: 'CED0950',
    agenteDocTipo: 'CED',
    agenteDocNumero: '00112233445',
    compradorNombre: '1EMPRESA COMPRADORA LLC',
    compradorNacionalidadCodigo: '840',
    compradorNacionalidadNombre: 'ESTADOS UNIDOS',
    compradorDocTipo: 'TID',
    compradorDocNumero: '11-1111111',
    regimenCodigo: '16',
    regimenNombre: 'EXPORTACION NACIONAL',
    acuerdoCodigo: '1',
    acuerdoNombre: 'DR-CAFTA',
    detalles: [
      {
        id: 'det-seed-1',
        sec: 1,
        temporalProducto: false,
        codigoSA: '6205.20.00',
        saCategoria: 'Camisas para hombres o niños - De algodón',
        codigoProducto: 'PRT201103-2800EEDA99',
        productoNombre: 'CAMISAS HOMBRE M/C 100% ALGODON',
        marca: 'N/A',
        modelo: 'N/A',
        estado: 'NUEVO',
        anio: 0,
        especificacion: 'CAMISAS DE VESTIR MANGA CORTA 100% ALGODON',
        unidad: 'Unidades',
        cantidad: 2400,
        fobUnitario: 12.5,
        pesoKg: 720,
        certificadoOrigen: true,
        certificadoSecuencia: 'CO-2026-000412',
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
        descripcion: 'CAMISAS HOMBRE M/C 100% ALGODON',
        descripcionMercancia: 'EMPACADAS EN 100 CAJAS DE CARTÓN CON ETIQUETADO DR-CAFTA',
      },
    ],
    aGranel: false,
    contenedores: [
      {
        id: 'cont-seed-1',
        sec: 1,
        tipoContenedor: "FURGON CERRADO DE 40'",
        numeroContenedor: 'HLXU4082914',
        sello: 'DGA-904812',
        noPlaca: 'L408291',
      },
    ],
    documentos: [
      {
        id: 'doc-seed-1',
        sec: 1,
        tipoDocumento: 'COMPROBANTE FISCAL DGII (e-CF 46 / NCF 16)',
        otrosTipoDocumento: '',
        noReferencia: 'E460000000189',
        emitidoPor: 'DFG EMPRESA EXPORTADORA S.R.L.',
        email: 'exportaciones@dfgempresa.com.do',
        telefono: '809-555-0000',
        archivoNombre: 'eCF_E460000000189.pdf',
        archivoTamano: '142 KB',
        ncfTipo: 'E46',
        montoFacturaRD: 1806000,
      },
      {
        id: 'doc-seed-2',
        sec: 2,
        tipoDocumento: 'CERTIFICADO DE ORIGEN',
        otrosTipoDocumento: '',
        noReferencia: 'DRCAFTA-26-10030-00412',
        emitidoPor: 'DGA / VUCE',
        email: 'origen@aduanas.gob.do',
        telefono: '809-547-7070',
        archivoNombre: 'Certificado_Origen_DRCAFTA.pdf',
        archivoTamano: '218 KB',
      },
    ],
    tasaCambio: 60.2,
    valorFobTotal: 30000,
    flete: 1850,
    seguro: 180,
    otroGasto: 0,
    valorCifTotalUsd: 32030,
    valorCifTotalRd: 1928206,
    pesoBrutoKg: 785,
    pesoNetoKg: 720,
    observacion: 'EMBARQUE SUJETO A PREFERENCIA ARANCELARIA DR-CAFTA. FACTURACIÓN ELECTRÓNICA DGII e-CF 46 VERIFICADA.',
    estado: 'Inspeccionando',
    selectividad: 'Inspección física',
    noSolicitudEntradaCarga: 'EGED-2611-000009',
    tasaDuaMonto: 300,
    tasaPagada: true,
    metodoPago: 'e-Banking Popular',
    referenciaPago: 'PAG-DGA-883421',
    fechaPresentacion: '08/11/2026 09:42',
    fechaInspeccion: '10/11/2026 10:30',
  },
  {
    id: 'dua-seed-2',
    fechaDeclaracion: '07/11/2026',
    tipoDespacho: 'General',
    adminCodigo: '10150',
    adminNombre: 'ADMINISTRACION PUERTO MULTIMODAL CAUCEDO',
    noDeclaracion: '10150-EC01-2611-000412',
    generarAuto: true,
    docEmbarque: 'MAEU920144821',
    depositoOrigenCodigo: 'DOCAU',
    depositoOrigenNombre: 'MULTIMODAL CAUCEDO',
    puertoSalidaCodigo: 'DOCAU',
    puertoSalidaNombre: 'MULTIMODAL CAUCEDO',
    paisDestinoCodigo: '840',
    paisDestinoNombre: 'ESTADOS UNIDOS',
    empresaTransportistaCodigo: 'MAEU001',
    empresaTransportistaNombre: 'MAERSK DOMINICANA S.A.S.',
    noViajeVuelo: '442W',
    nacionalidadTransportistaCodigo: '214',
    nacionalidadTransportistaNombre: 'REPÚBLICA DOMINICANA',
    medioTransporte: '[HR32-1] MARÍTIMAS',
    fechaLlegada: '12/11/2026',
    exportadorNombre: 'TABACALERA DEL CIBAO S.A.',
    exportadorDocTipo: 'RNC',
    exportadorDocNumero: '101783338',
    exportadorDireccion: 'CARRETERA DUARTE KM 14, TAMBORIL, SANTIAGO',
    exportadorTelefono: '809-580-2210',
    exportadorFax: '809-580-2211',
    exportadorEmail: 'aduanas@tabacaleracibao.com.do',
    agenteEmpresa: 'CABRERA & ASOCIADOS GESTIÓN ADUANAL S.R.L.',
    agenteNombre: 'CED0950 - CARMEN ELISA CABRERA HERNÁNDEZ',
    agenteLicencia: 'CED0950',
    agenteDocTipo: 'CED',
    agenteDocNumero: '00112233445',
    compradorNombre: 'ATLANTIC CIGAR DISTRIBUTORS INC.',
    compradorNacionalidadCodigo: '840',
    compradorNacionalidadNombre: 'ESTADOS UNIDOS',
    compradorDocTipo: 'TID',
    compradorDocNumero: '84-2910452',
    regimenCodigo: '11',
    regimenNombre: 'ZONAS FRANCAS INDUSTRIAL Y ESPECIALES',
    acuerdoCodigo: '1',
    acuerdoNombre: 'DR-CAFTA',
    detalles: [
      {
        id: 'det-seed-2',
        sec: 1,
        temporalProducto: false,
        codigoSA: '2402.10.00',
        saCategoria: 'Cigarros (puros) y cigarritos - Hechos a mano',
        codigoProducto: 'PRT202205-CIG00184',
        productoNombre: 'CIGARROS PUROS PREMIUM HECHOS A MANO',
        marca: 'DON CARLOS RESERVE',
        modelo: 'ROBUSTO 5X50',
        estado: 'NUEVO',
        anio: 0,
        especificacion: 'CAJAS DE CEDRO X 25 UNIDADES',
        unidad: 'Unidades',
        cantidad: 15000,
        fobUnitario: 4.8,
        pesoKg: 420,
        certificadoOrigen: true,
        certificadoSecuencia: 'CO-2026-000518',
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
        descripcion: 'CIGARROS PUROS PREMIUM HECHOS A MANO',
        descripcionMercancia: '600 CAJAS DE CEDRO CON BANDAS DE SEGURIDAD',
      },
    ],
    aGranel: false,
    contenedores: [
      {
        id: 'cont-seed-2',
        sec: 1,
        tipoContenedor: "FURGON CERRADO DE 20'",
        numeroContenedor: 'MSKU3184920',
        sello: 'CAU-77310',
        noPlaca: 'L318492',
      },
    ],
    documentos: [
      {
        id: 'doc-seed-3',
        sec: 1,
        tipoDocumento: 'COMPROBANTE FISCAL DGII (e-CF 46 / NCF 16)',
        otrosTipoDocumento: '',
        noReferencia: 'E460000000412',
        emitidoPor: 'TABACALERA DEL CIBAO S.A.',
        email: 'aduanas@tabacaleracibao.com.do',
        telefono: '809-580-2210',
        archivoNombre: 'Factura_Exportacion_E46.xml',
        archivoTamano: '48 KB',
        ncfTipo: 'E46',
        montoFacturaRD: 4334400,
      },
    ],
    tasaCambio: 60.2,
    valorFobTotal: 72000,
    flete: 2200,
    seguro: 350,
    otroGasto: 0,
    valorCifTotalUsd: 74550,
    valorCifTotalRd: 4487910,
    pesoBrutoKg: 485,
    pesoNetoKg: 420,
    observacion: 'EXPORTACIÓN DE ZONA FRANCA BAJO LEY 8-90.',
    estado: 'Despacho Aprobado',
    selectividad: 'Verde (Documental)',
    noSolicitudEntradaCarga: 'EGED-2611-000004',
    tasaDuaMonto: 300,
    tasaPagada: true,
    metodoPago: 'Código Prepago DGA',
    referenciaPago: 'PRE-10150-90211',
    fechaPresentacion: '07/11/2026 14:18',
  },
  {
    id: 'dua-seed-3',
    fechaDeclaracion: '09/11/2026',
    tipoDespacho: 'General',
    adminCodigo: '10110',
    adminNombre: 'ADMINISTRACION MANZANILLO',
    noDeclaracion: '10110-EC01-2611-000075',
    generarAuto: true,
    docEmbarque: 'CRWL77819203',
    depositoOrigenCodigo: 'DOMAN',
    depositoOrigenNombre: 'PUERTO MANZANILLO',
    puertoSalidaCodigo: 'DOMAN',
    puertoSalidaNombre: 'PUERTO MANZANILLO',
    paisDestinoCodigo: '528',
    paisDestinoNombre: 'PAÍSES BAJOS',
    empresaTransportistaCodigo: 'CRWL002',
    empresaTransportistaNombre: 'CROWLEY LINER SERVICES RD',
    noViajeVuelo: 'MAN-091E',
    nacionalidadTransportistaCodigo: '840',
    nacionalidadTransportistaNombre: 'ESTADOS UNIDOS',
    medioTransporte: '[HR32-1] MARÍTIMAS',
    fechaLlegada: '24/11/2026',
    exportadorNombre: 'AGROEXPORTADORA BANANOS DEL NOROESTE S.R.L.',
    exportadorDocTipo: 'RNC',
    exportadorDocNumero: '105012342',
    exportadorDireccion: 'FINCA LA CRUZ, KILÓMETRO 6, MAO, VALVERDE',
    exportadorTelefono: '809-572-3315',
    exportadorFax: '809-572-3316',
    exportadorEmail: 'despacho@bananosnoroeste.do',
    agenteEmpresa: '',
    agenteNombre: '',
    agenteLicencia: '',
    agenteDocTipo: '',
    agenteDocNumero: '',
    compradorNombre: 'EUROFRUIT ORGANIC ROTTERDAM B.V.',
    compradorNacionalidadCodigo: '528',
    compradorNacionalidadNombre: 'PAÍSES BAJOS',
    compradorDocTipo: 'TID',
    compradorDocNumero: 'NL812945012B01',
    regimenCodigo: '16',
    regimenNombre: 'EXPORTACION NACIONAL',
    acuerdoCodigo: '2',
    acuerdoNombre: 'EPA (CARIFORUM-UE)',
    detalles: [
      {
        id: 'det-seed-3',
        sec: 1,
        temporalProducto: false,
        codigoSA: '0803.90.11',
        saCategoria: 'Bananas o plátanos frescos - Cavendish Valery',
        codigoProducto: 'PRT202304-BAN00410',
        productoNombre: 'BANANO CAVENDISH FRESCO ORGANICO',
        marca: 'VALLEY FRESH RD',
        modelo: 'CAJA 18.14 KG',
        estado: 'NUEVO',
        anio: 0,
        especificacion: 'BANANO ORGANICO CERTIFICADO GLOBALGAP',
        unidad: 'Cajas',
        cantidad: 1080,
        fobUnitario: 11.2,
        pesoKg: 19591.2,
        certificadoOrigen: true,
        certificadoSecuencia: 'CO-2026-000609',
        organica: true,
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
        descripcion: 'BANANO CAVENDISH FRESCO ORGANICO',
        descripcionMercancia: '20 PALETAS REFRIGERADAS EN CONTENEDOR REEFER A 13.5°C',
      },
    ],
    aGranel: false,
    contenedores: [
      {
        id: 'cont-seed-3',
        sec: 1,
        tipoContenedor: "FURGON REFRIGERADO DE 40' HIGH CUBE",
        numeroContenedor: 'CRXU9044128',
        sello: 'MAN-44102',
        noPlaca: 'F904412',
      },
    ],
    documentos: [
      {
        id: 'doc-seed-4',
        sec: 1,
        tipoDocumento: 'COMPROBANTE FISCAL DGII (e-CF 46 / NCF 16)',
        otrosTipoDocumento: '',
        noReferencia: 'E460000000075',
        emitidoPor: 'AGROEXPORTADORA BANANOS DEL NOROESTE S.R.L.',
        email: 'despacho@bananosnoroeste.do',
        telefono: '809-572-3315',
        ncfTipo: 'E46',
        montoFacturaRD: 728179.2,
      },
    ],
    tasaCambio: 60.2,
    valorFobTotal: 12096,
    flete: 2950,
    seguro: 145,
    otroGasto: 0,
    valorCifTotalUsd: 15191,
    valorCifTotalRd: 914498.2,
    pesoBrutoKg: 21150,
    pesoNetoKg: 19591.2,
    observacion: 'MERCANCÍA PERECEDERA ORGÁNICA. REQUIERE CADENA DE FRÍO CONTINUA.',
    estado: 'Registrado/Aceptado',
    selectividad: 'Amarillo (Revisión)',
    noSolicitudEntradaCarga: 'EGED-2611-000014',
    tasaDuaMonto: 300,
    tasaPagada: false,
    fechaPresentacion: '09/11/2026 16:05',
  },
];

export const INITIAL_CARGA_ENTRADA: CargaEntradaRegistro[] = [
  {
    id: 'cg-1',
    sec: 1,
    noSolicitud: 'EGED-2611-000009',
    fechaTentativaEntrada: '10/11/2026',
    noDeclaracion: '10030-EC01-2611-000189',
    aduanaSalidaCodigo: '10030',
    aduanaSalidaNombre: 'ADMINISTRACION HAINA ORIENTAL',
    empresaTransportista: 'TRS19950 · ABC EMPRESA TRANSPORTISTA',
    noViaje: '226N',
    tipoCarga: 'Contenedorizada',
    noContenedor: 'HLXU4082914',
    noPlaca: 'L408291',
    noSello: 'DGA-904812',
    cantidadBultos: 100,
    estadoSolicitud: 'Ingresada en Administración',
  },
  {
    id: 'cg-2',
    sec: 2,
    noSolicitud: 'EGED-2611-000004',
    fechaTentativaEntrada: '08/11/2026',
    noDeclaracion: '10150-EC01-2611-000412',
    aduanaSalidaCodigo: '10150',
    aduanaSalidaNombre: 'ADMINISTRACION PUERTO MULTIMODAL CAUCEDO',
    empresaTransportista: 'MAEU001 · MAERSK DOMINICANA S.A.S.',
    noViaje: '442W',
    tipoCarga: 'Contenedorizada',
    noContenedor: 'MSKU3184920',
    noPlaca: 'L318492',
    noSello: 'CAU-77310',
    cantidadBultos: 600,
    estadoSolicitud: 'Ingresada en Administración',
  },
  {
    id: 'cg-3',
    sec: 3,
    noSolicitud: 'EGED-2611-000014',
    fechaTentativaEntrada: '10/11/2026',
    noDeclaracion: '10110-EC01-2611-000075',
    aduanaSalidaCodigo: '10110',
    aduanaSalidaNombre: 'ADMINISTRACION MANZANILLO',
    empresaTransportista: 'CRWL002 · CROWLEY LINER SERVICES RD',
    noViaje: 'MAN-091E',
    tipoCarga: 'Contenedorizada (Reefer)',
    noContenedor: 'CRXU9044128',
    noPlaca: 'F904412',
    noSello: 'MAN-44102',
    cantidadBultos: 1080,
    estadoSolicitud: 'Registro',
  },
];

export const INITIAL_CORRECCIONES: SolicitudCorreccion[] = [
  {
    id: 'corr-1',
    sec: 1,
    noSolicitudCorreccion: '10030-EC02-2611-000026',
    fechaCorreccion: '09/11/2026 08:57',
    fechaVencimiento: '12/11/2026 08:57',
    fechaTermino: '',
    tipoSolicitud: 'Solicitud de Corrección para Declaración de Exportación',
    noFormularioReferencia: '10030-EC01-2611-000189',
    tipoFormularioReferencia: 'Declaración de Exportación',
    adminCodigo: '10030',
    adminNombre: 'ADMINISTRACION HAINA ORIENTAL',
    depositoDestinoCodigo: 'DOHAI',
    depositoDestinoNombre: 'RIO HAINA',
    detalleCorreccion: 'SOLICITUD DE CORRECCIÓN EN PESO BRUTO DE CONTENEDOR HLXU4082914 DE 780 KG A 785 KG SEGÚN TICKET DE BÁSCULA PORTUARIA.',
    archivoNombre: 'Ticket_Bascula_Haina.pdf',
    agenteEmpresa: 'CABRERA & ASOCIADOS GESTIÓN ADUANAL S.R.L.',
    agenteNombre: 'CARMEN ELISA CABRERA HERNÁNDEZ',
    agenteLicencia: 'CED0950',
    estado: 'Registrado/Aceptado',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    fecha: '09/11/2026 16:05',
    titulo: 'Pago Pendiente Tasa DUA Exportación (RD$300.00)',
    mensaje: 'La declaración 10110-EC01-2611-000075 fue registrada. Debe completar el pago de RD$300.00 por e-Banking o Código Prepago para habilitar la impresión.',
    documentoRef: '10110-EC01-2611-000075',
    tipo: 'warning',
    leida: false,
  },
  {
    id: 'notif-2',
    fecha: '09/11/2026 08:57',
    titulo: 'Solicitud de Corrección Recibida',
    mensaje: 'La solicitud 10030-EC02-2611-000026 vinculada al DUA 10030-EC01-2611-000189 se encuentra pendiente de evaluación por el Oficial de Aduanas.',
    documentoRef: '10030-EC02-2611-000026',
    tipo: 'info',
    leida: false,
  },
  {
    id: 'notif-3',
    fecha: '08/11/2026 11:20',
    titulo: 'Asignación de Inspección Física',
    mensaje: 'El expediente 10030-EC01-2611-000189 ha sido asignado a Inspección Física en Haina Oriental para el 10/11/2026 a las 10:30.',
    documentoRef: '10030-EC01-2611-000189',
    tipo: 'info',
    leida: true,
  },
];

export const SAMPLE_DUA_XML = `<?xml version="1.0" encoding="UTF-8"?>
<DUAExportacion xmlns="http://aduanas.gob.do/siga/ec01">
  <Cabecera>
    <FechaDeclaracion>10/11/2026</FechaDeclaracion>
    <TipoDespacho>General</TipoDespacho>
    <AdministracionCodigo>10150</AdministracionCodigo>
    <AdministracionNombre>ADMINISTRACION PUERTO MULTIMODAL CAUCEDO</AdministracionNombre>
    <DocEmbarque>MSCU2611099842</DocEmbarque>
    <DepositoOrigenCodigo>DOCAU</DepositoOrigenCodigo>
    <DepositoOrigenNombre>MULTIMODAL CAUCEDO</DepositoOrigenNombre>
    <PuertoSalidaCodigo>DOCAU</PuertoSalidaCodigo>
    <PuertoSalidaNombre>MULTIMODAL CAUCEDO</PuertoSalidaNombre>
    <PaisDestinoCodigo>724</PaisDestinoCodigo>
    <PaisDestinoNombre>ESPAÑA</PaisDestinoNombre>
    <EmpresaTransportistaCodigo>MSCU003</EmpresaTransportistaCodigo>
    <EmpresaTransportistaNombre>MSC MEDITERRANEAN SHIPPING RD</EmpresaTransportistaNombre>
    <NoViajeVuelo>EU-714N</NoViajeVuelo>
    <NacionalidadTransportistaCodigo>214</NacionalidadTransportistaCodigo>
    <NacionalidadTransportistaNombre>REPÚBLICA DOMINICANA</NacionalidadTransportistaNombre>
    <MedioTransporte>[HR32-1] MARÍTIMAS</MedioTransporte>
    <FechaLlegada>26/11/2026</FechaLlegada>
  </Cabecera>
  <Exportador>
    <Nombre>DFG EMPRESA EXPORTADORA S.R.L.</Nombre>
    <DocumentoTipo>RNC</DocumentoTipo>
    <DocumentoNumero>130000018</DocumentoNumero>
    <Direccion>CALLE ARRIBA #00, PARQUE INDUSTRIAL, SANTO DOMINGO</Direccion>
    <Telefono>809-555-0000</Telefono>
    <Fax>809-555-0001</Fax>
    <Email>exportaciones@dfgempresa.com.do</Email>
  </Exportador>
  <Comprador>
    <Nombre>CACAO IBÉRICO DE ALTURA S.L.</Nombre>
    <NacionalidadCodigo>724</NacionalidadCodigo>
    <NacionalidadNombre>ESPAÑA</NacionalidadNombre>
    <DocumentoTipo>TID</DocumentoTipo>
    <DocumentoNumero>ESB82940112</DocumentoNumero>
  </Comprador>
  <RegimenYAcuerdo>
    <RegimenCodigo>16</RegimenCodigo>
    <RegimenNombre>EXPORTACION NACIONAL</RegimenNombre>
    <AcuerdoCodigo>2</AcuerdoCodigo>
    <AcuerdoNombre>EPA (CARIFORUM-UE)</AcuerdoNombre>
  </RegimenYAcuerdo>
  <Detalles>
    <Item>
      <CodigoSA>1801.00.10</CodigoSA>
      <CodigoProducto>PRT202301-CAC00912</CodigoProducto>
      <ProductoNombre>CACAO EN GRANO HISPANIOLA ORGANICO</ProductoNombre>
      <Marca>N/A</Marca>
      <Modelo>FERMENTADO GRADO 1</Modelo>
      <Estado>NUEVO</Estado>
      <Anio>0</Anio>
      <Especificacion>SACOS DE YUTE DE 70 KG CERTIFICADO USDA ORGANIC / EU</Especificacion>
      <Unidad>Kilogramos</Unidad>
      <Cantidad>14000</Cantidad>
      <FobUnitario>6.85</FobUnitario>
      <PesoKg>14000</PesoKg>
      <CertificadoOrigen>true</CertificadoOrigen>
      <CertificadoSecuencia>CO-2026-000645</CertificadoSecuencia>
      <Organica>true</Organica>
      <GradoAlcohol>0</GradoAlcohol>
      <PaisOrigenCodigo>214</PaisOrigenCodigo>
      <PaisOrigenNombre>REPÚBLICA DOMINICANA</PaisOrigenNombre>
      <Descripcion>CACAO EN GRANO HISPANIOLA ORGANICO</Descripcion>
      <DescripcionMercancia>200 SACOS DE YUTE DE 70 KG NETOS CADA UNO, COSECHA 2026</DescripcionMercancia>
    </Item>
  </Detalles>
  <Contenedores>
    <AGranel>false</AGranel>
    <Contenedor>
      <Tipo>FURGON CERRADO DE 20'</Tipo>
      <Numero>MSCU8841209</Numero>
      <Sello>EPA-60291</Sello>
      <NoPlaca>L884120</NoPlaca>
    </Contenedor>
  </Contenedores>
  <Documentos>
    <Documento>
      <Tipo>COMPROBANTE FISCAL DGII (e-CF 46 / NCF 16)</Tipo>
      <NoReferencia>E460000000902</NoReferencia>
      <EmitidoPor>DFG EMPRESA EXPORTADORA S.R.L.</EmitidoPor>
      <Email>exportaciones@dfgempresa.com.do</Email>
      <Telefono>809-555-0000</Telefono>
    </Documento>
    <Documento>
      <Tipo>CERTIFICADO DE ORIGEN</Tipo>
      <NoReferencia>EUR1-EPA-26-00645</NoReferencia>
      <EmitidoPor>DGA / VUCE</EmitidoPor>
      <Email>origen@aduanas.gob.do</Email>
      <Telefono>809-547-7070</Telefono>
    </Documento>
  </Documentos>
  <ValoresYPeso>
    <TasaCambio>60.20</TasaCambio>
    <Flete>2650.00</Flete>
    <Seguro>480.00</Seguro>
    <OtroGasto>0.00</OtroGasto>
    <PesoBrutoKg>14280.00</PesoBrutoKg>
    <Observacion>EXPORTACION DE CACAO ORGANICO BAJO ACUERDO EPA CARIFORUM-UE.</Observacion>
  </ValoresYPeso>
</DUAExportacion>`;
