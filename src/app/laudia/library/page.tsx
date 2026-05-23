import React, { useState } from 'react';

// ── Icons (inline SVGs, sobrios) ───────────────────────────────────────────

const icons = {
  info:      <svg className="h-5 w-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  structure: <svg className="h-5 w-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>,
  psalm:     <svg className="h-5 w-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/></svg>,
  canticle:  <svg className="h-5 w-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>,
  season:    <svg className="h-5 w-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  calendar:  <svg className="h-5 w-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  rank:      <svg className="h-5 w-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m0 0l3 9M12 5l3 9m-3-9l-6 2m12-2l3 1m-3 1l-3 9m3-9l3 1"/></svg>,
  individual:<svg className="h-5 w-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  community: <svg className="h-5 w-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  ia:        <svg className="h-5 w-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>,
};

// ── Data ───────────────────────────────────────────────────────────────────

interface Section {
  id: string;
  icon: JSX.Element;
  title: string;
  content: JSX.Element;
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-stone-800">{children}</span>;
}

// ── Section Content ────────────────────────────────────────────────────────

const sections: Section[] = [
  {
    id: 'what',
    icon: icons.info,
    title: '¿Qué son los Laudes?',
    content: (
      <div className="space-y-3 text-stone-600 text-sm md:text-base leading-relaxed">
        <p>
          Los Laudes son la oración de la mañana dentro de la Liturgia de las Horas, la oración pública y oficial de la Iglesia.
          Se rezan al amanecer para santificar el comienzo del día con la alabanza a Dios.
        </p>
        <p>
          Su nombre proviene del latín <em>laudes</em> («alabanzas»), porque los salmos y cánticos que contiene son principalmente de alabanza.
          Es la primera de las «horas mayores» del oficio divino después del Invitatorio o Maitines.
        </p>
        <p>
          Tradicionalmente, los Laudes se rezan en comunidad en monasterios y catedrales, pero cualquier persona —clérigo, religioso o laico—
          puede rezarlos individualmente como parte de su vida de oración diaria.
        </p>
      </div>
    ),
  },
  {
    id: 'structure',
    icon: icons.structure,
    title: 'Estructura de Laudes',
    content: (
      <div className="space-y-3 text-stone-600 text-sm md:text-base leading-relaxed">
        <p>Los Laudes siguen un orden fijo que combina salmos, lecturas, oración y alabanza. Estas son sus partes:</p>
        <ol className="space-y-2 list-decimal list-inside text-sm md:text-base text-stone-600">
          <li><Highlight>Inicio</Highlight> — Versículo inicial «Dios mío, ven en mi auxilio» y el Gloria. Se abre con el Invitatorio si no se rezó antes.</li>
          <li><Highlight>Himno</Highlight> — Poema o canto que introduce el tema del día o la temporada litúrgica.</li>
          <li><Highlight>Salmodia</Highlight> — Tres piezas: dos salmos y un cántico del Antiguo Testamento, cada uno con su antífona.</li>
          <li><Highlight>Lectura breve</Highlight> — Un pasaje breve de la Escritura, seguido de un silencio para la reflexión.</li>
          <li><Highlight>Responsorio breve</Highlight> — Respuesta cantada o recitada que acoge la Palabra.</li>
          <li><Highlight>Benedictus</Highlight> — El cántico de Zacarías (Lc 1,68-79), momento culminante de Laudes. Siempre con antífona.</li>
          <li><Highlight>Preces</Highlight> — Súplicas matutinas por la Iglesia, el mundo y las necesidades del día.</li>
          <li><Highlight>Padre Nuestro</Highlight> — Oración del Señor, centro de toda la liturgia.</li>
          <li><Highlight>Oración conclusiva</Highlight> — Colecta propia del día.</li>
          <li><Highlight>Conclusión</Highlight> — «El Señor nos conceda su paz» y bendición final.</li>
        </ol>
        <p className="text-xs text-stone-400 mt-2">† Esta estructura puede variar ligeramente según el día y la temporada (por ejemplo, en solemnidades se añaden o modifican algunas partes).</p>
      </div>
    ),
  },
  {
    id: 'psalmody',
    icon: icons.psalm,
    title: 'Salmodia',
    content: (
      <div className="space-y-3 text-stone-600 text-sm md:text-base leading-relaxed">
        <p>
          La salmodia es el corazón de Laudes. Consiste en dos salmos y un cántico del Antiguo Testamento, seleccionados
          del <em>Salterio de cuatro semanas</em> con antífonas que ayudan a su comprensión orante.
        </p>
        <Subheading>Estructura de cada pieza</Subheading>
        <ul className="space-y-1 text-sm md:text-base text-stone-600">
          <li>🔹 Antífona (verso breve que introduce el tono)</li>
          <li>🔹 Salmo o cántico (recitado pausadamente)</li>
          <li>🔹 Gloria al Padre (doxología trinitaria)</li>
          <li>🔹 Antífona (se repite)</li>
        </ul>
        <p className="mt-2">
          La salmodia de Laudes suele incluir el <em>Salmo 63</em> (los lunes y viernes), el <em>Cántico de los tres jóvenes</em> (Dan 3),
          y salmos de alabanza como los <em>Salmos 148–150</em>. Los domingos se añade el <em>Salmo 118</em> (el más largo del Salterio).
        </p>
        <p className="text-xs text-stone-400 mt-2">
          ※ La selección exacta depende de la semana del salterio y del día de la semana.
        </p>
      </div>
    ),
  },
  {
    id: 'benedictus',
    icon: icons.canticle,
    title: 'Benedictus',
    content: (
      <div className="space-y-3 text-stone-600 text-sm md:text-base leading-relaxed">
        <p>
          El <em>Benedictus</em> (Lucas 1,68-79) es el cántico evangélico de Laudes. Lo pronunció Zacarías, padre de Juan el Bautista,
          al recuperar el habla después del nacimiento de su hijo. Es un himno de bendición y profecía.
        </p>
        <p>
          En los Laudes, el Benedictus tiene un lugar central y solemne. Se recita con antífona propia del día y,
          en las solemnidades y fiestas, la antífona se toma del propio litúrgico.
        </p>
        <p className="text-sm">
          <Highlight>Costumbre:</Highlight> Durante el cántico se hace la señal de la cruz al comenzar,
          y al final se repite la antífona. En comunidad, se suele estar de pie.
        </p>
        <p className="text-xs text-stone-400">
          ※ El Benedictus es uno de los tres cánticos evangélicos de la Liturgia de las Horas, junto con el Magnificat (Vísperas)
          y el Nunc Dimittis (Completas).
        </p>
      </div>
    ),
  },
  {
    id: 'seasons',
    icon: icons.season,
    title: 'Tiempos litúrgicos',
    content: (
      <div className="space-y-3 text-stone-600 text-sm md:text-base leading-relaxed">
        <p>
          La Liturgia de las Horas sigue el ritmo del año litúrgico. Cada temporada afecta a los himnos,
          antífonas, lecturas y oraciones de Laudes.
        </p>
        <ul className="space-y-2">
          <li><Highlight>Adviento (violeta):</Highlight> Himnos de espera y antífonas «Oh» del 17 al 24 de diciembre. Mayor sobriedad.</li>
          <li><Highlight>Navidad (blanco):</Highlight> Himnos festivos, lecturas de los profetas y del Evangelio de la infancia.</li>
          <li><Highlight>Cuaresma (violeta):</Highlight> Tonos más sobrios. Se omiten el Gloria y el Aleluya. Lecturas de conversión.</li>
          <li><Highlight>Triduo Pascual:</Highlight> Jueves, Viernes y Sábado Santo con ritos propios y lecturas especiales.</li>
          <li><Highlight>Pascua (blanco):</Highlight> Aleluya en cada antífona. Himnos de gozo. Dura 50 días hasta Pentecostés.</li>
          <li><Highlight>Tiempo Ordinario (verde):</Highlight> Secuencia habitual del Salterio de cuatro semanas.</li>
        </ul>
        <p className="text-xs text-stone-400 mt-2">
          ※ LaudIA ajusta automáticamente el tiempo litúrgico al generar el oficio de cada día.
        </p>
      </div>
    ),
  },
  {
    id: 'psalter-week',
    icon: icons.calendar,
    title: 'Semana del salterio',
    content: (
      <div className="space-y-3 text-stone-600 text-sm md:text-base leading-relaxed">
        <p>
          La Liturgia de las Horas distribuye los 150 salmos en un ciclo de cuatro semanas. Cada semana del salterio
          asigna un grupo de salmos para Laudes, Vísperas y Completas de cada día.
        </p>
        <p>
          El ciclo comienza el domingo de la <em>semana I</em> del salterio y avanza de forma continua,
          aunque los tiempos fuertes (Adviento, Cuaresma, Pascua) tienen su propio ordinario que puede alterar la secuencia.
        </p>
        <p>
          <Highlight>En cada día de la semana</Highlight> se rezan tres salmos o cánticos para Laudes: dos salmos
          (uno de ellos a menudo de alabanza) y un cántico del Antiguo Testamento. El domingo se usan salmos más largos y festivos.
        </p>
        <p className="text-xs text-stone-400">
          ※ Nuestra app muestra la semana del salterio correspondiente a cada día en la cabecera del oficio.
        </p>
      </div>
    ),
  },
  {
    id: 'ranks',
    icon: icons.rank,
    title: 'Rangos litúrgicos',
    content: (
      <div className="space-y-3 text-stone-600 text-sm md:text-base leading-relaxed">
        <p>El calendario litúrgico clasifica cada día según su importancia. Esta jerarquía determina qué textos se usan en Laudes.</p>

        <Subheading colapsable>Feria</Subheading>
        <p>Día ordinario sin celebración especial. Se sigue el esquema normal del Salterio sin cambios. Color verde (Tiempo Ordinario) o el del tiempo litúrgico correspondiente.</p>

        <Subheading colapsable>Memoria libre (memoria opcional)</Subheading>
        <p>Celebración de un santo que se puede conmemorar o no, según la elección personal o comunitaria. Se puede tomar la antífona y oración del común de santos o seguir la feria. Color blanco o rojo según el santo.</p>

        <Subheading colapsable>Memoria obligatoria</Subheading>
        <p>Celebración de un santo o misterio que debe observarse. Laudes tiene antífona propia o del común, y la oración colecta es propia. El resto del oficio puede ser del tiempo (aunque con algunos elementos propios).</p>

        <Subheading colapsable>Fiesta</Subheading>
        <p>Grado superior de celebración. Suele corresponder a apóstoles, evangelistas o algunos santos importantes. El oficio es completamente propio (antífonas, lectura, oración). Se reza el Gloria. Color blanco o rojo.</p>

        <Subheading colapsable>Solemnidad</Subheading>
        <p>Máximo grado de celebración litúrgica. Corresponden a los misterios principales de la fe (Navidad, Pascua, Pentecostés…) y a algunos santos de especial relevancia (María, José, Pedro y Pablo…). El oficio tiene textos completamente propios, con Gloria y Te Deum (en Maitines). Primacía sobre cualquier otra celebración.</p>

        <Subheading colapsable>Domingo</Subheading>
        <p>El domingo es la «fiesta primordial» del pueblo cristiano (SC 106). Cada domingo se celebra la Pascua semanalmente. En Laudes, el domingo tiene salmos propios más largos, himno festivo, y se omite el Invitatorio (aunque se puede rezar). El color varía según el tiempo litúrgico.</p>

        <p className="text-xs text-stone-400 mt-3">
          ※ La app identifica automáticamente el rango de cada día usando el calendario litúrgico básico.
        </p>
      </div>
    ),
  },
  {
    id: 'individual',
    icon: icons.individual,
    title: 'Cómo rezar individualmente',
    content: (
      <div className="space-y-3 text-stone-600 text-sm md:text-base leading-relaxed">
        <p>Rezar Laudes en solitario es una forma rica de comenzar el día con Dios. Aquí algunas sugerencias prácticas:</p>
        <ul className="space-y-2 text-sm md:text-base">
          <li><Highlight>Elige un momento fijo:</Highlight> Lo ideal es al despertar, antes de las actividades. La tradición sugiere al amanecer.</li>
          <li><Highlight>Busca un lugar tranquilo:</Highlight> Sin distracciones. Si puedes, ten un icono, una vela o una imagen que ayude a centrar la atención.</li>
          <li><Highlight>Signo de la cruz y silencio:</Highlight> Antes de empezar, haz la señal de la cruz y guarda unos segundos de silencio para ponerte en presencia de Dios.</li>
          <li><Highlight>Lee en voz baja:</Highlight> Recitar en voz baja (o en voz alta si estás solo) ayuda a la concentración. No tengas prisa.</li>
          <li><Highlight>Pausa después de la lectura breve:</Highlight> La lectura breve va seguida de un silencio. Tómate unos segundos para reflexionar.</li>
          <li><Highlight>Haz tuyas las preces:</Highlight> Las preces de Laudes son generales; añade intenciones personales al final.</li>
          <li><Highlight>Modo guía:</Highlight> Si usas la app en modo guía, las reflexiones opcionales pueden ayudarte a profundizar, pero no son necesarias.</li>
        </ul>
        <p className="text-xs text-stone-400 mt-2">
          📖 «Por la mañana hazme escuchar tu misericordia, porque en ti confío» (Sal 143,8).
        </p>
      </div>
    ),
  },
  {
    id: 'community',
    icon: icons.community,
    title: 'Cómo rezar en familia o comunidad',
    content: (
      <div className="space-y-3 text-stone-600 text-sm md:text-base leading-relaxed">
        <p>La Liturgia de las Horas nació como oración comunitaria. En familia o en grupo, los Laudes adquieren una dimensión especial.</p>
        <ul className="space-y-2 text-sm md:text-base">
          <li><Highlight>Distribuir las partes:</Highlight> Una persona dirige (saludo inicial, lecturas, oraciones), y los demás responden. Los salmos se pueden alternar entre dos coros o lados.</li>
          <li><Highlight>Alternar los salmos:</Highlight> En la salmodia, una persona o lado recita el verso impar y el otro el verso par. Así se mantiene la atención.</li>
          <li><Highlight>Cantar el himno:</Highlight> Si es posible, el himno se canta. No hace falta ser músico; una melodía sencilla basta.</li>
          <li><Highlight>Silencios compartidos:</Highlight> El silencio después de la lectura breve y al final de cada salmo es parte de la oración; respétalo.</li>
          <li><Highlight>Adaptar a los niños:</Highlight> Si hay niños pequeños, se puede simplificar: una lectura más breve, gestos, o que ellos digan la antífona.</li>
          <li><Highlight>Sin prisa:</Highlight> La oración comunitaria no es una carrera. Los tiempos de espera entre partes son normales y ayudan a la unión.</li>
        </ul>
        <p className="text-sm mt-2">
          <Highlight>Para empezar:</Highlight> Basta con dos personas y un dispositivo. La app muestra el oficio completo; solo falta distribuir las voces.
        </p>
        <p className="text-xs text-stone-400 mt-2">
          «Donde dos o tres están reunidos en mi nombre, allí estoy yo en medio de ellos» (Mt 18,20).
        </p>
      </div>
    ),
  },
  {
    id: 'texts-vs-ia',
    icon: icons.ia,
    title: 'Diferencia entre textos oficiales y ayudas IA',
    content: (
      <div className="space-y-3 text-stone-600 text-sm md:text-base leading-relaxed">
        <p className="font-medium text-stone-700">
          En LaudIA distinguimos cuidadosamente dos tipos de contenido:
        </p>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
          <h4 className="text-sm font-semibold text-stone-800">📜 Textos oficiales</h4>
          <p className="text-sm text-stone-600">
            Son los textos aprobados de la Liturgia de las Horas: salmos, antífonas, himnos, lecturas bíblicas,
            oraciones y preces. Proceden de fuentes oficiales (ediciones típicas, conferencias episcopales, etc.)
            y deben ser verificados antes de su inclusión definitiva en la app.
          </p>
          <p className="text-xs text-stone-400">
            En la versión actual, estos textos pueden mostrarse como placeholders o pendientes de verificación.
            La app indica claramente el estado de cada texto.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
          <h4 className="text-sm font-semibold text-amber-800">🤖 Ayudas IA</h4>
          <p className="text-sm text-amber-700">
            Comentarios generados por inteligencia artificial para guiar la oración: explicaciones breves,
            reflexiones espirituales, notas históricas o literarias. Estas ayudas son opcionales y se activan
            en el «Modo guía».
          </p>
          <ul className="space-y-1 text-sm text-amber-600">
            <li>✔️ Nunca modifican ni reemplazan el texto oficial.</li>
            <li>✔️ Siempre están identificadas como contenido IA.</li>
            <li>✔️ Se pueden desactivar en cualquier momento.</li>
            <li>❌ No deben considerarse enseñanza oficial de la Iglesia.</li>
          </ul>
        </div>

        <p className="text-sm">
          <Highlight>Principio fundamental:</Highlight> La Palabra de Dios y la oración oficial de la Iglesia están primero.
          Las ayudas IA son un complemento opcional, no un sustituto. LaudIA está diseñada para que esta separación
          sea transparente y respetuosa.
        </p>
      </div>
    ),
  },
];

