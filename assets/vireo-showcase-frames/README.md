# Frames do showcase do VIREO AM (não usados)

Sequência de 106 frames gerada para uma seção de showcase controlada por rolagem
que foi **revertida** em 2026-08-19, por qualidade insuficiente: a etapa de
rotação era uma compressão horizontal entre três ângulos reais (frente, 3/4,
traseira), o que lê como um cartão girando e não como um produto girando, e o
conteúdo da tela era uma foto recortada esticada sobre o render.

Ficam aqui, fora de `public/`, porque não são servidos, mas o trabalho de
extração continua útil.

## O que há aqui

| Pasta | Conteúdo |
|---|---|
| `desktop/` | 106 frames 1000x1250 WebP, ~14 KB cada, mais `manifest.json` |
| `mobile/` | 106 frames 620x775 WebP, ~8 KB cada, mais `manifest.json` |

## De onde os pixels vêm

Todo pixel do produto é render CAD **oficial**, extraído de
`assets/device-source/VIREO-AM-renders-1.pdf` (5 páginas, 92 imagens embutidas) e
recortado para `assets/vireo-layers/` por `scripts/cutout-device.py`. Nada foi
gerado por IA. `scripts/build-vireo-frames.py` compõe e move essas camadas.

## O que faltaria para um showcase de verdade

Os renders oficiais têm frente, traseira e 3/4, mas **não têm as laterais em 90
graus**. Uma rotação convincente precisa de um export de turntable do CAD, ou do
próprio modelo, vindo da Cardioline. Preencher os ângulos que faltam com geração
de imagem não resolve: um gerador texto-para-imagem devolve um aparelho diferente
por chamada, e a sequência deixa de parecer um único produto.
