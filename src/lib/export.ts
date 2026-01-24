// src/lib/export.ts
// Export utilities for generating PDF and Word documents

import { CVData } from './types';

/**
 * Generate PDF from CV preview element
 * Uses html2canvas + jsPDF for client-side generation
 */
export async function generatePDF(
  element: HTMLElement | null,
  filename: string = 'cv.pdf'
): Promise<boolean> {
  if (!element) return false;
  
  try {
    // Dynamic imports for code splitting
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });
    
    // Calculate dimensions for A4
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > 297 ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Handle multiple pages if content is longer than A4
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
    
    // Save the PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    
    // Fallback to print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${filename}</title>
            <style>
              @page { size: A4; margin: 0; }
              body { margin: 0; padding: 0; }
              @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            </style>
            <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
          </head>
          <body>${element.outerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
    return false;
  }
}

/**
 * Generate Word document from CV data
 * Creates a structured .docx file using the docx library
 */
export async function generateWord(
  cv: CVData,
  months: string[],
  filename: string = 'cv.docx'
): Promise<boolean> {
  try {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
    const { saveAs } = await import('file-saver');
    
    const formatDate = (month: string, year: string): string => {
      if (!year) return '';
      if (month && months[parseInt(month) - 1]) {
        return `${months[parseInt(month) - 1]} ${year}`;
      }
      return year;
    };
    
    // Build document sections
    const children: any[] = [];
    
    // Header - Name and Title
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cv.personal.fullName || 'Your Name',
            bold: true,
            size: 48, // 24pt
            color: '1a365d',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: cv.personal.jobTitle || '',
            size: 28,
            color: '4a5568',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
    
    // Contact Info
    const contactParts = [
      cv.personal.email,
      cv.personal.phone,
      cv.personal.location,
      cv.personal.linkedin,
    ].filter(Boolean);
    
    if (contactParts.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactParts.join(' | '),
              size: 20,
              color: '718096',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );
    }
    
    // Summary
    if (cv.summary) {
      children.push(
        new Paragraph({
          text: 'PROFESSIONAL SUMMARY',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: cv.summary, size: 22 })],
          spacing: { after: 300 },
        })
      );
    }
    
    // Experience
    if (cv.experience.length > 0) {
      children.push(
        new Paragraph({
          text: 'WORK EXPERIENCE',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        })
      );
      
      cv.experience.forEach(exp => {
        const dateRange = `${formatDate(exp.startMonth, exp.startYear)} - ${
          exp.current ? 'Present' : formatDate(exp.endMonth, exp.endYear)
        }`;
        
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.jobTitle || '', bold: true, size: 24 }),
            ],
            spacing: { before: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: exp.company || '', color: '3182ce', size: 22 }),
              new TextRun({ text: ` | ${dateRange}`, color: '718096', size: 20 }),
            ],
            spacing: { after: 100 },
          })
        );
        
        if (exp.description) {
          const bullets = exp.description.split('\n').filter(line => line.trim());
          bullets.forEach(bullet => {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: bullet.replace(/^[•\-]\s*/, ''), size: 22 })],
                bullet: { level: 0 },
                spacing: { after: 50 },
              })
            );
          });
        }
      });
    }
    
    // Education
    if (cv.education.length > 0) {
      children.push(
        new Paragraph({
          text: 'EDUCATION',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        })
      );
      
      cv.education.forEach(edu => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.degree || '', bold: true, size: 24 }),
            ],
            spacing: { before: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: edu.institution || '', color: '3182ce', size: 22 }),
              edu.gradYear && new TextRun({ 
                text: ` | ${formatDate(edu.gradMonth, edu.gradYear)}`, 
                color: '718096', 
                size: 20 
              }),
              edu.gpa && new TextRun({ text: ` | GPA: ${edu.gpa}`, color: '718096', size: 20 }),
            ].filter(Boolean),
            spacing: { after: 50 },
          })
        );
        
        if (edu.thesisTitle) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `Thesis: ${edu.thesisTitle}`, italics: true, size: 20 }),
              ],
              spacing: { after: 100 },
            })
          );
        }
      });
    }
    
    // Skills
    if (cv.skills.length > 0) {
      children.push(
        new Paragraph({
          text: 'SKILLS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: cv.skills.join(' • '), size: 22 })],
          spacing: { after: 200 },
        })
      );
    }
    
    // Languages
    if (cv.languages.length > 0) {
      children.push(
        new Paragraph({
          text: 'LANGUAGES',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text: cv.languages.map(l => `${l.name} (${l.level})`).join(' • '), 
              size: 22 
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }
    
    // Create and save document
    const doc = new Document({
      sections: [{
        properties: {},
        children,
      }],
    });
    
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
    
    return true;
  } catch (error) {
    console.error('Word generation error:', error);
    
    // Fallback to HTML-based Word file
    const html = generateWordHTML(cv, months);
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    
    return true;
  }
}

/**
 * Generate HTML that Word can open (fallback)
 */
function generateWordHTML(cv: CVData, months: string[]): string {
  const formatDate = (month: string, year: string): string => {
    if (!year) return '';
    if (month && months[parseInt(month) - 1]) {
      return `${months[parseInt(month) - 1]} ${year}`;
    }
    return year;
  };
  
  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:w="urn:schemas-microsoft-com:office:word">
    <head>
      <meta charset="utf-8">
      <title>CV - ${cv.personal.fullName}</title>
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
        ul { margin: 5pt 0; padding-left: 20pt; }
        li { margin-bottom: 3pt; }
      </style>
    </head>
    <body>
      <h1>${cv.personal.fullName || 'Your Name'}</h1>
      <p class="subtitle">${cv.personal.jobTitle || ''}</p>
      <p class="contact">
        ${[cv.personal.email, cv.personal.phone, cv.personal.location, cv.personal.linkedin]
          .filter(Boolean).join(' | ')}
      </p>
      
      ${cv.summary ? `
        <h2>Professional Summary</h2>
        <p>${cv.summary}</p>
      ` : ''}
      
      ${cv.experience.length > 0 ? `
        <h2>Work Experience</h2>
        ${cv.experience.map(exp => `
          <div class="entry">
            <p class="job-title">${exp.jobTitle || ''}</p>
            <p><span class="company">${exp.company || ''}</span> | 
               <span class="date">${formatDate(exp.startMonth, exp.startYear)} - 
               ${exp.current ? 'Present' : formatDate(exp.endMonth, exp.endYear)}</span></p>
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
            ${edu.thesisTitle ? `<p><em>Thesis: ${edu.thesisTitle}</em></p>` : ''}
          </div>
        `).join('')}
      ` : ''}
      
      ${cv.skills.length > 0 ? `
        <h2>Skills</h2>
        <p>${cv.skills.join(' • ')}</p>
      ` : ''}
      
      ${cv.languages.length > 0 ? `
        <h2>Languages</h2>
        <p>${cv.languages.map(l => `${l.name} (${l.level})`).join(' • ')}</p>
      ` : ''}
    </body>
    </html>
  `;
}

/**
 * Share via WhatsApp
 */
export function shareViaWhatsApp(phone: string | undefined, message: string): void {
  const cleanPhone = phone?.replace(/[^\d]/g, '') || '';
  const encodedMessage = encodeURIComponent(message);
  const url = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;
  window.open(url, '_blank');
}

/**
 * Share via Telegram
 */
export function shareViaTelegram(message: string): void {
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://t.me/share/url?url=${encodedMessage}`, '_blank');
}
