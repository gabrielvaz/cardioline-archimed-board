import Image from "next/image";
import { Section, SectionHeading } from "@/components/v1/ui/Section";
import { modalities } from "@/lib/v1/data";
import { AnchorLockup } from "@/components/v1/ui/Logo";
import { IconArrowDown } from "@/components/v1/icons";

/**
 * "Your devices. One workspace."
 *
 * A composicao e deliberadamente convergente: quatro colunas de modalidade
 * que descem para um unico bloco Anchor. Quatro cartoes isolados lado a lado
 * comunicariam o oposto da tese — quatro softwares independentes.
 */
export function ConnectedWorkflow() {
  return (
    <Section id="how-it-works" className="border-b border-line">
      <SectionHeading
        eyebrow="Connected workflow"
        title="Your devices. One workspace."
        intro="Resting ECG, ambulatory monitoring and exercise testing are different moments of care, acquired on different hardware, in different rooms. They do not have to end up in different software."
      />

      <div className="mt-14">
        <div className="grid gap-4 lg:grid-cols-4">
          {modalities.map((m) => (
            <article
              key={m.type}
              className="flex flex-col rounded-[14px] border border-line bg-surface shadow-[var(--shadow-subtle)]"
            >
              <div className="relative h-[132px] border-b border-line bg-surface-muted/50">
                <Image
                  src={m.image}
                  alt={`Cardioline ${m.device}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 280px"
                  className="object-contain p-4"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <h3 className="text-[1.0625rem] tracking-[-0.015em]">{m.type}</h3>
                  <p className="tnum mt-0.5 text-[11.5px] font-medium text-ink-3">{m.device}</p>
                </div>
                <p className="flex-1 text-[13.5px] leading-relaxed text-ink-2">{m.blurb}</p>
                <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 border-t border-line pt-3.5">
                  {m.steps.map((step, i) => (
                    <li key={step} className="flex items-center gap-1.5">
                      <span className="text-[11.5px] font-medium text-ink-2">{step}</span>
                      {i < m.steps.length - 1 ? (
                        <span aria-hidden className="text-ink-3">
                          →
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          ))}
        </div>

        {/*
          Convergencia: as quatro colunas descem para o mesmo destino.
          Só faz sentido quando os cartoes estao lado a lado — empilhados em
          uma coluna, o funil de quatro trilhos vira um retangulo sem
          significado. No mobile, uma seta unica diz a mesma coisa.
        */}
        <div aria-hidden className="hidden lg:block">
          <div className="grid grid-cols-4">
            {modalities.map((m) => (
              <span key={m.type} className="flex h-8 justify-center">
                <span className="w-px bg-line-strong" />
              </span>
            ))}
          </div>
          <div className="mx-auto h-px w-[75%] bg-line-strong" />
          <div className="flex flex-col items-center">
            <span className="h-6 w-px bg-line-strong" />
            <IconArrowDown className="-mt-1 size-4 text-line-strong" />
          </div>
        </div>

        <div aria-hidden className="flex flex-col items-center py-8 lg:hidden">
          <span className="h-8 w-px bg-line-strong" />
          <IconArrowDown className="-mt-1 size-4 text-line-strong" />
        </div>

        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-[14px] border border-brand/30 bg-brand-soft/40 px-6 py-7 text-center">
          <AnchorLockup />
          <p className="text-[15px] text-ink-2">
            One worklist, one patient record, one reporting workflow, regardless of which
            Cardioline device acquired the exam.
          </p>
        </div>
      </div>
    </Section>
  );
}
