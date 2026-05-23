import { Outlet, NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/laudia/today', label: 'Hoy', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
  { to: '/laudia/pray', label: 'Rezar', icon: 'M12 8v4l3 3' },
  { to: '/laudia/calendar', label: 'Calendario', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { to: '/laudia/library', label: 'Biblioteca', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { to: '/laudia/settings', label: 'Ajustes', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function LaudiaPage() {
  const location = useLocation();
  const isPrayRoute = location.pathname.startsWith('/laudia/pray');

  return (
    <div className="min-h-screen laudia-gradient flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {/* ═══ Top bar ═══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-lg border-b border-stone-200/60 safe-top no-select">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-12 md:h-14">
          <NavLink to="/laudia" end className="flex items-center gap-2 text-stone-700 font-medium shrink-0">
            <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-sm font-medium">LaudIA</span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap touch-target
                  ${isActive
                    ? 'bg-stone-800 text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
                  }`
                }
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile title */}
          <span className="md:hidden text-xs text-stone-400 font-medium truncate max-w-[160px]">
            {navItems.find(i => location.pathname.startsWith(i.to))?.label || ''}
          </span>
        </div>
      </header>

      {/* ═══ Content ═══════════════════════════════════════════════════════ */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ═══ Bottom navigation (mobile) ══════════════════════════════════ */}
      {!isPrayRoute && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-xl border-t border-stone-200/60 no-select"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex items-center justify-around h-14 px-2">
            {navItems.map(item => {
              const isActive = location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-all touch-target
                    ${isActive ? 'text-stone-800' : 'text-stone-400'}`}
                >
                  <svg className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 1.8} d={item.icon} />
                  </svg>
                  <span className={`text-[10px] font-medium leading-none ${isActive ? 'text-stone-800' : 'text-stone-400'}`}>
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}

      {/* Spacer for bottom nav on mobile (only when not in pray route) */}
      {!isPrayRoute && <div className="md:hidden h-14 safe-bottom" />}
    </div>
  );
}
