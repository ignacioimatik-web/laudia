# Textos Litúrgicos — LaudIA

Esta carpeta contiene los textos oficiales de la Liturgia de las Horas (Laudes).

## Estructura

```
texts/
├── psalter/              Salmos y antífonas del Salterio (4 semanas)
├── proper-of-time/       Propio del tiempo (Adviento, Navidad, Cuaresma, Pascua)
├── proper-of-saints/     Propio de los santos (fechas fijas con textos propios)
├── common/               Común de santos (apóstoles, mártires, vírgenes, etc.)
└── fixed/                Textos fijos (invitatorio, Benedictus, Gloria, etc.)
```

## Formato de referencia

Cada día en `/data/laudia/calendar/{año}.json` contiene un campo `textRefs`
con claves como:

```
hymn:             proper-of-time/2027-01-01
antiphon1:        psalter/week-1/monday
psalm1:           psalter/week-1/monday/psalm-63
canticleOt:       proper-of-time/lent/week-3
reading:          proper-of-time/2027-01-01
benedictusAntiphon: proper-of-saints/2027-01-01
intercessions:    commons/lent
closingPrayer:    commons/lent
```

## Estado de verificación

| Estado        | Significado |
|---------------|-------------|
| `pending`     | Sin textos cargados |
| `needs_review`| Textos cargados, pendientes de cotejo oficial |
| `verified`    | Texto verificado contra edición oficial |

## Fuentes oficiales

Los textos deben cargarse desde una fuente autorizada de la Liturgia de las Horas
aprobada por la Conferencia Episcopal correspondiente (ej. CEE para España,
CELAM para Latinoamérica). No se deben utilizar textos no autorizados.

## Pendiente

-   [ ] Obtener licencia o permiso para uso de textos oficiales.
-   [ ] Cargar Salterio (4 semanas) completo.
-   [ ] Cargar Propio del tiempo (temporadas y solemnidades móviles).
-   [ ] Cargar Propio de los santos (fechas fijas).
-   [ ] Cargar Común de santos.
-   [ ] Cargar textos fijos (Benedictus, Te Deum, etc.).
-   [ ] Validar cada texto contra edición oficial.
