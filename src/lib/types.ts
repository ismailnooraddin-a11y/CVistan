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

export interface Education {
  id: string;
  degreeType: string;
  fieldOfStudy: string;
  degree: string;
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

export interface CVSettings {
  density: 'compact' | 'normal' | 'spacious';
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

// Single template now
export type TemplateId = 'professional';

export type LanguageCode = 'en' | 'ar' | 'ku';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
}

// Education validation
export const validateEducation = (edu: Education): string | null => {
  const degreeType = edu.degreeType?.toLowerCase() || '';
  const field = edu.fieldOfStudy?.toLowerCase() || '';
  
  if (degreeType.includes('bachelor') && field.includes('mba')) {
    return 'MBA is a Master\'s degree. Please select "Master\'s Degree" for MBA.';
  }
  
  if (degreeType.includes('bachelor') && field.includes('phd')) {
    return 'PhD is a Doctoral degree, not a Bachelor\'s.';
  }
  
  return null;
};

// Generate degree string
export const generateDegreeString = (degreeType: string, fieldOfStudy: string): string => {
  if (!degreeType && !fieldOfStudy) return '';
  if (!fieldOfStudy || fieldOfStudy.toLowerCase() === 'other') return degreeType;
  if (!degreeType) return fieldOfStudy;
  
  if (degreeType.toLowerCase().includes('high school')) return degreeType;
  if (fieldOfStudy.toLowerCase() === 'mba') return 'MBA';
  
  return `${degreeType} in ${fieldOfStudy}`;
};
