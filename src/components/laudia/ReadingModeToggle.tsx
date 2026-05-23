type ReadingModeToggleProps = {
  readingMode: boolean;
  onToggle: () => void;
};

export default function ReadingModeToggle({ readingMode, onToggle }: ReadingModeToggleProps) {
  return (
    <div className="laudia-control-pill text-sm text-stone-700 px-3">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={readingMode}
          onChange={onToggle}
          className="h-4 w-4 rounded border-stone-300 text-stone-700"
        />
        <span className="text-xs font-medium">Modo lectura</span>
      </label>
    </div>
  );
}
