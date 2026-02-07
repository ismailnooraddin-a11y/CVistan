// src/templates/index.tsx
// 4 Professional CV Templates with proper grid alignment and density controls

'use client';

import React from 'react';
import { CVData } from '@/lib/types';
import { BASE_TOKENS, SPACING, FONT_SIZES, Density, FontSize, PRINT_CSS } from '@/lib/pdf/tokens';
import {
  Header,
  SectionTitle,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  SkillsList,
  LanguagesList,
  Summary,
  TwoColumnLayout,
} from './components';

interface TemplateProps {
  data: CVData;
  rtl: boolean;
  t: (key: string) => string | string[];
  exportMode?: boolean; // Hide all UI elements when true
}

// Get months array from translations
const getMonths = (t: (key: string) => string | string[]): string[] => {
  const months = t('months');
  return Array.isArray(months) ? months : [];
};

// Format date helper
const formatDate = (month: string, year: string, months: string[]): string => {
  if (!year) return '';
  if (month && months[parseInt(month) - 1]) {
    return `${months[parseInt(month) - 1]} ${year}`;
  }
  return year;
};

// Sort by year (newest first)
const sortByYear = <T extends Record<string, any>>(items: T[], field: string): T[] => {
  return [...items].sort((a, b) => (parseInt(b[field]) || 0) - (parseInt(a[field]) || 0));
};

// Prepare experience with bullets and date range
const prepareExperience = (exp: CVData['experience'], months: string[], pres: string) => {
  return sortByYear(exp, 'startYear').map(e => ({
    ...e,
    dateRange: e.startYear 
      ? `${formatDate(e.startMonth, e.startYear, months)} - ${e.current ? pres : formatDate(e.endMonth, e.endYear, months)}`
      : '',
    bullets: e.description 
      ? e.description.split(/[\n\r]+/).map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(l => l.length > 0)
      : [],
  }));
};

// Prepare education
const prepareEducation = (edu: CVData['education'], months: string[]) => {
  return sortByYear(edu, 'gradYear').map(e => ({
    ...e,
    gradDate: formatDate(e.gradMonth, e.gradYear, months),
  }));
};

// Prepare certifications
const prepareCertifications = (certs: CVData['certifications'], months: string[]) => {
  return sortByYear(certs, 'issueYear').map(c => ({
    ...c,
    issueDate: formatDate(c.issueMonth, c.issueYear, months),
  }));
};

// Get density and fontSize from CV settings
const getSettings = (data: CVData): { density: Density; fontSize: FontSize } => ({
  density: data.settings?.density || 'normal',
  fontSize: data.settings?.fontSize || 'medium',
});

