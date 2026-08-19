# Cardioline Vision 2028

Materiais de visão de produto sobre uma única tese:

> O dispositivo é a **porta de entrada** de uma relação contínua com o software,
> e não a conclusão da venda.

Protótipo de Product Design para discussão interna. **Não é material oficial da
Cardioline e não constitui oferta comercial.** Preços são ilustrativos. Todo
paciente, exame, medida e traçado de ECG mostrado é sintético.

## Rodar

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm lint
pnpm test       # vitest
pnpm verify     # harness Puppeteer do deck
```

## Rotas

Um único app Next.js hospeda todos os materiais, para que a navegação entre eles
seja instantânea numa reunião. Cada versão da landing continua viva na `main` em
vez de ser sobrescrita, para que a evolução do argumento seja demonstrável.

| Rota         | O que é                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `/`          | Home: escolher o fluxo — apresentação, site, mockup do dispositivo, produto |
| `/vision`    | O deck de 22 slides                                                         |
| `/anchor`    | Tela do workspace usada como apoio no deck                                  |
| `/v2`        | Landing atual: o VIREO AM em 3D se desmonta e remonta com a rolagem         |
| `/v1`        | Landing anterior: reverência ao produto, uma ideia por viewport             |
| `/v0`        | Primeiro rascunho, guardado como base de comparação                         |
| `/showcase`  | A transformação do VIREO AM isolada da landing                              |
| `/lab/vireo` | Folha de contato do modelo 3D: ferramenta de conferência, não apresentação  |

A home agrupa por **fluxo** e não por lista corrida, porque é assim que a escolha se
apresenta numa reunião: primeiro se decide o que mostrar, e só depois qual versão.

## A v2

O software em primeiro plano, em perspectiva, e a rolagem montando a composição.

**Coreografia.** GSAP na página inteira, com a rolagem como parâmetro (`scrub`):

- o workspace parte inclinado em 3D e se endireita até encarar o leitor;
- o telefone entra depois, quando já há o que ler nele;
- o **VIREO AM em 3D** ocupa uma seção fixada e se desmonta e remonta ao longo dela;
- cada seção revela os próprios blocos em sequência ao entrar no viewport.

O estado **inicial** vive em CSS, não em JS, para que servidor e cliente rendam a
mesma coisa e não haja divergência de hidratação; o GSAP assume a partir dali. Sob
`prefers-reduced-motion` a composição aparece montada e nada fixa.

### A seção do aparelho

Cinco etapas conduzidas pela rolagem, reversíveis nos dois sentidos: repouso,
separação do módulo de cabo, giro de 360°, encaixe do módulo Air, e a tela acendendo.
O roteiro inteiro mora em `components/v2/vireo3d/stages.ts` — mudar duração de etapa,
número de voltas, curso do módulo ou distância total de rolagem é mudar um número.

Dois detalhes que só funcionam por serem tratados como o que são:

- **o LED do botão é luz.** O anel verde e azul vem apagado na textura e uma
  sobreposição em mistura aditiva o acende. Ele **pisca no tempo**, não na rolagem,
  porque um LED pisca mesmo com o dedo parado — há um laço de quadro que vive só
  durante o pisca;
- **o módulo desacoplado sai de cena.** Ele desce e deixa o quadro em vez de
  esmaecer: um módulo que alguém tirou da mão sai da mão, não fica transparente.

**Ordem dos triggers.** A cena 3D carrega texturas antes de existir, então o pin
nasce depois dos outros triggers da página, e todos ficariam com as posições de antes
do pin-spacer entrar no documento. Um `ScrollTrigger.refresh()` logo após criar o pin
resolve; sem ele a landing inteira dispara no lugar errado.

## Modelo 3D do VIREO AM

`assets/vireo-model/vireo-am.glb` (glTF binário com texturas embutidas) e o modelo
como código em `components/v2/vireo3d/`. Conferência em vários ângulos em
`/lab/vireo`, transformação isolada em `/showcase`, e na landing em `/v2`.

**Pipeline reprodutível de ponta a ponta:**

```bash
python3 scripts/extract-vireo-renders.py   # 85 renders JPEG embutidos no PDF oficial
python3 scripts/measure-vireo.py           # mede tudo e recorta as faces
python3 scripts/extract-screen.py          # retifica a tela em uso a partir de foto
```

A divisão de trabalho é a decisão central: **geometria** para casco, trilhos,
encaixes, língua do conector, feixe de derivações e cabo, com proporções medidas nos
renders; **textura** só para a arte das faces; **canvas** para o que é luz.

Nada é chutado — cada número sai de uma varredura de pixels, normalizada pela largura
do corpo. Detalhes e limites em `assets/vireo-model/README.md`.

Cinco aprendizados que valem registro:

**Abra o arquivo inteiro.** O PDF oficial tem 85 renders; eu trabalhei um bom tempo
com seis recortes feitos à mão. A vista lateral, que dá a espessura exata, e o
conjunto completo, que mostra o módulo superior, estavam lá desde o começo.

**Forma vem do render, cor vem da FOTO.** Os renders CAD são cinza técnico uniforme.
O produto tem casco branco, trilho cinza médio e face de vidro preto — três materiais
bem diferentes, e usar um só era o que deixava o 3D com cara de maquete.

**Vidro preto precisa de ambiente com contraste.** Com ambiente claro em todas as
direções, o verniz espelha branco por igual e o preto vira cinza chapado. Ambiente
escuro com faixas estreitas, e a luz difusa do casco vindo de direcionais.

**Uma rugosidade por peça denuncia o CG.** Superfície perfeita demais. Mapas
procedurais de grão, escovado e verniz, mais sombra própria, é o que faz as peças
parecerem encostadas umas nas outras.

**Um renderer WebGL por instância esgota os contextos do navegador.** O limite fica
por volta de 8 a 16. A folha de contato usa um renderer só, renderizando em sequência
e copiando cada quadro para um canvas 2D.

### Duas armadilhas geométricas

**Raio de canto maior que a meia-altura da caixa** autointersecciona o contorno e a
extrusão devolve faces enormes atravessando o produto. O raio de ponta do módulo é
0,23 medido contra 0,199 de meia-altura de bloco — daí a função `fitRadius`.

**A origem do módulo** tem de ser `+dir·h/2`, com a língua em `-dir`. Com os sinais
trocados os módulos invadem o corpo e a língua fica pendurada para fora.

### O showcase por sequência de frames, revertido

Uma versão anterior montava a rotação como sequência de imagens e foi **revertida**
por qualidade insuficiente. O problema não era a engenharia — canvas, pin, scrub e
reversibilidade funcionavam e estavam medidos —, era o material: os renders oficiais
não têm as laterais em 90 graus, e a rotação acabou sendo uma compressão horizontal
entre três ângulos. Isso lê como um cartão girando, não como um produto girando.

Os frames ficaram preservados em `assets/vireo-showcase-frames/`, fora de `public/`,
com um README explicando a procedência. O compositor e os recortes manuais que ele
consumia foram removidos junto com a abordagem — estão no histórico do git.

## Publicar no GitHub Pages

O build é **export estático** (`output: "export"`), sem nada de servidor. As onze
rotas são prerenderizadas.

```bash
pnpm build                                   # out/ na raiz do site
NEXT_PUBLIC_BASE_PATH=/cardioline-vision-2028 pnpm build   # como o Pages serve
```

O workflow é `.github/workflows/pages.yml` e tem **disparo manual apenas**
(`workflow_dispatch`). Enquanto o protótipo não deve ficar público, um push na `main`
não pode publicar sozinho.

Para colocar no ar, duas coisas — e as duas são deliberadas:

1. em **Settings > Pages**, escolher `GitHub Actions` como Source;
2. rodar o workflow **Pages** manualmente (aba Actions).

Só o workflow não põe nada no ar: sem o passo 1 o job termina em verde e o site
continua indisponível.

Para publicação automática a cada push, acrescentar ao workflow:

```yaml
on:
  push:
    branches: [main]
