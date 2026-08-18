import { SiteFooter, SiteNav } from "@/components/v1/home/Chrome";
import {
  Thesis,
  Unlock,
  Workspace,
  Scale,
  Professional,
  Institutional,
  Price,
  Close,
} from "@/components/v1/home/Sections";

/**
 * Landing page do Anchor.
 *
 * Narrativa, em ordem de scroll:
 *   1. o dispositivo é onde tudo começa            (Thesis)
 *   2. o que vem incluído, e o que vem depois      (Unlock)
 *   3. o produto é sério e clínico                 (Workspace)
 *   4. a Cardioline tem escala para sustentar isso (Scale)
 *   5. o degrau profissional                       (Professional)
 *   6. o degrau institucional                      (Institutional)
 *   7. a fronteira comercial, explícita            (Price)
 *   8. o convite                                   (Close)
 */
export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Thesis />
        <Unlock />
        <Workspace />
        <Scale />
        <Professional />
        <Institutional />
        <Price />
        <Close />
      </main>
      <SiteFooter />
    </>
  );
}
