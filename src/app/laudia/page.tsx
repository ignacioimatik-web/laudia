import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const primaryNav = [
  {
    to: '/laudia/today',
    label: 'Hoy',
    image: '/images/navigation/today-nordic.jpg',
    description: 'Tu mañana, de un vistazo',
  },
  {
    to: '/laudia/pray',
    label: 'Rezar',
    image: '/images/navigation/pray-nordic.jpg',
    description: 'Laudes, paso a paso',
  },
  {
    to: '/laudia/calendar',
    label: 'Calendario',
    image: '/images/navigation/calendar-nordic.jpg',
    description: 'El ritmo de cada día',
  },
  {
    to: '/laudia/more',
    label: 'Explorar',
    image: '/images/navigation/explore-nordic.jpg',
    description: 'Lecturas y recursos',
  },
];

const secondaryRouteDetails = [
  {
    path: '/laudia/evangelio',
    label: 'Evangelio',
    description: 'La Palabra del día',
    image: '/images/navigation/pray-nordic.jpg',
  },
  {
    path: '/laudia/liturgia',
    label: 'Liturgia',
    description: 'Ciclos, tiempos y documentos',
    image: '/images/navigation/calendar-nordic.jpg',
  },
  {
    path: '/laudia/library',
    label: 'Biblioteca',
    description: 'Aprende y profundiza',
    image: '/images/navigation/explore-nordic.jpg',
  },
  {
    path: '/laudia/settings',
    label: 'Ajustes',
    description: 'Una experiencia a tu medida',
    image: '/images/navigation/explore-nordic.jpg',
  },
];

export default function LaudiaPage() {
  const location = useLocation();
  const secondaryRoute = secondaryRouteDetails.find(route => location.pathname.startsWith(route.path));
  const isSecondaryRoute = Boolean(secondaryRoute);
  const currentPrimary = primaryNav.find(item => location.pathname.startsWith(item.to))
    ?? (isSecondaryRoute ? primaryNav[3] : primaryNav[0]);
  const currentRoute = secondaryRoute ?? currentPrimary;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen laudia-app-shell flex flex-col">
      <header className="laudia-topbar no-select">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <NavLink to="/laudia/today" className="flex items-center gap-2.5 text-stone-800 shrink-0">
            <span className="laudia-brand-mark" aria-hidden="true"><span /></span>
            <span className="font-semibold tracking-[-0.03em]">LaudIA</span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1.5">
            {primaryNav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `laudia-desktop-link ${isActive || (item.to.endsWith('/more') && isSecondaryRoute) ? 'is-active' : ''}`
                }
              >
                <img src={item.image} alt="" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {isSecondaryRoute ? (
            <Link to="/laudia/more" className="laudia-topbar-back md:hidden" aria-label="Volver a Explorar">
              <span aria-hidden="true">←</span>
              Explorar
            </Link>
          ) : (
            <span className="md:hidden text-[10px] uppercase tracking-[0.16em] text-stone-500 font-semibold">
              {currentRoute.label}
            </span>
          )}
        </div>
      </header>

      <main className="flex-1">
        <section className="laudia-route-guide" aria-label={`Sección ${currentRoute.label}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="laudia-route-guide-inner">
              <img src={currentRoute.image} alt="" aria-hidden="true" />
              <div className="min-w-0">
                <span>{isSecondaryRoute ? 'Explorar' : 'Estás en'}</span>
                <strong>{currentRoute.label}</strong>
                <p>{currentRoute.description}</p>
              </div>
              {isSecondaryRoute && (
                <Link to="/laudia/more" className="laudia-route-guide-action">
                  Ver todo <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </div>
        </section>
        <Outlet />
      </main>

      <nav className="laudia-tabbar md:hidden no-select" aria-label="Navegación principal">
        <div className="grid grid-cols-4">
          {primaryNav.map(item => {
            const isActive = location.pathname.startsWith(item.to)
              || (item.to.endsWith('/more') && isSecondaryRoute);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`laudia-tab ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="laudia-tab-image">
                  <img src={item.image} alt="" aria-hidden="true" />
                </span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
