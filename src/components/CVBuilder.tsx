// src/components/CVBuilder.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { translations } from '@/lib/translations';
import { validateCV } from '@/lib/validation';
import { generatePDF, generateWord, shareViaWhatsApp, shareViaTelegram } from '@/lib/export';
import { ProfessionalTemplate } from '@/templates';
import { DEGREE_TYPES, FIELDS_OF_STUDY, Density } from '@/lib/pdf/tokens';
import { validateEducation, generateDegreeString } from '@/lib/types';
import type { CVData, LanguageCode, ValidationErrors, SocialLinks, Education, CVSettings } from '@/lib/types';

// =============================================================================
// INITIAL DATA
// =============================================================================

const emptySocialLinks: SocialLinks = {
  linkedin: '', github: '', portfolio: '', twitter: '', instagram: '', behance: ''
};

const defaultSettings: CVSettings = { density: 'normal' };

const initialCV: CVData = {
  personal: { 
    fullName: '', jobTitle: '', email: '', phone: '', location: '', 
    dateOfBirth: '', photo: null, socialLinks: { ...emptySocialLinks }
  },
  summary: '', 
  experience: [], 
  education: [], 
  certifications: [], 
  skills: [], 
  languages: [],
  settings: { ...defaultSettings },
};

// =============================================================================
// REUSABLE COMPONENTS
// =============================================================================

function ValidationError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      <span>⚠️</span>{msg}
    </p>
  );
}

function Input({ 
  label, value, onChange, error, required, placeholder, type = 'text', tip, dir, disabled 
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  tip?: string;
  dir?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {tip && <p className="text-xs text-gray-400 mb-1">{tip}</p>}
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        dir={dir}
        disabled={disabled}
        className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
      />
      <ValidationError msg={error} />
    </div>
  );
}

