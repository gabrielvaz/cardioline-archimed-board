"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  MODEL_ASPECT,
  createStudioEnvironment,
  createVireoDevice,
  createVireoModule,
} from "./model";
import { createScreenTexture } from "./textures";

/**
 * Folha de contato do modelo: vários ângulos desenhados com UM renderer.
 *
 * Um renderer por ângulo esgota os contextos WebGL do navegador (o limite fica
 * por volta de 8 a 16) e o segundo lote falha com "could not create a WebGL
 * context". Renderizando em sequência e copiando cada quadro para um canvas 2D,
 * existe um único contexto do começo ao fim.
 *
 * É a ferramenta de conferência do modelo: a rotação da landing só é boa se cada
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.environment = createStudioEnvironment(renderer);
    const camera = new THREE.PerspectiveCamera(26, tile / th, 0.1, 100);
    /*
     * Câmera levemente acima e apontada um pouco abaixo do centro. Enquadramento
     * frontal puro deixava o perfil a 90° sem nenhuma face superior visível, e
     * nesse ângulo o produto lia como recorte de papel. Meio grau de topo à vista
     * basta para o volume aparecer em todos os ângulos.
     */
    camera.position.set(0, 0.62, 6.35);
    camera.lookAt(0, 0.1, 0);

    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(-2.2, 3.6, 4);
    scene.add(key);

    const loader = new THREE.TextureLoader();
    let disposed = false;

    Promise.all([
      loader.loadAsync("/device/model/face-front.png"),
      loader.loadAsync("/device/model/face-back.png"),
      loader.loadAsync(
        `/device/model/face-${moduleKind === "cable" ? "cable" : "air"}.png`,
      ),
    ]).then(([front, back, moduleArt]) => {
      if (disposed) return;
      for (const t of [front, back, moduleArt]) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }

      const world = new THREE.Group();
      const device = createVireoDevice({
        front,
        back,
        screen: createScreenTexture(),
      });
      device.screen.material.opacity = lit ? 1 : 0;
      world.add(device.group);

      if (moduleKind !== "none") {
        const mod = createVireoModule(moduleKind, moduleArt);
        mod.group.position.y = -MODEL_ASPECT / 2;
        device.group.add(mod.group);
      }

      world.scale.setScalar(1.5 / MODEL_ASPECT);
      world.position.y = 0.2;
      scene.add(world);

      angles.forEach((a, i) => {
        device.group.rotation.y = (a * Math.PI) / 180;
        renderer.render(scene, camera);
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
       * Exportador glTF: o modelo sai como arquivo .glb, não só como código.
       * Serve para abrir em Blender ou Keyshot e para a Cardioline conferir o
       * volume contra o CAD dela.
       */
      (
        window as unknown as { exportVireoGlb?: () => Promise<string> }
      ).exportVireoGlb = () =>
        import("three/examples/jsm/exporters/GLTFExporter.js").then(
          ({ GLTFExporter }) =>
            new Promise<string>((resolve, reject) => {
              device.group.rotation.y = 0;
              new GLTFExporter().parse(
                device.group,
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
