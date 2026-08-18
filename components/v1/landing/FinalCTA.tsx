import { Container } from "@/components/v1/ui/Container";
import { Button } from "@/components/v1/ui/Button";
import { Eyebrow } from "@/components/v1/ui/Section";
import { ECGWaveform } from "@/components/v1/product/ECGWaveform";
import { IconArrowRight } from "@/components/v1/icons";

export function FinalCTA() {
  return (
    <section id="final-cta" className="relative overflow-hidden bg-navy py-20 sm:py-24 lg:py-28">
      {/*
        Unico uso decorativo de ECG na pagina, e de proposito: uma tira baixa,
        recortada e quase invisivel no rodape da secao. Nao a linha de batimento
        gigante atravessando a landing.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-[0.13] mix-blend-screen"
      >
        <div className="h-full w-full [&_path]:!stroke-white [&_rect]:!fill-transparent">
          <ECGWaveform
            lead="II"
            bpm={62}
            seconds={26}
            seed={77}
            plotHeightMm={26}
            gridOpacity={0}
            traceWidth={0.22}
          />
        </div>
      </div>

      <Container className="relative">
        <div className="flex max-w-3xl flex-col items-start gap-6">
          <Eyebrow className="text-brand">Anchor by Cardioline</Eyebrow>
          <h2 className="text-[2rem] leading-[1.08] tracking-[-0.025em] text-white sm:text-[2.5rem] lg:text-[3rem]">
            Your cardiac workflow starts with the device you already trust.
          </h2>
          <p className="text-lg text-white/70">
            Connect your Cardioline device and bring exams, patients and reporting into one digital
            workspace.
          </p>
          <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center">
            <Button href="#pricing" variant="onNavySolid" size="lg" className="w-full sm:w-auto">
              Get started
              <IconArrowRight className="size-[18px]" />
            </Button>
            <Button href="#for-hospitals" variant="onNavy" size="lg" className="w-full sm:w-auto">
              Talk to Cardioline
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
