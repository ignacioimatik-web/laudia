export default function ModeSelector() {
  const [mode, setMode] = React.useState<'standard' | 'guide'>('standard');

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Modo de uso</h2>
      <div className="flex space-x-3">
        <button
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors 
          ${mode === 'standard' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setMode('standard')}
        >
          Estándar
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors 
          ${mode === 'guide' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setMode('guide')}
        >
          Guía
        </button>
      </div>
      {mode === 'guide' && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-sm text-blue-800">
            En modo guía, se mostrarán explicaciones breves sobre cada parte de la oración.
            Estos comentarios son de carácter informativo y no sustituyen los textos oficiales.
          </p>
        </div>
      )}
    </div>
  );
}