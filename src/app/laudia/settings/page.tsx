import React from 'react';
import { useLaudiaPreferences, VisualMode, DefaultMode, PrayerType } from '@/hooks/laudia/useLaudiaPreferences';

// ── Small building blocks ──────────────────────────────────────────────────

function SectionTitle({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <h2 className={`text-sm font-semibold text-stone-500 uppercase tracking-wider ${first ? '' : 'mt-8'} mb-3`}>
      {children}
    </h2>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-100 last:border-b-0">
      <div className="pr-4 flex-1">
        <p className="text-sm font-medium text-stone-800">{label}</p>
        {description && <p className="text-xs text-stone-400 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        value ? 'bg-stone-800' : 'bg-stone-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function SegmentedControl<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-lg border border-stone-200 overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt.value
              ? 'bg-stone-800 text-white'
              : 'bg-white text-stone-500 hover:bg-stone-50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function FontSizeControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(12, value - 2))}
        disabled={value <= 12}
        className="h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors disabled:opacity-30"
      >
        <span className="text-sm font-medium">A–</span>
      </button>
      <span className="text-sm font-medium text-stone-700 w-10 text-center">{value}px</span>
      <button
        onClick={() => onChange(Math.min(24, value + 2))}
        disabled={value >= 24}
        className="h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors disabled:opacity-30"
      >
        <span className="text-sm font-medium">A+</span>
      </button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { preferences, updatePreference, resetPreferences, loaded } = useLaudiaPreferences();

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center laudia-gradient">
        <p className="text-sm text-stone-400 animate-pulse-soft">Cargando preferencias…</p>
      </div>
    );
  }

  const p = preferences;

  return (
    <div className="min-h-screen laudia-gradient p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="laudia-h1">Ajustes</h1>
          <p className="text-sm text-stone-500 mt-1">
            Personaliza tu experiencia de oración en LaudIA.
          </p>
        </div>

        <div className="space-y-3">
          <div className="laudia-card p-5">
            <SectionTitle first>Apariencia</SectionTitle>
            <SettingRow label="Modo visual" description="Claro · Oscuro · Amanecer">
              <SegmentedControl<VisualMode>
                options={[
                  { value: 'light', label: 'Claro' },
                  { value: 'dawn', label: 'Amanecer' },
                  { value: 'dark', label: 'Oscuro' },
                ]}
                value={p.visualMode}
                onChange={(v) => updatePreference('visualMode', v)}
              />
            </SettingRow>
            <SettingRow label="Tamaño de letra" description="De 12 a 24 píxeles">
              <FontSizeControl
                value={p.fontSize}
                onChange={(v) => updatePreference('fontSize', v)}
              />
            </SettingRow>
          </div>

          <div className="laudia-card p-5">
            <SectionTitle>Lectura</SectionTitle>
            <SettingRow label="Mostrar rúbricas" description="Indicaciones de postura y gestos">
              <Toggle value={p.showRubrics} onChange={(v) => updatePreference('showRubrics', v)} />
            </SettingRow>
            <SettingRow label="Modo por defecto" description="Guía (paso a paso) o experto (todo visible)">
              <SegmentedControl<DefaultMode>
                options={[
                  { value: 'guide', label: 'Guía' },
                  { value: 'expert', label: 'Experto' },
                ]}
                value={p.defaultMode}
                onChange={(v) => updatePreference('defaultMode', v)}
              />
            </SettingRow>
          </div>

          <div className="laudia-card p-5">
            <SectionTitle>Experiencia</SectionTitle>
            <SettingRow label="Tipo de rezo" description="Individual, comunitario o familiar">
              <SegmentedControl<PrayerType>
                options={[
                  { value: 'individual', label: 'Individual' },
                  { value: 'community', label: 'Comunitario' },
                  { value: 'family', label: 'Familiar' },
                ]}
                value={p.prayerType}
                onChange={(v) => updatePreference('prayerType', v)}
              />
            </SettingRow>
            <SettingRow label="Ayudas IA" description="Comentarios opcionales de guía">
              <Toggle value={p.enableAiHelp} onChange={(v) => updatePreference('enableAiHelp', v)} />
            </SettingRow>
          </div>

          <div className="laudia-card p-5">
            <SectionTitle>Funcionalidades</SectionTitle>
            <SettingRow label="Recordatorio matutino" description="Requerirá notificaciones push en una próxima versión">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Próximamente</span>
            </SettingRow>
            <SettingRow label="Mantener pantalla activa" description="Evita que la pantalla se apague mientras rezas">
              <Toggle value={p.keepScreenActive} onChange={(v) => updatePreference('keepScreenActive', v)} />
            </SettingRow>
            <SettingRow label="Contenido offline" description="La PWA guarda automáticamente la aplicación y los recursos disponibles">
              <span className="text-xs font-medium text-emerald-700">Automático</span>
            </SettingRow>
          </div>

          <div className="laudia-card p-5">
            <SectionTitle>Avanzado</SectionTitle>
            <SettingRow label="Calendario local" description="Ajustado a tu país o diócesis">
              <select
                value={p.localCalendar}
                onChange={(e) => updatePreference('localCalendar', e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
              >
                <option value="default">Calendario general romano</option>
                <option value="ES">España</option>
                <option value="MX">México</option>
                <option value="AR">Argentina</option>
                <option value="CO">Colombia</option>
                <option value="CL">Chile</option>
                <option value="PE">Perú</option>
                <option value="US">Estados Unidos</option>
                <option value="IT">Italia</option>
                <option value="FR">Francia</option>
                <option value="DE">Alemania</option>
                <option value="OTHER">Otro</option>
              </select>
            </SettingRow>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={resetPreferences} className="laudia-btn-ghost text-xs">
            Restaurar valores por defecto
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-stone-400">
          Tus preferencias se guardan localmente en este dispositivo.
        </div>
      </div>
    </div>
  );
}
