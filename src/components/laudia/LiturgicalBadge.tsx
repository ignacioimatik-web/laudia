type LiturgicalBadgeProps = {
  color: 'white' | 'red' | 'green' | 'violet' | 'black' | 'rose' | 'blue';
};

export default function LiturgicalBadge({ color }: LiturgicalBadgeProps) {
  const colorMap: Record<LiturgicalBadgeProps['color'], string> = {
    white: 'white',
    red: 'red-500',
    green: 'green-500',
    violet: 'violet-500',
    black: 'black',
    rose: 'rose-500',
    blue: 'blue-500',
  };

  return (
    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${colorMap[color]}`} />
  );
}