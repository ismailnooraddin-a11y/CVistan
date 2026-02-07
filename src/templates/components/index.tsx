// src/templates/components/index.tsx
// Reusable CV template components

import React from 'react';
import { TOKENS } from '@/lib/pdf/tokens';

interface HeaderProps {
  name: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  location?: string;
  photo?: string | null;
  scheme: keyof typeof TOKENS.schemes;
  layout: 'centered' | 'left' | 'split';
  rtl?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  name, jobTitle, email, phone, location, photo, scheme, layout, rtl
}) => {
  const colors = TOKENS.schemes[scheme];
  
  if (layout === 'centered') {
    return (
      <header className="text-center pb-4 border-b-2" style={{ borderColor: colors.accent }}>
        {photo && <img src={photo} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" alt="" />}
        <h1 className="text-2xl font-bold" style={{ color: colors.primary, fontSize: TOKENS.fonts.name }}>{name}</h1>
        <p className="text-sm mt-1" style={{ color: colors.accent, fontSize: TOKENS.fonts.jobTitle }}>{jobTitle}</p>
        <div className="flex justify-center gap-4 mt-2 text-xs" style={{ color: TOKENS.colors.textLight }}>
          {email && <span>✉️ {email}</span>}
          {phone && <span>📱 {phone}</span>}
          {location && <span>📍 {location}</span>}
        </div>
      </header>
    );
  }

  if (layout === 'split') {
    return (
      <header className={`flex items-center gap-4 pb-4 border-b-2 ${rtl ? 'flex-row-reverse' : ''}`} style={{ borderColor: colors.accent }}>
        {photo && <img src={photo} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt="" />}
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>{name}</h1>
          <p className="text-sm" style={{ color: colors.accent }}>{jobTitle}</p>
        </div>
        <div className={`text-xs space-y-1 ${rtl ? 'text-left' : 'text-right'}`} style={{ color: TOKENS.colors.textLight }}>
          {email && <p>{email}</p>}
          {phone && <p>{phone}</p>}
          {location && <p>{location}</p>}
        </div>
      </header>
    );
  }

  // left layout
  return (
    <header className={`pb-4 border-b-2 ${rtl ? 'text-right' : 'text-left'}`} style={{ borderColor: colors.accent }}>
      <div className={`flex items-center gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
        {photo && <img src={photo} className="w-16 h-16 rounded-full object-cover flex-shrink-0" alt="" />}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>{name}</h1>
          <p className="text-sm" style={{ color: colors.accent }}>{jobTitle}</p>
        </div>
      </div>
      <div className={`flex gap-4 mt-2 text-xs ${rtl ? 'flex-row-reverse' : ''}`} style={{ color: TOKENS.colors.textLight }}>
        {email && <span>✉️ {email}</span>}
        {phone && <span>📱 {phone}</span>}
        {location && <span>📍 {location}</span>}
      </div>
    </header>
  );
};

interface SectionTitleProps {
  title: string;
  scheme: keyof typeof TOKENS.schemes;
  style?: 'underline' | 'background' | 'simple';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, scheme, style = 'underline' }) => {
  const colors = TOKENS.schemes[scheme];
  
  if (style === 'background') {
    return (
      <h2 
        className="text-xs font-bold uppercase tracking-wider px-2 py-1 mb-2 rounded"
        style={{ 
          backgroundColor: colors.accent, 
          color: '#ffffff',
          fontSize: TOKENS.fonts.sectionTitle 
        }}
      >
        {title}
      </h2>
    );
  }

  if (style === 'simple') {
    return (
      <h2 
        className="text-xs font-bold uppercase tracking-widest mb-2"
        style={{ color: TOKENS.colors.textLight, fontSize: TOKENS.fonts.small }}
      >
        {title}
      </h2>
    );
  }

  // underline style
  return (
    <h2 
      className="font-bold uppercase tracking-wider pb-1 mb-3 border-b-2"
      style={{ 
        color: colors.primary, 
        borderColor: colors.accent,
        fontSize: TOKENS.fonts.sectionTitle 
      }}
    >
      {title}
    </h2>
  );
};

interface ExperienceItemProps {
  jobTitle: string;
  company: string;
  dateRange: string;
  bullets: string[];
  scheme: keyof typeof TOKENS.schemes;
  compact?: boolean;
  rtl?: boolean;
}

export const ExperienceItem: React.FC<ExperienceItemProps> = ({
  jobTitle, company, dateRange, bullets, scheme, compact, rtl
}) => {
  const colors = TOKENS.schemes[scheme];
  const gap = compact ? TOKENS.compact.itemGap : TOKENS.spacing.md;

  return (
    <div className={`mb-${compact ? '2' : '4'}`} style={{ marginBottom: gap }}>
      <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
        <div>
          <h3 className="font-bold" style={{ fontSize: TOKENS.fonts.body, color: TOKENS.colors.text }}>{jobTitle}</h3>
          <p style={{ fontSize: TOKENS.fonts.small, color: colors.accent }}>{company}</p>
        </div>
        <span 
          className="text-xs whitespace-nowrap flex-shrink-0" 
          style={{ color: TOKENS.colors.textLight, fontSize: TOKENS.fonts.tiny }}
        >
          {dateRange}
        </span>
      </div>
      {bullets.length > 0 && (
        <ul className={`mt-2 space-y-1 ${rtl ? 'pr-4' : 'pl-4'}`}>
          {bullets.map((bullet, i) => (
            <li 
              key={i} 
              className={`flex gap-2 ${rtl ? 'flex-row-reverse text-right' : ''}`}
              style={{ fontSize: TOKENS.fonts.small, lineHeight: TOKENS.lineHeight.normal, color: TOKENS.colors.secondary }}
            >
              <span style={{ color: colors.accent }}>•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface EducationItemProps {
  degree: string;
  institution: string;
  gradDate: string;
  gpa?: string;
  thesis?: string;
  scheme: keyof typeof TOKENS.schemes;
  compact?: boolean;
  rtl?: boolean;
}

export const EducationItem: React.FC<EducationItemProps> = ({
  degree, institution, gradDate, gpa, thesis, scheme, compact, rtl
}) => {
  const colors = TOKENS.schemes[scheme];

  return (
    <div className={`mb-${compact ? '2' : '3'}`}>
      <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
        <div>
          <h3 className="font-bold" style={{ fontSize: TOKENS.fonts.body }}>{degree}</h3>
          <p style={{ fontSize: TOKENS.fonts.small, color: colors.accent }}>{institution}</p>
        </div>
        <span style={{ fontSize: TOKENS.fonts.tiny, color: TOKENS.colors.textLight }}>{gradDate}</span>
      </div>
      {gpa && <p style={{ fontSize: TOKENS.fonts.tiny, color: TOKENS.colors.textLight }}>GPA: {gpa}</p>}
      {thesis && <p style={{ fontSize: TOKENS.fonts.tiny, color: TOKENS.colors.textLight, fontStyle: 'italic' }}>Thesis: {thesis}</p>}
    </div>
  );
};

interface CertificationItemProps {
  name: string;
  issuer: string;
  issueDate: string;
  mode?: 'online' | 'in-person' | '';
  credentialId?: string;
  scheme: keyof typeof TOKENS.schemes;
  compact?: boolean;
  rtl?: boolean;
}

export const CertificationItem: React.FC<CertificationItemProps> = ({
  name, issuer, issueDate, mode, credentialId, scheme, compact, rtl
}) => {
  const colors = TOKENS.schemes[scheme];

  return (
    <div className={`mb-${compact ? '2' : '3'}`}>
      <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
        <div>
          <h3 className="font-semibold" style={{ fontSize: TOKENS.fonts.body }}>{name}</h3>
          <p style={{ fontSize: TOKENS.fonts.small, color: colors.accent }}>{issuer}</p>
        </div>
        <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          <span style={{ fontSize: TOKENS.fonts.tiny, color: TOKENS.colors.textLight }}>{issueDate}</span>
          {mode && (
            <span 
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ 
                backgroundColor: mode === 'online' ? '#dbeafe' : '#dcfce7',
                color: mode === 'online' ? '#1d4ed8' : '#15803d',
                fontSize: TOKENS.fonts.tiny
              }}
            >
              {mode === 'online' ? '🌐' : '🏢'}
            </span>
          )}
        </div>
      </div>
      {credentialId && (
        <p style={{ fontSize: TOKENS.fonts.tiny, color: TOKENS.colors.textLight }}>ID: {credentialId}</p>
      )}
    </div>
  );
};

interface SkillsListProps {
  skills: string[];
  scheme: keyof typeof TOKENS.schemes;
  layout: 'chips' | 'bullets' | 'columns';
  compact?: boolean;
  rtl?: boolean;
}

export const SkillsList: React.FC<SkillsListProps> = ({ skills, scheme, layout, compact, rtl }) => {
  const colors = TOKENS.schemes[scheme];

  if (layout === 'chips') {
    return (
      <div className={`flex flex-wrap gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
        {skills.map((skill, i) => (
          <span 
            key={i}
            className="px-2 py-1 rounded"
            style={{ 
              backgroundColor: TOKENS.colors.background, 
              fontSize: TOKENS.fonts.small,
              color: TOKENS.colors.text
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }

  if (layout === 'columns') {
    const midpoint = Math.ceil(skills.length / 2);
    return (
      <div className={`grid grid-cols-2 gap-x-4 gap-y-1 ${rtl ? 'text-right' : ''}`}>
        {skills.map((skill, i) => (
          <span 
            key={i}
            className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}
            style={{ fontSize: TOKENS.fonts.small, color: TOKENS.colors.text }}
          >
            <span style={{ color: colors.accent }}>•</span> {skill}
          </span>
        ))}
      </div>
    );
  }

  // bullets
  return (
    <ul className={`space-y-1 ${rtl ? 'text-right' : ''}`}>
      {skills.map((skill, i) => (
        <li 
          key={i}
          className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}
          style={{ fontSize: TOKENS.fonts.small, color: TOKENS.colors.text }}
        >
          <span style={{ color: colors.accent }}>•</span>
          <span>{skill}</span>
        </li>
      ))}
    </ul>
  );
};

interface LanguagesListProps {
  languages: { name: string; level: string }[];
  scheme: keyof typeof TOKENS.schemes;
  layout: 'bars' | 'text' | 'inline';
  rtl?: boolean;
}

export const LanguagesList: React.FC<LanguagesListProps> = ({ languages, scheme, layout, rtl }) => {
  const colors = TOKENS.schemes[scheme];

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
            <div className={`flex justify-between text-sm ${rtl ? 'flex-row-reverse' : ''}`}>
              <span style={{ fontSize: TOKENS.fonts.small }}>{lang.name}</span>
              <span style={{ fontSize: TOKENS.fonts.tiny, color: TOKENS.colors.textLight }}>{lang.level}</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full mt-1">
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
      <p style={{ fontSize: TOKENS.fonts.small, color: TOKENS.colors.text }}>
        {languages.map((l, i) => (
          <span key={i}>
            <strong>{l.name}</strong>: {l.level}
            {i < languages.length - 1 ? ' • ' : ''}
          </span>
        ))}
      </p>
    );
  }

  // text
  return (
    <div className="space-y-1">
      {languages.map((lang, i) => (
        <div key={i} className={`flex justify-between ${rtl ? 'flex-row-reverse' : ''}`} style={{ fontSize: TOKENS.fonts.small }}>
          <span>{lang.name}</span>
          <span style={{ color: TOKENS.colors.textLight }}>{lang.level}</span>
        </div>
      ))}
    </div>
  );
};

// Two column layout wrapper
interface TwoColumnLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  sidebarWidth?: string;
  sidebarPosition?: 'left' | 'right';
  sidebarBg?: string;
  rtl?: boolean;
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  sidebar, main, sidebarWidth = '33%', sidebarPosition = 'left', sidebarBg, rtl
}) => {
  const sidebarEl = (
    <aside 
      className="p-6"
      style={{ width: sidebarWidth, backgroundColor: sidebarBg || TOKENS.colors.background }}
    >
      {sidebar}
    </aside>
  );

  const mainEl = (
    <main className="flex-1 p-6">
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
