import { buildEcg, type EcgOptions } from "@/lib/v1/ecg";
import { cn } from "@/lib/v1/cn";

/**
 * Tracado de ECG em grid clinico real.
 *
 * O viewBox esta em milimetros de papel de ECG, portanto o grid de 1 mm / 5 mm
 * e geometricamente correto em relacao ao sinal: a 25 mm/s e 10 mm/mV, um
 * quadrado grande vale 200 ms na horizontal e 0,5 mV na vertical. O grid usa
 * laranja porque e a cor do papel termico impresso pelos proprios
 * eletrocardiografos Cardioline.
 */
export function ECGWaveform({
  className,
  gridOpacity = 0.55,
  showCalibration = false,
  traceWidth = 0.3,
  ...options
}: EcgOptions & {
  className?: string;
  gridOpacity?: number;
  /** pulso de calibracao de 1 mV que abre o registro impresso */
  showCalibration?: boolean;
  traceWidth?: number;
}) {
  const trace = buildEcg(options);
  const { widthMm, heightMm, baselineMm, d } = trace;
  const mmPerMv = options.mmPerMv ?? 10;

  // Um pattern por instancia evita colisao de id entre multiplos tracados.
  const gridId = `ecg-grid-${Math.round(widthMm)}-${Math.round(heightMm)}-${options.lead ?? "II"}-${options.seed ?? 7}`;

  const calibration = showCalibration
    ? `M0 ${baselineMm} h2 V${baselineMm - mmPerMv} h2 V${baselineMm} h2`
    : null;

  return (
    <svg
      viewBox={`0 0 ${widthMm} ${heightMm}`}
      preserveAspectRatio="none"
      className={cn("block h-full w-full", className)}
      role="img"
      aria-label={`Synthetic ${options.lead ?? "II"} lead electrocardiogram trace, prototype data`}
    >
      <defs>
        <pattern id={gridId} width="5" height="5" patternUnits="userSpaceOnUse">
          <path
            d="M1 0V5M2 0V5M3 0V5M4 0V5M0 1H5M0 2H5M0 3H5M0 4H5"
            stroke="var(--ecg-grid)"
            strokeWidth="0.07"
            opacity="0.5"
            fill="none"
          />
          <path
            d="M0 0V5M0 0H5"
            stroke="var(--ecg-grid)"
            strokeWidth="0.18"
            opacity="0.75"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width={widthMm} height={heightMm} fill="white" />
      <rect width={widthMm} height={heightMm} fill={`url(#${gridId})`} opacity={gridOpacity} />
      {calibration ? (
        <path
          d={calibration}
          fill="none"
          stroke="var(--ecg-trace)"
          strokeWidth={traceWidth}
          strokeLinejoin="round"
        />
      ) : null}
      <path
        d={d}
        fill="none"
        stroke="var(--ecg-trace)"
        strokeWidth={traceWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        transform={showCalibration ? "translate(7 0)" : undefined}
      />
    </svg>
  );
}

/** Expoe as medidas sem redesenhar o tracado, para paineis numericos. */
export function ecgMeasurements(options: EcgOptions = {}) {
  return buildEcg({ ...options, seconds: options.seconds ?? 2, sampleRate: 60 }).measurements;
}

/**
 * Miniatura de tracado usada em linhas de tabela e cartoes de exame.
 * Sem grid: em tamanho pequeno o grid vira ruido visual.
 */
export function ECGSparkline({
  className,
  bpm = 70,
  seed = 5,
  lead = "II",
  morphology,
}: {
  className?: string;
  bpm?: number;
  seed?: number;
  lead?: EcgOptions["lead"];
  morphology?: EcgOptions["morphology"];
}) {
  const { d, widthMm, heightMm } = buildEcg({
    bpm,
    seed,
    lead,
    morphology,
    seconds: 2.4,
    sampleRate: 220,
    plotHeightMm: 14,
    baselineWander: 0.004,
  });
  return (
    <svg
      viewBox={`0 0 ${widthMm} ${heightMm}`}
      preserveAspectRatio="none"
      className={cn("block", className)}
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
