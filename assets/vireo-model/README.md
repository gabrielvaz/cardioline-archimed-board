# Modelo 3D do VIREO AM

`vireo-am.glb` — modelo glTF binário, com geometria e texturas embutidas. Abre em
Blender, Keyshot, macOS Preview, ou qualquer visor glTF.

## Como foi construído

Não é modelagem com primitivas. É **extrusão da silhueta real**:

1. `scripts/trace-outline.py` traça o contorno do render ortográfico frontal
   oficial (marching squares sub-pixel no canal alpha em iso 0.5, depois
   Douglas-Peucker). Resultado em `lib/v2/vireo-outline.json`, 45 pontos.
2. `components/v2/vireo3d/model.ts` extruda esse contorno com chanfro e aplica os
   renders oficiais de frente e traseira como textura nas duas faces.

Portanto **o perfil do produto e as duas faces são o produto real**. O que o
modelo inventa é apenas a lateral da extrusão.

Por que não modelar com caixas arredondadas: o aparelho tem filetes compostos,
trilhos metálicos com perfil próprio e chanfros no vidro. Aproximar isso com
primitivas produz um brinquedo e erra a silhueta.

## Detalhe que importa nos materiais

As faces usam material **não iluminado** (`MeshBasicMaterial`). As texturas são
renders de estúdio e já trazem key, fill e especular embutidos; aplicar PBR e
luzes por cima ilumina duas vezes, lava o preto do vidro e produz estouros
especulares sobre a arte. A luz da cena serve apenas à lateral extrudada, que é a
única parte sem informação de sombreamento.

## O que ainda é aproximação

| Parte | Estado |
|---|---|
| silhueta | contorno traçado do render oficial |
| face frontal | render oficial, pixel a pixel |
| face traseira | render oficial, pixel a pixel |
| lateral | extrusão com chanfro, cor amostrada da carcaça |
| profundidade | 0,22 da largura, estimada no render 3/4 |
| trilhos metálicos, costuras, portas laterais | **não modelados** |

Para chegar a fidelidade de CAD seria preciso o modelo original da Cardioline. O
que existe aqui já entrega um turntable de 360 graus em que frente, 3/4 e traseira
são o produto real.

## Ver no navegador

`/lab/vireo` renderiza uma folha de contato em doze ângulos, com um único
contexto WebGL (um renderer por ângulo esgota o limite de contextos do
navegador). A mesma página expõe `window.exportVireoGlb()`, que gera este
arquivo.
