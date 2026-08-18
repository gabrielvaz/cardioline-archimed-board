/**
 * Copy canônica, compartilhada pelas três variações.
 *
 * Uma fonte só para as palavras significa que a liderança compara **desenho**,
 * não texto. Zero em-dashes por decisão editorial: o travessão longo é a
 * assinatura tipográfica mais reconhecível de texto gerado por máquina, e esta
 * página precisa soar escrita por alguém.
 */

/*
 * POSICIONAMENTO
 *
 * O dispositivo é a PORTA DE ENTRADA, nunca a conclusão. Frases como "the
 * software is already yours" fecham o argumento: dizem ao leitor que não há
 * mais nada a decidir, e isso trabalha contra a própria tese de receita
 * recorrente. Toda a copy abaixo é escrita no tempo verbal do começo (starts,
 * opens, included, extended) e nunca no do encerramento (already yours, nothing
 * more to buy, free forever).
 *
 * Regra prática: sempre que o texto afirmar o que está incluído, ele precisa
 * deixar visível que existe um degrau acima. Incluído não é o mesmo que
 * completo.
 */
export const VALUE = {
  /** A frase que a página inteira existe para entregar. */
  thesis: "It starts with your device.",
  supporting:
    "Anchor brings every exam, patient and report into one secure workspace. Included with the Cardioline devices you already own.",
  unlock: "Included with your device. Extended when you need it.",
} as const;

/**
 * A escada. Substitui a declaração terminal que antes fechava a seção de
 * desbloqueio: em vez de anunciar que o software é grátis e parar ali, mostra
 * os três degraus e aponta para o pricing.
 */
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

export const FACTS = [
  { value: "1962", label: "Founded in Trento, Italy" },
  { value: "400,000+", label: "Devices in clinical use" },
  { value: "60+", label: "Countries served" },
  { value: "4", label: "Modalities, one workspace" },
] as const;

export const MODALITY_LINE = "Resting ECG, Holter, ABPM and Stress ECG.";

export const UNLOCK_STEPS = [
  {
    title: "A Cardioline device",
    body: "An electrocardiograph, Holter recorder or ambulatory pressure monitor you already own.",
  },
  {
    title: "Register it once",
    body: "No local installation, no licence to buy for the essential workspace, no server to maintain.",
  },
  {
    title: "Anchor is active",
    body: "The essential cardiac workspace, at no additional monthly cost, in the browser.",
  },
] as const;

export const PRO_CAPABILITIES = [
  {
    title: "Compare over time",
    body: "The current recording beside the previous one, on the same grid and the same scale.",
  },
  {
    title: "AI-assisted review",
    body: "Areas that may warrant a closer look are marked, with the reasoning shown.",
  },
  {
    title: "Smart reporting",
    body: "Structured fields and phrase suggestions drawn from your own templates.",
  },
  {
    title: "Patient timeline",
    body: "Longitudinal cardiac history across every modality, in one sequence.",
  },
] as const;

/** Nunca prometer diagnóstico automático nem substituição do cardiologista. */
export const AI_DISCLAIMER =
  "Clinical decision support for the cardiologist reading the exam. It highlights, compares and drafts. It does not diagnose, and every report is signed by the physician who read it.";

export const ENTERPRISE_CAPABILITIES = [
  { title: "Connect the organization", body: "Departments, sites and satellite clinics under one administrative structure." },
  { title: "Standardize workflows", body: "Reporting paths and templates defined centrally, applied across locations." },
  { title: "Integrate existing systems", body: "HIS, PACS and EHR interoperability scoped to the estate you already run." },
  { title: "Govern access", body: "Organizational permissions, single sign-on and an audit trail on every exam." },
  { title: "Scale across locations", body: "Large-scale deployment with implementation support and a service commitment." },
] as const;

export const PRICING_PHILOSOPHY = {
  headline: "The software your device needs shouldn\u2019t be another purchase.",
  body: "Every compatible Cardioline device gives you access to Anchor\u2019s essential cardiac workflow. Upgrade only when advanced professional or enterprise capabilities create additional value for you.",
} as const;

export const SECURITY_POINTS = [
  "Encrypted connections",
  "Role-based permissions",
  "Audit trail on every exam",
  "GDPR-aware workflows",
] as const;

export const PROTOTYPE_NOTICE =
  "Product design prototype for internal discussion. Not a Cardioline product page and not a commercial offer. Pricing is illustrative. Every patient, exam, measurement and ECG trace shown is synthetic.";

export const NAV = [
  { label: "Platform", href: "#platform" },
  { label: "Cardiologists", href: "#cardiologists" },
  { label: "Hospitals", href: "#hospitals" },
  { label: "Pricing", href: "#pricing" },
] as const;
