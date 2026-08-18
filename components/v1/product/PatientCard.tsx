import { cn } from "@/lib/v1/cn";
import { patientTimeline } from "@/lib/v1/data";
import { DataPoint } from "./AppShell";
import { ECGSparkline } from "./ECGWaveform";

/** Cartao de identificacao do paciente. Dados ficticios. */
export function PatientCard({
  className,
  bare = false,
}: {
  className?: string;
  /** remove moldura — para uso dentro de outro dispositivo/painel */
  bare?: boolean;
}) {
  return (
    <div className={cn("bg-white p-4", bare ? "" : "rounded-[12px] border border-line", className)}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-[13px] font-semibold text-white">
          ER
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-ink">Emma Rossi</p>
          <p className="tnum truncate text-[11.5px] text-ink-3">PT-100482 · F 61 · 12 Mar 1964</p>
        </div>
        <span className="shrink-0 rounded-full bg-status-priority/10 px-2 py-[3px] text-[10.5px] font-semibold text-status-priority">
          Priority
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-3.5">
        <DataPoint label="Exams" value={5} />
        <DataPoint label="First seen" value="2023" />
        <DataPoint label="Last BP" value="138/86" />
      </div>

      <div className="mt-3.5 border-t border-line pt-3.5">
        <p className="text-[10px] font-semibold tracking-[0.07em] text-ink-3 uppercase">
          Latest trace
        </p>
        <ECGSparkline
          className="mt-1.5 h-8 w-full text-ink"
          bpm={96}
          seed={19}
          morphology="stDepression"
        />
      </div>
    </div>
  );
}

/**
 * Historico longitudinal do paciente.
 *
 * O eixo e vertical de proposito: uma linha do tempo cardiologica e lida como
 * uma sequencia de episodios com detalhe, nao como um grafico de tendencia.
 */
export function PatientTimeline({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[12px] border border-line bg-white", className)}>
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h5 className="text-[13px] font-semibold text-ink">Patient timeline</h5>
        <span className="tnum text-[11px] text-ink-3">5 exams · 2023-today</span>
      </div>
      <ol className="flex flex-col p-4 pt-3.5">
        {patientTimeline.map((entry, i) => (
          <li key={entry.date} className="relative flex gap-3.5 pb-4 last:pb-0">
            {i < patientTimeline.length - 1 ? (
              <span aria-hidden className="absolute top-4 bottom-0 left-[5.5px] w-px bg-line" />
            ) : null}
            <span
              className={cn(
                "relative z-10 mt-[5px] size-3 shrink-0 rounded-full border-2 bg-white",
                entry.current ? "border-brand" : "border-line-strong",
              )}
            >
              {entry.current ? (
                <span className="absolute inset-[2px] rounded-full bg-brand" />
              ) : null}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span
                  className={cn(
                    "tnum text-[11px] font-semibold",
                    entry.current ? "text-brand-ink" : "text-ink-3",
                  )}
                >
                  {entry.date}
                </span>
                <span className="text-[12.5px] font-semibold text-ink">{entry.label}</span>
              </div>
              <p className="text-[12px] text-ink-2">{entry.detail}</p>
              {entry.key ? (
                <p className="tnum mt-0.5 inline-block rounded border border-line bg-surface-muted px-1.5 py-0.5 text-[10.5px] text-ink-2">
                  {entry.key}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
