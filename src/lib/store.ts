// src/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CVData, LanguageCode, TemplateId } from './types';

const initialCV: CVData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    photo: null,
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: '',
      twitter: '',
      instagram: '',
      behance: '',
    },
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
};

interface CVStore {
  cv: CVData;
  language: LanguageCode;
  template: TemplateId;
  token: string | null;
  setCV: (cv: CVData) => void;
  updatePersonal: (key: keyof CVData['personal'], value: any) => void;
  updateSocialLink: (key: string, value: string) => void;
  setSummary: (summary: string) => void;
  setExperience: (experience: CVData['experience']) => void;
  setEducation: (education: CVData['education']) => void;
  setSkills: (skills: string[]) => void;
  setLanguages: (languages: CVData['languages']) => void;
  setLanguage: (lang: LanguageCode) => void;
  setTemplate: (template: TemplateId) => void;
  setToken: (token: string | null) => void;
  reset: () => void;
}

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cv: initialCV,
      language: 'en',
      template: 'modern',
      token: null,
      setCV: (cv) => set({ cv }),
      updatePersonal: (key, value) =>
        set((state) => ({
          cv: {
            ...state.cv,
            personal: { ...state.cv.personal, [key]: value },
          },
        })),
      updateSocialLink: (key, value) =>
        set((state) => ({
          cv: {
            ...state.cv,
            personal: {
              ...state.cv.personal,
              socialLinks: { ...state.cv.personal.socialLinks, [key]: value },
            },
          },
        })),
      setSummary: (summary) =>
        set((state) => ({ cv: { ...state.cv, summary } })),
      setExperience: (experience) =>
        set((state) => ({ cv: { ...state.cv, experience } })),
      setEducation: (education) =>
        set((state) => ({ cv: { ...state.cv, education } })),
      setSkills: (skills) =>
        set((state) => ({ cv: { ...state.cv, skills } })),
      setLanguages: (languages) =>
        set((state) => ({ cv: { ...state.cv, languages } })),
      setLanguage: (language) => set({ language }),
      setTemplate: (template) => set({ template }),
      setToken: (token) => set({ token }),
      reset: () => set({ cv: initialCV, token: null }),
    }),
    {
      name: 'cv-storage',
    }
  )
);
