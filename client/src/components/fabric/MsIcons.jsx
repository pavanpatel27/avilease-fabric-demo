/** Microsoft-style marks for the AviLease Fabric demo (simplified, original SVGs). */

import { useId } from 'react';

export function MsSquares({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

export function FabricMark({ className = 'h-8 w-8' }) {
  const gid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5CE1E6" />
          <stop offset="0.5" stopColor="#00B7C3" />
          <stop offset="1" stopColor="#0078D4" />
        </linearGradient>
      </defs>
      <path fill={`url(#${gid})`} d="M24 2.5 42 13v22L24 45.5 6 35V13L24 2.5Z" />
      <path fill="#fff" fillOpacity="0.92" d="M24 8.2 36.4 15.4v14.4L24 37.1 11.6 29.8V15.4L24 8.2Z" />
      <path fill="#00B7C3" d="M24 8.2 36.4 15.4 24 22.2 11.6 15.4 24 8.2Z" />
      <path fill="#0078D4" d="M24 22.2 36.4 15.4v14.4L24 37.1V22.2Z" />
      <path fill="#00BCF2" d="M24 22.2 11.6 15.4v14.4L24 37.1V22.2Z" />
    </svg>
  );
}

export function SourcesIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#003B51" />
      <rect x="6" y="8" width="20" height="4" rx="1" fill="#50B9A1" />
      <rect x="6" y="14" width="20" height="4" rx="1" fill="#fff" />
      <rect x="6" y="20" width="20" height="4" rx="1" fill="#7FDDD0" />
    </svg>
  );
}

export function SalesforceIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#00A1E0" />
      <ellipse cx="12" cy="17" rx="6" ry="5" fill="#fff" />
      <ellipse cx="20" cy="16" rx="7" ry="6" fill="#fff" />
      <ellipse cx="16" cy="12" rx="5" ry="4.2" fill="#fff" />
    </svg>
  );
}

export function SqlIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#1B4F72" />
      <ellipse cx="16" cy="10" rx="8" ry="3" fill="#fff" />
      <path fill="none" stroke="#fff" strokeWidth="2" d="M8 10v10c0 1.7 3.6 3 8 3s8-1.3 8-3V10" />
    </svg>
  );
}

export function ApiIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#0B3C5D" />
      <path fill="none" stroke="#fff" strokeWidth="2" d="M11 16h10M16 11v10" />
      <circle cx="16" cy="16" r="7" fill="none" stroke="#7FDDD0" strokeWidth="2" />
    </svg>
  );
}

export function PowerBiIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#F2C811" />
      <rect x="7" y="16" width="4" height="9" rx="1" fill="#1A1A1A" />
      <rect x="14" y="11" width="4" height="14" rx="1" fill="#1A1A1A" />
      <rect x="21" y="7" width="4" height="18" rx="1" fill="#1A1A1A" />
    </svg>
  );
}

export function DataFactoryIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#4B9EFF" />
      <rect x="5" y="14" width="8" height="5" rx="1.5" fill="#fff" />
      <rect x="19" y="14" width="8" height="5" rx="1.5" fill="#fff" />
      <rect x="13.5" y="8" width="5" height="5" rx="1.5" fill="#fff" />
      <rect x="13.5" y="20" width="5" height="5" rx="1.5" fill="#fff" />
      <path stroke="#fff" strokeWidth="1.6" d="M13 16.5H19M16 13v3.2M16 19.2V16.5" />
    </svg>
  );
}

export function OneLakeIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#00B7C3" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        d="M6 20c2.5-3 5-4.5 10-4.5S23.5 17 26 20"
      />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        d="M6 14c2.5-3 5-4.5 10-4.5S23.5 11 26 14"
      />
      <path fill="#fff" d="M6 23h20v3H6z" opacity="0.9" />
    </svg>
  );
}

export function WarehouseIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#0078D4" />
      <ellipse cx="16" cy="10" rx="8" ry="3.2" fill="#fff" />
      <path fill="none" stroke="#fff" strokeWidth="2" d="M8 10v8c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2v-8" />
      <path fill="none" stroke="#fff" strokeWidth="2" d="M8 14c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2" />
    </svg>
  );
}

