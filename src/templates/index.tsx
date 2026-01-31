// src/templates/index.tsx
// 8 Professional CV Templates

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

// Social links display helper
const SocialLinks = ({ links, rtl }: { links: CVData['personal']['socialLinks']; rtl: boolean }) => {
  const activeLinks = Object.entries(links).filter(([_, v]) => v);
  if (activeLinks.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 mt-2 ${rtl ? 'flex-row-reverse' : ''}`}>
      {activeLinks.map(([key, value]) => (
        <span key={key} className="text-xs text-gray-500">🔗 {value}</span>
      ))}
    </div>
  );
};

// TEMPLATE 1: CLASSIC
export function ClassicTemplate({ data: d, rtl, t }: TemplateProps) {
  const mos = t('months') as string[];
  const pres = t('present') as string;
  return (
    <div className={`bg-white p-8 min-h-full ${rtl?'text-right':''}`} style={{fontFamily:rtl?'Tajawal':'Georgia'}}>
      <header className="border-b-2 border-gray-800 pb-4 mb-6">
        <div className={`flex gap-4 ${rtl?'flex-row-reverse':''}`}>
          {d.personal.photo && <img src={d.personal.photo} className="w-20 h-20 rounded-full object-cover"/>}
          <div><h1 className="text-3xl font-bold">{d.personal.fullName||'Your Name'}</h1><p className="text-xl text-gray-600">{d.personal.jobTitle}</p>
          <div className={`flex flex-wrap gap-4 mt-2 text-sm text-gray-500 ${rtl?'flex-row-reverse':''}`}>
            {d.personal.email&&<span>✉ {d.personal.email}</span>}{d.personal.phone&&<span>📱 {d.personal.phone}</span>}{d.personal.location&&<span>📍 {d.personal.location}</span>}
          </div>
          <SocialLinks links={d.personal.socialLinks} rtl={rtl} />
          </div>
        </div>
      </header>
      {d.summary&&<section className="mb-6"><h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-2">Summary</h2><p className="text-gray-700 whitespace-pre-line">{d.summary}</p></section>}
      {d.experience.length>0&&<section className="mb-6"><h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-2">Experience</h2>
        {d.experience.map((e,i)=><div key={i} className="mb-4"><div className={`flex justify-between ${rtl?'flex-row-reverse':''}`}><div><h3 className="font-bold">{e.jobTitle}</h3><p className="text-gray-600">{e.company}</p></div><span className="text-sm text-gray-500">{fmtDate(e.startMonth,e.startYear,false,'',mos)} - {fmtDate(e.endMonth,e.endYear,e.current,pres,mos)}</span></div>{e.description&&<p className="text-gray-600 mt-2 text-sm whitespace-pre-line">{e.description}</p>}</div>)}
      </section>}
      {d.education.length>0&&<section className="mb-6"><h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-2">Education</h2>
        {d.education.map((e,i)=><div key={i} className="mb-3"><h3 className="font-bold">{e.degree}</h3><p className="text-gray-600">{e.institution}{e.gpa&&` • GPA: ${e.gpa}`}</p></div>)}
      </section>}
      {d.skills.length>0&&<section className="mb-6"><h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-2">Skills</h2><div className={`flex flex-wrap gap-2 ${rtl?'flex-row-reverse':''}`}>{d.skills.map((s,i)=><span key={i} className="px-3 py-1 bg-gray-100 rounded text-sm">{s}</span>)}</div></section>}
      {d.languages.length>0&&<section><h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-2">Languages</h2>{d.languages.map((l,i)=><div key={i} className={`flex justify-between ${rtl?'flex-row-reverse':''}`}><span>{l.name}</span><span className="text-gray-500">{l.level}</span></div>)}</section>}
    </div>
  );
}

// TEMPLATE 2: MODERN
export function ModernTemplate({ data: d, rtl, t }: TemplateProps) {
  const mos = t('months') as string[];
  const pres = t('present') as string;
  const activeLinks = Object.entries(d.personal.socialLinks).filter(([_, v]) => v);
  return (
    <div className={`bg-white min-h-full ${rtl?'text-right':''}`}>
      <header className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-8">
        <div className={`flex gap-5 ${rtl?'flex-row-reverse':''}`}>
          {d.personal.photo&&<img src={d.personal.photo} className="w-24 h-24 rounded-2xl object-cover border-2 border-white/30"/>}
          <div><h1 className="text-3xl font-bold">{d.personal.fullName||'Your Name'}</h1><p className="text-blue-100 text-lg">{d.personal.jobTitle}</p>
          <div className={`flex flex-wrap gap-3 mt-3 text-sm ${rtl?'flex-row-reverse':''}`}>{d.personal.email&&<span className="bg-white/20 px-3 py-1 rounded-full">{d.personal.email}</span>}{d.personal.phone&&<span className="bg-white/20 px-3 py-1 rounded-full">{d.personal.phone}</span>}</div></div>
        </div>
      </header>
      <div className="p-8 grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          {d.summary&&<section><h2 className="text-sm font-bold text-blue-600 uppercase mb-2">About</h2><p className="text-gray-600">{d.summary}</p></section>}
          {d.experience.length>0&&<section><h2 className="text-sm font-bold text-blue-600 uppercase mb-3">Experience</h2>{d.experience.map((e,i)=><div key={i} className={`mb-4 ${rtl?'pr-4 border-r-2':'pl-4 border-l-2'} border-blue-200`}><h3 className="font-bold">{e.jobTitle}</h3><p className="text-blue-600 text-sm">{e.company}</p><p className="text-gray-400 text-xs">{fmtDate(e.startMonth,e.startYear,false,'',mos)} - {fmtDate(e.endMonth,e.endYear,e.current,pres,mos)}</p>{e.description&&<p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{e.description}</p>}</div>)}</section>}
          {d.education.length>0&&<section><h2 className="text-sm font-bold text-blue-600 uppercase mb-3">Education</h2>{d.education.map((e,i)=><div key={i} className="mb-3"><h3 className="font-bold">{e.degree}</h3><p className="text-blue-600 text-sm">{e.institution}</p></div>)}</section>}
        </div>
        <div className="space-y-6">
          {d.personal.location&&<section className="bg-gray-50 rounded-xl p-4"><h2 className="text-sm font-bold text-blue-600 uppercase mb-2">Contact</h2><p className="text-gray-600 text-sm">📍 {d.personal.location}</p>{activeLinks.map(([key, value]) => <p key={key} className="text-gray-600 text-sm">🔗 {value}</p>)}</section>}
          {d.skills.length>0&&<section><h2 className="text-sm font-bold text-blue-600 uppercase mb-2">Skills</h2><div className={`flex flex-wrap gap-1 ${rtl?'flex-row-reverse':''}`}>{d.skills.map((s,i)=><span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{s}</span>)}</div></section>}
          {d.languages.length>0&&<section><h2 className="text-sm font-bold text-blue-600 uppercase mb-2">Languages</h2>{d.languages.map((l,i)=><div key={i} className={`flex justify-between text-sm ${rtl?'flex-row-reverse':''}`}><span>{l.name}</span><span className="text-gray-400">{l.level}</span></div>)}</section>}
        </div>
      </div>
    </div>
  );
}

// TEMPLATE 3: EXECUTIVE
export function ExecutiveTemplate({ data: d, rtl, t }: TemplateProps) {
  const mos = t('months') as string[];
  const pres = t('present') as string;
  const activeLinks = Object.entries(d.personal.socialLinks).filter(([_, v]) => v);
  return (
    <div className={`bg-white min-h-full flex ${rtl?'flex-row-reverse':''}`}>
      <aside className="w-1/3 bg-slate-900 text-white p-6">
        <div className="text-center mb-6">{d.personal.photo?<img src={d.personal.photo} className="w-24 h-24 rounded-full mx-auto border-4 border-amber-500 object-cover"/>:<div className="w-24 h-24 rounded-full bg-slate-700 mx-auto flex items-center justify-center text-4xl font-bold text-amber-500">{d.personal.fullName?.charAt(0)||'?'}</div>}<h1 className="font-bold text-xl mt-4">{d.personal.fullName||'Your Name'}</h1><p className="text-amber-400 text-sm">{d.personal.jobTitle}</p></div>
        <div className="space-y-2 text-sm mb-6">{d.personal.email&&<div className={`flex items-center gap-2 ${rtl?'flex-row-reverse':''}`}><span className="text-amber-500">✉</span><span className="text-slate-300 break-all text-xs">{d.personal.email}</span></div>}{d.personal.phone&&<div className={`flex items-center gap-2 ${rtl?'flex-row-reverse':''}`}><span className="text-amber-500">☎</span><span className="text-slate-300">{d.personal.phone}</span></div>}{d.personal.location&&<div className={`flex items-center gap-2 ${rtl?'flex-row-reverse':''}`}><span className="text-amber-500">📍</span><span className="text-slate-300">{d.personal.location}</span></div>}{activeLinks.map(([key, value]) => <div key={key} className={`flex items-center gap-2 ${rtl?'flex-row-reverse':''}`}><span className="text-amber-500">🔗</span><span className="text-slate-300 break-all text-xs">{value}</span></div>)}</div>
        {d.skills.length>0&&<div className="mb-6"><h3 className="text-amber-500 font-bold uppercase text-xs mb-3">Expertise</h3>{d.skills.slice(0,10).map((s,i)=><div key={i} className={`flex items-center gap-2 text-slate-300 text-sm mb-1 ${rtl?'flex-row-reverse':''}`}><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>{s}</div>)}</div>}
        {d.languages.length>0&&<div><h3 className="text-amber-500 font-bold uppercase text-xs mb-3">Languages</h3>{d.languages.map((l,i)=><div key={i} className={`flex justify-between text-sm mb-1 ${rtl?'flex-row-reverse':''}`}><span className="text-slate-300">{l.name}</span><span className="text-slate-500">{l.level}</span></div>)}</div>}
      </aside>
      <main className="flex-1 p-8">
        {d.summary&&<section className="mb-6"><h2 className="font-bold uppercase border-b-2 border-amber-500 pb-1 mb-3 text-sm">Profile</h2><p className="text-slate-600">{d.summary}</p></section>}
        {d.experience.length>0&&<section className="mb-6"><h2 className="font-bold uppercase border-b-2 border-amber-500 pb-1 mb-3 text-sm">Experience</h2>{d.experience.map((e,i)=><div key={i} className="mb-5"><div className={`flex justify-between ${rtl?'flex-row-reverse':''}`}><h3 className="font-bold">{e.jobTitle}</h3><span className="text-xs text-slate-400">{fmtDate(e.startMonth,e.startYear,false,'',mos)} - {fmtDate(e.endMonth,e.endYear,e.current,pres,mos)}</span></div><p className="text-amber-600 text-sm">{e.company}</p>{e.description&&<p className="text-slate-500 text-sm mt-2 whitespace-pre-line">{e.description}</p>}</div>)}</section>}
        {d.education.length>0&&<section><h2 className="font-bold uppercase border-b-2 border-amber-500 pb-1 mb-3 text-sm">Education</h2>{d.education.map((e,i)=><div key={i} className="mb-3"><h3 className="font-bold">{e.degree}</h3><p className="text-amber-600 text-sm">{e.institution}{e.gradYear&&` • ${e.gradYear}`}</p></div>)}</section>}
      </main>
    </div>
  );
}

// TEMPLATE 4: CREATIVE
export function CreativeTemplate({ data: d, rtl, t }: TemplateProps) {
  const mos = t('months') as string[];
  const pres = t('present') as string;
  return (
    <div className={`bg-gradient-to-br from-violet-50 via-white to-pink-50 min-h-full flex ${rtl?'flex-row-reverse':''}`}>
      <aside className="w-1/3 bg-gradient-to-b from-violet-600 to-pink-600 text-white p-6 relative overflow-hidden">
        <div className="absolute top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="relative z-10">
          <div className="text-center mb-6">{d.personal.photo?<img src={d.personal.photo} className="w-28 h-28 rounded-2xl mx-auto border-2 border-white/30 object-cover"/>:<div className="w-28 h-28 rounded-2xl bg-white/20 mx-auto flex items-center justify-center text-4xl font-bold">{d.personal.fullName?.charAt(0)||'?'}</div>}</div>
          <div className="space-y-2 text-sm mb-8">{d.personal.email&&<div className={`flex items-center gap-2 ${rtl?'flex-row-reverse':''}`}><span className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs">✉</span><span className="break-all text-xs">{d.personal.email}</span></div>}{d.personal.phone&&<div className={`flex items-center gap-2 ${rtl?'flex-row-reverse':''}`}><span className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs">☎</span><span>{d.personal.phone}</span></div>}</div>
          {d.skills.length>0&&<div className="mb-6"><h3 className="text-white/70 font-bold uppercase text-xs mb-3">Skills</h3><div className={`flex flex-wrap gap-1 ${rtl?'flex-row-reverse':''}`}>{d.skills.slice(0,8).map((s,i)=><span key={i} className="px-2 py-1 bg-white/20 rounded-full text-xs">{s}</span>)}</div></div>}
          {d.languages.length>0&&<div><h3 className="text-white/70 font-bold uppercase text-xs mb-3">Languages</h3>{d.languages.map((l,i)=><div key={i} className="mb-2"><span className="text-sm">{l.name}</span><div className="h-1.5 bg-white/20 rounded-full mt-1"><div className="h-full bg-white/70 rounded-full" style={{width:l.level.toLowerCase().includes('native')?'100%':l.level.toLowerCase().includes('fluent')?'85%':'60%'}}></div></div></div>)}</div>}
        </div>
      </aside>
      <main className="flex-1 p-8">
        <header className="mb-8"><h1 className="text-4xl font-bold text-gray-900">{d.personal.fullName||'Your Name'}</h1><p className="text-xl text-violet-600">{d.personal.jobTitle}</p></header>
        {d.summary&&<section className="mb-8"><h2 className="text-sm font-bold text-violet-600 uppercase mb-2">About Me</h2><p className="text-gray-600">{d.summary}</p></section>}
        {d.experience.length>0&&<section className="mb-8"><h2 className="text-sm font-bold text-violet-600 uppercase mb-3">Experience</h2>{d.experience.map((e,i)=><div key={i} className="mb-4"><div className={`flex items-center gap-2 ${rtl?'flex-row-reverse':''}`}><span className="text-pink-500">→</span><h3 className="font-bold">{e.jobTitle}</h3></div><p className="text-violet-600 text-sm ml-5">{e.company}</p><p className="text-gray-400 text-xs ml-5">{fmtDate(e.startMonth,e.startYear,false,'',mos)} - {fmtDate(e.endMonth,e.endYear,e.current,pres,mos)}</p></div>)}</section>}
        {d.education.length>0&&<section><h2 className="text-sm font-bold text-violet-600 uppercase mb-3">Education</h2>{d.education.map((e,i)=><div key={i} className="bg-violet-50 rounded-xl p-4 mb-3"><h3 className="font-bold">{e.degree}</h3><p className="text-violet-600 text-sm">{e.institution}</p></div>)}</section>}
      </main>
    </div>
  );
}

// TEMPLATE 5: MINIMAL
export function MinimalTemplate({ data: d, rtl, t }: TemplateProps) {
  const mos = t('months') as string[];
  const pres = t('present') as string;
  return (
    <div className={`bg-white p-10 min-h-full ${rtl?'text-right':''}`}>
      <header className="mb-10"><h1 className="text-4xl font-light text-gray-900">{d.personal.fullName||'Your Name'}</h1><p className="text-lg text-gray-500">{d.personal.jobTitle}</p><div className={`flex gap-6 mt-4 text-sm text-gray-400 ${rtl?'flex-row-reverse':''}`}>{d.personal.email&&<span>{d.personal.email}</span>}{d.personal.phone&&<span>{d.personal.phone}</span>}</div></header>
      {d.summary&&<section className="mb-10"><p className="text-gray-600 leading-relaxed text-lg">{d.summary}</p></section>}
      {d.experience.length>0&&<section className="mb-10"><h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Experience</h2>{d.experience.map((e,i)=><div key={i} className="mb-6"><div className={`flex justify-between ${rtl?'flex-row-reverse':''}`}><h3 className="font-medium text-gray-900">{e.jobTitle}</h3><span className="text-sm text-gray-400">{fmtDate(e.startMonth,e.startYear,false,'',mos)} — {fmtDate(e.endMonth,e.endYear,e.current,pres,mos)}</span></div><p className="text-gray-500">{e.company}</p></div>)}</section>}
      {d.education.length>0&&<section className="mb-10"><h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Education</h2>{d.education.map((e,i)=><div key={i} className="mb-4"><h3 className="font-medium text-gray-900">{e.degree}</h3><p className="text-gray-500">{e.institution}</p></div>)}</section>}
      {d.skills.length>0&&<section className="mb-10"><h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Skills</h2><p className="text-gray-600">{d.skills.join(' · ')}</p></section>}
      {d.languages.length>0&&<section><h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Languages</h2><p className="text-gray-600">{d.languages.map(l=>`${l.name} (${l.level})`).join(' · ')}</p></section>}
    </div>
  );
}

// TEMPLATE 6: TECH
export function TechTemplate({ data: d, rtl, t }: TemplateProps) {
  const mos = t('months') as string[];
  const pres = t('present') as string;
  const activeLinks = Object.entries(d.personal.socialLinks).filter(([_, v]) => v);
  return (
    <div className={`bg-gray-900 text-white p-8 min-h-full ${rtl?'text-right':''}`}>
      <header className="mb-8"><div className={`flex items-center gap-6 ${rtl?'flex-row-reverse':''}`}>{d.personal.photo&&<img src={d.personal.photo} className="w-24 h-24 rounded-xl object-cover border-2 border-cyan-500"/>}<div><h1 className="text-3xl font-bold text-cyan-400">{d.personal.fullName||'Your Name'}</h1><p className="text-gray-400 text-lg">{d.personal.jobTitle}</p><div className={`flex flex-wrap gap-4 mt-2 text-sm text-gray-500 ${rtl?'flex-row-reverse':''}`}>{d.personal.email&&<span>{d.personal.email}</span>}{activeLinks.map(([key, value]) => <span key={key}>{value}</span>)}</div></div></div></header>
      {d.skills.length>0&&<section className="mb-8"><div className={`flex flex-wrap gap-2 ${rtl?'flex-row-reverse':''}`}>{d.skills.map((s,i)=><span key={i} className="px-3 py-1.5 bg-cyan-900/50 text-cyan-400 rounded border border-cyan-800 text-sm">{s}</span>)}</div></section>}
      {d.summary&&<section className="mb-8 border-l-2 border-cyan-500 pl-4"><p className="text-gray-300">{d.summary}</p></section>}
      {d.experience.length>0&&<section className="mb-8"><h2 className="text-cyan-400 uppercase text-sm mb-4">Experience</h2>{d.experience.map((e,i)=><div key={i} className="mb-5 bg-gray-800 rounded-lg p-4"><div className={`flex justify-between ${rtl?'flex-row-reverse':''}`}><h3 className="font-bold text-white">{e.jobTitle}</h3><span className="text-gray-500 text-xs bg-gray-700 px-2 py-1 rounded">{fmtDate(e.startMonth,e.startYear,false,'',mos)} - {fmtDate(e.endMonth,e.endYear,e.current,pres,mos)}</span></div><p className="text-cyan-500 text-sm">{e.company}</p>{e.description&&<p className="text-gray-400 text-sm mt-2 whitespace-pre-line">{e.description}</p>}</div>)}</section>}
      {d.education.length>0&&<section className="mb-8"><h2 className="text-cyan-400 uppercase text-sm mb-4">Education</h2>{d.education.map((e,i)=><div key={i} className="mb-3"><h3 className="font-bold text-white">{e.degree}</h3><p className="text-gray-400">{e.institution}</p></div>)}</section>}
      {d.languages.length>0&&<section><h2 className="text-cyan-400 uppercase text-sm mb-4">Languages</h2><div className={`flex gap-4 ${rtl?'flex-row-reverse':''}`}>{d.languages.map((l,i)=><span key={i} className="text-gray-400">{l.name} <span className="text-gray-600">({l.level})</span></span>)}</div></section>}
    </div>
  );
}

// TEMPLATE 7: ACADEMIC
export function AcademicTemplate({ data: d, rtl, t }: TemplateProps) {
  const mos = t('months') as string[];
  const pres = t('present') as string;
  return (
    <div className={`bg-white p-10 min-h-full ${rtl?'text-right':''}`} style={{fontFamily:'Times New Roman, serif'}}>
      <header className="text-center border-b-2 border-indigo-900 pb-6 mb-8"><h1 className="text-3xl font-bold text-indigo-900">{d.personal.fullName||'Your Name'}</h1><p className="text-lg text-indigo-700 italic">{d.personal.jobTitle}</p><div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">{d.personal.email&&<span>{d.personal.email}</span>}{d.personal.phone&&<span>{d.personal.phone}</span>}</div></header>
      {d.summary&&<section className="mb-8"><h2 className="font-bold text-indigo-900 uppercase mb-3">Research Interests</h2><p className="text-gray-700">{d.summary}</p></section>}
      {d.education.length>0&&<section className="mb-8"><h2 className="font-bold text-indigo-900 uppercase mb-3">Education</h2>{d.education.map((e,i)=><div key={i} className="mb-4"><h3 className="font-bold">{e.degree}</h3><p className="text-gray-600">{e.institution}{e.gradYear&&`, ${e.gradYear}`}{e.gpa&&` • GPA: ${e.gpa}`}</p>{e.thesisTitle&&<p className="text-gray-500 italic">Thesis: {e.thesisTitle}</p>}</div>)}</section>}
      {d.experience.length>0&&<section className="mb-8"><h2 className="font-bold text-indigo-900 uppercase mb-3">Experience</h2>{d.experience.map((e,i)=><div key={i} className="mb-4"><div className={`flex justify-between ${rtl?'flex-row-reverse':''}`}><h3 className="font-bold">{e.jobTitle}</h3><span className="text-gray-500 text-sm">{fmtDate(e.startMonth,e.startYear,false,'',mos)} - {fmtDate(e.endMonth,e.endYear,e.current,pres,mos)}</span></div><p className="text-gray-600">{e.company}</p>{e.description&&<p className="text-gray-500 mt-2 whitespace-pre-line">{e.description}</p>}</div>)}</section>}
      {d.skills.length>0&&<section className="mb-8"><h2 className="font-bold text-indigo-900 uppercase mb-3">Skills</h2><p className="text-gray-600">{d.skills.join(' • ')}</p></section>}
      {d.languages.length>0&&<section><h2 className="font-bold text-indigo-900 uppercase mb-3">Languages</h2><p className="text-gray-600">{d.languages.map(l=>`${l.name} (${l.level})`).join(' • ')}</p></section>}
    </div>
  );
}

// TEMPLATE 8: PROFESSIONAL
export function ProfessionalTemplate({ data: d, rtl, t }: TemplateProps) {
  const mos = t('months') as string[];
  const pres = t('present') as string;
  return (
    <div className={`bg-white min-h-full ${rtl?'text-right':''}`}>
      <header className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-8"><div className={`flex items-center gap-6 ${rtl?'flex-row-reverse':''}`}>{d.personal.photo&&<img src={d.personal.photo} className="w-24 h-24 rounded-full object-cover border-4 border-white/20"/>}<div className="flex-1"><h1 className="text-3xl font-bold">{d.personal.fullName||'Your Name'}</h1><p className="text-slate-300 text-lg">{d.personal.jobTitle}</p></div><div className={`text-sm text-slate-300 ${rtl?'text-left':'text-right'}`}>{d.personal.email&&<p>{d.personal.email}</p>}{d.personal.phone&&<p>{d.personal.phone}</p>}{d.personal.location&&<p>{d.personal.location}</p>}</div></div></header>
      <div className="p-8">
        {d.summary&&<section className="mb-8 bg-slate-50 rounded-lg p-5 border-l-4 border-slate-800"><p className="text-gray-700">{d.summary}</p></section>}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {d.experience.length>0&&<section><h2 className="font-bold text-slate-800 uppercase border-b-2 border-slate-200 pb-2 mb-4">Experience</h2>{d.experience.map((e,i)=><div key={i} className="mb-5"><div className={`flex justify-between ${rtl?'flex-row-reverse':''}`}><div><h3 className="font-bold">{e.jobTitle}</h3><p className="text-slate-600">{e.company}</p></div><span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{fmtDate(e.startMonth,e.startYear,false,'',mos)} - {fmtDate(e.endMonth,e.endYear,e.current,pres,mos)}</span></div>{e.description&&<p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{e.description}</p>}</div>)}</section>}
            {d.education.length>0&&<section><h2 className="font-bold text-slate-800 uppercase border-b-2 border-slate-200 pb-2 mb-4">Education</h2>{d.education.map((e,i)=><div key={i} className="mb-4"><h3 className="font-bold">{e.degree}</h3><p className="text-slate-600">{e.institution}</p>{(e.gradYear||e.gpa)&&<p className="text-sm text-slate-500">{e.gradYear&&fmtDate(e.gradMonth,e.gradYear,false,'',mos)}{e.gpa&&` • GPA: ${e.gpa}`}</p>}</div>)}</section>}
          </div>
          <div className="space-y-6">
            {d.skills.length>0&&<section className="bg-slate-50 rounded-lg p-4"><h2 className="font-bold text-slate-800 uppercase text-sm mb-3">Skills</h2><div className={`flex flex-wrap gap-1 ${rtl?'flex-row-reverse':''}`}>{d.skills.map((s,i)=><span key={i} className="px-2 py-1 bg-white border border-slate-200 text-slate-700 rounded text-xs">{s}</span>)}</div></section>}
            {d.languages.length>0&&<section className="bg-slate-50 rounded-lg p-4"><h2 className="font-bold text-slate-800 uppercase text-sm mb-3">Languages</h2>{d.languages.map((l,i)=><div key={i} className={`flex justify-between text-sm mb-2 ${rtl?'flex-row-reverse':''}`}><span className="text-gray-700">{l.name}</span><span className="text-slate-500">{l.level}</span></div>)}</section>}
          </div>
        </div>
      </div>
    </div>
  );
}

// TEMPLATE REGISTRY
export const TEMPLATES = {
  classic: { component: ClassicTemplate, icon: '📋', gradient: 'from-gray-700 to-gray-900' },
  modern: { component: ModernTemplate, icon: '✨', gradient: 'from-blue-500 to-cyan-400' },
  executive: { component: ExecutiveTemplate, icon: '👔', gradient: 'from-slate-800 to-amber-600' },
  creative: { component: CreativeTemplate, icon: '🎨', gradient: 'from-violet-600 to-pink-500' },
  minimal: { component: MinimalTemplate, icon: '○', gradient: 'from-gray-400 to-gray-600' },
  tech: { component: TechTemplate, icon: '💻', gradient: 'from-gray-900 to-cyan-900' },
  academic: { component: AcademicTemplate, icon: '📚', gradient: 'from-indigo-700 to-indigo-900' },
  professional: { component: ProfessionalTemplate, icon: '💼', gradient: 'from-slate-700 to-slate-900' },
} as const;

export type TemplateKey = keyof typeof TEMPLATES;
