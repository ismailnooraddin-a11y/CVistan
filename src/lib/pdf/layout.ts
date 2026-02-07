// src/lib/pdf/layout.ts
// Layout engine for pagination and block management

import type { CVData } from '../types';
import { TOKENS, BLOCK_HEIGHTS, LIMITS } from './tokens';

export interface LayoutBlock {
  type: 'header' | 'section-title' | 'experience' | 'education' | 'certification' | 'skills' | 'languages' | 'summary';
  height: number;
  data: any;
  canSplit: boolean;
  splitPoints?: number[]; // indexes where we can split (e.g., bullet boundaries)
}

export interface Page {
  blocks: LayoutBlock[];
  totalHeight: number;
  pageNumber: number;
}

export interface LayoutResult {
  pages: Page[];
  compact: boolean;
  totalPages: number;
}

// Calculate available content height per page
const getContentHeight = (): number => {
  const { page } = TOKENS;
  // Convert mm to px (roughly 3.78 px per mm)
  const pxPerMm = 3.78;
  return (page.height - page.marginTop - page.marginBottom) * pxPerMm;
};

// Estimate height of experience block
const estimateExperienceHeight = (exp: any): number => {
  const baseHeight = BLOCK_HEIGHTS.experienceItem;
  const bulletCount = exp.bullets?.length || 0;
  const bulletHeight = bulletCount * BLOCK_HEIGHTS.bulletLine;
  return baseHeight + bulletHeight;
};

// Estimate height of education block
const estimateEducationHeight = (edu: any): number => {
  let height = BLOCK_HEIGHTS.educationItem;
  if (edu.thesisTitle) height += 20;
  if (edu.gpa) height += 15;
  return height;
};

// Estimate height of certification block
const estimateCertificationHeight = (cert: any): number => {
  let height = BLOCK_HEIGHTS.certificationItem;
  if (cert.credentialId) height += 15;
  return height;
};

// Create layout blocks from CV data
export const createBlocks = (cv: CVData): LayoutBlock[] => {
  const blocks: LayoutBlock[] = [];

  // Header (name, title, contact) - never split
  blocks.push({
    type: 'header',
    height: BLOCK_HEIGHTS.header,
    data: cv.personal,
    canSplit: false,
  });

  // Summary
  if (cv.summary) {
    const lines = Math.ceil(cv.summary.length / 80); // rough estimate
    blocks.push({
      type: 'summary',
      height: BLOCK_HEIGHTS.sectionTitle + (lines * 18),
      data: cv.summary,
      canSplit: false,
    });
  }

  // Experience
  if (cv.experience.length > 0) {
    blocks.push({
      type: 'section-title',
      height: BLOCK_HEIGHTS.sectionTitle,
      data: 'Experience',
      canSplit: false,
    });

    cv.experience.forEach((exp: any) => {
      const height = estimateExperienceHeight(exp);
      blocks.push({
        type: 'experience',
        height,
        data: exp,
        canSplit: true,
        splitPoints: exp.bullets?.map((_: any, i: number) => i) || [],
      });
    });
  }

  // Education
  if (cv.education.length > 0) {
    blocks.push({
      type: 'section-title',
      height: BLOCK_HEIGHTS.sectionTitle,
      data: 'Education',
      canSplit: false,
    });

    cv.education.forEach((edu: any) => {
      blocks.push({
        type: 'education',
        height: estimateEducationHeight(edu),
        data: edu,
        canSplit: false,
      });
    });
  }

  // Certifications
  if (cv.certifications.length > 0) {
    blocks.push({
      type: 'section-title',
      height: BLOCK_HEIGHTS.sectionTitle,
      data: 'Certifications',
      canSplit: false,
    });

    cv.certifications.forEach((cert: any) => {
      blocks.push({
        type: 'certification',
        height: estimateCertificationHeight(cert),
        data: cert,
        canSplit: false,
      });
    });
  }

  // Skills
  if (cv.skills.length > 0) {
    const rows = Math.ceil(cv.skills.length / 4);
    blocks.push({
      type: 'skills',
      height: BLOCK_HEIGHTS.sectionTitle + (rows * BLOCK_HEIGHTS.skillsRow),
      data: cv.skills,
      canSplit: false,
    });
  }

  // Languages
  if (cv.languages.length > 0) {
    blocks.push({
      type: 'languages',
      height: BLOCK_HEIGHTS.sectionTitle + (cv.languages.length * BLOCK_HEIGHTS.languageItem),
      data: cv.languages,
      canSplit: false,
    });
  }

  return blocks;
};

// Paginate blocks into pages
export const paginateBlocks = (blocks: LayoutBlock[]): Page[] => {
  const contentHeight = getContentHeight();
  const pages: Page[] = [];
  let currentPage: Page = { blocks: [], totalHeight: 0, pageNumber: 1 };

  for (const block of blocks) {
    const remainingHeight = contentHeight - currentPage.totalHeight;

    // Check if block fits on current page
    if (block.height <= remainingHeight) {
      currentPage.blocks.push(block);
      currentPage.totalHeight += block.height;
    } else {
      // Block doesn't fit - need new page or split
      if (block.canSplit && block.splitPoints && block.splitPoints.length > 0) {
        // Try to split at a bullet boundary
        // For now, just move to new page (complex splitting can be added later)
        pages.push(currentPage);
        currentPage = { blocks: [block], totalHeight: block.height, pageNumber: pages.length + 1 };
      } else {
        // Move entire block to new page
        if (currentPage.blocks.length > 0) {
          pages.push(currentPage);
        }
        currentPage = { blocks: [block], totalHeight: block.height, pageNumber: pages.length + 1 };
      }
    }
  }

  // Add last page if it has content
  if (currentPage.blocks.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};

// Determine if compact mode is needed
export const shouldUseCompactMode = (blocks: LayoutBlock[]): boolean => {
  const totalHeight = blocks.reduce((sum, b) => sum + b.height, 0);
  const contentHeight = getContentHeight();
  
  // Use compact if content exceeds 1.5 pages but could fit with tighter spacing
  return totalHeight > contentHeight * 1.2 && totalHeight < contentHeight * 2;
};

// Apply compact mode adjustments
export const applyCompactMode = (blocks: LayoutBlock[]): LayoutBlock[] => {
  const compactRatio = 0.85; // Reduce heights by 15%
  
  return blocks.map(block => ({
    ...block,
    height: Math.floor(block.height * compactRatio),
  }));
};

// Main layout function
export const calculateLayout = (cv: CVData): LayoutResult => {
  let blocks = createBlocks(cv);
  let compact = false;

  // Check if compact mode is needed
  if (shouldUseCompactMode(blocks)) {
    blocks = applyCompactMode(blocks);
    compact = true;
  }

  const pages = paginateBlocks(blocks);

  return {
    pages,
    compact,
    totalPages: pages.length,
  };
};
