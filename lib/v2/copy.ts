/**
 * Copy da v2.
 *
 * Herda a regra editorial estabelecida na v1: tempo verbal do começo (starts,
 * opens, included, extended), nunca do encerramento (already yours, nothing
 * more to buy). Sempre que o texto afirma o que está incluído, deixa visível
 * que existe um degrau acima. Incluído não é o mesmo que completo.
 *
 * Zero em-dashes e en-dashes em qualquer string visível.
 */

export const DEVICE = {
  name: "VIREO AM",
  /** Módulo destacável de transmissão sem fio, visível no render oficial. */
  module: "Air",
  blurb:
    "Doze derivações na mão, com o posicionamento dos eletrodos na própria tela e transmissão sem fio pelo módulo Air.",
} as const;

export const HERO = {
  kicker: "Anchor by Cardioline",
  thesis: "It starts with your device.",
  supporting:
    "Every exam the VIREO AM acquires opens in Anchor, on any screen. Included with the Cardioline devices you already own.",
  primary: "Get Anchor",
  secondary: "See how it works",
} as const;

export const SURFACES = [
  {
    label: "On the device",
    body: "Electrode placement, acquisition and a live check of signal quality, on the VIREO AM screen.",
  },
  {
    label: "In the browser",
    body: "The worklist, the twelve-lead viewer and the report, with nothing to install on the workstation.",
  },
  {
    label: "In your pocket",
    body: "A signed report and the patient history, for the round and for the call at two in the morning.",
  },
] as const;

export const LADDER = [
  {
    when: "Included with your device",
    plan: "Anchor Free",
    body: "Exam management, patient history, the cardiac viewer and reporting, at no monthly cost.",
  },
  {
    when: "For the cardiologist",
    plan: "Anchor Pro",
    body: "Longitudinal comparison, AI-assisted review and structured reporting, per user.",
  },
  {
    when: "For the organization",
    plan: "Anchor Enterprise",
    body: "Multi-site deployment, interoperability, governance and a service commitment.",
  },
] as const;

export const AI_NOTE =
  "Clinical decision support for the cardiologist reading the exam. It highlights, compares and drafts. It does not diagnose, and every report is signed by the physician who read it.";

export const PROTOTYPE_NOTICE =
  "Product design prototype for internal discussion. Not a Cardioline product page and not a commercial offer. Pricing is illustrative. Every patient, exam, measurement and ECG trace shown is synthetic.";

export const NAV = [
  { label: "Platform", href: "#platform" },
  { label: "Surfaces", href: "#surfaces" },
  { label: "Pricing", href: "#pricing" },
] as const;
