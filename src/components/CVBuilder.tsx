// src/components/CVBuilder.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { translations } from '@/lib/translations';
import { validateCV } from '@/lib/validation';
import { generatePDF, generateWord, shareViaWhatsApp, shareViaTelegram } from '@/lib/export';
import { TEMPLATES, TemplateKey } from '@/templates';
import type { CVData, LanguageCode, ValidationErrors } from '@/lib/types';

const initialCV: CVData = {
  personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', photo: null },
  summary: '', experience: [], education: [], skills: [], languages: [],
};

function ValidationError({ msg }: { msg?: string }) {
  return msg ? <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠️</span>{msg}</p> : null;
}

function Input({ label, value, onChange, error, required, placeholder, type = 'text', tip, dir }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {tip && <p className="text-xs text-gray-400 mb-1">{tip}</p>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} dir={dir}
        className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
      <ValidationError msg={error} />
    </div>
  );
}

function PreviewModal({ tpl, rtl, t, onClose, onSelect, sample }: any) {
  const Comp = TEMPLATES[tpl as TemplateKey].component;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold">{t(tpl)} - {t('preview')}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">✕</button>
        </div>
        <div className="p-4 overflow-y-auto bg-gray-100" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          <div className="bg-white rounded-lg shadow overflow-hidden transform scale-75 origin-top"><Comp data={sample} rtl={rtl} t={t} /></div>
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">{t('back')}</button>
          <button onClick={() => { onSelect(tpl); onClose(); }} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium">{t('select')}</button>
        </div>
      </div>
    </div>
  );
}

function SignupModal({ t, rtl, onClose, onSubmit, loading }: any) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = t('reqField');
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('reqField');
    if (!form.password || form.password.length < 6) errs.password = t('reqField');
    if (form.password !== form.confirm) errs.confirm = t('passwordMismatch');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()} dir={rtl ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{t('signupTitle')}</h2>
        <p className="text-gray-500 text-sm mb-4">{t('signupDesc')}</p>
        <div className="space-y-3">
          <Input label={t('signupName')} value={form.name} onChange={(e:any) => setForm({ ...form, name: e.target.value })} error={errors.name} required />
          <Input label={t('signupEmail')} type="email" value={form.email} onChange={(e:any) => setForm({ ...form, email: e.target.value })} error={errors.email} required dir="ltr" />
          <Input label={t('signupPhone')} type="tel" value={form.phone} onChange={(e:any) => setForm({ ...form, phone: e.target.value })} dir="ltr" />
          <Input label={t('signupPassword')} type="password" value={form.password} onChange={(e:any) => setForm({ ...form, password: e.target.value })} error={errors.password} required />
          <Input label={t('signupConfirm')} type="password" value={form.confirm} onChange={(e:any) => setForm({ ...form, confirm: e.target.value })} error={errors.confirm} required />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">{t('back')}</button>
          <button onClick={() => validate() && onSubmit({ name: form.name, email: form.email, phone: form.phone, password: form.password })} disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-70">{loading ? '...' : t('signupBtn')}</button>
        </div>
      </div>
    </div>
  );
}

