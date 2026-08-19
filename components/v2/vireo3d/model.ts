import * as THREE from "three";
import metrics from "@/lib/v2/vireo-metrics.json";

/**
 * Modelo 3D do VIREO AM.
 *
 * DIVISÃO DE TRABALHO, que é a decisão de projeto deste arquivo:
 *
 *   geometria  — casco, trilhos metálicos, encaixe, língua do conector, cabo.
 *                Construída com as proporções MEDIDAS nos renders oficiais
 *                (scripts/measure-vireo.py grava lib/v2/vireo-metrics.json).
 *   textura    — a arte de cada face, recortada dos renders oficiais
 *                (public/device/model/face-*.png).
 *
 * A tentativa anterior extrudava a silhueta inteira e colava o render na frente e
 * na traseira. De frente ficava convincente e, girando, virava papelão: os
 * trilhos são o que dá volume ao produto e, como textura chapada, desapareciam a
 * 90°. Com os trilhos em geometria e material metálico, a luz faz o trabalho e a
 * volta completa lê como um objeto só.
 *
 * O que este modelo NÃO tem: os filetes compostos e as portas laterais do CAD.
 * A profundidade (metrics.depth) é estimada da espessura aparente no render em
 * três quartos — a exata precisaria do modelo da Cardioline.
 */

const M = metrics;

/** Altura do corpo em larguras de corpo. Toda a cena usa esta unidade. */
export const MODEL_ASPECT = M.aspect;
const DEPTH = M.depth;

/** Largura de cada trilho: o que sobra da largura fora da face. */
const RAIL_W = (1 - M.face.w) / 2;

/** Recuo da face em relação à superfície do trilho, por lado. */
const RECESS = 0.009;
const CORE_DEPTH = DEPTH - RECESS * 2;

/** Altura visível do bloco do módulo, abaixo do corpo. */
export const MODULE_BODY_HEIGHT = M.module.body.h;

const SOCKET = {
  w: M.module.tongue.w + 0.016,
  h: 0.06,
};

// -------------------------------------------------------------------- formas

function roundedRect(
  w: number,
  h: number,
  rTop: number,
  rBottom = rTop,
): THREE.Shape {
  const x = w / 2;
  const y = h / 2;
  const s = new THREE.Shape();
  s.moveTo(-x + rBottom, -y);
  s.lineTo(x - rBottom, -y);
  s.absarc(x - rBottom, -y + rBottom, rBottom, -Math.PI / 2, 0, false);
  s.lineTo(x, y - rTop);
  s.absarc(x - rTop, y - rTop, rTop, 0, Math.PI / 2, false);
  s.lineTo(-x + rTop, y);
  s.absarc(-x + rTop, y - rTop, rTop, Math.PI / 2, Math.PI, false);
  s.lineTo(-x, -y + rBottom);
  s.absarc(-x + rBottom, -y + rBottom, rBottom, Math.PI, Math.PI * 1.5, false);
  return s;
}

/**
 * Mesma forma, com um recorte retangular no meio da base: é o encaixe do módulo.
 * O recorte precisa estar na GEOMETRIA e não só na textura, senão o encaixe
 * desaparece justamente no momento em que o módulo se separa e ele deveria ficar
 * à vista.
 */
