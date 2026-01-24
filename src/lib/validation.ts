// src/lib/validation.ts
// Validation utilities for CV data

import { CVData, ValidationResult, ValidationErrors } from './types';

/**
 * Validates CV data before submission
 * Rules:
 * 1. Full Name is required
 * 2. Job Title is required  
 * 3. At least one of: Experience, Education, or Skills must be filled
 */
export function validateCV(
  cv: CVData, 
  t: (key: string) => string
): ValidationResult {
  const errors: ValidationErrors = {};
  
  // Required: Full Name
  if (!cv.personal.fullName?.trim()) {
    errors.fullName = t('reqName');
  }
  
  // Required: Job Title
  if (!cv.personal.jobTitle?.trim()) {
    errors.jobTitle = t('reqTitle');
  }
  
  // Required: At least one section
  const hasExperience = cv.experience.length > 0 && 
    cv.experience.some(e => e.jobTitle?.trim() && e.company?.trim());
  
  const hasEducation = cv.education.length > 0 && 
    cv.education.some(e => e.degree?.trim() && e.institution?.trim());
  
  const hasSkills = cv.skills.length > 0;
  
  if (!hasExperience && !hasEducation && !hasSkills) {
    errors.sections = t('reqSection');
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates phone number (basic check)
 */
export function isValidPhone(phone: string): boolean {
  return /^[\d\s+\-()]{8,}$/.test(phone);
}

/**
 * Validates password strength
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Validates signup form
 */
export function validateSignup(
  data: { name: string; email: string; password: string; confirm: string },
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};
  
  if (!data.name?.trim()) {
    errors.name = t('reqField');
  }
  
  if (!data.email?.trim() || !isValidEmail(data.email)) {
    errors.email = t('reqField');
  }
  
  if (!data.password || !isValidPassword(data.password)) {
    errors.password = t('reqField');
  }
  
  if (data.password !== data.confirm) {
    errors.confirm = t('passwordMismatch');
  }
  
  return errors;
}
