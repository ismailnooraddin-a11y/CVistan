// src/lib/export.ts
// Export utilities for generating PDF and Word documents

import { CVData } from './types';

export async function generatePDF(
  element: HTMLElement | null,
  filename: string = 'cv.pdf'
): Promise<boolean> {
  if (!element) return false;
  
  try {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    if (imgHeight > 297) {
      let remainingHeight = imgHeight - 297;
      let position = -297;
      
      while (remainingHeight > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        remainingHeight -= 297;
        position -= 297;
      }
    }
    
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    window.print();
    return false;
  }
}

export async function generateWord(
  cv: CVData,
  months: string[],
  filename: string = 'cv.docx'
): Promise<boolean> {
  try {
    const formatDate = (month: string, year: string): string => {
      if (!year) return '';
      if (month && months[parseInt(month) - 1]) {
        return `${months[parseInt(month) - 1]} ${year}`;
      }
      return year;
    };

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
      <head><meta charset="utf-8"><title>CV</title>
      <style>
        body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 1in; }
        h1 { font-size: 24pt; color: #1a365d; margin-bottom: 5pt; text-align: center; }
        h2 { font-size: 14pt; color: #2d3748; border-bottom: 2px solid #3182ce; padding-bottom: 5pt; margin-top: 15pt; }
        .subtitle { font-size: 14pt; color: #4a5568; text-align: center; margin-bottom: 10pt; }
        .contact { color: #718096; font-size: 10pt; text-align: center; margin-bottom: 20pt; }
        .entry { margin-bottom: 10pt; }
        .job-title { font-weight: bold; }
        .company { color: #3182ce; }
        .date { color: #718096; font-style: italic; }
      </style>
      </head>
      <body>
        <h1>${cv.personal.fullName || 'Your Name'}</h1>
        <p class="subtitle">${cv.personal.jobTitle || ''}</p>
        <p class="contact">${[cv.personal.email, cv.personal.phone, cv.personal.location].filter(Boolean).join(' | ')}</p>
        
        ${cv.summary ? `<h2>Professional Summary</h2><p>${cv.summary}</p>` : ''}
        
        ${cv.experience.length > 0 ? `
          <h2>Work Experience</h2>
          ${cv.experience.map(exp => `
            <div class="entry">
              <p class="job-title">${exp.jobTitle || ''}</p>
              <p><span class="company">${exp.company || ''}</span> | 
                 <span class="date">${formatDate(exp.startMonth, exp.startYear)} - ${exp.current ? 'Present' : formatDate(exp.endMonth, exp.endYear)}</span></p>
              ${exp.description ? `<p>${exp.description.replace(/\n/g, '<br>')}</p>` : ''}
            </div>
          `).join('')}
        ` : ''}
        
        ${cv.education.length > 0 ? `
          <h2>Education</h2>
          ${cv.education.map(edu => `
            <div class="entry">
              <p class="job-title">${edu.degree || ''}</p>
              <p><span class="company">${edu.institution || ''}</span>
                 ${edu.gradYear ? `| <span class="date">${formatDate(edu.gradMonth, edu.gradYear)}</span>` : ''}
                 ${edu.gpa ? `| GPA: ${edu.gpa}` : ''}</p>
            </div>
          `).join('')}
        ` : ''}
        
        ${cv.skills.length > 0 ? `<h2>Skills</h2><p>${cv.skills.join(' • ')}</p>` : ''}
        
        ${cv.languages.length > 0 ? `<h2>Languages</h2><p>${cv.languages.map(l => `${l.name} (${l.level})`).join(' • ')}</p>` : ''}
      </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    
    return true;
  } catch (error) {
    console.error('Word generation error:', error);
    return false;
  }
}

export function shareViaWhatsApp(phone: string | undefined, message: string): void {
  const cleanPhone = phone?.replace(/[^\d]/g, '') || '';
  const encodedMessage = encodeURIComponent(message);
  const url = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;
  window.open(url, '_blank');
}

export function shareViaTelegram(message: string): void {
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://t.me/share/url?url=${encodedMessage}`, '_blank');
}
