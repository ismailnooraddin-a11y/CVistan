// src/lib/pdf/tokens.ts
// Single Source of Truth for CV Design System

export type Density = 'compact' | 'normal' | 'spacious';

// =============================================================================
// CORE DESIGN TOKENS - NEVER AUTO-SCALE THESE
// =============================================================================

export const TOKENS = {
  // Page (A4: 210mm x 297mm)
  page: {
    width: 210,
    height: 297,
    margin: 0,
  },

  // Typography Scale
  fonts: {
    name: 28,
    jobTitle: 14,
    sectionTitle: 11,
    body: 10,
    small: 9,
    tiny: 8,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Colors
  colors: {
    headerBg: '#1a202c',
    headerText: '#ffffff',
    accent: '#3182ce',

    textPrimary: '#1a202c',
    textSecondary: '#4a5568',
    textMuted: '#718096',
    textLight: '#a0aec0',

    sidebarBg: '#f8fafc',
    white: '#ffffff',

    border: '#e2e8f0',
    divider: '#cbd5e1',
  },

  // Layout
  grid: {
    sidebarWidth: '32%',
    mainWidth: '68%',
    dateColumnWidth: 110,
    gutter: 16,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  divider: {
    weight: 1,
    style: 'solid',
  },

  bullet: {
    char: '•',
    indent: 14,
    gap: 6,
  },
};

// =============================================================================
// DENSITY PRESETS - Only affects spacing, NOT font sizes
// =============================================================================

export const DENSITY: Record<
  Density,
  {
    sectionGap: number;
    itemGap: number;
    bulletGap: number;
    headerPadding: number;
    sidebarPadding: number;
    mainPadding: number;
    lineHeight: number;
  }
> = {
  compact: {
    sectionGap: 14,
    itemGap: 10,
    bulletGap: 3,
    headerPadding: 20,
    sidebarPadding: 20,
    mainPadding: 24,
    lineHeight: 1.3,
  },
  normal: {
    sectionGap: 20,
    itemGap: 14,
    bulletGap: 5,
    headerPadding: 24,
    sidebarPadding: 24,
    mainPadding: 28,
    lineHeight: 1.4,
  },
  spacious: {
    sectionGap: 28,
    itemGap: 18,
    bulletGap: 7,
    headerPadding: 28,
    sidebarPadding: 28,
    mainPadding: 32,
    lineHeight: 1.5,
  },
};

// =============================================================================
// PRINT/EXPORT CSS - PDF SAFE
// =============================================================================

export const PRINT_STYLES = `
  @media print {

    /* --- Embed PDF-safe font (ship this in /public/fonts) --- */
    @font-face {
      font-family: "Inter";
      src: url("/fonts/Inter-Regular.woff2") format("woff2");
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: "Inter";
      src: url("/fonts/Inter-SemiBold.woff2") format("woff2");
      font-weight: 600;
      font-style: normal;
    }
    @font-face {
      font-family: "Inter";
      src: url("/fonts/Inter-Bold.woff2") format("woff2");
      font-weight: 700;
      font-style: normal;
    }

    /* --- Robust isolation (Next.js safe) --- */
    body * { visibility: hidden !important; }
    .cv-page, .cv-page * { visibility: visible !important; }
    .cv-page { position: absolute; left: 0; top: 0; }

    /* --- Page setup --- */
    @page { size: A4 portrait; margin: 0; }
    html, body { margin: 0 !important; padding: 0 !important; }

    /* --- A4 sizing --- */
    .cv-page {
      width: 210mm !important;
      min-height: 297mm !important;
      box-sizing: border-box !important;
      font-family: "Inter", Arial, sans-serif !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      box-shadow: none !important;
      border: none !important;
    }

    /* --- Repeat sidebar background on every page --- */
    .cv-page {
      background: linear-gradient(
        to right,
        ${TOKENS.colors.sidebarBg} 0%,
        ${TOKENS.colors.sidebarBg} 32%,
        ${TOKENS.colors.white} 32%,
        ${TOKENS.colors.white} 100%
      ) !important;
    }

    /* RTL sidebar on right */
    .cv-page[dir="rtl"] {
      background: linear-gradient(
        to left,
        ${TOKENS.colors.sidebarBg} 0%,
        ${TOKENS.colors.sidebarBg} 32%,
        ${TOKENS.colors.white} 32%,
        ${TOKENS.colors.white} 100%
      ) !important;
    }

    /* Sidebar becomes transparent (gradient is source of truth) */
    .cv-sidebar { background: transparent !important; }

    /* --- Pagination rules --- */
    .cv-section {
      break-inside: auto !important;
      page-break-inside: auto !important;
    }
    .cv-item {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
    .cv-section-title {
      break-after: avoid !important;
      page-break-after: avoid !important;
    }

    /* Hide UI */
    .no-print, .editor-ui, .toolbar, .navigation, .step-indicator {
      display: none !important;
    }
  }
`;

// =============================================================================
// VALIDATION CONSTANTS
// =============================================================================

export const DEGREE_TYPES = [
  'High School Diploma',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctoral Degree (PhD)',
  'Professional Degree',
  'Certificate',
  'Diploma',
] as const;

export const FIELDS_OF_STUDY = [
  'Accounting',
  'Business Administration',
  'Computer Science',
  'Economics',
  'Engineering',
  'Finance',
  'Information Technology',
  'Law',
  'Marketing',
  'Medicine',
  'Psychology',
  'Other',
] as const;

export type DegreeType = (typeof DEGREE_TYPES)[number];
export type FieldOfStudy = (typeof FIELDS_OF_STUDY)[number];
