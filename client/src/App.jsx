import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import TopBar from './components/TopBar';
import FleetOverview from './components/FleetOverview';
import InspectPage from './components/InspectPage';
import PipelinePage from './components/PipelinePage';
import AnalyticsPage from './components/AnalyticsPage';
import FabricPage from './components/FabricPage';
import ArchitecturePage from './components/ArchitecturePage';
import SystemsDemoPage from './components/SystemsDemoPage';

export default function App() {
  const [page, setPage] = useState('architecture');
  const [meta, setMeta] = useState(null);
  const [inspectReg, setInspectReg] = useState(null);

  const onMeta = useCallback((m) => setMeta(m), []);
  const clearInspectInitial = useCallback(() => setInspectReg(null), []);

  useEffect(() => {
    api.pipeline().catch(() => {});
  }, []);

  function openInspect(registration) {
    setInspectReg(registration);
    setPage('inspect');
  }

  return (
    <div className="min-h-screen bg-prodigy-soft">
      <TopBar page={page} setPage={setPage} meta={meta} />
      <main className="mx-auto max-w-6xl p-4 md:p-8">
        {page === 'architecture' && (
          <ArchitecturePage
            onConfigure={() => setPage('configure')}
            onPipeline={() => setPage('pipeline')}
          />
        )}
          {page === 'configure' && (
            <FabricPage
              onGoPipeline={() => setPage('pipeline')}
              onAnalytics={() => setPage('analytics')}
            />
          )}
        {page === 'systems' && (
          <SystemsDemoPage onAnalytics={() => setPage('analytics')} onInspect={openInspect} />
        )}
        {page === 'overview' && (
          <FleetOverview onMeta={onMeta} onInspect={openInspect} />
        )}
        {page === 'inspect' && (
          <InspectPage initialReg={inspectReg} onClearInitial={clearInspectInitial} />
        )}
        {page === 'pipeline' && <PipelinePage />}
        {page === 'analytics' && <AnalyticsPage />}
      </main>
    </div>
  );
}
