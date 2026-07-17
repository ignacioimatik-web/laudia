import { NavLink, Outlet, useLocation } from 'react-router-dom';

const primaryNav = [
  { to: '/laudia/today', label: 'Hoy', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36-.7-.7M6.34 6.34l-.7-.7m12.72 0-.7.7M6.34 17.66l-.7.7M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z' },
  { to: '/laudia/pray', label: 'Rezar', icon: 'M12 3v18M7 8h10M8.5 21h7' },
  { to: '/laudia/calendar', label: 'Calendario', icon: 'M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z' },
  { to: '/laudia/more', label: 'Más', icon: 'M5 12h.01M12 12h.01M19 12h.01' },
];

const secondaryRoutes = ['/laudia/evangelio', '/laudia/liturgia', '/laudia/library', '/laudia/settings'];

export default function LaudiaPage() {
  const location = useLocation();
  const isPrayRoute = location.pathname.startsWith('/laudia/pray');
  const isSecondaryRoute = secondaryRoutes.some(route => location.pathname.startsWith(route));
  const currentLabel = primaryNav.find(item => location.pathname.startsWith(item.to))?.label
    ?? (isSecondaryRoute ? 'Más' : 'Hoy');

  return (
    <div className="min-h-screen laudia-app-shell flex flex-col">
      <header className="laudia-topbar no-select">
        <div className="max-w-5xl mx-auto px-5 flex items-center justify-between h-14">
          <NavLink to="/laudia/today" className="flex items-center gap-2.5 text-stone-800 shrink-0">
            <span className="laudia-brand-mark" aria-hidden="true"><span /></span>
            <span className="font-semibold tracking-[-0.02em]">LaudIA</span>
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
                {item.label}
              </NavLink>
            ))}
          </nav>

          <span className="md:hidden text-[11px] uppercase tracking-[0.14em] text-stone-500 font-semibold">
            {currentLabel}
          </span>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {!isPrayRoute && (
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
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2 : 1.65} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
