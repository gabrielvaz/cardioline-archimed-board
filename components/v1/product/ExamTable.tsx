import { cn } from "@/lib/v1/cn";
import { exams, statusStyles, type Exam } from "@/lib/v1/data";
import { ECGSparkline } from "./ECGWaveform";
import { IconFilter } from "@/components/v1/icons";

function StatusPill({ status }: { status: Exam["status"] }) {
  const s = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] text-[11px] font-semibold whitespace-nowrap",
        s.bg,
        s.text,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {status}
    </span>
  );
}

/**
 * Worklist de exames.
 *
 * Responsividade por CONTAINER QUERY, nao por viewport. A tabela vive dentro
 * de molduras de navegador de larguras diferentes na mesma pagina; um
 * breakpoint de viewport nao sabe quao larga e a moldura e acabaria forcando
 * seis colunas num frame de 600 px, que entao vazam por baixo do painel
 * vizinho. Cada coluna aparece quando o proprio container tem espaco.
 *
 * Larguras de container do Tailwind v4: @2xl = 672 px, @3xl = 768 px,
 * @4xl = 896 px.
 */

const ALL_COLUMNS = ["Patient", "Exam type", "Device", "Acquired", "Status", "Assigned to"] as const;
type Column = (typeof ALL_COLUMNS)[number];

/** Em que largura de container cada coluna passa a aparecer. */
const COLUMN_VISIBILITY: Record<Column, string> = {
  Patient: "",
  "Exam type": "",
  Status: "",
  Acquired: "hidden @3xl:table-cell",
  Device: "hidden @4xl:table-cell",
  "Assigned to": "hidden @4xl:table-cell",
};

export function ExamTable({
  rows = exams,
  className,
  compact = false,
  columns = ALL_COLUMNS,
  showFooter = true,
}: {
  rows?: Exam[];
  className?: string;
  compact?: boolean;
  /** filtro explicito de colunas, aplicado antes das container queries */
  columns?: readonly Column[];
  showFooter?: boolean;
}) {
  const visible = ALL_COLUMNS.filter((c) => columns.includes(c));

  // O limiar tabela/cartoes depende de quantas colunas ha para acomodar. Um
  // conjunto reduzido de tres colunas cabe em ~410 px; as seis colunas
  // completas precisam de ~670 px. Forcar a tabela abaixo disso a fazia
  // transbordar a moldura e escorregar por baixo do painel vizinho.
  const narrow = visible.length <= 3;
  const tableClass = narrow ? "hidden @md:table" : "hidden @2xl:table";
  const cardsClass = narrow ? "flex @md:hidden" : "flex @2xl:hidden";

  return (
    <div className={cn("@container", className)}>
      <table className={cn("w-full border-collapse text-left", tableClass)}>
        <thead>
          <tr className="border-b border-line">
            {visible.map((c) => (
              <th
                key={c}
                scope="col"
                className={cn(
                  "px-2.5 py-2 text-[10px] font-semibold tracking-[0.07em] text-ink-3 uppercase first:pl-4",
                  COLUMN_VISIBILITY[c],
                )}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((exam) => (
            <tr key={exam.id} className="border-b border-line/70 last:border-0">
              {visible.includes("Patient") ? (
                <td className={cn("px-2.5 py-2.5 pl-4", COLUMN_VISIBILITY.Patient)}>
                  <span className="flex items-center gap-2.5">
                    {exam.priority ? (
                      <span
                        className="h-7 w-[2.5px] shrink-0 rounded-full bg-status-priority"
                        title="Priority exam"
                      />
                    ) : (
                      <span className="h-7 w-[2.5px] shrink-0" aria-hidden />
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-[12.5px] font-semibold text-ink">
                        {exam.patient}
                      </span>
                      <span className="tnum block truncate text-[11px] text-ink-3">
                        {exam.patientId} · {exam.sex} {exam.age}
                      </span>
                    </span>
                  </span>
                </td>
              ) : null}

              {visible.includes("Exam type") ? (
                <td className={cn("px-2.5 py-2.5", COLUMN_VISIBILITY["Exam type"])}>
                  <span className="flex items-center gap-2">
                    <ECGSparkline
                      className="h-4 w-9 shrink-0 text-ink-3"
                      bpm={exam.bpm}
                      seed={Number(exam.id.slice(-3))}
                      morphology={exam.morphology}
                    />
                    <span className="text-[12.5px] whitespace-nowrap text-ink">{exam.type}</span>
                  </span>
                </td>
              ) : null}

              {visible.includes("Device") ? (
                <td
                  className={cn(
                    "px-2.5 py-2.5 text-[12px] whitespace-nowrap text-ink-2",
                    COLUMN_VISIBILITY.Device,
                  )}
                >
                  {exam.device}
                </td>
              ) : null}

              {visible.includes("Acquired") ? (
                <td
                  className={cn(
                    "tnum px-2.5 py-2.5 text-[12px] whitespace-nowrap text-ink-2",
                    COLUMN_VISIBILITY.Acquired,
                  )}
                >
                  {exam.acquired}
                </td>
              ) : null}

              {visible.includes("Status") ? (
                <td className={cn("px-2.5 py-2.5", COLUMN_VISIBILITY.Status)}>
                  <StatusPill status={exam.status} />
                </td>
              ) : null}

              {visible.includes("Assigned to") ? (
                <td
                  className={cn(
                    "px-2.5 py-2.5 text-[12px] whitespace-nowrap text-ink-2",
                    COLUMN_VISIBILITY["Assigned to"],
                  )}
                >
                  {exam.assignedTo ?? <span className="text-ink-3">Unassigned</span>}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cartoes — quando o container e estreito demais para uma tabela clinica */}
      <ul className={cn("flex-col gap-2", cardsClass)}>
        {rows.map((exam) => (
          <li
            key={exam.id}
            className={cn(
              "rounded-[10px] border border-line bg-white p-3",
              exam.priority && "border-l-[3px] border-l-status-priority",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{exam.patient}</p>
                <p className="tnum truncate text-[11px] text-ink-3">
                  {exam.patientId} · {exam.sex} {exam.age}
                </p>
              </div>
              <StatusPill status={exam.status} />
            </div>
            <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-line pt-2.5">
              {(
                [
                  ["Exam type", exam.type],
                  ["Device", exam.device],
                  ["Acquired", exam.acquired],
                  ["Assigned to", exam.assignedTo ?? "Unassigned"],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[9.5px] font-semibold tracking-[0.07em] text-ink-3 uppercase">
                    {k}
                  </dt>
                  <dd className="truncate text-[12px] text-ink-2">{v}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {showFooter && !compact ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 px-1">
          <span className="flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-[11px] text-ink-2">
            <IconFilter className="size-3" /> All modalities
          </span>
          <span className="tnum text-[11px] text-ink-3">Showing {rows.length} of 41 exams</span>
        </div>
      ) : null}
    </div>
  );
}
