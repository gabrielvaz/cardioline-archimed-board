import { Fragment } from "react";
import { cn } from "@/lib/v1/cn";
import { IconCheck } from "@/components/v1/icons";

/**
 * Matriz de comparacao.
 *
 * Estrutura aprendida do benchmark (Coreum by Micromed): planos acumulativos
 * diferenciados por DIMENSAO — assentos, dispositivos, sites, integracoes,
 * suporte e SLA — em vez de por recursos basicos.
 *
 * Guarda importante, verificada na documentacao publica do ECGWebApp: o
 * produto atual ja oferece configuracao multi-site, gestao de usuarios com
 * permissoes e integracao com PACS/EMR/HIS. Portanto essas linhas NAO podem
 * aparecer como bloqueadas no plano gratuito. A diferenca Enterprise real
 * esta em escala, administracao centralizada, implantacao gerenciada,
 * governanca e servico — e e assim que estao escritas aqui.
 */

type Cell = boolean | string;
type Row = {
  label: string;
  free: Cell;
  pro: Cell;
  enterprise: Cell;
  note?: boolean;
};
type Group = { title: string; caption?: string; rows: Row[] };

const GROUPS: Group[] = [
  {
    title: "Core cardiac workflow",
    caption:
      "Everything the current Cardioline web experience already does, included with the device.",
    rows: [
      {
        label: "Browser-based access, no local installation",
        free: true,
        pro: true,
        enterprise: true,
      },
      {
        label: "Exam management: ECG, Holter, ABPM, Stress",
        free: true,
        pro: true,
        enterprise: true,
      },
      {
        label: "Patient records and exam history",
        free: true,
        pro: true,
        enterprise: true,
      },
      { label: "Cardiac exam viewer", free: true, pro: true, enterprise: true },
      {
        label: "Reporting, printing and downloads",
        free: true,
        pro: true,
        enterprise: true,
      },
      { label: "Basic measurements", free: true, pro: true, enterprise: true },
      {
        label: "Secure cloud storage",
        free: true,
        pro: true,
        enterprise: true,
      },
      {
        label: "User management and permissions",
        free: "Included",
        pro: "Included",
        enterprise: "Organizational model",
        note: true,
      },
      {
        label: "Multi-site configuration",
        free: "Included",
        pro: "Included",
        enterprise: "Centrally administered",
        note: true,
      },
    ],
  },
  {
    title: "Professional intelligence",
    caption:
      "New capability for the cardiologist doing the reading. This is what Pro charges for.",
    rows: [
      { label: "AI-assisted review", free: false, pro: true, enterprise: true },
      {
        label: "Automatic comparison with previous exams",
        free: false,
        pro: true,
        enterprise: true,
      },
      {
        label: "Advanced measurements",
        free: false,
        pro: true,
        enterprise: true,
      },
      {
        label: "Intelligent structured reporting",
        free: false,
        pro: true,
        enterprise: true,
      },
      {
        label: "Personal templates and phrase suggestions",
        free: false,
        pro: true,
        enterprise: true,
      },
      {
        label: "Longitudinal patient view and advanced search",
        free: false,
        pro: true,
        enterprise: true,
      },
      {
        label: "Productivity insights",
        free: false,
        pro: true,
        enterprise: true,
      },
      {
        label: "Collaboration and second-opinion workflows",
        free: false,
        pro: true,
        enterprise: true,
      },
    ],
  },
  {
    title: "Scale and deployment",
    caption:
      "Where institutional value actually sits: size, structure and rollout.",
    rows: [
      {
        label: "Connected Cardioline devices",
        free: "Your devices",
        pro: "Your devices",
        enterprise: "Estate-wide",
      },
      {
        label: "Facilities and locations",
        free: "Single site",
        pro: "Single site",
        enterprise: "Multiple",
      },
      {
        label: "Users",
        free: "Practice team",
        pro: "Per user",
        enterprise: "Organization-wide",
      },
      {
        label: "Large-scale deployment",
        free: false,
        pro: false,
        enterprise: true,
      },
      { label: "Custom workflows", free: false, pro: false, enterprise: true },
    ],
  },
  {
    title: "Interoperability",
    caption:
      "The platform speaks these protocols. Enterprise is where they get scoped, built and managed for you.",
    rows: [
      {
        label: "HIS / PACS / EHR integration",
        free: "Platform capability",
        pro: "Platform capability",
        enterprise: "Implemented and managed",
        note: true,
      },
      {
        label: "HL7 / FHIR / DICOM",
        free: false,
        pro: false,
        enterprise: true,
      },
      { label: "APIs", free: false, pro: false, enterprise: true },
      { label: "SSO", free: false, pro: false, enterprise: true },
    ],
  },
  {
    title: "Governance and service",
    rows: [
      {
        label: "Audit and data governance",
        free: "Standard",
        pro: "Standard",
        enterprise: "Advanced",
      },
      {
        label: "Implementation support",
        free: false,
        pro: false,
        enterprise: true,
      },
      {
        label: "Dedicated success contact",
        free: false,
        pro: false,
        enterprise: true,
      },
      {
        label: "Support",
        free: "Standard",
        pro: "Priority",
        enterprise: "Enterprise SLA",
      },
    ],
  },
];

