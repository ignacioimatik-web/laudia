export type LiturgicalBadgeProps = {
  color: 'white' | 'red' | 'green' | 'violet' | 'black' | 'rose' | 'blue';
  glow?: boolean;
  size?: 'sm' | 'md';
};

export default function LiturgicalBadge({ color, glow = false, size = 'sm' }: LiturgicalBadgeProps) {
  const colorMap: Record<LiturgicalBadgeProps['color'], string> = {
    white:  'bg-white border border-stone-300/90',
    red:    'bg-red-500',
    green:  'bg-emerald-500',
    violet: 'bg-violet-500',
    black:  'bg-stone-800',
    rose:   'bg-rose-500',
    blue:   'bg-sky-500',
  };

  const sizeClass = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5';

  return (
    <span
      className={`inline-block rounded-full ${sizeClass} ${colorMap[color]} ${
        glow ? 'shadow-[0_0_0_3px_rgba(255,255,255,0.75),0_0_14px_rgba(80,62,48,0.18)]' : ''
      }`}
      title={color.charAt(0).toUpperCase() + color.slice(1)}
    />
  );
}

export { LiturgicalBadge };
