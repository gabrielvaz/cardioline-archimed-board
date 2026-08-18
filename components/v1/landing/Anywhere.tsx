import { Section, SectionHeading } from "@/components/v1/ui/Section";
import { BrowserFrame } from "@/components/v1/product/AppShell";
import { ExamTable } from "@/components/v1/product/ExamTable";
import { ECGWaveform } from "@/components/v1/product/ECGWaveform";
import { exams } from "@/lib/v1/data";
import { IconCloud, IconGlobe, IconLaptop, IconLock } from "@/components/v1/icons";

const POINTS = [
  {
    icon: IconCloud,
    title: "No local installation",
    detail: "Nothing to deploy on the workstation.",
  },
  {
    icon: IconGlobe,
    title: "Browser-based",
    detail: "The same workspace on any modern browser.",
  },
  {
    icon: IconLaptop,
    title: "Responsive by design",
    detail: "Worklists and traces adapt to the screen.",
  },
  {
    icon: IconLock,
    title: "Authorised access only",
    detail: "Role-based permissions on every exam.",
  },
];

/**
 * "Review from anywhere."
 *
 * Os tres dispositivos sao molduras reais com conteudo real do produto em
 * larguras diferentes — o que demonstra a responsividade em vez de afirma-la.
 */
export function Anywhere() {
  return (
    <Section className="border-b border-line lg:pb-44">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Anywhere"
            title="Review from anywhere."
            intro="Anchor is browser-based, giving authorized professionals secure access to cardiac exams wherever their workflow takes them."
          />
          <ul className="mt-9 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {POINTS.map(({ icon: Icon, title, detail }) => (
              <li key={title} className="flex flex-col gap-1.5">
                <Icon className="size-[18px] text-brand" />
                <span className="text-[14.5px] font-semibold text-ink">
                  {title}
                </span>
                <span className="text-[13px] leading-snug text-ink-2">
                  {detail}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Composicao de dispositivos */}
        <div className="relative min-w-0">
          {/* Desktop */}
          <div>
            <BrowserFrame url="anchor.cardioline.com/exams" compact>
              <div className="bg-white p-2.5">
                <ExamTable
                  rows={exams.slice(0, 3)}
                  compact
                  columns={["Patient", "Exam type", "Status"]}
                />
                <div className="mt-2 h-14 overflow-hidden rounded border border-line">
                  <ECGWaveform
                    lead="II"
                    bpm={72}
                    seconds={7}
                    seed={31}
                    plotHeightMm={22}
                    gridOpacity={0.45}
                    traceWidth={0.26}
                  />
                </div>
              </div>
            </BrowserFrame>
            <p className="mt-2.5 text-[11px] font-medium text-ink-3">
              Desktop · 1440 px
            </p>
          </div>

          {/* Tablet — empilhado no mobile, sobreposto a partir de lg */}
          <div className="mt-6 w-[248px] lg:absolute lg:-right-4 lg:-bottom-20 lg:mt-0 xl:-right-10">
            <div className="overflow-hidden rounded-[18px] border-[7px] border-navy bg-navy shadow-[var(--shadow-panel)]">
              <div className="flex h-4 items-center justify-center">
                <span className="h-1 w-8 rounded-full bg-white/25" />
              </div>
              <div className="rounded-t-[10px] bg-white">
                <div className="flex items-center justify-between border-b border-line px-3 py-2">
                  <span className="text-[11.5px] font-semibold text-ink">
                    Exams
                  </span>
                  <span className="tnum text-[10px] text-ink-3">41</span>
                </div>
                <div className="p-2">
                  {/* container estreito: a mesma tabela se reorganiza em cartoes */}
                  <ExamTable
                    rows={exams.slice(0, 2)}
                    compact
                    showFooter={false}
                  />
                </div>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] font-medium text-ink-3">
              Tablet · 768 px
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
