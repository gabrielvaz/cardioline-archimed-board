import { cn } from "@/lib/v1/cn";
import { dashboardStats, devices, exams } from "@/lib/v1/data";
import { AppTopBar, Sidebar } from "./AppShell";
import { ExamTable } from "./ExamTable";
import { ECGSparkline } from "./ECGWaveform";
import { IconPulse } from "@/components/v1/icons";

const stateTone: Record<string, string> = {
  Online: "bg-status-reported",
  Syncing: "bg-brand",
  Idle: "bg-line-strong",
};

function StatCard({
  label,
  value,
  delta,
  accent,
  priority,
}: {
  label: string;
  value: number;
  delta?: string;
  accent?: boolean;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[10px] border bg-white p-3",
        accent ? "border-brand/35 bg-brand-soft/30" : "border-line",
      )}
    >
      <p className="text-[10px] font-semibold tracking-[0.07em] text-ink-3 uppercase">{label}</p>
      <p
        className={cn(
          "tnum mt-1 text-[26px] leading-none font-semibold tracking-[-0.02em]",
          priority ? "text-status-priority" : accent ? "text-brand-ink" : "text-ink",
        )}
      >
        {value}
      </p>
      {delta ? <p className="mt-1 text-[10.5px] text-ink-3">{delta}</p> : null}
    </div>
  );
}

/** Painel inicial do Anchor: o que espera revisao, o que fechou, o que conectou. */
export function AnchorDashboard({ className }: { className?: string }) {
  return (
    <div className={cn("@container flex bg-white", className)}>
      <Sidebar active="Home" className="hidden @3xl:flex" />
      <div className="min-w-0 flex-1">
        <AppTopBar title="Good morning, Dr. Ferrari" subtitle="Monday, 14 September · Cardiology" />

        <div className="flex flex-col gap-4 p-4">
          <div className="@container grid grid-cols-2 gap-2.5 @xl:gap-3 @3xl:grid-cols-4">
            {dashboardStats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid gap-4 @4xl:grid-cols-[minmax(0,1fr)_248px]">
            <div className="min-w-0 rounded-[10px] border border-line">
              <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
                <h5 className="text-[12.5px] font-semibold text-ink">Exams waiting for review</h5>
                <span className="text-[11px] font-medium text-brand-ink">View all</span>
              </div>
              <div className="p-1.5 sm:p-2">
                <ExamTable
                  rows={exams.slice(0, 4)}
                  compact
                  columns={["Patient", "Exam type", "Status"]}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-[10px] border border-line">
                <div className="border-b border-line px-3.5 py-2.5">
                  <h5 className="text-[12.5px] font-semibold text-ink">Devices connected</h5>
                </div>
                <ul className="flex flex-col divide-y divide-line">
                  {devices.map((d) => (
                    <li key={d.name} className="flex items-center gap-2.5 px-3.5 py-2">
                      <span className={cn("size-1.5 shrink-0 rounded-full", stateTone[d.state])} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] font-medium text-ink">
                          {d.name}
                        </span>
                        <span className="block truncate text-[10.5px] text-ink-3">
                          {d.modality} · {d.location}
                        </span>
                      </span>
                      <span className="tnum shrink-0 text-[10px] text-ink-3">{d.lastSync}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[10px] border border-line">
                <div className="border-b border-line px-3.5 py-2.5">
                  <h5 className="text-[12.5px] font-semibold text-ink">Recent patients</h5>
                </div>
                <ul className="flex flex-col divide-y divide-line">
                  {exams.slice(0, 3).map((e) => (
                    <li key={e.id} className="flex items-center gap-2.5 px-3.5 py-2">
                      <IconPulse className="size-3.5 shrink-0 text-ink-3" />
                      <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-ink">
                        {e.patient}
                      </span>
                      <ECGSparkline
                        className="h-4 w-8 shrink-0 text-ink-3"
                        bpm={e.bpm}
                        seed={e.age}
                        morphology={e.morphology}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
