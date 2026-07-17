import { useServiceWorker } from '@/hooks/laudia/useServiceWorker';

export function SwUpdatePrompt() {
  const {
    offlineReady,
    needRefresh,
    updateServiceWorker,
    close,
  } = useServiceWorker();

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-50 flex justify-center animate-slide-down">
      <div className="laudia-card-elevated px-5 py-3.5 flex items-center gap-4 shadow-lg max-w-md w-full">
        <p className="text-sm text-stone-700 flex-1">
          {needRefresh
            ? 'Nueva versión disponible'
            : 'App lista para usar sin conexión'}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          {needRefresh && (
            <button
              onClick={() => updateServiceWorker(true)}
              className="laudia-btn-primary text-xs !px-3 !py-1.5"
            >
              Actualizar
            </button>
          )}
          <button
            onClick={close}
            className="laudia-btn-ghost text-xs !px-2 !py-1"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
