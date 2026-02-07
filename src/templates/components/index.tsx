// src/templates/components/index.tsx
// Reusable CV template components with proper grid alignment

import React from 'react';
import { BASE_TOKENS, FONT_SIZES, SPACING, Density, FontSize } from '@/lib/pdf/tokens';

type SchemeKey = keyof typeof BASE_TOKENS.schemes;

interface ComponentProps {
  scheme: SchemeKey;
  density?: Density;
  fontSize?: FontSize;
  rtl?: boolean;
}

// Get computed styles
const getStyles = (density: Density = 'normal', fontSize: FontSize = 'medium') => ({
  fonts: FONT_SIZES[fontSize],
  spacing: SPACING[density],
  colors: BASE_TOKENS.colors,
  grid: BASE_TOKENS.grid,
  divider: BASE_TOKENS.divider,
  bullet: BASE_TOKENS.bullet,
});

// =============================================================================
// HEADER COMPONENT
// =============================================================================
interface HeaderProps extends ComponentProps {
  name: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  location?: string;
  photo?: string | null;
  layout: 'centered' | 'left' | 'split' | 'banner';
}

export const Header: React.FC<HeaderProps> = ({
  name, jobTitle, email, phone, location, photo, scheme, density = 'normal', fontSize = 'medium', layout, rtl
}) => {
  const styles = getStyles(density, fontSize);
  const colors = BASE_TOKENS.schemes[scheme];
  
  const contactItems = [email, phone, location].filter(Boolean);
  
  if (layout === 'banner') {
    return (
      <header 
        className="cv-header no-break" 
        style={{ 
          backgroundColor: colors.primary, 
          color: '#fff',
          padding: styles.spacing.headerPadding,
        }}
      >
        <div className={`flex items-center gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
          {photo && (
            <img 
              src={photo} 
              className="w-16 h-16 rounded object-cover border-2 border-white/30 flex-shrink-0" 
              alt="" 
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 
              className="font-bold leading-tight"
              style={{ fontSize: styles.fonts.name, color: '#fff' }}
            >
              {name || 'Your Name'}
            </h1>
            <p style={{ fontSize: styles.fonts.jobTitle, color: colors.accent, marginTop: 2 }}>
              {jobTitle}
            </p>
          </div>
          <div 
            className={`flex-shrink-0 space-y-1 ${rtl ? 'text-left' : 'text-right'}`}
            style={{ fontSize: styles.fonts.small }}
          >
            {phone && <p>📱 {phone}</p>}
            {email && <p>✉️ {email}</p>}
            {location && <p>📍 {location}</p>}
          </div>
        </div>
      </header>
    );
  }

  if (layout === 'centered') {
    return (
      <header className="cv-header no-break text-center" style={{ padding: styles.spacing.headerPadding }}>
        {photo && (
          <img 
            src={photo} 
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" 
            style={{ border: `2px solid ${colors.accent}` }}
            alt="" 
          />
        )}
        <h1 
          className="font-bold tracking-wide uppercase"
          style={{ fontSize: styles.fonts.name, color: colors.primary }}
        >
          {name || 'YOUR NAME'}
        </h1>
        <p 
          className="uppercase tracking-widest mt-1"
          style={{ fontSize: styles.fonts.jobTitle, color: colors.accent }}
        >
          {jobTitle}
        </p>
        {contactItems.length > 0 && (
          <div 
            className="flex justify-center flex-wrap gap-3 mt-3"
            style={{ fontSize: styles.fonts.small, color: BASE_TOKENS.colors.textLight }}
          >
            {email && <span>✉️ {email}</span>}
            {phone && <span>📱 {phone}</span>}
            {location && <span>📍 {location}</span>}
          </div>
        )}
      </header>
    );
  }

  // Default: left aligned
  return (
    <header 
      className={`cv-header no-break ${rtl ? 'text-right' : 'text-left'}`}
      style={{ padding: styles.spacing.headerPadding }}
    >
      <div className={`flex items-start gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
        {photo && (
          <img 
            src={photo} 
            className="w-16 h-16 rounded-full object-cover flex-shrink-0" 
            style={{ border: `2px solid ${colors.accent}` }}
            alt="" 
          />
        )}
        <div className="flex-1">
          <h1 
            className="font-bold"
            style={{ fontSize: styles.fonts.name, color: colors.primary }}
          >
            {name || 'Your Name'}
          </h1>
          <p style={{ fontSize: styles.fonts.jobTitle, color: colors.accent, marginTop: 2 }}>
            {jobTitle}
          </p>
          {contactItems.length > 0 && (
            <div 
              className={`flex flex-wrap gap-3 mt-2 ${rtl ? 'flex-row-reverse' : ''}`}
              style={{ fontSize: styles.fonts.small, color: BASE_TOKENS.colors.textLight }}
            >
              {email && <span>✉️ {email}</span>}
              {phone && <span>📱 {phone}</span>}
              {location && <span>📍 {location}</span>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// =============================================================================
// SECTION TITLE COMPONENT
// =============================================================================
interface SectionTitleProps extends ComponentProps {
  title: string;
  style?: 'underline' | 'background' | 'simple' | 'minimal';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, scheme, density = 'normal', fontSize = 'medium', style = 'underline' 
}) => {
  const styles = getStyles(density, fontSize);
  const colors = BASE_TOKENS.schemes[scheme];
  
  const baseStyle = {
    fontSize: styles.fonts.sectionTitle,
    marginBottom: styles.spacing.itemGap,
    marginTop: styles.spacing.sectionGap,
  };

  if (style === 'minimal') {
    return (
      <h2 
        className="cv-section-title font-medium uppercase tracking-widest"
        style={{ 
          ...baseStyle,
          color: BASE_TOKENS.colors.textMuted,
          fontSize: styles.fonts.small,
        }}
      >
        {title}
      </h2>
    );
  }

  if (style === 'simple') {
    return (
      <h2 
        className="cv-section-title font-semibold uppercase tracking-wider"
        style={{ 
          ...baseStyle,
          color: colors.primary,
          borderBottom: `${BASE_TOKENS.divider.weight}px solid ${colors.divider}`,
          paddingBottom: 4,
        }}
      >
        {title}
      </h2>
    );
  }

  if (style === 'background') {
    return (
      <h2 
        className="cv-section-title font-bold uppercase tracking-wider px-2 py-1 rounded"
        style={{ 
          ...baseStyle,
          backgroundColor: colors.accent,
          color: '#fff',
        }}
      >
        {title}
      </h2>
    );
  }

  // Default: underline with accent color
  return (
    <h2 
      className="cv-section-title font-bold uppercase tracking-wider"
      style={{ 
        ...baseStyle,
        color: colors.primary,
        borderBottom: `${BASE_TOKENS.divider.weight}px solid ${colors.accent}`,
        paddingBottom: 4,
      }}
    >
      {title}
    </h2>
  );
};

// =============================================================================
// EXPERIENCE ITEM COMPONENT - Fixed Grid Alignment
// =============================================================================
interface ExperienceItemProps extends ComponentProps {
  jobTitle: string;
  company: string;
  dateRange: string;
  bullets: string[];
}

export const ExperienceItem: React.FC<ExperienceItemProps> = ({
  jobTitle, company, dateRange, bullets, scheme, density = 'normal', fontSize = 'medium', rtl
}) => {
  const styles = getStyles(density, fontSize);
  const colors = BASE_TOKENS.schemes[scheme];

  return (
    <div 
      className="cv-item"
      style={{ marginBottom: styles.spacing.itemGap }}
    >
      {/* Grid row: Content | Date */}
      <div 
        className={`flex justify-between items-start gap-4 ${rtl ? 'flex-row-reverse' : ''}`}
      >
        <div className="flex-1 min-w-0">
          <h3 
            className="font-bold leading-tight"
            style={{ fontSize: styles.fonts.body, color: BASE_TOKENS.colors.text }}
          >
            {jobTitle}
          </h3>
          <p style={{ fontSize: styles.fonts.small, color: colors.accent, marginTop: 1 }}>
            {company}
          </p>
        </div>
        <span 
          className="flex-shrink-0 text-right"
          style={{ 
            fontSize: styles.fonts.tiny, 
            color: BASE_TOKENS.colors.textLight,
            width: BASE_TOKENS.grid.dateColumnWidth,
            minWidth: BASE_TOKENS.grid.dateColumnWidth,
          }}
        >
          {dateRange}
        </span>
      </div>
      
      {/* Bullets */}
      {bullets.length > 0 && (
        <ul 
          className={`mt-2 ${rtl ? 'pr-3' : 'pl-3'}`}
          style={{ 
            listStyle: 'none',
            margin: 0,
            padding: 0,
            paddingLeft: rtl ? 0 : BASE_TOKENS.bullet.indent,
            paddingRight: rtl ? BASE_TOKENS.bullet.indent : 0,
          }}
        >
          {bullets.map((bullet, i) => (
            <li 
              key={i}
              className={`flex gap-2 ${rtl ? 'flex-row-reverse text-right' : ''}`}
              style={{ 
                fontSize: styles.fonts.small, 
                lineHeight: styles.spacing.lineHeight,
                color: BASE_TOKENS.colors.secondary,
                marginBottom: styles.spacing.bulletGap,
              }}
            >
              <span 
                className="flex-shrink-0"
                style={{ color: colors.accent, width: 8 }}
              >
                {BASE_TOKENS.bullet.char}
              </span>
              <span className="flex-1">{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// =============================================================================
// EDUCATION ITEM COMPONENT
// =============================================================================
interface EducationItemProps extends ComponentProps {
  degree: string;
  institution: string;
  gradDate: string;
  gpa?: string;
  thesis?: string;
}

export const EducationItem: React.FC<EducationItemProps> = ({
  degree, institution, gradDate, gpa, thesis, scheme, density = 'normal', fontSize = 'medium', rtl
}) => {
  const styles = getStyles(density, fontSize);
  const colors = BASE_TOKENS.schemes[scheme];

  return (
    <div 
      className="cv-item"
      style={{ marginBottom: styles.spacing.itemGap }}
    >
      <div className={`flex justify-between items-start gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1 min-w-0">
          <h3 
            className="font-bold leading-tight"
            style={{ fontSize: styles.fonts.body, color: BASE_TOKENS.colors.text }}
          >
            {degree}
          </h3>
          <p style={{ fontSize: styles.fonts.small, color: colors.accent, marginTop: 1 }}>
            {institution}
          </p>
          {gpa && (
            <p style={{ fontSize: styles.fonts.tiny, color: BASE_TOKENS.colors.textLight, marginTop: 2 }}>
              GPA: {gpa}
            </p>
          )}
          {thesis && (
            <p 
              className="italic"
              style={{ fontSize: styles.fonts.tiny, color: BASE_TOKENS.colors.textLight, marginTop: 2 }}
            >
              Thesis: {thesis}
            </p>
          )}
        </div>
        <span 
          className="flex-shrink-0 text-right"
          style={{ 
            fontSize: styles.fonts.tiny, 
            color: BASE_TOKENS.colors.textLight,
            width: BASE_TOKENS.grid.dateColumnWidth,
            minWidth: BASE_TOKENS.grid.dateColumnWidth,
          }}
        >
          {gradDate}
        </span>
      </div>
    </div>
  );
};

// =============================================================================
// CERTIFICATION ITEM COMPONENT
// =============================================================================
interface CertificationItemProps extends ComponentProps {
  name: string;
  issuer: string;
  issueDate: string;
  mode?: 'online' | 'in-person' | '';
  credentialId?: string;
}

export const CertificationItem: React.FC<CertificationItemProps> = ({
  name, issuer, issueDate, mode, credentialId, scheme, density = 'normal', fontSize = 'medium', rtl
}) => {
  const styles = getStyles(density, fontSize);
  const colors = BASE_TOKENS.schemes[scheme];

  return (
    <div 
      className="cv-item"
      style={{ marginBottom: styles.spacing.itemGap }}
    >
      <div className={`flex justify-between items-start gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1 min-w-0">
          <h3 
            className="font-semibold leading-tight"
            style={{ fontSize: styles.fonts.body, color: BASE_TOKENS.colors.text }}
          >
            {name}
          </h3>
          <p style={{ fontSize: styles.fonts.small, color: colors.accent, marginTop: 1 }}>
            {issuer}
          </p>
          {credentialId && (
            <p style={{ fontSize: styles.fonts.tiny, color: BASE_TOKENS.colors.textLight, marginTop: 2 }}>
              ID: {credentialId}
            </p>
          )}
        </div>
        <div className={`flex-shrink-0 flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          <span 
            style={{ 
              fontSize: styles.fonts.tiny, 
              color: BASE_TOKENS.colors.textLight,
            }}
          >
            {issueDate}
          </span>
          {mode && (
            <span 
              className="px-1.5 py-0.5 rounded text-xs"
              style={{ 
                backgroundColor: mode === 'online' ? '#dbeafe' : '#dcfce7',
                color: mode === 'online' ? '#1d4ed8' : '#15803d',
                fontSize: styles.fonts.tiny,
              }}
            >
              {mode === 'online' ? '🌐' : '🏢'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// SKILLS LIST COMPONENT
// =============================================================================
interface SkillsListProps extends ComponentProps {
  skills: string[];
  layout: 'chips' | 'bullets' | 'columns' | 'inline';
}

export const SkillsList: React.FC<SkillsListProps> = ({ 
  skills, scheme, density = 'normal', fontSize = 'medium', layout, rtl 
}) => {
  const styles = getStyles(density, fontSize);
  const colors = BASE_TOKENS.schemes[scheme];

  if (layout === 'chips') {
    return (
      <div className={`flex flex-wrap gap-1.5 ${rtl ? 'flex-row-reverse' : ''}`}>
        {skills.map((skill, i) => (
          <span 
            key={i}
            className="px-2 py-1 rounded"
            style={{ 
              backgroundColor: BASE_TOKENS.colors.background, 
              fontSize: styles.fonts.small,
              color: BASE_TOKENS.colors.text,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }

  if (layout === 'columns') {
    return (
      <div className={`grid grid-cols-2 gap-x-4 gap-y-1 ${rtl ? 'text-right' : ''}`}>
        {skills.map((skill, i) => (
          <span 
            key={i}
            className={`flex items-center gap-1.5 ${rtl ? 'flex-row-reverse' : ''}`}
            style={{ fontSize: styles.fonts.small, color: BASE_TOKENS.colors.text }}
          >
            <span style={{ color: colors.accent }}>{BASE_TOKENS.bullet.char}</span>
            <span>{skill}</span>
          </span>
        ))}
      </div>
    );
  }

  if (layout === 'inline') {
    return (
      <p style={{ fontSize: styles.fonts.small, color: BASE_TOKENS.colors.text }}>
        {skills.join(' • ')}
      </p>
    );
  }

  // Default: bullets
  return (
    <ul className="space-y-1" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {skills.map((skill, i) => (
        <li 
          key={i}
          className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}
          style={{ fontSize: styles.fonts.small, color: BASE_TOKENS.colors.text }}
        >
          <span style={{ color: colors.accent }}>{BASE_TOKENS.bullet.char}</span>
          <span>{skill}</span>
        </li>
      ))}
    </ul>
  );
};

// =============================================================================
// LANGUAGES LIST COMPONENT
// =============================================================================
interface LanguagesListProps extends ComponentProps {
  languages: { name: string; level: string }[];
  layout: 'bars' | 'text' | 'inline';
}

export const LanguagesList: React.FC<LanguagesListProps> = ({ 
  languages, scheme, density = 'normal', fontSize = 'medium', layout, rtl 
}) => {
  const styles = getStyles(density, fontSize);
  const colors = BASE_TOKENS.schemes[scheme];

  const getLevelWidth = (level: string): string => {
    const l = level.toLowerCase();
    if (l.includes('native')) return '100%';
    if (l.includes('fluent')) return '85%';
    if (l.includes('conv')) return '60%';
    return '40%';
  };

  if (layout === 'bars') {
    return (
      <div className="space-y-2">
        {languages.map((lang, i) => (
          <div key={i}>
            <div className={`flex justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
              <span style={{ fontSize: styles.fonts.small }}>{lang.name}</span>
              <span style={{ fontSize: styles.fonts.tiny, color: BASE_TOKENS.colors.textLight }}>{lang.level}</span>
            </div>
            <div 
              className="h-1 rounded-full mt-1"
              style={{ backgroundColor: BASE_TOKENS.colors.border }}
            >
              <div 
                className="h-full rounded-full" 
                style={{ width: getLevelWidth(lang.level), backgroundColor: colors.accent }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (layout === 'inline') {
    return (
      <p style={{ fontSize: styles.fonts.small, color: BASE_TOKENS.colors.text }}>
        {languages.map((l, i) => (
          <span key={i}>
            <strong>{l.name}</strong>: {l.level}
            {i < languages.length - 1 ? ' • ' : ''}
          </span>
        ))}
      </p>
    );
  }

  // Default: text list
  return (
    <div className="space-y-1">
      {languages.map((lang, i) => (
        <div 
          key={i} 
          className={`flex justify-between ${rtl ? 'flex-row-reverse' : ''}`}
          style={{ fontSize: styles.fonts.small }}
        >
          <span>{lang.name}</span>
          <span style={{ color: BASE_TOKENS.colors.textLight }}>{lang.level}</span>
        </div>
      ))}
    </div>
  );
};

// =============================================================================
// SUMMARY COMPONENT
// =============================================================================
interface SummaryProps extends ComponentProps {
  text: string;
  style?: 'plain' | 'boxed' | 'bordered';
}

export const Summary: React.FC<SummaryProps> = ({
  text, scheme, density = 'normal', fontSize = 'medium', style = 'plain', rtl
}) => {
  const styles = getStyles(density, fontSize);
  const colors = BASE_TOKENS.schemes[scheme];

  const baseTextStyle = {
    fontSize: styles.fonts.small,
    lineHeight: styles.spacing.lineHeight,
    color: BASE_TOKENS.colors.secondary,
    textAlign: 'justify' as const,
  };

  if (style === 'boxed') {
    return (
      <div 
        className="cv-section"
        style={{ 
          backgroundColor: BASE_TOKENS.colors.background,
          padding: styles.spacing.contentPadding,
          borderRadius: 4,
          marginBottom: styles.spacing.sectionGap,
        }}
      >
        <p style={baseTextStyle}>{text}</p>
      </div>
    );
  }

  if (style === 'bordered') {
    return (
      <div 
        className="cv-section"
        style={{ 
          borderLeft: rtl ? 'none' : `3px solid ${colors.accent}`,
          borderRight: rtl ? `3px solid ${colors.accent}` : 'none',
          paddingLeft: rtl ? 0 : 12,
          paddingRight: rtl ? 12 : 0,
          marginBottom: styles.spacing.sectionGap,
        }}
      >
        <p style={baseTextStyle}>{text}</p>
      </div>
    );
  }

  // Default: plain
  return (
    <div className="cv-section" style={{ marginBottom: styles.spacing.sectionGap }}>
      <p style={baseTextStyle}>{text}</p>
    </div>
  );
};

// =============================================================================
// TWO COLUMN LAYOUT
// =============================================================================
interface TwoColumnLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  sidebarWidth?: string;
  sidebarPosition?: 'left' | 'right';
  sidebarBg?: string;
  rtl?: boolean;
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  sidebar, main, sidebarWidth = '32%', sidebarPosition = 'left', sidebarBg, rtl
}) => {
  const sidebarEl = (
    <aside 
      className="flex-shrink-0"
      style={{ 
        width: sidebarWidth, 
        backgroundColor: sidebarBg || BASE_TOKENS.colors.background,
        padding: SPACING.normal.contentPadding,
      }}
    >
      {sidebar}
    </aside>
  );

  const mainEl = (
    <main 
      className="flex-1 min-w-0"
      style={{ padding: SPACING.normal.contentPadding }}
    >
      {main}
    </main>
  );

  const isLeft = sidebarPosition === 'left';
  const shouldReverse = rtl ? !isLeft : isLeft;

  return (
    <div className={`flex min-h-full ${shouldReverse ? '' : 'flex-row-reverse'}`}>
      {sidebarEl}
      {mainEl}
    </div>
  );
};

// =============================================================================
// CV SECTION WRAPPER (for pagination control)
// =============================================================================
interface CVSectionProps {
  children: React.ReactNode;
  title?: string;
  scheme?: SchemeKey;
  titleStyle?: 'underline' | 'background' | 'simple' | 'minimal';
  density?: Density;
  fontSize?: FontSize;
}

export const CVSection: React.FC<CVSectionProps> = ({
  children, title, scheme = 'morgan', titleStyle = 'underline', density = 'normal', fontSize = 'medium'
}) => {
  return (
    <section className="cv-section">
      {title && (
        <SectionTitle 
          title={title} 
          scheme={scheme} 
          style={titleStyle}
          density={density}
          fontSize={fontSize}
        />
      )}
      {children}
    </section>
  );
};
