export default function CalendarPreview() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Calendario litúrgico</h2>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Hoy:</span>
          <span className="text-gray-600">Solemnidad de María, Madre de Dios</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Mañana:</span>
          <span className="text-gray-600">San Basilio el Grande y San Gregorio Nacianceno</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Pasado mañana:</span>
          <span className="text-gray-600">Santísimo Nombre de Jesús</span>
        </div>
      </div>
      <button 
        className="w-full mt-4 border border-gray-300 bg-white py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
      >
        Ver calendario completo
      </button>
    </div>
  );
}