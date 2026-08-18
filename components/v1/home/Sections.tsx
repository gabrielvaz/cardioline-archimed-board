import Image from "next/image";
import { Reveal, Enter } from "@/components/v1/shared/Reveal";
import { ActionLink, DeviceSculpture } from "./Chrome";
import { ECGWaveform } from "@/components/v1/product/ECGWaveform";
import { ECGViewer } from "@/components/v1/product/ECGViewer";
import { BrowserFrame } from "@/components/v1/product/AppShell";
import { AnchorDashboard } from "@/components/v1/product/AnchorDashboard";
import {
  VALUE,
  LADDER,
  UNLOCK_STEPS,
  PRO_CAPABILITIES,
  AI_DISCLAIMER,
  PRICING_PHILOSOPHY,
  ENTERPRISE_CAPABILITIES,
  PROTOTYPE_NOTICE,
  FACTS,
} from "@/lib/v1/copy";
import { PLANS } from "@/lib/v1/plans";
import { cn } from "@/lib/v1/cn";

/** Contêiner único da página. Margem larga, medida de leitura curta. */
function Stage({
  className,
  children,
  wide = false,
}: {
  className?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto px-6",
        wide ? "max-w-[1240px]" : "max-w-[1000px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────  1. A tese  ───────────────────────────── */

export function Thesis() {
  return (
    <section
      id="top"
      /*
       * Desconta a navbar de 3rem da altura mínima, e reserva folga de topo
       * suficiente para o eyebrow não passar por baixo dela: a barra é
       * translúcida com backdrop-blur, então conteúdo alto demais aparece como
       * um fantasma atrás dos links em vez de ficar escondido.
       */
      className="flex min-h-[calc(100dvh-3rem)] flex-col justify-center pt-16 pb-8 sm:pt-20"
    >
      <Stage className="text-center">
        <Enter>
          <p className="text-[1.0625rem] font-medium text-ink-2">Anchor</p>
        </Enter>
        <Enter delay={0.08}>
          <h1 className="mx-auto mt-4 max-w-[16ch] text-[clamp(2.75rem,7.6vw,6.25rem)] leading-[0.96] font-semibold tracking-[-0.042em]">
            {VALUE.thesis}
          </h1>
        </Enter>
        <Enter delay={0.16}>
          <p className="mx-auto mt-7 max-w-[46ch] text-[clamp(1.125rem,2vw,1.5rem)] leading-[1.4] font-normal text-ink-2">
            {VALUE.supporting}
          </p>
        </Enter>
        <Enter delay={0.24}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
            <ActionLink href="#pricing">Get Anchor</ActionLink>
            <ActionLink href="#platform">See how it works</ActionLink>
          </div>
        </Enter>
      </Stage>

      <Enter delay={0.32} className="mt-14 sm:mt-20">
        <Stage wide>
          <DeviceSculpture
            src="/devices/ecg200l-cover-02.png"
            alt="Cardioline ECG200L electrocardiograph"
            priority
          />
        </Stage>
      </Enter>
    </section>
  );
}

/* ───────────────────────  2. O desbloqueio  ─────────────────────── */

/**
 * O desbloqueio.
 *
 * Três afirmações separadas por vazio, sem cards e sem numeração de etapa: o
 * conteúdo de cada passo é o rótulo do passo.
 *
 * A seção fecha com a escada, não com uma declaração de gratuidade. A diferença
 * não é de tom, é de posicionamento: anunciar "o software já é seu" encerra a
 * decisão do leitor no primeiro degrau, enquanto mostrar os três mantém o
 * dispositivo no papel de porta de entrada de uma relação que continua.
 */
export function Unlock() {
  return (
    <section id="platform" className="py-28 sm:py-36">
      <Stage>
        <Reveal>
          <h2 className="max-w-[24ch] text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
            {VALUE.unlock}
          </h2>
        </Reveal>

        <div className="mt-20 flex flex-col gap-20 sm:mt-24 sm:gap-24">
          {UNLOCK_STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] sm:gap-14">
                <h3 className="text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.15] font-semibold tracking-[-0.025em]">
                  {step.title}
                </h3>
                <p className="max-w-[42ch] text-[1.0625rem] leading-[1.6] text-ink-2">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* A escada: onde a relação começa, e para onde ela pode ir. */}
        <div className="mt-28 flex flex-col gap-12 sm:mt-32 sm:gap-14">
          {LADDER.map((rung, i) => (
            <Reveal key={rung.plan} delay={i * 0.06}>
              <div className="grid gap-x-14 gap-y-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
                <div>
                  <span
                    aria-hidden
                    className={cn(
                      "mb-5 block h-[2px] w-10",
                      i === 0
                        ? "bg-line-strong"
                        : i === 1
                          ? "bg-brand"
                          : "bg-ink",
                    )}
                  />
                  <p className="text-[13px] font-medium text-ink-2">
                    {rung.when}
                  </p>
                  <p className="mt-1 text-[clamp(1.25rem,2.2vw,1.625rem)] leading-[1.15] font-semibold tracking-[-0.022em]">
                    {rung.plan}
                  </p>
                </div>
                <p className="max-w-[44ch] text-[1.0625rem] leading-[1.6] text-ink-2 sm:self-end">
                  {rung.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <div className="mt-16">
            <ActionLink href="#pricing">Compare the plans</ActionLink>
          </div>
        </Reveal>
      </Stage>
    </section>
  );
}

/* ─────────────────────────  3. O produto  ───────────────────────── */

export function Workspace() {
  return (
    <section className="py-28 sm:py-36">
      <Stage className="text-center">
        <Reveal>
          <h2 className="mx-auto max-w-[22ch] text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
            Every exam, every patient, one place.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-6 max-w-[44ch] text-[1.0625rem] leading-[1.6] text-ink-2">
            Resting ECG, Holter, ambulatory pressure and exercise testing arrive
            in the same worklist, from any Cardioline device.
          </p>
        </Reveal>
      </Stage>

      <Reveal delay={0.12} className="mt-16">
        <Stage wide>
          <BrowserFrame url="anchor.cardioline.com">
            <AnchorDashboard />
          </BrowserFrame>
        </Stage>
      </Reveal>

      <Stage className="mt-32 sm:mt-40">
        <div className="grid items-center gap-14 sm:grid-cols-2 sm:gap-16">
          <Reveal>
            <h3 className="max-w-[18ch] text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.05] font-semibold tracking-[-0.032em]">
              Built for reading, not for browsing.
            </h3>
            <p className="mt-6 max-w-[40ch] text-[1.0625rem] leading-[1.6] text-ink-2">
              Twelve leads on real paper geometry, at 25 mm per second and 10 mm
              per millivolt. Measurements beside the trace. The report in the
              same screen as the signal.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-[10px]">
              <ECGWaveform
                lead="II"
                bpm={96}
                seconds={9}
                seed={11}
                morphology="stDepression"
                plotHeightMm={30}
                showCalibration
                gridOpacity={0.5}
                traceWidth={0.28}
                className="h-[168px]"
              />
            </div>
          </Reveal>
        </div>
      </Stage>

      <Reveal delay={0.06} className="mt-16">
        <Stage wide>
          <BrowserFrame url="anchor.cardioline.com/exams/EX-48213">
            <ECGViewer showAssist={false} />
          </BrowserFrame>
        </Stage>
      </Reveal>
    </section>
  );
}

/* ─────────────────────  4. A escala Cardioline  ───────────────────── */

/**
 * Números grandes em vez de cards de prova social. Quatro fatos verificados em
 * fonte oficial da Cardioline, sem moldura em volta de nenhum.
 */
export function Scale() {
  return (
    <section className="py-24 sm:py-32">
      <Stage>
        <div className="grid gap-14 sm:grid-cols-2 sm:gap-x-16">
          {FACTS.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.05}>
              <p className="tnum text-[clamp(2.5rem,5vw,3.75rem)] leading-none font-semibold tracking-[-0.04em]">
                {f.value}
              </p>
              <p className="mt-3 max-w-[20ch] text-[14px] leading-snug text-ink-2">
                {f.label}
              </p>
            </Reveal>
          ))}
        </div>
      </Stage>
    </section>
  );
}

/* ────────────────────────  5. Anchor Pro  ──────────────────────── */

export function Professional() {
  return (
    <section id="cardiologists" className="py-28 sm:py-36">
      <Stage>
        <Reveal>
          <h2 className="max-w-[20ch] text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
            For the cardiologist behind the report.
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-ink-2">
            The base workspace organises the work. Anchor Pro is about the
            minutes spent reading and writing, and about what the previous exam
            already told you.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-x-16 gap-y-16 sm:grid-cols-2">
          {PRO_CAPABILITIES.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <h3 className="text-[1.375rem] leading-[1.2] font-semibold tracking-[-0.022em]">
                {c.title}
              </h3>
              <p className="mt-3 max-w-[38ch] text-[15px] leading-[1.6] text-ink-2">
                {c.body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <p className="mt-20 max-w-[62ch] text-[14px] leading-[1.7] text-ink-3">
            {AI_DISCLAIMER}
          </p>
        </Reveal>
      </Stage>
    </section>
  );
}

/* ──────────────────  6. Instituições (bloco escuro)  ────────────────── */

/**
 * Único salto de tema da página, e intencional: um bloco de cor que separa o
 * capítulo profissional do institucional. O fundo é o navy real da marca
 * (--awb-color6 do site oficial), não um preto genérico.
 */
export function Institutional() {
  return (
    <section id="hospitals" className="bg-navy py-28 text-white sm:py-36">
      <Stage>
        <Reveal>
          <h2 className="max-w-[22ch] text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-white">
            From one cardiologist to an entire hospital network.
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-6 max-w-[54ch] text-[1.0625rem] leading-[1.6] text-white/70">
            The same workspace, governed. Enterprise value is in scale,
            integration, deployment and accountability, not in charging again
            for the exam management a Cardioline device already includes.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-x-16 gap-y-12 sm:grid-cols-2 lg:gap-y-14">
          {ENTERPRISE_CAPABILITIES.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.04}>
              <h3 className="text-[1.1875rem] leading-[1.2] font-semibold tracking-[-0.018em] text-white">
                {c.title}
              </h3>
              <p className="mt-2.5 max-w-[38ch] text-[15px] leading-[1.6] text-white/65">
                {c.body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <a
            href="#close"
            className="mt-16 inline-flex items-center gap-1.5 text-[1.0625rem] font-normal text-brand transition-opacity hover:opacity-70"
          >
            Talk to Cardioline
            <span aria-hidden>&rsaquo;</span>
          </a>
        </Reveal>
      </Stage>
    </section>
  );
}

/* ───────────────────────────  7. Preço  ─────────────────────────── */

/**
 * Três colunas de tipografia pura. Nenhum card, nenhuma borda em volta de
 * nenhum plano: a hierarquia vem do peso e do vazio, e o plano recomendado é
 * marcado por uma única linha laranja acima do nome.
 */
export function Price() {
  return (
    <section id="pricing" className="py-28 sm:py-36">
      <Stage>
        <Reveal>
          <h2 className="max-w-[22ch] text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
            Start with your device. Grow with your needs.
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-14 lg:grid-cols-3 lg:gap-10">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.06}>
              <div className="flex h-full flex-col">
                <span
                  aria-hidden
                  className={cn(
                    "mb-6 block h-[2px] w-10",
                    plan.featured ? "bg-brand" : "bg-line-strong",
                  )}
                />
                <h3 className="text-[1.5rem] leading-none font-semibold tracking-[-0.025em]">
                  Anchor {plan.name}
                </h3>
                <p className="mt-3 max-w-[30ch] text-[13.5px] leading-snug text-ink-2">
                  {plan.audience}
                </p>

                <p className="mt-8 flex min-h-[52px] items-baseline gap-2">
                  <span
                    className={cn(
                      "tnum leading-none font-semibold tracking-[-0.04em]",
                      plan.price === "Custom"
                        ? "text-[2.25rem]"
                        : "text-[3.25rem]",
                      plan.featured ? "text-brand-ink" : "text-ink",
                    )}
                  >
                    {plan.price}
                  </span>
                  {plan.unit ? (
                    <span className="text-[13.5px] font-medium text-ink-3">
                      {plan.unit}
                    </span>
                  ) : null}
                </p>

                <a
                  href="#close"
                  className="mt-7 inline-flex w-fit items-center gap-1.5 text-[15px] font-medium text-brand-ink transition-opacity hover:opacity-70"
                >
                  {plan.cta}
                  <span aria-hidden>&rsaquo;</span>
                </a>

                <p className="mt-10 text-[12.5px] font-semibold tracking-[0.01em] text-ink">
                  {plan.inherits ?? "Included with your device"}
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {plan.items.map((item) => (
                    <li
                      key={item}
                      className="text-[14.5px] leading-snug text-ink-2"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                {plan.footnote ? (
                  <p className="mt-auto pt-8 text-[11.5px] leading-snug text-ink-3">
                    {plan.footnote}
                  </p>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-28 max-w-[46ch]">
            <p className="text-[clamp(1.5rem,3.2vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.03em]">
              {PRICING_PHILOSOPHY.headline}
            </p>
            <p className="mt-6 text-[1.0625rem] leading-[1.6] text-ink-2">
              {PRICING_PHILOSOPHY.body}
            </p>
          </div>
        </Reveal>
      </Stage>
    </section>
  );
}

/* ────────────────────────  8. Fechamento  ──────────────────────── */

export function Close() {
  return (
    <section id="close" className="pt-28 pb-24 sm:pt-36 sm:pb-32">
      <Stage className="text-center">
        <Reveal>
          <h2 className="mx-auto max-w-[18ch] text-[clamp(2.25rem,5.4vw,4.25rem)] leading-[1.0] font-semibold tracking-[-0.038em]">
            Connect the device you already trust.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
            <ActionLink href="#pricing">Get Anchor</ActionLink>
            <ActionLink href="#hospitals">Talk to Cardioline</ActionLink>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mx-auto mt-20 max-w-[880px]">
            <Image
              src="/devices/walk200b-cover.png"
              alt="Cardioline walk200b ambulatory blood pressure monitor"
              width={1200}
              height={900}
              className="h-auto w-full"
            />
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mx-auto mt-16 max-w-[62ch] text-[11.5px] leading-relaxed text-ink-3">
            {PROTOTYPE_NOTICE}
          </p>
        </Reveal>
      </Stage>
    </section>
  );
}
