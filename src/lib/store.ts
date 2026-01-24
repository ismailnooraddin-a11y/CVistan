// src/lib/store.ts
// Global state management with Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CVData, LanguageCode, TemplateId, User, ValidationErrors } from './types';

// Initial empty CV data
const initialCVData: CVData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    photo: null,
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
};

interface CVStore {
  // Language
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  
  // Current step
  step: number;
  setStep: (step: number) => void;
  
  // Template
  template: TemplateId;
  setTemplate: (template: TemplateId) => void;
  
  // CV Data
  cvData: CVData;
  setCvData: (data: CVData) => void;
  updatePersonal: <K extends keyof CVData['personal']>(
    key: K, 
    value: CVData['personal'][K]
  ) => void;
  updateField: <K extends keyof CVData>(key: K, value: CVData[K]) => void;
  
  // Validation
  validationErrors: ValidationErrors;
  setValidationErrors: (errors: ValidationErrors) => void;
  
  // User auth
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;
  
  // Reset
  reset: () => void;
}

export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
      // Language
      language: 'en',
      setLanguage: (language) => set({ language }),
      
      // Step
      step: 0,
      setStep: (step) => set({ step }),
      
      // Template
      template: 'modern',
      setTemplate: (template) => set({ template }),
      
      // CV Data
      cvData: initialCVData,
      setCvData: (cvData) => set({ cvData }),
      updatePersonal: (key, value) => set((state) => ({
        cvData: {
          ...state.cvData,
          personal: {
            ...state.cvData.personal,
            [key]: value,
          },
        },
      })),
      updateField: (key, value) => set((state) => ({
        cvData: {
          ...state.cvData,
          [key]: value,
        },
      })),
      
      // Validation
      validationErrors: {},
      setValidationErrors: (validationErrors) => set({ validationErrors }),
      
      // User
      user: null,
      token: null,
      setUser: (user, token = null) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      
      // Reset
      reset: () => set({
        step: 0,
        cvData: initialCVData,
        validationErrors: {},
      }),
    }),
    {
      name: 'cv-maker-storage',
      partialize: (state) => ({
        language: state.language,
        template: state.template,
        cvData: state.cvData,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

// Selector hooks for performance
export const useLanguage = () => useCVStore((state) => state.language);
export const useStep = () => useCVStore((state) => state.step);
export const useTemplate = () => useCVStore((state) => state.template);
export const useCVData = () => useCVStore((state) => state.cvData);
export const useUser = () => useCVStore((state) => state.user);
