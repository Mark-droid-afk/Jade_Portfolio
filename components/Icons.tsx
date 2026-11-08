type P = { className?: string };

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const HomeIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9.5h13V10" />
  </svg>
);
export const UserIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
  </svg>
);
export const GridIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </svg>
);
export const MailIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
    <path d="m4.5 7.5 7.5 6 7.5-6" />
  </svg>
);
export const SparkleIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M11 4.5 12.7 9.8 18 11.5l-5.3 1.7L11 18.5l-1.7-5.3L4 11.5l5.3-1.7z" />
    <path d="M18.5 3.5v3M17 5h3" />
  </svg>
);
export const CheckIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const CloseIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const SendIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 12 20 4l-4 16-4.2-6.3z" />
    <path d="M11.8 13.7 20 4" />
  </svg>
);

export const ExternalIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M7 17 17 7" />
    <path d="M8.5 7H17v8.5" />
  </svg>
);
export const PlusIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const PinIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 32" className={className} aria-hidden>
    <path
      d="M12 1C6.5 1 2.5 5 2.5 10.2c0 6.6 8 15.6 9.1 16.8.2.2.6.2.8 0 1.1-1.2 9.1-10.2 9.1-16.8C21.5 5 17.5 1 12 1Z"
      fill="#E5402B"
    />
    <circle cx="12" cy="10.2" r="3.6" fill="#fff" />
  </svg>
);

export const SunIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
  </svg>
);
export const MoonIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);
export const SearchIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);
export const ThumbIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M7 11v9H4.5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1H7Z" />
    <path d="M7 11l4-7c1.5 0 2.5 1 2.5 2.5V9H19a1.5 1.5 0 0 1 1.5 1.8l-1.3 7A2 2 0 0 1 17.2 19.5H7" />
  </svg>
);
