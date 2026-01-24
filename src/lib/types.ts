// src/lib/types.ts
// Core type definitions for CV Maker

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  photo: string | null;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  gradMonth: string;
  gradYear: string;
  gpa: string;
  thesisTitle: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
}

export interface ValidationErrors {
  fullName?: string;
  jobTitle?: string;
  sections?: string;
  [key: string]: string | undefined;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export type TemplateId = 
  | 'classic' 
  | 'modern' 
  | 'executive' 
  | 'creative' 
  | 'minimal' 
  | 'tech' 
  | 'academic' 
  | 'professional';

export type LanguageCode = 'en' | 'ar' | 'ku';

export interface TemplateConfig {
  id: TemplateId;
  icon: string;
  gradient: string;
  category: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface SaveCVResponse {
  success: boolean;
  cvId?: string;
  error?: string;
}
