import { cn } from "@/lib/v1/cn";
import { Container } from "./Container";

type Tone = "default" | "muted" | "navy" | "soft";

const tones: Record<Tone, string> = {
  default: "bg-background",
  muted: "bg-surface-muted",
  soft: "bg-brand-soft/45",
  navy: "bg-navy text-white",
};

export function Section({
  id,
  tone = "default",
  className,
  bleed = false,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  /** true remove o Container, para secoes que gerenciam seu proprio grid */
  bleed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-24 lg:py-28", tones[tone], className)}>
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("eyebrow flex items-center gap-2.5 text-brand-ink", className)}>
      <span aria-hidden className="h-px w-6 bg-brand/50" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  invert = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-3xl",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        className={cn(
          "text-[2rem] leading-[1.1] sm:text-[2.5rem] lg:text-[3rem]",
          invert && "text-white",
        )}
      >
        {title}
      </h2>
      {intro ? (
        <p className={cn("text-lg", invert ? "text-white/72" : "text-ink-2")}>{intro}</p>
      ) : null}
    </div>
  );
}
