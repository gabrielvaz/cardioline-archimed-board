import * as THREE from "three";
import metrics from "@/lib/v2/vireo-metrics.json";
import {
  createBrushedNormal,
  createGlassRoughness,
  createPlasticRoughness,
} from "./textures";

/**
 * Modelo 3D do VIREO AM.
 *
 * DIVISÃO DE TRABALHO, que é a decisão de projeto deste arquivo:
 *
 *   geometria — casco, trilhos metálicos, encaixes, língua do conector, alívio de
 *               tensão, feixe de derivações e cabo de paciente. Proporções
 *               MEDIDAS nos renders CAD oficiais (scripts/measure-vireo.py grava
 *               lib/v2/vireo-metrics.json).
 *   textura   — a arte de cada face, recortada dos renders oficiais
 *               (public/device/model/face-*.png).
 *   canvas    — só a tela acesa e os contatos do encaixe, que nenhum render
 *               oficial mostra.
 *
 * O aparelho tem TRÊS BLOCOS: módulo superior (feixe de 12 derivações), corpo e
 * módulo inferior (Air ou cabo de paciente). A vista frontal isolada engana: o
 * que ela mostra como abas cinzas nas pontas são os encaixes VAZIOS.
 *
 * Duas tentativas anteriores e o que cada uma ensinou:
 *   1. extrudar a silhueta e colar o render nas duas faces — de frente convencia,
 *      girando virava papelão, porque os trilhos são volume e não pintura;
 *   2. geometria com metal muito espelhado e anisotrópico — o produto real é
 *      alumínio claro FOSCO, com uma linha de junção no meio do perfil; espelhado
 *      demais lê como brinquedo cromado.
 */

const M = metrics;

/** Altura do CORPO em larguras de corpo. Unidade de toda a cena. */
export const MODEL_ASPECT = M.body.aspect;
const DEPTH = M.body.depth;
const FACE_W = M.face.w;
const RAIL_W = M.rail.w;

/** Recuo da face em relação à superfície do trilho, por lado. */
const RECESS = 0.008;
const CORE_DEPTH = DEPTH - RECESS * 2;

export const MODULE_TOP_HEIGHT = M.module.topH;
export const MODULE_BOTTOM_HEIGHT = M.module.bottomH;
/** Altura do conjunto montado, em larguras de corpo. Serve ao enquadramento. */
export const ASSEMBLY_ASPECT = M.assembly.aspect;

// -------------------------------------------------------------------- formas

/**
 * Limita o raio ao que a caixa aceita. Um raio maior que metade da altura faz os
 * dois filetes do mesmo lado se cruzarem: o contorno passa a ter autointerseção e
 * a extrusão devolve faces enormes atravessando o produto. Foi exatamente o que
 * aconteceu com o raio de ponta do módulo — 0,23 medido no render, contra 0,199 de
 * meia-altura de bloco.
 */
function fitRadius(r: number, w: number, h: number): number {
  return Math.max(0.002, Math.min(r, w / 2 - 0.002, h / 2 - 0.002));
}

