import { cn } from "@/lib/v1/cn";
import { IconCheck } from "@/components/v1/icons";

/** Item de lista de capacidade, com marcador em vez de bullet generico. */
export function CheckItem({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "brand" | "navy";
  className?: string;
}) {
  return (
    <li className={cn("flex items-start gap-3", className)}>
      <IconCheck
        className={cn(
          "mt-[3px] size-[18px] shrink-0",
          tone === "brand" ? "text-brand-ink" : tone === "navy" ? "text-white/70" : "text-ink-3",
        )}
        strokeWidth={2}
      />
      <span className={cn("text-[0.9375rem]", tone === "navy" ? "text-white/80" : "text-ink-2")}>
        {children}
      </span>
    </li>
  );
}

/** Cartao de capacidade: icone, titulo, corpo. Borda fina, sombra minima. */
export function FeatureCard({
  icon,
  title,
  children,
  className,
  invert = false,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  invert?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[14px] border p-6",
        invert
          ? "border-white/12 bg-white/[0.04]"
          : "border-line bg-surface shadow-[var(--shadow-subtle)]",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-[10px]",
          invert ? "bg-white/8 text-white" : "bg-brand-soft text-brand",
        )}
      >
        {icon}
      </span>
      <h3 className={cn("text-lg tracking-[-0.015em]", invert && "text-white")}>{title}</h3>
      <p className={cn("text-[0.9375rem]", invert ? "text-white/65" : "text-ink-2")}>{children}</p>
    </div>
  );
}
