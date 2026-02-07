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
    margin: 0, // We handle margins in the template
  },

  // Fixed Typography Scale (in pixels, converted to pt for PDF)
  fonts: {
    name: 28,        // Main name
    jobTitle: 14,    // Job title under name
    sectionTitle: 11, // Section headers
    body: 10,        // Main content
    small: 9,        // Secondary info
    tiny: 8,         // Dates, metadata
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Color Palette (Professional, ATS-friendly)
  colors: {
    // Primary
    headerBg: '#1a202c',      // Dark header background
    headerText: '#ffffff',    // White text on header
    accent: '#3182ce',        // Blue accent for highlights
    
    // Text
    textPrimary: '#1a202c',   // Main text (almost black)
    textSecondary: '#4a5568', // Secondary text (dark gray)
    textMuted: '#718096',     // Muted text (medium gray)
    textLight: '#a0aec0',     // Light text (light gray)
    
    // Backgrounds
    sidebarBg: '#f8fafc',     // Light gray sidebar
    white: '#ffffff',
    
    // Borders
    border: '#e2e8f0',        // Light border
    divider: '#cbd5e1',       // Section dividers
  },

  // Layout Grid
  grid: {
    sidebarWidth: '32%',      // Sidebar takes 32% of width
    mainWidth: '68%',         // Main content takes 68%
    dateColumnWidth: 110,     // Fixed width for date column (px)
    gutter: 16,               // Gap between columns
  },

  // Spacing Scale (consistent increments)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  // Border & Divider
  divider: {
    weight: 1,        // 1px divider lines (subtle)
    style: 'solid',
  },

  // Bullet Styling
  bullet: {
    char: '•',
    indent: 14,       // Left indent for bullets
    gap: 6,           // Space after bullet char
  },
};

// =============================================================================
// DENSITY PRESETS - Only affects spacing, NOT font sizes
// =============================================================================

export const DENSITY: Record<Density, {
  sectionGap: number;      // Space between sections
  itemGap: number;         // Space between items (jobs, education entries)
  bulletGap: number;       // Space between bullet points
  headerPadding: number;   // Header internal padding
  sidebarPadding: number;  // Sidebar internal padding
  mainPadding: number;     // Main content internal padding
  lineHeight: number;      // Line height multiplier
}> = {
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
// PRINT/EXPORT CSS - Hides ALL editor UI elements
// =============================================================================

export const PRINT_STYLES = `
  @media print {
    /* Hide all non-CV elements */
    body > *:not(.cv-page) { display: none !important; }
    .no-print, 
    .editor-ui, 
    .toolbar, 
    .navigation,
    .step-indicator,
    button:not(.cv-content *) { 
      display: none !important; 
    }

    /* Page setup */
    @page {
      size: A4 portrait;
      margin: 0;
    }

    /* Prevent bad breaks */
    .cv-section { 
      break-inside: avoid; 
      page-break-inside: avoid; 
    }
    .cv-item { 
      break-inside: avoid; 
      page-break-inside: avoid; 
    }
    .cv-section-title { 
      break-after: avoid; 
      page-break-after: avoid; 
    }

    /* Ensure colors print */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    /* Remove shadows/borders for clean print */
    .cv-page {
      box-shadow: none !important;
      border: none !important;
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

export type DegreeType = typeof DEGREE_TYPES[number];
export type FieldOfStudy = typeof FIELDS_OF_STUDY[number];