function AuthModal({ mode, t, rtl, onClose, onSubmit, onSwitch, loading }: {
  mode: 'signin' | 'signup';
  t: (key: string) => any;
  rtl: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onSwitch: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const errs: Record<string, string> = {};
    if (mode === 'signup' && !form.name.trim()) errs.name = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password || form.password.length < 6) errs.password = 'Min 6 characters';
    if (mode === 'signup' && form.password !== form.confirm) errs.confirm = 'Passwords must match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()} dir={rtl ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {mode === 'signup' ? t('signupTitle') : t('signinTitle')}
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          {mode === 'signup' ? t('signupDesc') : t('signinDesc')}
        </p>
        
        <div className="space-y-3">
          {mode === 'signup' && (
            <Input 
              label={t('signupName')} 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              error={errors.name} 
              required 
            />
          )}
          <Input 
            label={t('signupEmail')} 
            type="email" 
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })} 
            error={errors.email} 
            required 
            dir="ltr" 
          />
          {mode === 'signup' && (
            <Input 
              label={t('signupPhone')} 
              type="tel" 
              value={form.phone} 
              onChange={e => setForm({ ...form, phone: e.target.value })} 
              dir="ltr" 
            />
          )}
          <Input 
            label={t('signupPassword')} 
            type="password" 
            value={form.password} 
            onChange={e => setForm({ ...form, password: e.target.value })} 
            error={errors.password} 
            required 
          />
          {mode === 'signup' && (
            <Input 
              label={t('signupConfirm')} 
              type="password" 
              value={form.confirm} 
              onChange={e => setForm({ ...form, confirm: e.target.value })} 
              error={errors.confirm} 
              required 
            />
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
          >
            {t('back')}
          </button>
          <button 
            onClick={() => validate() && onSubmit(form)} 
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

function DensitySelector({ 
  value, 
  onChange 
}: { 
  value: Density; 
  onChange: (d: Density) => void;
}) {
  const options: { key: Density; label: string; desc: string }[] = [
    { key: 'compact', label: 'Compact', desc: 'For CVs with lots of content' },
    { key: 'normal', label: 'Normal', desc: 'Balanced spacing (recommended)' },
    { key: 'spacious', label: 'Spacious', desc: 'For shorter CVs' },
  ];

  return (
    <div className="space-y-2">
      {options.map(opt => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
            value === opt.key 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-medium ${value === opt.key ? 'text-blue-700' : 'text-gray-800'}`}>
              {opt.label}
            </span>
            {value === opt.key && <span className="text-blue-600">✓</span>}
          </div>
          <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
        </button>
      ))}
    </div>
  );
}

// Social Icons Config
const socialIcons: Record<string, { icon: string; color: string }> = {
  linkedin: { icon: '💼', color: 'bg-blue-600' },
  github: { icon: '💻', color: 'bg-gray-800' },
  portfolio: { icon: '🌐', color: 'bg-purple-600' },
  twitter: { icon: '𝕏', color: 'bg-black' },
  instagram: { icon: '📷', color: 'bg-pink-500' },
  behance: { icon: '🎨', color: 'bg-blue-500' },
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CVBuilder() {
  // State
  const [lang, setLang] = useState<LanguageCode | null>(null);
  const [step, setStep] = useState(0);
  const [cv, setCv] = useState<CVData>(initialCV);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [exporting, setExporting] = useState<'pdf' | 'word' | null>(null);
  const [exportMode, setExportMode] = useState(false);
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; fullName: string } | null>(null);
  const [activeSocials, setActiveSocials] = useState<string[]>([]);
  const cvRef = useRef<HTMLDivElement>(null);

  // Load saved user
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('cvistan_user');
      const savedToken = localStorage.getItem('cvistan_token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to load user:', e);
    }
  }, []);

  // Translation helper
  const t = useCallback((key: string): any => {
    return (translations[lang || 'en'] as any)?.[key] || key;
  }, [lang]);

  // RTL check
  const rtl = lang === 'ar' || lang === 'ku';

  // Year arrays
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const birthYears = Array.from({ length: 80 }, (_, i) => currentYear - 16 - i);
  const months = (t('months') as string[]) || [];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Default skills suggestions
  const defaultSkills = [
    'Microsoft Office', 'Communication', 'Leadership', 'Problem Solving', 
    'Teamwork', 'Project Management', 'Time Management', 'Critical Thinking',
    'Customer Service', 'Data Analysis', 'Public Speaking', 'Adaptability'
  ];

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const showAlertMessage = (msg: string) => {
    setAlertMsg(msg);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const upd = (key: keyof CVData, value: any) => {
    setCv(prev => ({ ...prev, [key]: value }));
  };

  const updP = (key: keyof CVData['personal'], value: any) => {
    setCv(prev => ({ ...prev, personal: { ...prev.personal, [key]: value } }));
  };

  const updSocial = (key: keyof SocialLinks, value: string) => {
    setCv(prev => ({ 
      ...prev, 
      personal: { 
        ...prev.personal, 
        socialLinks: { ...prev.personal.socialLinks, [key]: value } 
      } 
    }));
  };

  const updSettings = (settings: CVSettings) => {
    setCv(prev => ({ ...prev, settings }));
  };

  const toggleSocial = (key: string) => {
    if (activeSocials.includes(key)) {
      setActiveSocials(activeSocials.filter(s => s !== key));
      updSocial(key as keyof SocialLinks, '');
    } else {
      setActiveSocials([...activeSocials, key]);
    }
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...cv.education];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'degreeType' || field === 'fieldOfStudy') {
      updated[index].degree = generateDegreeString(
        field === 'degreeType' ? value : updated[index].degreeType,
        field === 'fieldOfStudy' ? value : updated[index].fieldOfStudy
      );
    }
    
    upd('education', updated);
  };

  const handleNext = () => {
    // Validate education on step 4
    if (step === 4) {
      for (const edu of cv.education) {
        const error = validateEducation(edu);
        if (error) {
          showAlertMessage(error);
          return;
        }
      }
    }

    // Final validation on step 8
    if (step === 8) {
      const { isValid, errors: e } = validateCV(cv, t);
      setErrors(e);
      if (!isValid) { 
        showAlertMessage(t('validationError') as string);
        return; 
      }
    }
    
    setStep(step + 1);
  };

  const handlePdf = async () => {
    setExportMode(true);
    await new Promise(r => setTimeout(r, 100));
    setExporting('pdf');
    await generatePDF(cvRef.current, `CV-${cv.personal.fullName || 'Document'}.pdf`);
    setExporting(null);
    setExportMode(false);
  };

  const handleWord = async () => {
    setExporting('word');
    await generateWord(cv, months, `CV-${cv.personal.fullName || 'Document'}.docx`);
    setExporting(null);
  };

  const handleAuth = async (data: any) => {
    setAuthLoading(true);
    try {
      const endpoint = authModal === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          authModal === 'signup'
            ? { fullName: data.name, email: data.email, phone: data.phone, password: data.password }
            : { email: data.email, password: data.password }
        ),
      });
      const result = await res.json();
      
      if (result.success && result.token) {
        localStorage.setItem('cvistan_token', result.token);
        localStorage.setItem('cvistan_user', JSON.stringify(result.user));
        setUser(result.user);
        setAuthModal(null);
      } else {
        showAlertMessage(result.error || 'Authentication failed');
      }
    } catch (e) {
      console.error('Auth error:', e);
      showAlertMessage('Network error. Please try again.');
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('cvistan_token');
    localStorage.removeItem('cvistan_user');
    setUser(null);
  };

  const handleReset = () => {
    setCv(initialCV);
    setErrors({});
    setActiveSocials([]);
    setStep(0);
  };

  // =============================================================================
  // STEP 0: LANGUAGE SELECTION
  // =============================================================================

  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Auth Buttons */}
          <div className="flex justify-end gap-2 mb-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">👋 {user.fullName}</span>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setAuthModal('signin')} 
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setAuthModal('signup')} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl rotate-3">
              <span className="text-4xl">📝</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">CVistan</h1>
            <p className="text-gray-500">Build your professional CV in minutes</p>
          </div>

          {/* Language Selection */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-center mb-4">Select Your Language</h2>
            <div className="space-y-3">
              {[
                { code: 'en' as LanguageCode, name: 'English', flag: '🇺🇸' },
                { code: 'ar' as LanguageCode, name: 'العربية', flag: '🇸🇦' },
                { code: 'ku' as LanguageCode, name: 'کوردی', flag: '🇮🇶' },
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setStep(1); }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <span className="text-3xl">{l.flag}</span>
                  <span className="flex-1 text-left font-semibold text-gray-800 group-hover:text-blue-600">
                    {l.name}
                  </span>
                  <span className="text-gray-300 group-hover:text-blue-500">→</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            ✓ Free • ✓ No registration required • ✓ PDF & Word export
          </p>
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

  // =============================================================================
  // STEPS CONFIG (9 steps total)
  // =============================================================================

  const steps = [
    { key: 'personal', icon: '👤', title: 'Personal' },
    { key: 'summary', icon: '📝', title: 'Summary' },
    { key: 'experience', icon: '💼', title: 'Experience' },
    { key: 'education', icon: '🎓', title: 'Education' },
    { key: 'certifications', icon: '🏆', title: 'Certifications' },
    { key: 'skills', icon: '⭐', title: 'Skills' },
    { key: 'languages', icon: '🌍', title: 'Languages' },
    { key: 'settings', icon: '⚙️', title: 'Settings' },
    { key: 'review', icon: '📥', title: 'Download' },
  ];

  // =============================================================================
  // MAIN BUILDER UI
  // =============================================================================

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50">
      {/* Alert */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
          ⚠️ {alertMsg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm no-print">
        <div className="max-w-5xl mx-auto px-4 py-2 flex justify-between items-center">
          <button onClick={() => setStep(0)} className="font-bold text-blue-600 text-lg">
            CVistan
          </button>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">👋 {user.fullName}</span>
                <button onClick={handleLogout} className="text-xs text-red-600 hover:underline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setAuthModal('signin')} 
                  className="text-sm text-blue-600 hover:underline"
                >
                  {t('signIn')}
                </button>
                <button 
                  onClick={() => setAuthModal('signup')} 
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg"
                >
                  {t('signUp')}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-1 overflow-x-auto pb-1">
            {steps.map((s, i) => (
              <React.Fragment key={s.key}>
                <button
                  onClick={() => i + 1 <= step && setStep(i + 1)}
                  disabled={i + 1 > step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all ${
                    i + 1 === step
                      ? 'bg-blue-600 text-white shadow-lg scale-110'
                      : i + 1 < step
                      ? 'bg-green-500 text-white cursor-pointer'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  title={s.title}
                >
                  {i + 1 < step ? '✓' : s.icon}
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-3 h-1 rounded ${i + 1 < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-1">
            Step {step} of {steps.length} • <b>{steps[step - 1]?.title}</b>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Panel */}
          <div className="flex-1 lg:max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-5">
              
              {/* ========================================= */}
              {/* STEP 1: PERSONAL INFO */}
              {/* ========================================= */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Photo */}
                  <div className="text-center pb-3 border-b">
                    {cv.personal.photo ? (
                      <div className="relative inline-block">
                        <img src={cv.personal.photo} className="w-20 h-20 rounded-full object-cover shadow-lg" alt="" />
                        <button 
                          onClick={() => updP('photo', null)} 
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 mx-auto transition-all">
                        <span className="text-2xl text-gray-400">👤</span>
                        <span className="text-xs text-gray-500">{t('photo')}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={e => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const r = new FileReader();
                              r.onloadend = () => updP('photo', r.result as string);
                              r.readAsDataURL(f);
                            }
                          }} 
                        />
                      </label>
                    )}
                  </div>

                  <Input 
                    label={t('name')} 
                    value={cv.personal.fullName} 
                    onChange={e => updP('fullName', e.target.value)} 
                    error={errors.fullName} 
                    required 
                    placeholder={t('nameP')} 
                    tip={t('nameT')} 
                  />
                  
                  <Input 
                    label={t('title')} 
                    value={cv.personal.jobTitle} 
                    onChange={e => updP('jobTitle', e.target.value)} 
                    error={errors.jobTitle} 
                    required 
                    placeholder={t('titleP')} 
                    tip={t('titleT')} 
                  />
                  
                  <Input 
                    label={t('email')} 
                    type="email" 
                    value={cv.personal.email} 
                    onChange={e => updP('email', e.target.value)} 
                    placeholder={t('emailP')} 
                    dir="ltr" 
                  />
                  
                  <Input 
                    label={t('phone')} 
                    type="tel" 
                    value={cv.personal.phone} 
                    onChange={e => updP('phone', e.target.value)} 
                    error={errors.phone} 
                    required 
                    placeholder={t('phoneP')} 
                    dir="ltr" 
                  />
                  
                  <Input 
                    label={t('location')} 
                    value={cv.personal.location} 
                    onChange={e => updP('location', e.target.value)} 
                    placeholder={t('locationP')} 
                  />

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dob')} <span className="text-gray-400">({t('opt')})</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <select 
                        value={cv.personal.dateOfBirth.split('-')[2] || ''} 
                        onChange={e => {
                          const p = cv.personal.dateOfBirth.split('-');
                          updP('dateOfBirth', `${p[0] || ''}-${p[1] || ''}-${e.target.value}`);
                        }} 
                        className="px-2 py-2 border border-gray-200 rounded-xl text-sm"
                      >
                        <option value="">Day</option>
                        {days.map(d => <option key={d} value={d.toString().padStart(2, '0')}>{d}</option>)}
                      </select>
                      <select 
                        value={cv.personal.dateOfBirth.split('-')[1] || ''} 
                        onChange={e => {
                          const p = cv.personal.dateOfBirth.split('-');
                          updP('dateOfBirth', `${p[0] || ''}-${e.target.value}-${p[2] || ''}`);
                        }} 
                        className="px-2 py-2 border border-gray-200 rounded-xl text-sm"
                      >
                        <option value="">{t('month')}</option>
                        {months.map((m, i) => <option key={i} value={(i + 1).toString().padStart(2, '0')}>{m}</option>)}
                      </select>
                      <select 
                        value={cv.personal.dateOfBirth.split('-')[0] || ''} 
                        onChange={e => {
                          const p = cv.personal.dateOfBirth.split('-');
                          updP('dateOfBirth', `${e.target.value}-${p[1] || ''}-${p[2] || ''}`);
                        }} 
                        className="px-2 py-2 border border-gray-200 rounded-xl text-sm"
                      >
                        <option value="">{t('year')}</option>
                        {birthYears.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('socialLinks')} <span className="text-gray-400">({t('opt')})</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Object.entries(socialIcons).map(([key, { icon, color }]) => (
                        <button 
                          key={key} 
                          onClick={() => toggleSocial(key)} 
                          className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-all ${
                            activeSocials.includes(key) 
                              ? `${color} text-white` 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span>{icon}</span>
                          <span className="capitalize">{key}</span>
                          {activeSocials.includes(key) && <span>✓</span>}
                        </button>
                      ))}
                    </div>
                    {activeSocials.length > 0 && (
                      <div className="space-y-2 bg-gray-50 rounded-xl p-3">
                        {activeSocials.map(key => (
                          <div key={key} className="flex items-center gap-2">
                            <span className={`w-8 h-8 rounded-lg ${socialIcons[key].color} text-white flex items-center justify-center text-sm`}>
                              {socialIcons[key].icon}
                            </span>
                            <input 
                              type="url" 
                              value={cv.personal.socialLinks[key as keyof SocialLinks]} 
                              onChange={e => updSocial(key as keyof SocialLinks, e.target.value)} 
                              placeholder={`${key}.com/username`} 
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                              dir="ltr" 
                            />
                            <button 
                              onClick={() => toggleSocial(key)} 
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* STEP 2: SUMMARY */}
              {/* ========================================= */}
              {step === 2 && (
                <div>
                  <div className="bg-blue-50 rounded-xl p-3 mb-3 border border-blue-100">
                    <p className="text-blue-700 text-sm">💡 {t('sumH')}</p>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('sumTitle')} <span className="text-gray-400">({t('opt')})</span>
                  </label>
                  <textarea 
                    value={cv.summary} 
                    onChange={e => upd('summary', e.target.value)} 
                    placeholder={t('sumP')} 
                    rows={8} 
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {cv.summary.length} characters
                  </p>
                </div>
              )}

              {/* ========================================= */}
              {/* STEP 3: EXPERIENCE */}
              {/* ========================================= */}
              {step === 3 && (
                <div className="space-y-3">
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <p className="text-amber-700 text-sm">💡 {t('noExpH')}</p>
                  </div>
                  
                  {cv.experience.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <span className="text-4xl">💼</span>
                      <p className="text-gray-500 mt-2 mb-3">{t('noExp')}</p>
                      <button 
                        onClick={() => upd('experience', [...cv.experience, { 
                          id: Date.now().toString(), jobTitle: '', company: '', 
                          startMonth: '', startYear: '', endMonth: '', endYear: '', 
                          current: false, description: '' 
                        }])} 
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                      >
                        + {t('addExp')}
                      </button>
                    </div>
                  ) : (
                    cv.experience.map((exp, i) => (
                      <div key={exp.id} className="bg-gray-50 rounded-xl p-4 space-y-3 border">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">💼 Experience #{i + 1}</span>
                          <button 
                            onClick={() => upd('experience', cv.experience.filter((_, j) => j !== i))} 
                            className="text-red-500 hover:bg-red-50 px-2 py-1 rounded text-sm"
                          >
                            🗑️ Remove
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">{t('title')}*</label>
                            <input 
                              value={exp.jobTitle} 
                              onChange={e => {
                                const u = [...cv.experience];
                                u[i].jobTitle = e.target.value;
                                upd('experience', u);
                              }} 
                              placeholder={t('titleP')} 
                              className="w-full px-2 py-2 border rounded-lg text-sm" 
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">{t('company')}*</label>
                            <input 
                              value={exp.company} 
                              onChange={e => {
                                const u = [...cv.experience];
                                u[i].company = e.target.value;
                                upd('experience', u);
                              }} 
                              placeholder={t('companyP')} 
                              className="w-full px-2 py-2 border rounded-lg text-sm" 
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">{t('startD')}</label>
                            <div className="grid grid-cols-2 gap-1">
                              <select 
                                value={exp.startMonth} 
                                onChange={e => {
                                  const u = [...cv.experience];
                                  u[i].startMonth = e.target.value;
                                  upd('experience', u);
                                }} 
                                className="px-1 py-1.5 border rounded text-xs"
                              >
                                <option value="">{t('month')}</option>
                                {months.map((m, j) => <option key={j} value={j + 1}>{m}</option>)}
                              </select>
                              <select 
                                value={exp.startYear} 
                                onChange={e => {
                                  const u = [...cv.experience];
                                  u[i].startYear = e.target.value;
                                  upd('experience', u);
                                }} 
                                className="px-1 py-1.5 border rounded text-xs"
                              >
                                <option value="">{t('year')}</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">{t('endD')}</label>
                            <div className="grid grid-cols-2 gap-1">
                              <select 
                                value={exp.endMonth} 
                                onChange={e => {
                                  const u = [...cv.experience];
                                  u[i].endMonth = e.target.value;
                                  upd('experience', u);
                                }} 
                                disabled={exp.current} 
                                className="px-1 py-1.5 border rounded text-xs disabled:opacity-50"
                              >
                                <option value="">{t('month')}</option>
                                {months.map((m, j) => <option key={j} value={j + 1}>{m}</option>)}
                              </select>
                              <select 
                                value={exp.endYear} 
                                onChange={e => {
                                  const u = [...cv.experience];
                                  u[i].endYear = e.target.value;
                                  upd('experience', u);
                                }} 
                                disabled={exp.current} 
                                className="px-1 py-1.5 border rounded text-xs disabled:opacity-50"
                              >
                                <option value="">{t('year')}</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={exp.current} 
                            onChange={e => {
                              const u = [...cv.experience];
                              u[i].current = e.target.checked;
                              upd('experience', u);
                            }} 
                            className="w-4 h-4 rounded text-blue-600" 
                          />
                          <span className="text-sm text-gray-600">{t('current')}</span>
                        </label>
                        
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t('desc')}</label>
                          <textarea 
                            value={exp.description} 
                            onChange={e => {
                              const u = [...cv.experience];
                              u[i].description = e.target.value;
                              upd('experience', u);
                            }} 
                            placeholder={t('descP')} 
                            rows={4} 
                            className="w-full px-2 py-2 border rounded-lg text-sm resize-none" 
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            💡 Use bullet points (• or -) for better formatting
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {cv.experience.length > 0 && (
                    <button 
                      onClick={() => upd('experience', [...cv.experience, { 
                        id: Date.now().toString(), jobTitle: '', company: '', 
                        startMonth: '', startYear: '', endMonth: '', endYear: '', 
                        current: false, description: '' 
                      }])} 
                      className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all"
                    >
                      + {t('addExp')}
                    </button>
                  )}
                </div>
              )}

              {/* ========================================= */}
              {/* STEP 4: EDUCATION */}
              {/* ========================================= */}
              {step === 4 && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <p className="text-emerald-700 text-sm">💡 {t('noEduH')}</p>
                  </div>
                  
                  {cv.education.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <span className="text-4xl">🎓</span>
                      <p className="text-gray-500 mt-2 mb-3">{t('noEdu')}</p>
                      <button 
                        onClick={() => upd('education', [...cv.education, { 
                          id: Date.now().toString(), degreeType: '', fieldOfStudy: '', 
                          degree: '', institution: '', gradMonth: '', gradYear: '', 
                          gpa: '', thesisTitle: '' 
                        }])} 
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                      >
                        + {t('addEdu')}
                      </button>
                    </div>
                  ) : (
                    cv.education.map((edu, i) => {
                      const eduError = validateEducation(edu);
                      return (
                        <div 
                          key={edu.id} 
                          className={`bg-gray-50 rounded-xl p-4 space-y-3 border ${eduError ? 'border-red-300' : ''}`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">🎓 Education #{i + 1}</span>
                            <button 
                              onClick={() => upd('education', cv.education.filter((_, j) => j !== i))} 
                              className="text-red-500 hover:bg-red-50 px-2 py-1 rounded text-sm"
                            >
                              🗑️ Remove
                            </button>
                          </div>
                          
                          {eduError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                              <p className="text-red-600 text-xs">⚠️ {eduError}</p>
                            </div>
                          )}
                          
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Degree Type*</label>
                            <select 
                              value={edu.degreeType} 
                              onChange={e => updateEducation(i, 'degreeType', e.target.value)} 
                              className="w-full px-2 py-2 border rounded-lg text-sm"
                            >
                              <option value="">Select degree type...</option>
                              {DEGREE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Field of Study</label>
                            <select 
                              value={edu.fieldOfStudy} 
                              onChange={e => updateEducation(i, 'fieldOfStudy', e.target.value)} 
                              className="w-full px-2 py-2 border rounded-lg text-sm"
                            >
                              <option value="">Select field...</option>
                              {FIELDS_OF_STUDY.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                          </div>
                          
                          {edu.degree && (
                            <div className="bg-blue-50 rounded-lg p-2">
                              <p className="text-xs text-gray-500">Generated degree:</p>
                              <p className="text-sm font-medium text-blue-700">{edu.degree}</p>
                            </div>
                          )}
                          
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">{t('inst')}*</label>
                            <input 
                              value={edu.institution} 
                              onChange={e => updateEducation(i, 'institution', e.target.value)} 
                              placeholder={t('instP')} 
                              className="w-full px-2 py-2 border rounded-lg text-sm" 
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">{t('gradD')}</label>
                            <div className="grid grid-cols-2 gap-2">
                              <select 
                                value={edu.gradMonth} 
                                onChange={e => updateEducation(i, 'gradMonth', e.target.value)} 
                                className="px-2 py-2 border rounded-lg text-sm"
                              >
                                <option value="">{t('month')}</option>
                                {months.map((m, j) => <option key={j} value={j + 1}>{m}</option>)}
                              </select>
                              <select 
                                value={edu.gradYear} 
                                onChange={e => updateEducation(i, 'gradYear', e.target.value)} 
                                className="px-2 py-2 border rounded-lg text-sm"
                              >
                                <option value="">{t('year')}</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">{t('gpa')}</label>
                              <input 
                                value={edu.gpa} 
                                onChange={e => updateEducation(i, 'gpa', e.target.value)} 
                                placeholder="3.8" 
                                className="w-full px-2 py-2 border rounded-lg text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">{t('thesis')}</label>
                              <input 
                                value={edu.thesisTitle} 
                                onChange={e => updateEducation(i, 'thesisTitle', e.target.value)} 
                                placeholder="Optional" 
                                className="w-full px-2 py-2 border rounded-lg text-sm" 
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  
                  {cv.education.length > 0 && (
                    <button 
                      onClick={() => upd('education', [...cv.education, { 
                        id: Date.now().toString(), degreeType: '', fieldOfStudy: '', 
                        degree: '', institution: '', gradMonth: '', gradYear: '', 
                        gpa: '', thesisTitle: '' 
                      }])} 
                      className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all"
                    >
                      + {t('addEdu')}
                    </button>
                  )}
                </div>
              )}

              {/* ========================================= */}
              {/* STEP 5: CERTIFICATIONS */}
              {/* ========================================= */}
              {step === 5 && (
                <div className="space-y-3">
                  <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                    <p className="text-purple-700 text-sm">💡 {t('noCertH')}</p>
                  </div>
                  
                  {cv.certifications.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <span className="text-4xl">🏆</span>
                      <p className="text-gray-500 mt-2 mb-3">{t('noCert')}</p>
                      <button 
                        onClick={() => upd('certifications', [...cv.certifications, { 
                          id: Date.now().toString(), name: '', issuer: '', 
                          issueMonth: '', issueYear: '', expiryMonth: '', expiryYear: '', 
                          noExpiry: false, credentialId: '', credentialUrl: '', mode: '' 
                        }])} 
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                      >
                        + {t('addCert')}
                      </button>
                    </div>
                  ) : (
                    cv.certifications.map((cert, i) => (
                      <div key={cert.id} className="bg-gray-50 rounded-xl p-4 space-y-3 border">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">🏆 Certification #{i + 1}</span>
                          <button 
                            onClick={() => upd('certifications', cv.certifications.filter((_, j) => j !== i))} 
                            className="text-red-500 hover:bg-red-50 px-2 py-1 rounded text-sm"
                          >
                            🗑️ Remove
                          </button>
                        </div>
                        
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t('certName')}*</label>
                          <input 
                            value={cert.name} 
                            onChange={e => {
                              const u = [...cv.certifications];
                              u[i].name = e.target.value;
                              upd('certifications', u);
                            }} 
                            placeholder={t('certNameP')} 
                            className="w-full px-2 py-2 border rounded-lg text-sm" 
                          />
                        </div>
                        
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t('certIssuer')}*</label>
                          <input 
                            value={cert.issuer} 
                            onChange={e => {
                              const u = [...cv.certifications];
                              u[i].issuer = e.target.value;
                              upd('certifications', u);
                            }} 
                            placeholder={t('certIssuerP')} 
                            className="w-full px-2 py-2 border rounded-lg text-sm" 
                          />
                        </div>
                        
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t('certIssueD')}</label>
                          <div className="grid grid-cols-2 gap-2">
                            <select 
                              value={cert.issueMonth} 
                              onChange={e => {
                                const u = [...cv.certifications];
                                u[i].issueMonth = e.target.value;
                                upd('certifications', u);
                              }} 
                              className="px-2 py-2 border rounded-lg text-sm"
                            >
                              <option value="">{t('month')}</option>
                              {months.map((m, j) => <option key={j} value={j + 1}>{m}</option>)}
                            </select>
                            <select 
                              value={cert.issueYear} 
                              onChange={e => {
                                const u = [...cv.certifications];
                                u[i].issueYear = e.target.value;
                                upd('certifications', u);
                              }} 
                              className="px-2 py-2 border rounded-lg text-sm"
                            >
                              <option value="">{t('year')}</option>
                              {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                        </div>
                        
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={cert.noExpiry} 
                            onChange={e => {
                              const u = [...cv.certifications];
                              u[i].noExpiry = e.target.checked;
                              upd('certifications', u);
                            }} 
                            className="w-4 h-4 rounded" 
                          />
                          <span className="text-sm text-gray-600">{t('certNoExpiry')}</span>
                        </label>
                        
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t('certMode')}</label>
                          <div className="flex gap-2">
                            <button 
                              type="button"
                              onClick={() => {
                                const u = [...cv.certifications];
                                u[i].mode = 'online';
                                upd('certifications', u);
                              }} 
                              className={`flex-1 py-2 rounded-lg text-sm border transition-all ${
                                cert.mode === 'online' 
                                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              🌐 {t('certOnline')}
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                const u = [...cv.certifications];
                                u[i].mode = 'in-person';
                                upd('certifications', u);
                              }} 
                              className={`flex-1 py-2 rounded-lg text-sm border transition-all ${
                                cert.mode === 'in-person' 
                                  ? 'bg-green-100 border-green-500 text-green-700' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              🏢 {t('certInPerson')}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t('certCredId')} ({t('opt')})</label>
                          <input 
                            value={cert.credentialId} 
                            onChange={e => {
                              const u = [...cv.certifications];
                              u[i].credentialId = e.target.value;
                              upd('certifications', u);
                            }} 
                            placeholder="ABC-12345" 
                            className="w-full px-2 py-2 border rounded-lg text-sm" 
                          />
                        </div>
                      </div>
                    ))
                  )}
                  
                  {cv.certifications.length > 0 && (
                    <button 
                      onClick={() => upd('certifications', [...cv.certifications, { 
                        id: Date.now().toString(), name: '', issuer: '', 
                        issueMonth: '', issueYear: '', expiryMonth: '', expiryYear: '', 
                        noExpiry: false, credentialId: '', credentialUrl: '', mode: '' 
                      }])} 
                      className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all"
                    >
                      + {t('addCert')}
                    </button>
                  )}
                </div>
              )}

              {/* ========================================= */}
              {/* STEP 6: SKILLS */}
              {/* ========================================= */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                    <p className="text-orange-700 text-sm">💡 {t('skillH')}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <input 
                      id="skill-input" 
                      placeholder={t('skillP')} 
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            upd('skills', [...cv.skills, input.value.trim()]);
                            input.value = '';
                          }
                        }
                      }} 
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById('skill-input') as HTMLInputElement;
                        if (input.value.trim()) {
                          upd('skills', [...cv.skills, input.value.trim()]);
                          input.value = '';
                        }
                      }} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                      +
                    </button>
                  </div>
                  
                  {cv.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cv.skills.map((s, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                        >
                          {s}
                          <button 
                            onClick={() => upd('skills', cv.skills.filter((_, j) => j !== i))} 
                            className="text-blue-500 hover:text-blue-700 font-bold ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">{t('suggest')}</p>
                    <div className="flex flex-wrap gap-1">
                      {defaultSkills
                        .filter(s => !cv.skills.includes(s))
                        .slice(0, 12)
                        .map(s => (
                          <button 
                            key={s} 
                            onClick={() => upd('skills', [...cv.skills, s])} 
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-blue-100 hover:text-blue-700 transition-all"
                          >
                            + {s}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* STEP 7: LANGUAGES */}
              {/* ========================================= */}
              {step === 7 && (
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-green-700 text-sm">💡 {t('langT')}</p>
                  </div>
                  
                  {cv.languages.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <span className="text-4xl">🌍</span>
                      <p className="text-gray-500 mt-2 mb-3">No languages added yet</p>
                      <button 
                        onClick={() => upd('languages', [...cv.languages, { name: '', level: t('fluent') as string }])} 
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                      >
                        + {t('addLang')}
                      </button>
                    </div>
                  ) : (
                    cv.languages.map((lang, i) => (
                      <div key={i} className="flex gap-2 items-center bg-gray-50 p-3 rounded-xl">
                        <input 
                          value={lang.name} 
                          onChange={e => {
                            const u = [...cv.languages];
                            u[i].name = e.target.value;
                            upd('languages', u);
                          }} 
                          placeholder={t('langP')} 
                          className="flex-1 px-3 py-2 border rounded-lg text-sm" 
                        />
                        <select 
                          value={lang.level} 
                          onChange={e => {
                            const u = [...cv.languages];
                            u[i].level = e.target.value;
                            upd('languages', u);
                          }} 
                          className="px-3 py-2 border rounded-lg text-sm"
                        >
                          {['native', 'fluent', 'conv', 'basic'].map(x => (
                            <option key={x} value={t(x) as string}>{t(x)}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => upd('languages', cv.languages.filter((_, j) => j !== i))} 
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  )}
                  
                  {cv.languages.length > 0 && (
                    <button 
                      onClick={() => upd('languages', [...cv.languages, { name: '', level: t('fluent') as string }])} 
                      className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all"
                    >
                      + {t('addLang')}
                    </button>
                  )}
                </div>
              )}

              {/* ========================================= */}
              {/* STEP 8: SETTINGS */}
              {/* ========================================= */}
              {step === 8 && (
                <div className="space-y-4">
                  <div className="text-center pb-3 border-b">
                    <span className="text-4xl">⚙️</span>
                    <h3 className="font-semibold text-gray-800 mt-2">Layout Settings</h3>
                    <p className="text-sm text-gray-500">Adjust spacing to fit your content</p>
                  </div>
                  
                  <DensitySelector 
                    value={cv.settings?.density || 'normal'} 
                    onChange={d => updSettings({ ...cv.settings, density: d })} 
                  />
                  
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h4 className="font-medium text-blue-700 text-sm mb-2">💡 Recommendations</h4>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li>• <b>Compact:</b> 3+ jobs, lots of bullet points</li>
                      <li>• <b>Normal:</b> 1-3 jobs, standard content</li>
                      <li>• <b>Spacious:</b> Entry-level, fewer items</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* STEP 9: REVIEW & DOWNLOAD */}
              {/* ========================================= */}
              {step === 9 && (
                <div className="space-y-5">
                  <div className="text-center pb-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-3">
                      <span className="text-3xl">🎉</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{t('done')}</h3>
                    <p className="text-gray-500 text-sm">{t('downloadT')}</p>
                  </div>
                  
                  {/* Export Buttons */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">{t('exportTitle')}</h4>
                    <div className="flex gap-3">
                      <button 
                        onClick={handlePdf} 
                        disabled={exporting === 'pdf'} 
                        className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:from-red-600 hover:to-red-700 disabled:opacity-70 transition-all"
                      >
                        {exporting === 'pdf' ? '⏳ Generating...' : '📄 PDF'}
                      </button>
                      <button 
                        onClick={handleWord} 
                        disabled={exporting === 'word'} 
                        className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-70 transition-all"
                      >
                        {exporting === 'word' ? '⏳ Generating...' : '📝 Word'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Share Buttons */}
                  {(cv.personal.email || cv.personal.phone) && (
                    <div className="space-y-3 pt-3 border-t">
                      <h4 className="font-medium text-gray-700">{t('shareTitle')}</h4>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => shareViaWhatsApp(cv.personal.phone, `CV: ${cv.personal.fullName}`)} 
                          className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all"
                        >
                          💬 WhatsApp
                        </button>
                        <button 
                          onClick={() => shareViaTelegram(`CV: ${cv.personal.fullName} - ${cv.personal.jobTitle}`)} 
                          className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all"
                        >
                          ✈️ Telegram
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <button 
                      onClick={() => setStep(1)} 
                      className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      ✏️ {t('edit')}
                    </button>
                    <button 
                      onClick={handleReset} 
                      className="flex-1 py-2 border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                    >
                      🔄 {t('restart')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            {step < 9 && (
              <div className="flex justify-between mt-4 no-print">
                <button 
                  onClick={() => setStep(step - 1)} 
                  className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  ← {t('back')}
                </button>
                <button 
                  onClick={handleNext} 
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all"
                >
                  {t('next')} →
                </button>
              </div>
            )}
          </div>

          {/* ========================================= */}
          {/* PREVIEW PANEL */}
          {/* ========================================= */}
          <div className={`flex-1 ${step === 9 ? '' : 'hidden lg:block'}`}>
            <div className={step === 9 ? '' : 'sticky top-32'}>
              {step < 9 && (
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-700">{t('preview')}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded capitalize">
                    {cv.settings?.density || 'normal'}
                  </span>
                </div>
              )}
              
              <div 
                ref={cvRef}
                className={`bg-white rounded-xl shadow-xl overflow-hidden border ${
                  exportMode ? 'export-mode' : ''
                }`}
                style={step < 9 ? { maxHeight: '70vh', overflow: 'auto' } : {}}
              >
                {step < 9 ? (
                  <div 
                    className="transform origin-top-left" 
                    style={{ transform: 'scale(0.48)', width: '208%' }}
                  >
                    <ProfessionalTemplate data={cv} rtl={rtl} t={t} />
                  </div>
                ) : (
                  <ProfessionalTemplate data={cv} rtl={rtl} t={t} exportMode={exportMode} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {authModal && (
        <AuthModal
          mode={authModal}
          t={t}
          rtl={rtl}
          onClose={() => setAuthModal(null)}
          onSubmit={handleAuth}
          onSwitch={() => setAuthModal(authModal === 'signin' ? 'signup' : 'signin')}
          loading={authLoading}
        />
      )}
    </div>
  );
}
