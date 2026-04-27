import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type Language = 'en' | 'es';

interface Translations {
  title: string;
  subtitle: string;
  placeholder: string;
  checkBtn: string;
  loadingTexts: string[];
  resultsTitle: string;
  nodeServices: string;
  coverageServices: string;
  expectedPrice: string;
  nodesFound: string;
  minDistance: string;
  avgDistance: string;
  provider: string;
  bandwidth: string;
  scope: string;
  languages: string;
  coverageDetected: string;
  noCoverage: string;
  formTitle: string;
  formSubtitle: string;
  firstName: string;
  lastName: string;
  corpEmail: string;
  corpPhone: string;
  role: string;
  rolePlaceholder: string;
  privacyCheck: string;
  submitForm: string;
  formSuccess: string;
  errorCorpEmail: string;
  errorRequired: string;
  gateTitle: string;
  gateSubtitle: string;
  gateEmailPlaceholder: string;
  gateBtn: string;
  gateSuccess: string;
  backToSearch: string;
  faqTitle: string;
  cookieConsent: string;
  cookieAccept: string;
  cookieDecline: string;
  details: string;
  downloadSql: string;
  bandwidthLabel: string;
  bandwidthHint: string;
  filterServices: string;
  selectAll: string;
  clearAll: string;
  requestInfo: string;
  requestInfoFor: string;
  closeModal: string;
}