function roundedRect(
  w: number,
  h: number,
  rTopIn: number,
  rBottomIn = rTopIn,
): THREE.Shape {
  const x = w / 2;
  const y = h / 2;
  const rTop = fitRadius(rTopIn, w, h);
  const rBottom = fitRadius(rBottomIn, w, h);
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
 * Perfil do trilho: retângulo arredondado com um entalhe no meio da PROFUNDIDADE,
 * nas duas laterais. É a linha de junção das duas metades do casco, e ela existe
 * no produto — aparece na vista lateral oficial.
 *
 * Sem ela o aparelho de perfil não tem gráfico nenhum, e o ângulo de 90° morre.
 */
function railSection(
  w: number,
  d: number,
  r: number,
  notch: number,
): THREE.Shape {
  const x = w / 2;
  const y = d / 2;
  r = fitRadius(r, w, d);
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
    bevelSegments: 6,
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
 * PALETA, medida nas fotos do produto em assets/device-source/ e não no render
 * CAD. Os renders são cinza técnico uniforme; o produto tem três materiais bem
 * diferentes, e usar um só era o que deixava o 3D com cara de maquete:
 *
 *   trilho do corpo   cinza médio semi-brilhante (agrupamento em luminância 134)
 *   casco dos módulos branco fosco (agrupamento em 213)
 *   face              VIDRO PRETO, com reflexo especular nítido (albedo em ~14)
 */

/*
 * Mapas de superfície criados uma vez e compartilhados. Um por material seria
 * desperdício de memória de GPU sem nenhum ganho: são padrões repetidos.
 */
let surfaceMaps: {
  plastic: THREE.Texture;
  brushed: THREE.Texture;
  glass: THREE.Texture;
} | null = null;

function maps() {
  if (!surfaceMaps) {
    surfaceMaps = {
      plastic: createPlasticRoughness(),
      brushed: createBrushedNormal(),
      glass: createGlassRoughness(),
    };
  }
  return surfaceMaps;
}

/** Trilho lateral do corpo: cinza médio, levemente metálico. */
function railMaterial() {
  const m = maps();
  return new THREE.MeshPhysicalMaterial({
    color: 0x74787c,
    metalness: 0.3,
    roughness: 0.33,
    roughnessMap: m.plastic,
    // Estrias de usinagem, muito fracas. É o que dá direção ao metal: sem elas o
    // reflexo é uniforme e a peça lê como cinza pintado.
    normalMap: m.brushed,
    normalScale: new THREE.Vector2(0.13, 0.13),
    clearcoat: 0.3,
    clearcoatRoughness: 0.22,
    envMapIntensity: 1.05,
  });
}

/** Casco dos módulos e do cabo: plástico branco fosco. */
function shellMaterial() {
  const m = maps();
  return new THREE.MeshPhysicalMaterial({
    color: 0xeceeeb,
    metalness: 0,
    roughness: 0.42,
    // Grão de injeção. Um valor único de rugosidade em toda a peça é o que dá o
    // aspecto de plástico de CG: superfície perfeita demais.
    roughnessMap: m.plastic,
    clearcoat: 0.22,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.95,
  });
}

/** Miolo sob a face: preto, praticamente sem reflexo próprio. */
function darkMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0x101215,
    metalness: 0.02,
    roughness: 0.4,
    clearcoat: 0.5,
    clearcoatRoughness: 0.14,
    envMapIntensity: 0.7,
  });
}

/** Cabo e alívio de tensão: PVC branco, mais fosco que o casco. */
function cableMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xeae8e4,
    metalness: 0.02,
    roughness: 0.5,
    roughnessMap: maps().plastic,
    envMapIntensity: 0.85,
  });
}

/**
 * Arte oficial numa face, sob verniz. O clearcoat é o que faz a frente ler como
 * VIDRO e não como adesivo: a arte fica embaixo, difusa, e o reflexo especular
 * corre por cima dela — é o que se vê nas fotos do produto.
 *
 * alphaTest e não transparent: assim o decalque desenha na passagem opaca e o Z
 * fica confiável. Com transparent, a ordenação por distância fazia a arte
 * atravessar o corpo em certos ângulos.
 */
