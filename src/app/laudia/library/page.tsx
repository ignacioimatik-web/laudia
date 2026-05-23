export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Biblioteca de textos litúrgicos</h1>
      <p className="text-gray-600">
        Aquí podrás acceder a los textos oficiales de la Liturgia de las Horas, 
        organizados por temporada y por tipo de texto.
      </p>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Próximamente:</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Salterio completo con antífonas</li>
          <li>Lecturas bíblicas del ciclo litúrgico</li>
          <li>Himnos de la Liturgia de las Horas</li>
          <li>Oraciones y preces</li>
          <li>Textos propios de santidades y festividades</li>
        </ul>
      </div>
    </div>
  );
}