export function LakehouseIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#117865" />
      <path fill="#fff" d="M8 20 16 8l8 12H8Z" />
      <rect x="10" y="20" width="12" height="5" rx="1" fill="#7FDDD0" />
    </svg>
  );
}

export function RealTimeIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#8764B8" />
      <path fill="#fff" d="M18 6 8 18h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  );
}

export function DataEngIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#CA5010" />
      <circle cx="10" cy="16" r="3" fill="#fff" />
      <circle cx="22" cy="10" r="2.4" fill="#fff" />
      <circle cx="22" cy="22" r="2.4" fill="#fff" />
      <path stroke="#fff" strokeWidth="1.8" d="M12.8 14.6 19.6 11.2M12.8 17.4 19.6 20.8" />
    </svg>
  );
}

export function DatabasesIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#498205" />
      <rect x="8" y="8" width="16" height="4" rx="1" fill="#fff" />
      <rect x="8" y="14" width="16" height="4" rx="1" fill="#fff" opacity="0.75" />
      <rect x="8" y="20" width="16" height="4" rx="1" fill="#fff" opacity="0.5" />
    </svg>
  );
}

export function CopilotIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#B4A0FF" />
      <path
        fill="#5B2BE0"
        d="M16 7c2.2 3.4 4.6 4.6 8 5-3.4.4-5.8 1.6-8 5-2.2-3.4-4.6-4.6-8-5 3.4-.4 5.8-1.6 8-5Z"
      />
    </svg>
  );
}

export function TeamsIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#5059C9" />
      <rect x="6" y="11" width="12" height="12" rx="2" fill="#fff" />
      <circle cx="22" cy="12" r="4" fill="#7B83EB" />
      <rect x="18" y="16" width="8" height="8" rx="2" fill="#7B83EB" />
    </svg>
  );
}

export function ExcelIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#217346" />
      <path
        fill="#fff"
        d="M10 10h4.2l2 4.4L18.4 10H22l-4.2 6 4.4 6h-4.3l-2.2-4.6L13.6 22H10l4.3-6L10 10Z"
      />
    </svg>
  );
}

export function EntraIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#0078D4" />
      <circle cx="16" cy="12" r="4" fill="#fff" />
      <path fill="#fff" d="M8 24c1.2-4 4-6 8-6s6.8 2 8 6H8Z" />
    </svg>
  );
}

export const WORKLOADS = [
  {
    id: 'df',
    name: 'Data Factory',
    blurb: 'Pull Leaseworks, Core Financial, Aerlytix on a schedule.',
    href: 'https://www.microsoft.com/en-ie/microsoft-fabric',
    Icon: DataFactoryIcon,
    used: true,
  },
  {
    id: 'ol',
    name: 'OneLake',
    blurb: 'One copy of the data. No extra Excel extracts.',
    href: 'https://www.microsoft.com/en-ie/microsoft-fabric',
    Icon: OneLakeIcon,
    used: true,
  },
  {
    id: 'lh',
    name: 'Lakehouse',
    blurb: 'Clean the fleet once — then everyone uses it.',
    href: 'https://www.microsoft.com/en-ie/microsoft-fabric',
    Icon: LakehouseIcon,
    used: true,
  },
  {
    id: 'wh',
    name: 'Data Warehouse',
    blurb: 'SQL for finance and the fleet register.',
    href: 'https://www.microsoft.com/en-ie/microsoft-fabric',
    Icon: WarehouseIcon,
    used: true,
  },
  {
    id: 'pbi',
    name: 'Power BI',
    blurb: 'Board packs on the same numbers as ops.',
    href: 'https://www.microsoft.com/en-ie/microsoft-fabric',
    Icon: PowerBiIcon,
    used: true,
  },
  {
    id: 'rti',
    name: 'Real-Time Intelligence',
    blurb: 'Alerts when an aircraft is coming off lease.',
    href: 'https://www.microsoft.com/en-ie/microsoft-fabric',
    Icon: RealTimeIcon,
    used: false,
  },
];
