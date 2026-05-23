import { LiturgicalDay } from '@/types/laudia';
import LiturgicalBadge from './LiturgicalBadge';

type TodayHeaderProps = {
  office: {
    day: LiturgicalDay;
    isFullyVerified: boolean;
  };
};

const seasonLabels: Record<string, string> = {
  ADVENTO: 'Adviento',
  NAVIDAD: 'Navidad',
  TIEMPO_ORDINARIO_1: 'Tiempo Ordinario',
  CUARESMA: 'Cuaresma',
  TRIDUO_PASCUAL: 'Triduo Pascual',
  PASCUA: 'Pascua',
  TIEMPO_ORDINARIO_2: 'Tiempo Ordinario',
};

const colorLabels: Record<string, string> = {
  WHITE: 'Blanco', RED: 'Rojo', GREEN: 'Verde',
  VIOLET: 'Violeta', BLACK: 'Negro', ROSE: 'Rosa',
};

const rankLabels: Record<string, string> = {
  SOLEMNIDAD: 'Solemnidad',
  FIESTA: 'Fiesta',
  MEMORIA_OBLIGATORIA: 'Memoria',
  FERIA: 'Feria',
};

export default function TodayHeader({ office }: TodayHeaderProps) {
  const { day, isFullyVerified } = office;
  const date = new Date(day.date);
  const formattedDate = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dotColor = day.color.toLowerCase() as LiturgicalBadgeProps['color'];
  const hasRank = day.rank in rankLabels;

  return (
    <div className="laudia-card">
      {/* Top accent line */}
      <div className="h-1 rounded-t-[12px]" style={{
        background: day.color === 'WHITE' ? 'linear-gradient(90deg, #e7e5e4, #fafafa, #e7e5e4)'
          : day.color === 'RED' ? 'linear-gradient(90deg, #fca5a5, #ef4444, #fca5a5)'
          : day.color === 'GREEN' ? 'linear-gradient(90deg, #86efac, #22c55e, #86efac)'
          : day.color === 'VIOLET' ? 'linear-gradient(90deg, #c4b5fd, #8b5cf6, #c4b5fd)'
          : day.color === 'BLACK' ? 'linear-gradient(90deg, #57534e, #292524, #57534e)'
          : 'linear-gradient(90deg, #fda4af, #f43f5e, #fda4af)'
      }} />

      <div className="p-5 md:p-6">
        {/* Top row: date + verification */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <time className="laudia-h3">{formattedDate}</time>
          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
            isFullyVerified
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {isFullyVerified ? '✓ Textos verificados' : 'Pendiente de verificación'}
          </span>
        </div>

        {/* Main info grid */}
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {/* Celebration */}
          <div>
            <p className="laudia-h3 mb-1">Celebración</p>
            <div className="flex items-start gap-2">
              <span className="laudia-h1 leading-tight">{day.title}</span>
            </div>
            {hasRank && (
              <span className="inline-block mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                {rankLabels[day.rank]}
              </span>
            )}
          </div>

          {/* Metadata column */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="laudia-h3">Tiempo</span>
              <span className="text-sm text-stone-700">{seasonLabels[day.season] || day.season.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="laudia-h3">Salterio</span>
              <span className="text-sm text-stone-700">Semana {day.psalterWeek}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="laudia-h3">Color</span>
              <div className="flex items-center gap-2">
                <LiturgicalBadge color={dotColor} glow size="sm" />
                <span className="text-sm text-stone-700">{colorLabels[day.color] || day.color}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
