import { VireoSheet } from "@/components/v2/vireo3d/VireoSheet";

export const metadata = { title: "Lab / VIREO AM 3D" };

/**
 * Laboratório: julga o modelo em vários ângulos antes de ligá-lo à rolagem.
 *
 * Três folhas, porque quando algo quebra é preciso saber QUAL peça quebrou: a
 * primeira tem só corpo e módulo superior, as outras acrescentam cada módulo
 * inferior.
 */
export default function VireoLab() {
  return (
    <main style={{ padding: 20, background: "#fff", display: "grid", gap: 24 }}>
      <section id="parts-none">
        <VireoSheet angles={[0, 45, 90, 180]} tile={380} cols={4} module="none" />
      </section>
      <section id="parts-air">
        <VireoSheet angles={[0, 45, 90, 180]} tile={380} cols={4} module="air" />
      </section>
      <section id="parts-cable">
        <VireoSheet angles={[0, 45, 90, 180]} tile={380} cols={4} module="cable" />
      </section>
    </main>
  );
}
