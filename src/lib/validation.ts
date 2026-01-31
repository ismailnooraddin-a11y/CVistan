// src/lib/validation.ts
import { CVData, ValidationResult, ValidationErrors } from './types';

export function validateCV(
  cv: CVData,
  t: (key: string) => string
): ValidationResult {
  const errors: ValidationErrors = {};

  // Required: Full Name
  if (!cv.personal.fullName.trim()) {
    errors.fullName = t('reqName');
  }

  // Required: Job Title
  if (!cv.personal.jobTitle.trim()) {
    errors.jobTitle = t('reqTitle');
  }

  // Required: Phone Number
  if (!cv.personal.phone.trim()) {
    errors.phone = t('reqPhone');
  }

  // At least one section must have content
  const hasExperience = cv.experience.length > 0 && cv.experience.some(
    exp => exp.jobTitle.trim() && exp.company.trim()
  );
  const hasEducation = cv.education.length > 0 && cv.education.some(
    edu => edu.degree.trim() && edu.institution.trim()
  );
  const hasSkills = cv.skills.length > 0;

  if (!hasExperience && !hasEducation && !hasSkills) {
    errors.sections = t('reqSection');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
