import Image from "next/image";
import Link from "next/link";

export default function SiteFooter({
  name,
  contacts,
}: {
  name: string;
  contacts: { label: string; href: string }[];
}) {
  return (
    <footer className="border-t border-white/10 bg-abyss">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 pb-28 pt-8 text-sm text-white/70 md:px-6 md:pb-8">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
          <p>
            © {new Date().getFullYear()} {name}
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          {contacts.map((c) => (
            <a key={c.label} href={c.href} className="hover:text-mint">
              {c.label}
            </a>
          ))}
          <Link href="/notes" className="hover:text-mint">
            Notes
          </Link>
          <a href="#top" className="hover:text-mint">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
