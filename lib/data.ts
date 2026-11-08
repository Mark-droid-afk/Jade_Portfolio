// All site content lives here. Gurrabot answers from this file too,
// so editing it updates both the page and the chatbot.

export const profile = {
  name: "Mark Jade D. Gurrobat",
  firstLine: "Mark Jade",
  lastLine: "D. Gurrobat",
  role: "BSIT Student & Full-Stack Developer",
  summary:
    "BSIT student who builds full-stack systems, from native Android apps to AI-assisted desktop software.",
  program: "Bachelor of Science in Information Technology, 4th year",
  // Optional: fill these in to show them on the page and to Gurrabot. Empty values stay hidden.
  school: "",
  location: "",
  email: "",
  github: "",
  linkedin: "",
  cvUrl: "", // e.g. "/Gurrobat_CV.pdf" after adding the file to /public
  photoFormal: "/photo-formal.jpg",
  photoCasual: "/photo-casual.jpg",
  about: [
    "I’m a fourth-year Information Technology student who builds full-stack systems and cares about the parts that make them dependable: clear architecture, tested features, and documentation people can follow.",
    "My capstone work includes a native Android election platform with an NLP-based candidate credibility score, and a desktop recipe cost estimator with an AI chat assistant. Outside of code, I’m a member of KATAGA, where I help plan student events.",
  ],
};

export const focus = ["Full-stack web", "Native Android", "AI-assisted features", "Research and documentation"];

export const principles = [
  {
    title: "Clear architecture",
    detail: "Feature-based structure, so each use case lives in its own place.",
  },
  {
    title: "Tested features",
    detail: "Structured test cases and bug reports before anything ships.",
  },
  {
    title: "Documentation",
    detail: "Process diagrams, test notes, and research writing that others can follow.",
  },
];

export type ProjectSection = { heading: string; body: string };

export type Project = {
  slug: string;
  name: string;
  kind: string;
  category: "Capstone" | "Personal";
  tagline: string;
  overview: string;
  highlights: string[];
  stack: string[];
  featured?: boolean; // featured projects get the large image showcase
  image?: string; // e.g. "/projects/bfc.png" (file in /public/projects)
  frame?: "phone" | "window"; // how the image is framed
  imageBg?: string; // background color behind the image
  link?: { label: string; url: string };
  repo?: string; // "owner/name" on GitHub: shows live repo stats and feeds Gurrabot the README
  gallery?: string[]; // extra images in /public, shown on the case-study page
  video?: string; // e.g. "/projects/demo.mp4" in /public
  sections?: ProjectSection[]; // extra case-study sections
};

