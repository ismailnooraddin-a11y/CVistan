// src/lib/pdf/tokens.ts
// Professional Typography & Layout Tokens with Density Controls

export type Density = 'compact' | 'normal' | 'spacious';
export type FontSize = 'small' | 'medium' | 'large';

// Base design tokens
export const BASE_TOKENS = {
  // Page settings (A4)
  page: {
    width: 210, // mm
    height: 297, // mm
    marginTop: 18, // mm
    marginBottom: 18, // mm
    marginLeft: 18, // mm
    marginRight: 18, // mm
  },

  // Grid system
  grid: {
    dateColumnWidth: 120, // px - fixed width for dates
    sidebarWidth: '32%',
    gutter: 16, // px
  },

  // Colors (refined for premium look)
  colors: {
    primary: '#1a202c',
    secondary: '#4a5568',
    accent: '#3182ce',
    text: '#2d3748',
    textLight: '#718096',
    textMuted: '#a0aec0',
    border: '#e2e8f0',
    borderLight: '#edf2f7',
    background: '#f7fafc',
    white: '#ffffff',
  },

  // Template color schemes
  schemes: {
    morgan: {
      primary: '#1a1a1a',
      accent: '#7c3aed',
      sidebar: '#fafafa',
      divider: '#e5e5e5',
    },
    catrine: {
      primary: '#8B9A7D',
      accent: '#6B7A5D',
      sidebar: '#8B9A7D',
      divider: 'rgba(255,255,255,0.3)',
    },
    sarah: {
      primary: '#C9A66B',
      accent: '#B8956A',
      sidebar: '#ffffff',
      divider: '#e5e5e5',
    },
    olivia: {
      primary: '#2D3748',
      accent: '#DD6B20',
      sidebar: '#2D3748',
      divider: '#DD6B20',
    },
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Divider styling (lighter for premium look)
  divider: {
    weight: 1.5, // px - reduced from thick purple lines
    style: 'solid',
  },

  // Bullet styling
  bullet: {
    char: '•',
    indent: 12, // px
    spacing: 4, // px between bullets
  },
};

// Font size presets
export const FONT_SIZES: Record<FontSize, {
  name: number;
  jobTitle: number;
  sectionTitle: number;
  body: number;
  small: number;
  tiny: number;
}> = {
  small: {
    name: 20,
    jobTitle: 11,
    sectionTitle: 10,
    body: 9,
    small: 8,
    tiny: 7,
  },
  medium: {
    name: 24,
    jobTitle: 13,
    sectionTitle: 11,
    body: 10,
    small: 9,
    tiny: 8,
  },
  large: {
    name: 28,
    jobTitle: 15,
    sectionTitle: 12,
    body: 11,
    small: 10,
    tiny: 9,
  },
};

// Spacing presets based on density
export const SPACING: Record<Density, {
  sectionGap: number;
  itemGap: number;
  bulletGap: number;
  headerPadding: number;
  contentPadding: number;
  lineHeight: number;
}> = {
  compact: {
    sectionGap: 10,
    itemGap: 6,
    bulletGap: 2,
    headerPadding: 12,
    contentPadding: 12,
    lineHeight: 1.25,
  },
  normal: {
    sectionGap: 16,
    itemGap: 10,
    bulletGap: 4,
    headerPadding: 16,
    contentPadding: 16,
    lineHeight: 1.4,
  },
  spacious: {
    sectionGap: 24,
    itemGap: 14,
    bulletGap: 6,
    headerPadding: 20,
    contentPadding: 20,
    lineHeight: 1.5,
  },
};

// Get computed tokens based on user settings
export const getTokens = (
  density: Density = 'normal',
  fontSize: FontSize = 'medium'
) => {
  return {
    ...BASE_TOKENS,
    fonts: FONT_SIZES[fontSize],
    spacing: SPACING[density],
  };
};

// Print/Export CSS (hides all editor UI)
export const PRINT_CSS = `
  @media print {
    /* Hide all editor UI */
    .editor-ui,
    .toolbar,
    .floating-button,
    .edit-controls,
    .drag-handle,
    .hover-outline,
    .step-indicator,
    .navigation-buttons,
    .preview-controls,
    [data-editor-ui],
    button:not([data-print-visible]),
    .no-print {
      display: none !important;
      visibility: hidden !important;
    }

    /* Reset page margins */
    @page {
      margin: 18mm;
      size: A4;
    }

    /* Prevent bad page breaks */
    .cv-section {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .cv-section-title {
      break-after: avoid;
      page-break-after: avoid;
    }

    .cv-item {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    /* Ensure content fills page */
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Clean backgrounds */
    .cv-container {
      box-shadow: none !important;
      border: none !important;
    }
  }
`;

// Degree types for validation
export const DEGREE_TYPES = [
  'High School Diploma',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctoral Degree (PhD)',
  'Professional Degree (MD, JD, etc.)',
  'Certificate',
  'Diploma',
] as const;

// Common fields of study (for suggestions)
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