const translations: Record<Language, Translations> = {
  en: {
    title: "Enter an address to check global connectivity",
    subtitle: "Enterprise-grade B2B platform to analyze physical nodes, LEO/MEO satellite footprints, and dark fiber availability in real-time.",
    placeholder: "e.g., 111 8th Ave, New York or Paseo de la Castellana, Madrid",
    checkBtn: "Check Connectivity",
    loadingTexts: [
      "Analyzing local physical nodes...",
      "Cross-referencing global transit rates...",
      "Calculating PostGIS spatial percentiles...",
      "Querying Dark Fiber route databases...",
      "Checking LEO/MEO satellite footprints...",
      "Validating regional 5G spectrum allocations..."
    ],
    resultsTitle: "Connectivity Insights",
    nodeServices: "Dedicated Physical Infrastructure (Node-Based)",
    coverageServices: "Wireless & Satellite Infrastructure (Coverage-Based)",
    expectedPrice: "Expected price range: from {p10} to {p60} /mo",
    nodesFound: "Infrastructure nodes found within radius",
    minDistance: "Closest node distance",
    avgDistance: "Average node distance",
    provider: "Provider",
    bandwidth: "Max Bandwidth",
    scope: "Service Scope",
    languages: "SLA Support Languages",
    coverageDetected: "Coverage Detected",
    noCoverage: "No specialized coverage services found for this country in our database.",
    formTitle: "Request Pricing & Technical Specs",
    formSubtitle: "Enter your corporate details to receive custom pricing, SLA sheets, and engineer consultation.",
    firstName: "First Name",
    lastName: "Last Name",
    corpEmail: "Corporate Email",
    corpPhone: "Corporate Phone",
    role: "Job Title / Role",
    rolePlaceholder: "e.g., Network Engineer, CIO, Procurement",
    privacyCheck: "I accept the Privacy Policy for corporate data processing under GDPR/CCPA regulations.",
    submitForm: "Request Technical Call",
    formSuccess: "Thank you! An infrastructure specialist will contact your corporate email within 2 hours.",
    errorCorpEmail: "Free email domains (Gmail, Outlook, Yahoo, etc.) are strictly prohibited. Please enter your corporate email.",
    errorRequired: "This field is required",
    gateTitle: "Corporate Verification Required",
    gateSubtitle: "You have exceeded your 3 free anonymous searches. As an enterprise PaaS, we require corporate identification to grant additional high-capacity queries.",
    gateEmailPlaceholder: "you@company.com",
    gateBtn: "Unlock 50 Free Searches",
    gateSuccess: "Corporate email accepted! We've sent a Magic Link to your inbox. Click it to immediately unlock 50 additional searches.",
    backToSearch: "Back to Search",
    faqTitle: "Frequently Asked Questions",
    cookieConsent: "We use cookies to analyze traffic, manage your B2B search quota, and optimize your experience. By clicking 'Accept', you agree to our use of cookies in accordance with GDPR.",
    cookieAccept: "Accept All",
    cookieDecline: "Decline Non-Essential",
    details: "View Details",
    downloadSql: "View Supabase SQL Schema",
    bandwidthLabel: "Desired Bandwidth",
    bandwidthHint: "Adjust to get more accurate pricing for your bandwidth requirement.",
    filterServices: "Filter Services",
    selectAll: "Select all",
    clearAll: "Clear",
    requestInfo: "Request More Info",
    requestInfoFor: "Request information about",
    closeModal: "Close"
  },
  es: {
    title: "Introduce una dirección para verificar la conectividad global",
    subtitle: "Plataforma B2B para analizar nodos físicos, huella de satélites LEO/MEO y disponibilidad de fibra oscura en tiempo real.",
    placeholder: "ej., Paseo de la Castellana 259, Madrid o 111 8th Ave, New York",
    checkBtn: "Verificar Conectividad",
    loadingTexts: [
      "Analizando nodos físicos locales...",
      "Cruzando tarifas de tránsito global...",
      "Calculando percentiles espaciales con PostGIS...",
      "Consultando bases de datos de rutas de Fibra Oscura...",
      "Verificando huella de satélites LEO/MEO...",
      "Validando asignaciones de espectro 5G regional..."
    ],
    resultsTitle: "Información de Conectividad",
    nodeServices: "Infraestructura Física Dedicada (Basada en Nodos)",
    coverageServices: "Infraestructura Inalámbrica y Satelital (Basada en Cobertura)",
    expectedPrice: "Rango de precio esperado: de {p10} a {p60} /mes",
    nodesFound: "Nodos de infraestructura encontrados en el radio",
    minDistance: "Distancia al nodo más cercano",
    avgDistance: "Distancia media de los nodos",
    provider: "Proveedor",
    bandwidth: "Ancho de Banda Máx",
    scope: "Ámbito del Servicio",
    languages: "Idiomas de Soporte SLA",
    coverageDetected: "Cobertura Detectada",
    noCoverage: "No se encontraron servicios de cobertura especializada para este país en nuestra base de datos.",
    formTitle: "Solicitar Presupuesto y Fichas Técnicas",
    formSubtitle: "Introduce tus datos corporativos para recibir precios personalizados, contratos SLA y consultoría técnica.",
    firstName: "Nombre",
    lastName: "Apellidos",
    corpEmail: "Correo Corporativo",
    corpPhone: "Teléfono Corporativo",
    role: "Puesto / Cargo",
    rolePlaceholder: "ej., Ingeniero de Redes, CIO, Compras",
    privacyCheck: "Acepto la Política de Privacidad para el tratamiento de datos corporativos bajo la normativa RGPD/CCPA.",
    submitForm: "Solicitar Llamada Técnica",
    formSuccess: "¡Gracias! Un especialista en infraestructura se pondrá en contacto con tu correo corporativo en menos de 2 horas.",
    errorCorpEmail: "Los dominios de correo gratuitos (Gmail, Outlook, Yahoo, etc.) están estrictamente prohibidos. Introduce tu correo corporativo.",
    errorRequired: "Este campo es obligatorio",
    gateTitle: "Verificación Corporativa Requerida",
    gateSubtitle: "Has superado tus 3 búsquedas anónimas gratuitas. Como plataforma PaaS empresarial, requerimos identificación corporativa para conceder consultas adicionales de alta capacidad.",
    gateEmailPlaceholder: "tu@empresa.com",
    gateBtn: "Desbloquear 50 Búsquedas",
    gateSuccess: "¡Correo corporativo aceptado! Hemos enviado un Enlace Mágico (Magic Link) a tu bandeja de entrada. Haz clic para desbloquear 50 búsquedas adicionales de inmediato.",
    backToSearch: "Volver a la Búsqueda",
    faqTitle: "Preguntas Frecuentes",
    cookieConsent: "Utilizamos cookies para analizar el tráfico, gestionar tu cuota de búsquedas B2B y optimizar tu experiencia. Al hacer clic en 'Aceptar', aceptas nuestro uso de cookies de acuerdo con el RGPD.",
    cookieAccept: "Aceptar Todas",
    cookieDecline: "Rechazar No Esenciales",
    details: "Ver Detalles",
    downloadSql: "Ver Esquema SQL Supabase",
    bandwidthLabel: "Ancho de Banda Deseado",
    bandwidthHint: "Ajusta para obtener un precio más preciso según tu requisito de ancho de banda.",
    filterServices: "Filtrar Servicios",
    selectAll: "Todos",
    clearAll: "Ninguno",
    requestInfo: "Solicitar Más Información",
    requestInfoFor: "Solicitar información sobre",
    closeModal: "Cerrar"
  }
};

interface I18nContextType {
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine language from URL path
  const getLangFromPath = (path: string): Language => {
    const parts = path.split('/');
    if (parts[1] === 'es') return 'es';
    return 'en'; // default
  };

  const [lang, setLang] = useState<Language>(getLangFromPath(location.pathname));

  useEffect(() => {
    const currentLang = getLangFromPath(location.pathname);
    if (currentLang !== lang) {
      setLang(currentLang);
    }
  }, [location.pathname]);

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    const parts = location.pathname.split('/');
    if (parts[1] === 'en' || parts[1] === 'es') {
      parts[1] = newLang;
    } else {
      parts.splice(1, 0, newLang);
    }
    const newPath = '/' + parts.filter(Boolean).join('/');
    navigate(newPath);
  };

  return (
    <I18nContext.Provider value={{ lang, setLanguage, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
