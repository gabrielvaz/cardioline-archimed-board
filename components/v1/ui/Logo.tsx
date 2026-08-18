import Image from "next/image";
import { cn } from "@/lib/v1/cn";

/**
 * Logo oficial da Cardioline.
 *
 * O asset e o logotipo real, nao uma reconstrucao tipografica. O SVG em
 * public/brand/ foi obtido vetorizando o PNG oficial publicado pela Cardioline
 * (o site nao distribui SVG) com precisao sub-pixel; o script esta versionado
 * em public/brand/vectorize-logo.py e os PNGs originais foram preservados ao
 * lado como fonte de verdade. Desvio de massa de tinta: +0,57%.
 */
export function CardiolineLogo({
  variant = "brand",
  className,
  priority = false,
}: {
  variant?: "brand" | "white";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={variant === "white" ? "/brand/cardioline-logo-white.svg" : "/brand/cardioline-logo.svg"}
      alt="Cardioline"
      width={600}
      height={38}
      priority={priority}
      className={cn("h-auto w-[132px] sm:w-[150px]", className)}
    />
  );
}

/**
 * Assinatura do produto: o logo institucional mais o nome do produto,
 * separados por um filete. Mantem a hierarquia Cardioline > Anchor.
 */
export function AnchorLockup({
  variant = "brand",
  className,
  priority = false,
}: {
  variant?: "brand" | "white";
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <CardiolineLogo variant={variant} priority={priority} />
      <span
        aria-hidden
        className={cn("h-5 w-px", variant === "white" ? "bg-white/25" : "bg-line-strong")}
      />
      <span
        className={cn(
          "text-[0.9375rem] font-semibold tracking-[-0.01em]",
          variant === "white" ? "text-white" : "text-ink",
        )}
      >
        Anchor
      </span>
    </span>
  );
}
