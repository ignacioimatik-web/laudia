import { useState } from 'react';

export default function ModeSelector() {
  const [mode, setMode] = useState<'estandar' | 'guia'>('estandar');

  return (
    <div className="laudia-card p-5 animate-fade-in">
      <h2 className="laudia-h2 mb-3">Modo de uso</h2>
      <div className="flex gap-2">
        <button
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${mode === 'estandar'
              ? 'bg-stone-800 text-white shadow-sm'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}
          onClick={() => setMode('estandar')}
        >
          Estándar
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${mode === 'guia'
              ? 'bg-stone-800 text-white shadow-sm'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}
          onClick={() => setMode('guia')}
        >
          Guía
        </button>
      </div>
      {mode === 'guia' && (
        <div className="mt-3 p-3 bg-blue-50/60 border-l-2 border-blue-300 rounded-r-lg text-sm text-stone-600 space-y-1 animate-fade-in">
          <p>En modo guía, se mostrarán explicaciones breves sobre cada parte de la oración.</p>
          <p className="text-xs text-stone-400 italic">Los comentarios no sustituyen los textos oficiales.</p>
        </div>
      )}
    </div>
  );
}
