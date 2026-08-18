import { cn } from "@/lib/v1/cn";

/** Largura maxima e gutters unicos para toda a pagina. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10", className)}>
      {children}
    </div>
  );
}