function shapeWithSocket(
  w: number,
  h: number,
  r: number,
  socketW: number,
  socketH: number,
): THREE.Shape {
  const x = w / 2;
  const y = h / 2;
  const sx = socketW / 2;
  const s = new THREE.Shape();
  s.moveTo(-x + r, -y);
  s.lineTo(-sx, -y);
  s.lineTo(-sx, -y + socketH);
  s.lineTo(sx, -y + socketH);
  s.lineTo(sx, -y);
  s.lineTo(x - r, -y);
  s.absarc(x - r, -y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x, y - r);
  s.absarc(x - r, y - r, r, 0, Math.PI / 2, false);
  s.lineTo(-x + r, y);
  s.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(-x, -y + r);
  s.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/**
 * Perfil do trilho: retângulo arredondado com um entalhe no meio da PROFUNDIDADE,
 * nas duas laterais. É a linha de junção das duas metades do casco.
 *
 * Sem ela o aparelho de perfil é uma barra cinza chapada — o ângulo de 90° não
 * tem gráfico nenhum para mostrar, então o único jeito de ele não ficar morto é a
 * própria luz nas facetas do perfil.
 */
function railSection(
  w: number,
  d: number,
  r: number,
  notch: number,
): THREE.Shape {
  const x = w / 2;
  const y = d / 2;
  const s = new THREE.Shape();
  s.moveTo(-x, -y + r);
  s.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5, false);
  s.lineTo(x - r, -y);
  s.absarc(x - r, -y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x, -notch);
  s.lineTo(x - notch, 0);
  s.lineTo(x, notch);
  s.lineTo(x, y - r);
  s.absarc(x - r, y - r, r, 0, Math.PI / 2, false);
  s.lineTo(-x + r, y);
  s.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(-x, notch);
  s.lineTo(-x + notch, 0);
  s.lineTo(-x, -notch);
  s.closePath();
  return s;
}

/** Extrusão centrada em Z, com chanfro nas duas bordas. */
function slab(
  shape: THREE.Shape,
  depth: number,
  bevel: number,
): THREE.ExtrudeGeometry {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.002, depth - bevel * 2),
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 4,
    curveSegments: 28,
  });
  g.translate(0, 0, -depth / 2 + bevel);
  g.computeVertexNormals();
  return g;
}

/**
 * Decalque plano no contorno de uma forma, com UV reprojetado numa caixa.
 * ShapeGeometry gera UV em coordenadas de mundo; sem reprojetar, a textura sai
 * fora de escala e deslocada.
 */
function decal(shape: THREE.Shape, w: number, h: number): THREE.ShapeGeometry {
  const g = new THREE.ShapeGeometry(shape, 28);
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

// ---------------------------------------------------------------- materiais

/**
 * Alumínio escovado dos trilhos. O brilho alongado vem do ambiente e da
 * anisotropia — sem ela o perfil a 90° não tem gradiente nenhum e o produto vira
 * uma barra de papel cinza.
 */
function railMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xd5d9de,
    metalness: 0.94,
    roughness: 0.16,
    anisotropy: 0.6,
    anisotropyRotation: Math.PI / 2,
    clearcoat: 0.5,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.6,
  });
}

/** Plástico escuro da face. */
function darkMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0x1e2226,
    metalness: 0.04,
    roughness: 0.46,
    clearcoat: 0.32,
    clearcoatRoughness: 0.26,
    envMapIntensity: 0.9,
  });
}

/** Cinza técnico da traseira e das abas. */
function shellMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0x9ba1a7,
    metalness: 0.1,
    roughness: 0.5,
    envMapIntensity: 1,
  });
}

/**
 * Arte oficial numa face. alphaTest e não transparent: assim o decalque desenha
 * na passagem opaca e o Z fica confiável — com transparent, a ordenação por
 * distância fazia a arte atravessar o corpo em certos ângulos.
 */
function decalMaterial(map: THREE.Texture) {
  return new THREE.MeshStandardMaterial({
    map,
    alphaTest: 0.5,
    roughness: 0.44,
    metalness: 0.02,
    envMapIntensity: 0.5,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}

// ------------------------------------------------------------------ ambiente

/**
 * Estúdio de produto em três softboxes. Um HDRI resolveria, mas seria um
 * download; e metal sem fonte de luz com FORMA não lê como metal — é a faixa
 * alongada refletida no trilho que faz o material.
 */
export function createStudioEnvironment(
  renderer: THREE.WebGLRenderer,
): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const scene = new THREE.Scene();

  scene.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(14, 32, 20),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        vertexShader:
          "varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader:
          "varying vec3 vP; void main(){ float t = clamp(vP.y/14.0*0.5+0.5,0.0,1.0); gl_FragColor = vec4(mix(vec3(0.30),vec3(0.96),t),1.0); }",
      }),
    ),
  );

  const softbox = (
    w: number,
    h: number,
    pos: [number, number, number],
    power: number,
  ) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(power, power, power),
        side: THREE.DoubleSide,
      }),
    );
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    scene.add(m);
  };

  softbox(9, 3.2, [-3.4, 6.2, 4.2], 7.5); // principal, alta e à esquerda
  softbox(1.5, 11, [5.6, 0.6, 2.4], 5.4); // tira à direita: risco de luz no trilho
  softbox(1.2, 11, [-5.4, 0.4, 1.8], 3.6); // tira à esquerda, mais discreta
  softbox(7, 4, [1.2, -4.6, 3.4], 1.7); // preenchimento baixo
  softbox(6, 6, [0.4, 1.2, -6.5], 2.4); // contraluz, separa do fundo branco

  const env = pmrem.fromScene(scene, 0.04).texture;
  pmrem.dispose();
  return env;
}

