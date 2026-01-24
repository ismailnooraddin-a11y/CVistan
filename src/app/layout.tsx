// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CV Maker - Create Professional CVs in Minutes',
  description: 'Free online CV builder with 8 professional templates. Create, customize, and download your CV as PDF or Word. Supports English, Arabic, and Kurdish.',
  keywords: 'cv maker, resume builder, cv template, professional cv, free cv, pdf cv, word cv',
  authors: [{ name: 'CV Maker' }],
  openGraph: {
    title: 'CV Maker - Create Professional CVs in Minutes',
    description: 'Free online CV builder with 8 professional templates.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
