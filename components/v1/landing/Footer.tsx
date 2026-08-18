import { Container } from "@/components/v1/ui/Container";
import { CardiolineLogo } from "@/components/v1/ui/Logo";

const COLUMNS = [
  {
    title: "Anchor",
    links: [
      { label: "Platform", href: "#anchor" },
      { label: "For cardiologists", href: "#for-cardiologists" },
      { label: "For hospitals", href: "#for-hospitals" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Cardioline",
    links: [
      { label: "Products", href: "#how-it-works" },
      { label: "About", href: "#top" },
      { label: "Support", href: "#final-cta" },
      { label: "Contact", href: "#final-cta" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#top" },
      { label: "Terms", href: "#top" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-background py-14 sm:py-16">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div className="flex flex-col gap-4">
            <CardiolineLogo className="w-[150px]" />
            <p className="max-w-xs text-[13.5px] leading-relaxed text-ink-2">
              The digital layer connecting the Cardioline ecosystem.
            </p>
            <p className="text-[12.5px] text-ink-3">Trento, Italy · Since 1962</p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[11px] font-semibold tracking-[0.08em] text-ink uppercase">
                {col.title}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13.5px] text-ink-2 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-[13px] font-semibold text-ink">Anchor by Cardioline</p>
          <p className="max-w-2xl text-[11.5px] leading-relaxed text-ink-3 sm:text-right">
            Product design prototype for internal discussion. Not a Cardioline product page and not
            a commercial offer. Pricing is illustrative. All patients, exams, measurements and ECG
            traces shown are synthetic. The Cardioline name and logo are property of Cardioline
            S.p.A.
          </p>
        </div>
      </Container>
    </footer>
  );
}
