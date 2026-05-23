import { LiturgicalBadge } from './LiturgicalBadge';

export default function TodayCard() {
  // Mock data - in real app, this would come from services
  const today = new Date();
  const civilDate = today.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <LiturgicalBadge color="blue" />
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Laudes de hoy</h2>
          <p className="text-sm text-gray-500">{civilDate}</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="bg-gray-100 px-2 py-1 rounded-full">Tiempo de Navidad</span>
            <span className="bg-gray-100 px-2 py-1 rounded-full">Semana 1 del Salterio</span>
            <span className="bg-gray-100 px-2 py-1 rounded-full">Solemnidad de María, Madre de Dios</span>
          </div>
        </div>
      </div>
    </div>
  );
}