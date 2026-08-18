import { Header } from "@/components/v1/landing/Header";
import { Hero } from "@/components/v1/landing/Hero";
import { Ecosystem } from "@/components/v1/landing/Ecosystem";
import { ConnectedWorkflow } from "@/components/v1/landing/ConnectedWorkflow";
import { HardwareUnlock } from "@/components/v1/landing/HardwareUnlock";
import { ProductPreview } from "@/components/v1/landing/ProductPreview";
import { Anywhere } from "@/components/v1/landing/Anywhere";
import { ProFeatures } from "@/components/v1/landing/ProFeatures";
import { Hospitals } from "@/components/v1/landing/Hospitals";
import { Pricing } from "@/components/v1/landing/Pricing";
import { OpenEcosystem } from "@/components/v1/landing/OpenEcosystem";
import { Security } from "@/components/v1/landing/Security";
import { FinalCTA } from "@/components/v1/landing/FinalCTA";
import { Footer } from "@/components/v1/landing/Footer";

export const metadata = { title: "Anchor / Baseline" };

/** Primeira versão, mantida como base de comparação para as três variações. */
export default function Original() {
  return (
    <div id="top">
      <Header />
      <main>
        <Hero />
        <Ecosystem />
        <ConnectedWorkflow />
        <HardwareUnlock />
        <ProductPreview />
        <Anywhere />
        <ProFeatures />
        <Hospitals />
        <Pricing />
        <OpenEcosystem />
        <Security />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
