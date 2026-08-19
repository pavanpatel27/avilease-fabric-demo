export default function CollabFooter() {
  return (
    <footer className="mt-10 border-t border-[#E4D9C8] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-prodigy-muted md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          A collaboration briefing ·{' '}
          <a
            href="https://avilease.com/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-avi-deep hover:underline"
          >
            AviLease
          </a>
          {' '}
          ×{' '}
          <span className="font-semibold text-prodigy-crimson">Prodigy</span>
          {' '}
          · Microsoft Fabric
        </p>
        <p className="text-[11px]">
          Confidential demo · figures on the cover match the public site; fleet rows are sample data
        </p>
      </div>
      <div className="border-t border-[#E4D9C8]/80 bg-[#FAF7F1]">
        <p className="mx-auto max-w-6xl px-4 py-3 text-center text-[11px] text-prodigy-muted md:px-8">
          Prepared by{' '}
          <span className="font-semibold text-avi-deep">Pavan Patel</span>
          {' · '}
          Development Manager
          {' · '}
          <span className="font-semibold text-prodigy-crimson">Prodigy</span>
        </p>
      </div>
    </footer>
  );
}
