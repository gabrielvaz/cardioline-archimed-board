import { Section, SectionHeading } from "@/components/v1/ui/Section";
import { IconAudit, IconKey, IconLock, IconShield, IconUsers, IconGlobe } from "@/components/v1/icons";

/**
 * Secao de seguranca.
 *
 * Deliberadamente sobria e sem selos. Nenhuma certificacao e afirmada porque
 * nenhuma foi verificada para este prototipo — a unica referencia concreta e
 * o GDPR, que a propria documentacao publica do ECGWebApp menciona.
 */
const ITEMS = [
  {
    icon: IconLock,
    title: "Encrypted connections",
    detail: "Clinical data in transit over encrypted channels, end to end.",
  },
  {
    icon: IconKey,
    title: "Secure access",
    detail: "Authenticated sessions, with organizational sign-on where required.",
  },
  {
    icon: IconUsers,
    title: "Permissions",
    detail: "Role-based access, scoped by site, department and exam type.",
  },
  {
    icon: IconAudit,
    title: "Auditability",
    detail: "A record of who viewed, edited and signed each exam and report.",
  },
  {
    icon: IconShield,
    title: "Privacy by design",
    detail: "Patient identifiers separated from signal data, minimised by default.",
  },
  {
    icon: IconGlobe,
    title: "GDPR-aware workflows",
    detail: "Consent, retention and data subject requests treated as first-class.",
  },
];

export function Security() {
  return (
    <Section tone="muted" className="border-b border-line">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:gap-16">
        <SectionHeading
          eyebrow="Security"
          title="Designed for clinical data."
          intro="Cardiac exams are medical records. Anchor is built on that assumption rather than adapted to it afterwards."
        />
        <ul className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {ITEMS.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex flex-col gap-2">
              <Icon className="size-[18px] text-ink-2" />
              <span className="text-[14.5px] font-semibold text-ink">{title}</span>
              <span className="text-[13px] leading-snug text-ink-2">{detail}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-12 max-w-3xl border-t border-line pt-6 text-[12.5px] leading-relaxed text-ink-3">
        This is a product design prototype. The capabilities described here express intended design
        principles for the concept. No certification, audit result or compliance claim is asserted,
        and every patient, exam and measurement shown on this page is synthetic.
      </p>
    </Section>
  );
}
