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
import { asset } from "@/lib/asset";
import { createDockTexture, createLedTexture } from "./textures";
import { ASSEMBLY_UNITS, FRAME_LIFT, REST_TILT, REST_YAW } from "./stages";

/**
 * Montagem da cena do VIREO AM, compartilhada pela animação da rolagem e pela
 * folha de contato do laboratório.
 *
 * Existe para que as duas usem a MESMA pose, o mesmo enquadramento e a mesma luz.
 * Enquanto eram dois arquivos, o laboratório aprovava um ângulo que a animação
 * mostrava diferente, e a conferência não valia nada.
 */

/*
 * Caminhos passam por asset() no carregamento: em publicação com prefixo de
 * repositório, um caminho cru aqui daria 404 e a cena ficaria vazia.
 */
const FACES = [
  "/device/model/face-body.png",
  "/device/model/face-body-back.png",
  "/device/model/face-top.png",
  "/device/model/face-air.png",
  "/device/model/face-cable.png",
  // Tela em uso: foto retificada, porque nenhum render CAD tem a tela ligada.
  "/device/model/screen-torso.png",
] as const;

export type VireoScene = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Guinada da animação: gira só o corpo, deixando os módulos soltos parados. */
  pivot: THREE.Group;
  /**
   * Gira o CONJUNTO inteiro a partir da pose de repouso. É o que a folha de
   * contato usa: girando apenas o pivô, os módulos acoplados ficavam onde estavam
   * e a língua do conector aparecia atravessando a face do corpo girado.
   */
  spin: (radians: number) => void;
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
  return Promise.all(FACES.map((f) => loader.loadAsync(asset(f)))).then(
    ([bodyFront, bodyBack, topArt, airArt, cableArt, screenArt]) => {
      for (const t of [
        bodyFront,
        bodyBack,
        topArt,
        airArt,
        cableArt,
        screenArt,
      ]) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      scene.environment = createStudioEnvironment(renderer);

      const camera = new THREE.PerspectiveCamera(26, 0.8, 0.1, 100);
      camera.position.set(0, 0, 6.4);

      /*
       * O ambiente é escuro de propósito, para o vidro preto refletir faixas em
       * vez de branco por igual. A luz DIFUSA do casco branco vem daqui: sem
       * estas três direcionais, com ambiente escuro, o branco ficava cinza.
       */
      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(-2.6, 3.4, 4);
      /*
       * Sombra própria. É o que faltava para as peças parecerem encostadas umas nas
       * outras: sem ela, o módulo acoplado e o feixe de cabos flutuavam sobre o
       * corpo em vez de se apoiarem nele. A câmera de sombra é ortográfica e
       * apertada no produto, senão a resolução se dilui no vazio em volta.
       */
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = -1.7;
      key.shadow.camera.right = 1.7;
      key.shadow.camera.top = 2.1;
      key.shadow.camera.bottom = -2.1;
      key.shadow.camera.near = 0.5;
      key.shadow.camera.far = 12;
      // Peças finas e encostadas: sem o bias a própria superfície se sombreia em
      // faixas (acne), e sem o normalBias as arestas ganham um contorno escuro.
      key.shadow.bias = -0.0004;
      key.shadow.normalBias = 0.012;
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xf2f5f8, 0.85);
      fill.position.set(3.2, -0.4, 2.6);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffffff, 0.6);
      rim.position.set(0.4, 1.2, -3.6);
      scene.add(rim);

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
        screen: screenArt,
        led: createLedTexture(),
      });
      pivot.add(device.group);

      // O módulo superior fica acoplado durante toda a animação, então mora dentro
      // do pivô e gira com o corpo.
      const moduleTop = createVireoModule("top", topArt, { dock });
      moduleTop.group.position.y = MODEL_ASPECT / 2;
      pivot.add(moduleTop.group);

      const air = createVireoModule("air", airArt, { dock });
      const cable = createVireoModule("cable", cableArt, { dock });
      const dockedY = -MODEL_ASPECT / 2;
      air.group.position.y = dockedY;
      cable.group.position.y = dockedY;
      base.add(air.group, cable.group);

      // Todo mesh do conjunto projeta e recebe sombra. Percorrer a cena no fim é
      // mais seguro que marcar peça por peça na construção: nenhuma passa batida.
      tilt.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });

      const spin = (radians: number) => {
        base.rotation.y = REST_YAW + radians;
      };

      return {
        scene,
        camera,
        pivot,
        spin,
        device,
        moduleTop,
        air,
        cable,
        dockedY,
      };
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
