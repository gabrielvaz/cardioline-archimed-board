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

**Coreografia.** GSAP na página inteira, com a rolagem como parâmetro (`scrub`):

- o workspace parte inclinado em 3D e se endireita até encarar o leitor;
- o telefone entra depois, quando já há o que ler nele;
- o **VIREO AM acompanha a rolagem toda**, fixo numa faixa reservada à direita, e
  o **módulo Air sobe da base e encaixa** entre 16% e 34% do percurso;
- cada seção revela os próprios blocos em sequência ao entrar no viewport.

**Sem pin.** Um pin cria pin-spacer e muda a altura do documento, obrigando os
outros triggers a recalcularem sobre um layout móvel. Com scrub puro há uma só
origem de verdade, a rolagem real.

A docagem é medida, não presumida: `scratchpad/railcheck.mjs` lê a folga vertical
entre a base do corpo e o topo do módulo ao longo do percurso. Resultado atual
**+67 px solto → -17 px encaixado** (o negativo é a sobreposição do conector).

O estado **inicial** vive em CSS, não em JS, para que servidor e cliente rendam a
mesma coisa e não haja divergência de hidratação; o GSAP assume a partir dali.
Sob `prefers-reduced-motion` a composição aparece montada e o pin não acontece.

**As três superfícies mostram o mesmo exame.** Mesmo paciente, mesmos valores
medidos no navegador e no telefone. Números divergentes entre telas destroem a
credibilidade de um material clínico mais rápido do que qualquer detalhe visual.

**Mockups.** `BrowserFrame`, `DeviceFrame` e `EcgTrace` vêm do design system do
deck. O workspace, porém, é um componente próprio da v2
(`components/v2/AnchorWorkspace.tsx`): a densidade pedida aqui é outra, com mais
respiro e tipo menor, e alterar o `ExamViewer` do deck regrediria a apresentação,
que é calibrada para projetor.

**Disciplina de cor.** O traçado é navy sobre grid laranja, como o papel térmico
que o aparelho imprime. O logo oficial aparece no cabeçalho e dentro do mockup.

O laranja da v2 é o **oficial `#F66201`**, a tinta do logo, tanto em superfície
preenchida quanto em texto. É uma exceção consciente à regra de
`styles/tokens.css`, que manda usar variantes escurecidas quando o laranja carrega
texto, e está registrada com os números medidos no topo de `app/v2/v2.css`:

| Uso | Contraste | AA |
|---|---|---|
| rótulo branco sobre `#F66201` | 3,15:1 | só texto grande |
| texto `#F66201` sobre branco | 3,15:1 | só texto grande |
| grafismo `#F66201` sobre branco | 3,15:1 | passa (grafismo pede 3:1) |

Duas saídas de uma linha, se a prioridade virar conformidade sem perder a matiz:
apontar `--v2-accent-on` para `--cl-ink` (navy sobre o laranja oficial dá
**5,69:1**) ou `--v2-accent` para `--cl-orange-strong`.

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

`split_module` separa o corpo do módulo Air achando a única faixa de linhas
totalmente transparentes entre os dois objetos no render oficial. São as duas
peças que a animação de encaixe move, e as abas do conector caem na base porque
ambas mantêm a proporção original.

### A armadilha de cascata no reset da v2

O reset de elemento da v2 vive dentro de `:where()`, que tem especificidade zero.
Escrito como `.v2 a`, o seletor teria especificidade (0,1,1) e venceria uma classe
de componente como `.cta` (0,1,0). Foi exatamente isso que fez `color: inherit`
pintar de navy o rótulo de todos os botões e links, enquanto pills e valores
(`span` e `p`) saíam laranja corretamente. O sintoma parecia um token de cor que
não resolvia; a causa era cascata.

Só a amostragem de pixel na captura revelou o problema: os seletores do probe de
DOM erravam o elemento, e a inspeção visual não distingue "token não resolveu" de
"outra regra ganhou".

## Showcase do VIREO AM (revertido)

Uma seção de showcase controlada por rolagem foi construída e **revertida** em
2026-08-19, por qualidade insuficiente. O problema não era a engenharia (canvas,
pin, scrub e reversibilidade funcionavam e estavam medidos), era o material: os
renders oficiais têm frente, traseira e 3/4, mas **não têm as laterais em 90
graus**, e a rotação acabou sendo uma compressão horizontal entre os três ângulos.
Isso lê como um cartão girando, não como um produto girando.

Os assets ficaram preservados em `assets/vireo-showcase-frames/`, fora de
`public/`, com um README explicando a procedência e o que faltaria. As camadas
recortadas continuam em `assets/vireo-layers/` e os scripts
(`cutout-device.py`, `build-vireo-frames.py`) continuam versionados.

Para retomar: é preciso um **export de turntable do CAD** vindo da Cardioline, ou
o próprio modelo. Gerar os ângulos faltantes por IA não resolve, porque um gerador
texto-para-imagem devolve um aparelho diferente por chamada e a sequência deixa de
parecer um único produto.

### Pendente

Nada foi gerado por `gpt-image`: a cota do plano Plus está esgotada
(`HTTP 429 usage_limit_reached`, reset em 20/08 às 06:35). Testado três vezes.

O que a geração de imagem ainda pode agregar, quando a cota voltar, são **plates
de ambiente** para compor atrás do aparelho. O produto em si não deve ser gerado,
e os ângulos faltantes da rotação também não.

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