const PLAN_LABELS = ["Free", "Pro", "Enterprise"] as const;

function CellValue({ value, featured }: { value: Cell; featured?: boolean }) {
  if (value === true) {
    return (
      <>
        <IconCheck
          className={cn(
            "mx-auto size-[18px]",
            featured ? "text-brand-ink" : "text-status-reported-ink",
          )}
          strokeWidth={2.2}
        />
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <span aria-hidden className="mx-auto block h-px w-3 bg-line-strong" />
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return (
    <span
      className={cn(
        "text-[12px] font-medium",
        featured ? "text-brand-ink" : "text-ink-2",
      )}
    >
      {value}
    </span>
  );
}

export function PricingMatrix({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="text-[1.5rem] tracking-[-0.02em]">
          Where the line actually falls
        </h3>
        <p className="mt-3 text-[15px] text-ink-2">
          Nothing the current Cardioline web experience already does moves
          behind a subscription. Pro adds new clinical intelligence; Enterprise
          adds scale, integration and service.
        </p>
      </div>

      {/* Matriz — a partir de md */}
      <div className="mt-10 hidden overflow-hidden rounded-[16px] border border-line bg-white md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Comparison of Anchor Free, Anchor Pro and Anchor Enterprise
            capabilities
          </caption>
          <thead>
            <tr className="border-b border-line bg-surface-muted/60">
              <th
                scope="col"
                className="w-[42%] px-6 py-4 text-[13px] font-semibold text-ink"
              >
                Capability
              </th>
              {PLAN_LABELS.map((p) => (
                <th
                  key={p}
                  scope="col"
                  className={cn(
                    "px-4 py-4 text-center text-[13px] font-semibold",
                    p === "Pro" ? "bg-brand-soft/50 text-brand-ink" : "text-ink",
                  )}
                >
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((group) => (
              <Fragment key={group.title}>
                <tr className="border-b border-line bg-surface-muted/35">
                  <th
                    scope="colgroup"
                    colSpan={4}
                    className="px-6 py-3.5 text-left align-top font-normal"
                  >
                    <span className="block text-[12.5px] font-semibold tracking-[0.03em] text-ink uppercase">
                      {group.title}
                    </span>
                    {group.caption ? (
                      <span className="mt-1 block max-w-3xl text-[12px] leading-snug text-ink-3">
                        {group.caption}
                      </span>
                    ) : null}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-line/70 last:border-0"
                  >
                    <th
                      scope="row"
                      className="px-6 py-3 text-[13.5px] font-normal text-ink-2"
                    >
                      {row.label}
                    </th>
                    <td className="px-4 py-3 text-center">
                      <CellValue value={row.free} />
                    </td>
                    <td className="bg-brand-soft/25 px-4 py-3 text-center">
                      {/* destaca o Pro apenas quando ele difere do Free — senao
                          "Standard" em laranja sugeriria um upgrade inexistente */}
                      <CellValue
                        value={row.pro}
                        featured={row.pro !== row.free}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CellValue value={row.enterprise} />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cartoes por grupo — abaixo de md */}
      <div className="mt-10 flex flex-col gap-4 md:hidden">
        {GROUPS.map((group) => (
          <div
            key={group.title}
            className="rounded-[14px] border border-line bg-white"
          >
            <div className="border-b border-line px-4 py-3.5">
              <p className="text-[12px] font-semibold tracking-[0.03em] text-ink uppercase">
                {group.title}
              </p>
              {group.caption ? (
                <p className="mt-1 text-[12px] leading-snug text-ink-3">
                  {group.caption}
                </p>
              ) : null}
            </div>
            <ul className="flex flex-col divide-y divide-line">
              {group.rows.map((row) => (
                <li key={row.label} className="px-4 py-3">
                  <p className="text-[13px] text-ink">{row.label}</p>
                  <dl className="mt-2 grid grid-cols-3 gap-2">
                    {(
                      [
                        ["Free", row.free, false, false],
                        ["Pro", row.pro, true, row.pro !== row.free],
                        ["Ent.", row.enterprise, false, false],
                      ] as const
                    ).map(([label, value, isPro, differs]) => (
                      <div
                        key={label}
                        className={cn(
                          "rounded-md border px-2 py-1.5 text-center",
                          isPro
                            ? "border-brand/35 bg-brand-soft/35"
                            : "border-line",
                        )}
                      >
                        <dt
                          className={cn(
                            "text-[9.5px] font-semibold tracking-[0.06em] uppercase",
                            isPro ? "text-brand-ink" : "text-ink-3",
                          )}
                        >
                          {label}
                        </dt>
                        <dd className="mt-0.5 flex min-h-[18px] items-center justify-center">
                          <CellValue value={value} featured={differs} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-3xl text-center text-[12.5px] leading-relaxed text-ink-3">
        Rows marked as a platform capability describe what the current
        Cardioline web platform already supports: multi-site configuration,
        user permissions and PACS / EMR / HIS integration among them. They are
        not withheld from the free plan. What Enterprise adds is central
        administration, managed implementation, governance and a service
        commitment.
      </p>
    </div>
  );
}
