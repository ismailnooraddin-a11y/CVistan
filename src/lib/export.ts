// src/lib/export.ts
import { CVData } from './types';
import { TOKENS } from './pdf/tokens';

// Interview Tips PDF
const generateInterviewTipsPDF = async () => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = 20;

  const addText = (size: number, style: 'normal' | 'bold' = 'normal', color: number[] = [0, 0, 0]) => {
    pdf.setFontSize(size);
    pdf.setFont('helvetica', style);
    pdf.setTextColor(color[0], color[1], color[2]);
  };

  const checkNewPage = (needed: number) => {
    if (y + needed > 280) {
      pdf.addPage();
      y = 20;
    }
  };

  // Title
  addText(24, 'bold', [26, 54, 93]);
  pdf.text('🎯 Top 15 Interview Questions & Tips', pageWidth / 2, y, { align: 'center' });
  y += 10;

  addText(10, 'normal', [113, 128, 150]);
  pdf.text('Prepared by CVistan - Your Professional CV Builder', pageWidth / 2, y, { align: 'center' });
  y += 15;

  const questions = [
    { q: '1. "Tell me about yourself"', tip: 'Keep it professional, 2 minutes max.', sample: 'I have [X years] experience as [Title]. I specialize in [Skills].' },
    { q: '2. "Why do you want to work here?"', tip: 'Research the company first.', sample: 'I admire [Company]\'s work in [Area]. My skills align perfectly.' },
    { q: '3. "What are your greatest strengths?"', tip: 'Choose 2-3 relevant strengths.', sample: 'My strengths are [Strength 1] and [Strength 2].' },
    { q: '4. "What is your greatest weakness?"', tip: 'Show self-awareness and improvement.', sample: 'I used to struggle with [X]. I\'ve improved by [Action].' },
    { q: '5. "Where do you see yourself in 5 years?"', tip: 'Show ambition and commitment.', sample: 'I see myself as [Role], contributing to [Goals].' },
    { q: '6. "Why did you leave your last job?"', tip: 'Stay positive, never badmouth.', sample: 'I learned a lot, but I\'m seeking new challenges.' },
    { q: '7. "Tell me about a challenge"', tip: 'Use STAR: Situation, Task, Action, Result.', sample: 'At [Company], we faced [Challenge]. I [Action].' },
    { q: '8. "Salary expectations?"', tip: 'Research market rates, give a range.', sample: 'Based on research, I\'m looking for [$X - $Y].' },
    { q: '9. "Why should we hire you?"', tip: 'Summarize your unique value.', sample: 'I bring [Skills] with [X years] experience.' },
    { q: '10. "Questions for us?"', tip: 'Always say YES!', sample: 'What does success look like? Tell me about the team.' },
    { q: '11. "Describe your work style"', tip: 'Be honest and relevant.', sample: 'I\'m [collaborative/independent] and thrive in [env].' },
    { q: '12. "How do you handle stress?"', tip: 'Give a specific example.', sample: 'I handle stress by [Method]. I delivered on time.' },
    { q: '13. "What motivates you?"', tip: 'Connect to the job.', sample: 'I\'m motivated by [Driver]. This role excites me.' },
    { q: '14. "Teamwork experience"', tip: 'Highlight collaboration.', sample: 'I worked with [X people] on [Project]. Result: [Y].' },
    { q: '15. "What do you know about us?"', tip: 'Do your homework!', sample: '[Company] leads in [Field]. Your mission resonates.' }
  ];

  questions.forEach((item) => {
    checkNewPage(32);
    pdf.setFillColor(247, 250, 252);
    pdf.roundedRect(margin, y, contentWidth, 28, 2, 2, 'F');
    pdf.setDrawColor(49, 130, 206);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, margin, y + 28);
    
    addText(10, 'bold', [49, 130, 206]);
    pdf.text(item.q, margin + 4, y + 6);
    
    addText(8, 'normal', [113, 128, 150]);
    pdf.text('💡 ' + item.tip, margin + 4, y + 12);
    
    addText(8, 'normal', [74, 85, 104]);
    const sampleLines = pdf.splitTextToSize('Example: ' + item.sample, contentWidth - 8);
    pdf.text(sampleLines, margin + 4, y + 19);
    y += 32;
  });

  checkNewPage(50);
  y += 5;
  addText(12, 'bold', [45, 55, 72]);
  pdf.text('✅ Quick Tips', margin, y);
  y += 7;

  const tips = ['Research company', 'Practice answers', 'Prepare questions', 'Dress professionally', 'Arrive early', 'Bring CV copies', 'Eye contact', 'Thank-you email'];
  tips.forEach(tip => {
    addText(9, 'normal', [74, 85, 104]);
    pdf.text('✓ ' + tip, margin + 4, y);
    y += 5;
  });

  y += 8;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 6;
  addText(10, 'bold', [49, 130, 206]);
  pdf.text('CVistan - Good luck! 🍀', pageWidth / 2, y, { align: 'center' });

  pdf.save('Interview-Tips.pdf');
};

