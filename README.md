# Cardioline 2028 — Product Vision

Apresentação executiva de visão de produto, em HTML, navegável como slides.
**Não é material institucional da Cardioline, não é oferta comercial e não tem
backend.** Todos os pacientes, exames, medidas e traçados são sintéticos.

```
/vision   os 22 slides
/anchor   landing enxuta do Anchor (embutida no slide 14)
```

## Rodar

```bash
pnpm install
pnpm dev            # http://localhost:3000/vision
pnpm build && pnpm start
pnpm test           # lógica pura (Vitest)
pnpm lint
pnpm build && pnpm verify   # harness visual (Puppeteer)
```

Na apresentação: `←` `→` navegam, `F` entra em fullscreen, `G` abre o mapa dos
22 slides, `R` reinicia no slide 1, `Home`/`End` vão às pontas, e `#14` na URL
abre direto num slide.

## Identidade: o que veio de fonte oficial

Nenhum valor foi estimado. Todos foram extraídos de `cardioline.com`.

| Token | Valor | Origem |
|---|---|---|
| `--cl-orange` | `#F66201` | pixels do PNG do wordmark oficial |
| `--cl-orange-ui` | `#EE5B00` | `--primary_color` do tema do site |
| `--cl-ink` | `#071046` | `--awb-color6`, a cor dos H1/H2 do site |
| `--cl-ink-deep` | `#040A2A` | `--awb-custom_color_1`, fundo dos slides escuros |
| `--cl-tint` | `#FDEBE0` | `--awb-color4` |
| Tipografia | **Inter** | `--awb-typography1..N` |

O briefing sugeria `#F36C21`; o laranja real do logo é `#F66201` — mais saturado
e mais vermelho.

### Três papéis para o laranja

`#F66201` tem 3,19:1 sobre branco: passa como elemento gráfico (WCAG pede 3:1),
reprova como texto (4,5:1). Mesma matiz e saturação, muda só o valor:

- `--cl-orange` `#F66201` — grafismo: traçados, filetes, pontos, grid, réguas
- `--cl-orange-strong` `#CA5001` — superfície preenchida com texto branco
- `--cl-orange-ink` `#B84A01` — laranja como texto sobre fundo claro (5,26:1)

Convenção compartilhada com o protótipo irmão em `../../cardioline-anchor`, para
os dois materiais não se contradizerem quando mostrados na mesma reunião.

### Logo

`public/brand/*.svg` foram produzidos **vetorizando os PNGs oficiais** — o site
não distribui SVG. O logo não foi redesenhado nem remontado com texto.

`scripts/trace-brand.py` é reproduzível. Duas armadilhas resolvidas por medição,
não por palpite: o potracer preenche onde a máscara é **falsa** (traçar
`alpha > 128` produz o negativo, IoU 0,0002), e o limiar 100 saiu de varredura
(60→0,94 · 100→**0,99** · 128→0,95 · 160→0,94). O harness mede IoU contra os
PNGs originais e exige ≥ 0,99.

## Arquitetura

Uma decisão explica quase tudo: **cada slide é desenhado num canvas fixo de
1600×900 e escalado por `transform`.** Se o conteúdo coube ali, cabe em qualquer
tela — overflow vira impossível por construção, e verificar uma vez vale para
todas as resoluções.

A escala é CSS puro: `tan(atan2(100vw, 1600px))` devolve a razão sem unidade que
`scale()` precisa. Sem JS, sem flash na hidratação, reage a resize sozinho. Há
fallback em JS para browsers sem suporte.

```
app/
  vision/     o deck            anchor/     a landing
components/
  deck/       Deck · Slide · Stage · Reveal · ProgressRail · GridOverview
  slides/     S01…S22
  brand/      Logo · Symbol · AnchorWordmark
  primitives/ Display · Kicker · Lede · Caption · Flow · Rule
  product/    ExamViewer · PatientTimeline · ClinicalInsight · RiskTrend
              ExamComparison · ReportComposer · DeviceSync · EcgTrace · Frames
lib/          ecg.ts · synthetic.ts · slides.ts · contrast.ts
styles/       tokens.css      scripts/    verify-slides.mjs · trace-brand.py
```