// -------------------------------------------------------------------- peças

export type DeviceTextures = {
  front: THREE.Texture;
  back: THREE.Texture;
  screen: THREE.Texture;
};

export type VireoDevice = {
  group: THREE.Group;
  /** Sobreposição da tela acesa. Controle por material.opacity, 0 a 1. */
  screen: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
};

export function createVireoDevice(tex: DeviceTextures): VireoDevice {
  const group = new THREE.Group();
  const faceW = M.face.w;
  const H = MODEL_ASPECT;

  // Trilhos: seção arredondada no plano XZ, extrudada ao longo de Y. É a peça
  // que define a silhueta em qualquer ângulo, por isso vai à profundidade cheia.
  const railGeo = slab(railSection(RAIL_W, DEPTH, 0.03, 0.014), H, 0.02);
  railGeo.rotateX(-Math.PI / 2);
  for (const sign of [-1, 1]) {
    const rail = new THREE.Mesh(railGeo, railMaterial());
    rail.position.set(sign * (0.5 - RAIL_W / 2), 0, 0);
    group.add(rail);
  }

  // Corpo: recuado dos trilhos, com o recorte do encaixe na base.
  const coreShape = shapeWithSocket(faceW, H, 0.035, SOCKET.w, SOCKET.h);
  const core = new THREE.Mesh(
    slab(coreShape, CORE_DEPTH, 0.008),
    darkMaterial(),
  );
  group.add(core);

  // Fundo do encaixe, para o recorte ter chão em vez de furo vazado.
  const socket = new THREE.Mesh(
    new THREE.BoxGeometry(SOCKET.w, SOCKET.h, CORE_DEPTH * 0.5),
    darkMaterial(),
  );
  socket.position.set(0, -H / 2 + SOCKET.h / 2, 0);
  group.add(socket);

  const faceZ = CORE_DEPTH / 2 + 0.0015;

  const front = new THREE.Mesh(
    decal(coreShape, faceW, H),
    decalMaterial(tex.front),
  );
  front.position.z = faceZ;
  group.add(front);

  const back = new THREE.Mesh(
    decal(coreShape, faceW, H),
    (() => {
      const m = decalMaterial(tex.back);
      m.color.set(0xffffff);
      return m;
    })(),
  );
  back.position.z = -faceZ;
  back.rotation.y = Math.PI;
  group.add(back);

  // Tela acesa: sobreposição na área medida da tela. O render oficial tem a tela
  // apagada, então esta é a única parte da frente que não vem do render.
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(M.screen.w, M.screen.h),
    new THREE.MeshBasicMaterial({
      map: tex.screen,
      transparent: true,
      opacity: 0,
      toneMapped: false,
      depthWrite: false,
    }),
  );
  screen.position.set(0, M.screen.cy, faceZ + 0.002);
  screen.renderOrder = 2;
  group.add(screen);

  // Aba cinza do topo. Detalhe pequeno, mas é o que faz a borda superior parar de
  // parecer um corte reto de placa.
  const tab = M.tabTop;
  const tabMesh = new THREE.Mesh(
    slab(roundedRect(tab.x1 - tab.x0, tab.h * 2, 0.018), DEPTH * 0.62, 0.01),
    shellMaterial(),
  );
  tabMesh.position.set(0, H / 2, 0);
  group.add(tabMesh);

  return { group, screen };
}