function decalMaterial(map: THREE.Texture) {
  return new THREE.MeshPhysicalMaterial({
    map,
    alphaTest: 0.5,
    roughness: 0.34,
    metalness: 0.02,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    // Verniz com variação larga e fraca: o reflexo deixa de ser espelho perfeito,
    // que é o que denunciava a face como superfície matemática.
    clearcoatRoughnessMap: maps().glass,
    envMapIntensity: 0.72,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}

// ------------------------------------------------------------------ ambiente

/**
 * Estúdio de produto em softboxes largas. Um HDRI resolveria, mas seria um
 * download; e metal sem fonte de luz com FORMA não lê como metal.
 *
 * A RADIÂNCIA das faixas é modesta de propósito. Com faixas de radiância 15, o
 * especular do verniz somava 0,37 em linear sobre a face e o preto renderizava em
 * 164 de 255 — a arte inteira aparecia sob um véu branco. Medido: a mesma face com
 * material não iluminado dá 14, então o problema era luz e não textura.
 *
 * O FUNDO do ambiente é ESCURO, e isso é essencial. Com um ambiente claro em todas
 * as direções, o verniz da face espelhava branco por igual e o vidro preto virava
 * um cinza chapado. Precisa de contraste: fundo escuro com faixas de luz, para o
 * preto refletir a faixa e ler como vidro. O fundo branco da CENA é outra coisa e
 * continua branco.
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
          "varying vec3 vP; void main(){ float t = clamp(vP.y/14.0*0.5+0.5,0.0,1.0); gl_FragColor = vec4(mix(vec3(0.02),vec3(0.13),t),1.0); }",
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

  // Faixas ESTREITAS: é o que o vidro preto reflete como risco de luz. Softboxes
  // largas cobriam quase toda a esfera do ambiente, o especular tomava a face
  // inteira e o preto voltava a ler como cinza chapado.
  softbox(1.5, 12, [-3.4, 2.8, 5.2], 2); // risco principal, cruzando a face
  softbox(0.9, 9, [4.4, -0.8, 4.8], 1.5); // risco secundário, do outro lado
  softbox(14, 10, [0, 0, 9], 0.12); // preenchimento amplo, só para não afundar
  softbox(7, 7, [0.4, 1.4, -6.8], 0.7); // contraluz, separa do fundo branco

  const env = pmrem.fromScene(scene, 0.035).texture;
  pmrem.dispose();
  return env;
}

// ----------------------------------------------------------------- aparelho

export type DeviceTextures = {
  bodyFront: THREE.Texture;
  bodyBack: THREE.Texture;
  screen: THREE.Texture;
  led: THREE.Texture;
};

export type VireoDevice = {
  group: THREE.Group;
  /** Sobreposição da tela acesa. Controle por material.opacity, 0 a 1. */
  screen: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  /** Brilho do LED do botão. Controle por material.opacity, 0 a 1. */
  led: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
};

/** Origem no centro do corpo. Não inclui os módulos. */
export function createVireoDevice(tex: DeviceTextures): VireoDevice {
  const group = new THREE.Group();
  const H = MODEL_ASPECT;

  // Trilhos: seção arredondada no plano XZ, extrudada ao longo de Y. É a peça que
  // define a silhueta em qualquer ângulo, por isso vai à profundidade cheia.
  const railGeo = slab(railSection(RAIL_W, DEPTH, 0.028, 0.011), H, 0.011);
  railGeo.rotateX(-Math.PI / 2);
  for (const sign of [-1, 1]) {
    const rail = new THREE.Mesh(railGeo, railMaterial());
    rail.position.set(sign * (0.5 - RAIL_W / 2), 0, 0);
    group.add(rail);
  }

  /*
   * Corpo, recuado dos trilhos. SEM recorte de encaixe: no produto montado a
   * junção com o módulo é uma linha fina, e a fenda do conector fica na superfície
   * de topo e de base, invisível de frente. Recortar a face deixava duas fileiras
   * de contatos dourados aparecendo por cima da arte com o módulo acoplado — os
   * contatos ficam na LÍNGUA do módulo, como no render explodido oficial.
   */
  const coreShape = roundedRect(FACE_W, H, 0.03);
  group.add(new THREE.Mesh(slab(coreShape, CORE_DEPTH, 0.007), darkMaterial()));

  const faceZ = CORE_DEPTH / 2 + 0.0015;

  const front = new THREE.Mesh(
    decal(coreShape, FACE_W, H),
    decalMaterial(tex.bodyFront),
  );
  front.position.z = faceZ;
  group.add(front);

  const back = new THREE.Mesh(
    decal(coreShape, FACE_W, H),
    decalMaterial(tex.bodyBack),
  );
  back.position.z = -faceZ;
  back.rotation.y = Math.PI;
  group.add(back);

  // Tela acesa: sobreposição na área medida. O render oficial tem a tela apagada,
  // então esta é a única parte da frente que não vem do render.
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(M.screen.w, M.screen.h),
    new THREE.MeshBasicMaterial({
      map: tex.screen,
      transparent: true,
      // ADITIVA, como o LED: a tela é luz. Com mistura normal, o preto da textura
      // — que vem de foto e nunca é preto perfeito — desenhava um retângulo mais
      // claro sobre o vidro. Somando, o fundo da tela simplesmente não soma nada e
      // só o traçado aparece.
      blending: THREE.AdditiveBlending,
      opacity: 0,
      toneMapped: false,
      depthWrite: false,
      // O decalque da face usa polygonOffset para não brigar com o corpo, o que
      // empurra a profundidade DELE para frente. Sem um offset maior aqui, a tela
      // acesa perdia o teste de profundidade contra a própria face e não aparecia.
      polygonOffset: true,
      polygonOffsetFactor: -6,
      polygonOffsetUnits: -6,
    }),
  );
  screen.position.set(0, M.screen.cy, faceZ + 0.004);
  screen.renderOrder = 2;
  group.add(screen);

  /*
   * LED do botão, em mistura ADITIVA sobre a arte. Aditivo e não normal: uma luz
   * soma brilho ao que está embaixo, ela não cobre. Com mistura normal o anel
   * apagava o desenho do botão em vez de acendê-lo.
   */
  const led = new THREE.Mesh(
    new THREE.PlaneGeometry(M.button.r * 3.3, M.button.r * 3.3),
    new THREE.MeshBasicMaterial({
      map: tex.led,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0,
      toneMapped: false,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -6,
      polygonOffsetUnits: -6,
    }),
  );
  led.position.set(0, M.button.cy, faceZ + 0.005);
  led.renderOrder = 3;
  group.add(led);

  return { group, screen, led };
}