```

### O prefixo de caminho, e por que ele quebra coisas

O Pages serve o projeto em `/<repositório>/`. O Next prefixa sozinho o que passa por
ele, mas **não** o que o código monta à mão. Daí `lib/asset.ts`, que precisa envolver:

- o `loadAsync` das texturas 3D;
- o `href` de um `<image>` dentro de SVG e o `src` de um iframe;
- **todo `src` de `next/image`** — com `unoptimized: true`, exigido pelo export
  estático, o Next usa o `src` como veio e o prefixo não entra. Sem isso, toda imagem
  do site dá 404 no ambiente publicado e em nenhum outro.

A função é idempotente de propósito: aplicar o prefixo numa prop de componente
próprio, que depois aplica de novo internamente, já produziu caminhos com o prefixo
duplicado. O prefixo vai **uma vez**, onde a URL vira atributo do DOM.

Isso só aparece testando o export servido em subcaminho, não em `pnpm dev`:

```bash
pnpm build   # com NEXT_PUBLIC_BASE_PATH
mkdir -p /tmp/pages && ln -s "$PWD/out" /tmp/pages/cardioline-vision-2028
cd /tmp/pages && python3 -m http.server 4399
# abrir http://localhost:4399/cardioline-vision-2028/
```

Também há um `public/.nojekyll`: sem ele o Pages ignora `_next/`, que começa com
underscore, e o site sai sem nenhum script nem estilo.

## Três mundos de CSS num app

O deck e o hub usam **CSS Modules** sobre `styles/tokens.css`. As versões `v0` e
`v1` foram construídas em **Tailwind** antes desta consolidação. Os três
convivem porque o CSS é carregado por segmento de rota, não na raiz:

```
app/globals.css          reset global, SEM tipografia de corpo
styles/tokens.css        toda a identidade, nenhum hex fora daqui
styles/deck.css          tipografia do deck        → app/(deck)/layout.tsx
app/v1/v1.css            Tailwind + tokens da v1   → app/v1/layout.tsx
app/v2/v2.css            CSS Modules da v2         → app/v2/layout.tsx
```

**A armadilha que isso resolve:** regras sem cascade layer vencem qualquer coisa
dentro de `@layer`. Como a base do Tailwind vive em `@layer base`, um
`body { font-size }` na `globals.css` da raiz sobrescreve silenciosamente a
tipografia das versões em Tailwind. Foi o que fez a headline da `/v1` colidir com
o subtítulo na primeira tentativa de consolidação. Por isso a `globals.css` da
raiz não declara `font-size`, `line-height` nem `font-weight`.

O route group `app/(deck)/` não altera nenhuma URL: existe apenas para dar às
rotas da apresentação um lugar onde carregar a tipografia delas.

## Estrutura

```
app/
  layout.tsx  page.tsx  globals.css     home e shell compartilhado
  (deck)/     vision/  anchor/          a apresentação
  v0/  v1/  v2/                         as landings, uma por versão
  showcase/  lab/vireo/                 a transformação isolada e a conferência do 3D
