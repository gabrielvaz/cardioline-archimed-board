/**
 * Dados clínicos fictícios.
 *
 * Nenhum dado real de paciente, nunca. Os nomes são sintéticos e europeus/neutros
 * para combinar com o mercado da Cardioline, e todo componente que exibe valor
 * clínico carrega a nota "Illustrative — synthetic data".
 */

export type Patient = {
  id: string;
  name: string;
  age: number;
  sex: "F" | "M";
  synthetic: true;
};

export const PATIENTS: readonly Patient[] = [
  { id: "p-ferrero", name: "M. Ferrero", age: 64, sex: "M", synthetic: true },
  { id: "p-lindqvist", name: "A. Lindqvist", age: 58, sex: "F", synthetic: true },
  { id: "p-okafor", name: "J. Okafor", age: 71, sex: "M", synthetic: true },
  { id: "p-bianchi", name: "R. Bianchi", age: 47, sex: "F", synthetic: true },
  { id: "p-novak", name: "S. Novak", age: 69, sex: "M", synthetic: true },
] as const;

export type ExamKind = "ECG" | "Holter" | "ABPM" | "Stress";

export type ExamRef = {
  year: number;
  kind: ExamKind;
  /** Rótulo curto, ilustrativo — nunca uma conclusão diagnóstica. */
  note?: string;
};

/** Histórico longitudinal do slide 15. */
export const LONGITUDINAL: readonly ExamRef[] = [
  { year: 2027, kind: "ECG" },
  { year: 2028, kind: "ECG", note: "axis shift" },
  { year: 2029, kind: "Holter" },
  { year: 2030, kind: "ABPM" },
  { year: 2031, kind: "ECG", note: "T-wave change" },
] as const;

export const SYNTHETIC_NOTE = "Illustrative — synthetic data";
export const CONCEPTUAL_NOTE = "Conceptual — not a clinical claim";
