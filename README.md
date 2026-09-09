# Cardioline Vision 2028

> **Procedência.** Também existe como repositório próprio em
> [gabrielvaz/cardioline-vision-2028](https://github.com/gabrielvaz/cardioline-vision-2028);
> a cópia aqui não tem o histórico. É uma das **duas linhas** do mesmo deck: esta
> manteve os 22 slides e investiu nas landings e no VIREO AM em 3D, enquanto
> [`../cardioline-vision-deck-35/`](../cardioline-vision-deck-35/) seguiu crescendo
> no argumento até 35 slides.

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
pnpm verify             # harness Puppeteer do deck de 22 slides
pnpm verify:archimed        # harness da versão só-Brasil
pnpm verify:archimed-group  # harness da versão de grupo
```

## Rotas

Um único app Next.js hospeda todos os materiais, para que a navegação entre eles
seja instantânea numa reunião. Cada versão da landing continua viva na `main` em
vez de ser sobrescrita, para que a evolução do argumento seja demonstrável.

| Rota         | O que é                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `/`          | Home: escolher o fluxo — apresentação, site, mockup do dispositivo, produto |
| `/archimed-group` | O deck de 10 slides para o board da Archimed, com Cardios e Cardioline   |
| `/archimed`  | A versão anterior do mesmo deck, só com dados da Cardios                     |
| `/vision`    | O deck de 22 slides                                                         |
| `/anchor`    | Tela do workspace usada como apoio no deck                                  |
| `/v2`        | Landing atual: o VIREO AM em 3D se desmonta e remonta com a rolagem         |
| `/v1`        | Landing anterior: reverência ao produto, uma ideia por viewport             |
| `/v0`        | Primeiro rascunho, guardado como base de comparação                         |
| `/showcase`  | A transformação do VIREO AM isolada da landing                              |
| `/lab/vireo` | Folha de contato do modelo 3D: ferramenta de conferência, não apresentação  |

A home agrupa por **fluxo** e não por lista corrida, porque é assim que a escolha se
apresenta numa reunião: primeiro se decide o que mostrar, e só depois qual versão.

## Publicado

| URL | O que é |
| --- | --- |
| [gabrielvaz.github.io/cardioline-archimed-board/archimed-group/](https://gabrielvaz.github.io/cardioline-archimed-board/archimed-group/) | A versão de grupo, com Cardios e Cardioline |
| [gabrielvaz.github.io/cardioline-archimed-board/archimed/](https://gabrielvaz.github.io/cardioline-archimed-board/archimed/) | A versão só-Brasil, guardada como comparação |

Repo `cardioline-archimed-board`, público, **nada indexado**: as rotas do board
declaram `robots: { index: false }` no `metadata` e o `robots.txt` barra o repo
inteiro. Publica no push da main pelo workflow de Pages.

**Esta pasta não publica em `cardioline-product-vision`.** Aquele repo descende de
`../deck-35/` e está muito à frente, com outra estrutura de app. Empurrar isto para
lá derrubaria um site que está no ar.

## Valores em dólar

Toda fonte é em BRL, porque a operação é brasileira, e a conversão acontece na
exibição. A taxa é uma constante única em `lib/archimed.ts` (`FX`), hoje em
**R$ 5,50 por US$ 1**, e o rodapé de cada slide com valor declara qual taxa foi
usada. Trocar a taxa é editar uma linha; guardar dólar convertido seria perder a
fonte e ter que reconverter na próxima vez.

Abaixo de um milhão o valor sai em mil e não em milhão: "US$ 358 k" se lê num
board, "US$ 0.36 M" faz o número parecer menor do que é.

## As duas versões Archimed

`/archimed-group` é a atual e `/archimed` é a anterior, guardada como base de
comparação. As duas têm o mesmo arco de dez slides, id por id, e um teste garante
isso. O que muda é a evidência.

### Cardios não é Cardioline, e o slide tem que dizer qual

Cardioline é o grupo, sede na Itália, alcance mundial. Cardios é a operação
brasileira, comprada em 2025. Os dois conjuntos de dados medem coisas diferentes:

| | Cardios · Brasil | Cardioline · mundial |
| --- | --- | --- |
| Fonte | Portal CardioNet, exame por exame; Protheus para o parque | WebApp em nuvem, exame por exame |
| Arquivo | `csv_export/`, `Clientese base.xlsx` | `SpazioCloudAruba_08.09.2026.xlsx` |
| Clientes | 12.101 contas no portal, 4.214 ativas/mês | 49 tenants, 33 com exame (ClickSalute somado ao PharmaRoom) |
| Exames/mês | 268.358, **medido** | 9.942, **medido**, só o período que o arquivo declara |
| Retenção | 87%/ano, 6 pares de anos | 89% em 11 meses |

**Nunca somados sem dizer.** Todo slide com dado carrega um marcador de
procedência no alto, com três estados: quadrado cheio para Cardios, vazado para
Cardioline, meio a meio quando o slide usa as duas. Há um teste que abre cada
componente da versão de grupo e falha se algum não renderizar o marcador, porque
um marcador que aparece só às vezes não é lido como regra.

O limite da nuvem está escrito na legenda dos slides que a usam: são os clientes
já conectados, não a base instalada mundial. Quem roda o software local não
aparece, então o número é piso de uso e não tamanho de mercado.

### O que a Cardioline acrescentou ao argumento

**Slide 4** ganhou a metade que faltava. O Brasil tem trinta vezes o volume e
nenhum produto em nuvem; a Itália já opera uma nuvem multi-tenant com laudo em
mediana de meia hora e 66% dentro de 24h. Um lado tem escala, o outro prova que o
modelo roda. É a tese de sandbox do plano de três anos, agora com número dos dois
lados.

**Slide 5** deixou de depender de uma amostra só. A retenção aparece duas vezes,
em dois continentes, com métodos diferentes: 87% de retenção de logo ao ano no
Brasil, em seis pares de anos consecutivos sobre cerca de cinco mil contas, e 89%
em onze meses na nuvem, numa coorte de 27 tenants. Anualizadas dão 13% e 12% de
churn, e os 15% que o modelo assume ficam **acima** das duas. O churn deixou de
ser premissa e passou a ser medição, e há um teste que falha se alguém puser a
premissa abaixo de qualquer uma das duas.

**Slide 6** ganhou a comparação de forma. Os dois lados são medidos, e as formas
não são iguais: o Brasil carrega o volume no meio da base, 2.017 contas entre 21
e 400 exames/mês com 63,5% do total; a nuvem carrega num único cliente, o
PharmaRoom com o ClickSalute somado, como a nota do arquivo manda, que faz 62%
dela sozinho. Preço e conversão continuam propostos **só** para o Brasil: inventar
preço para a nuvem italiana seria inventar o preço e o direito de propô-lo.

## A versão Archimed

`/archimed` é o mesmo argumento de `/vision` cortado para uma reunião de quinze
minutos, para um público que decide investimento e interrompe muito. Não
substitui os 22 slides: as duas rotas convivem, e a evolução do argumento é parte
do material.

Três decisões que vêm dessa restrição e não de gosto:

- **O pedido abre o deck, não fecha.** Guardar o pedido para o fim é apostar que
  se chega ao fim. Ele está no slide 2, logo depois da capa, e volta com detalhe
  no 10.
- **Cada slide sobrevive fora de ordem.** A navegação real vai ser o mapa (`G`),
  porque alguém vai pedir "volta na tabela". Nenhum slide depende do anterior
  para fazer sentido.
- **Um único slide navy**, o 8, que é onde a narrativa sobe: o que a receita
  recorrente muda no valor da empresa.

O que é apurado, o que é derivado e o que é premissa está separado em
[`lib/archimed.ts`](lib/archimed.ts), e o comentário de cada valor diz qual.
Clientes, parque e comportamento de recompra saem da base de vendas da Cardios;
o volume de exame por cliente é **derivado** do parque e calibrado contra os
14.000 exames/dia nacionais; preço, teto de conversão e churn são premissa. A
análise vive em `_estrategia/2026-09-08-mrr-arr-base-instalada/`, junto com a
versão do slide da tabela que tem sliders para mexer nas premissas ao vivo.

### Por que o argumento é uso recorrente e não recompra

O slide 5 argumentava por recompra de hardware: mediana de 280 dias entre
compras, 61% das entidades voltando, crescimento de volume vindo da base. Foi
substituído, e por dois motivos. O primeiro é que comprar aparelho de novo não
diz nada sobre disposição a assinar software. O segundo é que o número de
crescimento estava errado: reproduzia 7.936 para 15.880 com as quatro revendas
dentro da conta, e elas estão fora de todo o resto do deck.

O que entrou é medido no `_dados/Dinamica2026.xlsx`: 74% dos clientes usaram o
software em seis ou sete dos sete meses, metade usou em todos, e a coorte de
janeiro manteve 91% em julho. Essa última é a que faz o slide valer o tempo:
anualizada dá cerca de 17% de churn de logo, que é a âncora medida sob os 15% que
o modelo assume. O churn deixou de ser premissa, e o slide diz que o modelo é
levemente otimista em vez de deixar a sala descobrir.

O achado de aquisição que morava naquele slide — cerca de 500 entidades novas por
ano desde 2010, com o crescimento vindo da base e não do funil — continua
registrado em `_estrategia/2026-09-08-mrr-arr-base-instalada/README.md`, mas não
está em slide nenhum.

### A revisão de 09/09/2026: nada mais é derivado

Os rollups do portal CardioNet em `_dados/csv_export/` chegaram depois da
primeira versão deste deck e mudaram o piso da evidência. Antes, o volume por
cliente era **derivado** do tamanho do parque e calibrado contra "14.000 exames
por dia" que vinham de uma transcrição de reunião. Agora são **19,03 milhões de
exames** contados um a um, com cliente, central de análise, mês e turnaround.

A medição desmentiu o modelo derivado em dois pontos que mudam a estratégia:

| | Derivado (antes) | Medido (agora) |
| --- | --- | --- |
| Exames/mês | 308.000 | 268.358 |
| Contas acima de 1.500 exames/mês | 32, com 44% do volume | **9, com 8,8%** |
| Contas de 21 a 400 exames/mês | 1.003 | **2.017, com 63,5% do volume** |
| Churn anual | 17%, coorte de 7 meses | **13%, seis pares de anos** |
| ARR base no mês 24 | R$ 1,60 M | **R$ 1,97 M** |

O erro do modelo derivado era inflar o topo e esvaziar o meio. Isso trocava a
operação comercial que o pedido financia: não é cobrir trinta contas gigantes por
telefone, é cobrir dois mil clientes de porte médio, o que exige máquina e não
lista. O slide 10 pede isso com o número certo.

Duas coisas ficaram melhores do que se supunha. O churn medido em seis pares de
anos consecutivos é 13%, então os 15% do modelo passaram a ser **conservadores**;
antes eram levemente otimistas, e o slide dizia isso. E o volume por cliente,
sendo maior no miolo, dá um ARR base 23% acima do anterior.

Duas ressalvas que vieram com os dados e valem para qualquer leitura:

- **A série confiável começa em 2019-01.** O histórico de 2006 a 2018 foi perdido
  numa migração de MySQL. O salto de 2018 para 2019 não é adoção nem lançamento,
  é o ponto onde o dado sobrevivente começa. Nenhum crescimento é calculado
  contra 2009-2017.
- **A unidade do portal é a conta, não o cliente comercial.** 11.579 das 12.101
  contas trazem o `customer_id` do ERP, e ele vem em dois formatos (`8120` e
  `008120`). Normalizado com zeros à esquerda, são 5.437 códigos distintos; o
  6.311 que este README trazia era a contagem sem normalizar.

O `Dinamica2026.xlsx` cobria um único centro de telemedicina e está superado.
Segue no diretório como registro, mas não alimenta mais nenhum número.

### A auditoria de 09/09/2026: o que é das planilhas e o que não é

Todo número marcado como apurado em `lib/archimed.ts` e `lib/cardioline.ts` foi
reproduzido a partir de `_dados/` nesta data: os 19.032.503 exames, os 268.358 por
mês, as 4.214 contas ativas por mês, os seis pares de retenção (84,1% a 88,8%), o
turnaround de 2025, o mix por modalidade, as seis faixas de volume (corte pela
parte inteira da média de 2025 por conta), o modelo de MRR ao real, e os cinco
cortes do Protheus (161.586 registros, 11.925 entidades, 87.354 aparelhos, 3.257
ativas, 29.619 no parque). Na nuvem, os números passaram a seguir o período
declarado no arquivo e a somar o ClickSalute ao PharmaRoom, que é o que a nota do
próprio arquivo diz: 33 tenants com exame, 119.306 exames, e o maior cliente com
62% do volume em vez de 41%.

Cinco números do deck **não estão em nenhuma planilha**, e o slide agora diz isso:
os ~R$ 40 M de hardware, os R$ 2,7 M de software, a fatia de 6%, os R$ 1.200 e
R$ 670 da licença CardioNet Client, e os R$ 30 por laudo terceirizado. Vêm de
`_estrategia/2026-08-19-empacotamento-e-monetizacao/cardios_modelo_negocio_software.html`
e da reunião de 19/08/2026, como informação da gestão. Confirmar com o financeiro
antes do board. O "piloto de 60 clientes" e os "15 dias de uso" são plano da
mesma reunião, não medição. A referência italiana de preço, citada na reunião, é
7,20 € por exame ou 108 € por aparelho por mês.

O que a auditoria corrigiu nos slides: o título da faixa de volume ainda dizia
"1% faz 44%", do modelo derivado (medido: a metade de baixo faz 4,2% e o meio
63,5%); a decisão falava em "113 contas a cobrir" (são as 2.017 do meio); a base
ativa "batia com ~3.000 enviando exame" (não bate: são 4.214 contas por mês, e
quem compra e quem transmite são grupos diferentes); a versão de grupo ainda
citava 91% de retenção da amostra superada e R$ 1,06 M no estresse de churn (são
87% e R$ 1,30 M); e a coluna de participação dividia a soma de 2025 pela média da
janela, somando 100,4%.

### Por que os buckets são de exame e não de aparelho

A primeira versão segmentava por número de aparelhos e chamava de central toda
entidade com 50+ aparelhos ou software de análise. Isso dava 498 clientes de alto
volume e um ARR de R$ 5,39 M. Por volume de exame existem **32**, e o ARR base cai
para R$ 1,60 M. A segmentação por aparelho estava inflando o topo, e uma
assinatura por cliente só se sustenta se o preço acompanhar o volume.

A escada de preço é ancorada no que o cliente já gasta: a mediana de exames do
bucket vezes os R$ 30 do laudo terceirizado. Nos dois buckets pequenos a
assinatura tem que sair **abaixo** disso, e há um teste que garante. Foi o
`_dados/Dinamica2026.xlsx` que impôs esse piso: ele mede exames por cliente por
mês de janeiro a julho de 2026 e mostra que 42% dos clientes que terceirizam
laudo fazem de 1 a 5 exames por mês. A R$ 129, a assinatura sairia mais caro que
o laudo que eles já compram.

Esse arquivo cobre 66 clientes, os que terceirizam laudo, e não a base instalada:
as centrais grandes laudam por conta própria e não aparecem nele. Ele serve para
validar o pé da distribuição e fixar o piso de preço, não para dimensionar o
mercado.

**O valor do pedido está em branco de propósito.** `ASK.amountBrl` é `null` e o
último slide renderiza um marcador tracejado no lugar do número, porque o valor não
saiu de nenhuma conta deste trabalho. Existe um teste que falha no dia em que
alguém puser um número lá, para lembrar de registrar a origem dele.

A capa é branca com o wordmark laranja em 168px, igual à dos 22 slides, e tem
dois elementos: marca e título. *Stop selling boxes. Sell recurring value.*, em
72px, com "recurring" em laranja. **Toma posição sem entregar número nenhum** —
a tese aparece no slide 2 e os dados do 4 em diante, onde há argumento por baixo
deles.

### O harness voltou a rodar

`pnpm verify` estava morto: `next start` não funciona com `output: "export"` e
recusava com *"does not work with output: export"*. Os dois harnesses agora
servem o `out/` com [`scripts/lib/serve-out.mjs`](scripts/lib/serve-out.mjs), sem
dependência nova, e compartilham o auditor em
[`scripts/lib/audit-page.mjs`](scripts/lib/audit-page.mjs) — duplicar as
checagens é como as duas versões passariam a ter padrões diferentes.

Se o Chrome do puppeteer não estiver baixado, os dois usam o Chrome do sistema;
`CHROME_PATH` aponta para outro lugar.

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
