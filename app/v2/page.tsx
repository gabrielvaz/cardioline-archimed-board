import { DeviceShowcase } from "@/components/v2/DeviceShowcase";
import { Hero } from "@/components/v2/Hero";
import { SiteHeader } from "@/components/v2/SiteHeader";
import { Close, Comparison, Ladder, Surfaces } from "@/components/v2/Sections";

export const metadata = {
  title: "Anchor",
  description: "It starts with your device. Anchor by Cardioline.",
};

/**
 * Landing v2.
 *
 * O que muda em relação à v1: o software passa ao primeiro plano, em perspectiva e
 * com a rolagem montando a composição, e o VIREO AM entra como o aparelho que abre
 * esse software. O posicionamento acertado na v1 permanece: o dispositivo é porta de
 * entrada, não conclusão.
 *
 * O aparelho é 3D de verdade, numa seção fixada que se desmonta e remonta com a
 * rolagem. Antes era um render 2D num trilho lateral fixo, o que reservava uma faixa
 * da página e ainda deixava duas representações do mesmo produto na mesma tela.
 */
export default function V2() {
  return (
    <div className="v2">
      <SiteHeader />
      <main>
        <Hero />
        <DeviceShowcase />
        <Surfaces />
        <Ladder />
        <Comparison />
        <Close />
      </main>
    </div>
  );
}
