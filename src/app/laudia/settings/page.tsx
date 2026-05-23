export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Ajustes</h1>
      <p className="text-gray-600">
        Aquí podrás configurar tus preferencias para la experiencia de oración.
      </p>
      <div className="mt-8 space-y-4">
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Modo de texto</h3>
          <p className="text-gray-600">
            Próximamente: opciones para ajustar el tamaño y tipo de letra.
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Notificaciones</h3>
          <p className="text-gray-600">
            Próximamente: recordatorios para la hora de la oración.
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Datos y privacidad</h3>
          <p className="text-gray-600">
            Próximamente: gestión de datos y preferencias de privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}