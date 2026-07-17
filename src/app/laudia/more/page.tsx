import { Link } from 'react-router-dom';

const destinations = [
  {
    to: '/laudia/evangelio',
    eyebrow: 'Lectura del día',
    title: 'Evangelio',
    description: 'Lee el Evangelio de hoy o consulta otra fecha.',
    image: '/images/navigation/pray-nordic.jpg',
    icon: 'M5 4.5A2.5 2.5 0 0 1 7.5 2H12v18H7.5A2.5 2.5 0 0 0 5 22V4.5Zm14 0A2.5 2.5 0 0 0 16.5 2H12v18h4.5a2.5 2.5 0 0 1 2.5 2V4.5Z',
    tone: 'green',
  },
  {
    to: '/laudia/liturgia',
    eyebrow: 'Ciclos y tiempos',
    title: 'Liturgia',
    description: 'Documentos y lecturas organizados por tiempo litúrgico.',
    image: '/images/navigation/calendar-nordic.jpg',
    icon: 'M7 3h7l5 5v13H7V3Zm7 0v5h5M10 13h6M10 17h6',
    tone: 'violet',
  },
  {
    to: '/laudia/library',
    eyebrow: 'Para volver después',
    title: 'Biblioteca',
    description: 'Tus textos, oraciones y recursos en un solo lugar.',
    image: '/images/navigation/explore-nordic.jpg',
    icon: 'M5 4h4v16H5V4Zm5.5 0h4v16h-4V4Zm5.5 1 3.5-1 2.5 15-3.5 1L16 5Z',
    tone: 'amber',
  },
  {
    to: '/laudia/settings',
    eyebrow: 'A tu manera',
    title: 'Ajustes',
    description: 'Lectura, apariencia, recordatorios y modo de oración.',
    image: '/images/navigation/today-nordic.jpg',
    icon: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-12v2m0 13v2m8.5-8.5h-2m-13 0h-2m14.5-6-1.5 1.5m-9 9L6 18m12 0-1.5-1.5m-9-9L6 6',
    tone: 'stone',
  },
];

export default function MorePage() {
  return (
    <div className="laudia-page">
      <div className="laudia-page-inner max-w-3xl">
        <header className="mb-7">
          <p className="laudia-kicker">Explora LaudIA</p>
          <h1 className="laudia-display mt-2">Todo lo que acompaña tu oración.</h1>
          <p className="laudia-lead mt-3">
            Recursos claros, accesibles y ordenados para cuando los necesites.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          {destinations.map(item => (
            <Link key={item.to} to={item.to} className="laudia-destination-card group">
              <span className="laudia-destination-picture">
                <img src={item.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <span className={`laudia-destination-icon tone-${item.tone}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d={item.icon} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="laudia-kicker text-[10px]">{item.eyebrow}</span>
                <span className="block text-lg font-semibold text-stone-900 mt-1">{item.title}</span>
                <span className="block text-sm leading-relaxed text-stone-500 mt-1">{item.description}</span>
              </span>
              <span className="text-stone-300 group-hover:text-stone-700 transition-colors" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>

        <div className="laudia-quiet-note mt-6">
          <span className="laudia-status-dot" />
          <span>La aplicación puede instalarse y usarse como PWA en tu teléfono.</span>
        </div>
      </div>
    </div>
  );
}
