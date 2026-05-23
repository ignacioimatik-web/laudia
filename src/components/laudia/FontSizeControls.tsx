import { useState } from 'react';

type FontSizeControlsProps = {
  fontSize: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export default function FontSizeControls({ fontSize, onIncrease, onDecrease }: FontSizeControlsProps) {
  return (
    <div className="laudia-control-pill text-sm text-stone-700">
      <button
        onClick={onDecrease}
        disabled={fontSize <= 12}
        className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-white/80 transition-colors disabled:opacity-40"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9l3-3"/>
        </svg>
      </button>
      <span className="font-medium px-2 text-xs">{fontSize}px</span>
      <button
        onClick={onIncrease}
        disabled={fontSize >= 24}
        className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-white/80 transition-colors disabled:opacity-40"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l3 3 3-3"/>
        </svg>
      </button>
    </div>
  );
}
