// src/lib/export.ts
import { CVData } from './types';

const interviewTipsPDF = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Interview Tips - CVistan</title>
  <style>
    body { font-family: Georgia, serif; font-size: 11pt; line-height: 1.6; margin: 40px; color: #333; }
    h1 { color: #1a365d; text-align: center; border-bottom: 3px solid #3182ce; padding-bottom: 10px; }
    h2 { color: #2d3748; margin-top: 25px; font-size: 14pt; }
    .question { background: #f7fafc; padding: 15px; border-left: 4px solid #3182ce; margin: 15px 0; }
    .question h3 { color: #3182ce; margin: 0 0 10px 0; font-size: 12pt; }
    .tip { color: #718096; font-style: italic; margin: 10px 0; }
    .sample { background: #edf2f7; padding: 10px; border-radius: 5px; margin: 10px 0; }
    .placeholder { background: #fef3c7; padding: 2px 6px; border-radius: 3px; font-weight: bold; }
    .footer { text-align: center; margin-top: 40px; color: #a0aec0; font-size: 10pt; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  </style>
</head>
<body>
  <h1>🎯 Top 15 Interview Questions & Tips</h1>
  <p style="text-align: center; color: #718096;">Prepared by CVistan - Your Professional CV Builder</p>

  <div class="question">
    <h3>1. "Tell me about yourself"</h3>
    <p class="tip">💡 Keep it professional, 2 minutes max. Focus on career, not personal life.</p>
    <div class="sample"><strong>Sample:</strong> "I have <span class="placeholder">[X years]</span> of experience as a <span class="placeholder">[Job Title]</span>. I specialize in <span class="placeholder">[Key Skills]</span> and have worked with <span class="placeholder">[Companies]</span>. I'm excited about this role because <span class="placeholder">[Reason]</span>."</div>
  </div>

  <div class="question">
    <h3>2. "Why do you want to work here?"</h3>
    <p class="tip">💡 Research the company beforehand. Mention specific things you admire.</p>
    <div class="sample"><strong>Sample:</strong> "I admire <span class="placeholder">[Company]</span>'s work in <span class="placeholder">[Area]</span>. My skills in <span class="placeholder">[Skills]</span> align perfectly, and I can contribute to <span class="placeholder">[Goal]</span>."</div>
  </div>

  <div class="question">
    <h3>3. "What are your greatest strengths?"</h3>
    <p class="tip">💡 Choose 2-3 strengths relevant to the job. Give examples.</p>
    <div class="sample"><strong>Sample:</strong> "My strengths are <span class="placeholder">[Strength 1]</span> and <span class="placeholder">[Strength 2]</span>. At <span class="placeholder">[Company]</span>, I <span class="placeholder">[Achievement]</span>."</div>
  </div>

  <div class="question">
    <h3>4. "What is your greatest weakness?"</h3>
    <p class="tip">💡 Be honest but show you're improving. Never say "perfectionist."</p>
    <div class="sample"><strong>Sample:</strong> "I used to struggle with <span class="placeholder">[Weakness]</span>. I've been working on it by <span class="placeholder">[Action]</span> and seeing improvement."</div>
  </div>

  <div class="question">
    <h3>5. "Where do you see yourself in 5 years?"</h3>
    <p class="tip">💡 Show ambition but also commitment to the company.</p>
    <div class="sample"><strong>Sample:</strong> "In 5 years, I see myself as a <span class="placeholder">[Role]</span>, contributing to <span class="placeholder">[Company Goals]</span>."</div>
  </div>

  <div class="question">
    <h3>6. "Why did you leave your last job?"</h3>
    <p class="tip">💡 Stay positive. Never badmouth previous employers.</p>
    <div class="sample"><strong>Sample:</strong> "I learned a lot at <span class="placeholder">[Company]</span>, but I'm seeking new challenges in <span class="placeholder">[Area]</span>."</div>
  </div>

  <div class="question">
    <h3>7. "Tell me about a challenge you faced"</h3>
    <p class="tip">💡 Use STAR: Situation, Task, Action, Result.</p>
    <div class="sample"><strong>Sample:</strong> "At <span class="placeholder">[Company]</span>, we faced <span class="placeholder">[Challenge]</span>. I <span class="placeholder">[Action]</span>, resulting in <span class="placeholder">[Outcome]</span>."</div>
  </div>

  <div class="question">
    <h3>8. "What are your salary expectations?"</h3>
    <p class="tip">💡 Research market rates. Give a range, not exact number.</p>
    <div class="sample"><strong>Sample:</strong> "Based on my research, I'm looking for <span class="placeholder">[$X - $Y]</span>, but I'm open to discussion."</div>
  </div>

  <div class="question">
    <h3>9. "Why should we hire you?"</h3>
    <p class="tip">💡 Summarize your unique value confidently.</p>
    <div class="sample"><strong>Sample:</strong> "I bring <span class="placeholder">[Skills]</span> with <span class="placeholder">[X years]</span> experience. I've <span class="placeholder">[Achievement]</span> and can deliver results here."</div>
  </div>

  <div class="question">
    <h3>10. "Do you have questions for us?"</h3>
    <p class="tip">💡 Always say YES! Ask about role, team, or growth.</p>
    <div class="sample"><strong>Ask:</strong> "What does success look like in 6 months?" • "Tell me about the team" • "What challenges does the team face?" • "What growth opportunities exist?"</div>
  </div>

  <div class="question">
    <h3>11. "Describe your work style"</h3>
    <p class="tip">💡 Be honest and relate it to job requirements.</p>
    <div class="sample"><strong>Sample:</strong> "I'm <span class="placeholder">[collaborative/independent]</span> and thrive in <span class="placeholder">[environment]</span>. I ensure clear communication."</div>
  </div>

  <div class="question">
    <h3>12. "How do you handle stress?"</h3>
    <p class="tip">💡 Give a specific example of handling pressure.</p>
    <div class="sample"><strong>Sample:</strong> "I handle stress by <span class="placeholder">[Method]</span>. When <span class="placeholder">[Situation]</span>, I <span class="placeholder">[Action]</span> and delivered on time."</div>
  </div>

  <div class="question">
    <h3>13. "What motivates you?"</h3>
    <p class="tip">💡 Connect your motivation to the job.</p>
    <div class="sample"><strong>Sample:</strong> "I'm motivated by <span class="placeholder">[Driver]</span>. This role excites me because <span class="placeholder">[Aspect]</span>."</div>
  </div>

  <div class="question">
    <h3>14. "Tell me about teamwork experience"</h3>
    <p class="tip">💡 Highlight collaboration and your contribution.</p>
    <div class="sample"><strong>Sample:</strong> "I worked with <span class="placeholder">[X people]</span> on <span class="placeholder">[Project]</span>. My role was <span class="placeholder">[Role]</span>. We achieved <span class="placeholder">[Result]</span>."</div>
  </div>

  <div class="question">
    <h3>15. "What do you know about our company?"</h3>
    <p class="tip">💡 Do your homework! Research website, news, LinkedIn.</p>
    <div class="sample"><strong>Sample:</strong> "<span class="placeholder">[Company]</span> leads in <span class="placeholder">[Field]</span>. I'm impressed by <span class="placeholder">[Achievement]</span>. Your mission resonates with me."</div>
  </div>

  <h2>📝 Quick Tips</h2>
  <ul>
    <li>✅ Research the company</li>
    <li>✅ Practice answers out loud</li>
    <li>✅ Prepare questions to ask</li>
    <li>✅ Dress professionally</li>
    <li>✅ Arrive 10-15 min early</li>
    <li>✅ Bring CV copies</li>
    <li>✅ Make eye contact & smile</li>
    <li>✅ Send thank-you email within 24hrs</li>
  </ul>

  <div class="footer">
    <p>📄 <strong>CVistan</strong> - Professional CV Builder</p>
    <p>Good luck! 🍀</p>
  </div>
</body>
</html>
`;

function downloadInterviewTips(): void {
  const blob = new Blob([interviewTipsPDF], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Interview-Tips.html';
  link.click();
  URL.revokeObjectURL(link.href);
}

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
    
    // Auto-download Interview Tips
    setTimeout(() => {
      downloadInterviewTips();
    }, 1000);
    
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
        body { font-family: Calibri, Arial; font-size: 11pt; line-height: 1.5; margin: 1in; }
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
    
    // Auto-download Interview Tips
    setTimeout(() => {
      downloadInterviewTips();
    }, 1000);
    
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
