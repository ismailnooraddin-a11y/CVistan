// src/lib/validation.ts
import type { CVData, ValidationResult, ValidationErrors } from './types';
import { validateEducation } from './types';

export function validateCV(
  cv: CVData,
  t: (key: string) => string | string[]
): ValidationResult {
  const errors: ValidationErrors = {};
  let isValid = true;

  // Required fields
  if (!cv.personal.fullName.trim()) {
    errors.fullName = t('reqName') as string;
    isValid = false;
  }

  if (!cv.personal.jobTitle.trim()) {
    errors.jobTitle = t('reqTitle') as string;
    isValid = false;
  }

  if (!cv.personal.phone.trim()) {
    errors.phone = t('reqPhone') as string;
    isValid = false;
  }

  // Must have at least one section filled
  const hasContent =
    cv.experience.length > 0 ||
    cv.education.length > 0 ||
    cv.skills.length > 0 ||
    cv.certifications.length > 0;

  if (!hasContent) {
    errors.sections = t('reqSection') as string;
    isValid = false;
  }

  // Validate education entries
  for (const edu of cv.education) {
    const eduError = validateEducation(edu);
    if (eduError) {
      errors.education = eduError;
      isValid = false;
      break;
    }
  }

  return { isValid, errors };
}

// Normalize text input
export function normalizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n');
}

// Validate email format
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validate phone format (basic)
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return cleaned.length >= 10 && /^\+?[\d]+$/.test(cleaned);
}
