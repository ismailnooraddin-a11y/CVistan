// src/lib/types.ts

export interface SocialLinks {
  linkedin: string;
  github: string;
  portfolio: string;
  twitter: string;
  instagram: string;
  behance: string;
}

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  photo: string | null;
  socialLinks: SocialLinks;
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

// Updated Education with separate degree type and field
export interface Education {
  id: string;
  degreeType: string; // e.g., "Bachelor's Degree"
  fieldOfStudy: string; // e.g., "Computer Science"
  degree: string; // Full display string (auto-generated or custom)
  institution: string;
  gradMonth: string;
  gradYear: string;
  gpa: string;
  thesisTitle: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueMonth: string;
  issueYear: string;
  expiryMonth: string;
  expiryYear: string;
  noExpiry: boolean;
  credentialId: string;
  credentialUrl: string;
  mode: 'online' | 'in-person' | '';
}

export interface Language {
  name: string;
  level: string;
}

// CV Display Settings
export interface CVSettings {
  density: 'compact' | 'normal' | 'spacious';
  fontSize: 'small' | 'medium' | 'large';
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: string[];
  languages: Language[];
  settings?: CVSettings;
}

export interface ValidationErrors {
  fullName?: string;
  jobTitle?: string;
  phone?: string;
  sections?: string;
  education?: string;
  [key: string]: string | undefined;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export type TemplateId = 'morgan' | 'catrine' | 'sarah' | 'olivia';

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

// Education validation helper
export const validateEducation = (edu: Education): string | null => {
  const degreeType = edu.degreeType?.toLowerCase() || '';
  const field = edu.fieldOfStudy?.toLowerCase() || '';
  
  // Check for invalid combinations
  if (degreeType.includes('bachelor') && field.includes('mba')) {
    return 'MBA is a Master\'s degree, not a Bachelor\'s. Please select "Master\'s Degree" for MBA.';
  }
  
  if (degreeType.includes('bachelor') && field.includes('phd')) {
    return 'PhD is a Doctoral degree, not a Bachelor\'s.';
  }
  
  if (degreeType.includes('high school') && field && field !== 'general' && field !== 'other') {
    return 'High School Diploma typically doesn\'t have a specific field of study.';
  }
  
  return null;
};

// Generate full degree string
export const generateDegreeString = (degreeType: string, fieldOfStudy: string): string => {
  if (!degreeType && !fieldOfStudy) return '';
  if (!fieldOfStudy || fieldOfStudy.toLowerCase() === 'other') return degreeType;
  if (!degreeType) return fieldOfStudy;
  
  // Handle special cases
  if (degreeType.toLowerCase().includes('high school')) return degreeType;
  if (fieldOfStudy.toLowerCase() === 'mba' || fieldOfStudy.toLowerCase() === 'business administration') {
    if (degreeType.toLowerCase().includes('master')) return 'MBA';
  }
  
  return `${degreeType} in ${fieldOfStudy}`;
};