components/
  brand/  deck/  primitives/  product/  slides/     design system do deck
  v1/                                   componentes da landing v1 e v0
  v2/                                   componentes da landing v2
  v2/vireo3d/                           o modelo 3D, a cena e a animação de rolagem
lib/
  asset.ts                              prefixo de caminho para publicação
  contrast.ts  ecg.ts  slides.ts  synthetic.ts      libs do deck
  v1/                                   libs da landing v1 e v0
  v2/  vireo-metrics.json               libs da v2 e as medidas do aparelho
styles/tokens.css                       fonte única da identidade
assets/
  brand-source/                         PNG oficial do logo, fonte da vetorização
  device-source/                        PDF e fotos do VIREO AM
  device-source/renders/                os 85 renders extraídos do PDF
  vireo-model/                          o .glb exportado, com README de procedência
  vireo-showcase-frames/                frames da abordagem revertida
public/
  brand/  product/  devices/  device/   assets servidos
  device/model/                         faces recortadas e a tela retificada
  .nojekyll                             sem ele o Pages ignora _next/
scripts/                                extração, medição e vetorização
.github/workflows/pages.yml             publicação, disparo manual
tests/                                  vitest
docs/deck.md                            documentação da apresentação
```

## Identidade

Todos os valores de marca vêm de fontes oficiais da Cardioline, não de
estimativa. Ver o cabeçalho de `styles/tokens.css` para a procedência de cada um
e os contrastes medidos.

Três papéis para o laranja, mesma matiz e saturação, só o valor muda, porque o
laranja oficial `#F66201` tem 3,19:1 sobre branco: serve para grafismo (WCAG pede
3:1) mas não para texto nem para superfície com texto branco (4,5:1).

| Token                          | Uso                                              |
| ------------------------------ | ------------------------------------------------ |
| `--cl-orange` `#F66201`        | grafismo: traçados, filetes, pontos, grid        |
| `--cl-orange-strong` `#CA5001` | superfície preenchida com texto branco           |
| `--cl-orange-ink` `#B84A01`    | laranja como texto sobre fundo claro             |
| `--cl-ink` `#071046`           | texto corrido; é a cor dos H1/H2 do site oficial |

## Regra editorial

Toda a copy está no tempo verbal do começo (_starts, opens, included, extended_)
e nunca no do encerramento (_already yours, nothing more to buy, free forever_).
Sempre que o texto afirma o que está incluído, precisa deixar visível que existe
um degrau acima. **Incluído não é o mesmo que completo.**

Zero em-dashes e en-dashes em qualquer string visível: o travessão longo é a
assinatura tipográfica mais reconhecível de texto gerado por máquina.
