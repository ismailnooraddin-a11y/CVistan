// src/lib/export.ts
import { CVData } from './types';

// Interview Tips PDF content
const generateInterviewTipsPDF = async () => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = 20;

  const addText = (text: string, size: number, style: 'normal' | 'bold' = 'normal', color: number[] = [0, 0, 0]) => {
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
  addText('', 24, 'bold', [26, 54, 93]);
  pdf.text('🎯 Top 15 Interview Questions & Tips', pageWidth / 2, y, { align: 'center' });
  y += 10;

  addText('', 10, 'normal', [113, 128, 150]);
  pdf.text('Prepared by CVistan - Your Professional CV Builder', pageWidth / 2, y, { align: 'center' });
  y += 15;

  const questions = [
    { q: '1. "Tell me about yourself"', tip: 'Keep it professional, 2 minutes max. Focus on career.', sample: 'I have [X years] experience as [Title]. I specialize in [Skills].' },
    { q: '2. "Why do you want to work here?"', tip: 'Research the company. Mention specific things you admire.', sample: 'I admire [Company]\'s work in [Area]. My skills align perfectly.' },
    { q: '3. "What are your greatest strengths?"', tip: 'Choose 2-3 strengths relevant to the job. Give examples.', sample: 'My strengths are [Strength 1] and [Strength 2].' },
    { q: '4. "What is your greatest weakness?"', tip: 'Be honest but show improvement. Never say "perfectionist."', sample: 'I used to struggle with [X]. I\'ve improved by [Action].' },
    { q: '5. "Where do you see yourself in 5 years?"', tip: 'Show ambition but also commitment to the company.', sample: 'In 5 years, I see myself as [Role], contributing to [Goals].' },
    { q: '6. "Why did you leave your last job?"', tip: 'Stay positive. Never badmouth previous employers.', sample: 'I learned a lot, but I\'m seeking new challenges in [Area].' },
    { q: '7. "Tell me about a challenge you faced"', tip: 'Use STAR: Situation, Task, Action, Result.', sample: 'At [Company], we faced [Challenge]. I [Action], resulting in [Outcome].' },
    { q: '8. "What are your salary expectations?"', tip: 'Research market rates. Give a range.', sample: 'Based on my research, I\'m looking for [$X - $Y].' },
    { q: '9. "Why should we hire you?"', tip: 'Summarize your unique value confidently.', sample: 'I bring [Skills] with [X years] experience. I can deliver results.' },
    { q: '10. "Do you have questions for us?"', tip: 'Always say YES! Ask about role, team, or growth.', sample: 'What does success look like? Tell me about the team.' },
    { q: '11. "Describe your work style"', tip: 'Be honest and relate it to job requirements.', sample: 'I\'m [collaborative/independent] and thrive in [environment].' },
    { q: '12. "How do you handle stress?"', tip: 'Give a specific example of handling pressure.', sample: 'I handle stress by [Method]. When [Situation], I delivered on time.' },
    { q: '13. "What motivates you?"', tip: 'Connect your motivation to the job.', sample: 'I\'m motivated by [Driver]. This role excites me because [Aspect].' },
    { q: '14. "Tell me about teamwork experience"', tip: 'Highlight collaboration and your contribution.', sample: 'I worked with [X people] on [Project]. We achieved [Result].' },
    { q: '15. "What do you know about our company?"', tip: 'Do your homework! Research website, news, LinkedIn.', sample: '[Company] leads in [Field]. Your mission resonates with me.' }
  ];

  questions.forEach((item) => {
    checkNewPage(35);
    pdf.setFillColor(247, 250, 252);
    pdf.roundedRect(margin, y, contentWidth, 30, 3, 3, 'F');
    pdf.setDrawColor(49, 130, 206);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, margin, y + 30);
    addText('', 11, 'bold', [49, 130, 206]);
    pdf.text(item.q, margin + 5, y + 7);
    addText('', 9, 'normal', [113, 128, 150]);
    pdf.text('💡 ' + item.tip, margin + 5, y + 14);
    addText('', 9, 'normal', [74, 85, 104]);
    const sampleLines = pdf.splitTextToSize('Example: ' + item.sample, contentWidth - 10);
    pdf.text(sampleLines, margin + 5, y + 22);
    y += 35;
  });

  checkNewPage(50);
  y += 5;
  addText('', 14, 'bold', [45, 55, 72]);
  pdf.text('✅ Quick Tips Before Your Interview', margin, y);
  y += 8;

  const tips = [
    'Research the company thoroughly',
    'Practice your answers out loud',
    'Prepare 3-5 questions to ask them',
    'Dress professionally',
    'Arrive 10-15 minutes early',
    'Bring copies of your CV',
    'Make eye contact and smile',
    'Send a thank-you email within 24 hours'
  ];

  tips.forEach(tip => {
    addText('', 10, 'normal', [74, 85, 104]);
    pdf.text('✓ ' + tip, margin + 5, y);
    y += 6;
  });

  y += 10;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;
  addText('', 12, 'bold', [49, 130, 206]);
  pdf.text('CVistan - Good luck with your interview! 🍀', pageWidth / 2, y, { align: 'center' });

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

    const sortedExperience = [...cv.experience].sort((a, b) => {
      const yearA = parseInt(a.startYear) || 0;
      const yearB = parseInt(b.startYear) || 0;
      return yearB - yearA;
    });

    const sortedEducation = [...cv.education].sort((a, b) => {
      const yearA = parseInt(a.gradYear) || 0;
      const yearB = parseInt(b.gradYear) || 0;
      return yearB - yearA;
    });

    const sortedCertifications = [...cv.certifications].sort((a, b) => {
      const yearA = parseInt(a.issueYear) || 0;
      const yearB = parseInt(b.issueYear) || 0;
      return yearB - yearA;
    });

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>CV - ${cv.personal.fullName}</title>
        <style>
          @page { margin: 1in; }
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #333; }
          h1 { font-size: 24pt; color: #1a365d; margin-bottom: 5pt; text-align: center; }
          h2 { font-size: 14pt; color: #2d3748; border-bottom: 2px solid #3182ce; padding-bottom: 5pt; margin-top: 20pt; margin-bottom: 10pt; }
          .subtitle { font-size: 14pt; color: #4a5568; text-align: center; margin-bottom: 10pt; }
          .contact { color: #718096; font-size: 10pt; text-align: center; margin-bottom: 20pt; }
          .summary { background-color: #f7fafc; padding: 10pt; margin-bottom: 15pt; border-left: 3pt solid #3182ce; }
          .entry { margin-bottom: 15pt; }
          .job-title { font-weight: bold; font-size: 12pt; color: #1a202c; }
          .company { color: #3182ce; font-size: 11pt; }
          .date { color: #718096; font-size: 10pt; font-style: italic; }
          .description { color: #4a5568; font-size: 10pt; margin-top: 5pt; white-space: pre-line; }
          .skills { margin-top: 5pt; }
          .skill-tag { display: inline-block; background-color: #e2e8f0; padding: 3pt 8pt; margin: 2pt; border-radius: 3pt; font-size: 10pt; }
          .cert-mode { display: inline-block; background-color: #e6fffa; color: #319795; padding: 2pt 6pt; border-radius: 3pt; font-size: 9pt; margin-left: 5pt; }
        </style>
      </head>
      <body>
        <h1>${cv.personal.fullName || 'Your Name'}</h1>
        <p class="subtitle">${cv.personal.jobTitle || ''}</p>
        <p class="contact">${[cv.personal.email, cv.personal.phone, cv.personal.location].filter(Boolean).join(' | ')}</p>
        
        ${cv.summary ? `<h2>Professional Summary</h2><div class="summary">${cv.summary}</div>` : ''}
        
        ${sortedExperience.length > 0 ? `
          <h2>Work Experience</h2>
          ${sortedExperience.map(exp => `
            <div class="entry">
              <p class="job-title">${exp.jobTitle || ''}</p>
              <p class="company">${exp.company || ''}</p>
              <p class="date">${formatDate(exp.startMonth, exp.startYear)} - ${exp.current ? 'Present' : formatDate(exp.endMonth, exp.endYear)}</p>
              ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        ` : ''}
        
        ${sortedEducation.length > 0 ? `
          <h2>Education</h2>
          ${sortedEducation.map(edu => `
            <div class="entry">
              <p class="job-title">${edu.degree || ''}</p>
              <p class="company">${edu.institution || ''}</p>
              <p class="date">${edu.gradYear ? formatDate(edu.gradMonth, edu.gradYear) : ''}${edu.gpa ? ' | GPA: ' + edu.gpa : ''}</p>
              ${edu.thesisTitle ? `<p class="description">Thesis: ${edu.thesisTitle}</p>` : ''}
            </div>
          `).join('')}
        ` : ''}

        ${sortedCertifications.length > 0 ? `
          <h2>Certifications & Training</h2>
          ${sortedCertifications.map(cert => `
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
          <div class="skills">${cv.skills.map(s => `<span class="skill-tag">${s}</span>`).join(' ')}</div>
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
