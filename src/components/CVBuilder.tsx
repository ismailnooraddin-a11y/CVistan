// src/components/CVBuilder.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { translations } from '@/lib/translations';
import { validateCV } from '@/lib/validation';
import { generatePDF, generateWord, shareViaWhatsApp, shareViaTelegram } from '@/lib/export';
import { TEMPLATES, TemplateKey } from '@/templates';
import type { CVData, LanguageCode, ValidationErrors, SocialLinks, Certification } from '@/lib/types';

const emptySocialLinks: SocialLinks = {
  linkedin: '', github: '', portfolio: '', twitter: '', instagram: '', behance: ''
};

const initialCV: CVData = {
  personal: { 
    fullName: '', jobTitle: '', email: '', phone: '', location: '', 
    dateOfBirth: '', photo: null, socialLinks: { ...emptySocialLinks }
  },
  summary: '', experience: [], education: [], certifications: [], skills: [], languages: [],
};

function ValidationError({ msg }: { msg?: string }) {
  return msg ? <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠️</span>{msg}</p> : null;
}

function Input({ label, value, onChange, error, required, placeholder, type = 'text', tip, dir }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {tip && <p className="text-xs text-gray-400 mb-1">{tip}</p>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} dir={dir}
        className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
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
          <div className="bg-white rounded-lg shadow overflow-hidden transform scale-50 origin-top">
            <Comp data={sample} rtl={rtl} t={t} />
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">{t('back')}</button>
          <button onClick={() => { onSelect(tpl); onClose(); }} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium">{t('select')}</button>
        </div>
      </div>
    </div>
  );
}

function AuthModal({ mode, t, rtl, onClose, onSubmit, onSwitch, loading }: any) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const errs: Record<string, string> = {};
    if (mode === 'signup' && !form.name.trim()) errs.name = t('reqField');
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('reqField');
    if (!form.password || form.password.length < 6) errs.password = t('reqField');
    if (mode === 'signup' && form.password !== form.confirm) errs.confirm = t('passwordMismatch');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()} dir={rtl ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{mode === 'signup' ? t('signupTitle') : t('signinTitle')}</h2>
        <p className="text-gray-500 text-sm mb-4">{mode === 'signup' ? t('signupDesc') : t('signinDesc')}</p>
        <div className="space-y-3">
          {mode === 'signup' && (
            <Input label={t('signupName')} value={form.name} onChange={(e:any) => setForm({ ...form, name: e.target.value })} error={errors.name} required />
          )}
          <Input label={t('signupEmail')} type="email" value={form.email} onChange={(e:any) => setForm({ ...form, email: e.target.value })} error={errors.email} required dir="ltr" />
          {mode === 'signup' && (
            <Input label={t('signupPhone')} type="tel" value={form.phone} onChange={(e:any) => setForm({ ...form, phone: e.target.value })} dir="ltr" />
          )}
          <Input label={t('signupPassword')} type="password" value={form.password} onChange={(e:any) => setForm({ ...form, password: e.target.value })} error={errors.password} required />
          {mode === 'signup' && (
            <Input label={t('signupConfirm')} type="password" value={form.confirm} onChange={(e:any) => setForm({ ...form, confirm: e.target.value })} error={errors.confirm} required />
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">{t('back')}</button>
          <button 
            onClick={() => validate() && onSubmit({ name: form.name, email: form.email, phone: form.phone, password: form.password })} 
            disabled={loading} 
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? '...' : mode === 'signup' ? t('signupBtn') : t('signinBtn')}
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === 'signup' ? t('haveAccount') : t('noAccount')}{' '}
          <button onClick={onSwitch} className="text-blue-600 font-medium hover:underline">
            {mode === 'signup' ? t('signIn') : t('signUp')}
          </button>
        </p>
      </div>
    </div>
  );
}

const socialIcons: Record<string, { icon: string; color: string }> = {
  linkedin: { icon: '💼', color: 'bg-blue-600' },
  github: { icon: '💻', color: 'bg-gray-800' },
  portfolio: { icon: '🌐', color: 'bg-purple-600' },
  twitter: { icon: '𝕏', color: 'bg-black' },
  instagram: { icon: '📷', color: 'bg-pink-500' },
  behance: { icon: '🎨', color: 'bg-blue-500' },
};

