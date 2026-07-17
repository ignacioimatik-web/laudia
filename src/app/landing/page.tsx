import { Link } from 'react-router-dom';

const features = [
  {
    image: '/images/navigation/pray-nordic.jpg',
    eyebrow: 'Oración guiada',
    title: 'Laudes, paso a paso',
    text: 'Reza a tu ritmo, guarda el progreso y escucha cada oración con una voz natural.',
    href: '/laudia/pray',
  },
  {
    image: '/images/navigation/today-nordic.jpg',
    eyebrow: 'Cada mañana',
    title: 'Evangelio del día',
    text: 'La lectura del día, su contexto litúrgico y narración en español de España.',
    href: '/laudia/evangelio',
  },
  {
    image: '/images/navigation/calendar-nordic.jpg',
    eyebrow: 'Año litúrgico',
    title: 'Un calendario que orienta',
    text: 'Descubre celebraciones, colores, tiempos y el salterio que corresponde a cada día.',
    href: '/laudia/calendar',
  },
];

export default function LandingPage() {
  return (
    <div className="laudia-landing">
      <header className="laudia-landing-nav">
        <Link to="/" className="flex items-center gap-2.5" aria-label="LaudIA, inicio">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#344a3f] text-lg text-white shadow-lg">L</span>
          <span>
            <strong className="block text-lg leading-none text-[#26362e]">LaudIA</strong>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#71877b]">Oración de la mañana</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-stone-600 md:flex" aria-label="Navegación de portada">
          <a href="#como-funciona" className="hover:text-stone-950">Cómo funciona</a>
          <a href="#contenidos" className="hover:text-stone-950">Contenidos</a>
        </nav>
        <Link to="/laudia/today" className="laudia-btn-primary !px-4 !py-3">
          Abrir app
        </Link>
      </header>

      <main>
        <section className="laudia-landing-hero">
          <div className="relative z-10 max-w-2xl">
            <p className="laudia-kicker mb-4">Una pausa luminosa para empezar el día</p>
            <h1 className="text-[clamp(2.7rem,9vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-[#24332b]">
              Tu oración diaria,
              <span className="block font-normal italic text-[#60766a]">más cerca.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-stone-600 md:text-lg">
              LaudIA reúne Laudes, Evangelio, calendario y formación en una experiencia serena,
              pensada para el teléfono y preparada para escuchar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/laudia/today" className="laudia-btn-primary !px-6 !py-4">
                Empezar hoy <span aria-hidden="true">→</span>
              </Link>
              <Link to="/laudia/pray" className="laudia-btn-secondary !px-6 !py-4">
                Escuchar Laudes
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone-500">
              <span>✓ Sin registro</span>
              <span>✓ Diseñada para móvil</span>
              <span>✓ Voz femenina en español</span>
            </div>
          </div>

          <div className="laudia-landing-hero-visual" aria-hidden="true">
            <img src="/images/navigation/today-nordic.jpg" alt="" />
            <div className="laudia-landing-float">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e6eee9] text-[#40564b]">▶</span>
              <span><strong>Evangelio de hoy</strong><small>Listo para escuchar</small></span>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="laudia-kicker mb-3">Un hábito sencillo</p>
              <h2 className="text-3xl font-semibold leading-tight text-[#26362e] md:text-5xl">
                Abre, respira y empieza.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-stone-600 md:justify-self-end">
              Todo está ordenado según el día litúrgico. Puedes leer con calma o dejar que la voz te acompañe
              mientras caminas, viajas o preparas la mañana.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {['Elige el día', 'Lee o escucha', 'Continúa a tu ritmo'].map((step, index) => (
              <div key={step} className="rounded-3xl border border-emerald-950/10 bg-white/60 p-6">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#789083]">0{index + 1}</span>
                <h3 className="mt-8 text-xl font-semibold text-[#283a31]">{step}</h3>
              </div>
            ))}
          </div>
        </section>

        <section id="contenidos" className="bg-[#e5ebe6] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="laudia-kicker mb-3">Todo en su lugar</p>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-[#26362e] md:text-5xl">
              Contenido para comprender, rezar y volver.
            </h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <Link
                  key={feature.title}
                  to={feature.href}
                  className="group overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-[#f7f8f5] shadow-[0_18px_55px_rgba(48,69,58,0.08)]"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={feature.image}
                      alt=""
                      className="h-full w-full object-cover saturate-75 transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#789083]">{feature.eyebrow}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-[#26362e]">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-stone-600">{feature.text}</p>
                    <span className="mt-6 inline-flex text-sm font-semibold text-[#40564b]">Explorar →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="relative overflow-hidden rounded-[2.2rem] bg-[#30463a] px-6 py-14 text-center text-white md:px-14 md:py-20">
            <div className="absolute inset-0 opacity-10 [background:radial-gradient(circle_at_20%_20%,white,transparent_45%)]" />
            <div className="relative mx-auto max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/70">Empieza esta mañana</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">Un espacio para escuchar lo esencial.</h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-emerald-50/70 md:text-base">
                Entra directamente en la oración del día. LaudIA se ocupa de ordenar el camino.
              </p>
              <Link to="/laudia/today" className="mt-8 inline-flex rounded-xl bg-white px-6 py-4 text-sm font-semibold text-[#30463a]">
                Abrir LaudIA
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-emerald-950/10 px-5 py-8 text-center text-xs text-stone-500">
        LaudIA · Oración, liturgia y acompañamiento para cada mañana
      </footer>
    </div>
  );
}
