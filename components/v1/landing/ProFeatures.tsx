import { Section, SectionHeading } from "@/components/v1/ui/Section";
import { PatientTimeline } from "@/components/v1/product/PatientCard";
import { ReportPanel } from "@/components/v1/product/ReportPanel";
import { ECGWaveform } from "@/components/v1/product/ECGWaveform";
import { DataPoint } from "@/components/v1/product/AppShell";
import { pricing, PRICING_DISCLAIMER } from "@/lib/v1/pricing";
import { cn } from "@/lib/v1/cn";
import {
  IconAnalytics,
  IconCompare,
  IconScan,
  IconTemplate,
  IconTimeline,
  IconUsers,
} from "@/components/v1/icons";

/**
 * Camada Anchor Pro.
 *
 * Linguagem deliberadamente restrita: "AI-assisted", "decision support",
 * "marked for your attention". Nada aqui promete diagnostico automatico nem
 * sugere substituicao do cardiologista — o Pro acelera quem assina o laudo.
 */

const CAPABILITIES = [
  {
    icon: IconCompare,
    title: "Compare over time",
    detail:
      "Current recording beside the previous one, aligned on the same grid and scale.",
  },
  {
    icon: IconScan,
    title: "AI-assisted review",
    detail:
      "Areas that may warrant a closer look are marked, with the reasoning shown.",
  },
  {
    icon: IconTemplate,
    title: "Smart reporting",
    detail:
      "Structured fields and phrase suggestions drawn from your own templates.",
  },
  {
    icon: IconTimeline,
    title: "Patient timeline",
    detail:
      "Longitudinal cardiac history across every modality, in one sequence.",
  },
  {
    icon: IconAnalytics,
    title: "Productivity insights",
    detail: "Turnaround times and reporting volume for your own practice.",
  },
  {
    icon: IconUsers,
    title: "Second opinion",
    detail:
      "Share a study with a colleague and collect their reading in context.",
  },
];

/** Comparacao lado a lado: exame atual x exame anterior do mesmo paciente. */
function ComparisonPanel() {
  const rows = [
    {
      label: "Jun 2024",
      caption: "Previous · V5",
      morphology: "normal" as const,
      seed: 4,
      bpm: 81,
      values: [
        ["HR", "81 bpm"],
        ["QTc", "415 ms"],
        ["ST", "Isoelectric"],
      ],
      muted: true,
    },
    {
      label: "Today",
      caption: "Current · V5",
      morphology: "stDepression" as const,
      seed: 9,
      bpm: 96,
      values: [
        ["HR", "96 bpm"],
        ["QTc", "431 ms"],
        ["ST", "Depressed"],
      ],
      muted: false,
    },
  ];

  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-white shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 border-b border-line bg-surface-muted/60 px-4 py-2.5">
        <IconCompare className="size-3.5 text-brand" />
        <span className="text-[12px] font-semibold text-ink">
          Longitudinal comparison
        </span>
        <span className="tnum ml-auto text-[10.5px] text-ink-3">
          Emma Rossi · PT-100482
        </span>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="border-b border-line last:border-0">
          <div className="flex items-baseline justify-between gap-3 px-4 pt-3">
            <span
              className={cn(
                "text-[12.5px] font-semibold",
                row.muted ? "text-ink-3" : "text-brand-ink",
              )}
            >
              {row.label}
            </span>
            <span className="tnum text-[10.5px] text-ink-3">{row.caption}</span>
          </div>
          <div
            className={cn(
              "mx-4 mt-2 h-[58px] overflow-hidden rounded border border-line",
              row.muted && "opacity-60",
            )}
          >
            <ECGWaveform
              lead="V5"
              bpm={row.bpm}
              seconds={4}
              seed={row.seed}
              morphology={row.morphology}
              plotHeightMm={22}
              gridOpacity={0.45}
              traceWidth={0.26}
            />
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-2 px-4 py-3">
            {row.values.map(([k, v]) => (
              <DataPoint
                key={k}
                label={k}
                value={v}
                tone={row.muted ? "default" : "brand"}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="border-t border-line bg-surface-muted/50 px-4 py-3">
        <p className="text-[10px] font-semibold tracking-[0.07em] text-ink-3 uppercase">
          Change since previous exam
        </p>
        <ul className="tnum mt-2 flex flex-col gap-1.5">
          {[
            ["Heart rate", "+15 bpm"],
            ["QTc", "+16 ms"],
            ["ST segment", "New depression"],
          ].map(([k, v]) => (
            <li key={k} className="flex items-baseline justify-between gap-3">
              <span className="text-[12px] text-ink-2">{k}</span>
              <span className="text-[12.5px] font-semibold text-brand-ink">
                {v}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProFeatures() {
  return (
    <Section id="for-cardiologists" className="border-b border-line">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <SectionHeading
          eyebrow="Anchor Pro"
          title="Built for the cardiologist behind the report."
          intro="The base workspace organises the work: every exam in one list, every patient with a history. Anchor Pro is about the minutes spent reading and writing, comparing against what came before, and getting to a signed report faster."
        />
        <p className="flex shrink-0 flex-col rounded-[12px] border border-line bg-surface-muted px-5 py-4 lg:text-right">
          <span className="tnum text-[1.75rem] leading-none font-semibold text-ink">
            {pricing.currency}
            {pricing.pro.amount}
            <span className="text-[15px] font-medium text-ink-3">
              {" "}
              / {pricing.pro.period}
            </span>
          </span>
          <span className="mt-1.5 text-[11.5px] text-ink-3">
            {PRICING_DISCLAIMER}
          </span>
        </p>
      </div>

      <div className="mt-14 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ComparisonPanel />
        <PatientTimeline />
        <ReportPanel className="md:col-span-2 lg:col-span-1 shadow-[var(--shadow-card)]" />
      </div>

      <ul className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex gap-3.5">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-soft text-brand">
              <Icon className="size-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold text-ink">
                {title}
              </span>
              <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-2">
                {detail}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-3xl rounded-[12px] border-l-[3px] border-brand bg-surface-muted px-5 py-4 text-[14px] leading-relaxed text-ink-2">
        <span className="font-semibold text-ink">
          A note on the assisted features.
        </span>{" "}
        Anchor Pro is clinical decision support, designed to help cardiologists
        work faster on their own readings. It highlights, compares and drafts.
        It does not diagnose, and every report is signed by the cardiologist who
        read it.
      </p>
    </Section>
  );
}