export const projects: Project[] = [
  {
    slug: "votera",
    name: "Votera",
    kind: "Capstone",
    category: "Capstone",
    featured: true,
    tagline:
      "A student election platform with an automated candidate credibility checker, built as a native Android app.",
    overview:
      "Votera is a research prototype of a digital student election platform. Its Automated Candidate Credibility Checker scores candidates from their manifestos and verified documents, so voters can compare them with confidence. A browser copy is available for people who can’t install the Android app.",
    highlights: [
      "Sign in with student number, password, and a one-time code",
      "Candidate profiles with manifesto, verified documents, and a credibility score breakdown",
      "Compare candidates side by side, or match them against your own priorities",
      "One vote per position, with a ballot review and a SHA-256 transaction ID receipt",
      "Admin tools to schedule voting, manage candidates, and review similarity flags and the audit log",
      "Manifesto originality scored with TF-IDF and cosine similarity",
    ],
    stack: ["Kotlin", "Jetpack Compose", "Material 3", "FastAPI", "PostgreSQL", "JWT", "SHA-256", "TF-IDF"],
    image: "/projects/votera.png",
    frame: "phone",
    imageBg: "#FBF8F5",
    link: { label: "Open live demo", url: "https://mark-droid-afk.github.io/votera-android/" },
    repo: "Mark-droid-afk/votera-android",
    sections: [
      {
        heading: "Credibility scoring",
        body: "Each candidate’s manifesto originality is computed with TF-IDF and cosine similarity. A side-by-side similarity view flags scores of 0.70 or higher, and those flags are for review only. Administrators enter the verified scores.",
      },
      {
        heading: "Security and integrity",
        body: "Students sign in with a student number, a password, and a one-time code. Access is role-based, and every vote returns a SHA-256 transaction ID receipt. Administrators get an audit log and a self-test of the research methods: bcrypt, JWT, RBAC, HOTP, SHA-256, tally, Quick Sort, and TF-IDF.",
      },
      {
        heading: "Two ways to use it",
        body: "The native Android app is the main version, with the full administrator tools. A browser copy runs on any phone or computer for people who can’t install the app, and covers the student functions and the main administrator screens.",
      },
      {
        heading: "One shared backend",
        body: "Both versions talk to the same FastAPI and PostgreSQL server, so accounts, votes, and scores are shared between them.",
      },
      {
        heading: "Research context",
        body: "Votera is a research prototype made for a research course. All names, accounts, and votes in it are fictional, and it is not meant for real elections.",
      },
    ],
  },
  {
    slug: "budget-friendly-cooking",
    name: "Budget-Friendly Cooking",
    kind: "Capstone 1",
    category: "Capstone",
    featured: true,
    tagline: "A desktop app that estimates what a recipe costs, with an AI chat assistant to help you plan.",
    overview:
      "Budget-Friendly Cooking is a desktop recipe cost estimator built with PyQt6. It keeps ingredient prices up to date, recommends recipes that fit a budget, and includes an AI chat assistant powered by the Groq API.",
    highlights: [
      "Price sync service and recipe recommendation engine",
      "AI chat assistant using the Groq API",
      "Dashboard with page transition animations and a notification system",
      "Settings for appearance, security, account, budget, and data export",
      "Admin panel with a diagnostics tab",
      "Database layer refactored into modular components",
    ],
    stack: ["Python", "PyQt6", "SQLite", "Supabase", "Groq API"],
    frame: "window",
    link: { label: "View on GitHub", url: "https://github.com/Mark-droid-afk/Budget-Friendly-Cooking" },
    repo: "Mark-droid-afk/Budget-Friendly-Cooking",
    sections: [
      {
        heading: "How it’s built",
        body: "Background work runs in QThread-based workers, a global signal bus connects the screens, and themes are applied through a single function. Database access is split into modular components behind a connection context manager.",
      },
      {
        heading: "AI chat assistant",
        body: "A chat assistant powered by the Groq API helps with recipe and budget questions inside the app.",
      },
      {
        heading: "Admin and diagnostics",
        body: "An admin panel with a diagnostics tab makes it easier to check that price syncing and the database are healthy.",
      },
    ],
  },
  {
    slug: "ipon",
    name: "Ipon",
    kind: "Personal project",
    category: "Personal",
    tagline: "A personal finance tracker with a receipt-style design.",
    overview:
      "Ipon is a personal finance tracker built in PHP with a receipt-style design, made to run both online and offline.",
    highlights: ["Receipt-style interface", "Runs both online and offline"],
    stack: ["PHP"],
  },
  {
    slug: "event-check-in",
    name: "Event Check-in",
    kind: "Personal project",
    category: "Personal",
    tagline: "A progressive web app for QR code event check-in.",
    overview:
      "Event Check-in is a progressive web app for QR code event check-in, built with a feature-based architecture so each use case lives in its own file.",
    highlights: ["QR code check-in", "Feature-based architecture, one use case per file"],
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
export const certifications: Certification[] = [];

export const involvement: Involvement[] = [
  {
    tag: "Community",
    title: "KATAGA",
    summary: "Student organization member and event planner.",
    detail:
      "Member of the college student organization. Involved in event planning and officer candidacy, and helped design a Campus Survival Bingo scavenger hunt for the freshmen orientation.",
  },
  {
    tag: "Research",
    title: "Research writing",
    summary: "Wrote and revised the Votera research paper.",
    detail:
      "Wrote and revised the Votera research paper, including the survey questionnaire and algorithm documentation. Validators approved Chapters 1 to 3 and the questionnaire.",
  },
  {
    tag: "Teamwork",
    title: "Capstone team",
    summary: "Builds and documents capstone systems with a team.",
    detail:
      "Collaborates with a capstone team on development, documentation, and research writing for Votera and Budget-Friendly Cooking.",
  },
];

export type Involvement = { tag: string; title: string; summary: string; detail: string };
export type Certification = { title: string; issuer: string; year?: string };
export type Testimonial = { quote: string; name: string; role?: string; approved?: boolean };
export type Note = { slug: string; title: string; date: string; summary: string; body: string };

// Add quotes here (or in the admin page). Only entries with approved: true are shown.
export const testimonials: Testimonial[] = [];

export const notes: Note[] = [
  {
    slug: "building-gurrabot",
    title: "Building Gurrabot, the AI assistant on this site",
    date: "2026-11-08",
    summary: "How the chatbot works, what guards it, and what I learned when its AI model was retired.",
    body: `Gurrabot answers questions about my work so visitors don’t have to hunt for details. This is a short log of how it works.

## One source of truth

The page and the chatbot read the same content. When I update a project, Gurrabot learns it at the same time, so the two can’t disagree.

## How a reply is made

1. The browser sends the last few messages to a server route.
2. The route adds a system prompt built from my profile and project notes, then calls the Groq API.
3. The reply streams back word by word, so the answer starts appearing right away.

The API key never reaches the browser.

## Guardrails

- Each visitor is limited to a small number of messages every ten minutes.
- Messages are length-capped, and only the most recent ones are sent.
- The prompt tells Gurrabot to answer only from my profile and to say so when it doesn’t know.

## When the model was retired

The model I first chose was retired by the provider, and the chat started failing with a generic error. The fix had three parts:

- Try a list of models in order instead of relying on one.
- Ignore an API key pasted into the model setting by mistake.
- Log the provider’s error on the server so the cause is visible.

The lesson: external services change underneath you, so build for fallbacks and make failures easy to diagnose.`,
  },
];

export function getStats(list: Project[] = projects, groups: Record<string, string[]> = skills) {
  return [
    { value: list.length, label: "Projects built" },
    { value: list.filter((p) => p.category === "Capstone").length, label: "Capstone systems" },
    { value: Object.values(groups).flat().length, label: "Tools & technologies" },
  ];
}
