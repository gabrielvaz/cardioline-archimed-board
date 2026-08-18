import { Section, SectionHeading } from "@/components/v1/ui/Section";
import { BrowserFrame, Sidebar, AppTopBar } from "@/components/v1/product/AppShell";
import { AnchorDashboard } from "@/components/v1/product/AnchorDashboard";
import { ExamTable } from "@/components/v1/product/ExamTable";
import { ECGViewer } from "@/components/v1/product/ECGViewer";
import { ReportPanel } from "@/components/v1/product/ReportPanel";
import { statusStyles } from "@/lib/v1/data";
import { cn } from "@/lib/v1/cn";

const STATUS_FLOW = ["New", "Ready to review", "In review", "Reported"] as const;

/**
 * Grande secao de interface.
 *
 * Cada mockup e um componente HTML/CSS real, nao uma imagem: os mesmos
 * componentes servirao as telas do produto nas etapas seguintes do prototipo.
 */
export function ProductPreview() {
  return (
    <Section id="product" tone="muted" className="border-b border-line">
      <SectionHeading
        eyebrow="The workspace"
        title="Designed around how a cardiac exam actually moves."
        intro="An exam arrives from a device, waits for a cardiologist, gets read, gets reported. Anchor makes that path visible, and keeps every previous exam for the same patient one click away."
      />

      {/* 1 — Dashboard */}
      <figure className="mt-14">
        <BrowserFrame url="anchor.cardioline.com">
          <AnchorDashboard />
        </BrowserFrame>
        <figcaption className="mt-3.5 text-[13px] text-ink-3">
          Home. Exams waiting for review, completed today, priority exams, connected devices and
          recent patients. All data shown is synthetic.
        </figcaption>
      </figure>

      {/* 2 — Worklist com o ciclo de estados */}
      <div className="mt-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-xl">
            <h3 className="text-[1.5rem] tracking-[-0.02em]">One worklist for every modality</h3>
            <p className="mt-3 text-[15px] text-ink-2">
              Every exam carries its patient, its acquiring device, its timestamp, its state and
              its owner. Filtering by state is how a department knows where the work is.
            </p>
          </div>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-2.5">
            {STATUS_FLOW.map((status, i) => (
              <li key={status} className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold",
                    statusStyles[status].bg,
                    statusStyles[status].text,
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", statusStyles[status].dot)} />
                  {status}
                </span>
                {i < STATUS_FLOW.length - 1 ? (
                  <span aria-hidden className="text-ink-3">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <figure className="mt-8">
          <BrowserFrame url="anchor.cardioline.com/exams">
            <div className="flex">
              <Sidebar active="Exams" className="hidden sm:flex" />
              <div className="min-w-0 flex-1">
                <AppTopBar title="Exams" subtitle="41 exams · 6 shown · 4 devices connected" />
                <div className="p-3">
                  <ExamTable />
                </div>
              </div>
            </div>
          </BrowserFrame>
          <figcaption className="mt-3.5 text-[13px] text-ink-3">
            Exam list. Patient, exam type, acquiring device, acquisition time, state and assignee.
          </figcaption>
        </figure>
      </div>

      {/* 3 — Visualizador de ECG + laudo */}
      <div className="mt-16">
        <div className="max-w-2xl">
          <h3 className="text-[1.5rem] tracking-[-0.02em]">
            A viewer built for reading, not for browsing
          </h3>
          <p className="mt-3 text-[15px] text-ink-2">
            Twelve leads in the standard clinical layout with a rhythm strip, real paper geometry
            at 25&nbsp;mm/s and 10&nbsp;mm/mV, measurements alongside the trace, and the report
            panel in the same screen as the signal.
          </p>
        </div>

        <figure className="mt-8">
          <BrowserFrame url="anchor.cardioline.com/exams/EX-48213">
            <div className="grid lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
              <ECGViewer className="min-w-0 border-b border-line lg:border-r lg:border-b-0" />
              <div className="min-w-0 bg-surface-muted/40 p-3.5">
                <ReportPanel bare className="h-full" />
              </div>
            </div>
          </BrowserFrame>
          <figcaption className="mt-3.5 text-[13px] text-ink-3">
            ECG viewer with structured reporting. Traces are generated for this prototype from a
            synthetic waveform model. They are not recordings from any patient.
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
