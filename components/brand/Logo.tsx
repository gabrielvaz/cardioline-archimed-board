/**
 * Logo oficial da Cardioline.
 *
 * Sempre o SVG vetorizado do asset real — o wordmark nunca é recriado com
 * texto. O aspecto é 600x38 (15.8:1), então só a largura é declarada.
 */
type Props = { width?: number; variant?: "orange" | "white"; className?: string };

export function Logo({ width = 132, variant = "orange", className }: Props) {
  const src =
    variant === "white"
      ? "/brand/cardioline-logo-white.svg"
      : "/brand/cardioline-logo.svg";
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG estático, sem ganho em otimizar
    <img
      src={src}
      alt="Cardioline"
      width={width}
      height={Math.round((width * 38) / 600)}
      className={className}
    />
  );
}

/** O "C" no squircle — a forma de onde sai o raio dos contêineres do sistema. */
export function Symbol({ size = 64, className }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/cardioline-symbol.svg"
      alt=""
      width={size}
      height={size}
      className={className}
    />
  );
}
