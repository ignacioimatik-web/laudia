export default function CalendarPreview() {
  return (
    <div className="laudia-card p-5 animate-fade-in">
      <h2 className="laudia-h2 mb-4">Calendario</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-500">Hoy</span>
          <span className="text-stone-700 font-medium">Solemnidad de María, Madre de Dios</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-500">Mañana</span>
          <span className="text-stone-700">San Basilio y San Gregorio</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-500">Pasado</span>
          <span className="text-stone-700">Santísimo Nombre de Jesús</span>
        </div>
      </div>
      <button className="laudia-btn-ghost mt-4 w-full justify-center">
        Ver calendario completo
      </button>
    </div>
  );
}
