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

/**
 * Sequência de exames do mesmo paciente.
 *
 * Sem datas de propósito: a apresentação não põe linha do tempo em lugar nenhum,
 * e o argumento é a acumulação de registros, não o calendário.
 */
export type ExamRef = {
  /** Posição na sequência, do mais antigo ao mais recente. */
  index: number;
  seed: number;
  /** Rótulo curto e ilustrativo — nunca uma conclusão diagnóstica. */
  note?: string;
};

export const EXAM_SEQUENCE: readonly ExamRef[] = [
  { index: 0, seed: 311 },
  { index: 1, seed: 417 },
  { index: 2, seed: 523 },
  { index: 3, seed: 629 },
  { index: 4, seed: 735, note: "Change detected" },
] as const;

export const SYNTHETIC_NOTE = "Illustrative — synthetic data";
export const CONCEPTUAL_NOTE = "Conceptual — not a clinical claim";