// ── Accordion Item Component ──────────────────────────────────────────────

function SectionCard({ section, isOpen, onToggle }: { section: Section; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="laudia-card overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 md:p-5 text-left hover:bg-stone-50/50 transition-colors"
      >
        <span className="shrink-0">{section.icon}</span>
        <span className="flex-1 font-medium text-stone-800 text-sm md:text-base leading-tight">
          {section.title}
        </span>
        <svg
          className={`h-4 w-4 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 md:px-5 pb-5">
          {section.content}
        </div>
      </div>
    </div>
  );
}

// ── Subheading variant for ranks (colapsable subsections) ─────────────────

function Subheading({ children, colapsable }: { children: React.ReactNode; colapsable?: boolean }) {
  return (
    <h4 className={`text-sm font-semibold text-stone-700 mt-5 mb-2 ${colapsable ? 'text-stone-600 before:content-["▸_"] before:text-stone-400 before:text-xs' : ''}`}>
      {children}
    </h4>
  );
}

// ── Page Component ─────────────────────────────────────────────────────────

export default function LibraryPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(sections.map(s => s.id))); // all open by default

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allOpen = openSections.size === sections.length;
  const toggleAll = () => {
    setOpenSections(allOpen ? new Set() : new Set(sections.map(s => s.id)));
  };

  return (
    <div className="min-h-screen laudia-gradient p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="laudia-h1">Biblioteca formativa</h1>
          <p className="text-sm text-stone-500 mt-1">
            Todo lo que necesitas saber para rezar los Laudes con comprensión y fruto.
          </p>
        </div>

        {/* Toggle all */}
        <div className="flex justify-end mb-4">
          <button onClick={toggleAll} className="laudia-btn-ghost">
            {allOpen ? 'Contraer todo' : 'Expandir todo'}
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isOpen={openSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-xs text-stone-400">
          <p>Contenido original explicativo · No sustituye a los libros litúrgicos oficiales</p>
        </div>
      </div>
    </div>
  );
}