export async function generatePDF(
  element: HTMLElement | null,
  filename: string = 'cv.pdf'
): Promise<boolean> {
  if (!element) return false;
  
  try {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    
    // Render at fixed scale (no auto-scaling)
    const canvas = await html2canvas(element, {
      scale: 2, // Fixed scale for quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 794, // A4 width at 96 DPI
      windowHeight: 1123, // A4 height at 96 DPI
    });
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Handle multi-page PDFs
    let heightLeft = imgHeight;
    let position = 0;
    let page = 1;

    // Add first page
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );
    heightLeft -= pdfHeight;

    // Add subsequent pages if needed
    while (heightLeft > 0) {
      position = -pdfHeight * page;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );
      heightLeft -= pdfHeight;
      page++;
    }
    
    pdf.save(filename);
    
    // Auto-download interview tips after 1 second
    setTimeout(() => { generateInterviewTipsPDF(); }, 1000);
    
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

    // Sort by date (newest first)
    const sortedExp = [...cv.experience].sort((a, b) => (parseInt(b.startYear) || 0) - (parseInt(a.startYear) || 0));
    const sortedEdu = [...cv.education].sort((a, b) => (parseInt(b.gradYear) || 0) - (parseInt(a.gradYear) || 0));
    const sortedCert = [...cv.certifications].sort((a, b) => (parseInt(b.issueYear) || 0) - (parseInt(a.issueYear) || 0));

    // Fixed typography (no auto-scaling)
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>CV - ${cv.personal.fullName}</title>
        <style>
          @page { margin: 20mm; }
          body { 
            font-family: Calibri, Arial, sans-serif; 
            font-size: ${TOKENS.fonts.body}pt; 
            line-height: ${TOKENS.lineHeight.normal}; 
            color: ${TOKENS.colors.textPrimary}; 
          }
          h1 { 
            font-size: ${TOKENS.fonts.name}pt; 
            color: ${TOKENS.colors.primary}; 
            margin-bottom: 4pt; 
            text-align: center; 
          }
          h2 { 
            font-size: ${TOKENS.fonts.sectionTitle}pt; 
            color: ${TOKENS.colors.text}; 
            border-bottom: 2px solid ${TOKENS.colors.accent}; 
            padding-bottom: 4pt; 
            margin-top: 16pt; 
            margin-bottom: 8pt; 
          }
          .subtitle { 
            font-size: ${TOKENS.fonts.jobTitle}pt; 
            color: ${TOKENS.colors.secondary}; 
            text-align: center; 
            margin-bottom: 8pt; 
          }
          .contact { 
            color: ${TOKENS.colors.textLight}; 
            font-size: ${TOKENS.fonts.small}pt; 
            text-align: center; 
            margin-bottom: 16pt; 
          }
          .summary { 
            background-color: ${TOKENS.colors.background}; 
            padding: 8pt; 
            margin-bottom: 12pt; 
            border-left: 3pt solid ${TOKENS.colors.accent}; 
          }
          .entry { margin-bottom: 12pt; }
          .job-title { 
            font-weight: bold; 
            font-size: ${TOKENS.fonts.body}pt; 
            color: ${TOKENS.colors.text}; 
          }
          .company { 
            color: ${TOKENS.colors.accent}; 
            font-size: ${TOKENS.fonts.small}pt; 
          }
          .date { 
            color: ${TOKENS.colors.textLight}; 
            font-size: ${TOKENS.fonts.tiny}pt; 
            font-style: italic; 
          }
          .description { 
            color: ${TOKENS.colors.secondary}; 
            font-size: ${TOKENS.fonts.small}pt; 
            margin-top: 4pt; 
            white-space: pre-line; 
          }
          .skill-tag { 
            display: inline-block; 
            background-color: ${TOKENS.colors.background}; 
            padding: 2pt 6pt; 
            margin: 2pt; 
            border-radius: 2pt; 
            font-size: ${TOKENS.fonts.small}pt; 
          }
          .cert-mode { 
            display: inline-block; 
            background-color: #e6fffa; 
            color: #319795; 
            padding: 1pt 4pt; 
            border-radius: 2pt; 
            font-size: ${TOKENS.fonts.tiny}pt; 
            margin-left: 4pt; 
          }
        </style>
      </head>
      <body>
        <h1>${cv.personal.fullName || 'Your Name'}</h1>
        <p class="subtitle">${cv.personal.jobTitle || ''}</p>
        <p class="contact">${[cv.personal.email, cv.personal.phone, cv.personal.location].filter(Boolean).join(' | ')}</p>
        
        ${cv.summary ? `<h2>Professional Summary</h2><div class="summary">${cv.summary}</div>` : ''}
        
        ${sortedExp.length > 0 ? `
          <h2>Work Experience</h2>
          ${sortedExp.map(exp => `
            <div class="entry">
              <p class="job-title">${exp.jobTitle || ''}</p>
              <p class="company">${exp.company || ''}</p>
              <p class="date">${formatDate(exp.startMonth, exp.startYear)} - ${exp.current ? 'Present' : formatDate(exp.endMonth, exp.endYear)}</p>
              ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        ` : ''}
        
        ${sortedEdu.length > 0 ? `
          <h2>Education</h2>
          ${sortedEdu.map(edu => `
            <div class="entry">
              <p class="job-title">${edu.degree || ''}</p>
              <p class="company">${edu.institution || ''}</p>
              <p class="date">${edu.gradYear ? formatDate(edu.gradMonth, edu.gradYear) : ''}${edu.gpa ? ' | GPA: ' + edu.gpa : ''}</p>
              ${edu.thesisTitle ? `<p class="description">Thesis: ${edu.thesisTitle}</p>` : ''}
            </div>
          `).join('')}
        ` : ''}

        ${sortedCert.length > 0 ? `
          <h2>Certifications & Training</h2>
          ${sortedCert.map(cert => `
            <div class="entry">
              <p class="job-title">${cert.name || ''}${cert.mode ? `<span class="cert-mode">${cert.mode === 'online' ? '🌐 Online' : '🏢 In-Person'}</span>` : ''}</p>
              <p class="company">${cert.issuer || ''}</p>
              <p class="date">${formatDate(cert.issueMonth, cert.issueYear)}${cert.noExpiry ? ' (No Expiry)' : cert.expiryYear ? ' - ' + formatDate(cert.expiryMonth, cert.expiryYear) : ''}</p>
              ${cert.credentialId ? `<p class="description">Credential ID: ${cert.credentialId}</p>` : ''}
            </div>
          `).join('')}
        ` : ''}
        
        ${cv.skills.length > 0 ? `
          <h2>Skills</h2>
          <div>${cv.skills.map(s => `<span class="skill-tag">${s}</span>`).join(' ')}</div>
        ` : ''}
        
        ${cv.languages.length > 0 ? `
          <h2>Languages</h2>
          <div>${cv.languages.map(l => `<p><strong>${l.name}</strong> - ${l.level}</p>`).join('')}</div>
        ` : ''}
      </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-word;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename.endsWith('.doc') ? filename : filename.replace('.docx', '.doc');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    setTimeout(() => { generateInterviewTipsPDF(); }, 1000);
    return true;
  } catch (error) {
    console.error('Word generation error:', error);
    return false;
  }
}

export function shareViaWhatsApp(phone: string | undefined, message: string): void {
  const cleanPhone = phone?.replace(/[^\d]/g, '') || '';
  const encodedMessage = encodeURIComponent(message);
  const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedMessage}` : `https://wa.me/?text=${encodedMessage}`;
  window.open(url, '_blank');
}

export function shareViaTelegram(message: string): void {
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://t.me/share/url?url=${encodedMessage}`, '_blank');
}
