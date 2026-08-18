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

| Rota | O que é |
|---|---|
| `/` | Hub de navegação |
| `/vision` | O deck de 22 slides |
| `/anchor` | Tela do workspace usada como apoio no deck |
| `/v2` | Landing atual: VIREO AM e o Anchor em destaque, com movimento na rolagem |
| `/v1` | Landing anterior: reverência ao produto, uma ideia por viewport |
| `/v0` | Primeiro rascunho, guardado como base de comparação |

## A v2

O software em primeiro plano, em perspectiva, e a rolagem montando a composição.

**Coreografia.** A seção do hero é fixada (`pin`) e a rolagem é o parâmetro da
animação (`scrub`). O workspace parte inclinado em 3D e se endireita até encarar
o leitor; o VIREO AM sobe à frente; o telefone entra por último. É a sequência "o
aparelho adquire, o navegador lê, o bolso assina" contada como gesto, não como
lista. GSAP porque pin com scrub é justamente o que keyframes de CSS não fazem.

O estado **inicial** vive em CSS, não em JS, para que servidor e cliente rendam a
mesma coisa e não haja divergência de hidratação; o GSAP assume a partir dali.
Sob `prefers-reduced-motion` a composição aparece montada e o pin não acontece.

**As três superfícies mostram o mesmo exame.** Mesmo paciente, mesmos valores
medidos no navegador e no telefone. Números divergentes entre telas destroem a
credibilidade de um material clínico mais rápido do que qualquer detalhe visual.

**Reuso do design system do deck.** `BrowserFrame`, `DeviceFrame`, `ExamViewer` e
`EcgTrace` já existiam em `components/product/`, em CSS Modules sobre os tokens.
A v2 não reconstruiu nada disso. Uma armadilha encontrada no caminho: o
`ExamViewer` distribui as derivações com `flex: 1 1 0`, o que exige um pai de
altura definida — no deck ele vive num Slide de altura fixa, e sem declarar altura
aqui os traçados colapsavam numa fatia de poucos pixels.

### Imagens do dispositivo

Os renders oficiais do VIREO AM entram recortados por
`scripts/cutout-device.py`: flood fill a partir da borda, erosão de 1 px e
recorte para o conteúdo. **Os pixels do aparelho são os do render oficial** — o
hardware não foi redesenhado nem regerado.

Por que não geração de imagem para o aparelho: o `gpt-image` só gera a partir de
texto, não edita. Um "VIREO AM" descrito em prompt seria um aparelho inventado,
com proporções e conectores que não existem, o que contraria a regra de preservar
a aparência dos produtos Cardioline.

Detalhe do algoritmo: a carcaça do aparelho também é branca, então um threshold
global de branco comeria o corpo do produto. O fundo é a região branca
**conectada à borda**, e é só ela que sai. Os cabos de derivação são brancos sobre
branco e não sobrevivem à erosão que limpa a franja da carcaça, por isso são
cortados: `crop_to_body` detecta a primeira linha cuja faixa opaca cobre parte
significativa da largura do objeto.

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
  layout.tsx  page.tsx  globals.css     hub e shell compartilhado
  (deck)/     vision/  anchor/          a apresentação
  v0/  v1/  v2/                         as landings, uma por versão
components/
  brand/  deck/  primitives/  product/  slides/     design system do deck
  v1/                                   componentes da landing v1 e v0
  v2/                                   componentes da landing v2
lib/
  contrast.ts  ecg.ts  slides.ts  synthetic.ts      libs do deck
  v1/                                   libs da landing v1 e v0
  v2/                                   libs da landing v2
styles/tokens.css                       fonte única da identidade
assets/
  brand-source/                         PNG oficial do logo, fonte da vetorização
  device-source/                        renders e fotos do VIREO AM
public/
  brand/  product/  devices/  device/   assets servidos
scripts/                                vetorização de marca e verificação
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

| Token | Uso |
|---|---|
| `--cl-orange` `#F66201` | grafismo: traçados, filetes, pontos, grid |
| `--cl-orange-strong` `#CA5001` | superfície preenchida com texto branco |
| `--cl-orange-ink` `#B84A01` | laranja como texto sobre fundo claro |
| `--cl-ink` `#071046` | texto corrido; é a cor dos H1/H2 do site oficial |

## Regra editorial

Toda a copy está no tempo verbal do começo (*starts, opens, included, extended*)
e nunca no do encerramento (*already yours, nothing more to buy, free forever*).
Sempre que o texto afirma o que está incluído, precisa deixar visível que existe
um degrau acima. **Incluído não é o mesmo que completo.**

Zero em-dashes e en-dashes em qualquer string visível: o travessão longo é a
assinatura tipográfica mais reconhecível de texto gerado por máquina.
