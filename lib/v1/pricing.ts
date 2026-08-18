/**
 * PRECIFICACAO ILUSTRATIVA DE PROTOTIPO — NAO E DECISAO COMERCIAL.
 *
 * Os valores abaixo existem apenas para dar forma visual a arquitetura de
 * planos numa apresentacao de visao de produto. Nao foram validados com
 * pesquisa de disposicao a pagar, custo de servir, posicionamento regional
 * nem estrutura de canal. Trocar o numero aqui atualiza a landing inteira.
 *
 * A tese comercial que a estrutura carrega, e que NAO e ilustrativa:
 *
 *   Anchor Free       aquisicao de ecossistema — incluido com o hardware
 *   Anchor Pro        receita recorrente profissional
 *   Anchor Enterprise receita recorrente institucional + servicos
 *
 * Regra de fronteira: nada que o ECGWebApp ja entrega hoje pode migrar para
 * um plano pago. O plano gratuito e a vantagem competitiva do hardware, nao
 * uma versao reduzida criada para empurrar o upgrade.
 */

export const PRICING_DISCLAIMER =
  "Illustrative prototype pricing. Not a commercial commitment.";

export const pricing = {
  currency: "€",
  free: {
    amount: 0,
    period: "forever",
  },
  pro: {
    /** PRECO ILUSTRATIVO — ver aviso no topo do arquivo */
    amount: 49,
    period: "month",
    perSeat: true,
  },
  enterprise: {
    amount: null,
    label: "Custom",
  },
} as const;

export function formatPrice(amount: number) {
  return `${pricing.currency}${amount}`;
}
