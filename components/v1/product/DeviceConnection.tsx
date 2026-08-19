import Image from "next/image";
import { cn } from "@/lib/v1/cn";
import { IconCheck, IconCloud, IconConnect } from "@/components/v1/icons";
import { asset } from "@/lib/asset";

/**
 * Cartao de pareamento dispositivo-workspace.
 *
 * Usa a fotografia oficial do produto: o hardware Cardioline nao e
 * redesenhado nem recebe conectores que nao existem.
 */
export function DeviceConnection({
  className,
  compact = false,
}: {
  className?: string;
  /** variante reduzida para sobreposicao — omite a lista de beneficios */
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[12px] border border-line bg-white shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line bg-surface-muted/70 px-4 py-2.5">
        <IconConnect className="size-3.5 text-brand" />
        <span className="text-[11.5px] font-semibold text-ink">
          Device connected
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[10.5px] font-medium text-status-reported-ink">
          <span className="size-1.5 rounded-full bg-status-reported" />
          Online
        </span>
      </div>

      <div className="flex items-center gap-4 px-4 py-3.5">
        <div className="relative size-16 shrink-0 sm:size-20">
          <Image
            src={asset("/devices/ecg200l-cover-02.png")}
            alt="Cardioline ECG200L electrocardiograph"
            fill
            sizes="80px"
            className="object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-ink">ECG200L</p>
          <p className="text-[11.5px] text-ink-2">
            12-lead resting ECG · Room 2
          </p>
          <p className="tnum mt-1 text-[10.5px] text-ink-3">
            Serial 200L-4471-EU · Last sync 2 min ago
          </p>
        </div>
      </div>

      {compact ? null : (
        <ul className="flex flex-col gap-1.5 border-t border-line px-4 py-3">
          {[
            "Anchor access included",
            "No local installation",
            "Exams sync automatically",
          ].map((t) => (
            <li
              key={t}
              className="flex items-center gap-2 text-[12px] text-ink-2"
            >
              <IconCheck
                className="size-3.5 shrink-0 text-status-reported"
                strokeWidth={2.2}
              />
              {t}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2 border-t border-line bg-brand-soft/40 px-4 py-2.5">
        <IconCloud className="size-3.5 shrink-0 text-brand" />
        <span className="text-[11.5px] font-medium text-ink">
          Anchor Free active. No subscription
        </span>
      </div>
    </div>
  );
}
