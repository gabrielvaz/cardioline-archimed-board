import { cn } from "@/lib/v1/cn";
import { IconCheck, IconDownload, IconPrint, IconTemplate } from "@/components/v1/icons";

/**
 * Painel de laudo estruturado.
 *
 * As frases sugeridas sao apresentadas como sugestoes que o cardiologista
 * aceita, edita ou descarta — nunca como conclusao gerada automaticamente.
 */
export function ReportPanel({
  className,
  showSuggestions = true,
  bare = false,
}: {
  className?: string;
  showSuggestions?: boolean;
  /** remove moldura e cantos — para uso dentro de outro painel */
  bare?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col bg-white",
        bare ? "rounded-[10px]" : "rounded-[12px] border border-line",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h5 className="text-[13px] font-semibold text-ink">Report</h5>
        <span className="flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-[10.5px] font-medium text-ink-2">
          <IconTemplate className="size-3" />
          Lateral ischaemia follow-up
        </span>
      </div>

      <div className="flex flex-col gap-3.5 p-4">
        <Field label="Rhythm" value="Sinus rhythm" />
        <Field label="Conduction" value="Normal AV and intraventricular conduction" />
        <Field
          label="Findings"
          value="ST-segment depression in the lateral leads, more pronounced than on the previous recording. QTc prolonged relative to June 2024."
          multiline
        />
        <Field label="Conclusion" value="" placeholder="Awaiting cardiologist" empty />

        {showSuggestions ? (
          <div className="rounded-[10px] border border-line bg-surface-muted/70 p-3">
            <p className="text-[10px] font-semibold tracking-[0.07em] text-ink-3 uppercase">
              Suggested phrases · from your own templates
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {[
                "Compare with previous exam",
                "Recommend clinical correlation",
                "Consider stress testing",
                "Repeat in 3 months",
              ].map((phrase) => (
                <li
                  key={phrase}
                  className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] text-ink-2"
                >
                  + {phrase}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-brand-strong px-3.5 text-[12px] font-semibold text-white">
          <IconCheck className="size-3.5" strokeWidth={2.2} /> Sign report
        </span>
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-[12px] font-medium text-ink-2">
          <IconPrint className="size-3.5" /> Print
        </span>
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-[12px] font-medium text-ink-2">
          <IconDownload className="size-3.5" /> PDF
        </span>
        <span className="tnum ml-auto text-[10.5px] text-ink-3">Draft saved 09:26</span>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  multiline,
  empty,
}: {
  label: string;
  value: string;
  placeholder?: string;
  multiline?: boolean;
  empty?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.07em] text-ink-3 uppercase">{label}</p>
      <p
        className={cn(
          "mt-1 rounded-md border px-2.5 py-1.5 text-[12.5px]",
          empty
            ? "border-dashed border-line-strong text-ink-3 italic"
            : "border-line bg-white text-ink-2",
          multiline && "leading-relaxed",
        )}
      >
        {empty ? placeholder : value}
      </p>
    </div>
  );
}
