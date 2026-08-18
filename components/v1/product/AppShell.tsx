import { cn } from "@/lib/v1/cn";
import { AnchorLockup, CardiolineLogo } from "@/components/v1/ui/Logo";
import {
  IconAnalytics,
  IconBell,
  IconDevices,
  IconExams,
  IconHome,
  IconPatients,
  IconReports,
  IconSearch,
} from "@/components/v1/icons";

/**
 * Moldura de navegador.
 *
 * Desenhada em HTML/CSS, nao como imagem achatada, para que os mockups
 * internos permanecam reutilizaveis, selecionaveis e legiveis em qualquer
 * densidade de tela. A barra de endereco mostra um dominio de demonstracao.
 */
export function BrowserFrame({
  url = "anchor.cardioline.com",
  className,
  children,
  compact = false,
}: {
  url?: string;
  className?: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[12px] border border-line bg-white shadow-[var(--shadow-panel)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 border-b border-line bg-surface-muted px-3",
          compact ? "h-8" : "h-10",
        )}
      >
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-line bg-white px-2.5 py-1">
          <svg viewBox="0 0 24 24" className="size-3 shrink-0 text-status-reported" aria-hidden>
            <path
              d="M5 10.5h14V20H5zM8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="truncate text-[11px] text-ink-3">{url}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

const NAV = [
  { label: "Home", icon: IconHome },
  { label: "Exams", icon: IconExams },
  { label: "Patients", icon: IconPatients },
  { label: "Reports", icon: IconReports },
  { label: "Devices", icon: IconDevices },
  { label: "Analytics", icon: IconAnalytics },
];

/** Navegacao lateral do Anchor. */
export function Sidebar({
  active = "Home",
  className,
  compact = false,
}: {
  active?: string;
  className?: string;
  /**
   * Variante estreita para molduras apertadas. Cada pixel que a sidebar cede
   * vai para a area de conteudo, que precisa de pelo menos 448 px para
   * renderizar a worklist como tabela em vez de cartoes.
   */
  compact?: boolean;
}) {
  return (
    <nav
      aria-label="Anchor navigation (prototype)"
      className={cn(
        "flex shrink-0 flex-col border-r border-line bg-surface-muted/60",
        compact ? "w-[152px]" : "w-[178px]",
        className,
      )}
    >
      <div className={cn("border-b border-line py-3.5", compact ? "px-3" : "px-4")}>
        {compact ? (
          // Sem a assinatura completa: a barra de endereco da moldura ja
          // identifica o produto, e o wordmark sozinho cabe em 152 px.
          <CardiolineLogo className="w-[76px]" />
        ) : (
          <AnchorLockup className="gap-2 [&_img]:w-[80px] [&_img]:sm:w-[80px] [&>span:last-child]:text-[12px]" />
        )}
      </div>
      <ul className={cn("flex flex-1 flex-col gap-0.5", compact ? "p-1.5" : "p-2")}>
        {NAV.map(({ label, icon: Icon }) => {
          const isActive = label === active;
          return (
            <li key={label}>
              <span
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium",
                  isActive ? "bg-white text-ink shadow-[var(--shadow-subtle)]" : "text-ink-2",
                )}
              >
                <Icon className={cn("size-[15px]", isActive ? "text-brand" : "text-ink-3")} />
                {label}
                {isActive ? (
                  <span aria-hidden className="ml-auto h-3.5 w-[2px] rounded-full bg-brand" />
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
      <div className={cn("border-t border-line", compact ? "p-2.5" : "p-3")}>
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-navy text-[10px] font-semibold text-white">
            AF
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[11.5px] font-semibold text-ink">Dr. A. Ferrari</span>
            <span className="block truncate text-[10.5px] text-ink-3">Cardiology</span>
          </span>
        </div>
      </div>
    </nav>
  );
}

/** Barra superior de uma tela do Anchor. */
export function AppTopBar({
  title,
  subtitle,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex items-center gap-4 border-b border-line px-5 py-3.5", className)}>
      <div className="min-w-0">
        <h4 className="truncate text-[15px] tracking-[-0.015em]">{title}</h4>
        {subtitle ? <p className="truncate text-[11.5px] text-ink-3">{subtitle}</p> : null}
      </div>
      <div className="ml-auto flex items-center gap-2">
        {actions}
        <span className="hidden items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-[11px] text-ink-3 sm:flex">
          <IconSearch className="size-3.5" />
          Search
        </span>
        <span className="relative flex size-7 items-center justify-center rounded-md border border-line text-ink-2">
          <IconBell className="size-3.5" />
          <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-brand ring-2 ring-white" />
        </span>
      </div>
    </header>
  );
}

/** Rotulo de dado clinico com valor em numerais tabulares. */
export function DataPoint({
  label,
  value,
  unit,
  tone = "default",
  className,
}: {
  label: string;
  value: string | number;
  unit?: string;
  tone?: "default" | "brand" | "alert";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-[10px] font-semibold tracking-[0.07em] text-ink-3 uppercase">
        {label}
      </span>
      <span
        className={cn(
          "tnum text-[15px] leading-none font-semibold",
          tone === "brand" ? "text-brand-ink" : tone === "alert" ? "text-status-priority" : "text-ink",
        )}
      >
        {value}
        {unit ? <span className="ml-0.5 text-[11px] font-medium text-ink-3">{unit}</span> : null}
      </span>
    </div>
  );
}
