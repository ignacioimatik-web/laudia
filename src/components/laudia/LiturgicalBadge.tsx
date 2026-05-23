export type LiturgicalBadgeProps = {
  color: 'white' | 'red' | 'green' | 'violet' | 'black' | 'rose' | 'blue';
  glow?: boolean;
  size?: 'sm' | 'md';
};

export default function LiturgicalBadge({ color, glow = false, size = 'sm' }: LiturgicalBadgeProps) {
  const colorMap: Record<LiturgicalBadgeProps['color'], string> = {
    white:  'bg-white border border-stone-300',
    red:    'bg-red-500',
    green:  'bg-green-500',
    violet: 'bg-violet-500',
    black:  'bg-stone-800',
    rose:   'bg-rose-500',
    blue:   'bg-blue-500',
  };

  const sizeClass = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5';

  return (
    <span
      className={`inline-block rounded-full ${sizeClass} ${colorMap[color]} ${
        glow ? 'shadow-[0_0_6px_rgba(0,0,0,0.15)]' : ''
      }`}
      title={color.charAt(0).toUpperCase() + color.slice(1)}
    />
  );
}

export { LiturgicalBadge };
