type ReadingModeToggleProps = {
  readingMode: boolean;
  onToggle: () => void;
};

export default function ReadingModeToggle({ readingMode, onToggle }: ReadingModeToggleProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-amber-800">
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="checkbox"
          checked={readingMode}
          onChange={onToggle}
          className="h-4 w-4 text-amber-600"
        />
        <span>Modo lectura</span>
      </label>
    </div>
  );
}