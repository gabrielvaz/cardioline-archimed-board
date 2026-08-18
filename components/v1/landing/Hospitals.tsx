import { Container } from "@/components/v1/ui/Container";
import { Button } from "@/components/v1/ui/Button";
import { Eyebrow } from "@/components/v1/ui/Section";
import { FeatureCard } from "@/components/v1/ui/Feature";
import { cn } from "@/lib/v1/cn";
import {
  IconAudit,
  IconBuilding,
  IconDevices,
  IconTemplate,
  IconKey,
  IconLayers,
  IconMapPin,
  IconNetwork,
  IconStethoscope,
} from "@/components/v1/icons";

/**
 * Secao institucional.
 *
 * Superficie escura em --navy (#071046), que e a cor de marca real usada nos
 * titulos do cardioline.com — nao um azul-escuro generico de template.
 *
 * Fronteira comercial: o valor Enterprise esta em escala, integracao,
 * implantacao, governanca e servicos. Nada que o ECGWebApp ja entrega hoje
 * aparece aqui como recurso bloqueado.
 */

const CARDS = [
  {
    icon: IconBuilding,
    title: "Connect the organization",
    body: "Departments, sites and satellite clinics under one administrative structure, each with its own worklist.",
  },
  {
    icon: IconTemplate,
    title: "Standardize workflows",
    body: "Reporting paths, templates and escalation rules defined centrally and applied consistently across locations.",
  },
  {
    icon: IconNetwork,
    title: "Integrate existing systems",
    body: "HIS, PACS and EHR interoperability through HL7, FHIR, DICOM and APIs, aligned to the estate you already run.",
  },
  {
    icon: IconKey,
    title: "Govern access",
    body: "SSO, organizational permission models, and an audit trail of who opened, edited and signed what.",
  },
  {
    icon: IconMapPin,
    title: "Scale across locations",
    body: "Large-scale deployment with implementation support, dedicated success contacts and an enterprise SLA.",
  },
];

/** Diagrama institucional: da organizacao ao Anchor e aos sistemas existentes. */
const LAYERS = [
  { label: "Hospital", items: ["Group", "Network"], icon: IconBuilding },
  {
    label: "Departments",
    items: ["Cardiology", "Emergency", "Outpatient"],
    icon: IconLayers,
  },
  {
    label: "Devices",
    items: ["ECG", "Holter", "ABPM", "Stress"],
    icon: IconDevices,
  },
  {
    label: "Physicians",
    items: ["Readers", "Referrers"],
    icon: IconStethoscope,
  },
];

const SYSTEMS = ["HIS", "PACS", "EHR", "HL7 / FHIR", "DICOM", "APIs", "SSO"];

export function Hospitals() {
  return (
    <section
      id="for-hospitals"
      className="relative overflow-hidden bg-navy py-20 text-white sm:py-24 lg:py-28"
    >
      {/* Grid milimetrado invertido, muito discreto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Container className="relative">
        <div className="max-w-3xl">
          <Eyebrow className="text-brand">For hospitals and networks</Eyebrow>
          <h2 className="mt-5 text-[2rem] leading-[1.08] tracking-[-0.025em] text-white sm:text-[2.5rem] lg:text-[2.875rem]">
            From one cardiologist to an entire hospital network.
          </h2>
          <p className="mt-5 text-lg text-white/70">
            The same workspace, governed. Enterprise value is in scale,
            integration, deployment and accountability. Not in charging again
            for the exam management a Cardioline device already includes.
          </p>
        </div>

        {/* Diagrama */}
        <div className="mt-14 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.72fr)] lg:items-center lg:gap-6">
          <div className="flex flex-col gap-2.5">
            {LAYERS.map((layer) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.label}
                  className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[12px] border border-white/12 bg-white/[0.04] px-4 py-3"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="size-4 shrink-0 text-white/55" />
                    <span className="w-[92px] shrink-0 text-[13px] font-semibold text-white">
                      {layer.label}
                    </span>
                  </span>
                  <span className="flex flex-wrap gap-1.5">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/14 px-2.5 py-[3px] text-[11px] text-white/70"
                      >
                        {item}
                      </span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Nucleo Anchor */}
          <div className="flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-8 bg-white/25" />
            <div className="flex flex-col items-center gap-1.5 rounded-[14px] border border-brand/50 bg-brand/12 px-5 py-4 text-center">
              <span className="text-[13px] font-semibold text-brand">
                Anchor
              </span>
              <span className="text-[10.5px] leading-tight text-white/60">
                Enterprise
                <br />
                governance
              </span>
            </div>
            <span aria-hidden className="h-px w-8 bg-white/25" />
          </div>

          <div className="rounded-[12px] border border-white/12 bg-white/[0.04] p-4">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-white/50 uppercase">
              Existing systems
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {SYSTEMS.map((s) => (
                <li
                  key={s}
                  className="rounded-md border border-white/14 bg-white/[0.03] px-2.5 py-1.5 text-[11.5px] font-medium text-white/75"
                >
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-3.5 border-t border-white/10 pt-3 text-[11.5px] leading-snug text-white/55">
              Interoperability is scoped per organization during implementation.
            </p>
          </div>
        </div>

        {/* Cartoes de capacidade */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map(({ icon: Icon, title, body }, i) => (
            <FeatureCard
              key={title}
              invert
              icon={<Icon className="size-[18px]" />}
              title={title}
              className={cn(
                i === 3 && "sm:col-span-1",
                i === 4 && "sm:col-span-2 lg:col-span-1",
              )}
            >
              {body}
            </FeatureCard>
          ))}
          <div className="flex flex-col justify-between gap-5 rounded-[14px] border border-brand/45 bg-brand/10 p-6">
            <div>
              <h3 className="text-lg text-white">
                Let&rsquo;s scope it together
              </h3>
              <p className="mt-2 text-[14px] text-white/70">
                Multi-site deployments start with a conversation about the
                estate, the integrations and the governance model.
              </p>
            </div>
            <Button
              href="#final-cta"
              variant="onNavySolid"
              className="self-start"
            >
              Talk to Cardioline
            </Button>
          </div>
        </div>

        <p className="mt-10 flex items-start gap-3 text-[13px] text-white/50">
          <IconAudit className="mt-0.5 size-4 shrink-0" />
          Governance, audit and interoperability capabilities are described here
          as the intended Enterprise scope of this concept, and are configured
          per organization.
        </p>
      </Container>
    </section>
  );
}
