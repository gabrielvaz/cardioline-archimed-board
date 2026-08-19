"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MODEL_ASPECT, createVireoModel } from "./model";

/**
 * Folha de contato do modelo: vários ângulos desenhados com UM renderer.
 *
 * Um renderer por ângulo esgota os contextos WebGL do navegador (o limite fica
 * por volta de 8 a 16) e o segundo lote falha com "could not create a WebGL
 * context". Renderizando em sequência e copiando cada quadro para um canvas 2D,
 * existe um único contexto do começo ao fim.
 */
export function VireoSheet({
  angles,
  tile = 300,
  cols = 4,
}: {
  angles: number[];
  tile?: number;
  cols?: number;
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
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(26, tile / th, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(-2.4, 3.4, 3.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xdfe6f2, 0.6);
    fill.position.set(3.2, -0.6, 2.2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.9);
    rim.position.set(0.6, 1.2, -3.4);
    scene.add(rim);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(10, 24, 16),
        new THREE.ShaderMaterial({
          side: THREE.BackSide,
          vertexShader:
            "varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
          fragmentShader:
            "varying vec3 vP; void main(){ float t = clamp(vP.y/10.0*0.5+0.5,0.0,1.0); gl_FragColor = vec4(mix(vec3(0.62),vec3(1.0),t),1.0); }",
        }),
      ),
    );
    scene.environment = pmrem.fromScene(envScene).texture;

    const loader = new THREE.TextureLoader();
    let disposed = false;

    Promise.all([
      loader.loadAsync("/device/model/front.png"),
      loader.loadAsync("/device/model/back.png"),
    ]).then(([front, back]) => {
      if (disposed) return;
      for (const t of [front, back]) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }
      const model = createVireoModel({ front, back });
      model.scale.setScalar(1.7 / MODEL_ASPECT);
      scene.add(model);

      angles.forEach((a, i) => {
        model.rotation.y = (a * Math.PI) / 180;
        renderer.render(scene, camera);
        ctx2d.drawImage(renderer.domElement, (i % cols) * tile, Math.floor(i / cols) * th, tile, th);
        ctx2d.fillStyle = "#6e6e6e";
        ctx2d.font = "12px monospace";
        ctx2d.fillText(`${a}°`, (i % cols) * tile + 8, Math.floor(i / cols) * th + th - 8);
      });
      target.dataset.ready = "1";

      /*
       * Expõe um exportador glTF para que o modelo saia como arquivo .glb, e não
       * só como código. Serve para abrir em Blender, Keyshot ou qualquer visor,
       * e para a Cardioline validar o volume contra o CAD dela.
       */
      (window as unknown as { exportVireoGlb?: () => Promise<string> }).exportVireoGlb = () =>
        import("three/examples/jsm/exporters/GLTFExporter.js").then(
          ({ GLTFExporter }) =>
            new Promise<string>((resolve, reject) => {
              new GLTFExporter().parse(
                model,
                (result) => {
                  const bin = result as ArrayBuffer;
                  const bytes = new Uint8Array(bin);
                  let s = "";
                  for (let i = 0; i < bytes.length; i += 1) s += String.fromCharCode(bytes[i]);
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
      pmrem.dispose();
      renderer.dispose();
    };
  }, [angles, tile, cols]);

  return <canvas ref={out} style={{ width: "100%", height: "auto", display: "block" }} />;
}