Reservado e ainda não implementado: `anchor/app`, `anchor/patient/[id]`,
`anchor/exam/[id]`, `enterprise`.

### ECG sintético

`lib/ecg.ts` emite polilinha a partir dos pontos de controle da batida
(P-QRS-T), que é como um eletrocardiógrafo real desenha: path curto e com os
ângulos vivos do traçado clínico, em vez de curva suavizada que pareceria
decorativa. PRNG mulberry32 semeado — **nenhum `Math.random()` em render**, que
quebraria a hidratação e deixaria o desenho animado instável.

O grid do visualizador é laranja porque é a cor do papel térmico impresso pelos
próprios eletrocardiógrafos Cardioline.

### Navegação

O tween de scroll é próprio, em `requestAnimationFrame`. Medido: sob
`scroll-snap` mandatório o Chrome **cancela** um smooth scroll re-alvejado antes
de terminar — com setas a cada 120 ms, 21 avanços paravam no slide 20 em vez do
22. O tween próprio continua da posição atual em vez de disputar com o anterior.
Salto longo é instantâneo: animar 19 slides mostraria a apresentação num borrão.

## Verificação

`pnpm verify` sobe o build e falha o processo em qualquer violação. Ele foi
verificado por injeção de violações propositais — um harness que nunca falhou
não é evidência de nada.

| Checagem | O que pega |
|---|---|
| Overflow da stage | conteúdo além de 1600×900 |
| Transbordo de caixa | o que vaza para **cima**, que `scrollHeight` não vê |
| Sobreposição de texto | dois blocos ocupando o mesmo lugar dentro da stage |
| Tamanho de fonte | qualquer texto abaixo de 16 px |
| Contraste | AA por tamanho, mais a regra de laranja da marca |
| Viewports | 1920×1080, 1600×900, 1440×900: escala e centralização |
| Teclado | 21 setas chegam em `#22`; `Home` volta; `#14` abre no 14 |
| Restart | `R` recarrega e volta ao slide 1, com o scroll em zero |
| Overview | `G` abre 22 tiles, `Esc` fecha |
| Reduced motion | conteúdo visível sem animar, sem colisão |
| Marca | IoU dos SVGs contra os PNGs oficiais |
| Screenshots | os 22 slides em `artifacts/slides/` |

Camadas deliberadamente sobrepostas se declaram com `data-layer`, para o
detector de colisão ter um escape hatch explícito em vez de uma regra frouxa.

Fullscreen (`F`) exige gesto do usuário e não roda em headless — foi testado à
mão no Chrome.

## Escopo da narrativa

O horizonte é **2028**. A apresentação não usa linha do tempo datada em nenhum
slide, e não cita Holter nem ABPM.

Um ponto de tese que o material não pode inverter: a Cardioline **sempre** fez
hardware e software. O que muda em 2028 não é passar a fazer software, é para
quem ele é feito — daí o eixo do slide 03 ser "software para o aparelho →
para o exame → para o cardiologista", e não "ganhar software".

## Fronteira comercial

Tudo que a plataforma já entrega hoje permanece no **Anchor Free**. Nenhum
recurso existente foi movido para trás de um pagamento: o Enterprise se
diferencia por escala, administração centralizada, governança e serviço, nunca
por bloqueio. Vale para o slide 13 e para `/anchor`.

Sobre IA, a linguagem é sempre de observação — *surfaced for review*, *flagged
for your attention*. Em nenhum ponto se promete diagnóstico automático ou
substituição do cardiologista. Os slides 16 e 17 carregam a ressalva
`Conceptual — not a clinical claim` na própria tela.
