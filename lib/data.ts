// All site content lives here. Gurrabot answers from this file too,
// so editing it updates both the page and the chatbot.

export const profile = {
  name: "Mark Jade D. Gurrobat",
  firstLine: "Mark Jade",
  lastLine: "D. Gurrobat",
  role: "BSIT Student & Full-Stack Developer",
  summary:
    "BSIT student who builds full-stack systems, from native Android apps to AI-assisted CRM platforms.",
  program: "Bachelor of Science in Information Technology, 4th year",
  // Optional: fill these in to show them on the page and to Gurrabot. Empty values stay hidden.
  school: "",
  location: "",
  email: "",
  github: "",
  linkedin: "",
  cvUrl: "", // e.g. "/Gurrobat_CV.pdf" after adding the file to /public
  about: [
    "I’m a fourth-year Information Technology student who builds full-stack systems and cares about the parts that make them dependable: clear architecture, tested features, and documentation people can follow.",
    "My capstone work includes a native Android election platform with an NLP-based candidate credibility score, and a CRM analytics system with an AI microservice. Outside of code, I’m a member of KATAGA, where I help plan student events.",
  ],
};

export const focus = ["Full-stack web", "Native Android", "AI-assisted features", "QA and documentation"];

export const principles = [
  {
    title: "Clear architecture",
    detail: "Feature-based structure, so each use case lives in its own place.",
  },
  {
    title: "Tested features",
    detail: "Structured QA: 40+ defects logged and end-to-end test reports for SentraCX.",
  },
  {
    title: "Documentation",
    detail: "Process diagrams, test reports, and research writing that others can follow.",
  },
];

export type Project = {
  name: string;
  kind: string;
  category: "Capstone" | "Personal";
  description: string;
  stack: string[];
  highlights?: string[];
  image?: string; // optional, e.g. "/projects/votera.png" (file in /public)
  github?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    name: "Votera",
    kind: "Capstone",
    category: "Capstone",
    description: "Native Android platform for student council elections.",
    highlights: [
      "Candidate credibility checker that scores candidates with TF-IDF, cosine similarity, and a weighted sum model",
      "Secure access with SHA-256 hashing, JWT, and role-based access control",
      "OTP and transaction ID verification for votes",
    ],
    stack: ["Native Android", "TF-IDF", "JWT", "RBAC"],
  },
  {
    name: "SentraCX (CRM-ACPE)",
    kind: "Capstone enhancement",
    category: "Capstone",
    description:
      "CRM analytics and predictive enhancement system with CRM, HR, POS, campaign, and ticket modules.",
    highlights: [
      "FastAPI AI microservice powered by Groq and Gemini language models",
      "Multi-database design: PostgreSQL for records, MongoDB for conversation transcripts, Redis for conversation summaries",
      "40+ defects documented in structured QA reports, plus end-to-end test reports",
    ],
    stack: ["Next.js", "ASP.NET Core", "PostgreSQL", "MongoDB", "Redis", "FastAPI"],
  },
  {
    name: "Budget-Friendly Cooking",
    kind: "Capstone 1",
    category: "Capstone",
    description: "Desktop app that estimates the cost of household recipes.",
    highlights: [
      "Price sync service and recipe recommendation engine",
      "AI chat assistant using the Groq API",
      "Admin panel with diagnostics, plus settings for appearance, security, budget, and data export",
    ],
    stack: ["Python", "PyQt6", "SQLite", "Supabase", "Groq API"],
  },
  {
    name: "Ipon",
    kind: "Personal project",
    category: "Personal",
    description:
      "Personal finance tracker with a receipt-style design, built to run both online and offline.",
    stack: ["PHP"],
  },
  {
    name: "Event Check-in",
    kind: "Personal project",
    category: "Personal",
    description:
      "Progressive web app for QR code event check-in, built with a feature-based architecture.",
    stack: ["PWA", "QR codes"],
  },
];

export const skills: Record<string, string[]> = {
  Languages: ["Python", "TypeScript", "C#", "PHP"],
  Frontend: ["React", "Next.js", "Tailwind CSS"],
  "Backend & desktop": ["ASP.NET Core", "FastAPI", "PyQt6"],
  Databases: ["PostgreSQL", "MongoDB", "Redis", "SQLite", "Supabase"],
  "AI & tools": ["Groq API", "Gemini", "draw.io", "Git & GitHub", "Vercel"],
};

// Optional: add entries and a Certifications section appears automatically.
// Example: { title: "Certificate name", issuer: "Issuer", year: "2026" }
export const certifications: { title: string; issuer: string; year?: string }[] = [];

export const involvement = [
  {
    tag: "Community",
    title: "KATAGA",
    detail:
      "Member of the college student organization. Involved in event planning and officer candidacy, and helped design a Campus Survival Bingo scavenger hunt for the freshmen orientation.",
  },
  {
    tag: "Quality",
    title: "Capstone QA and documentation",
    detail:
      "Logged 40+ UI/UX defects with structured bug reports across the CRM, HR, POS, campaign, and ticket modules of SentraCX. Produced end-to-end test reports and process architecture diagrams.",
  },
  {
    tag: "Research",
    title: "Research writing",
    detail:
      "Wrote and revised the Votera research paper, including the survey questionnaire and algorithm documentation. Validators approved Chapters 1 to 3 and the questionnaire.",
  },
];

export function getStats() {
  return [
    { value: String(projects.length), label: "Projects built" },
    { value: String(projects.filter((p) => p.category === "Capstone").length), label: "Capstone systems" },
    { value: "40+", label: "QA defects logged" },
    { value: String(Object.values(skills).flat().length), label: "Tools & technologies" },
  ];
}

// Plain-text profile handed to Gurrabot as its only source of truth.
export function buildKnowledge(): string {
  const lines: string[] = [
    `Name: ${profile.name}`,
    `Role: ${profile.role}`,
    `Program: ${profile.program}`,
  ];
  if (profile.school) lines.push(`School: ${profile.school}`);
  if (profile.location) lines.push(`Location: ${profile.location}`);
  lines.push(
    `Summary: ${profile.summary}`,
    `About: ${profile.about.join(" ")}`,
    `Focus areas: ${focus.join(", ")}`,
    `How he works: ${principles.map((p) => `${p.title} (${p.detail})`).join(" ")}`,
    "",
    "Projects:",
    ...projects.map(
      (p) =>
        `- ${p.name} (${p.kind}): ${p.description}${
          p.highlights ? " Highlights: " + p.highlights.join("; ") + "." : ""
        } Tech: ${p.stack.join(", ")}.`
    ),
    "",
    "Skills:",
    ...Object.entries(skills).map(([k, v]) => `- ${k}: ${v.join(", ")}`),
    "",
    "Involvement:",
    ...involvement.map((i) => `- ${i.title}: ${i.detail}`),
    ""
  );
  if (certifications.length) {
    lines.push(
      "Certifications:",
      ...certifications.map((c) => `- ${c.title}, ${c.issuer}${c.year ? ` (${c.year})` : ""}`),
      ""
    );
  }
  lines.push("Contact:");
  if (profile.email) lines.push(`- Email: ${profile.email}`);
  if (profile.github) lines.push(`- GitHub: ${profile.github}`);
  if (profile.linkedin) lines.push(`- LinkedIn: ${profile.linkedin}`);
  if (!profile.email && !profile.github && !profile.linkedin)
    lines.push("- No public contact details are listed on the site yet.");
  return lines.join("\n");
}
