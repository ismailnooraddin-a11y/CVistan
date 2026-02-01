// src/templates/index.tsx
// 4 Professional CV Templates - Morgan, Catrine, Sarah, Olivia

'use client';

import React from 'react';
import { CVData } from '@/lib/types';

interface TemplateProps {
  data: CVData;
  rtl: boolean;
  t: (key: string) => string | string[];
}

// Format date helper
const fmtDate = (m: string, y: string, cur: boolean, pres: string, mos: string[]): string => {
  if (cur) return pres;
  if (!y) return '';
  if (m && mos[parseInt(m) - 1]) return `${mos[parseInt(m) - 1]} ${y}`;
  return y;
};

// Sort by year (newest first)
const sortByYear = <T extends { startYear?: string; gradYear?: string; issueYear?: string }>(
  items: T[], 
  field: 'startYear' | 'gradYear' | 'issueYear'
): T[] => {
  return [...items].sort((a, b) => {
    const yearA = parseInt((a as any)[field]) || 0;
    const yearB = parseInt((b as any)[field]) || 0;
    return yearB - yearA;
  });
};

// TEMPLATE 1: MORGAN - Bold header with elegant sidebar
export function MorganTemplate({ data: d, rtl, t }: TemplateProps) {
  const mos = t('months') as string[];
  const pres = t('present') as string;
  const sortedExp = sortByYear(d.experience, 'startYear');
  const sortedEdu = sortByYear(d.education, 'gradYear');
  const sortedCert = sortByYear(d.certifications, 'issueYear');

  return (
    <div className={`bg-white min-h-full ${rtl ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="bg-black text-white p-8">
        <div className={`flex items-center gap-6 ${rtl ? 'flex-row-reverse' : ''}`}>
          {d.personal.photo && (
            <img src={d.personal.photo} className="w-24 h-24 object-cover border-4 border-white" alt="" />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-wide uppercase">{d.personal.fullName || 'YOUR NAME'}</h1>
            <p className="text-gray-300 text-lg uppercase tracking-widest mt-1">{d.personal.jobTitle}</p>
          </div>
          <div className={`text-sm space-y-1 ${rtl ? 'text-left' : 'text-right'}`}>
            {d.personal.phone && <p>📱 {d.personal.phone}</p>}
            {d.personal.email && <p>✉️ {d.personal.email}</p>}
            {d.personal.location && <p>📍 {d.personal.location}</p>}
          </div>
        </div>
      </div>

      <div className={`flex ${rtl ? 'flex-row-reverse' : ''}`}>
        {/* Sidebar */}
        <div className="w-1/3 bg-gray-50 p-6 min-h-full border-r-4 border-purple-600">
          {/* Languages */}
          {d.languages.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold uppercase text-sm tracking-wider mb-3 border-b-2 border-gray-300 pb-1">Language</h3>
              {d.languages.map((l, i) => (
                <div key={i} className={`flex justify-between text-sm mb-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <span>{l.name}</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <div key={n} className={`w-3 h-1 rounded ${n <= (l.level.toLowerCase().includes('native') ? 5 : l.level.toLowerCase().includes('fluent') ? 4 : 3) ? 'bg-gray-800' : 'bg-gray-300'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {d.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold uppercase text-sm tracking-wider mb-3 border-b-2 border-gray-300 pb-1">Expertise</h3>
              {d.skills.map((s, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm mb-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <span className="text-purple-600">•</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}

          {/* Reference placeholder */}
          <div>
            <h3 className="font-bold uppercase text-sm tracking-wider mb-3 border-b-2 border-gray-300 pb-1">Reference</h3>
            <p className="text-sm text-gray-600 italic">Available upon request</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* About Me */}
          {d.summary && (
            <section className="mb-6">
              <h2 className="font-bold uppercase text-lg tracking-wider mb-3 border-b-2 border-gray-300 pb-1">About Me</h2>
              <p className="text-gray-700 text-sm leading-relaxed text-justify">{d.summary}</p>
            </section>
          )}

          {/* Experience */}
          {sortedExp.length > 0 && (
            <section className="mb-6">
              <h2 className="font-bold uppercase text-lg tracking-wider mb-3 border-b-2 border-gray-300 pb-1">Experience</h2>
              {sortedExp.map((e, i) => (
                <div key={i} className="mb-4">
                  <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <p className="font-bold">{e.company}</p>
                      <p className="text-sm text-gray-600 italic">{e.jobTitle}</p>
                    </div>
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {fmtDate(e.startMonth, e.startYear, false, '', mos)} - {fmtDate(e.endMonth, e.endYear, e.current, pres, mos)}
                    </span>
                  </div>
                  {e.description && <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{e.description}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {sortedEdu.length > 0 && (
            <section className="mb-6">
              <h2 className="font-bold uppercase text-lg tracking-wider mb-3 border-b-2 border-gray-300 pb-1">Education</h2>
              {sortedEdu.map((e, i) => (
                <div key={i} className="mb-3">
                  <div className={`flex gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
                    <span className="font-bold text-sm">{e.gradYear}</span>
                    <div>
                      <p className="text-sm text-gray-600 italic">{e.institution}</p>
                      <p className="font-semibold">{e.degree}</p>
                      {e.gpa && <p className="text-xs text-gray-500">GPA: {e.gpa}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {sortedCert.length > 0 && (
            <section>
              <h2 className="font-bold uppercase text-lg tracking-wider mb-3 border-b-2 border-gray-300 pb-1">Certifications</h2>
              {sortedCert.map((c, i) => (
                <div key={i} className="mb-3">
                  <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-gray-600">{c.issuer}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">{fmtDate(c.issueMonth, c.issueYear, false, '', mos)}</span>
                      {c.mode && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${c.mode === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {c.mode === 'online' ? '🌐 Online' : '🏢 In-Person'}
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

// TEMPLATE 2: CATRINE - Photo-focused professional layout
export function CatrineTemplate({ data: d, rtl, t }: TemplateProps) {
  const mos = t('months') as string[];
  const pres = t('present') as string;
  const sortedExp = sortByYear(d.experience, 'startYear');
  const sortedEdu = sortByYear(d.education, 'gradYear');
  const sortedCert = sortByYear(d.certifications, 'issueYear');

  return (
    <div className={`bg-white min-h-full ${rtl ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Calibri, sans-serif' }}>
      <div className={`flex ${rtl ? 'flex-row-reverse' : ''}`}>
        {/* Left Sidebar - Olive/Green */}
        <div className="w-1/3 bg-[#8B9A7D] text-white p-6 min-h-full">
          {/* Photo */}
          <div className="mb-6">
            {d.personal.photo ? (
              <img src={d.personal.photo} className="w-full aspect-square object-cover border-4 border-white/30" alt="" />
            ) : (
              <div className="w-full aspect-square bg-white/20 flex items-center justify-center text-6xl">
                {d.personal.fullName?.charAt(0) || '?'}
              </div>
            )}
          </div>

          {/* Profile */}
          {d.summary && (
            <div className="mb-6">
              <h3 className="font-bold uppercase text-sm tracking-wider mb-3 border-b border-white/30 pb-1">Profile</h3>
              <p className="text-sm leading-relaxed opacity-90 text-justify">{d.summary}</p>
            </div>
          )}

          {/* Skills */}
          {d.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold uppercase text-sm tracking-wider mb-3 border-b border-white/30 pb-1">Skills</h3>
              {d.skills.map((s, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm mb-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <span>•</span>
                  <span className="opacity-90">{s}</span>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {d.languages.length > 0 && (
            <div>
              <h3 className="font-bold uppercase text-sm tracking-wider mb-3 border-b border-white/30 pb-1">Languages</h3>
              {d.languages.map((l, i) => (
                <div key={i} className="text-sm mb-1 opacity-90">{l.name} - {l.level}</div>
              ))}
            </div>
          )}
        </div>

        {/* Right Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-[#F5F5F0] p-8">
            <h1 className="text-4xl font-light text-gray-800">{d.personal.fullName || 'Your Name'}</h1>
            <p className="text-lg text-[#8B9A7D] uppercase tracking-widest mt-1">{d.personal.jobTitle}</p>
          </div>

          {/* Contact Bar */}
          <div className={`bg-gray-100 px-8 py-3 flex gap-6 text-xs text-gray-600 ${rtl ? 'flex-row-reverse' : ''}`}>
            {d.personal.phone && <span>📱 {d.personal.phone}</span>}
            {d.personal.email && <span>✉️ {d.personal.email}</span>}
            {d.personal.location && <span>📍 {d.personal.location}</span>}
          </div>

          <div className="p-8">
            {/* Experience */}
            {sortedExp.length > 0 && (
              <section className="mb-8">
                <h2 className="font-bold uppercase tracking-wider text-lg mb-4 text-gray-800">Work Experience</h2>
                {sortedExp.map((e, i) => (
                  <div key={i} className="mb-5">
                    <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                      <div>
                        <p className="font-bold text-gray-800">{e.jobTitle}</p>
                        <p className="text-[#8B9A7D] text-sm">{e.company} | {fmtDate(e.startMonth, e.startYear, false, '', mos)} - {fmtDate(e.endMonth, e.endYear, e.current, pres, mos)}</p>
                      </div>
                    </div>
                    {e.description && <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{e.description}</p>}
                  </div>
                ))}
              </section>
            )}

            {/* Education */}
            {sortedEdu.length > 0 && (
              <section className="mb-8">
                <h2 className="font-bold uppercase tracking-wider text-lg mb-4 text-gray-800">Educational History</h2>
                {sortedEdu.map((e, i) => (
                  <div key={i} className="mb-4">
                    <p className="font-bold text-gray-800">{e.institution}</p>
                    <p className="text-[#8B9A7D] text-sm">{e.degree} | {e.gradMonth && mos[parseInt(e.gradMonth) - 1]} {e.gradYear}</p>
                    {e.gpa && <p className="text-xs text-gray-500">GPA: {e.gpa}</p>}
                    {e.thesisTitle && <p className="text-xs text-gray-500 italic">Thesis: {e.thesisTitle}</p>}
                  </div>
                ))}
              </section>
            )}

            {/* Certifications */}
            {sortedCert.length > 0 && (
              <section>
                <h2 className="font-bold uppercase tracking-wider text-lg mb-4 text-gray-800">Certifications</h2>
                {sortedCert.map((c, i) => (
                  <div key={i} className="mb-3">
                    <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{c.name}</p>
                        <p className="text-xs text-[#8B9A7D]">{c.issuer}</p>
                      </div>
                      <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs text-gray-500">{fmtDate(c.issueMonth, c.issueYear, false, '', mos)}</span>
                        {c.mode && (
                          <span className={`text-xs px-2 py-0.5 rounded ${c.mode === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                            {c.mode === 'online' ? 'Online' : 'In-Person'}
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
    </div>
  );
}

// TEMPLATE 3: SARAH - Clean two-column minimal design
export function SarahTemplate({ data: d, rtl, t }: TemplateProps) {
  const mos = t('months') as string[];
  const pres = t('present') as string;
  const sortedExp = sortByYear(d.experience, 'startYear');
  const sortedEdu = sortByYear(d.education, 'gradYear');
  const sortedCert = sortByYear(d.certifications, 'issueYear');

  return (
    <div className={`bg-white min-h-full p-8 ${rtl ? 'text-right' : 'text-left'}`} style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Header */}
      <header className="text-center mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-4xl font-light tracking-widest text-gray-800 uppercase">{d.personal.fullName || 'YOUR NAME'}</h1>
        <p className="text-sm tracking-[0.3em] text-[#D4A574] uppercase mt-2">{d.personal.jobTitle}</p>
      </header>

      <div className={`flex gap-8 ${rtl ? 'flex-row-reverse' : ''}`}>
        {/* Left Column */}
        <div className="w-1/3 space-y-6">
          {/* Contact */}
          <section>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Contact</h3>
            <div className="space-y-2 text-sm">
              {d.personal.phone && <p className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}><span>📱</span> {d.personal.phone}</p>}
              {d.personal.email && <p className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}><span>✉️</span> {d.personal.email}</p>}
              {d.personal.location && <p className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}><span>📍</span> {d.personal.location}</p>}
            </div>
          </section>

          {/* Education */}
          {sortedEdu.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Education</h3>
              {sortedEdu.map((e, i) => (
                <div key={i} className="mb-4">
                  <p className="font-bold text-sm text-[#D4A574] uppercase">{e.institution}</p>
                  <p className="font-bold text-sm">{e.degree}</p>
                  <p className="text-xs text-gray-500">{e.gradYear}</p>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {d.skills.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Skills</h3>
              {d.skills.map((s, i) => (
                <p key={i} className="text-sm mb-1">{s}</p>
              ))}
            </section>
          )}

          {/* Languages */}
          {d.languages.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Languages</h3>
              {d.languages.map((l, i) => (
                <p key={i} className="text-sm mb-1">{l.name} - {l.level}</p>
              ))}
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-6">
          {/* Summary */}
          {d.summary && (
            <section>
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Summary</h3>
              <p className="text-sm text-gray-700 leading-relaxed text-justify">{d.summary}</p>
            </section>
          )}

          {/* Experience */}
          {sortedExp.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Experience</h3>
              {sortedExp.map((e, i) => (
                <div key={i} className="mb-5">
                  <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <p className="font-bold text-sm uppercase text-[#D4A574]">{e.jobTitle}</p>
                      <p className="text-sm italic text-gray-600">{e.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {fmtDate(e.startMonth, e.startYear, false, '', mos)} - {fmtDate(e.endMonth, e.endYear, e.current, pres, mos)}
                    </span>
                  </div>
                  {e.description && <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{e.description}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {sortedCert.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Certifications</h3>
              {sortedCert.map((c, i) => (
                <div key={i} className="mb-3">
                  <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <p className="font-bold text-sm">{c.name}</p>
                      <p className="text-xs text-gray-600">{c.issuer}</p>
                    </div>
                    <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs text-gray-500">{fmtDate(c.issueMonth, c.issueYear, false, '', mos)}</span>
                      {c.mode && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${c.mode === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
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

// TEMPLATE 4: OLIVIA - Modern with color accents
export function OliviaTemplate({ data: d, rtl, t }: TemplateProps) {
  const mos = t('months') as string[];
  const pres = t('present') as string;
  const sortedExp = sortByYear(d.experience, 'startYear');
  const sortedEdu = sortByYear(d.education, 'gradYear');
  const sortedCert = sortByYear(d.certifications, 'issueYear');

  return (
    <div className={`bg-white min-h-full ${rtl ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-[#2D3748] text-white p-6">
        <div className={`flex items-center gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              <span className="text-white">{d.personal.fullName?.split(' ')[0] || 'FIRST'}</span>
              {' '}
              <span className="font-light">{d.personal.fullName?.split(' ').slice(1).join(' ') || 'LAST'}</span>
            </h1>
            <p className="text-[#E67E22] text-sm mt-1">{d.personal.jobTitle}</p>
          </div>
          <div className={`text-xs space-y-1 ${rtl ? 'text-left' : 'text-right'}`}>
            {d.personal.location && <p>📍 {d.personal.location}</p>}
            {d.personal.phone && <p>📱 {d.personal.phone}</p>}
            {d.personal.email && <p>✉️ {d.personal.email}</p>}
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      {d.summary && (
        <div className="bg-gray-100 px-6 py-4 border-b">
          <p className="text-sm text-gray-700 text-justify">{d.summary}</p>
        </div>
      )}

      <div className="p-6">
        {/* Experience */}
        {sortedExp.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[#E67E22] font-bold uppercase text-sm tracking-wider mb-4 pb-1 border-b-2 border-[#E67E22]">
              Work Experience
            </h2>
            {sortedExp.map((e, i) => (
              <div key={i} className="mb-5">
                <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="font-bold text-gray-800">
                      ▸ {e.jobTitle} <span className="font-normal text-gray-600">| {e.company}</span>
                    </p>
                  </div>
                  <span className="text-xs text-[#E67E22] whitespace-nowrap font-medium">
                    {fmtDate(e.startMonth, e.startYear, false, '', mos)} - {fmtDate(e.endMonth, e.endYear, e.current, pres, mos)}
                  </span>
                </div>
                {e.description && <p className="text-sm text-gray-600 mt-2 ml-4 whitespace-pre-line">{e.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Skills Section - Two Columns */}
        {d.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[#E67E22] font-bold uppercase text-sm tracking-wider mb-4 pb-1 border-b-2 border-[#E67E22]">
              Skills
            </h2>
            <div className={`grid grid-cols-2 gap-x-8 gap-y-1 ${rtl ? 'text-right' : 'text-left'}`}>
              {d.skills.map((s, i) => (
                <p key={i} className={`text-sm flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[#E67E22]">•</span> {s}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {sortedEdu.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[#E67E22] font-bold uppercase text-sm tracking-wider mb-4 pb-1 border-b-2 border-[#E67E22]">
              Education
            </h2>
            {sortedEdu.map((e, i) => (
              <div key={i} className="mb-3">
                <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="font-bold text-sm">{e.degree}</p>
                    <p className="text-sm text-gray-600">{e.institution}</p>
                  </div>
                  <span className="text-xs text-[#E67E22] font-medium">{e.gradYear}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {sortedCert.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[#E67E22] font-bold uppercase text-sm tracking-wider mb-4 pb-1 border-b-2 border-[#E67E22]">
              Certifications
            </h2>
            {sortedCert.map((c, i) => (
              <div key={i} className="mb-3">
                <div className={`flex justify-between items-start ${rtl ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-xs text-gray-600">{c.issuer}</p>
                  </div>
                  <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs text-[#E67E22]">{fmtDate(c.issueMonth, c.issueYear, false, '', mos)}</span>
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

        {/* Languages & Other */}
        {d.languages.length > 0 && (
          <section>
            <h2 className="text-[#E67E22] font-bold uppercase text-sm tracking-wider mb-4 pb-1 border-b-2 border-[#E67E22]">
              Languages
            </h2>
            <div className={`flex gap-6 ${rtl ? 'flex-row-reverse' : ''}`}>
              {d.languages.map((l, i) => (
                <span key={i} className="text-sm">
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

// TEMPLATE REGISTRY
export const TEMPLATES = {
  morgan: { component: MorganTemplate, icon: '📋', gradient: 'from-gray-800 to-purple-600' },
  catrine: { component: CatrineTemplate, icon: '📸', gradient: 'from-[#8B9A7D] to-[#6B7A5D]' },
  sarah: { component: SarahTemplate, icon: '✨', gradient: 'from-[#D4A574] to-[#B8956A]' },
  olivia: { component: OliviaTemplate, icon: '🔥', gradient: 'from-[#2D3748] to-[#E67E22]' },
} as const;

export type TemplateKey = keyof typeof TEMPLATES;
