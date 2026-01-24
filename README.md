# CV Maker - Professional CV Builder

A production-ready CV builder with 8 professional templates, multilingual support (English, Arabic, Kurdish), PDF/Word export, and user accounts.

## Features

- **8 Professional Templates**: Classic, Modern, Executive, Creative, Minimal, Tech, Academic, Professional
- **Multilingual Support**: English, Arabic (RTL), Kurdish (RTL)
- **Export Options**: PDF and Word document generation
- **Social Sharing**: WhatsApp and Telegram integration
- **User Accounts**: Sign up and save CVs to the cloud
- **Validation**: Field validation with helpful error messages
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt
- **Export**: html2canvas + jsPDF for PDF, docx library for Word

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Vercel Postgres, Supabase, Neon, etc.)

### Installation

```bash
# Clone & install
git clone https://github.com/yourusername/cv-maker.git
cd cv-maker
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Set up database
npm run db:generate
npm run db:push

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `DIRECT_URL` - Direct database URL
   - `JWT_SECRET` - Secure random string
4. Deploy!

## Project Structure

```
cv-maker/
├── prisma/schema.prisma    # Database schema
├── src/
│   ├── app/
│   │   ├── api/auth/       # Auth endpoints
│   │   ├── api/cv/         # CV endpoints
│   │   └── page.tsx        # Home page
│   ├── components/
│   │   └── CVBuilder.tsx   # Main component
│   ├── lib/                # Utilities
│   └── templates/          # 8 CV templates
└── package.json
```

## Templates

1. **Classic** - ATS-friendly traditional layout
2. **Modern** - Fresh gradient header design
3. **Executive** - Dark sidebar with gold accents
4. **Creative** - Colorful gradient for creatives
5. **Minimal** - Simple typography-focused
6. **Tech** - Dark theme for IT professionals
7. **Academic** - Formal serif for researchers
8. **Professional** - Balanced two-column layout

## API Endpoints

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/cv/save` - Save CV (auth required)
- `GET /api/cv/save` - Get user's CVs (auth required)

## License

MIT License
