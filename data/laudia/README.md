# Datos Litúrgicos — LaudIA

## Estructura

```
laudia/
├── calendar/      Calendario litúrgico diario (2026–2030)
│   ├── 2026.json
│   ├── 2027.json
│   ├── 2028.json
│   ├── 2029.json
│   └── 2030.json
└── texts/         Textos oficiales de la Liturgia de las Horas
    ├── psalter/
    ├── proper-of-time/
    ├── proper-of-saints/
    ├── common/
    └── fixed/
```

## Calendario

Generado con `scripts/generate-calendar.ts` usando el motor litúrgico
`src/lib/laudia/liturgical-calendar.ts`. Regenerar con:

```bash
npm run generate:calendar
```

Todos los datos están marcados como `"verificationStatus": "pending"`
hasta que sean cotejados contra el Ordo litúrgico oficial.

## Textos

Aún no cargados. Ver `texts/README.md` para detalles de la estructura pendiente.
