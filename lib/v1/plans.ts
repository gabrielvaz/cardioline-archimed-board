/**
 * Arquitetura de planos, compartilhada pelas três variações.
 *
 * Regra estrutural que não pode ser afrouxada: tudo que o ECGWebApp já entrega
 * hoje fica no plano gratuito. O Free é a vantagem competitiva do hardware, não
 * uma versão reduzida criada para empurrar upgrade. Ver README.
 */

import { pricing, PRICING_DISCLAIMER } from "./pricing";

export type Plan = {
  id: "free" | "pro" | "enterprise";
  name: string;
  price: string;
  unit?: string;
  audience: string;
  note: string;
  inherits?: string;
  items: readonly string[];
  cta: string;
  footnote?: string;
  featured?: boolean;
};

export const PLANS: readonly Plan[] = [
  {
    id: "free",
    name: "Free",
    price: `${pricing.currency}0`,
    unit: "forever",
    audience: "Included with compatible Cardioline devices",
    note: "The essential cardiac workspace, at no additional monthly cost.",
    items: [
      "Exam management",
      "Patient history",
      "Cardiac exam viewer",
      "Reporting",
      "Cloud storage",
      "Secure browser access",
    ],
    cta: "Activate for free",
    footnote: "No subscription required with a compatible Cardioline device.",
  },
  {
    id: "pro",
    name: "Pro",
    price: `${pricing.currency}${pricing.pro.amount}`,
    unit: `per user, per ${pricing.pro.period}`,
    audience: "Cardiologists and independent professionals",
    note: "The next generation of reading and reporting, for the physician who signs.",
    inherits: "Everything in Free, plus",
    items: [
      "AI-assisted review",
      "Longitudinal comparison",
      "Advanced measurements",
      "Smart reporting",
      "Personal templates",
      "Productivity insights",
    ],
    cta: "Start Pro",
    footnote: PRICING_DISCLAIMER,
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    audience: "Hospitals, networks and diagnostic centres",
    note: "Scale, integration, deployment and governance, scoped per organization.",
    inherits: "Everything in Anchor",
    items: [
      "Enterprise integrations",
      "Multi-site deployment",
      "SSO and governance",
      "HIS / PACS interoperability",
      "Implementation support",
      "Dedicated SLA",
    ],
    cta: "Contact Cardioline",
    footnote: "Scoped per organization.",
  },
] as const;
