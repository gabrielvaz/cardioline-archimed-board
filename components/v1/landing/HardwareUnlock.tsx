import Image from "next/image";
import { Container } from "@/components/v1/ui/Container";
import { Button } from "@/components/v1/ui/Button";
import { Eyebrow } from "@/components/v1/ui/Section";
import { cn } from "@/lib/v1/cn";
import {
  IconArrowDown,
  IconCheck,
  IconCloud,
  IconConnect,
  IconDatabase,
  IconGlobe,
  IconKey,
} from "@/components/v1/icons";
import { asset } from "@/lib/asset";

/**
 * "Your Cardioline device unlocks Anchor."
 *
 * Secao central da tese comercial, por isso recebe tratamento visual
 * distinto do resto da pagina: fundo em tom quente da marca e um diagrama
 * vertical de desbloqueio em lugar de mais uma grade de cartoes.
 */

const STEPS = [
  {
    key: "device",
    label: "Cardioline device",
    detail: "A compatible electrocardiograph, Holter recorder or ABPM monitor",
    image: "/devices/ecg200l-cover-02.png",
    imageAlt: "Cardioline ECG200L electrocardiograph",
  },
  {
    key: "connect",
    label: "Connect",
    detail:
      "Register the device once. No local installation, no software licence to buy.",
    icon: IconConnect,
  },
  {
    key: "anchor",
    label: "Anchor Free",
    detail:
      "The essential cardiac workspace, active at no additional monthly cost",
    icon: IconCloud,
    accent: true,
  },
  {
    key: "work",
    label: "Exams · Patients · Reports",
    detail: "Your clinical work, in the browser, from the first exam onwards",
    icon: IconDatabase,
  },
];

const BENEFITS = [
  { icon: IconKey, text: "No software licence to purchase" },
  { icon: IconCloud, text: "No local installation" },
  { icon: IconGlobe, text: "Access from your browser" },
  { icon: IconDatabase, text: "Your clinical data, always available" },
];

export function HardwareUnlock() {
  return (
    <section
      id="hardware"
      className="relative overflow-hidden border-b border-line bg-brand-soft/45 py-20 sm:py-24 lg:py-28"
    >
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start lg:gap-20">
          <div className="flex flex-col items-start gap-6">
            <Eyebrow>Hardware unlocks software</Eyebrow>
            <h2 className="text-[2rem] leading-[1.08] tracking-[-0.025em] sm:text-[2.5rem] lg:text-[2.875rem]">
              Your Cardioline device unlocks Anchor.
            </h2>
            <p className="max-w-xl text-lg text-ink-2">
              Compatible Cardioline devices include access to the essential
              Anchor experience at no additional monthly cost. The software your
              device needs is part of the device, not a second purchase.
            </p>

            <ul className="mt-2 grid w-full gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {BENEFITS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-px flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="text-[14.5px] leading-snug text-ink">
                    {text}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#pricing" size="lg">
                Check compatible devices
              </Button>
              <p className="text-[13px] text-ink-3">
                Compatibility varies by model and firmware.
              </p>
            </div>
          </div>

          {/* Diagrama de desbloqueio */}
          <ol className="flex flex-col">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.key} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex w-full items-center gap-4 rounded-[12px] border bg-white px-4 py-3.5",
                      step.accent
                        ? "border-brand shadow-[0_2px_8px_rgba(246,98,1,0.14)]"
                        : "border-line",
                    )}
                  >
                    {step.image ? (
                      <span className="relative size-14 shrink-0 rounded-[10px] bg-surface-muted">
                        <Image
                          src={asset(step.image)}
                          alt={step.imageAlt ?? ""}
                          fill
                          sizes="56px"
                          className="object-contain"
                        />
                      </span>
                    ) : Icon ? (
                      <span
                        className={cn(
                          "flex size-14 shrink-0 items-center justify-center rounded-[10px]",
                          step.accent
                            ? "bg-brand-strong text-white"
                            : "bg-surface-muted text-ink-2",
                        )}
                      >
                        <Icon className="size-5" />
                      </span>
                    ) : null}
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block text-[14.5px] font-semibold",
                          step.accent ? "text-brand-ink" : "text-ink",
                        )}
                      >
                        {step.label}
                      </span>
                      <span className="block text-[12.5px] leading-snug text-ink-2">
                        {step.detail}
                      </span>
                    </span>
                    {step.accent ? (
                      <span className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-strong text-white">
                        <IconCheck className="size-3.5" strokeWidth={2.5} />
                      </span>
                    ) : null}
                  </div>
                  {i < STEPS.length - 1 ? (
                    <span
                      aria-hidden
                      className="flex h-7 flex-col items-center"
                    >
                      <span className="flex-1 w-px bg-brand/35" />
                      <IconArrowDown className="-mt-1.5 size-3.5 text-brand/50" />
                    </span>
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
