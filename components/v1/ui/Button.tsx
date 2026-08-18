import { cn } from "@/lib/v1/cn";

type Variant = "primary" | "secondary" | "ghost" | "onNavy" | "onNavySolid";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-strong text-white hover:bg-brand-strong-hover active:bg-brand-strong-hover shadow-[0_1px_2px_rgba(7,16,70,0.08)]",
  secondary:
    "bg-white text-ink border border-line-strong hover:border-ink-3 hover:bg-surface-muted",
  ghost: "text-ink hover:bg-surface-muted",
  onNavySolid: "bg-brand-strong text-white hover:bg-brand-strong-hover",
  onNavy: "border border-white/25 text-white hover:bg-white/10 hover:border-white/40",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

/**
 * Prototipo: as acoes navegam por anchors da propria pagina. Nenhum CTA
 * dispara autenticacao, pagamento ou chamada de rede.
 */
export function Button({
  href = "#",
  variant = "primary",
  size = "md",
  className,
  children,
  full = false,
  ...rest
}: {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  full?: boolean;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"a">, "href" | "className" | "children">) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-150",
        variants[variant],
        sizes[size],
        full && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
