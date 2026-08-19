# Modelo 3D do VIREO AM

`vireo-am.glb` — modelo glTF binário (13 malhas, 4 texturas embutidas). Abre em
Blender, Keyshot, Preview do macOS ou qualquer visor glTF.

## Como foi construído

A divisão de trabalho é a decisão central do modelo:

| parte | origem |
| --- | --- |
| casco, trilhos, encaixe, língua do conector, cabo | **geometria**, com proporções medidas nos renders oficiais |
| arte de cada face (wordmarks, botão, badge Air, etiqueta traseira) | **textura**, recortada dos renders oficiais |
| tela acesa | canvas desenhado em código, paciente sintético |

1. `scripts/measure-vireo.py` mede os renders de `assets/vireo-layers/` (recortes
   do PDF CAD oficial) e grava `lib/v2/vireo-metrics.json`: proporção do corpo,
   largura dos trilhos, retângulo da tela, geometria do módulo e do cabo. O mesmo
   script recorta as faces para `public/device/model/face-*.png`.
2. `components/v2/vireo3d/model.ts` constrói a geometria a partir dessas medidas.

Nada aqui é chute: cada número sai de uma varredura de pixels nos renders, e a
normalização é sempre pela largura do corpo. Os renders têm escalas diferentes em
pixels (frente 550 px de largura de corpo, traseira 421), então cada um é
normalizado pelo próprio bbox — normalizar tudo pela frente esticava a traseira
em 30%.

## A tentativa anterior, e por que foi trocada

A primeira versão extrudava a silhueta traçada inteira e colava os renders na
frente e na traseira. De frente convencia; girando, virava papelão. Os trilhos
metálicos são o que dá volume ao produto e, como pintura numa face chata,
desapareciam a 90°: o perfil ficava uma barra cinza sem gráfico nenhum.

Com os trilhos em geometria e material anisotrópico, a luz faz o trabalho e a
volta completa lê como um objeto só — que é o critério de qualidade que importa.

## Limites conhecidos

- **Profundidade estimada.** `metrics.depth` (0,33 largura de corpo) vem da
  espessura aparente no render em três quartos. Os renders oficiais não incluem
  vista lateral a 90°, então a espessura exata precisaria do CAD da Cardioline.
- **Sem filetes compostos nem portas laterais.** O CAD tem detalhes de lateral que
  nenhum render disponível mostra.
- **Traseira do módulo espelhada da frente.** Não existe render da traseira do
  módulo; espelhar é mais honesto que inventar uma face.

## Como regerar

```bash
python3 scripts/measure-vireo.py     # mede e recorta as faces
# abra /lab/vireo e no console:
await window.exportVireoGlb()        # devolve o .glb em base64
```
