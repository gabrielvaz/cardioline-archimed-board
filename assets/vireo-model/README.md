# Modelo 3D do VIREO AM

`vireo-am.glb` — modelo glTF binário do conjunto montado (corpo, módulo superior
de 12 derivações e módulo inferior). Abre em Blender, Keyshot, Preview do macOS ou
qualquer visor glTF.

## Como foi construído

A divisão de trabalho é a decisão central do modelo:

| parte | origem |
| --- | --- |
| casco, trilhos, língua do conector, alívio de tensão, feixe, cabo | **geometria**, com proporções medidas nos renders |
| arte de cada face (wordmarks, botão, badge Air, etiqueta traseira) | **textura**, recortada dos renders oficiais e gradada às cores das fotos |
| tela em uso (tórax com eletrodos C1 a C6) | **foto retificada** (`scripts/extract-screen.py`) |
| LED do botão e contatos do conector | canvas desenhado em código, porque são LUZ e precisam ser controláveis |

## O que é luz não é pintura

Duas coisas no aparelho **acendem**, e por isso não podem ser textura chapada:

- **A tela.** Nenhum render CAD a tem ligada. A única fonte é a foto, então a arte
  é uma retificação de perspectiva de `2A1A7BDC…jpeg` para a proporção medida da
  tela, com piso de preto, ganho e vinheta nas bordas — a tela do produto não tem
  moldura, ela se funde ao vidro, e sem a vinheta o retângulo da textura aparecia
  desenhado na face.
- **O LED do botão.** O anel verde e azul vem pintado no render. O
  `measure-vireo.py` o **apaga** na arte base (`dim_led`) e uma sobreposição em
  mistura ADITIVA o acende. Aditiva e não normal: uma luz soma brilho ao que está
  embaixo, não cobre. E apagar na base era necessário — com o anel aceso na
  textura, não havia como mostrar o aparelho desmontado com a luz apagada.

## Cor: renders para a forma, FOTOS para a cor

Os renders CAD são cinza técnico uniforme. O produto tem três materiais bem
diferentes, e usar um só era o que deixava o 3D com cara de maquete. Agrupando as
cores das fotos em `assets/device-source/` por k-means, os aglomerados neutros
aparecem nos mesmos lugares nas três fotos:

| peça | luminância nas fotos | no modelo |
| --- | --- | --- |
| face | 46 a 58 | vidro preto, albedo em ~15 |
| meio-tom / sombra | 74 a 88 | — |
| trilho do corpo | ~134 | cinza médio semi-brilhante |
| casco dos módulos e cabo | 211 a 215 | branco fosco |

O `measure-vireo.py` grada os recortes com uma curva por luminância que leva os
NEUTROS do render a esses alvos e **preserva os pixels saturados** — sem a ressalva
de croma, o laranja do wordmark e os arcos verde e azul do botão iam junto e o
produto perdia a marca.

O ambiente de estúdio é **escuro com faixas estreitas de luz**, e a luz difusa do
casco branco vem de três direcionais. Com ambiente claro em todas as direções, o
verniz da face espelhava branco por igual e o vidro preto virava cinza chapado. A
radiância das faixas também importa: com faixas de radiância 15 o especular somava
0,37 em linear sobre a face e o preto renderizava em 164 de 255, com a arte inteira
sob um véu. A mesma face com material não iluminado dá 14 — o teste que provou que
o problema era luz, e não textura.

Pipeline, reprodutível de ponta a ponta:

```bash
python3 scripts/extract-vireo-renders.py   # 85 renders JPEG embutidos no PDF oficial
python3 scripts/measure-vireo.py           # mede tudo e recorta as faces
```

O measure grava `lib/v2/vireo-metrics.json`, que o modelo lê. Nada é chutado: cada
número sai de uma varredura de pixels nos renders, normalizada pela largura do
corpo. Renders diferentes saem do PDF em escalas diferentes (a frontal com 554 px
de largura de corpo, a traseira com 421), então cada um é normalizado pelo próprio
bbox.

## O aparelho tem três blocos

Módulo superior (feixe de 12 derivações) + corpo + módulo inferior (Air ou cabo de
paciente). A vista frontal isolada engana: o que ela mostra como abas cinzas nas
pontas são os **encaixes vazios**. O corpo sozinho tem aspecto 1,478 — não 1,556,
que é o que se mede incluindo os encaixes.

## Três tentativas, e o que cada uma ensinou

1. **Extrusão da silhueta com o render colado nas duas faces.** De frente
   convencia; girando, virava papelão. Os trilhos metálicos são volume, não
   pintura, e a 90° desapareciam.
2. **Geometria com metal muito espelhado e anisotrópico.** Lia como brinquedo
   cromado. O produto real é alumínio claro **fosco**, com reflexo largo e uma
   linha de junção no meio do perfil — que existe e aparece na vista lateral
   oficial.
3. **Alumínio fosco calibrado contra o render**, três blocos, espessura medida.
   Melhor, mas ainda a paleta do render técnico: tudo cinza claro.
4. **Esta.** Cor medida nas FOTOS: casco branco, trilho cinza médio, face de vidro
   preto. Ambiente escuro com faixas, para o preto refletir faixa e não branco.

## Duas armadilhas geométricas que custaram uma rodada cada

- **Raio de canto maior que a meia-altura da caixa.** O raio de ponta do módulo é
  0,23 medido no render, contra 0,199 de meia-altura de bloco. Os dois filetes do
  mesmo lado se cruzavam, o contorno passava a ter autointerseção e a extrusão
  devolvia faces enormes atravessando o produto. Daí a função `fitRadius`.
- **Origem do módulo na borda errada.** O deslocamento tem de ser `+dir·h/2`, e a
  língua aponta para `-dir`: com os sinais trocados os módulos invadiam o corpo e a
  língua ficava pendurada para fora, com os contatos à mostra o tempo todo.

## Limites conhecidos

- **Sem os conectores em leque do módulo de 12 derivações.** O render explodido
  mostra dez conectores individuais com terminais; o feixe aqui é o bloco estriado
  que a vista frontal oficial mostra.
- **Sem os filetes compostos e as portas laterais do CAD.**
- **Traseira dos módulos espelhada da frente.** Não existe render dela; espelhar é
  mais honesto que inventar uma face.

## Como regerar o .glb

```bash
# abra /lab/vireo e no console:
await window.exportVireoGlb()   # devolve o .glb em base64
```
