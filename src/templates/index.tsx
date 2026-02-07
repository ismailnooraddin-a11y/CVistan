// src/templates/index.tsx
// SINGLE PRODUCTION-READY CV TEMPLATE
// - Pixel-perfect alignment
// - Predictable pagination
// - Works for any CV length
// - RTL support
// - Print/Export optimized

'use client';

import React from 'react';
import { CVData } from '@/lib/types';
import { TOKENS, DENSITY, PRINT_STYLES, Density } from '@/lib/pdf/tokens';

// =============================================================================
// TYPES
// =============================================================================

interface TemplateProps {
  data: CVData;
  rtl: boolean;
  t: (key: string) => string | string[];
  exportMode?: boolean;
}

interface PreparedExperience {
  id: string;
  jobTitle: string;
  company: string;
  dateRange: string;
  bullets: string[];
}

interface PreparedEducation {
  id: string;
  degree: string;
  institution: string;
  gradDate: string;
  gpa?: string;
  thesis?: string;
}

interface PreparedCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  mode?: string;
  credentialId?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

const getMonths = (t: (key: string) => string | string[]): string[] => {
  const months = t('months');
  return Array.isArray(months) ? months : [];
};

const formatDate = (month: string, year: string, months: string[]): string => {
  if (!year) return '';
  const monthIndex = parseInt(month) - 1;
  if (month && months[monthIndex]) {
    return `${months[monthIndex]} ${year}`;
  }
  return year;
};

const sortByYear = <T extends Record<string, any>>(items: T[], field: string): T[] => {
  return [...items].sort((a, b) => {
    const yearA = parseInt(a[field]) || 0;
    const yearB = parseInt(b[field]) || 0;
    return yearB - yearA;
  });
};

const prepareExperience = (
  experience: CVData['experience'],
  months: string[],
  presentText: string
): PreparedExperience[] => {
  return sortByYear(experience, 'startYear').map(exp => ({
    id: exp.id,
    jobTitle: exp.jobTitle || '',
    company: exp.company || '',
    dateRange: exp.startYear
      ? `${formatDate(exp.startMonth, exp.startYear, months)} – ${
          exp.current ? presentText : formatDate(exp.endMonth, exp.endYear, months)
        }`
      : '',
    bullets: exp.description
      ? exp.description
          .split(/[\n\r]+/)
          .map(line => line.replace(/^[•\-\*▸→]\s*/, '').trim())
          .filter(line => line.length > 0)
      : [],
  }));
};

const prepareEducation = (
  education: CVData['education'],
  months: string[]
): PreparedEducation[] => {
  return sortByYear(education, 'gradYear').map(edu => ({
    id: edu.id,
    degree: edu.degree || '',
    institution: edu.institution || '',
    gradDate: formatDate(edu.gradMonth, edu.gradYear, months),
    gpa: edu.gpa,
    thesis: edu.thesisTitle,
  }));
};

const prepareCertifications = (
  certifications: CVData['certifications'],
  months: string[]
): PreparedCertification[] => {
  return sortByYear(certifications, 'issueYear').map(cert => ({
    id: cert.id,
    name: cert.name || '',
    issuer: cert.issuer || '',
    issueDate: formatDate(cert.issueMonth, cert.issueYear, months),
    mode: cert.mode,
    credentialId: cert.credentialId,
  }));
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

// Section Title Component
const SectionTitle: React.FC<{
  children: React.ReactNode;
  color?: string;
}> = ({ children, color = TOKENS.colors.accent }) => (
  <h2
    className="cv-section-title font-bold uppercase tracking-wider"
    style={{
      fontSize: TOKENS.fonts.sectionTitle,
      color: TOKENS.colors.textPrimary,
      borderBottom: `${TOKENS.divider.weight}px solid ${color}`,
      paddingBottom: 6,
      marginBottom: 12,
    }}
  >
    {children}
  </h2>
);

// Sidebar Section Title
const SidebarTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3
    className="font-semibold uppercase tracking-wider"
    style={{
      fontSize: TOKENS.fonts.small,
      color: TOKENS.colors.textSecondary,
      borderBottom: `${TOKENS.divider.weight}px solid ${TOKENS.colors.border}`,
      paddingBottom: 4,
      marginBottom: 10,
    }}
  >
    {children}
  </h3>
);

