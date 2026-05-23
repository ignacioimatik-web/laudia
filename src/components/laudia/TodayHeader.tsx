import { LiturgicalDay } from '@/types/laudia';

type TodayHeaderProps = {
  office: {
    day: LiturgicalDay;
    isFullyVerified: boolean;
  };
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

  // Map liturgical color to tailwind color class (text- and bg-)
  const colorMap: Record<string, { bg: string; text: string }> = {
    WHITE: { bg: 'bg-white/20', text: 'text-white' },
    RED: { bg: 'bg-red-500/20', text: 'text-red-500' },
    GREEN: { bg: 'bg-green-500/20', text: 'text-green-500' },
    VIOLET: { bg: 'bg-violet-500/20', text: 'text-violet-500' },
    BLACK: { bg: 'bg-black/20', text: 'text-black' },
    ROSE: { bg: 'bg-rose-500/20', text: 'text-rose-500' },
    BLUE: { bg: 'bg-blue-500/20', text: 'text-blue-500' },
  };

  const colorInfo = colorMap[day.color] || { bg: 'bg-gray-500/20', text: 'text-gray-500' };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm text-white/70">Fecha</p>
          <p className="text-xl font-semibold text-white">{formattedDate}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-white/70">Celebración</p>
          <p className="text-lg font-semibold text-white">{day.title}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-white/70">Tiempo litúrgico</p>
          <p className="text-lg font-semibold text-white">
            {day.season.replace(/_/g, ' ').toLowerCase()}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-white/70">Semana del Salterio</p>
          <p className="text-lg font-semibold text-white">
            Semana {day.psalterWeek}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-white/70">Color litúrgico</p>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full ${colorInfo.bg}"></div>
            <span className="text-white font-medium">{day.color}</span>
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <p className="text-sm text-white/70">Estado de verificación</p>
          <p className="text-lg font-semibold">
            {isFullyVerified ? (
              <span className="text-green-400">Textos oficiales verificados</span>
            ) : (
              <span className="text-yellow-400">
                Algunos textos son placeholders pendientes de verificación oficial
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}