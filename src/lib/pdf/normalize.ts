// src/lib/pdf/normalize.ts
// Normalize user content before rendering

import type { CVData, Experience, Education, Certification } from '../types';
import { LIMITS } from './tokens';

// Trim and clean text
const cleanText = (text: string | undefined | null): string => {
  if (!text) return '';
  return text
    .trim()
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .replace(/\n{3,}/g, '\n\n'); // collapse multiple line breaks
};

// Truncate text with ellipsis
const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + '...';
};

// Format date consistently
const formatDate = (
  month: string,
  year: string,
  months: string[]
): string => {
  if (!year) return '';
  if (month && months[parseInt(month) - 1]) {
    return `${months[parseInt(month) - 1]} ${year}`;
  }
  return year;
};

// Normalize bullets in description
const normalizeBullets = (description: string): string[] => {
  if (!description) return [];
  
  // Split by newlines or bullet points
  const lines = description
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      // Remove existing bullet characters
      return line.replace(/^[•\-\*\→\▸]\s*/, '').trim();
    })
    .filter(line => line.length > 0)
    .slice(0, LIMITS.maxBulletsPerJob);

  // Truncate each bullet
  return lines.map(line => truncate(line, LIMITS.maxBulletLength));
};

// Normalize experience entry
export const normalizeExperience = (
  exp: Experience,
  months: string[]
): Experience & { bullets: string[]; dateRange: string } => {
  const startDate = formatDate(exp.startMonth, exp.startYear, months);
  const endDate = exp.current ? 'Present' : formatDate(exp.endMonth, exp.endYear, months);
  const dateRange = startDate ? `${startDate} - ${endDate}` : '';

  return {
    ...exp,
    jobTitle: cleanText(exp.jobTitle),
    company: cleanText(exp.company),
    description: cleanText(exp.description),
    bullets: normalizeBullets(exp.description),
    dateRange,
  };
};

// Normalize education entry
export const normalizeEducation = (
  edu: Education,
  months: string[]
): Education & { gradDate: string } => {
  const gradDate = formatDate(edu.gradMonth, edu.gradYear, months);

  return {
    ...edu,
    degree: cleanText(edu.degree),
    institution: cleanText(edu.institution),
    thesisTitle: cleanText(edu.thesisTitle),
    gpa: cleanText(edu.gpa),
    gradDate,
  };
};

// Normalize certification entry
export const normalizeCertification = (
  cert: Certification,
  months: string[]
): Certification & { issueDate: string; expiryDate: string } => {
  const issueDate = formatDate(cert.issueMonth, cert.issueYear, months);
  const expiryDate = cert.noExpiry 
    ? 'No Expiry' 
    : formatDate(cert.expiryMonth, cert.expiryYear, months);

  return {
    ...cert,
    name: cleanText(cert.name),
    issuer: cleanText(cert.issuer),
    credentialId: cleanText(cert.credentialId),
    issueDate,
    expiryDate,
  };
};

// Normalize skills
export const normalizeSkills = (skills: string[]): string[] => {
  return skills
    .map(s => cleanText(s))
    .filter(s => s.length > 0)
    .slice(0, LIMITS.maxSkillsDisplay);
};

// Sort by date (newest first)
export const sortByDate = <T extends { startYear?: string; gradYear?: string; issueYear?: string }>(
  items: T[],
  field: 'startYear' | 'gradYear' | 'issueYear'
): T[] => {
  return [...items].sort((a, b) => {
    const yearA = parseInt((a as any)[field]) || 0;
    const yearB = parseInt((b as any)[field]) || 0;
    return yearB - yearA;
  });
};

// Normalize entire CV
export const normalizeCV = (
  cv: CVData,
  months: string[]
): CVData & { normalized: true } => {
  const sortedExp = sortByDate(cv.experience, 'startYear');
  const sortedEdu = sortByDate(cv.education, 'gradYear');
  const sortedCert = sortByDate(cv.certifications, 'issueYear');

  return {
    personal: {
      ...cv.personal,
      fullName: cleanText(cv.personal.fullName),
      jobTitle: cleanText(cv.personal.jobTitle),
      email: cleanText(cv.personal.email),
      phone: cleanText(cv.personal.phone),
      location: cleanText(cv.personal.location),
    },
    summary: cleanText(cv.summary),
    experience: sortedExp.map(e => normalizeExperience(e, months)) as any,
    education: sortedEdu.map(e => normalizeEducation(e, months)) as any,
    certifications: sortedCert.map(c => normalizeCertification(c, months)) as any,
    skills: normalizeSkills(cv.skills),
    languages: cv.languages.map(l => ({
      name: cleanText(l.name),
      level: cleanText(l.level),
    })),
    normalized: true,
  };
};
