import { cn } from "@/lib/v1/cn";
import { LEAD_ORDER, buildEcg, type Morphology } from "@/lib/v1/ecg";
import { ECGWaveform } from "./ECGWaveform";
import { DataPoint } from "./AppShell";
import { IconCompare, IconScan } from "@/components/v1/icons";

/**
 * Visualizador de ECG de 12 derivacoes no layout clinico 4x3 mais tira de
 * ritmo, que e como um eletrocardiograma e realmente lido.
 *
 * Todas as derivacoes compartilham a mesma altura de painel (plotHeightMm),
 * caso contrario as linhas de base nao se alinhariam entre colunas.
 */

const PANEL_HEIGHT_MM = 22;

export function TwelveLeadGrid({
  bpm = 96,
  seed = 21,
  morphology = "normal",
  highlightLeads = [],
  className,
}: {
  bpm?: number;
  seed?: number;
  morphology?: Morphology;
  /** derivacoes que a camada assistida marcou para atencao */
  highlightLeads?: string[];
  className?: string;
}) {
  return (
    <div className={cn("@container grid grid-cols-2 gap-px bg-line @2xl:grid-cols-4", className)}>
      {LEAD_ORDER.map((lead, index) => {
        const flagged = highlightLeads.includes(lead);
        return (
          <div key={lead} className="relative bg-white">
            <span className="tnum absolute top-1 left-1.5 z-10 rounded bg-white/85 px-1 text-[9.5px] font-bold text-ink">
              {lead}
            </span>
            {flagged ? (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 border-[1.5px] border-brand/70 bg-brand/[0.045]"
              />
            ) : null}
            <div className="h-[54px] @2xl:h-[62px]">
              <ECGWaveform
                lead={lead}
                bpm={bpm}
                seconds={2.5}
                seed={seed + index}
                morphology={morphology}
                plotHeightMm={PANEL_HEIGHT_MM}
                gridOpacity={0.5}
                traceWidth={0.28}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ECGViewer({
  patient = "Emma Rossi",
  patientMeta = "PT-100482 · F 61 · 12-lead resting ECG",
  acquired = "Today, 09:14 · ECG200L, Room 2",
  bpm = 96,
  morphology = "stDepression",
  highlightLeads = ["V5", "V6"],
  showAssist = true,
  className,
}: {
  patient?: string;
  patientMeta?: string;
  acquired?: string;
  bpm?: number;
  morphology?: Morphology;
  highlightLeads?: string[];
  showAssist?: boolean;
  className?: string;
}) {
  const m = buildEcg({ bpm, morphology, seconds: 2, sampleRate: 60 }).measurements;

  return (
    <div className={cn("@container flex flex-col bg-white", className)}>
      {/* Identificacao do exame */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line px-4 py-3">
        <div>
          <h4 className="text-[15px] tracking-[-0.015em]">{patient}</h4>
          <p className="tnum text-[11.5px] text-ink-3">{patientMeta}</p>
        </div>
        <p className="tnum text-[11px] text-ink-3">{acquired}</p>
      </div>

      {/* Controles de aquisicao e leitura */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line bg-surface-muted/60 px-4 py-2">
        <span className="flex items-center gap-1.5 text-[11px] text-ink-2">
          <span className="text-ink-3">Speed</span>
          <span className="tnum rounded border border-line bg-white px-1.5 py-0.5 font-semibold text-ink">
            25 mm/s
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-ink-2">
          <span className="text-ink-3">Gain</span>
          <span className="tnum rounded border border-line bg-white px-1.5 py-0.5 font-semibold text-ink">
            10 mm/mV
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-ink-2">
          <span className="text-ink-3">Filter</span>
          <span className="tnum rounded border border-line bg-white px-1.5 py-0.5 font-semibold text-ink">
            0.05 to 150 Hz
          </span>
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-md border border-line bg-white px-2 py-1 text-[11px] font-medium text-ink-2">
            <IconCompare className="size-3" /> Compare
          </span>
          <span className="flex items-center gap-1.5 rounded-md border border-line bg-white px-2 py-1 text-[11px] font-medium text-ink-2">
            12 leads
          </span>
        </span>
      </div>

      {/* Tracado */}
      <TwelveLeadGrid
        bpm={bpm}
        morphology={morphology}
        highlightLeads={highlightLeads}
        className="border-b border-line"
      />

      {/* Tira de ritmo — derivacao II, com pulso de calibracao de 1 mV */}
      <div className="relative border-b border-line">
        <span className="tnum absolute top-1 left-1.5 z-10 rounded bg-white/85 px-1 text-[9.5px] font-bold text-ink">
          II · rhythm
        </span>
        <div className="h-[64px]">
          <ECGWaveform
            lead="II"
            bpm={bpm}
            seconds={10}
            seed={5}
            morphology={morphology}
            plotHeightMm={26}
            showCalibration
            gridOpacity={0.5}
            traceWidth={0.26}
          />
        </div>
      </div>

      {/* Medidas — derivadas do sinal desenhado, nao constantes soltas */}
      <div className="grid grid-cols-3 gap-4 px-4 py-3 @2xl:grid-cols-6">
        <DataPoint label="HR" value={m.hr} unit="bpm" tone="alert" />
        <DataPoint label="PR" value={m.prMs} unit="ms" />
        <DataPoint label="QRS" value={m.qrsMs} unit="ms" />
        <DataPoint label="QT" value={m.qtMs} unit="ms" />
        <DataPoint label="QTc" value={m.qtcMs} unit="ms" />
        <DataPoint label="Axis" value={`${m.axisDeg}°`} />
      </div>

      {showAssist ? (
        <div className="mx-4 mb-4 rounded-[10px] border border-brand/30 bg-brand-soft/50 p-3">
          <p className="flex items-center gap-2 text-[11px] font-semibold text-brand-ink">
            <IconScan className="size-3.5" />
            ANCHOR PRO · AI-ASSISTED REVIEW
          </p>
          <p className="mt-1.5 text-[12.5px] text-ink-2">
            Two areas marked for your attention: lateral ST-segment changes in{" "}
            <span className="tnum font-semibold text-ink">V5-V6</span> and a QTc{" "}
            <span className="tnum font-semibold text-ink">29 ms</span> longer than this
            patient&rsquo;s June 2024 recording.
          </p>
          <p className="mt-2 border-t border-brand/20 pt-2 text-[10.5px] text-ink-3">
            Decision support for the reviewing cardiologist. Not a diagnosis, and not a
            substitute for clinical judgement.
          </p>
        </div>
      ) : null}
    </div>
  );
}
