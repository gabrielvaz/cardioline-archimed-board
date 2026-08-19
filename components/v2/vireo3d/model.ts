import * as THREE from "three";
import outline from "@/lib/v2/vireo-outline.json";

/**
 * Modelo 3D do VIREO AM.
 *
 * A silhueta NÃO é desenhada com primitivas: é o contorno traçado do render
 * ortográfico oficial (scripts/trace-outline.py, marching squares sub-pixel no
 * canal alpha), extrudado em profundidade. Frente e traseira recebem os próprios
 * renders oficiais como textura. Portanto o perfil do produto e as duas faces são
 * o produto real; o que o modelo inventa é apenas a lateral da extrusão.
 *
 * Por que não modelar com caixas arredondadas: o aparelho tem filetes compostos,
 * trilhos metálicos com perfil próprio e chanfros no vidro. Aproximar isso com
 * primitivas produz um brinquedo, e a silhueta sairia errada. Extrudar o contorno
 * real garante que o recorte do produto esteja exato em qualquer ângulo.
 */

export type VireoModelOptions = {
  /** Profundidade como fração da largura. Medida no render 3/4 oficial. */
  depth?: number;
  /** Raio do chanfro nas bordas, fração da largura. */
  bevel?: number;
};

const POINTS = outline.points as [number, number][];

/** Contorno traçado do render, como Shape do Three. */
function buildShape(): THREE.Shape {
  const shape = new THREE.Shape();
  POINTS.forEach(([x, y], i) => {
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

/** Remapeia UV para a caixa da silhueta, para a textura cair alinhada à face. */
function boxUv(geometry: THREE.BufferGeometry): void {
  geometry.computeBoundingBox();
  const bb = geometry.boundingBox;
  if (!bb) return;
  const w = bb.max.x - bb.min.x;
  const h = bb.max.y - bb.min.y;
  const pos = geometry.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i += 1) {
    uv[i * 2] = (pos.getX(i) - bb.min.x) / w;
    uv[i * 2 + 1] = (pos.getY(i) - bb.min.y) / h;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}

export function createVireoModel(
  textures: { front: THREE.Texture; back: THREE.Texture },
  options: VireoModelOptions = {},
): THREE.Group {
  const depth = options.depth ?? 0.22;
  const bevel = options.bevel ?? 0.012;
  const shape = buildShape();

  const group = new THREE.Group();

  // Corpo extrudado. O chanfro dá a quebra de luz da borda real do produto.
  const body = new THREE.ExtrudeGeometry(shape, {
    depth: depth - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 12,
  });
  body.translate(0, 0, -(depth - bevel * 2) / 2);

  const shell = new THREE.MeshPhysicalMaterial({
    color: 0xdcdee2,
    metalness: 0.22,
    roughness: 0.42,
    clearcoat: 0.35,
    clearcoatRoughness: 0.3,
  });
  group.add(new THREE.Mesh(body, shell));

  // Faces com os renders reais, levemente à frente do corpo para não haver
  // z-fighting com as tampas da extrusão.
  const faceOffset = depth / 2 + bevel * 0.6;

  const frontGeo = new THREE.ShapeGeometry(shape, 12);
  boxUv(frontGeo);
  /*
   * Material NÃO iluminado nas faces. As texturas são renders de estúdio: já
   * trazem key, fill e especular embutidos. Aplicar PBR e luzes por cima
   * ilumina duas vezes, o que lava o preto do vidro e produz estouros
   * especulares sobre a arte. Basic entrega o render oficial exatamente como
   * ele é; a luz da cena fica para a lateral extrudada, que é a parte sem
   * informação de sombreamento.
   */
  const frontMesh = new THREE.Mesh(
    frontGeo,
    new THREE.MeshBasicMaterial({
      map: textures.front,
      transparent: true,
      toneMapped: false,
    }),
  );
  frontMesh.position.z = faceOffset;
  group.add(frontMesh);

  const backGeo = new THREE.ShapeGeometry(shape, 12);
  boxUv(backGeo);
  const backMesh = new THREE.Mesh(
    backGeo,
    new THREE.MeshBasicMaterial({
      map: textures.back,
      transparent: true,
      toneMapped: false,
    }),
  );
  // Espelha em X ao virar, senão a traseira sai invertida.
  backMesh.rotation.y = Math.PI;
  backMesh.position.z = -faceOffset;
  group.add(backMesh);

  return group;
}

export const MODEL_ASPECT = outline.aspect as number;
