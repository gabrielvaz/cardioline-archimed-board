import { Container } from "@/components/v1/ui/Container";
import { Button } from "@/components/v1/ui/Button";
import { Eyebrow } from "@/components/v1/ui/Section";
import {
  BrowserFrame,
  Sidebar,
  AppTopBar,
} from "@/components/v1/product/AppShell";
import { ExamTable } from "@/components/v1/product/ExamTable";
import { ECGWaveform } from "@/components/v1/product/ECGWaveform";
import { DeviceConnection } from "@/components/v1/product/DeviceConnection";
import { exams } from "@/lib/v1/data";
import { IconArrowRight, IconCheck } from "@/components/v1/icons";

const MODALITIES = ["Resting ECG", "Holter", "ABPM", "Stress ECG"];

/**
 * Faixa que mostra as quatro modalidades convergindo para um unico destino.
 * As linhas sao desenhadas em SVG para que a convergencia seja literal, e
 * nao sugerida por um simples alinhamento de rotulos.
 */
function ConvergenceStrip() {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-4 gap-2">
        {MODALITIES.map((m) => (
          <span
            key={m}
            className="truncate rounded-md border border-line bg-white px-1.5 py-1.5 text-center text-[10.5px] font-semibold text-ink-2 shadow-[var(--shadow-subtle)]"
          >
            {m}
          </span>
        ))}
      </div>

      {/*
        Funil de convergencia construido com bordas, nao com SVG: um viewBox
        esticado pela largura do container distorce raios de canto e diagonais,
        enquanto bordas de 1 px permanecem 1 px em qualquer largura.
      */}
      <div aria-hidden className="flex flex-col items-center">
        <div className="grid w-full grid-cols-4">
          {MODALITIES.map((m) => (
            <span key={m} className="flex h-2.5 justify-center">
              <span className="w-px bg-line-strong" />
            </span>
          ))}
        </div>
        <div className="h-px w-[calc(75%+0.5rem)] bg-line-strong" />
        <span className="h-2.5 w-px bg-line-strong" />
        <span className="size-2 rounded-full bg-brand ring-4 ring-white" />
      </div>

      <p className="mt-1.5 text-center text-[10.5px] font-semibold tracking-[0.06em] text-ink-3 uppercase">
        One workspace
      </p>
    </div>
  );
}

export function Hero() {
  return (
    <div id="anchor" className="relative overflow-hidden border-b border-line">
      {/* Campo grafico de fundo: um grid milimetrado muito discreto, o mesmo
          modulo do papel de ECG. Fica em 3% de opacidade — presenca, nao ruido. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--brand-primary) 1px, transparent 1px), linear-gradient(90deg, var(--brand-primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full bg-brand-soft/50 blur-[100px]"
      />

      <Container className="relative">
        <div className="grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12 lg:pt-24 lg:pb-32 xl:gap-16">
          {/* Coluna de texto */}
          <div className="flex flex-col items-start gap-6">
            <Eyebrow>Anchor by Cardioline</Eyebrow>

            <h1 className="text-[2.5rem] leading-[1.05] tracking-[-0.028em] sm:text-[3.25rem] lg:text-[3.75rem]">
              One place for every cardiac exam.
            </h1>

            <p className="max-w-xl text-lg text-ink-2 sm:text-xl">
              Connect your Cardioline devices, manage exams, review patient
              history and report from anywhere, through one secure cardiac
              workspace.
            </p>

            <p className="inline-flex items-center gap-2.5 rounded-full border border-brand/30 bg-brand-soft/60 py-2 pr-4 pl-2.5 text-[0.9375rem] font-semibold text-ink">
              <span className="flex size-5 items-center justify-center rounded-full bg-brand-strong text-white">
                <IconCheck className="size-3.5" strokeWidth={2.5} />
              </span>
              Free with compatible Cardioline devices.
            </p>

            <div className="flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row sm:items-center">
              <Button href="#pricing" size="lg" className="w-full sm:w-auto">
                Get Anchor for free
                <IconArrowRight className="size-[18px]" />
              </Button>
              <Button
                href="#product"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Explore the platform
              </Button>
            </div>

            <p className="text-[13px] text-ink-3">
              Built in Trento, Italy · Serving diagnostic cardiology since 1962
            </p>
          </div>

          {/* Composicao de produto */}
          <div className="relative w-full min-w-0">
            <div className="mb-5">
              <ConvergenceStrip />
            </div>

            <BrowserFrame url="anchor.cardioline.com/exams">
              <div className="flex">
                <Sidebar active="Exams" compact className="hidden md:flex" />
                <div className="min-w-0 flex-1">
                  <AppTopBar
                    title="Exams"
                    subtitle="41 exams · 4 devices connected"
                  />
                  <div className="p-2">
                    <ExamTable
                      rows={exams.slice(0, 4)}
                      compact
                      columns={["Patient", "Exam type", "Status"]}
                    />
                  </div>

                  {/* Pre-visualizacao do exame selecionado */}
                  <div className="border-t border-line bg-surface-muted/40 px-3 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-semibold text-ink">
                          Emma Rossi · Resting ECG
                        </p>
                        <p className="tnum truncate text-[10.5px] text-ink-3">
                          PT-100482 · F 61 · ECG200L, Room 2
                        </p>
                      </div>
                      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-status-ready/10 px-2 py-[3px] text-[10.5px] font-semibold text-status-ready-ink">
                        <span className="size-1.5 rounded-full bg-status-ready" />
                        Ready to review
                      </span>
                    </div>
                    <div className="mt-2 h-[72px] overflow-hidden rounded-md border border-line">
                      <ECGWaveform
                        lead="II"
                        bpm={96}
                        seconds={8}
                        seed={11}
                        morphology="stDepression"
                        plotHeightMm={26}
                        showCalibration
                        gridOpacity={0.5}
                        traceWidth={0.26}
                      />
                    </div>
                    <div className="tnum mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-ink-3">
                      <span>25 mm/s</span>
                      <span>10 mm/mV</span>
                      <span>
                        HR{" "}
                        <span className="font-semibold text-ink">96 bpm</span>
                      </span>
                      <span>
                        QTc{" "}
                        <span className="font-semibold text-ink">431 ms</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </BrowserFrame>

            {/* Cartao de dispositivo: sobreposto no desktop, empilhado no mobile */}
            <div className="mt-4 max-w-[320px] lg:absolute lg:-bottom-9 lg:-left-5 lg:mt-0 lg:w-[268px] xl:-left-8">
              <DeviceConnection compact />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
