import * as THREE from "three";
import {
  ASSEMBLY_ASPECT,
  MODEL_ASPECT,
  createStudioEnvironment,
  createVireoDevice,
  createVireoModule,
  type VireoDevice,
  type VireoModule,
} from "./model";
import { createDockTexture, createScreenTexture } from "./textures";
import { ASSEMBLY_UNITS, FRAME_LIFT, REST_TILT, REST_YAW } from "./stages";

/**
 * Montagem da cena do VIREO AM, compartilhada pela animação da rolagem e pela
 * folha de contato do laboratório.
 *
 * Existe para que as duas usem a MESMA pose, o mesmo enquadramento e a mesma luz.
 * Enquanto eram dois arquivos, o laboratório aprovava um ângulo que a animação
 * mostrava diferente, e a conferência não valia nada.
 */

const FACES = [
  "/device/model/face-body.png",
  "/device/model/face-body-back.png",
  "/device/model/face-top.png",
  "/device/model/face-air.png",
  "/device/model/face-cable.png",
  "/device/model/face-harness.png",
] as const;

export type VireoScene = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Guinada da animação, somada à pose de repouso. */
  pivot: THREE.Group;
  device: VireoDevice;
  moduleTop: VireoModule;
  air: VireoModule;
  cable: VireoModule;
  /** Y de acoplamento dos módulos inferiores. */
  dockedY: number;
};

export function createVireoScene(
  renderer: THREE.WebGLRenderer,
): Promise<VireoScene> {
  const loader = new THREE.TextureLoader();
  return Promise.all(FACES.map((f) => loader.loadAsync(f))).then(
    ([bodyFront, bodyBack, topArt, airArt, cableArt, harnessArt]) => {
      for (const t of [
        bodyFront,
        bodyBack,
        topArt,
        airArt,
        cableArt,
        harnessArt,
      ]) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      scene.environment = createStudioEnvironment(renderer);

      const camera = new THREE.PerspectiveCamera(26, 0.8, 0.1, 100);
      camera.position.set(0, 0, 6.4);

      // O ambiente faz quase tudo. Esta direcional existe só para o plástico
      // escuro da face ganhar gradiente próprio — com ambiente puro ele lê chapado.
      const key = new THREE.DirectionalLight(0xffffff, 0.7);
      key.position.set(-2.4, 3.2, 4.2);
      scene.add(key);

      /*
       * tilt > base > pivot. A pose de repouso mora nos dois grupos de fora, então
       * os módulos soltos ficam inclinados junto com o aparelho; só o pivô recebe
       * a guinada da animação, e um módulo acoplado gira enquanto um solto não.
       */
      const tilt = new THREE.Group();
      tilt.rotation.x = REST_TILT;
      const base = new THREE.Group();
      base.rotation.y = REST_YAW;
      base.scale.setScalar(ASSEMBLY_UNITS / ASSEMBLY_ASPECT);
      base.position.y = FRAME_LIFT;
      const pivot = new THREE.Group();
      base.add(pivot);
      tilt.add(base);
      scene.add(tilt);

      const dock = createDockTexture();
      const device = createVireoDevice({
        bodyFront,
        bodyBack,
        screen: createScreenTexture(),
      });
      pivot.add(device.group);

      // O módulo superior fica acoplado durante toda a animação, então mora dentro
      // do pivô e gira com o corpo.
      const moduleTop = createVireoModule("top", topArt, {
        harness: harnessArt,
      });
      moduleTop.group.position.y = MODEL_ASPECT / 2;
      pivot.add(moduleTop.group);

      const air = createVireoModule("air", airArt, { dock });
      const cable = createVireoModule("cable", cableArt, { dock });
      const dockedY = -MODEL_ASPECT / 2;
      air.group.position.y = dockedY;
      cable.group.position.y = dockedY;
      base.add(air.group, cable.group);

      return { scene, camera, pivot, device, moduleTop, air, cable, dockedY };
    },
  );
}

/** Ajusta renderer e câmera ao tamanho do elemento. */
export function fitToElement(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  el: HTMLElement,
): void {
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return;
  renderer.setSize(r.width, r.height, false);
  camera.aspect = r.width / r.height;
  camera.updateProjectionMatrix();
}
