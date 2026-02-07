// src/templates/index.tsx
// 4 Professional CV Templates using shared components

'use client';

import React from 'react';
import { CVData } from '@/lib/types';
import { TOKENS } from '@/lib/pdf/tokens';
import { normalizeCV, sortByDate } from '@/lib/pdf/normalize';
import {
  Header,
  SectionTitle,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  SkillsList,
  LanguagesList,
  TwoColumnLayout,
} from './components';

interface TemplateProps {
  data: CVData;
  rtl: boolean;
  t: (key: string) => string | string[];
  compact?: boolean;
}

// Helper to get months array
const getMonths = (t: (key: string) => string | string[]): string[] => {
  const months = t('months');
  return Array.isArray(months) ? months : [];
};

// Helper to normalize experience with bullets
const prepareExperience = (exp: any[], months: string[]) => {
  return sortByDate(exp, 'startYear').map(e => {
    const startDate = e.startMonth && months[parseInt(e.startMonth) - 1] 
      ? `${months[parseInt(e.startMonth) - 1]} ${e.startYear}` 
      : e.startYear || '';
    const endDate = e.current 
      ? 'Present' 
      : (e.endMonth && months[parseInt(e.endMonth) - 1] 
        ? `${months[parseInt(e.endMonth) - 1]} ${e.endYear}` 
        : e.endYear || '');
    
    const bullets = e.description 
      ? e.description.split(/[\n\r]+/).map((l: string) => l.replace(/^[•\-\*]\s*/, '').trim()).filter((l: string) => l)
      : [];

    return {
      ...e,
      dateRange: startDate ? `${startDate} - ${endDate}` : '',
      bullets,
    };
  });
};

// Helper to normalize education
const prepareEducation = (edu: any[], months: string[]) => {
  return sortByDate(edu, 'gradYear').map(e => ({
    ...e,
    gradDate: e.gradMonth && months[parseInt(e.gradMonth) - 1] 
      ? `${months[parseInt(e.gradMonth) - 1]} ${e.gradYear}` 
      : e.gradYear || '',
  }));
};

// Helper to normalize certifications
const prepareCertifications = (certs: any[], months: string[]) => {
  return sortByDate(certs, 'issueYear').map(c => ({
    ...c,
    issueDate: c.issueMonth && months[parseInt(c.issueMonth) - 1] 
      ? `${months[parseInt(c.issueMonth) - 1]} ${c.issueYear}` 
      : c.issueYear || '',
  }));
};

