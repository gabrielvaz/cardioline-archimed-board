/**
 * Conjunto de icones desenhado para este prototipo.
 *
 * Sem biblioteca externa: grid de 24 px, traco de 1.5, terminais arredondados.
 * Mantidos geometricos e discretos para nao competir com o conteudo clinico.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconHome = (p: IconProps) => (
  <Icon {...p}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /></Icon>
);
export const IconExams = (p: IconProps) => (
  <Icon {...p}><path d="M4 6h16M4 12h16M4 18h10" /><circle cx="19" cy="18" r="2" /></Icon>
);
export const IconPatients = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></Icon>
);
export const IconReports = (p: IconProps) => (
  <Icon {...p}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h4" /></Icon>
);
export const IconDevices = (p: IconProps) => (
  <Icon {...p}><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></Icon>
);
export const IconAnalytics = (p: IconProps) => (
  <Icon {...p}><path d="M4 20V9M10 20V4M16 20v-7M22 20H2" /></Icon>
);
export const IconPulse = (p: IconProps) => (
  <Icon {...p}><path d="M2 12h4l2-5 3 10 3-7 2 2h6" /></Icon>
);
export const IconSearch = (p: IconProps) => (
  <Icon {...p}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></Icon>
);
export const IconBell = (p: IconProps) => (
  <Icon {...p}><path d="M6 16V10a6 6 0 1 1 12 0v6l1.5 2.5h-15z" /><path d="M10 21h4" /></Icon>
);
export const IconChevronDown = (p: IconProps) => (
  <Icon {...p}><path d="m6 9.5 6 5.5 6-5.5" /></Icon>
);
export const IconArrowRight = (p: IconProps) => (
  <Icon {...p}><path d="M4 12h15M13.5 6l6 6-6 6" /></Icon>
);
export const IconArrowDown = (p: IconProps) => (
  <Icon {...p}><path d="M12 4v15M6 13.5l6 6 6-6" /></Icon>
);
export const IconCheck = (p: IconProps) => (
  <Icon {...p}><path d="m5 12.5 4.5 4.5L19 7" /></Icon>
);
export const IconLock = (p: IconProps) => (
  <Icon {...p}><rect x="5" y="10.5" width="14" height="10" rx="1.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></Icon>
);
export const IconShield = (p: IconProps) => (
  <Icon {...p}><path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z" /><path d="m9 12 2.2 2.2L15.5 10" /></Icon>
);
export const IconCloud = (p: IconProps) => (
  <Icon {...p}><path d="M7 18a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.6 1.2A3.6 3.6 0 0 1 17.5 18z" /></Icon>
);
export const IconConnect = (p: IconProps) => (
  <Icon {...p}><path d="M9 6V3M15 6V3M8 6h8v5a4 4 0 0 1-4 4 4 4 0 0 1-4-4z" /><path d="M12 15v6" /></Icon>
);
export const IconLayers = (p: IconProps) => (
  <Icon {...p}><path d="m12 3 8 4.5-8 4.5-8-4.5z" /><path d="m4 12.5 8 4.5 8-4.5" /><path d="m4 17 8 4.5 8-4.5" /></Icon>
);
export const IconBuilding = (p: IconProps) => (
  <Icon {...p}><path d="M4 21V6l7-3v18M11 21h9V10l-9-4" /><path d="M14.5 13h2M14.5 17h2M7 10h1M7 14h1M7 18h1" /></Icon>
);
export const IconUsers = (p: IconProps) => (
  <Icon {...p}><circle cx="9" cy="8.5" r="3" /><path d="M3 19.5a6 6 0 0 1 12 0" /><path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 14.2A5 5 0 0 1 21 19.5" /></Icon>
);
export const IconCompare = (p: IconProps) => (
  <Icon {...p}><rect x="3" y="5" width="7.5" height="14" rx="1.5" /><rect x="13.5" y="5" width="7.5" height="14" rx="1.5" /><path d="M12 3.5v17" strokeDasharray="2 2.5" /></Icon>
);
export const IconScan = (p: IconProps) => (
  <Icon {...p}><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" /><path d="M7 12h2l1.5-3 2 6 1.5-3h3" /></Icon>
);
export const IconTimeline = (p: IconProps) => (
  <Icon {...p}><path d="M3 12h18" /><circle cx="7" cy="12" r="2" /><circle cx="13" cy="12" r="2" /><circle cx="19" cy="12" r="2" /><path d="M7 10V6M13 14v4M19 10V6" strokeDasharray="2 2" /></Icon>
);
export const IconTemplate = (p: IconProps) => (
  <Icon {...p}><rect x="3.5" y="4" width="17" height="16" rx="1.5" /><path d="M3.5 9h17M9 9v11" /></Icon>
);
export const IconMonitor = (p: IconProps) => (
  <Icon {...p}><rect x="2.5" y="4.5" width="19" height="12.5" rx="1.5" /><path d="M8.5 21h7M12 17v4" /></Icon>
);
export const IconTablet = (p: IconProps) => (
  <Icon {...p}><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M11 18h2" /></Icon>
);
export const IconLaptop = (p: IconProps) => (
  <Icon {...p}><rect x="4.5" y="5" width="15" height="10" rx="1.5" /><path d="M2 18.5h20" /></Icon>
);
export const IconGlobe = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.1 0 17M12 3.5c-2.5 2.4-2.5 14.1 0 17" /></Icon>
);
export const IconKey = (p: IconProps) => (
  <Icon {...p}><circle cx="8" cy="12" r="4" /><path d="M12 12h9M17.5 12v3.5M20 12v2.5" /></Icon>
);
export const IconNetwork = (p: IconProps) => (
  <Icon {...p}><rect x="9" y="3" width="6" height="5" rx="1" /><rect x="2.5" y="16" width="6" height="5" rx="1" /><rect x="15.5" y="16" width="6" height="5" rx="1" /><path d="M12 8v4M5.5 16v-2.5h13V16" /></Icon>
);
export const IconDatabase = (p: IconProps) => (
  <Icon {...p}><ellipse cx="12" cy="6" rx="7.5" ry="3" /><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" /></Icon>
);
export const IconAudit = (p: IconProps) => (
  <Icon {...p}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /><circle cx="11.5" cy="13.5" r="2.5" /><path d="m13.5 15.5 2 2" /></Icon>
);
export const IconGear = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M12 3v2.5M12 18.5V21M4.2 7.5l2.2 1.3M17.6 15.2l2.2 1.3M4.2 16.5l2.2-1.3M17.6 8.8l2.2-1.3" /></Icon>
);
export const IconMenu = (p: IconProps) => (
  <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>
);
export const IconClose = (p: IconProps) => (
  <Icon {...p}><path d="M6 6l12 12M18 6 6 18" /></Icon>
);
export const IconPrint = (p: IconProps) => (
  <Icon {...p}><path d="M7 8V3h10v5" /><rect x="3.5" y="8" width="17" height="7" rx="1.5" /><path d="M7 13h10v8H7z" /></Icon>
);
export const IconDownload = (p: IconProps) => (
  <Icon {...p}><path d="M12 3v11M7.5 10 12 14.5 16.5 10M4 20h16" /></Icon>
);
export const IconClock = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5.2l3.4 2" /></Icon>
);
export const IconSupport = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.5" /><path d="m6 6 3.5 3.5M18 6l-3.5 3.5M6 18l3.5-3.5M18 18l-3.5-3.5" /></Icon>
);
export const IconMapPin = (p: IconProps) => (
  <Icon {...p}><path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z" /><circle cx="12" cy="10" r="2.5" /></Icon>
);
export const IconStethoscope = (p: IconProps) => (
  <Icon {...p}><path d="M5 3v5a4 4 0 0 0 8 0V3" /><path d="M9 12v3a5 5 0 0 0 5 5 5 5 0 0 0 5-5v-2" /><circle cx="19" cy="8" r="2.2" /></Icon>
);
export const IconFilter = (p: IconProps) => (
  <Icon {...p}><path d="M4 6h16l-6 7v6l-4-2v-4z" /></Icon>
);
