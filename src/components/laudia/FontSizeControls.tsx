import { useState } from 'react';

type FontSizeControlsProps = {
  fontSize: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export default function FontSizeControls({ fontSize, onIncrease, onDecrease }: FontSizeControlsProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-amber-800">
      <button
        onClick={onDecrease}
        disabled={fontSize <= 12}
        className="p-1 rounded hover:bg-amber-50 transition-colors disabled:opacity-50"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9l3-3"/>
        </svg>
      </button>
      <span className="font-medium">{fontSize}px</span>
      <button
        onClick={onIncrease}
        disabled={fontSize >= 24}
        className="p-1 rounded hover:bg-amber-50 transition-colors disabled:opacity-50"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l3 3 3-3"/>
        </svg>
      </button>
    </div>
  );
}