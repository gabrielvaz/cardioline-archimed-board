import { VireoSheet } from "@/components/v2/vireo3d/VireoSheet";

export const metadata = { title: "Lab / VIREO AM 3D" };

/** Laboratório: julga o modelo em vários ângulos antes de ligá-lo à rolagem. */
export default function VireoLab() {
  return (
    <main style={{ padding: 20, background: "#fff" }}>
      <VireoSheet angles={[0, 25, 50, 75, 90, 130, 180, 250, 290, 315, 340, 355]} tile={280} cols={6} />
    </main>
  );
}
