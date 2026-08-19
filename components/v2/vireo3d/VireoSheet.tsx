"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createVireoScene } from "./scene";

/**
 * Folha de contato do modelo: vários ângulos desenhados com UM renderer.
 *
 * Um renderer por ângulo esgota os contextos WebGL do navegador (o limite fica por
 * volta de 8 a 16) e o segundo lote falha com "could not create a WebGL context".
 * Renderizando em sequência e copiando cada quadro para um canvas 2D, existe um
 * único contexto do começo ao fim.
 *
 * Usa a MESMA cena da animação, então o ângulo aprovado aqui é o que a landing
 * mostra. É a ferramenta de conferência do modelo: a rotação só é boa se cada
 * ângulo aqui já for apresentável isolado.
 */
export function VireoSheet({
  angles,
  tile = 300,
  cols = 4,
  module: moduleKind = "air",
  lit = true,
}: {
  angles: number[];
  tile?: number;
  cols?: number;
  module?: "air" | "cable" | "none";
  lit?: boolean;
}) {
  const out = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const target = out.current;
    if (!target) return;

    const th = Math.round(tile * 1.25);
    const rows = Math.ceil(angles.length / cols);
    target.width = tile * cols;
    target.height = th * rows;
    const ctx2d = target.getContext("2d");
    if (!ctx2d) return;
    ctx2d.fillStyle = "#ffffff";
    ctx2d.fillRect(0, 0, target.width, target.height);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(2);
    renderer.setSize(tile, th, false);
    renderer.setClearColor(0xffffff, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.98;

    let disposed = false;

    createVireoScene(renderer).then((v) => {
      if (disposed) {
        renderer.dispose();
        return;
      }
      v.camera.aspect = tile / th;
      v.camera.updateProjectionMatrix();
      v.device.screen.material.opacity = lit ? 1 : 0;
      // A folha é estática, então o LED entra aceso: piscar aqui só daria quadros
      // diferentes entre si sem informação nenhuma.
      v.device.led.material.opacity = lit ? 1 : 0;
      v.air.group.visible = moduleKind === "air";
      v.cable.group.visible = moduleKind === "cable";

      angles.forEach((a, i) => {
        v.spin((a * Math.PI) / 180);
        renderer.render(v.scene, v.camera);
        ctx2d.drawImage(
          renderer.domElement,
          (i % cols) * tile,
          Math.floor(i / cols) * th,
          tile,
          th,
        );
        ctx2d.fillStyle = "#6e6e6e";
        ctx2d.font = "12px monospace";
        ctx2d.fillText(
          `${a}°`,
          (i % cols) * tile + 8,
          Math.floor(i / cols) * th + th - 8,
        );
      });
      target.dataset.ready = "1";

      /*
       * Exportador glTF: o modelo sai como arquivo .glb, não só como código. Serve
       * para abrir em Blender ou Keyshot e para a Cardioline conferir o volume
       * contra o CAD dela.
       */
      (
        window as unknown as { exportVireoGlb?: () => Promise<string> }
      ).exportVireoGlb = () =>
        import("three/examples/jsm/exporters/GLTFExporter.js").then(
          ({ GLTFExporter }) =>
            new Promise<string>((resolve, reject) => {
              v.spin(0);
              new GLTFExporter().parse(
                v.pivot,
                (result) => {
                  const bytes = new Uint8Array(result as ArrayBuffer);
                  let s = "";
                  for (let i = 0; i < bytes.length; i += 1)
                    s += String.fromCharCode(bytes[i]);
                  resolve(btoa(s));
                },
                reject,
                { binary: true },
              );
            }),
        );
    });

    return () => {
      disposed = true;
      renderer.dispose();
    };
  }, [angles, tile, cols, moduleKind, lit]);

  return (
    <canvas
      ref={out}
      style={{ width: "100%", height: "auto", display: "block" }}
    />
  );
}