export function CVBuilder() {
  const [lang, setLang] = useState<LanguageCode | null>(null);
  const [template, setTemplate] = useState<TemplateKey>('morgan');
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<TemplateKey | null>(null);
  const [cv, setCv] = useState<CVData>(initialCV);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showAlert, setShowAlert] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'word' | null>(null);
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; fullName: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeSocials, setActiveSocials] = useState<string[]>([]);
  const cvRef = useRef<HTMLDivElement>(null);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cvistan_user');
    const savedToken = localStorage.getItem('cvistan_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const t = useCallback((key: string): any => (translations[lang || 'en'] as any)?.[key] || key, [lang]);
  const rtl = lang === 'ar' || lang === 'ku';
  const Comp = TEMPLATES[template].component;
  const yrs = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);
  const birthYrs = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 16 - i);
  const mos = t('months') as string[];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const defaultSkills = ['Microsoft Office', 'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Project Management', 'Time Management', 'Critical Thinking', 'Customer Service', 'Data Analysis', 'Public Speaking', 'Negotiation', 'Adaptability', 'Creativity', 'Attention to Detail', 'Organization', 'Decision Making', 'Research', 'Writing', 'Strategic Planning'];

  const sample: CVData = {
    personal: { 
      fullName: rtl ? 'أحمد أكرم' : 'Ahmed Akram', 
      jobTitle: rtl ? 'محاسب أول' : 'Senior Accountant', 
      email: 'ahmed.akram@email.com', 
      phone: '+964 750 123 4567', 
      location: rtl ? 'أربيل، كردستان، العراق' : 'Erbil, Kurdistan, Iraq', 
      dateOfBirth: '1995-05-15',
      photo: null,
      socialLinks: { linkedin: 'linkedin.com/in/ahmedakram', github: '', portfolio: '', twitter: '', instagram: '', behance: '' }
    },
    summary: rtl ? 'محاسب أول بخبرة 5+ سنوات...' : 'Senior Accountant with 5+ years experience in financial reporting and analysis...', 
    experience: [
      { id: '1', jobTitle: rtl ? 'محاسب أول' : 'Senior Accountant', company: rtl ? 'شركة ABC المالية' : 'ABC Financial', startMonth: '1', startYear: '2022', endMonth: '', endYear: '', current: true, description: '• Prepared monthly financial statements\n• Managed accounts for 50+ clients' },
      { id: '2', jobTitle: rtl ? 'محاسب' : 'Accountant', company: rtl ? 'شركة XYZ' : 'XYZ Corp', startMonth: '6', startYear: '2019', endMonth: '12', endYear: '2021', current: false, description: '• Processed invoices and payments' }
    ],
    education: [{ id: '1', degree: rtl ? 'بكالوريوس محاسبة' : 'BSc Accounting', institution: rtl ? 'جامعة صلاح الدين' : 'Salahaddin University', gradMonth: '5', gradYear: '2019', gpa: '3.8', thesisTitle: '' }],
    certifications: [{ id: '1', name: 'CPA - Certified Public Accountant', issuer: 'AICPA', issueMonth: '3', issueYear: '2021', expiryMonth: '', expiryYear: '', noExpiry: true, credentialId: 'CPA-12345', credentialUrl: '', mode: 'in-person' }],
    skills: ['Financial Analysis', 'QuickBooks', 'SAP', 'Excel', 'Tax Preparation'], 
    languages: [{ name: rtl ? 'العربية' : 'Arabic', level: t('native') }, { name: 'English', level: t('fluent') }, { name: rtl ? 'الكردية' : 'Kurdish', level: t('native') }]
  };

  const upd = (key: keyof CVData, value: any) => setCv(p => ({ ...p, [key]: value }));
  const updP = (key: keyof CVData['personal'], value: any) => setCv(p => ({ ...p, personal: { ...p.personal, [key]: value } }));
  const updSocial = (key: keyof SocialLinks, value: string) => setCv(p => ({ ...p, personal: { ...p.personal, socialLinks: { ...p.personal.socialLinks, [key]: value } } }));

  const toggleSocial = (key: string) => {
    if (activeSocials.includes(key)) {
      setActiveSocials(activeSocials.filter(s => s !== key));
      updSocial(key as keyof SocialLinks, '');
    } else {
      setActiveSocials([...activeSocials, key]);
    }
  };

  const handleNext = () => {
    if (step === 8) {
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

  const handleAuth = async (data: any) => {
    setAuthLoading(true);
    try {
      const endpoint = authModal === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const res = await fetch(endpoint, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(authModal === 'signup' 
          ? { fullName: data.name, email: data.email, phone: data.phone, password: data.password }
          : { email: data.email, password: data.password }
        ) 
      });
      const result = await res.json();
      if (result.success && result.token) {
        localStorage.setItem('cvistan_token', result.token);
        localStorage.setItem('cvistan_user', JSON.stringify(result.user));
        setUser(result.user);
        if (authModal === 'signup' || step === 9) {
          await fetch('/api/cv/save', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${result.token}` }, 
            body: JSON.stringify({ cvData: cv, templateId: template, language: lang }) 
          });
          setSaved(true);
        }
        setAuthModal(null);
      }
    } catch (e) { console.error(e); }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('cvistan_token');
    localStorage.removeItem('cvistan_user');
    setUser(null);
  };

  // Language Selection (Step 0)
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Auth buttons */}
          <div className="flex justify-end gap-2 mb-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">👋 {user.fullName}</span>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Logout</button>
              </div>
            ) : (
              <>
                <button onClick={() => setAuthModal('signin')} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium">
                  Sign In
                </button>
                <button onClick={() => setAuthModal('signup')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Sign Up
                </button>
              </>
            )}
          </div>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl rotate-3">
              <span className="text-4xl">📝</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">CVistan</h1>
            <p className="text-gray-500">Build your dream CV in minutes 🚀</p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-center mb-4">Select Your Language</h2>
            <div className="space-y-3">
              {[
                { code: 'en' as LanguageCode, name: 'English', flag: '🇺🇸' }, 
                { code: 'ar' as LanguageCode, name: 'العربية', flag: '🇸🇦' }, 
                { code: 'ku' as LanguageCode, name: 'کوردی', flag: '🇮🇶' }
              ].map(l => (
                <button key={l.code} onClick={() => { setLang(l.code); setStep(1); }} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <span className="text-3xl">{l.flag}</span>
                  <span className="flex-1 text-left font-semibold text-gray-800 group-hover:text-blue-600">{l.name}</span>
                  <span className="text-gray-300 group-hover:text-blue-500">→</span>
                </button>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">✓ No registration required • ✓ Free • ✓ PDF & Word</p>
        </div>

        {authModal && (
          <AuthModal 
            mode={authModal} 
            t={t} 
            rtl={false} 
            onClose={() => setAuthModal(null)} 
            onSubmit={handleAuth}
            onSwitch={() => setAuthModal(authModal === 'signin' ? 'signup' : 'signin')}
            loading={authLoading}
          />
        )}
      </div>
    );
  }

  const steps = [
    { key: 'personal', icon: '👤' }, 
    { key: 'summary', icon: '📝' }, 
    { key: 'experience', icon: '💼' }, 
    { key: 'education', icon: '🎓' }, 
    { key: 'certifications', icon: '🏆' },
    { key: 'skills', icon: '⭐' }, 
    { key: 'languages', icon: '🌍' }, 
    { key: 'design', icon: '🎨' }, 
    { key: 'review', icon: '📥' }
  ];
  const templateList = Object.entries(TEMPLATES).map(([id, tpl]) => ({ id: id as TemplateKey, ...tpl }));

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} className={`min-h-screen bg-gray-50 ${rtl ? 'font-arabic' : ''}`}>
      {showAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
          ⚠️ {t('validationError')}
        </div>
      )}
      
      {/* Header with Auth */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-2 flex justify-between items-center">
          <button onClick={() => setStep(0)} className="font-bold text-blue-600">CVistan</button>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">👋 {user.fullName}</span>
                <button onClick={handleLogout} className="text-xs text-red-600 hover:underline">{rtl ? 'خروج' : 'Logout'}</button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthModal('signin')} className="text-sm text-blue-600 hover:underline">{t('signIn')}</button>
                <button onClick={() => setAuthModal('signup')} className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg">{t('signUp')}</button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-1 overflow-x-auto">
            {steps.map((s, i) => (
              <React.Fragment key={s.key}>
                <button 
                  onClick={() => i + 1 <= step && setStep(i + 1)} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                    i + 1 === step ? 'bg-blue-600 text-white shadow-lg scale-110' : 
                    i + 1 < step ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i + 1 < step ? '✓' : s.icon}
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-2 md:w-4 h-1 rounded ${i + 1 < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-1">
            {t('step')} {step} {t('of')} 9 • <b>{t(steps[step - 1]?.key)}</b>
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 lg:max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-5">
              
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-center pb-3 border-b">
                    {cv.personal.photo ? (
                      <div className="relative inline-block">
                        <img src={cv.personal.photo} className="w-20 h-20 rounded-full object-cover shadow-lg" alt="" />
                        <button onClick={() => updP('photo', null)} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs">×</button>
                      </div>
                    ) : (
                      <label className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 mx-auto">
                        <span className="text-2xl text-gray-400">👤</span>
                        <span className="text-xs text-gray-500">{t('photo')}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => { 
                          const f = e.target.files?.[0]; 
                          if (f) { const r = new FileReader(); r.onloadend = () => updP('photo', r.result); r.readAsDataURL(f); } 
                        }} />
                      </label>
                    )}
                  </div>

                  <Input label={t('name')} value={cv.personal.fullName} onChange={(e:any) => updP('fullName', e.target.value)} error={errors.fullName} required placeholder={t('nameP')} tip={t('nameT')} dir={rtl ? 'rtl' : 'ltr'} />
                  <Input label={t('title')} value={cv.personal.jobTitle} onChange={(e:any) => updP('jobTitle', e.target.value)} error={errors.jobTitle} required placeholder={t('titleP')} tip={t('titleT')} dir={rtl ? 'rtl' : 'ltr'} />
                  <Input label={t('email')} type="email" value={cv.personal.email} onChange={(e:any) => updP('email', e.target.value)} placeholder={t('emailP')} tip={t('emailT')} dir="ltr" />
                  <Input label={t('phone')} type="tel" value={cv.personal.phone} onChange={(e:any) => updP('phone', e.target.value)} error={errors.phone} required placeholder={t('phoneP')} tip={t('phoneT')} dir="ltr" />
                  <Input label={t('location')} value={cv.personal.location} onChange={(e:any) => updP('location', e.target.value)} placeholder={t('locationP')} tip={t('locationT')} dir={rtl ? 'rtl' : 'ltr'} />
                  
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('dob')} <span className="text-gray-400">({t('opt')})</span></label>
                    <div className="grid grid-cols-3 gap-2">
                      <select value={cv.personal.dateOfBirth.split('-')[2] || ''} onChange={e => { const p = cv.personal.dateOfBirth.split('-'); updP('dateOfBirth', `${p[0]||''}-${p[1]||''}-${e.target.value}`); }} className="px-2 py-2 border border-gray-200 rounded-xl text-sm">
                        <option value="">Day</option>
                        {days.map(d => <option key={d} value={d.toString().padStart(2, '0')}>{d}</option>)}
                      </select>
                      <select value={cv.personal.dateOfBirth.split('-')[1] || ''} onChange={e => { const p = cv.personal.dateOfBirth.split('-'); updP('dateOfBirth', `${p[0]||''}-${e.target.value}-${p[2]||''}`); }} className="px-2 py-2 border border-gray-200 rounded-xl text-sm">
                        <option value="">{t('month')}</option>
                        {mos.map((m, i) => <option key={i} value={(i+1).toString().padStart(2, '0')}>{m}</option>)}
                      </select>
                      <select value={cv.personal.dateOfBirth.split('-')[0] || ''} onChange={e => { const p = cv.personal.dateOfBirth.split('-'); updP('dateOfBirth', `${e.target.value}-${p[1]||''}-${p[2]||''}`); }} className="px-2 py-2 border border-gray-200 rounded-xl text-sm">
                        <option value="">{t('year')}</option>
                        {birthYrs.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('socialLinks')} <span className="text-gray-400">({t('opt')})</span></label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Object.entries(socialIcons).map(([key, { icon, color }]) => (
                        <button key={key} onClick={() => toggleSocial(key)} className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-all ${activeSocials.includes(key) ? `${color} text-white` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          <span>{icon}</span><span>{t(key)}</span>{activeSocials.includes(key) && <span>✓</span>}
                        </button>
                      ))}
                    </div>
                    {activeSocials.length > 0 && (
                      <div className="space-y-2 bg-gray-50 rounded-xl p-3">
                        {activeSocials.map(key => (
                          <div key={key} className="flex items-center gap-2">
                            <span className={`w-8 h-8 rounded-lg ${socialIcons[key].color} text-white flex items-center justify-center text-sm`}>{socialIcons[key].icon}</span>
                            <input type="url" value={cv.personal.socialLinks[key as keyof SocialLinks]} onChange={e => updSocial(key as keyof SocialLinks, e.target.value)} placeholder={t(`${key}P`)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" dir="ltr" />
                            <button onClick={() => toggleSocial(key)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg text-xs">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Summary */}
              {step === 2 && (
                <div>
                  <div className="bg-blue-50 rounded-xl p-3 mb-3 border border-blue-100">
                    <p className="text-blue-700 text-sm">{t('sumH')}</p>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('sumTitle')} <span className="text-gray-400">({t('opt')})</span></label>
                  <textarea value={cv.summary} onChange={e => upd('summary', e.target.value)} placeholder={t('sumP')} rows={8} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none" dir={rtl ? 'rtl' : 'ltr'} />
                </div>
              )}

              {/* Step 3: Experience */}
              {step === 3 && (
                <div className="space-y-3">
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <p className="text-amber-700 text-sm">{t('noExpH')}</p>
                  </div>
                  {cv.experience.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <span className="text-4xl">💼</span>
                      <p className="text-gray-500 mt-2 mb-3">{t('noExp')}</p>
                      <button onClick={() => upd('experience', [...cv.experience, { id: Date.now().toString(), jobTitle: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' }])} className="px-5 py-2 bg-blue-600 text-white rounded-xl">+ {t('addExp')}</button>
                    </div>
                  ) : (
                    cv.experience.map((exp, i) => (
                      <div key={exp.id} className="bg-gray-50 rounded-xl p-4 space-y-3 border">
                        <div className="flex justify-between">
                          <span className="font-semibold">💼 #{i + 1}</span>
                          <button onClick={() => upd('experience', cv.experience.filter((_, j) => j !== i))} className="text-red-500 text-sm">🗑️</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className="text-xs text-gray-500">{t('title')}*</label><input value={exp.jobTitle} onChange={e => { const u = [...cv.experience]; u[i].jobTitle = e.target.value; upd('experience', u); }} placeholder={t('titleP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                          <div><label className="text-xs text-gray-500">{t('company')}*</label><input value={exp.company} onChange={e => { const u = [...cv.experience]; u[i].company = e.target.value; upd('experience', u); }} placeholder={t('companyP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className="text-xs text-gray-500">{t('startD')}</label><div className="grid grid-cols-2 gap-1"><select value={exp.startMonth} onChange={e => { const u = [...cv.experience]; u[i].startMonth = e.target.value; upd('experience', u); }} className="px-1 py-1.5 border rounded text-xs"><option value="">{t('month')}</option>{mos.map((m, j) => <option key={j} value={j+1}>{m}</option>)}</select><select value={exp.startYear} onChange={e => { const u = [...cv.experience]; u[i].startYear = e.target.value; upd('experience', u); }} className="px-1 py-1.5 border rounded text-xs"><option value="">{t('year')}</option>{yrs.map(y => <option key={y} value={y}>{y}</option>)}</select></div></div>
                          <div><label className="text-xs text-gray-500">{t('endD')}</label><div className="grid grid-cols-2 gap-1"><select value={exp.endMonth} onChange={e => { const u = [...cv.experience]; u[i].endMonth = e.target.value; upd('experience', u); }} disabled={exp.current} className="px-1 py-1.5 border rounded text-xs disabled:opacity-50"><option value="">{t('month')}</option>{mos.map((m, j) => <option key={j} value={j+1}>{m}</option>)}</select><select value={exp.endYear} onChange={e => { const u = [...cv.experience]; u[i].endYear = e.target.value; upd('experience', u); }} disabled={exp.current} className="px-1 py-1.5 border rounded text-xs disabled:opacity-50"><option value="">{t('year')}</option>{yrs.map(y => <option key={y} value={y}>{y}</option>)}</select></div></div>
                        </div>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={exp.current} onChange={e => { const u = [...cv.experience]; u[i].current = e.target.checked; upd('experience', u); }} className="w-4 h-4 rounded" /><span className="text-sm">{t('current')}</span></label>
                        <div><label className="text-xs text-gray-500">{t('desc')}</label><textarea value={exp.description} onChange={e => { const u = [...cv.experience]; u[i].description = e.target.value; upd('experience', u); }} placeholder={t('descP')} rows={3} className="w-full px-2 py-2 border rounded-lg text-sm resize-none" dir={rtl ? 'rtl' : 'ltr'} /></div>
                      </div>
                    ))
                  )}
                  {cv.experience.length > 0 && <button onClick={() => upd('experience', [...cv.experience, { id: Date.now().toString(), jobTitle: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' }])} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600">+ {t('addExp')}</button>}
                </div>
              )}

              {/* Step 4: Education */}
              {step === 4 && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <p className="text-emerald-700 text-sm">{t('noEduH')}</p>
                  </div>
                  {cv.education.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <span className="text-4xl">🎓</span>
                      <p className="text-gray-500 mt-2 mb-3">{t('noEdu')}</p>
                      <button onClick={() => upd('education', [...cv.education, { id: Date.now().toString(), degree: '', institution: '', gradMonth: '', gradYear: '', gpa: '', thesisTitle: '' }])} className="px-5 py-2 bg-blue-600 text-white rounded-xl">+ {t('addEdu')}</button>
                    </div>
                  ) : (
                    cv.education.map((edu, i) => (
                      <div key={edu.id} className="bg-gray-50 rounded-xl p-4 space-y-3 border">
                        <div className="flex justify-between"><span className="font-semibold">🎓 #{i + 1}</span><button onClick={() => upd('education', cv.education.filter((_, j) => j !== i))} className="text-red-500 text-sm">🗑️</button></div>
                        <div><label className="text-xs text-gray-500">{t('degree')}*</label><input value={edu.degree} onChange={e => { const u = [...cv.education]; u[i].degree = e.target.value; upd('education', u); }} placeholder={t('degreeP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                        <div><label className="text-xs text-gray-500">{t('inst')}*</label><input value={edu.institution} onChange={e => { const u = [...cv.education]; u[i].institution = e.target.value; upd('education', u); }} placeholder={t('instP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                        <div><label className="text-xs text-gray-500">{t('gradD')}</label><div className="grid grid-cols-2 gap-2"><select value={edu.gradMonth} onChange={e => { const u = [...cv.education]; u[i].gradMonth = e.target.value; upd('education', u); }} className="px-2 py-2 border rounded-lg text-sm"><option value="">{t('month')}</option>{mos.map((m, j) => <option key={j} value={j+1}>{m}</option>)}</select><select value={edu.gradYear} onChange={e => { const u = [...cv.education]; u[i].gradYear = e.target.value; upd('education', u); }} className="px-2 py-2 border rounded-lg text-sm"><option value="">{t('year')}</option>{yrs.map(y => <option key={y} value={y}>{y}</option>)}</select></div></div>
                        <div><label className="text-xs text-gray-500">{t('gpa')} <span className="text-gray-400">- {t('gpaH')}</span></label><input value={edu.gpa} onChange={e => { const u = [...cv.education]; u[i].gpa = e.target.value; upd('education', u); }} placeholder={t('gpaP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                        <div><label className="text-xs text-gray-500">{t('thesis')} <span className="text-gray-400">- {t('thesisH')}</span></label><input value={edu.thesisTitle} onChange={e => { const u = [...cv.education]; u[i].thesisTitle = e.target.value; upd('education', u); }} placeholder={t('thesisP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                      </div>
                    ))
                  )}
                  {cv.education.length > 0 && <button onClick={() => upd('education', [...cv.education, { id: Date.now().toString(), degree: '', institution: '', gradMonth: '', gradYear: '', gpa: '', thesisTitle: '' }])} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600">+ {t('addEdu')}</button>}
                </div>
              )}

              {/* Step 5: Certifications */}
              {step === 5 && (
                <div className="space-y-3">
                  <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                    <p className="text-purple-700 text-sm">{t('noCertH')}</p>
                  </div>
                  {cv.certifications.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <span className="text-4xl">🏆</span>
                      <p className="text-gray-500 mt-2 mb-3">{t('noCert')}</p>
                      <button onClick={() => upd('certifications', [...cv.certifications, { id: Date.now().toString(), name: '', issuer: '', issueMonth: '', issueYear: '', expiryMonth: '', expiryYear: '', noExpiry: false, credentialId: '', credentialUrl: '', mode: '' }])} className="px-5 py-2 bg-blue-600 text-white rounded-xl">+ {t('addCert')}</button>
                    </div>
                  ) : (
                    cv.certifications.map((cert, i) => (
                      <div key={cert.id} className="bg-gray-50 rounded-xl p-4 space-y-3 border">
                        <div className="flex justify-between"><span className="font-semibold">🏆 #{i + 1}</span><button onClick={() => upd('certifications', cv.certifications.filter((_, j) => j !== i))} className="text-red-500 text-sm">🗑️</button></div>
                        <div><label className="text-xs text-gray-500">{t('certName')}*</label><input value={cert.name} onChange={e => { const u = [...cv.certifications]; u[i].name = e.target.value; upd('certifications', u); }} placeholder={t('certNameP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                        <div><label className="text-xs text-gray-500">{t('certIssuer')}*</label><input value={cert.issuer} onChange={e => { const u = [...cv.certifications]; u[i].issuer = e.target.value; upd('certifications', u); }} placeholder={t('certIssuerP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                        <div><label className="text-xs text-gray-500">{t('certIssueD')}</label><div className="grid grid-cols-2 gap-2"><select value={cert.issueMonth} onChange={e => { const u = [...cv.certifications]; u[i].issueMonth = e.target.value; upd('certifications', u); }} className="px-2 py-2 border rounded-lg text-sm"><option value="">{t('month')}</option>{mos.map((m, j) => <option key={j} value={j+1}>{m}</option>)}</select><select value={cert.issueYear} onChange={e => { const u = [...cv.certifications]; u[i].issueYear = e.target.value; upd('certifications', u); }} className="px-2 py-2 border rounded-lg text-sm"><option value="">{t('year')}</option>{yrs.map(y => <option key={y} value={y}>{y}</option>)}</select></div></div>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={cert.noExpiry} onChange={e => { const u = [...cv.certifications]; u[i].noExpiry = e.target.checked; upd('certifications', u); }} className="w-4 h-4 rounded" /><span className="text-sm">{t('certNoExpiry')}</span></label>
                        {!cert.noExpiry && <div><label className="text-xs text-gray-500">{t('certExpiryD')}</label><div className="grid grid-cols-2 gap-2"><select value={cert.expiryMonth} onChange={e => { const u = [...cv.certifications]; u[i].expiryMonth = e.target.value; upd('certifications', u); }} className="px-2 py-2 border rounded-lg text-sm"><option value="">{t('month')}</option>{mos.map((m, j) => <option key={j} value={j+1}>{m}</option>)}</select><select value={cert.expiryYear} onChange={e => { const u = [...cv.certifications]; u[i].expiryYear = e.target.value; upd('certifications', u); }} className="px-2 py-2 border rounded-lg text-sm"><option value="">{t('year')}</option>{yrs.map(y => <option key={y} value={y}>{y}</option>)}</select></div></div>}
                        <div><label className="text-xs text-gray-500">{t('certMode')}</label><div className="flex gap-2 mt-1"><button onClick={() => { const u = [...cv.certifications]; u[i].mode = 'online'; upd('certifications', u); }} className={`flex-1 py-2 rounded-lg text-sm border ${cert.mode === 'online' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-200'}`}>🌐 {t('certOnline')}</button><button onClick={() => { const u = [...cv.certifications]; u[i].mode = 'in-person'; upd('certifications', u); }} className={`flex-1 py-2 rounded-lg text-sm border ${cert.mode === 'in-person' ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-200'}`}>🏢 {t('certInPerson')}</button></div></div>
                        <div><label className="text-xs text-gray-500">{t('certCredId')} ({t('opt')})</label><input value={cert.credentialId} onChange={e => { const u = [...cv.certifications]; u[i].credentialId = e.target.value; upd('certifications', u); }} placeholder={t('certCredIdP')} className="w-full px-2 py-2 border rounded-lg text-sm" /></div>
                      </div>
                    ))
                  )}
                  {cv.certifications.length > 0 && <button onClick={() => upd('certifications', [...cv.certifications, { id: Date.now().toString(), name: '', issuer: '', issueMonth: '', issueYear: '', expiryMonth: '', expiryYear: '', noExpiry: false, credentialId: '', credentialUrl: '', mode: '' }])} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600">+ {t('addCert')}</button>}
                </div>
              )}

              {/* Step 6: Skills */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                    <p className="text-orange-700 text-sm">{t('skillH')}</p>
                  </div>
                  <div className="flex gap-2">
                    <input id="ski" placeholder={t('skillP')} className="flex-1 px-3 py-2 border rounded-xl" onKeyPress={(e:any) => { if (e.key === 'Enter' && e.target.value.trim()) { upd('skills', [...cv.skills, e.target.value.trim()]); e.target.value = ''; } }} />
                    <button onClick={() => { const i = document.getElementById('ski') as HTMLInputElement; if (i.value.trim()) { upd('skills', [...cv.skills, i.value.trim()]); i.value = ''; } }} className="px-4 py-2 bg-blue-600 text-white rounded-xl">+</button>
                  </div>
                  {cv.skills.length > 0 && <div className={`flex flex-wrap gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>{cv.skills.map((s, i) => <span key={i} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">{s}<button onClick={() => upd('skills', cv.skills.filter((_, j) => j !== i))} className="text-blue-500 font-bold">×</button></span>)}</div>}
                  <div><p className="text-sm text-gray-500 mb-2">{t('suggest')}</p><div className={`flex flex-wrap gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>{defaultSkills.filter(s => !cv.skills.includes(s)).slice(0, 12).map(s => <button key={s} onClick={() => upd('skills', [...cv.skills, s])} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-blue-100 hover:text-blue-700">+ {s}</button>)}</div></div>
                </div>
              )}

              {/* Step 7: Languages */}
              {step === 7 && (
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-green-700 text-sm">{t('langT')}</p>
                  </div>
                  {cv.languages.map((l, i) => (
                    <div key={i} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl">
                      <input value={l.name} onChange={e => { const u = [...cv.languages]; u[i].name = e.target.value; upd('languages', u); }} placeholder={t('langP')} className="flex-1 px-2 py-2 border rounded-lg text-sm" />
                      <select value={l.level} onChange={e => { const u = [...cv.languages]; u[i].level = e.target.value; upd('languages', u); }} className="px-2 py-2 border rounded-lg text-sm">
                        {['native', 'fluent', 'conv', 'basic'].map(x => <option key={x} value={t(x)}>{t(x)}</option>)}
                      </select>
                      <button onClick={() => upd('languages', cv.languages.filter((_, j) => j !== i))} className="text-red-500">🗑️</button>
                    </div>
                  ))}
                  <button onClick={() => upd('languages', [...cv.languages, { name: '', level: t('fluent') }])} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600">+ {t('addLang')}</button>
                </div>
              )}

              {/* Step 8: Design */}
              {step === 8 && (
                <div className="space-y-3">
                  <p className="text-gray-500 text-sm text-center">{t('designT')}</p>
                  <div className="space-y-2">
                    {templateList.map(x => (
                      <div key={x.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${template === x.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setTemplate(x.id)}>
                        <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${x.gradient} flex items-center justify-center text-xl text-white shadow`}>{x.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold ${template === x.id ? 'text-blue-700' : 'text-gray-800'}`}>{t(x.id)}</h3>
                          <p className="text-xs text-gray-500 truncate">{t(x.id + 'D')}</p>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setPreview(x.id); }} className="px-2 py-1 text-blue-600 hover:bg-blue-100 rounded text-xs">👁️</button>
                        {template === x.id && <span className="text-blue-600 text-xl">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 9: Review */}
              {step === 9 && (
                <div className="space-y-5">
                  {saved ? (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4"><span className="text-4xl">✅</span></div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{t('signupSuccess')}</h3>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-3"><span className="text-3xl">🎉</span></div>
                        <h3 className="text-xl font-bold text-gray-800">{t('done')}</h3>
                        <p className="text-gray-500 text-sm">{t('downloadT')}</p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">{t('exportTitle')}</h4>
                        <div className="flex gap-3">
                          <button onClick={handlePdf} disabled={exporting === 'pdf'} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">{exporting === 'pdf' ? '...' : '📄'} {t('downloadPdf')}</button>
                          <button onClick={handleWord} disabled={exporting === 'word'} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">{exporting === 'word' ? '...' : '📝'} {t('downloadWord')}</button>
                        </div>
                      </div>
                      {(cv.personal.email || cv.personal.phone) && (
                        <div className="space-y-3 pt-3 border-t border-gray-100">
                          <h4 className="font-medium text-gray-700">{t('shareTitle')}</h4>
                          <div className="flex gap-3">
                            <button onClick={handleWhatsApp} className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-600">💬 {t('shareWhatsapp')}</button>
                            <button onClick={handleTelegram} className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600">✈️ {t('shareTelegram')}</button>
                          </div>
                        </div>
                      )}
                      {!user && (
                        <div className="space-y-3 pt-3 border-t border-gray-100">
                          <h4 className="font-medium text-gray-700">{t('saveTitle')}</h4>
                          <p className="text-xs text-gray-500">{t('saveDesc')}</p>
                          <button onClick={() => setAuthModal('signup')} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">{t('saveYes')}</button>
                        </div>
                      )}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button onClick={() => setStep(1)} className="flex-1 py-2 border rounded-xl text-gray-600 hover:bg-gray-50">✏️ {t('edit')}</button>
                        <button onClick={() => { setStep(0); setCv(initialCV); setErrors({}); setSaved(false); setActiveSocials([]); }} className="flex-1 py-2 border border-red-200 rounded-xl text-red-600 hover:bg-red-50">🔄 {t('restart')}</button>
                      </div>
                    </>
                  )}
                </div>
              )}

            </div>

            {/* Navigation */}
            {step < 9 && (
              <div className="flex justify-between mt-4">
                <button onClick={() => setStep(step - 1)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl">{rtl ? '→' : '←'} {t('back')}</button>
                <button onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700">{t('next')} {rtl ? '←' : '→'}</button>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          {step < 9 && (
            <div className="flex-1 hidden lg:block">
              <div className="sticky top-32">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-700">{t('preview')}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{t(template)}</span>
                </div>
                <div ref={cvRef} className="bg-white rounded-xl shadow-xl overflow-hidden border" style={{ minHeight: '500px' }}>
                  <div className="transform scale-[0.45] origin-top-left" style={{ width: '222%' }}>
                    <Comp data={cv} rtl={rtl} t={t} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="flex-1">
              <div ref={cvRef} className="bg-white rounded-xl shadow-xl overflow-hidden border">
                <Comp data={cv} rtl={rtl} t={t} />
              </div>
            </div>
          )}
        </div>
      </div>

      {preview && <PreviewModal tpl={preview} rtl={rtl} t={t} onClose={() => setPreview(null)} onSelect={setTemplate} sample={sample} />}
      {authModal && <AuthModal mode={authModal} t={t} rtl={rtl} onClose={() => setAuthModal(null)} onSubmit={handleAuth} onSwitch={() => setAuthModal(authModal === 'signin' ? 'signup' : 'signin')} loading={authLoading} />}
    </div>
  );
}
