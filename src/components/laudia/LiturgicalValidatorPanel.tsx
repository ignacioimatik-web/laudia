import { useState } from 'react';
import { ValidationResult, ValidationIssue } from '@/types/laudia';

interface Props {
  result: ValidationResult;
}

function severityIcon(severity: ValidationIssue['severity']): string {
  switch (severity) {
    case 'error': return '⨯';
    case 'warning': return '⚠';
    case 'info': return 'i';
  }
}

function severityColor(severity: ValidationIssue['severity']): string {
  switch (severity) {
    case 'error': return 'text-red-600 bg-red-50 border-red-200';
    case 'warning': return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'info': return 'text-blue-700 bg-blue-50 border-blue-200';
  }
}

function severityBadgeBg(severity: ValidationIssue['severity']): string {
  switch (severity) {
    case 'error': return 'bg-red-500';
    case 'warning': return 'bg-amber-500';
    case 'info': return 'bg-blue-500';
  }
}

export function LiturgicalValidatorPanel({ result }: Props) {
  const [open, setOpen] = useState(false);

  if (result.isClean) return null;

  const total = result.errors.length + result.warnings.length;
  const errorCount = result.errors.length;
  const warningCount = result.warnings.length;

  const allIssues = [...result.errors, ...result.warnings, ...result.infos];

  return (
    <div className="mb-6 reading-hide">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-amber-200 bg-amber-50/70 text-sm text-amber-800 hover:bg-amber-100 transition-colors touch-target"
      >
        <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-amber-500 text-white text-[11px] font-bold">
          {total > 9 ? '9+' : total}
        </span>
        <span className="flex-1 text-left font-medium">
          Revisión litúrgica
          {errorCount > 0 && <span className="ml-1.5 text-red-600">({errorCount} error{errorCount > 1 ? 'es' : ''})</span>}
        </span>
        <span className="text-amber-500 text-lg leading-none transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▾
        </span>
      </button>

      {open && (
        <div className="mt-2 space-y-1.5 animate-slide-down">
          {allIssues.map((issue, i) => (
            <div
              key={`${issue.code}-${i}`}
              className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border text-sm ${severityColor(issue.severity)}`}
            >
              <span
                className={`shrink-0 mt-0.5 flex items-center justify-center h-4 w-4 rounded-full text-white text-[10px] font-bold ${severityBadgeBg(issue.severity)}`}
              >
                {severityIcon(issue.severity)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium leading-snug">{issue.message}</p>
                {issue.details && (
                  <p className="mt-0.5 text-xs opacity-80 leading-relaxed">{issue.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
