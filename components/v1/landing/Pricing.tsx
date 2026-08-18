import { Section, SectionHeading } from "@/components/v1/ui/Section";
import { Button } from "@/components/v1/ui/Button";
import { CheckItem } from "@/components/v1/ui/Feature";
import { pricing, PRICING_DISCLAIMER } from "@/lib/v1/pricing";
import { cn } from "@/lib/v1/cn";
import { PricingMatrix } from "./PricingMatrix";

/**
 * Arquitetura de planos.
 *
 * Regra estrutural: tudo que o ECGWebApp entrega hoje esta no plano gratuito.
 * O Free nao e uma versao reduzida para empurrar upgrade — e a vantagem
 * competitiva do hardware. O Pro cobra inteligencia e produtividade novas; o
 * Enterprise cobra escala, integracao, implantacao, governanca e servicos.
 */

type Plan = {
  id: string;
  name: string;
  badge?: string;
  audience: string;
  price: React.ReactNode;
  priceNote: string;
  inherits?: string;
  items: string[];
  cta: string;
  ctaNote?: string;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Anchor Free",
    audience: "Included with compatible Cardioline devices",
    price: (
      <>
        {pricing.currency}
        {pricing.free.amount}
      </>
    ),
    priceNote: `Forever with compatible Cardioline devices.`,
    items: [
      "Exam management",
      "Patient history",
      "Cardiac exam viewer",
      "Reporting",
      "Cloud storage",
      "Secure browser access",
      "Core Anchor experience",
    ],
    cta: "Activate for free",
    ctaNote: "No subscription required with a compatible Cardioline device.",
  },
  {
    id: "pro",
    name: "Anchor Pro",
    badge: "For cardiologists",
    audience: "Cardiologists and independent professionals",
    price: (
      <>
        {pricing.currency}
        {pricing.pro.amount}
      </>
    ),
    priceNote: `Per user, per ${pricing.pro.period}.`,
    inherits: "Everything in Free, plus…",
    items: [
      "AI-assisted review",
      "Longitudinal comparison",
      "Advanced measurements",
      "Smart reporting",
      "Personal templates",
      "Productivity insights",
    ],
    cta: "Start Pro",
    ctaNote: PRICING_DISCLAIMER,
    featured: true,
  },
  {
    id: "enterprise",
    name: "Anchor Enterprise",
    audience: "Hospitals, networks, diagnostic centres and healthcare groups",
    price: "Custom",
    priceNote: "For hospitals and healthcare networks.",
    inherits: "Everything in Anchor, plus…",
    items: [
      "Enterprise integrations",
      "Multi-site deployment",
      "SSO & governance",
      "HIS / PACS interoperability",
      "Implementation support",
      "Dedicated SLA",
    ],
    cta: "Contact Cardioline",
    ctaNote: "Scoped per organization.",
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  const featured = plan.featured;
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-[16px] border bg-white",
        featured
          ? "border-brand shadow-[0_2px_8px_rgba(246,98,1,0.1),0_28px_64px_-28px_rgba(7,16,70,0.22)] lg:-my-3"
          : "border-line shadow-[var(--shadow-subtle)]",
      )}
    >
      {plan.badge ? (
        <span className="absolute -top-3 left-7 rounded-full bg-brand-strong px-3 py-1 text-[11px] font-semibold tracking-[0.03em] text-white uppercase">
          {plan.badge}
        </span>
      ) : null}

      <div className={cn("border-b border-line p-7", featured && "pt-9")}>
        <h3 className="text-[1.3125rem] tracking-[-0.02em]">{plan.name}</h3>
        <p className="mt-1.5 min-h-[36px] text-[13px] leading-snug text-ink-2">{plan.audience}</p>

        <p className="mt-6 flex items-baseline gap-1.5">
          <span
            className={cn(
              "tnum leading-none font-semibold tracking-[-0.03em]",
              // "Custom" e uma palavra, nao um numeral: a 44px dominaria a secao
              typeof plan.price === "string" ? "text-[2rem]" : "text-[2.75rem]",
              featured ? "text-brand-ink" : "text-ink",
            )}
          >
            {plan.price}
          </span>
          {plan.id === "pro" ? (
            <span className="text-[15px] font-medium text-ink-3">/ {pricing.pro.period}</span>
          ) : plan.id === "free" ? (
            <span className="text-[15px] font-medium text-ink-3">/ {pricing.free.period}</span>
          ) : null}
        </p>
        <p className="mt-2 text-[12.5px] text-ink-3">{plan.priceNote}</p>

        <Button
          href={plan.id === "enterprise" ? "#final-cta" : "#hardware"}
          variant={featured ? "primary" : "secondary"}
          size="lg"
          full
          className="mt-6"
        >
          {plan.cta}
        </Button>
        {plan.ctaNote ? (
          <p className="mt-3 text-center text-[11.5px] leading-snug text-ink-3">{plan.ctaNote}</p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-7">
        {plan.inherits ? (
          <p className="mb-4 text-[12.5px] font-semibold text-ink">{plan.inherits}</p>
        ) : (
          <p className="mb-4 text-[12.5px] font-semibold text-ink">
            Everything your device needs, included:
          </p>
        )}
        <ul className="flex flex-col gap-2.5">
          {plan.items.map((item) => (
            <CheckItem key={item} tone={featured ? "brand" : "default"}>
              {item}
            </CheckItem>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Pricing() {
  return (
    <Section id="pricing" tone="muted" className="border-b border-line">
      <SectionHeading
        align="center"
        eyebrow="Pricing"
        title="Start with your device. Grow with your needs."
        intro="Essential cardiac workflow is included with compatible Cardioline devices. Add advanced capabilities when you need them."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-5 xl:gap-6">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Filosofia de precificacao — explicita o novo modelo mental */}
      <div className="mx-auto mt-14 max-w-3xl rounded-[16px] border border-line bg-white px-7 py-8 text-center sm:px-10">
        <p className="text-[1.25rem] leading-snug font-semibold tracking-[-0.02em] text-ink sm:text-[1.375rem]">
          The software your device needs shouldn&rsquo;t be another purchase.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-2">
          Every compatible Cardioline device gives you access to Anchor&rsquo;s essential cardiac
          workflow. Upgrade only when advanced professional or enterprise capabilities create
          additional value for you.
        </p>
      </div>

      <PricingMatrix className="mt-16" />
    </Section>
  );
}
