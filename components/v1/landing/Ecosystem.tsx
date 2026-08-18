import { Container } from "@/components/v1/ui/Container";
import { cn } from "@/lib/v1/cn";
import { IconDevices, IconLayers, IconPatients, IconStethoscope } from "@/components/v1/icons";

/**
 * Prova de ecossistema.
 *
 * Os numeros vem de fontes publicas da propria Cardioline (fundacao em 1962
 * em Trento; mais de 400 mil dispositivos; mais de 60 paises). Nada aqui foi
 * estimado, e nenhuma certificacao foi inventada.
 */
const FACTS = [
  { value: "1962", label: "Founded in Trento, Italy" },
  { value: "60+", label: "Years in diagnostic cardiology" },
  { value: "400,000+", label: "Devices in clinical use" },
  { value: "60+", label: "Countries served" },
];

const CHAIN = [
  { icon: IconDevices, label: "Device", detail: "ECG · Holter · ABPM · Stress" },
  { icon: IconLayers, label: "Anchor", detail: "The digital layer", accent: true },
  { icon: IconStethoscope, label: "Cardiologist", detail: "Review and report" },
  { icon: IconPatients, label: "Patient", detail: "Continuity of care" },
];

export function Ecosystem() {
  return (
    <section className="border-b border-line bg-surface-muted py-14 sm:py-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
          <div>
            <h2 className="text-[1.5rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.875rem]">
              Built on more than 60 years of diagnostic cardiology experience.
            </h2>
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-7">
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt className="tnum text-[1.625rem] leading-none font-semibold tracking-[-0.02em] whitespace-nowrap text-ink sm:text-[1.75rem]">
                    {f.value}
                  </dt>
                  <dd className="mt-1.5 text-[12.5px] leading-snug text-ink-2">{f.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Cadeia de valor: dispositivo → Anchor → cardiologista → paciente */}
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CHAIN.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.label} className="relative">
                  <div
                    className={cn(
                      "flex h-full flex-col gap-2 rounded-[12px] border bg-white p-4",
                      step.accent
                        ? "border-brand/40 shadow-[0_1px_3px_rgba(246,98,1,0.12)]"
                        : "border-line",
                    )}
                  >
                    <Icon
                      className={cn("size-[18px]", step.accent ? "text-brand" : "text-ink-3")}
                    />
                    <span
                      className={cn(
                        "text-[13.5px] font-semibold",
                        step.accent ? "text-brand-ink" : "text-ink",
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="text-[11px] leading-snug text-ink-3">{step.detail}</span>
                  </div>
                  {/* Conector entre etapas, apenas quando estao na mesma linha */}
                  {i < CHAIN.length - 1 ? (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-1/2 -right-3 hidden h-px w-3 bg-line-strong sm:block",
                      )}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
