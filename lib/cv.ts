export type TemplateId = "modern" | "classic" | "minimal";

export const Templates: { id: TemplateId; label: string }[] = [
  { id: "modern", label: "Modern" },
  { id: "classic", label: "Classic" },
  { id: "minimal", label: "Minimal" },
];

export type SectionKey =
  | "profile"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages";

export const defaultSectionOrder: SectionKey[] = [
  "profile",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
];

export type Experience = {
  id: string;
  title: string;
  company: string;
  location?: string;
  start?: string;
  end?: string;
  bullets: string[];
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  field?: string;
  start?: string;
  end?: string;
  notes?: string;
};

export type Project = {
  id: string;
  name: string;
  role?: string;
  link?: string;
  bullets: string[];
};

export type Certification = {
  id: string;
  name: string;
  issuer?: string;
  year?: string;
};

export type Language = {
  id: string;
  name: string;
  level?: string;
};

export type CVData = {
  profile: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  sectionOrder: SectionKey[];
};

export const defaultCV: CVData = {
  profile: {
    fullName: "Your Name",
    title: "Your Target Role",
    email: "you@email.com",
    phone: "+964 000 000 0000",
    location: "Erbil, Iraq",
    website: "linkedin.com/in/yourname",
  },
  summary:
    "Write a short, strong summary.\n" +
    "Focus on your impact, tools, and results.\n" +
    "Keep it clean and direct.",
  experience: [
    {
      id: "exp-1",
      title: "Data Analyst",
      company: "Company Name",
      location: "Erbil, Iraq",
      start: "Jan 2023",
      end: "Present",
      bullets: [
        "Built dashboards that reduced reporting time by 60%.",
        "Automated data cleaning pipelines in Python and SQL.",
        "Partnered with stakeholders to define KPIs and improve decisions.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "University Name",
      degree: "Bachelor's",
      field: "Information Technology",
      start: "2018",
      end: "2022",
      notes: "Optional: GPA, honors, relevant courses.",
    },
  ],
  skills: ["SQL", "Python", "Power BI", "Excel", "Data Modeling"],
  projects: [
    {
      id: "prj-1",
      name: "CV Builder Web App",
      role: "Full-stack",
      link: "github.com/yourname/cv-builder",
      bullets: ["Built a CV builder with templates and export.", "Designed print-ready A4 layouts."],
    },
  ],
  certifications: [
    { id: "cert-1", name: "Google Data Analytics", issuer: "Google", year: "2024" },
  ],
  languages: [
    { id: "lang-1", name: "English", level: "Fluent" },
    { id: "lang-2", name: "Arabic", level: "Native" },
  ],
  sectionOrder: defaultSectionOrder,
};