// ------------------------------------------------------------------ módulos

export type ModuleKind = "air" | "cable" | "top";

export type VireoModule = {
  /**
   * Origem na borda que encosta no corpo: acoplar é posicionar o grupo em
   * ±MODEL_ASPECT/2, sem contas de meia-altura espalhadas pelo componente.
   */
  group: THREE.Group;
  /** Materiais que respondem ao esmaecimento na entrada e saída de cena. */
  fades: THREE.Material[];
  height: number;
};

export function createVireoModule(
  kind: ModuleKind,
  face: THREE.Texture,
  extra?: { dock?: THREE.Texture },
): VireoModule {
  const group = new THREE.Group();
  const fades: THREE.Material[] = [];
  const add = (mesh: THREE.Mesh) => {
    fades.push(mesh.material as THREE.Material);
    group.add(mesh);
  };

  // dir = +1 cresce para cima (módulo superior), -1 para baixo (inferior).
  const dir = kind === "top" ? 1 : -1;
  const h = kind === "top" ? MODULE_TOP_HEIGHT : MODULE_BOTTOM_HEIGHT;
  const rEnd = M.module.corner;
  const rNear = 0.008;

  /*
   * Casco em U: o metal envolve laterais e ponta, e o miolo é VAZADO. Com um
   * bloco maciço, a face escura ficava dentro do metal e o módulo aparecia todo
   * cromado. A aresta de metal do lado do corpo fica em 0,006 para o vazio não
   * tocar o contorno: um vazio encostado na borda quebra a triangulação.
   */
  const shell = roundedRect(
    1,
    h,
    dir === 1 ? rEnd : rNear,
    dir === 1 ? rNear : rEnd,
  );
  const holeH = h - 0.012;
  const hole = roundedRect(
    FACE_W,
    holeH,
    dir === 1 ? rEnd * 0.72 : rNear,
    dir === 1 ? rNear : rEnd * 0.72,
  );
  shell.holes.push(new THREE.Path(hole.getPoints(48).reverse()));
  add(new THREE.Mesh(slab(shell, DEPTH, 0.006), shellMaterial()));

  const coreShape = roundedRect(
    FACE_W - 0.004,
    holeH - 0.004,
    dir === 1 ? rEnd * 0.72 : rNear,
    dir === 1 ? rNear : rEnd * 0.72,
  );
  add(new THREE.Mesh(slab(coreShape, CORE_DEPTH, 0.007), darkMaterial()));

  const faceZ = CORE_DEPTH / 2 + 0.0015;
  for (const sign of [1, -1] as const) {
    const art = new THREE.Mesh(
      decal(coreShape, FACE_W, holeH),
      decalMaterial(face),
    );
    art.position.z = sign * faceZ;
    if (sign === -1) art.rotation.y = Math.PI;
    add(art);
  }

  // Língua do conector: entra no encaixe do aparelho.
  const tongue = M.module.tongue;
  const tongueMesh = new THREE.Mesh(
    slab(roundedRect(tongue.w, tongue.h, 0.012), DEPTH * 0.46, 0.006),
    darkMaterial(),
  );
  // A língua aponta para o CORPO, ou seja no sentido oposto ao crescimento do
  // bloco: -dir. Com +dir ela ficava pendurada para fora, com os contatos à
  // mostra o tempo todo.
  tongueMesh.position.y = -dir * (h / 2 + tongue.h / 2 - 0.012);
  add(tongueMesh);

  /*
   * Contatos na PONTA da língua, virados para o corpo. É onde eles estão no render
   * explodido oficial, e resolve dois problemas de uma vez: com o módulo acoplado
   * ficam dentro do aparelho, e com ele separado a câmera inclinada os mostra.
   * Nas faces da língua eles vazavam para cima da arte da frente.
   */
  if (extra?.dock) {
    const pads = new THREE.Mesh(
      new THREE.PlaneGeometry(tongue.w * 0.88, DEPTH * 0.36),
      new THREE.MeshBasicMaterial({ map: extra.dock, toneMapped: false }),
    );
    pads.rotation.x = (dir * Math.PI) / 2;
    pads.position.y = -dir * (h / 2 + tongue.h - 0.016);
    add(pads);
  }

  if (kind === "top") {
    // Alívio de tensão: tronco achatado que alarga ao descer até o módulo. Esta
    // peça É rígida no produto — é o plástico que segura o feixe.
    const st = M.harness.strain;
    const strain = new THREE.Mesh(
      new THREE.CylinderGeometry(st.wTop / 2, st.wBottom / 2, st.h, 36, 1),
      cableMaterial(),
    );
    strain.scale.z = (DEPTH * 0.78) / st.wBottom;
    strain.position.y = h / 2 + st.h / 2 - 0.004;
    add(strain);

    /*
     * Feixe de 12 derivações: DOZE CABOS, cada um um tubo ao longo da própria
     * curva. Antes era uma caixa reta com as estrias pintadas por cima, e o
     * resultado lia como uma peça rígida saindo do aparelho — o oposto do que é.
     * Cabos separados, um pouco mais abertos e mais curvos quanto mais externos,
     * dão a maleabilidade sem depender de textura nenhuma.
     */
    const leads = 12;
    const width = M.harness.cableW;
    const radius = width / leads / 2;
    const base = h / 2 + st.h - 0.01;
    for (let i = 0; i < leads; i++) {
      // -1 a 1 no eixo do feixe. Serve de posição e de intensidade da curva.
      const u = (i / (leads - 1)) * 2 - 1;
      const x = (u * (width - radius * 2)) / 2;
      /*
       * Os cabos saem JUNTOS do alívio de tensão e abrem subindo — é o que a peça
       * de plástico faz: aperta o feixe na saída. Começar já espalhados na largura
       * cheia dava a impressão de um pente rígido preso ao aparelho.
       *
       * A pequena contracurva no meio é o que tira a leitura de arco desenhado a
       * compasso: cabo de verdade não descreve um arco perfeito.
       */
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x * 0.78, base - 0.03, u * 0.004),
        new THREE.Vector3(x * 0.9, base + 0.1, u * 0.014),
        new THREE.Vector3(x * 1.05 + 0.03, base + 0.23, u * 0.032),
        new THREE.Vector3(x * 1.14 + 0.11, base + 0.35, u * 0.05),
        new THREE.Vector3(x * 1.28 + 0.26, base + 0.47, u * 0.062),
        new THREE.Vector3(x * 1.4 + 0.46, base + 0.56, u * 0.07),
      ]);
      const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 28, radius, 10, false),
        cableMaterial(),
      );
      add(mesh);
    }
  }

  if (kind === "cable") {
    const lead = M.lead;
    const cone = new THREE.Mesh(
      new THREE.CylinderGeometry(lead.coneTop, lead.coneBottom, lead.h, 36, 1),
      cableMaterial(),
    );
    cone.position.y = -h / 2 - lead.h / 2 + 0.01;
    add(cone);
  }

  /*
   * Origem na borda que ENCOSTA no corpo, e não no centro do bloco: acoplar passa
   * a ser posicionar o grupo em ±MODEL_ASPECT/2, sem contas de meia-altura
   * espalhadas pelo componente. O sinal é +dir: para o módulo de cima o bloco tem
   * de crescer para cima a partir da origem, e para o de baixo, para baixo.
   */
  for (const child of group.children) child.position.y += dir * (h / 2);

  return { group, fades, height: h };
}