// =============================================================================
// TEMPLATE 1: MORGAN - Bold header with elegant sidebar
// =============================================================================
export function MorganTemplate({ data: d, rtl, t, compact = false }: TemplateProps) {
  const months = getMonths(t);
  const experience = prepareExperience(d.experience, months);
  const education = prepareEducation(d.education, months);
  const certifications = prepareCertifications(d.certifications, months);
  const scheme = 'morgan';
  const gap = compact ? TOKENS.compact.sectionGap : TOKENS.spacing.lg;

  const sidebar = (
    <div className="space-y-6">
      {/* Languages */}
      {d.languages.length > 0 && (
        <div>
          <SectionTitle title="Language" scheme={scheme} style="simple" />
          <LanguagesList languages={d.languages} scheme={scheme} layout="bars" rtl={rtl} />
        </div>
      )}

      {/* Skills */}
      {d.skills.length > 0 && (
        <div>
          <SectionTitle title="Expertise" scheme={scheme} style="simple" />
          <SkillsList skills={d.skills} scheme={scheme} layout="bullets" compact={compact} rtl={rtl} />
        </div>
      )}

      {/* Reference */}
      <div>
        <SectionTitle title="Reference" scheme={scheme} style="simple" />
        <p className="text-sm text-gray-500 italic">Available upon request</p>
      </div>
    </div>
  );

  const main = (
    <div style={{ direction: rtl ? 'rtl' : 'ltr' }}>
      {/* Summary */}
      {d.summary && (
        <section style={{ marginBottom: gap }}>
          <SectionTitle title="About Me" scheme={scheme} style="underline" />
          <p 
            className="text-justify" 
            style={{ 
              fontSize: TOKENS.fonts.small, 
              lineHeight: compact ? TOKENS.compact.lineHeight : TOKENS.lineHeight.normal,
              color: TOKENS.colors.secondary 
            }}
          >
            {d.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section style={{ marginBottom: gap }}>
          <SectionTitle title="Experience" scheme={scheme} style="underline" />
          {experience.map((e, i) => (
            <ExperienceItem
              key={e.id || i}
              jobTitle={e.jobTitle}
              company={e.company}
              dateRange={e.dateRange}
              bullets={e.bullets}
              scheme={scheme}
              compact={compact}
              rtl={rtl}
            />
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section style={{ marginBottom: gap }}>
          <SectionTitle title="Education" scheme={scheme} style="underline" />
          {education.map((e, i) => (
            <EducationItem
              key={e.id || i}
              degree={e.degree}
              institution={e.institution}
              gradDate={e.gradDate}
              gpa={e.gpa}
              thesis={e.thesisTitle}
              scheme={scheme}
              compact={compact}
              rtl={rtl}
            />
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <SectionTitle title="Certifications" scheme={scheme} style="underline" />
          {certifications.map((c, i) => (
            <CertificationItem
              key={c.id || i}
              name={c.name}
              issuer={c.issuer}
              issueDate={c.issueDate}
              mode={c.mode}
              credentialId={c.credentialId}
              scheme={scheme}
              compact={compact}
              rtl={rtl}
            />
          ))}
        </section>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-full" style={{ fontFamily: 'Georgia, serif', fontSize: TOKENS.fonts.body }}>
      {/* Header */}
      <div className="bg-black text-white p-6">
        <div className={`flex items-center gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
          {d.personal.photo && (
            <img src={d.personal.photo} className="w-20 h-20 object-cover border-2 border-white" alt="" />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-wide uppercase" style={{ fontSize: TOKENS.fonts.name }}>
              {d.personal.fullName || 'YOUR NAME'}
            </h1>
            <p className="text-gray-300 uppercase tracking-widest mt-1" style={{ fontSize: TOKENS.fonts.jobTitle }}>
              {d.personal.jobTitle}
            </p>
          </div>
          <div className={`text-xs space-y-1 ${rtl ? 'text-left' : 'text-right'}`}>
            {d.personal.phone && <p>📱 {d.personal.phone}</p>}
            {d.personal.email && <p>✉️ {d.personal.email}</p>}
            {d.personal.location && <p>📍 {d.personal.location}</p>}
          </div>
        </div>
      </div>

      <TwoColumnLayout
        sidebar={sidebar}
        main={main}
        sidebarWidth="30%"
        sidebarPosition="left"
        sidebarBg="#f9fafb"
        rtl={rtl}
      />
    </div>
  );
}

// =============================================================================
// TEMPLATE 2: CATRINE - Photo-focused professional layout
// =============================================================================
export function CatrineTemplate({ data: d, rtl, t, compact = false }: TemplateProps) {
  const months = getMonths(t);
  const experience = prepareExperience(d.experience, months);
  const education = prepareEducation(d.education, months);
  const certifications = prepareCertifications(d.certifications, months);
  const scheme = 'catrine';
  const gap = compact ? TOKENS.compact.sectionGap : TOKENS.spacing.lg;

  const sidebar = (
    <div className="text-white space-y-6">
      {/* Photo */}
      <div className="mb-4">
        {d.personal.photo ? (
          <img src={d.personal.photo} className="w-full aspect-square object-cover border-4 border-white/30" alt="" />
        ) : (
          <div className="w-full aspect-square bg-white/20 flex items-center justify-center text-5xl">
            {d.personal.fullName?.charAt(0) || '?'}
          </div>
        )}
      </div>

      {/* Profile */}
      {d.summary && (
        <div>
          <h3 className="font-bold uppercase text-xs tracking-wider mb-2 border-b border-white/30 pb-1">Profile</h3>
          <p 
            className="text-sm leading-relaxed opacity-90 text-justify"
            style={{ fontSize: TOKENS.fonts.small, lineHeight: compact ? TOKENS.compact.lineHeight : TOKENS.lineHeight.normal }}
          >
            {d.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {d.skills.length > 0 && (
        <div>
          <h3 className="font-bold uppercase text-xs tracking-wider mb-2 border-b border-white/30 pb-1">Skills</h3>
          {d.skills.map((s, i) => (
            <div key={i} className={`flex items-center gap-2 text-sm mb-1 opacity-90 ${rtl ? 'flex-row-reverse' : ''}`}>
              <span>•</span>
              <span style={{ fontSize: TOKENS.fonts.small }}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {d.languages.length > 0 && (
        <div>
          <h3 className="font-bold uppercase text-xs tracking-wider mb-2 border-b border-white/30 pb-1">Languages</h3>
          {d.languages.map((l, i) => (
            <div key={i} className="text-sm mb-1 opacity-90" style={{ fontSize: TOKENS.fonts.small }}>
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
      <div className="bg-[#F5F5F0] p-6 -mx-6 -mt-6 mb-6">
        <h1 className="text-3xl font-light text-gray-800" style={{ fontSize: TOKENS.fonts.name }}>
          {d.personal.fullName || 'Your Name'}
        </h1>
        <p className="text-base text-[#8B9A7D] uppercase tracking-widest mt-1" style={{ fontSize: TOKENS.fonts.jobTitle }}>
          {d.personal.jobTitle}
        </p>
      </div>

      {/* Contact Bar */}
      <div className={`bg-gray-100 -mx-6 px-6 py-2 mb-6 flex gap-4 text-xs text-gray-600 ${rtl ? 'flex-row-reverse' : ''}`}>
        {d.personal.phone && <span>📱 {d.personal.phone}</span>}
        {d.personal.email && <span>✉️ {d.personal.email}</span>}
        {d.personal.location && <span>📍 {d.personal.location}</span>}
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <section style={{ marginBottom: gap }}>
          <SectionTitle title="Work Experience" scheme={scheme} style="underline" />
          {experience.map((e, i) => (
            <ExperienceItem
              key={e.id || i}
              jobTitle={e.jobTitle}
              company={e.company}
              dateRange={e.dateRange}
              bullets={e.bullets}
              scheme={scheme}
              compact={compact}
              rtl={rtl}
            />
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section style={{ marginBottom: gap }}>
          <SectionTitle title="Educational History" scheme={scheme} style="underline" />
          {education.map((e, i) => (
            <EducationItem
              key={e.id || i}
              degree={e.degree}
              institution={e.institution}
              gradDate={e.gradDate}
              gpa={e.gpa}
              thesis={e.thesisTitle}
              scheme={scheme}
              compact={compact}
              rtl={rtl}
            />
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <SectionTitle title="Certifications" scheme={scheme} style="underline" />
          {certifications.map((c, i) => (
            <CertificationItem
              key={c.id || i}
              name={c.name}
              issuer={c.issuer}
              issueDate={c.issueDate}
              mode={c.mode}
              credentialId={c.credentialId}
              scheme={scheme}
              compact={compact}
              rtl={rtl}
            />
          ))}
        </section>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-full" style={{ fontFamily: 'Calibri, sans-serif', fontSize: TOKENS.fonts.body }}>
      <TwoColumnLayout
        sidebar={sidebar}
        main={main}
        sidebarWidth="33%"
        sidebarPosition="left"
        sidebarBg="#8B9A7D"
        rtl={rtl}
      />
    </div>
  );
}

// =============================================================================
// TEMPLATE 3: SARAH - Clean two-column minimal design
// =============================================================================
export function SarahTemplate({ data: d, rtl, t, compact = false }: TemplateProps) {
  const months = getMonths(t);
  const experience = prepareExperience(d.experience, months);
  const education = prepareEducation(d.education, months);
  const certifications = prepareCertifications(d.certifications, months);
  const scheme = 'sarah';
  const gap = compact ? TOKENS.compact.sectionGap : TOKENS.spacing.lg;

  return (
    <div 
      className={`bg-white min-h-full p-8 ${rtl ? 'text-right' : 'text-left'}`} 
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: TOKENS.fonts.body }}
    >
      {/* Header */}
      <header className="text-center mb-6 pb-4 border-b border-gray-200">
        <h1 
          className="text-3xl font-light tracking-widest text-gray-800 uppercase"
          style={{ fontSize: TOKENS.fonts.name }}
        >
          {d.personal.fullName || 'YOUR NAME'}
        </h1>
        <p 
          className="text-sm tracking-[0.2em] text-[#D4A574] uppercase mt-2"
          style={{ fontSize: TOKENS.fonts.jobTitle }}
        >
          {d.personal.jobTitle}
        </p>
      </header>

      <div className={`flex gap-8 ${rtl ? 'flex-row-reverse' : ''}`}>
        {/* Left Column */}
        <div className="w-1/3 space-y-5">
          {/* Contact */}
          <section>
            <h3 className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-2">Contact</h3>
            <div className="space-y-1.5">
              {d.personal.phone && (
                <p className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`} style={{ fontSize: TOKENS.fonts.small }}>
                  <span>📱</span> {d.personal.phone}
                </p>
              )}
              {d.personal.email && (
                <p className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`} style={{ fontSize: TOKENS.fonts.small }}>
                  <span>✉️</span> {d.personal.email}
                </p>
              )}
              {d.personal.location && (
                <p className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`} style={{ fontSize: TOKENS.fonts.small }}>
                  <span>📍</span> {d.personal.location}
                </p>
              )}
            </div>
          </section>

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-2">Education</h3>
              {education.map((e, i) => (
                <div key={e.id || i} className="mb-3">
                  <p className="font-bold text-[#D4A574] uppercase" style={{ fontSize: TOKENS.fonts.small }}>
                    {e.institution}
                  </p>
                  <p className="font-semibold" style={{ fontSize: TOKENS.fonts.small }}>{e.degree}</p>
                  <p className="text-gray-500" style={{ fontSize: TOKENS.fonts.tiny }}>{e.gradDate}</p>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {d.skills.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-2">Skills</h3>
              {d.skills.map((s, i) => (
                <p key={i} style={{ fontSize: TOKENS.fonts.small }} className="mb-1">{s}</p>
              ))}
            </section>
          )}

          {/* Languages */}
          {d.languages.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-2">Languages</h3>
              {d.languages.map((l, i) => (
                <p key={i} style={{ fontSize: TOKENS.fonts.small }} className="mb-1">
                  {l.name} - {l.level}
                </p>
              ))}
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-5">
          {/* Summary */}
          {d.summary && (
            <section>
              <h3 className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-2">Summary</h3>
              <p 
                className="text-gray-700 leading-relaxed text-justify"
                style={{ fontSize: TOKENS.fonts.small, lineHeight: compact ? TOKENS.compact.lineHeight : TOKENS.lineHeight.normal }}
              >
                {d.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-2">Experience</h3>
              {experience.map((e, i) => (
                <div key={e.id || i} className="mb-4">
                  <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <p className="font-bold uppercase text-[#D4A574]" style={{ fontSize: TOKENS.fonts.body }}>
                        {e.jobTitle}
                      </p>
                      <p className="text-gray-600 italic" style={{ fontSize: TOKENS.fonts.small }}>{e.company}</p>
                    </div>
                    <span className="text-gray-500 whitespace-nowrap" style={{ fontSize: TOKENS.fonts.tiny }}>
                      {e.dateRange}
                    </span>
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className={`mt-2 space-y-1 ${rtl ? 'pr-3' : 'pl-3'}`}>
                      {e.bullets.map((b: string, j: number) => (
                        <li 
                          key={j} 
                          className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}
                          style={{ fontSize: TOKENS.fonts.small, color: TOKENS.colors.secondary }}
                        >
                          <span className="text-[#D4A574]">•</span>
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
            <section>
              <h3 className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-2">Certifications</h3>
              {certifications.map((c, i) => (
                <div key={c.id || i} className="mb-2">
                  <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <p className="font-semibold" style={{ fontSize: TOKENS.fonts.small }}>{c.name}</p>
                      <p className="text-gray-600" style={{ fontSize: TOKENS.fonts.tiny }}>{c.issuer}</p>
                    </div>
                    <div className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                      <span style={{ fontSize: TOKENS.fonts.tiny }} className="text-gray-500">{c.issueDate}</span>
                      {c.mode && (
                        <span className={`text-xs px-1 py-0.5 rounded ${c.mode === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
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
export function OliviaTemplate({ data: d, rtl, t, compact = false }: TemplateProps) {
  const months = getMonths(t);
  const experience = prepareExperience(d.experience, months);
  const education = prepareEducation(d.education, months);
  const certifications = prepareCertifications(d.certifications, months);
  const scheme = 'olivia';
  const gap = compact ? TOKENS.compact.sectionGap : TOKENS.spacing.lg;
  const accentColor = TOKENS.schemes.olivia.accent;

  return (
    <div 
      className={`bg-white min-h-full ${rtl ? 'text-right' : 'text-left'}`} 
      style={{ fontFamily: 'Arial, sans-serif', fontSize: TOKENS.fonts.body }}
    >
      {/* Header */}
      <div className="bg-[#2D3748] text-white p-5">
        <div className={`flex items-center gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1">
            <h1 style={{ fontSize: TOKENS.fonts.name }} className="text-xl font-bold">
              <span className="text-white">{d.personal.fullName?.split(' ')[0] || 'FIRST'}</span>
              {' '}
              <span className="font-light">{d.personal.fullName?.split(' ').slice(1).join(' ') || 'LAST'}</span>
            </h1>
            <p className="text-[#E67E22] mt-1" style={{ fontSize: TOKENS.fonts.jobTitle }}>{d.personal.jobTitle}</p>
          </div>
          <div className={`text-xs space-y-1 ${rtl ? 'text-left' : 'text-right'}`}>
            {d.personal.location && <p>📍 {d.personal.location}</p>}
            {d.personal.phone && <p>📱 {d.personal.phone}</p>}
            {d.personal.email && <p>✉️ {d.personal.email}</p>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {d.summary && (
        <div className="bg-gray-100 px-5 py-3 border-b">
          <p 
            className="text-gray-700 text-justify"
            style={{ fontSize: TOKENS.fonts.small, lineHeight: compact ? TOKENS.compact.lineHeight : TOKENS.lineHeight.normal }}
          >
            {d.summary}
          </p>
        </div>
      )}

      <div className="p-5">
        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: gap }}>
            <h2 
              className="font-bold uppercase text-sm tracking-wider mb-3 pb-1 border-b-2"
              style={{ color: accentColor, borderColor: accentColor, fontSize: TOKENS.fonts.sectionTitle }}
            >
              Work Experience
            </h2>
            {experience.map((e, i) => (
              <div key={e.id || i} className="mb-4">
                <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="font-bold text-gray-800" style={{ fontSize: TOKENS.fonts.body }}>
                      ▸ {e.jobTitle} <span className="font-normal text-gray-600">| {e.company}</span>
                    </p>
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: accentColor, fontSize: TOKENS.fonts.tiny }}>
                    {e.dateRange}
                  </span>
                </div>
                {e.bullets.length > 0 && (
                  <ul className={`mt-2 space-y-1 ${rtl ? 'pr-4' : 'pl-4'}`}>
                    {e.bullets.map((b: string, j: number) => (
                      <li 
                        key={j}
                        className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}
                        style={{ fontSize: TOKENS.fonts.small, color: TOKENS.colors.secondary }}
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
          <section style={{ marginBottom: gap }}>
            <h2 
              className="font-bold uppercase text-sm tracking-wider mb-3 pb-1 border-b-2"
              style={{ color: accentColor, borderColor: accentColor, fontSize: TOKENS.fonts.sectionTitle }}
            >
              Skills
            </h2>
            <div className={`grid grid-cols-2 gap-x-6 gap-y-1 ${rtl ? 'text-right' : 'text-left'}`}>
              {d.skills.map((s, i) => (
                <p key={i} className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`} style={{ fontSize: TOKENS.fonts.small }}>
                  <span style={{ color: accentColor }}>•</span> {s}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={{ marginBottom: gap }}>
            <h2 
              className="font-bold uppercase text-sm tracking-wider mb-3 pb-1 border-b-2"
              style={{ color: accentColor, borderColor: accentColor, fontSize: TOKENS.fonts.sectionTitle }}
            >
              Education
            </h2>
            {education.map((e, i) => (
              <div key={e.id || i} className="mb-2">
                <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="font-semibold" style={{ fontSize: TOKENS.fonts.body }}>{e.degree}</p>
                    <p className="text-gray-600" style={{ fontSize: TOKENS.fonts.small }}>{e.institution}</p>
                  </div>
                  <span className="font-medium" style={{ color: accentColor, fontSize: TOKENS.fonts.tiny }}>{e.gradDate}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section style={{ marginBottom: gap }}>
            <h2 
              className="font-bold uppercase text-sm tracking-wider mb-3 pb-1 border-b-2"
              style={{ color: accentColor, borderColor: accentColor, fontSize: TOKENS.fonts.sectionTitle }}
            >
              Certifications
            </h2>
            {certifications.map((c, i) => (
              <div key={c.id || i} className="mb-2">
                <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="font-semibold" style={{ fontSize: TOKENS.fonts.body }}>{c.name}</p>
                    <p className="text-gray-600" style={{ fontSize: TOKENS.fonts.small }}>{c.issuer}</p>
                  </div>
                  <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                    <span style={{ color: accentColor, fontSize: TOKENS.fonts.tiny }}>{c.issueDate}</span>
                    {c.mode && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.mode === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
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
          <section>
            <h2 
              className="font-bold uppercase text-sm tracking-wider mb-3 pb-1 border-b-2"
              style={{ color: accentColor, borderColor: accentColor, fontSize: TOKENS.fonts.sectionTitle }}
            >
              Languages
            </h2>
            <div className={`flex gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
              {d.languages.map((l, i) => (
                <span key={i} style={{ fontSize: TOKENS.fonts.small }}>
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
  sarah: { component: SarahTemplate, icon: '✨', gradient: 'from-[#D4A574] to-[#B8956A]' },
  olivia: { component: OliviaTemplate, icon: '🔥', gradient: 'from-[#2D3748] to-[#E67E22]' },
} as const;

export type TemplateKey = keyof typeof TEMPLATES;
