import Reveal from "./Reveal";

const TONES = {
  dark: "bg-abyss text-white",
  mist: "bg-mist text-ink on-light",
  sand: "bg-sand text-ink on-light",
  paper: "bg-paper text-ink on-light",
};

export default function Section({
  id,
  tone,
  title,
  intro,
  children,
}: {
  id: string;
  tone: keyof typeof TONES;
  title: React.ReactNode;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-16 ${TONES[tone]}`}>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-6 md:py-24">
        <Reveal>
          <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-tight">{title}</h2>
          {intro && (
            <p className={`mt-3 max-w-xl text-lg ${tone === "dark" ? "text-white/70" : "text-muted"}`}>
              {intro}
            </p>
          )}
        </Reveal>
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  );
}