export type ModuleKind = "air" | "cable";

export type VireoModule = {
  /** Origem no TOPO do bloco: acoplado é posicionar em -MODEL_ASPECT/2. */
  group: THREE.Group;
  /** Materiais que respondem ao esmaecimento na entrada e saída de cena. */
  fades: THREE.Material[];
};

export function createVireoModule(
  kind: ModuleKind,
  face: THREE.Texture,
): VireoModule {
  const group = new THREE.Group();
  const fades: THREE.Material[] = [];
  const w = M.module.w;
  const h = M.module.body.h;
  const faceW = M.face.w;
  const r = M.module.body.radius;

  const add = (mesh: THREE.Mesh) => {
    fades.push(mesh.material as THREE.Material);
    group.add(mesh);
  };

  /*
   * Casco em U: o metal envolve laterais e base, e o miolo é VAZADO. Com um
   * bloco maciço, a face escura ficava dentro do metal e o módulo aparecia todo
   * cromado — o vazio é o que deixa a face à vista, recuada como no produto.
   * A aresta de metal no topo fica em 0,006 para o vazio não tocar o contorno:
   * um vazio encostado na borda quebra a triangulação da extrusão.
   */
  const shellShape = roundedRect(w, h, 0.008, r);
  const holeShape = roundedRect(faceW, h - 0.012, 0.008, r * 0.72);
  shellShape.holes.push(new THREE.Path(holeShape.getPoints(48).reverse()));
  add(new THREE.Mesh(slab(shellShape, DEPTH, 0.008), railMaterial()));

  const coreShape = roundedRect(faceW - 0.004, h - 0.016, 0.008, r * 0.72);
  add(new THREE.Mesh(slab(coreShape, CORE_DEPTH, 0.008), darkMaterial()));

  const faceZ = CORE_DEPTH / 2 + 0.0015;
  const artFront = new THREE.Mesh(
    decal(coreShape, faceW, h - 0.012),
    decalMaterial(face),
  );
  artFront.position.z = faceZ;
  add(artFront);

  // A traseira do módulo recebe a mesma arte espelhada. Não existe render da
  // traseira do módulo; espelhar a frente é mais honesto que inventar uma face.
  const artBack = new THREE.Mesh(
    decal(coreShape, faceW, h - 0.012),
    decalMaterial(face),
  );
  artBack.position.z = -faceZ;
  artBack.rotation.y = Math.PI;
  add(artBack);

  // Língua do conector: sobe do topo do bloco e entra no encaixe do aparelho.
  const tongue = M.module.tongue;
  const tongueMesh = new THREE.Mesh(
    slab(roundedRect(tongue.w, tongue.h, 0.014), DEPTH * 0.5, 0.008),
    darkMaterial(),
  );
  tongueMesh.position.y = h / 2 + tongue.h / 2 - 0.012;
  add(tongueMesh);

  if (kind === "cable") {
    const cone = M.module.cableCone;
    const lead = M.module.cableLead;
    const grey = new THREE.MeshStandardMaterial({
      color: 0xd6d9dd,
      roughness: 0.42,
      metalness: 0.06,
      envMapIntensity: 1.1,
    });
    const coneMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(cone.rTop, cone.rBottom, cone.h, 40, 1),
      grey,
    );
    coneMesh.position.y = -h / 2 - cone.h / 2 + 0.012;
    add(coneMesh);

    const leadMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(lead.r, lead.r, lead.h, 28, 1),
      grey,
    );
    leadMesh.position.y = -h / 2 - cone.h - lead.h / 2 + 0.012;
    add(leadMesh);
  }

  // Origem no TOPO do bloco: acoplar passa a ser posicionar o grupo na base do
  // aparelho, sem contas de meia-altura espalhadas pelo componente.
  for (const child of group.children) child.position.y -= h / 2;

  return { group, fades };
}
