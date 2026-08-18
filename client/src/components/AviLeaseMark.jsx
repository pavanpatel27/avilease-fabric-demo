/** AviLease-inspired wordmark for the collaboration demo (not the official logo file). */

export function AviLeaseMark({ className = 'h-8' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 36 36" className="h-8 w-8 shrink-0" aria-hidden>
        <circle cx="18" cy="18" r="18" fill="#003B51" />
        <path fill="#C5A572" d="M18 7 28 27h-4.2l-1.6-3.4H13.8L12.2 27H8L18 7Zm0 8.2-2.6 5.4h5.2L18 15.2Z" />
      </svg>
      <span className="text-[17px] font-semibold tracking-tight text-[#003B51]">
        AviLease
      </span>
    </span>
  );
}

export function CollabLockup({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <AviLeaseMark />
      <span className={`text-sm font-light ${light ? 'text-white/50' : 'text-[#C5A572]'}`}>×</span>
      <span className="text-lg font-bold lowercase tracking-tight text-prodigy-crimson">
        prodigy
      </span>
    </div>
  );
}
