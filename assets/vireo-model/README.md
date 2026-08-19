# Modelo 3D do VIREO AM

`vireo-am.glb` — modelo glTF binário do conjunto montado (corpo, módulo superior
de 12 derivações e módulo inferior). Abre em Blender, Keyshot, Preview do macOS ou
qualquer visor glTF.

## Como foi construído

A divisão de trabalho é a decisão central do modelo:

| parte | origem |
| --- | --- |
| casco, trilhos, língua do conector, alívio de tensão, feixe, cabo | **geometria**, com proporções medidas nos renders |
| arte de cada face (wordmarks, botão, badge Air, etiqueta traseira) | **textura**, recortada dos renders oficiais |
| tela acesa e contatos do conector | canvas desenhado em código, paciente sintético |

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
3. **Esta.** Alumínio fosco calibrado contra o render, três blocos, e espessura
   medida em vez de estimada.

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
