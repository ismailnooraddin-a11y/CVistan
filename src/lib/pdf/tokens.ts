// src/lib/pdf/tokens.ts
// Professional Typography & Layout Tokens

export const TOKENS = {
  // Page settings (A4)
  page: {
    width: 210, // mm
    height: 297, // mm
    marginTop: 20, // mm
    marginBottom: 20, // mm
    marginLeft: 20, // mm
    marginRight: 20, // mm
  },

  // Font sizes (pt) - NEVER change these dynamically
  fonts: {
    name: 24,
    jobTitle: 14,
    sectionTitle: 12,
    body: 10,
    small: 9,
    tiny: 8,
  },

  // Line heights
  lineHeight: {
    tight: 1.15,
    normal: 1.35,
    relaxed: 1.5,
  },

  // Spacing scale (px) - consistent increments
  spacing: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },

  // Colors
  colors: {
    primary: '#1a365d',
    secondary: '#4a5568',
    accent: '#3182ce',
    text: '#2d3748',
    textLight: '#718096',
    border: '#e2e8f0',
    background: '#f7fafc',
    white: '#ffffff',
  },

  // Template-specific color schemes
  schemes: {
    morgan: {
      primary: '#000000',
      accent: '#8b5cf6',
      sidebar: '#f9fafb',
    },
    catrine: {
      primary: '#8B9A7D',
      accent: '#6B7A5D',
      sidebar: '#8B9A7D',
    },
    sarah: {
      primary: '#D4A574',
      accent: '#B8956A',
      sidebar: '#ffffff',
    },
    olivia: {
      primary: '#2D3748',
      accent: '#E67E22',
      sidebar: '#2D3748',
    },
  },

  // Compact mode adjustments (spacing only, NOT fonts)
  compact: {
    sectionGap: 8, // instead of 12
    itemGap: 4, // instead of 8
    bulletIndent: 8, // instead of 12
    lineHeight: 1.2, // instead of 1.35
  },
};

// Block height estimates (for pagination)
export const BLOCK_HEIGHTS = {
  header: 80, // px
  sectionTitle: 30, // px
  experienceItem: 100, // px base + description
  educationItem: 60, // px
  certificationItem: 50, // px
  skillsRow: 25, // px
  languageItem: 20, // px
  bulletLine: 18, // px
};

// Max content rules
export const LIMITS = {
  maxBulletLength: 150, // characters
  maxBulletsPerJob: 6,
  maxSkillsDisplay: 20,
  maxDescriptionLines: 8,
};

export type TemplateScheme = keyof typeof TOKENS.schemes;