export function CVBuilder() {
  const [lang, setLang] = useState<LanguageCode | null>(null);
  const [template, setTemplate] = useState<TemplateKey>('modern');
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<TemplateKey | null>(null);
  const [cv, setCv] = useState<CVData>(initialCV);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showAlert, setShowAlert] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'word' | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  const t = useCallback((key: string): any => (translations[lang || 'en'] as any)?.[key] || key, [lang]);
  const rtl = lang === 'ar' || lang === 'ku';
  const Comp = TEMPLATES[template].component;
  const yrs = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);
  const mos = t('months') as string[];

  const sample: CVData = {
    personal: { fullName: rtl ? 'أحمد محمد' : 'John Smith', jobTitle: rtl ? 'مهندس' : 'Engineer', email: 'john@email.com', phone: '+1 555', location: rtl ? 'الرياض' : 'NY', linkedin: '', photo: null },
    summary: rtl ? 'مهندس بخبرة...' : 'Engineer with 5+ years...', experience: [{ id: '1', jobTitle: rtl ? 'مطور' : 'Dev', company: rtl ? 'شركة' : 'Co', startMonth: '1', startYear: '2020', endMonth: '', endYear: '', current: true, description: '• Led team' }],
    education: [{ id: '1', degree: rtl ? 'بكالوريوس' : 'BS', institution: rtl ? 'جامعة' : 'MIT', gradMonth: '5', gradYear: '2018', gpa: '3.8', thesisTitle: '' }],
    skills: ['JS', 'React', 'Python'], languages: [{ name: rtl ? 'العربية' : 'English', level: t('native') }]
  };

  const upd = (key: keyof CVData, value: any) => setCv(p => ({ ...p, [key]: value }));
  const updP = (key: keyof CVData['personal'], value: any) => setCv(p => ({ ...p, personal: { ...p.personal, [key]: value } }));

  const handleNext = () => {
    if (step === 7) {
      const { isValid, errors: e } = validateCV(cv, t);
      setErrors(e);
      if (!isValid) { setShowAlert(true); setTimeout(() => setShowAlert(false), 4000); return; }
    }
    setStep(step + 1);
  };

  const handlePdf = async () => { setExporting('pdf'); await generatePDF(cvRef.current, `cv-${cv.personal.fullName || 'doc'}.pdf`); setExporting(null); };
  const handleWord = async () => { setExporting('word'); await generateWord(cv, mos, `cv-${cv.personal.fullName || 'doc'}.docx`); setExporting(null); };
  const handleWhatsApp = () => shareViaWhatsApp(cv.personal.phone, `CV: ${cv.personal.fullName} - ${cv.personal.jobTitle}`);
  const handleTelegram = () => shareViaTelegram(`CV: ${cv.personal.fullName} - ${cv.personal.jobTitle}`);

  const handleSignup = async (data: any) => {
    setSignupLoading(true);
    try {
      const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fullName: data.name, email: data.email, phone: data.phone, password: data.password }) });
      const result = await res.json();
      if (result.success && result.token) {
        await fetch('/api/cv/save', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${result.token}` }, body: JSON.stringify({ cvData: cv, templateId: template, language: lang }) });
        setSaved(true); setShowSignup(false);
      }
    } catch (e) { console.error(e); }
    setSignupLoading(false);
  };

  // Language Selection
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl rotate-3"><span className="text-4xl">📝</span></div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">CVistan</h1>
            <p className="text-gray-500">Build your dream CV in minutes 🚀</p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-center mb-4">Select Your Language</h2>
            <div className="space-y-3">
              {[{ code: 'en' as LanguageCode, name: 'English', flag: '🇺🇸' }, { code: 'ar' as LanguageCode, name: 'العربية', flag: '🇸🇦' }, { code: 'ku' as LanguageCode, name: 'کوردی', flag: '🇮🇶' }].map(l => (
                <button key={l.code} onClick={() => { setLang(l.code); setStep(1); }} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <span className="text-3xl">{l.flag}</span><span className="flex-1 text-left font-semibold text-gray-800 group-hover:text-blue-600">{l.name}</span><span className="text-gray-300 group-hover:text-blue-500">→</span>
                </button>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">✓ No registration • ✓ Free • ✓ PDF & Word</p>
        </div>
      </div>
    );
  }

  const steps = [{ key: 'personal', icon: '👤' }, { key: 'summary', icon: '📝' }, { key: 'experience', icon: '💼' }, { key: 'education', icon: '🎓' }, { key: 'skills', icon: '⭐' }, { key: 'languages', icon: '🌍' }, { key: 'design', icon: '🎨' }, { key: 'review', icon: '📥' }];
  const templateList = Object.entries(TEMPLATES).map(([id, tpl]) => ({ id: id as TemplateKey, ...tpl }));

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} className={`min-h-screen bg-gray-50 ${rtl ? 'font-arabic' : ''}`}>
      {showAlert && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">⚠️ {t('validationError')}</div>}
      
      {/* Progress */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-1 overflow-x-auto">
            {steps.map((s, i) => (<React.Fragment key={s.key}><button onClick={() => i + 1 <= step && setStep(i + 1)} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${i + 1 === step ? 'bg-blue-600 text-white shadow-lg scale-110' : i + 1 < step ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{i + 1 < step ? '✓' : s.icon}</button>{i < steps.length - 1 && <div className={`w-3 md:w-6 h-1 rounded ${i + 1 < step ? 'bg-green-500' : 'bg-gray-200'}`} />}</React.Fragment>))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-1">{t('step')} {step} {t('of')} 8 • <b>{t(steps[step - 1]?.key)}</b></p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 lg:max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-5">
              {/* Step 1: Personal */}
              {step === 1 && <div className="space-y-4">
                <div className="text-center pb-3 border-b">{cv.personal.photo ? <div className="relative inline-block"><img src={cv.personal.photo} className="w-20 h-20 rounded-full object-cover shadow-lg" alt="" /><button onClick={() => updP('photo', null)} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs">×</button></div> : <label className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 mx-auto"><span className="text-2xl text-gray-400">👤</span><span className="text-xs text-gray-500">{t('photo')}</span><input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => updP('photo', r.result); r.readAsDataURL(f); } }} /></label>}</div>
                <Input label={t('name')} value={cv.personal.fullName} onChange={(e:any) => updP('fullName', e.target.value)} error={errors.fullName} required placeholder={t('nameP')} tip={t('nameT')} dir={rtl ? 'rtl' : 'ltr'} />
                <Input label={t('title')} value={cv.personal.jobTitle} onChange={(e:any) => updP('jobTitle', e.target.value)} error={errors.jobTitle} required placeholder={t('titleP')} tip={t('titleT')} dir={rtl ? 'rtl' : 'ltr'} />
                <Input label={t('email')} type="email" value={cv.personal.email} onChange={(e:any) => updP('email', e.target.value)} placeholder={t('emailP')} tip={t('emailT')} dir="ltr" />
                <Input label={t('phone')} type="tel" value={cv.personal.phone} onChange={(e:any) => updP('phone', e.target.value)} placeholder={t('phoneP')} tip={t('phoneT')} dir="ltr" />
                <Input label={t('location')} value={cv.personal.location} onChange={(e:any) => updP('location', e.target.value)} placeholder={t('locationP')} tip={t('locationT')} dir={rtl ? 'rtl' : 'ltr'} />
                <Input label={`${t('linkedin')} (${t('opt')})`} value={cv.personal.linkedin} onChange={(e:any) => updP('linkedin', e.target.value)} placeholder={t('linkedinP')} dir="ltr" />
              </div>}
              {/* Step 2: Summary */}
              {step === 2 && <div><div className="bg-blue-50 rounded-xl p-3 mb-3 border border-blue-100"><p className="text-blue-700 text-sm">{t('sumH')}</p></div><label className="block text-sm font-medium text-gray-700 mb-1">{t('sumTitle')} <span className="text-gray-400">({t('opt')})</span></label><textarea value={cv.summary} onChange={e => upd('summary', e.target.value)} placeholder={t('sumP')} rows={7} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl resize-none" dir={rtl ? 'rtl' : 'ltr'} /></div>}
              {/* Step 3: Experience */}
              {step === 3 && <div className="space-y-3">
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100"><p className="text-amber-700 text-sm">{t('noExpH')}</p></div>
                {errors.sections && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><p className="text-red-600 text-sm">⚠️ {errors.sections}</p></div>}
                {cv.experience.length === 0 ? <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"><span className="text-4xl">💼</span><p className="text-gray-500 mt-2 mb-3">{t('noExp')}</p><button onClick={() => upd('experience', [...cv.experience, { id: Date.now().toString(), jobTitle: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' }])} className="px-5 py-2 bg-blue-600 text-white rounded-xl">+ {t('addExp')}</button></div> :
                cv.experience.map((exp, i) => <div key={exp.id} className="bg-gray-50 rounded-xl p-4 space-y-3 border">
                  <div className="flex justify-between"><span className="font-semibold">💼 #{i + 1}</span><button onClick={() => upd('experience', cv.experience.filter((_, j) => j !== i))} className="text-red-500 text-sm">🗑️</button></div>
                  <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-gray-500">{t('title')}*</label><input value={exp.jobTitle} onChange={e => { const u = [...cv.experience]; u[i].jobTitle = e.target.value; upd('experience', u); }} placeholder={t('titleP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div><div><label className="text-xs text-gray-500">{t('company')}*</label><input value={exp.company} onChange={e => { const u = [...cv.experience]; u[i].company = e.target.value; upd('experience', u); }} placeholder={t('companyP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div></div>
                  <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-gray-500">{t('startD')}</label><div className="grid grid-cols-2 gap-1"><select value={exp.startMonth} onChange={e => { const u = [...cv.experience]; u[i].startMonth = e.target.value; upd('experience', u); }} className="px-1 py-1.5 border rounded text-xs"><option value="">{t('month')}</option>{mos.map((m, j) => <option key={j} value={j + 1}>{m}</option>)}</select><select value={exp.startYear} onChange={e => { const u = [...cv.experience]; u[i].startYear = e.target.value; upd('experience', u); }} className="px-1 py-1.5 border rounded text-xs"><option value="">{t('year')}</option>{yrs.map(y => <option key={y} value={y}>{y}</option>)}</select></div></div><div><label className="text-xs text-gray-500">{t('endD')}</label><div className="grid grid-cols-2 gap-1"><select value={exp.endMonth} onChange={e => { const u = [...cv.experience]; u[i].endMonth = e.target.value; upd('experience', u); }} disabled={exp.current} className="px-1 py-1.5 border rounded text-xs disabled:opacity-50"><option value="">{t('month')}</option>{mos.map((m, j) => <option key={j} value={j + 1}>{m}</option>)}</select><select value={exp.endYear} onChange={e => { const u = [...cv.experience]; u[i].endYear = e.target.value; upd('experience', u); }} disabled={exp.current} className="px-1 py-1.5 border rounded text-xs disabled:opacity-50"><option value="">{t('year')}</option>{yrs.map(y => <option key={y} value={y}>{y}</option>)}</select></div></div></div>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={exp.current} onChange={e => { const u = [...cv.experience]; u[i].current = e.target.checked; upd('experience', u); }} className="w-4 h-4 rounded" /><span className="text-sm">{t('current')}</span></label>
                  <div><label className="text-xs text-gray-500">{t('desc')}</label><textarea value={exp.description} onChange={e => { const u = [...cv.experience]; u[i].description = e.target.value; upd('experience', u); }} placeholder={t('descP')} rows={3} className="w-full px-2 py-2 border rounded-lg text-sm resize-none" dir={rtl ? 'rtl' : 'ltr'} /></div>
                </div>)}
                {cv.experience.length > 0 && <button onClick={() => upd('experience', [...cv.experience, { id: Date.now().toString(), jobTitle: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' }])} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600">+ {t('addExp')}</button>}
              </div>}
              {/* Step 4: Education */}
              {step === 4 && <div className="space-y-3">
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100"><p className="text-emerald-700 text-sm">{t('noEduH')}</p></div>
                {cv.education.length === 0 ? <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"><span className="text-4xl">🎓</span><p className="text-gray-500 mt-2 mb-3">{t('noEdu')}</p><button onClick={() => upd('education', [...cv.education, { id: Date.now().toString(), degree: '', institution: '', gradMonth: '', gradYear: '', gpa: '', thesisTitle: '' }])} className="px-5 py-2 bg-blue-600 text-white rounded-xl">+ {t('addEdu')}</button></div> :
                cv.education.map((edu, i) => <div key={edu.id} className="bg-gray-50 rounded-xl p-4 space-y-3 border">
                  <div className="flex justify-between"><span className="font-semibold">🎓 #{i + 1}</span><button onClick={() => upd('education', cv.education.filter((_, j) => j !== i))} className="text-red-500 text-sm">🗑️</button></div>
                  <div><label className="text-xs text-gray-500">{t('degree')}*</label><input value={edu.degree} onChange={e => { const u = [...cv.education]; u[i].degree = e.target.value; upd('education', u); }} placeholder={t('degreeP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-500">{t('inst')}*</label><input value={edu.institution} onChange={e => { const u = [...cv.education]; u[i].institution = e.target.value; upd('education', u); }} placeholder={t('instP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-500">{t('gradD')}</label><div className="grid grid-cols-2 gap-2"><select value={edu.gradMonth} onChange={e => { const u = [...cv.education]; u[i].gradMonth = e.target.value; upd('education', u); }} className="px-2 py-2 border rounded-lg text-sm"><option value="">{t('month')}</option>{mos.map((m, j) => <option key={j} value={j + 1}>{m}</option>)}</select><select value={edu.gradYear} onChange={e => { const u = [...cv.education]; u[i].gradYear = e.target.value; upd('education', u); }} className="px-2 py-2 border rounded-lg text-sm"><option value="">{t('year')}</option>{yrs.map(y => <option key={y} value={y}>{y}</option>)}</select></div></div>
                  <div><label className="text-xs text-gray-500">{t('gpa')} <span className="text-gray-400">- {t('gpaH')}</span></label><input value={edu.gpa} onChange={e => { const u = [...cv.education]; u[i].gpa = e.target.value; upd('education', u); }} placeholder={t('gpaP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-500">{t('thesis')} <span className="text-gray-400">- {t('thesisH')}</span></label><input value={edu.thesisTitle} onChange={e => { const u = [...cv.education]; u[i].thesisTitle = e.target.value; upd('education', u); }} placeholder={t('thesisP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                </div>)}
                {cv.education.length > 0 && <button onClick={() => upd('education', [...cv.education, { id: Date.now().toString(), degree: '', institution: '', gradMonth: '', gradYear: '', gpa: '', thesisTitle: '' }])} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600">+ {t('addEdu')}</button>}
              </div>}
              {/* Step 5: Skills */}
              {step === 5 && <div className="space-y-4">
                <div className="bg-purple-50 rounded-xl p-3 border border-purple-100"><p className="text-purple-700 text-sm">{t('skillH')}</p></div>
                <div className="flex gap-2"><input id="ski" placeholder={t('skillP')} className="flex-1 px-3 py-2 border rounded-xl" onKeyPress={(e:any) => { if (e.key === 'Enter' && e.target.value.trim()) { upd('skills', [...cv.skills, e.target.value.trim()]); e.target.value = ''; } }} /><button onClick={() => { const i = document.getElementById('ski') as HTMLInputElement; if (i.value.trim()) { upd('skills', [...cv.skills, i.value.trim()]); i.value = ''; } }} className="px-4 py-2 bg-blue-600 text-white rounded-xl">+</button></div>
                {cv.skills.length > 0 && <div className={`flex flex-wrap gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>{cv.skills.map((s, i) => <span key={i} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">{s}<button onClick={() => upd('skills', cv.skills.filter((_, j) => j !== i))} className="text-blue-500 font-bold">×</button></span>)}</div>}
                <div><p className="text-sm text-gray-500 mb-2">{t('suggest')}</p><div className={`flex flex-wrap gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>{((t('suggestedSkills') as string[]) || ['Microsoft Office', 'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Project Management', 'Time Management', 'Critical Thinking', 'Customer Service', 'Data Analysis', 'Public Speaking', 'Negotiation', 'Adaptability', 'Creativity', 'Attention to Detail', 'Organization', 'Decision Making', 'Research', 'Writing', 'Strategic Planning']).filter(s => !cv.skills.includes(s)).slice(0, 12).map(s => => <button key={s} onClick={() => upd('skills', [...cv.skills, s])} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-blue-100 hover:text-blue-700">+ {s}</button>)}</div></div>
              </div>}
              {/* Step 6: Languages */}
              {step === 6 && <div className="space-y-3">
                <div className="bg-green-50 rounded-xl p-3 border border-green-100"><p className="text-green-700 text-sm">{t('langT')}</p></div>
                {cv.languages.map((l, i) => <div key={i} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl"><input value={l.name} onChange={e => { const u = [...cv.languages]; u[i].name = e.target.value; upd('languages', u); }} placeholder={t('langP')} className="flex-1 px-2 py-2 border rounded-lg text-sm" /><select value={l.level} onChange={e => { const u = [...cv.languages]; u[i].level = e.target.value; upd('languages', u); }} className="px-2 py-2 border rounded-lg text-sm">{['native', 'fluent', 'conv', 'basic'].map(x => <option key={x} value={t(x)}>{t(x)}</option>)}</select><button onClick={() => upd('languages', cv.languages.filter((_, j) => j !== i))} className="text-red-500">🗑️</button></div>)}
                <button onClick={() => upd('languages', [...cv.languages, { name: '', level: t('fluent') }])} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600">+ {t('addLang')}</button>
              </div>}
              {/* Step 7: Design */}
              {step === 7 && <div className="space-y-3">
                <p className="text-gray-500 text-sm text-center">{t('designT')}</p>
                <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                  {templateList.map(x => <div key={x.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${template === x.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setTemplate(x.id)}>
                    <div className={`w-10 h-14 rounded-lg bg-gradient-to-br ${x.gradient} flex items-center justify-center text-lg text-white shadow`}>{x.icon}</div>
                    <div className="flex-1 min-w-0"><h3 className={`font-semibold text-sm ${template === x.id ? 'text-blue-700' : 'text-gray-800'}`}>{t(x.id)}</h3><p className="text-xs text-gray-500 truncate">{t(x.id + 'D')}</p></div>
                    <button onClick={e => { e.stopPropagation(); setPreview(x.id); }} className="px-2 py-1 text-blue-600 hover:bg-blue-100 rounded text-xs">👁️</button>
                    {template === x.id && <span className="text-blue-600">✓</span>}
                  </div>)}
                </div>
              </div>}
              {/* Step 8: Review */}
              {step === 8 && <div className="space-y-5">
                {saved ? <div className="text-center py-8"><div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4"><span className="text-4xl">✅</span></div><h3 className="text-xl font-bold text-gray-800 mb-2">{t('signupSuccess')}</h3></div> : <>
                  <div className="text-center"><div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-3"><span className="text-3xl">🎉</span></div><h3 className="text-xl font-bold text-gray-800">{t('done')}</h3><p className="text-gray-500 text-sm">{t('downloadT')}</p></div>
                  <div className="space-y-3"><h4 className="font-medium text-gray-700">{t('exportTitle')}</h4><div className="flex gap-3"><button onClick={handlePdf} disabled={exporting === 'pdf'} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">{exporting === 'pdf' ? '...' : '📄'} {t('downloadPdf')}</button><button onClick={handleWord} disabled={exporting === 'word'} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">{exporting === 'word' ? '...' : '📝'} {t('downloadWord')}</button></div></div>
                  {(cv.personal.email || cv.personal.phone) && <div className="space-y-3 pt-3 border-t border-gray-100"><h4 className="font-medium text-gray-700">{t('shareTitle')}</h4><div className="flex gap-3"><button onClick={handleWhatsApp} className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-600">💬 {t('shareWhatsapp')}</button><button onClick={handleTelegram} className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600">✈️ {t('shareTelegram')}</button></div></div>}
                  <div className="space-y-3 pt-3 border-t border-gray-100"><h4 className="font-medium text-gray-700">{t('saveTitle')}</h4><p className="text-xs text-gray-500">{t('saveDesc')}</p><div className="flex gap-3"><button onClick={() => setShowSignup(true)} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">{t('saveYes')}</button><button className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50">{t('saveNo')}</button></div></div>
                  <div className="flex gap-2 pt-3 border-t border-gray-100"><button onClick={() => setStep(1)} className="flex-1 py-2 border rounded-xl text-gray-600 hover:bg-gray-50">✏️ {t('edit')}</button><button onClick={() => { setStep(0); setCv(initialCV); setErrors({}); setSaved(false); }} className="flex-1 py-2 border border-red-200 rounded-xl text-red-600 hover:bg-red-50">🔄 {t('restart')}</button></div>
                </>}
              </div>}
            </div>
            {step < 8 && <div className="flex justify-between mt-4"><button onClick={() => setStep(step - 1)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl">{rtl ? '→' : '←'} {t('back')}</button><button onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700">{t('next')} {rtl ? '←' : '→'}</button></div>}
          </div>
          {/* Preview */}
          {step < 8 && <div className="flex-1 hidden lg:block"><div className="sticky top-24"><div className="flex items-center justify-between mb-2"><h3 className="font-semibold text-gray-700">{t('preview')}</h3><span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{t(template)}</span></div><div ref={cvRef} className="bg-white rounded-xl shadow-xl overflow-hidden border" style={{ aspectRatio: '210/297' }}><div className="transform scale-50 origin-top-left" style={{ width: '200%' }}><Comp data={cv} rtl={rtl} t={t} /></div></div></div></div>}
          {step === 8 && <div className="flex-1"><div ref={cvRef} className="bg-white rounded-xl shadow-xl overflow-hidden border"><Comp data={cv} rtl={rtl} t={t} /></div></div>}
        </div>
      </div>
      {preview && <PreviewModal tpl={preview} rtl={rtl} t={t} onClose={() => setPreview(null)} onSelect={setTemplate} sample={sample} />}
      {showSignup && <SignupModal t={t} rtl={rtl} onClose={() => setShowSignup(false)} onSubmit={handleSignup} loading={signupLoading} />}
    </div>
  );
}
