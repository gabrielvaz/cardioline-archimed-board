/**
 * Dados sinteticos do prototipo.
 *
 * Todos os pacientes, exames, identificadores e dispositivos aqui sao
 * FICTICIOS e foram inventados para esta demonstracao. Nenhuma informacao
 * de paciente real, nenhum sinal real e nenhum dado clinico real foi usado.
 */

import type { Morphology } from "./ecg";

export type ExamType = "Resting ECG" | "Holter" | "ABPM" | "Stress ECG";

export type ExamStatus = "New" | "Ready to review" | "In review" | "Reported";

export type Exam = {
  id: string;
  patient: string;
  patientId: string;
  sex: "F" | "M";
  age: number;
  type: ExamType;
  device: string;
  acquired: string;
  status: ExamStatus;
  assignedTo: string | null;
  priority?: boolean;
  bpm: number;
  morphology?: Morphology;
};

/** Pacientes ficticios — nomes escolhidos para refletir o mercado europeu. */
export const exams: Exam[] = [
  {
    id: "EX-48213",
    patient: "Emma Rossi",
    patientId: "PT-100482",
    sex: "F",
    age: 61,
    type: "Resting ECG",
    device: "ECG200L · Room 2",
    acquired: "Today, 09:14",
    status: "Ready to review",
    assignedTo: null,
    priority: true,
    bpm: 96,
    morphology: "stDepression",
  },
  {
    id: "EX-48210",
    patient: "Luca Bianchi",
    patientId: "PT-100311",
    sex: "M",
    age: 54,
    type: "Holter",
    device: "clickholter · Cart A",
    acquired: "Today, 08:40",
    status: "New",
    assignedTo: null,
    bpm: 72,
  },
  {
    id: "EX-48207",
    patient: "Sofia Martin",
    patientId: "PT-099874",
    sex: "F",
    age: 47,
    type: "ABPM",
    device: "walk200b · Unit 4",
    acquired: "Today, 08:02",
    status: "In review",
    assignedTo: "Dr. A. Ferrari",
    bpm: 68,
  },
  {
    id: "EX-48199",
    patient: "Daniel Weber",
    patientId: "PT-098210",
    sex: "M",
    age: 66,
    type: "Stress ECG",
    device: "cardioconsolle · Lab 1",
    acquired: "Yesterday, 17:35",
    status: "In review",
    assignedTo: "Dr. M. Conti",
    bpm: 128,
    morphology: "stDepression",
  },
  {
    id: "EX-48188",
    patient: "Anna Schmidt",
    patientId: "PT-097655",
    sex: "F",
    age: 38,
    type: "Resting ECG",
    device: "ECG200L · Room 1",
    acquired: "Yesterday, 15:12",
    status: "Reported",
    assignedTo: "Dr. A. Ferrari",
    bpm: 64,
  },
  {
    id: "EX-48176",
    patient: "Hugo Almeida",
    patientId: "PT-096402",
    sex: "M",
    age: 72,
    type: "Holter",
    device: "walk free · Unit 2",
    acquired: "Yesterday, 11:48",
    status: "Reported",
    assignedTo: "Dr. M. Conti",
    bpm: 58,
    morphology: "flatT",
  },
];

/**
 * Marcador na cor cheia, rotulo na variante -ink: a cor cheia sobre o proprio
 * tint reprovava no contraste (ready 2,81:1, reported 3,71:1, review 4,15:1).
 */
export const statusStyles: Record<ExamStatus, { dot: string; text: string; bg: string }> = {
  New: { dot: "bg-status-new", text: "text-status-new-ink", bg: "bg-status-new/8" },
  "Ready to review": {
    dot: "bg-status-ready",
    text: "text-status-ready-ink",
    bg: "bg-status-ready/10",
  },
  "In review": { dot: "bg-status-review", text: "text-status-review-ink", bg: "bg-status-review/8" },
  Reported: { dot: "bg-status-reported", text: "text-status-reported-ink", bg: "bg-status-reported/8" },
};

export type ConnectedDevice = {
  name: string;
  modality: ExamType;
  location: string;
  state: "Online" | "Syncing" | "Idle";
  lastSync: string;
};

/** Nomes de dispositivo correspondem a produtos Cardioline reais. */
export const devices: ConnectedDevice[] = [
  { name: "ECG200L", modality: "Resting ECG", location: "Room 2", state: "Online", lastSync: "2 min ago" },
  { name: "clickholter", modality: "Holter", location: "Cart A", state: "Syncing", lastSync: "now" },
  { name: "walk200b", modality: "ABPM", location: "Unit 4", state: "Online", lastSync: "14 min ago" },
  { name: "cardioconsolle", modality: "Stress ECG", location: "Lab 1", state: "Idle", lastSync: "1 h ago" },
];

/** Historico longitudinal ficticio para a visao de linha de tempo do paciente. */
export type TimelineEntry = {
  date: string;
  label: string;
  type: ExamType;
  detail: string;
  key?: string;
  current?: boolean;
};

export const patientTimeline: TimelineEntry[] = [
  { date: "Mar 2023", label: "Resting ECG", type: "Resting ECG", detail: "Sinus rhythm · HR 74", key: "QTc 402 ms" },
  { date: "Nov 2023", label: "ABPM", type: "ABPM", detail: "24 h mean 128/79 mmHg", key: "Non-dipper pattern" },
  { date: "Jun 2024", label: "Resting ECG", type: "Resting ECG", detail: "Sinus rhythm · HR 81", key: "QTc 415 ms" },
  { date: "Feb 2025", label: "Holter", type: "Holter", detail: "48 h · 112 isolated PVCs", key: "Burden 0.4%" },
  { date: "Today", label: "Resting ECG", type: "Resting ECG", detail: "Sinus rhythm · HR 96", key: "QTc 431 ms", current: true },
];

export const dashboardStats = [
  { label: "Waiting for review", value: 14, accent: true, delta: "+3 since 08:00" },
  { label: "Completed today", value: 27, delta: "9 by you" },
  { label: "Priority", value: 2, priority: true, delta: "Flagged for attention" },
  { label: "Devices connected", value: 4, delta: "All sites reporting" },
];

/** Modalidades que convergem para o mesmo workspace. */
export const modalities: {
  type: ExamType;
  device: string;
  image: string;
  steps: [string, string, string, string];
  blurb: string;
}[] = [
  {
    type: "Resting ECG",
    device: "ECG200L",
    image: "/devices/ecg200l-cover-02.png",
    steps: ["Acquire", "Sync", "Review", "Report"],
    blurb: "Twelve-lead acquisition at the point of care, available for review before the patient leaves the room.",
  },
  {
    type: "Holter",
    device: "clickholter",
    image: "/devices/clickholter-cover.png",
    steps: ["Record", "Upload", "Analyze", "Report"],
    blurb: "Long-term recordings upload on return, with beat classification ready when the cardiologist opens the study.",
  },
  {
    type: "ABPM",
    device: "walk200b",
    image: "/devices/walk200b-cover.png",
    steps: ["Monitor", "Sync", "Review trends", "Report"],
    blurb: "Ambulatory pressure series arrive as trends and day-night profiles, not as a file to be interpreted by hand.",
  },
  {
    type: "Stress ECG",
    device: "cardioconsolle",
    image: "/devices/cardioconsolle-cover-02.png",
    steps: ["Acquire", "Review", "Compare", "Manage results"],
    blurb: "Exercise protocols land in the same worklist, with stage-by-stage traces kept alongside the resting baseline.",
  },
];