// =============================================================================
// TEMPLATE 1: MORGAN - Bold header with elegant sidebar
// =============================================================================
export function MorganTemplate({ data: d, rtl, t, exportMode = false }: TemplateProps) {
  const months = getMonths(t);
  const pres = t('present') as string;
  const { density, fontSize } = getSettings(d);
  const spacing = SPACING[density];
  const fonts = FONT_SIZES[fontSize];
  
  const experience = prepareExperience(d.experience, months, pres);
  const education = prepareEducation(d.education, months);
  const certifications = prepareCertifications(d.certifications, months);

  const sidebar = (
    <div className="space-y-5">
      {d.languages.length > 0 && (
        <div>
          <SectionTitle title="Language" scheme="morgan" style="minimal" density={density} fontSize={fontSize} />
          <LanguagesList languages={d.languages} scheme="morgan" layout="bars" density={density} fontSize={fontSize} rtl={rtl} />
        </div>
      )}

      {d.skills.length > 0 && (
        <div>
          <SectionTitle title="Expertise" scheme="morgan" style="minimal" density={density} fontSize={fontSize} />
          <SkillsList skills={d.skills} scheme="morgan" layout="bullets" density={density} fontSize={fontSize} rtl={rtl} />
        </div>
      )}

      <div>
        <SectionTitle title="Reference" scheme="morgan" style="minimal" density={density} fontSize={fontSize} />
        <p className="italic" style={{ fontSize: fonts.small, color: BASE_TOKENS.colors.textLight }}>
          Available upon request
        </p>
      </div>
    </div>
  );

  const main = (
    <div style={{ direction: rtl ? 'rtl' : 'ltr' }}>
      {d.summary && (
        <div style={{ marginBottom: spacing.sectionGap }}>
          <SectionTitle title="About Me" scheme="morgan" style="simple" density={density} fontSize={fontSize} />
          <Summary text={d.summary} scheme="morgan" style="plain" density={density} fontSize={fontSize} rtl={rtl} />
        </div>
      )}

      {experience.length > 0 && (
        <div className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
          <SectionTitle title="Experience" scheme="morgan" style="simple" density={density} fontSize={fontSize} />
          {experience.map((e, i) => (
            <ExperienceItem
              key={e.id || i}
              jobTitle={e.jobTitle}
              company={e.company}
              dateRange={e.dateRange}
              bullets={e.bullets}
              scheme="morgan"
              density={density}
              fontSize={fontSize}
              rtl={rtl}
            />
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
          <SectionTitle title="Education" scheme="morgan" style="simple" density={density} fontSize={fontSize} />
          {education.map((e, i) => (
            <EducationItem
              key={e.id || i}
              degree={e.degree}
              institution={e.institution}
              gradDate={e.gradDate}
              gpa={e.gpa}
              thesis={e.thesisTitle}
              scheme="morgan"
              density={density}
              fontSize={fontSize}
              rtl={rtl}
            />
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div className="cv-section">
          <SectionTitle title="Certifications" scheme="morgan" style="simple" density={density} fontSize={fontSize} />
          {certifications.map((c, i) => (
            <CertificationItem
              key={c.id || i}
              name={c.name}
              issuer={c.issuer}
              issueDate={c.issueDate}
              mode={c.mode}
              credentialId={c.credentialId}
              scheme="morgan"
              density={density}
              fontSize={fontSize}
              rtl={rtl}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div 
      className={`cv-container bg-white min-h-full ${exportMode ? 'export-mode' : ''}`}
      style={{ fontFamily: 'Georgia, serif', fontSize: fonts.body }}
    >
      {exportMode && <style>{PRINT_CSS}</style>}
      
      {/* Header */}
      <div className="bg-black text-white" style={{ padding: spacing.headerPadding }}>
        <div className={`flex items-center gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
          {d.personal.photo && (
            <img src={d.personal.photo} className="w-16 h-16 object-cover border-2 border-white flex-shrink-0" alt="" />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold tracking-wide uppercase" style={{ fontSize: fonts.name }}>
              {d.personal.fullName || 'YOUR NAME'}
            </h1>
            <p className="text-gray-300 uppercase tracking-widest mt-1" style={{ fontSize: fonts.jobTitle }}>
              {d.personal.jobTitle}
            </p>
          </div>
          <div className={`flex-shrink-0 space-y-1 ${rtl ? 'text-left' : 'text-right'}`} style={{ fontSize: fonts.small }}>
            {d.personal.phone && <p>📱 {d.personal.phone}</p>}
            {d.personal.email && <p>✉️ {d.personal.email}</p>}
            {d.personal.location && <p>📍 {d.personal.location}</p>}
          </div>
        </div>
      </div>

      <div className={`flex ${rtl ? 'flex-row-reverse' : ''}`}>
        <aside 
          className="flex-shrink-0 border-r"
          style={{ 
            width: '30%', 
            backgroundColor: '#fafafa',
            padding: spacing.contentPadding,
            borderColor: '#e5e5e5',
          }}
        >
          {sidebar}
        </aside>
        <main className="flex-1" style={{ padding: spacing.contentPadding }}>
          {main}
        </main>
      </div>
    </div>
  );
}

// =============================================================================
// TEMPLATE 2: CATRINE - Photo-focused professional layout
// =============================================================================
export function CatrineTemplate({ data: d, rtl, t, exportMode = false }: TemplateProps) {
  const months = getMonths(t);
  const pres = t('present') as string;
  const { density, fontSize } = getSettings(d);
  const spacing = SPACING[density];
  const fonts = FONT_SIZES[fontSize];
  
  const experience = prepareExperience(d.experience, months, pres);
  const education = prepareEducation(d.education, months);
  const certifications = prepareCertifications(d.certifications, months);

  const sidebar = (
    <div className="text-white space-y-5">
      {/* Photo */}
      <div className="mb-4">
        {d.personal.photo ? (
          <img src={d.personal.photo} className="w-full aspect-square object-cover border-4 border-white/30" alt="" />
        ) : (
          <div 
            className="w-full aspect-square bg-white/20 flex items-center justify-center"
            style={{ fontSize: fonts.name * 1.5 }}
          >
            {d.personal.fullName?.charAt(0) || '?'}
          </div>
        )}
      </div>

      {/* Profile */}
      {d.summary && (
        <div>
          <h3 
            className="font-bold uppercase tracking-wider mb-2 border-b border-white/30 pb-1"
            style={{ fontSize: fonts.small }}
          >
            Profile
          </h3>
          <p 
            className="opacity-90 text-justify"
            style={{ fontSize: fonts.small, lineHeight: spacing.lineHeight }}
          >
            {d.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {d.skills.length > 0 && (
        <div>
          <h3 
            className="font-bold uppercase tracking-wider mb-2 border-b border-white/30 pb-1"
            style={{ fontSize: fonts.small }}
          >
            Skills
          </h3>
          {d.skills.map((s, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-2 opacity-90 ${rtl ? 'flex-row-reverse' : ''}`}
              style={{ fontSize: fonts.small, marginBottom: spacing.bulletGap }}
            >
              <span>•</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {d.languages.length > 0 && (
        <div>
          <h3 
            className="font-bold uppercase tracking-wider mb-2 border-b border-white/30 pb-1"
            style={{ fontSize: fonts.small }}
          >
            Languages
          </h3>
          {d.languages.map((l, i) => (
            <div key={i} className="opacity-90" style={{ fontSize: fonts.small, marginBottom: spacing.bulletGap }}>
              {l.name} - {l.level}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const main = (
    <div style={{ direction: rtl ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div 
        className="-mx-4 -mt-4 mb-4 px-4 py-4"
        style={{ backgroundColor: '#F5F5F0', marginLeft: -spacing.contentPadding, marginRight: -spacing.contentPadding, marginTop: -spacing.contentPadding, paddingLeft: spacing.contentPadding, paddingRight: spacing.contentPadding }}
      >
        <h1 className="font-light text-gray-800" style={{ fontSize: fonts.name }}>
          {d.personal.fullName || 'Your Name'}
        </h1>
        <p className="text-[#8B9A7D] uppercase tracking-widest mt-1" style={{ fontSize: fonts.jobTitle }}>
          {d.personal.jobTitle}
        </p>
      </div>

      {/* Contact */}
      <div 
        className={`-mx-4 px-4 py-2 mb-4 flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}
        style={{ 
          backgroundColor: '#f5f5f5', 
          fontSize: fonts.tiny,
          marginLeft: -spacing.contentPadding, 
          marginRight: -spacing.contentPadding,
          paddingLeft: spacing.contentPadding, 
          paddingRight: spacing.contentPadding,
        }}
      >
        {d.personal.phone && <span>📱 {d.personal.phone}</span>}
        {d.personal.email && <span>✉️ {d.personal.email}</span>}
        {d.personal.location && <span>📍 {d.personal.location}</span>}
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
          <SectionTitle title="Work Experience" scheme="catrine" style="simple" density={density} fontSize={fontSize} />
          {experience.map((e, i) => (
            <ExperienceItem
              key={e.id || i}
              jobTitle={e.jobTitle}
              company={e.company}
              dateRange={e.dateRange}
              bullets={e.bullets}
              scheme="catrine"
              density={density}
              fontSize={fontSize}
              rtl={rtl}
            />
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
          <SectionTitle title="Education" scheme="catrine" style="simple" density={density} fontSize={fontSize} />
          {education.map((e, i) => (
            <EducationItem
              key={e.id || i}
              degree={e.degree}
              institution={e.institution}
              gradDate={e.gradDate}
              gpa={e.gpa}
              thesis={e.thesisTitle}
              scheme="catrine"
              density={density}
              fontSize={fontSize}
              rtl={rtl}
            />
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="cv-section">
          <SectionTitle title="Certifications" scheme="catrine" style="simple" density={density} fontSize={fontSize} />
          {certifications.map((c, i) => (
            <CertificationItem
              key={c.id || i}
              name={c.name}
              issuer={c.issuer}
              issueDate={c.issueDate}
              mode={c.mode}
              credentialId={c.credentialId}
              scheme="catrine"
              density={density}
              fontSize={fontSize}
              rtl={rtl}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div 
      className={`cv-container bg-white min-h-full ${exportMode ? 'export-mode' : ''}`}
      style={{ fontFamily: 'Calibri, sans-serif', fontSize: fonts.body }}
    >
      {exportMode && <style>{PRINT_CSS}</style>}
      
      <div className={`flex min-h-full ${rtl ? 'flex-row-reverse' : ''}`}>
        <aside 
          className="flex-shrink-0"
          style={{ width: '33%', backgroundColor: '#8B9A7D', padding: spacing.contentPadding }}
        >
          {sidebar}
        </aside>
        <main className="flex-1" style={{ padding: spacing.contentPadding }}>
          {main}
        </main>
      </div>
    </div>
  );
}

// =============================================================================
// TEMPLATE 3: SARAH - Clean two-column minimal design
// =============================================================================
export function SarahTemplate({ data: d, rtl, t, exportMode = false }: TemplateProps) {
  const months = getMonths(t);
  const pres = t('present') as string;
  const { density, fontSize } = getSettings(d);
  const spacing = SPACING[density];
  const fonts = FONT_SIZES[fontSize];
  
  const experience = prepareExperience(d.experience, months, pres);
  const education = prepareEducation(d.education, months);
  const certifications = prepareCertifications(d.certifications, months);
  const accentColor = '#C9A66B';

  return (
    <div 
      className={`cv-container bg-white min-h-full ${rtl ? 'text-right' : 'text-left'} ${exportMode ? 'export-mode' : ''}`}
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: fonts.body, padding: spacing.contentPadding * 1.5 }}
    >
      {exportMode && <style>{PRINT_CSS}</style>}
      
      {/* Header */}
      <header className="text-center mb-5 pb-4 border-b" style={{ borderColor: '#e5e5e5' }}>
        <h1 
          className="font-light tracking-widest text-gray-800 uppercase"
          style={{ fontSize: fonts.name }}
        >
          {d.personal.fullName || 'YOUR NAME'}
        </h1>
        <p 
          className="uppercase tracking-[0.2em] mt-2"
          style={{ fontSize: fonts.jobTitle, color: accentColor }}
        >
          {d.personal.jobTitle}
        </p>
      </header>

      <div className={`flex gap-6 ${rtl ? 'flex-row-reverse' : ''}`}>
        {/* Left Column */}
        <div className="w-1/3 space-y-4">
          {/* Contact */}
          <section>
            <h3 
              className="uppercase tracking-widest mb-2"
              style={{ fontSize: fonts.tiny, color: BASE_TOKENS.colors.textMuted }}
            >
              Contact
            </h3>
            <div className="space-y-1">
              {d.personal.phone && (
                <p className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`} style={{ fontSize: fonts.small }}>
                  <span>📱</span> {d.personal.phone}
                </p>
              )}
              {d.personal.email && (
                <p className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`} style={{ fontSize: fonts.small }}>
                  <span>✉️</span> {d.personal.email}
                </p>
              )}
              {d.personal.location && (
                <p className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`} style={{ fontSize: fonts.small }}>
                  <span>📍</span> {d.personal.location}
                </p>
              )}
            </div>
          </section>

          {/* Education */}
          {education.length > 0 && (
            <section className="cv-section">
              <h3 
                className="uppercase tracking-widest mb-2"
                style={{ fontSize: fonts.tiny, color: BASE_TOKENS.colors.textMuted }}
              >
                Education
              </h3>
              {education.map((e, i) => (
                <div key={e.id || i} style={{ marginBottom: spacing.itemGap }}>
                  <p className="font-bold uppercase" style={{ fontSize: fonts.small, color: accentColor }}>
                    {e.institution}
                  </p>
                  <p className="font-semibold" style={{ fontSize: fonts.small }}>{e.degree}</p>
                  <p style={{ fontSize: fonts.tiny, color: BASE_TOKENS.colors.textLight }}>{e.gradDate}</p>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {d.skills.length > 0 && (
            <section>
              <h3 
                className="uppercase tracking-widest mb-2"
                style={{ fontSize: fonts.tiny, color: BASE_TOKENS.colors.textMuted }}
              >
                Skills
              </h3>
              {d.skills.map((s, i) => (
                <p key={i} style={{ fontSize: fonts.small, marginBottom: spacing.bulletGap }}>{s}</p>
              ))}
            </section>
          )}

          {/* Languages */}
          {d.languages.length > 0 && (
            <section>
              <h3 
                className="uppercase tracking-widest mb-2"
                style={{ fontSize: fonts.tiny, color: BASE_TOKENS.colors.textMuted }}
              >
                Languages
              </h3>
              {d.languages.map((l, i) => (
                <p key={i} style={{ fontSize: fonts.small, marginBottom: spacing.bulletGap }}>
                  {l.name} - {l.level}
                </p>
              ))}
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-4">
          {/* Summary */}
          {d.summary && (
            <section>
              <h3 
                className="uppercase tracking-widest mb-2"
                style={{ fontSize: fonts.tiny, color: BASE_TOKENS.colors.textMuted }}
              >
                Summary
              </h3>
              <p 
                className="text-justify"
                style={{ fontSize: fonts.small, lineHeight: spacing.lineHeight, color: BASE_TOKENS.colors.secondary }}
              >
                {d.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="cv-section">
              <h3 
                className="uppercase tracking-widest mb-2"
                style={{ fontSize: fonts.tiny, color: BASE_TOKENS.colors.textMuted }}
              >
                Experience
              </h3>
              {experience.map((e, i) => (
                <div key={e.id || i} className="cv-item" style={{ marginBottom: spacing.itemGap }}>
                  <div className={`flex justify-between items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold uppercase" style={{ fontSize: fonts.body, color: accentColor }}>
                        {e.jobTitle}
                      </p>
                      <p className="italic" style={{ fontSize: fonts.small, color: BASE_TOKENS.colors.secondary }}>
                        {e.company}
                      </p>
                    </div>
                    <span 
                      className="flex-shrink-0"
                      style={{ fontSize: fonts.tiny, color: BASE_TOKENS.colors.textLight, width: BASE_TOKENS.grid.dateColumnWidth }}
                    >
                      {e.dateRange}
                    </span>
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className={`mt-2 ${rtl ? 'pr-3' : 'pl-3'}`} style={{ listStyle: 'none', padding: 0, margin: 0, paddingLeft: rtl ? 0 : 12, paddingRight: rtl ? 12 : 0 }}>
                      {e.bullets.map((b: string, j: number) => (
                        <li 
                          key={j}
                          className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}
                          style={{ fontSize: fonts.small, color: BASE_TOKENS.colors.secondary, marginBottom: spacing.bulletGap, lineHeight: spacing.lineHeight }}
                        >
                          <span style={{ color: accentColor }}>•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="cv-section">
              <h3 
                className="uppercase tracking-widest mb-2"
                style={{ fontSize: fonts.tiny, color: BASE_TOKENS.colors.textMuted }}
              >
                Certifications
              </h3>
              {certifications.map((c, i) => (
                <div key={c.id || i} style={{ marginBottom: spacing.itemGap }}>
                  <div className={`flex justify-between items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold" style={{ fontSize: fonts.small }}>{c.name}</p>
                      <p style={{ fontSize: fonts.tiny, color: BASE_TOKENS.colors.secondary }}>{c.issuer}</p>
                    </div>
                    <div className={`flex-shrink-0 flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                      <span style={{ fontSize: fonts.tiny, color: BASE_TOKENS.colors.textLight }}>{c.issueDate}</span>
                      {c.mode && (
                        <span 
                          className="px-1 py-0.5 rounded"
                          style={{ 
                            fontSize: fonts.tiny,
                            backgroundColor: c.mode === 'online' ? '#dbeafe' : '#fef3c7',
                            color: c.mode === 'online' ? '#1d4ed8' : '#92400e',
                          }}
                        >
                          {c.mode === 'online' ? '🌐' : '🏢'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// TEMPLATE 4: OLIVIA - Modern with color accents
// =============================================================================
export function OliviaTemplate({ data: d, rtl, t, exportMode = false }: TemplateProps) {
  const months = getMonths(t);
  const pres = t('present') as string;
  const { density, fontSize } = getSettings(d);
  const spacing = SPACING[density];
  const fonts = FONT_SIZES[fontSize];
  
  const experience = prepareExperience(d.experience, months, pres);
  const education = prepareEducation(d.education, months);
  const certifications = prepareCertifications(d.certifications, months);
  const accentColor = '#DD6B20';
  const primaryColor = '#2D3748';

  return (
    <div 
      className={`cv-container bg-white min-h-full ${rtl ? 'text-right' : 'text-left'} ${exportMode ? 'export-mode' : ''}`}
      style={{ fontFamily: 'Arial, sans-serif', fontSize: fonts.body }}
    >
      {exportMode && <style>{PRINT_CSS}</style>}
      
      {/* Header */}
      <header style={{ backgroundColor: primaryColor, color: '#fff', padding: spacing.headerPadding }}>
        <div className={`flex items-center gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1 min-w-0">
            <h1 style={{ fontSize: fonts.name }} className="font-bold">
              <span className="text-white">{d.personal.fullName?.split(' ')[0] || 'FIRST'}</span>
              {' '}
              <span className="font-light">{d.personal.fullName?.split(' ').slice(1).join(' ') || 'LAST'}</span>
            </h1>
            <p style={{ fontSize: fonts.jobTitle, color: accentColor, marginTop: 2 }}>{d.personal.jobTitle}</p>
          </div>
          <div className={`flex-shrink-0 space-y-1 ${rtl ? 'text-left' : 'text-right'}`} style={{ fontSize: fonts.small }}>
            {d.personal.location && <p>📍 {d.personal.location}</p>}
            {d.personal.phone && <p>📱 {d.personal.phone}</p>}
            {d.personal.email && <p>✉️ {d.personal.email}</p>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {d.summary && (
        <div style={{ backgroundColor: '#f7fafc', padding: spacing.contentPadding, borderBottom: '1px solid #e2e8f0' }}>
          <p 
            className="text-justify"
            style={{ fontSize: fonts.small, lineHeight: spacing.lineHeight, color: BASE_TOKENS.colors.secondary }}
          >
            {d.summary}
          </p>
        </div>
      )}

      <div style={{ padding: spacing.contentPadding }}>
        {/* Experience */}
        {experience.length > 0 && (
          <section className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
            <h2 
              className="font-bold uppercase tracking-wider pb-1 mb-3"
              style={{ fontSize: fonts.sectionTitle, color: accentColor, borderBottom: `2px solid ${accentColor}` }}
            >
              Work Experience
            </h2>
            {experience.map((e, i) => (
              <div key={e.id || i} className="cv-item" style={{ marginBottom: spacing.itemGap }}>
                <div className={`flex justify-between items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold" style={{ fontSize: fonts.body, color: BASE_TOKENS.colors.text }}>
                      ▸ {e.jobTitle} <span className="font-normal" style={{ color: BASE_TOKENS.colors.secondary }}>| {e.company}</span>
                    </p>
                  </div>
                  <span 
                    className="flex-shrink-0 font-medium"
                    style={{ fontSize: fonts.tiny, color: accentColor, width: BASE_TOKENS.grid.dateColumnWidth, textAlign: 'right' }}
                  >
                    {e.dateRange}
                  </span>
                </div>
                {e.bullets.length > 0 && (
                  <ul className={`mt-2 ${rtl ? 'pr-4' : 'pl-4'}`} style={{ listStyle: 'none', padding: 0, margin: 0, paddingLeft: rtl ? 0 : 16, paddingRight: rtl ? 16 : 0 }}>
                    {e.bullets.map((b: string, j: number) => (
                      <li 
                        key={j}
                        className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}
                        style={{ fontSize: fonts.small, color: BASE_TOKENS.colors.secondary, marginBottom: spacing.bulletGap, lineHeight: spacing.lineHeight }}
                      >
                        <span style={{ color: accentColor }}>•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Skills - Two columns */}
        {d.skills.length > 0 && (
          <section className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
            <h2 
              className="font-bold uppercase tracking-wider pb-1 mb-3"
              style={{ fontSize: fonts.sectionTitle, color: accentColor, borderBottom: `2px solid ${accentColor}` }}
            >
              Skills
            </h2>
            <div className={`grid grid-cols-2 gap-x-6 gap-y-1 ${rtl ? 'text-right' : 'text-left'}`}>
              {d.skills.map((s, i) => (
                <p key={i} className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`} style={{ fontSize: fonts.small }}>
                  <span style={{ color: accentColor }}>•</span> {s}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
            <h2 
              className="font-bold uppercase tracking-wider pb-1 mb-3"
              style={{ fontSize: fonts.sectionTitle, color: accentColor, borderBottom: `2px solid ${accentColor}` }}
            >
              Education
            </h2>
            {education.map((e, i) => (
              <div key={e.id || i} style={{ marginBottom: spacing.itemGap }}>
                <div className={`flex justify-between items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold" style={{ fontSize: fonts.body }}>{e.degree}</p>
                    <p style={{ fontSize: fonts.small, color: BASE_TOKENS.colors.secondary }}>{e.institution}</p>
                  </div>
                  <span className="flex-shrink-0 font-medium" style={{ fontSize: fonts.tiny, color: accentColor }}>{e.gradDate}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="cv-section" style={{ marginBottom: spacing.sectionGap }}>
            <h2 
              className="font-bold uppercase tracking-wider pb-1 mb-3"
              style={{ fontSize: fonts.sectionTitle, color: accentColor, borderBottom: `2px solid ${accentColor}` }}
            >
              Certifications
            </h2>
            {certifications.map((c, i) => (
              <div key={c.id || i} style={{ marginBottom: spacing.itemGap }}>
                <div className={`flex justify-between items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold" style={{ fontSize: fonts.body }}>{c.name}</p>
                    <p style={{ fontSize: fonts.small, color: BASE_TOKENS.colors.secondary }}>{c.issuer}</p>
                  </div>
                  <div className={`flex-shrink-0 flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                    <span style={{ fontSize: fonts.tiny, color: accentColor }}>{c.issueDate}</span>
                    {c.mode && (
                      <span 
                        className="px-2 py-0.5 rounded-full"
                        style={{ 
                          fontSize: fonts.tiny,
                          backgroundColor: c.mode === 'online' ? '#dbeafe' : '#dcfce7',
                          color: c.mode === 'online' ? '#1d4ed8' : '#15803d',
                        }}
                      >
                        {c.mode === 'online' ? '🌐 Online' : '🏢 In-Person'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Languages */}
        {d.languages.length > 0 && (
          <section className="cv-section">
            <h2 
              className="font-bold uppercase tracking-wider pb-1 mb-3"
              style={{ fontSize: fonts.sectionTitle, color: accentColor, borderBottom: `2px solid ${accentColor}` }}
            >
              Languages
            </h2>
            <div className={`flex flex-wrap gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
              {d.languages.map((l, i) => (
                <span key={i} style={{ fontSize: fonts.small }}>
                  <strong>{l.name}</strong>: {l.level}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// TEMPLATE REGISTRY
// =============================================================================
export const TEMPLATES = {
  morgan: { component: MorganTemplate, icon: '📋', gradient: 'from-gray-800 to-purple-600' },
  catrine: { component: CatrineTemplate, icon: '📸', gradient: 'from-[#8B9A7D] to-[#6B7A5D]' },
  sarah: { component: SarahTemplate, icon: '✨', gradient: 'from-[#C9A66B] to-[#A8854D]' },
  olivia: { component: OliviaTemplate, icon: '🔥', gradient: 'from-[#2D3748] to-[#DD6B20]' },
} as const;

export type TemplateKey = keyof typeof TEMPLATES;