// Contact Item
const ContactItem: React.FC<{
  icon: string;
  children: React.ReactNode;
  rtl?: boolean;
}> = ({ icon, children, rtl }) => (
  <div
    className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}
    style={{ fontSize: TOKENS.fonts.small, marginBottom: 6 }}
  >
    <span style={{ width: 16, textAlign: 'center' }}>{icon}</span>
    <span style={{ color: TOKENS.colors.textSecondary }}>{children}</span>
  </div>
);

// Skill Item
const SkillItem: React.FC<{
  children: React.ReactNode;
  rtl?: boolean;
}> = ({ children, rtl }) => (
  <div
    className={`flex items-start gap-2 ${rtl ? 'flex-row-reverse text-right' : ''}`}
    style={{ fontSize: TOKENS.fonts.small, marginBottom: 4 }}
  >
    <span style={{ color: TOKENS.colors.accent, flexShrink: 0 }}>{TOKENS.bullet.char}</span>
    <span style={{ color: TOKENS.colors.textSecondary }}>{children}</span>
  </div>
);

// Language Item with Progress Bar
const LanguageItem: React.FC<{
  name: string;
  level: string;
  rtl?: boolean;
}> = ({ name, level, rtl }) => {
  const getLevelPercent = (lvl: string): number => {
    const l = lvl.toLowerCase();
    if (l.includes('native') || l.includes('mother')) return 100;
    if (l.includes('fluent') || l.includes('advanced')) return 85;
    if (l.includes('professional') || l.includes('intermediate')) return 70;
    if (l.includes('conversational') || l.includes('conv')) return 55;
    return 40;
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <div
        className={`flex justify-between ${rtl ? 'flex-row-reverse' : ''}`}
        style={{ fontSize: TOKENS.fonts.small, marginBottom: 4 }}
      >
        <span style={{ color: TOKENS.colors.textPrimary, fontWeight: 500 }}>{name}</span>
        <span style={{ color: TOKENS.colors.textMuted, fontSize: TOKENS.fonts.tiny }}>{level}</span>
      </div>
      <div
        style={{
          height: 4,
          backgroundColor: TOKENS.colors.border,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${getLevelPercent(level)}%`,
            backgroundColor: TOKENS.colors.accent,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
};

// Experience Item
const ExperienceItem: React.FC<{
  data: PreparedExperience;
  density: Density;
  rtl?: boolean;
}> = ({ data, density, rtl }) => {
  const spacing = DENSITY[density];

  return (
    <div className="cv-item" style={{ marginBottom: spacing.itemGap }}>
      {/* Header Row: Title + Company | Date */}
      <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: rtl ? 0 : 12, paddingLeft: rtl ? 12 : 0 }}>
          <h3
            style={{
              fontSize: TOKENS.fonts.body,
              fontWeight: 600,
              color: TOKENS.colors.textPrimary,
              lineHeight: 1.3,
            }}
          >
            {data.jobTitle}
          </h3>
          <p
            style={{
              fontSize: TOKENS.fonts.small,
              color: TOKENS.colors.accent,
              marginTop: 2,
            }}
          >
            {data.company}
          </p>
        </div>
        <span
          style={{
            fontSize: TOKENS.fonts.tiny,
            color: TOKENS.colors.textMuted,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            width: TOKENS.grid.dateColumnWidth,
            textAlign: rtl ? 'left' : 'right',
          }}
        >
          {data.dateRange}
        </span>
      </div>

      {/* Bullets */}
      {data.bullets.length > 0 && (
        <ul
          style={{
            marginTop: 8,
            paddingLeft: rtl ? 0 : TOKENS.bullet.indent,
            paddingRight: rtl ? TOKENS.bullet.indent : 0,
            listStyle: 'none',
          }}
        >
          {data.bullets.map((bullet, index) => (
            <li
              key={index}
              className={`flex ${rtl ? 'flex-row-reverse text-right' : ''}`}
              style={{
                fontSize: TOKENS.fonts.small,
                color: TOKENS.colors.textSecondary,
                lineHeight: spacing.lineHeight,
                marginBottom: spacing.bulletGap,
              }}
            >
              <span
                style={{
                  color: TOKENS.colors.accent,
                  marginRight: rtl ? 0 : TOKENS.bullet.gap,
                  marginLeft: rtl ? TOKENS.bullet.gap : 0,
                  flexShrink: 0,
                }}
              >
                {TOKENS.bullet.char}
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Education Item
const EducationItem: React.FC<{
  data: PreparedEducation;
  density: Density;
  rtl?: boolean;
}> = ({ data, density, rtl }) => {
  const spacing = DENSITY[density];

  return (
    <div className="cv-item" style={{ marginBottom: spacing.itemGap }}>
      <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: TOKENS.fonts.body,
              fontWeight: 600,
              color: TOKENS.colors.textPrimary,
              lineHeight: 1.3,
            }}
          >
            {data.degree}
          </h3>
          <p
            style={{
              fontSize: TOKENS.fonts.small,
              color: TOKENS.colors.accent,
              marginTop: 2,
            }}
          >
            {data.institution}
          </p>
          {data.gpa && (
            <p style={{ fontSize: TOKENS.fonts.tiny, color: TOKENS.colors.textMuted, marginTop: 2 }}>
              GPA: {data.gpa}
            </p>
          )}
          {data.thesis && (
            <p
              style={{
                fontSize: TOKENS.fonts.tiny,
                color: TOKENS.colors.textMuted,
                marginTop: 2,
                fontStyle: 'italic',
              }}
            >
              Thesis: {data.thesis}
            </p>
          )}
        </div>
        <span
          style={{
            fontSize: TOKENS.fonts.tiny,
            color: TOKENS.colors.textMuted,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            width: TOKENS.grid.dateColumnWidth,
            textAlign: rtl ? 'left' : 'right',
          }}
        >
          {data.gradDate}
        </span>
      </div>
    </div>
  );
};

// Certification Item
const CertificationItem: React.FC<{
  data: PreparedCertification;
  density: Density;
  rtl?: boolean;
}> = ({ data, density, rtl }) => {
  const spacing = DENSITY[density];

  return (
    <div className="cv-item" style={{ marginBottom: spacing.itemGap }}>
      <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: TOKENS.fonts.body,
              fontWeight: 600,
              color: TOKENS.colors.textPrimary,
              lineHeight: 1.3,
            }}
          >
            {data.name}
          </h3>
          <p
            style={{
              fontSize: TOKENS.fonts.small,
              color: TOKENS.colors.accent,
              marginTop: 2,
            }}
          >
            {data.issuer}
          </p>
          {data.credentialId && (
            <p style={{ fontSize: TOKENS.fonts.tiny, color: TOKENS.colors.textMuted, marginTop: 2 }}>
              ID: {data.credentialId}
            </p>
          )}
        </div>
        <div
          className={`flex items-center gap-2 flex-shrink-0 ${rtl ? 'flex-row-reverse' : ''}`}
          style={{ width: TOKENS.grid.dateColumnWidth, justifyContent: rtl ? 'flex-start' : 'flex-end' }}
        >
          <span style={{ fontSize: TOKENS.fonts.tiny, color: TOKENS.colors.textMuted }}>
            {data.issueDate}
          </span>
          {data.mode && (
            <span
              style={{
                fontSize: TOKENS.fonts.tiny,
                padding: '2px 6px',
                borderRadius: 4,
                backgroundColor: data.mode === 'online' ? '#dbeafe' : '#dcfce7',
                color: data.mode === 'online' ? '#1d4ed8' : '#15803d',
              }}
            >
              {data.mode === 'online' ? '🌐' : '🏢'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN TEMPLATE COMPONENT
// =============================================================================

export function ProfessionalTemplate({ data, rtl, t, exportMode = false }: TemplateProps) {
  const months = getMonths(t);
  const presentText = t('present') as string;
  const density: Density = data.settings?.density || 'normal';
  const spacing = DENSITY[density];

  // Prepare data
  const experience = prepareExperience(data.experience, months, presentText);
  const education = prepareEducation(data.education, months);
  const certifications = prepareCertifications(data.certifications, months);

  // Check what content exists
  const hasContact = data.personal.email || data.personal.phone || data.personal.location;
  const hasSummary = data.summary && data.summary.trim().length > 0;
  const hasExperience = experience.length > 0;
  const hasEducation = education.length > 0;
  const hasCertifications = certifications.length > 0;
  const hasSkills = data.skills.length > 0;
  const hasLanguages = data.languages.length > 0;

  return (
    <>
      {/* Print Styles */}
      {exportMode && <style>{PRINT_STYLES}</style>}

      <div
        className="cv-page"
        style={{
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: TOKENS.fonts.body,
          lineHeight: spacing.lineHeight,
          backgroundColor: TOKENS.colors.white,
          color: TOKENS.colors.textPrimary,
          minHeight: '100%',
          direction: rtl ? 'rtl' : 'ltr',
        }}
      >
        {/* ============================================================= */}
        {/* HEADER - Name, Title, Contact */}
        {/* ============================================================= */}
        <header
          style={{
            backgroundColor: TOKENS.colors.headerBg,
            color: TOKENS.colors.headerText,
            padding: spacing.headerPadding,
          }}
        >
          <div className={`flex items-center gap-5 ${rtl ? 'flex-row-reverse' : ''}`}>
            {/* Photo */}
            {data.personal.photo && (
              <img
                src={data.personal.photo}
                alt=""
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 4,
                  objectFit: 'cover',
                  border: '2px solid rgba(255,255,255,0.2)',
                  flexShrink: 0,
                }}
              />
            )}

            {/* Name & Title */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontSize: TOKENS.fonts.name,
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {data.personal.fullName || 'Your Name'}
              </h1>
              {data.personal.jobTitle && (
                <p
                  style={{
                    fontSize: TOKENS.fonts.jobTitle,
                    color: TOKENS.colors.accent,
                    marginTop: 4,
                    fontWeight: 400,
                  }}
                >
                  {data.personal.jobTitle}
                </p>
              )}
            </div>

            {/* Contact Info (in header) */}
            {hasContact && (
              <div
                style={{
                  flexShrink: 0,
                  textAlign: rtl ? 'left' : 'right',
                  fontSize: TOKENS.fonts.small,
                }}
              >
                {data.personal.phone && (
                  <div style={{ marginBottom: 4 }}>📱 {data.personal.phone}</div>
                )}
                {data.personal.email && (
                  <div style={{ marginBottom: 4 }}>✉️ {data.personal.email}</div>
                )}
                {data.personal.location && (
                  <div>📍 {data.personal.location}</div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* ============================================================= */}
        {/* BODY - Two Column Layout */}
        {/* ============================================================= */}
        <div className={`flex ${rtl ? 'flex-row-reverse' : ''}`} style={{ minHeight: 'calc(100% - 120px)' }}>
          {/* ------------------------------------------------------------- */}
          {/* SIDEBAR */}
          {/* ------------------------------------------------------------- */}
          <aside
            style={{
              width: TOKENS.grid.sidebarWidth,
              backgroundColor: TOKENS.colors.sidebarBg,
              padding: spacing.sidebarPadding,
              borderRight: rtl ? 'none' : `1px solid ${TOKENS.colors.border}`,
              borderLeft: rtl ? `1px solid ${TOKENS.colors.border}` : 'none',
            }}
          >
            {/* Skills */}
            {hasSkills && (
              <div className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
                <SidebarTitle>Skills</SidebarTitle>
                {data.skills.map((skill, index) => (
                  <SkillItem key={index} rtl={rtl}>
                    {skill}
                  </SkillItem>
                ))}
              </div>
            )}

            {/* Languages */}
            {hasLanguages && (
              <div className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
                <SidebarTitle>Languages</SidebarTitle>
                {data.languages.map((lang, index) => (
                  <LanguageItem key={index} name={lang.name} level={lang.level} rtl={rtl} />
                ))}
              </div>
            )}

            {/* Education (Sidebar version for short CVs) */}
            {hasEducation && !hasExperience && (
              <div className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
                <SidebarTitle>Education</SidebarTitle>
                {education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: 12 }}>
                    <p
                      style={{
                        fontSize: TOKENS.fonts.small,
                        fontWeight: 600,
                        color: TOKENS.colors.textPrimary,
                      }}
                    >
                      {edu.degree}
                    </p>
                    <p
                      style={{
                        fontSize: TOKENS.fonts.tiny,
                        color: TOKENS.colors.accent,
                        marginTop: 2,
                      }}
                    >
                      {edu.institution}
                    </p>
                    <p
                      style={{
                        fontSize: TOKENS.fonts.tiny,
                        color: TOKENS.colors.textMuted,
                        marginTop: 2,
                      }}
                    >
                      {edu.gradDate}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reference Note */}
            <div style={{ marginTop: 'auto' }}>
              <SidebarTitle>References</SidebarTitle>
              <p
                style={{
                  fontSize: TOKENS.fonts.tiny,
                  color: TOKENS.colors.textMuted,
                  fontStyle: 'italic',
                }}
              >
                Available upon request
              </p>
            </div>
          </aside>

          {/* ------------------------------------------------------------- */}
          {/* MAIN CONTENT */}
          {/* ------------------------------------------------------------- */}
          <main style={{ flex: 1, padding: spacing.mainPadding }}>
            {/* Summary */}
            {hasSummary && (
              <div className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
                <SectionTitle>Professional Summary</SectionTitle>
                <p
                  style={{
                    fontSize: TOKENS.fonts.small,
                    color: TOKENS.colors.textSecondary,
                    lineHeight: spacing.lineHeight,
                    textAlign: 'justify',
                  }}
                >
                  {data.summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {hasExperience && (
              <div className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
                <SectionTitle>Work Experience</SectionTitle>
                {experience.map(exp => (
                  <ExperienceItem key={exp.id} data={exp} density={density} rtl={rtl} />
                ))}
              </div>
            )}

            {/* Education (Main area for CVs with experience) */}
            {hasEducation && hasExperience && (
              <div className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
                <SectionTitle>Education</SectionTitle>
                {education.map(edu => (
                  <EducationItem key={edu.id} data={edu} density={density} rtl={rtl} />
                ))}
              </div>
            )}

            {/* Certifications */}
            {hasCertifications && (
              <div className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
                <SectionTitle>Certifications</SectionTitle>
                {certifications.map(cert => (
                  <CertificationItem key={cert.id} data={cert} density={density} rtl={rtl} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// TEMPLATE REGISTRY (Single Template)
// =============================================================================

export const TEMPLATES = {
  professional: {
    component: ProfessionalTemplate,
    icon: '📄',
    gradient: 'from-slate-700 to-blue-600',
  },
} as const;

export type TemplateKey = keyof typeof TEMPLATES;

// Default export for backward compatibility
export default ProfessionalTemplate;
