import { Section, SectionHeading } from "@/components/v1/ui/Section";
import { cn } from "@/lib/v1/cn";
import {
  IconDevices,
  IconBuilding,
  IconDatabase,
  IconLayers,
  IconNetwork,
  IconUsers,
} from "@/components/v1/icons";

/**
 * "Built to connect."
 *
 * Anchor no centro, com os pontos de conexao ao redor. Sem logotipos de
 * terceiros: apenas icones e rotulos, porque exibir marcas alheias sugeriria
 * parcerias que este prototipo nao pode afirmar.
 */

const NODES = [
  { label: "Cardioline devices", icon: IconDevices },
  { label: "Hospital systems", icon: IconBuilding },
  { label: "PACS", icon: IconDatabase },
  { label: "EHR / HIS", icon: IconNetwork },
  { label: "External workflows", icon: IconLayers },
  { label: "Clinical teams", icon: IconUsers },
];

export function OpenEcosystem() {
  return (
    <Section className="border-b border-line">
      <SectionHeading
        align="center"
        eyebrow="Open ecosystem"
        title="Built to connect."
        intro="A cardiac workspace only helps if it fits the systems already in place. Anchor is designed as a layer between the devices that acquire and the systems that keep the record."
      />

      <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))] lg:grid-rows-3 lg:gap-4">
        {NODES.slice(0, 3).map(({ label, icon: Icon }) => (
          <NodeCard key={label} label={label} icon={<Icon className="size-[18px]" />} />
        ))}

        {/* Nucleo — ocupa a celula central da grade em lg */}
        <div className="order-first flex flex-col items-center justify-center gap-3 rounded-[16px] border border-brand/35 bg-brand-soft/40 px-6 py-9 sm:col-span-2 lg:order-none lg:col-start-2 lg:row-start-2 lg:col-span-1">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-strong text-white">
            <IconLayers className="size-6" />
          </span>
          <span className="text-[1.125rem] font-semibold tracking-[-0.015em] text-ink">Anchor</span>
          <span className="max-w-[220px] text-center text-[12.5px] leading-snug text-ink-2">
            The digital layer connecting the Cardioline ecosystem
          </span>
        </div>

        {NODES.slice(3).map(({ label, icon: Icon }) => (
          <NodeCard key={label} label={label} icon={<Icon className="size-[18px]" />} />
        ))}
      </div>
    </Section>
  );
}

function NodeCard({
  label,
  icon,
  className,
}: {
  label: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 rounded-[14px] border border-line bg-surface px-5 py-5 shadow-[var(--shadow-subtle)]",
        className,
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-surface-muted text-ink-2">
        {icon}
      </span>
      <span className="text-[14.5px] font-semibold text-ink">{label}</span>
    </div>
  );
}
