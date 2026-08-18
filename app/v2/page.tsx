import { DeviceRail } from "@/components/v2/DeviceRail";
import { Hero } from "@/components/v2/Hero";
import { SiteHeader } from "@/components/v2/SiteHeader";
import { Close, Comparison, Ladder, Surfaces } from "@/components/v2/Sections";
import { VireoShowcase } from "@/components/v2/VireoShowcase";

export const metadata = {
  title: "Anchor",
  description: "It starts with your device. Anchor by Cardioline.",
};

/**
 * Landing v2.
 *
 * O que muda em relação à v1: o software passa ao primeiro plano, em perspectiva
 * e com a rolagem montando a composição, e o VIREO AM entra como o aparelho que
 * abre esse software. O posicionamento acertado na v1 permanece: o dispositivo é
 * porta de entrada, não conclusão.
 */
export default function V2() {
  return (
    <div className="v2">
      {/* Dentro de .v2 de propósito: o trilho lê --rail-w, que é declarada ali.
          Como irmão, a variável não resolvia e a imagem caía na largura
          intrínseca de 452 px, cobrindo o workspace. */}
      <DeviceRail />
      <SiteHeader />
      <main>
        <Hero />
        <VireoShowcase />
        <Surfaces />
        <Ladder />
        <Comparison />
        <Close />
      </main>
    </div>
  );
}
