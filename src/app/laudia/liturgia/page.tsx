import { useState } from 'react';

interface PdfLink {
  label: string;
  url: string;
}

interface CycleLinks {
  cycle: string;
  yearLabel: string;
  links: PdfLink[];
}

interface SeasonData {
  title: string;
  cycles: CycleLinks[];
}

const cycleYears: Record<string, string> = { A: '2027, 2030…', B: '2025, 2028…', C: '2026, 2029…' };

const seasons: SeasonData[] = [
  {
    title: 'Adviento',
    cycles: [
      { cycle: 'A', yearLabel: '2028, 2031', links: [
        { label: 'I Domingo', url: 'http://www.conferenciaepiscopal.es/liturgia/aa1.pdf' },
        { label: 'II Domingo', url: 'http://www.conferenciaepiscopal.es/liturgia/aa2.pdf' },
        { label: 'III Domingo', url: 'http://www.conferenciaepiscopal.es/liturgia/aa3.pdf' },
        { label: 'IV Domingo', url: 'http://www.conferenciaepiscopal.es/liturgia/aa4.pdf' },
      ]},
      { cycle: 'B', yearLabel: '2025, 2028', links: [
        { label: 'I Domingo', url: 'http://www.conferenciaepiscopal.es/liturgia/ba1.pdf' },
        { label: 'II Domingo', url: 'http://www.conferenciaepiscopal.es/liturgia/ba2.pdf' },
        { label: 'III Domingo', url: 'http://www.conferenciaepiscopal.es/liturgia/ba3.pdf' },
        { label: 'IV Domingo', url: 'http://www.conferenciaepiscopal.es/liturgia/ba4.pdf' },
      ]},
      { cycle: 'C', yearLabel: '2026, 2029', links: [
        { label: 'I Domingo', url: 'http://www.conferenciaepiscopal.es/liturgia/ca1.pdf' },
        { label: 'II Domingo', url: 'http://www.conferenciaepiscopal.es/liturgia/ca2.pdf' },
        { label: 'III Domingo', url: 'http://www.conferenciaepiscopal.es/liturgia/ca3.pdf' },
        { label: 'IV Domingo', url: 'https://www.conferenciaepiscopal.es/wp-content/uploads/liturgiaidiomas/italiano/cicloa/Adviento4.pdf' },
      ]},
    ],
  },
  {
    title: 'Navidad',
    cycles: [
      { cycle: 'A', yearLabel: '2028, 2031', links: [
        { label: 'Navidad (Misa de la vigilia)', url: 'https://www.conferenciaepiscopal.es/liturgia/anvigilia.pdf' },
        { label: 'Navidad (Misa de medianoche)', url: 'https://www.conferenciaepiscopal.es/liturgia/anmedianoche.pdf' },
        { label: 'Navidad (Misa de la aurora)', url: 'https://www.conferenciaepiscopal.es/liturgia/anaurora.pdf' },
        { label: 'Navidad (Misa del día)', url: 'https://www.conferenciaepiscopal.es/liturgia/andia.pdf' },
        { label: 'Sagrada Familia', url: 'https://www.conferenciaepiscopal.es/liturgia/afamilia.pdf' },
        { label: 'Sta. María Madre de Dios', url: 'https://www.conferenciaepiscopal.es/liturgia/amaterdei.pdf' },
        { label: 'Domingo 2º después de Navidad', url: 'https://www.conferenciaepiscopal.es/liturgia/an2.pdf' },
        { label: 'Epifanía', url: 'https://www.conferenciaepiscopal.es/liturgia/aepifania.pdf' },
        { label: 'Bautismo del Señor', url: 'https://www.conferenciaepiscopal.es/liturgia/abautismo.pdf' },
      ]},
      { cycle: 'B', yearLabel: '2025, 2028', links: [
        { label: 'Navidad (Misa de la vigilia)', url: 'https://www.conferenciaepiscopal.es/liturgia/bnvigilia.pdf' },
        { label: 'Navidad (Misa de medianoche)', url: 'https://www.conferenciaepiscopal.es/liturgia/bnmedianoche.pdf' },
        { label: 'Navidad (Misa de la aurora)', url: 'https://www.conferenciaepiscopal.es/liturgia/bnaurora.pdf' },
        { label: 'Navidad (Misa del día)', url: 'https://www.conferenciaepiscopal.es/liturgia/bndia.pdf' },
        { label: 'Sagrada Familia', url: 'https://www.conferenciaepiscopal.es/liturgia/bfamilia.pdf' },
        { label: 'Sta. María Madre de Dios', url: 'https://www.conferenciaepiscopal.es/liturgia/bmaterdei.pdf' },
        { label: 'Domingo 2º después de Navidad', url: 'https://www.conferenciaepiscopal.es/liturgia/an2.pdf' },
        { label: 'Epifanía', url: 'https://www.conferenciaepiscopal.es/liturgia/bepifania.pdf' },
        { label: 'Bautismo del Señor', url: 'https://www.conferenciaepiscopal.es/liturgia/bbautismo.pdf' },
      ]},
      { cycle: 'C', yearLabel: '2026, 2029', links: [
        { label: 'Navidad (Misa de la vigilia)', url: 'https://www.conferenciaepiscopal.es/liturgia/cnvigilia.pdf' },
        { label: 'Navidad (Misa de medianoche)', url: 'https://www.conferenciaepiscopal.es/liturgia/cnmedianoche.pdf' },
        { label: 'Navidad (Misa de la aurora)', url: 'https://www.conferenciaepiscopal.es/liturgia/cnaurora.pdf' },
        { label: 'Navidad (Misa del día)', url: 'https://www.conferenciaepiscopal.es/liturgia/cndia.pdf' },
        { label: 'Sagrada Familia', url: 'https://www.conferenciaepiscopal.es/liturgia/cfamilia.pdf' },
        { label: 'Sta. María Madre de Dios', url: 'https://www.conferenciaepiscopal.es/liturgia/cmaterdei.pdf' },
        { label: 'Domingo 2º después de Navidad', url: 'https://www.conferenciaepiscopal.es/liturgia/cn2.pdf' },
        { label: 'Epifanía', url: 'https://www.conferenciaepiscopal.es/liturgia/cepifania.pdf' },
        { label: 'Bautismo del Señor', url: 'https://www.conferenciaepiscopal.es/liturgia/cbautismo.pdf' },
      ]},
    ],
  },
  {
    title: 'Cuaresma',
    cycles: [
      { cycle: 'A', yearLabel: '2028, 2031', links: [
        { label: 'I Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ac1.pdf' },
        { label: 'II Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ac2.pdf' },
        { label: 'III Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ac3.pdf' },
        { label: 'IV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ac4.pdf' },
        { label: 'V Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ac5.pdf' },
        { label: 'Domingo de Ramos (procesión)', url: 'https://www.conferenciaepiscopal.es/liturgia/assdrprocesion.pdf' },
        { label: 'Domingo de Ramos (Misa)', url: 'https://www.conferenciaepiscopal.es/liturgia/assdr.pdf' },
      ]},
      { cycle: 'B', yearLabel: '2025, 2028', links: [
        { label: 'I Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bc1.pdf' },
        { label: 'II Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bc2.pdf' },
        { label: 'III Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bc3.pdf' },
        { label: 'IV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bc4.pdf' },
        { label: 'V Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bc5.pdf' },
        { label: 'Domingo de Ramos (procesión)', url: 'https://www.conferenciaepiscopal.es/liturgia/bssdr.pdf' },
        { label: 'Domingo de Ramos (Misa)', url: 'https://www.conferenciaepiscopal.es/liturgia/bssdr.pdf' },
      ]},
      { cycle: 'C', yearLabel: '2026, 2029', links: [
        { label: 'I Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/cc1.pdf' },
        { label: 'II Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/cc2.pdf' },
        { label: 'III Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/cc3.pdf' },
        { label: 'IV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/cc4.pdf' },
        { label: 'V Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/cc5.pdf' },
        { label: 'Domingo de Ramos (procesión)', url: 'https://www.conferenciaepiscopal.es/liturgia/cssdr.pdf' },
        { label: 'Domingo de Ramos (Misa)', url: 'https://www.conferenciaepiscopal.es/liturgia/cssdr.pdf' },
      ]},
    ],
  },
  {
    title: 'Triduo Sacro',
    cycles: [
      { cycle: 'A', yearLabel: '2028, 2031', links: [
        { label: 'Jueves Santo', url: 'https://www.conferenciaepiscopal.es/liturgia/assjs.pdf' },
        { label: 'Viernes Santo', url: 'https://www.conferenciaepiscopal.es/liturgia/assvs.pdf' },
        { label: 'Vigilia Pascual', url: 'https://www.conferenciaepiscopal.es/liturgia/assvp.pdf' },
      ]},
      { cycle: 'B', yearLabel: '2025, 2028', links: [
        { label: 'Jueves Santo', url: 'https://www.conferenciaepiscopal.es/liturgia/bssjs.pdf' },
        { label: 'Viernes Santo', url: 'https://www.conferenciaepiscopal.es/liturgia/bssvs.pdf' },
        { label: 'Vigilia Pascual', url: 'https://www.conferenciaepiscopal.es/liturgia/bssvp.pdf' },
      ]},
      { cycle: 'C', yearLabel: '2026, 2029', links: [
        { label: 'Jueves Santo', url: 'https://www.conferenciaepiscopal.es/liturgia/cssjs.pdf' },
        { label: 'Viernes Santo', url: 'https://www.conferenciaepiscopal.es/liturgia/cssvs.pdf' },
        { label: 'Vigilia Pascual', url: 'https://www.conferenciaepiscopal.es/liturgia/cssvp.pdf' },
      ]},
    ],
  },
  {
    title: 'Pascua',
    cycles: [
      { cycle: 'A', yearLabel: '2028, 2031', links: [
        { label: 'Domingo de Pascua', url: 'https://www.conferenciaepiscopal.es/liturgia/ap1.pdf' },
        { label: 'II Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ap2.pdf' },
        { label: 'III Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ap3.pdf' },
        { label: 'IV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ap4.pdf' },
        { label: 'V Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ap5.pdf' },
        { label: 'VI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ap6.pdf' },
        { label: 'VII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ap7.pdf' },
        { label: 'La Ascensión del Señor', url: 'https://www.conferenciaepiscopal.es/liturgia/aascension.pdf' },
        { label: 'Domingo de Pentecostés', url: 'https://www.conferenciaepiscopal.es/liturgia/apentecostes.pdf' },
      ]},
      { cycle: 'B', yearLabel: '2025, 2028', links: [
        { label: 'Domingo de Pascua', url: 'https://www.conferenciaepiscopal.es/liturgia/bp1.pdf' },
        { label: 'II Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bp2.pdf' },
        { label: 'III Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bp3.pdf' },
        { label: 'IV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bp4.pdf' },
        { label: 'V Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bp5.pdf' },
        { label: 'VI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bp6.pdf' },
        { label: 'VII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bp7.pdf' },
        { label: 'La Ascensión del Señor', url: 'https://www.conferenciaepiscopal.es/liturgia/bascension.pdf' },
        { label: 'Domingo de Pentecostés', url: 'https://www.conferenciaepiscopal.es/liturgia/bpentecostes.pdf' },
      ]},
      { cycle: 'C', yearLabel: '2026, 2029', links: [
        { label: 'Domingo de Pascua', url: 'https://www.conferenciaepiscopal.es/liturgia/cp1.pdf' },
        { label: 'II Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/cp2.pdf' },
        { label: 'III Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/cp3.pdf' },
        { label: 'IV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/cp4.pdf' },
        { label: 'V Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/cp5.pdf' },
        { label: 'VI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/cp6.pdf' },
        { label: 'VII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/cp7.pdf' },
        { label: 'La Ascensión del Señor', url: 'https://www.conferenciaepiscopal.es/liturgia/cascension.pdf' },
        { label: 'Domingo de Pentecostés', url: 'https://www.conferenciaepiscopal.es/liturgia/cpentecostes.pdf' },
      ]},
    ],
  },
  {
    title: 'Tiempo Ordinario',
    cycles: [
      { cycle: 'A', yearLabel: '2028, 2031', links: [
        { label: 'II Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao2.pdf' },
        { label: 'III Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao3.pdf' },
        { label: 'IV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao4.pdf' },
        { label: 'V Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao5.pdf' },
        { label: 'VI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao6.pdf' },
        { label: 'VII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao7.pdf' },
        { label: 'VIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao8.pdf' },
        { label: 'IX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao9.pdf' },
        { label: 'X Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao10.pdf' },
        { label: 'XI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao11.pdf' },
        { label: 'XII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao12.pdf' },
        { label: 'XIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao13.pdf' },
        { label: 'XIV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao14.pdf' },
        { label: 'XV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao15.pdf' },
        { label: 'XVI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao16.pdf' },
        { label: 'XVII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao17.pdf' },
        { label: 'XVIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao18.pdf' },
        { label: 'XIX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao19.pdf' },
        { label: 'XX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao20.pdf' },
        { label: 'XXI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao21.pdf' },
        { label: 'XXII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao22.pdf' },
        { label: 'XXIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao23.pdf' },
        { label: 'XXIV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao24.pdf' },
        { label: 'XXV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao25.pdf' },
        { label: 'XXVI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao26.pdf' },
        { label: 'XXVII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao27.pdf' },
        { label: 'XXVIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao28.pdf' },
        { label: 'XXIX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao29.pdf' },
        { label: 'XXX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao3o.pdf' },
        { label: 'XXXI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao31.pdf' },
        { label: 'XXXII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao32.pdf' },
        { label: 'XXXIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao33.pdf' },
        { label: 'Jesucristo Rey del Universo', url: 'https://www.conferenciaepiscopal.es/liturgia/ao34.pdf' },
      ]},
      { cycle: 'B', yearLabel: '2025, 2028', links: [
        { label: 'II Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo2.pdf' },
        { label: 'III Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo3.pdf' },
        { label: 'IV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo4.pdf' },
        { label: 'V Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo5.pdf' },
        { label: 'VI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo6.pdf' },
        { label: 'VII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo7.pdf' },
        { label: 'VIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo8.pdf' },
        { label: 'IX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo9.pdf' },
        { label: 'X Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo10.pdf' },
        { label: 'XI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo11.pdf' },
        { label: 'XII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo12.pdf' },
        { label: 'XIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo13.pdf' },
        { label: 'XIV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo14.pdf' },
        { label: 'XV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo15.pdf' },
        { label: 'XVI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo16.pdf' },
        { label: 'XVII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo17.pdf' },
        { label: 'XVIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo18.pdf' },
        { label: 'XIX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo19.pdf' },
        { label: 'XX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo20.pdf' },
        { label: 'XXI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo21.pdf' },
        { label: 'XXII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo22.pdf' },
        { label: 'XXIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo23.pdf' },
        { label: 'XXIV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo24.pdf' },
        { label: 'XXV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo25.pdf' },
        { label: 'XXVI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo26.pdf' },
        { label: 'XXVII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo27.pdf' },
        { label: 'XXVIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo28.pdf' },
        { label: 'XXIX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo29.pdf' },
        { label: 'XXX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo3o.pdf' },
        { label: 'XXXI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo31.pdf' },
        { label: 'XXXII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo32.pdf' },
        { label: 'XXXIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo33.pdf' },
        { label: 'Jesucristo Rey del Universo', url: 'https://www.conferenciaepiscopal.es/liturgia/bo34.pdf' },
      ]},
      { cycle: 'C', yearLabel: '2026, 2029', links: [
        { label: 'II Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co2.pdf' },
        { label: 'III Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co3.pdf' },
        { label: 'IV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co4.pdf' },
        { label: 'V Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co5.pdf' },
        { label: 'VI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co6.pdf' },
        { label: 'VII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co7.pdf' },
        { label: 'VIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co8.pdf' },
        { label: 'IX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co9.pdf' },
        { label: 'X Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co10.pdf' },
        { label: 'XI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co11.pdf' },
        { label: 'XII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co12.pdf' },
        { label: 'XIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co13.pdf' },
        { label: 'XIV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co14.pdf' },
        { label: 'XV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co15.pdf' },
        { label: 'XVI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co16.pdf' },
        { label: 'XVII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co17.pdf' },
        { label: 'XVIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co18.pdf' },
        { label: 'XIX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co19.pdf' },
        { label: 'XX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co20.pdf' },
        { label: 'XXI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co21.pdf' },
        { label: 'XXII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co22.pdf' },
        { label: 'XXIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co23.pdf' },
        { label: 'XXIV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co24.pdf' },
        { label: 'XXV Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co25.pdf' },
        { label: 'XXVI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co26.pdf' },
        { label: 'XXVII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co27.pdf' },
        { label: 'XXVIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co28.pdf' },
        { label: 'XXIX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co29.pdf' },
        { label: 'XXX Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co3.pdf' },
        { label: 'XXXI Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co31.pdf' },
        { label: 'XXXII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co32.pdf' },
        { label: 'XXXIII Domingo', url: 'https://www.conferenciaepiscopal.es/liturgia/co33.pdf' },
        { label: 'Jesucristo Rey del Universo', url: 'https://www.conferenciaepiscopal.es/liturgia/co34.pdf' },
      ]},
    ],
  },
];

const solemnidades: { title: string; cycles: CycleLinks[] } = {
  title: 'Otras Solemnidades',
  cycles: [
    { cycle: 'A', yearLabel: '2028, 2031', links: [
      { label: 'Santísima Trinidad', url: 'https://www.conferenciaepiscopal.es/liturgia/atrinitas.pdf' },
      { label: 'Santísimo Cuerpo y Sangre', url: 'https://www.conferenciaepiscopal.es/liturgia/acorpus.pdf' },
      { label: 'Sagrado Corazón de Jesús', url: 'https://www.conferenciaepiscopal.es/liturgia/acorjesu.pdf' },
    ]},
    { cycle: 'B', yearLabel: '2025, 2028', links: [
      { label: 'Santísima Trinidad', url: 'https://www.conferenciaepiscopal.es/liturgia/btrinitas.pdf' },
      { label: 'Santísimo Cuerpo y Sangre', url: 'https://www.conferenciaepiscopal.es/liturgia/bcorpus.pdf' },
      { label: 'Sagrado Corazón de Jesús', url: 'https://www.conferenciaepiscopal.es/liturgia/bcorjesu.pdf' },
    ]},
    { cycle: 'C', yearLabel: '2026, 2029', links: [
      { label: 'Santísima Trinidad', url: 'https://www.conferenciaepiscopal.es/liturgia/ctrinitas.pdf' },
      { label: 'Santísimo Cuerpo y Sangre', url: 'https://www.conferenciaepiscopal.es/liturgia/ccorpus.pdf' },
      { label: 'Sagrado Corazón de Jesús', url: 'https://www.conferenciaepiscopal.es/liturgia/ccorjesu.pdf' },
    ]},
  ],
};

const santoralLinks: PdfLink[] = [
  { label: '19 de marzo. San José', url: 'https://www.conferenciaepiscopal.es/liturgia/sanjose.pdf' },
  { label: '25 de marzo. La Encarnación del Hijo de Dios', url: 'http://www.conferenciaepiscopal.es/liturgia/anunciacion.pdf' },
  { label: '25 de julio. Santiago apóstol', url: 'https://www.conferenciaepiscopal.es/liturgia/santiago.pdf' },
  { label: '15 de agosto. La Asunción de María a los cielos', url: 'https://www.conferenciaepiscopal.es/liturgia/asuncion.pdf' },
  { label: '1 de noviembre. Todos los Santos', url: 'https://www.conferenciaepiscopal.es/liturgia/todoslossantos.pdf' },
  { label: '8 de diciembre. La Inmaculada Concepción', url: 'https://www.conferenciaepiscopal.es/liturgia/inmaculada.pdf' },
];

function getCurrentCycle(): string {
  const year = new Date().getFullYear();
  const cycleIndex = (year - 2025) % 3;
  return ['B', 'C', 'A'][cycleIndex] || 'A';
}

function PdfLinksSection({ links }: { links: PdfLink[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100/70 text-stone-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 border border-stone-200/60 transition-all"
        >
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {link.label}
        </a>
      ))}
    </div>
  );
}

function CyclePills({
  cycles,
  selectedCycle,
}: {
  cycles: CycleLinks[];
  selectedCycle: string;
}) {
  const active = cycles.find((c) => c.cycle === selectedCycle);
  if (!active) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-stone-400">
        <span className="font-mono text-amber-600 font-bold">{active.cycle}</span>
        <span className="text-stone-400">·</span>
        <span>{active.yearLabel}</span>
      </div>
      <PdfLinksSection links={active.links} />
    </div>
  );
}

function AccordionSection({
  title,
  cycles,
  selectedCycle,
  defaultOpen,
}: {
  title: string;
  cycles: CycleLinks[];
  selectedCycle: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="laudia-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors hover:bg-stone-50/50 touch-target"
      >
        <h2 className="text-sm font-bold text-stone-700 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          {title}
        </h2>
        <svg
          className={`h-4 w-4 text-stone-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-stone-100 pt-3">
          <CyclePills cycles={cycles} selectedCycle={selectedCycle} />
        </div>
      </div>
    </div>
  );
}

export default function LiturgiaPage() {
  const currentCycle = getCurrentCycle();
  const [selectedCycle, setSelectedCycle] = useState(currentCycle);

  return (
    <div className="min-h-screen laudia-gradient">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 space-y-5">

        <div className="laudia-card p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h1 className="text-xl font-bold text-stone-800">Liturgia en español</h1>
          </div>
          <p className="text-sm text-stone-500 leading-relaxed">
            Lecturas dominicales y festivas para la eucaristía.
            Fuente oficial de la Conferencia Episcopal Española.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-500 font-medium mr-1">Ciclo:</span>
            {['A', 'B', 'C'].map((cycle) => {
              const isCurrent = cycle === currentCycle;
              const isSelected = cycle === selectedCycle;
              return (
                <button
                  key={cycle}
                  onClick={() => setSelectedCycle(cycle)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-[0_4px_12px_rgba(183,121,31,0.3)]'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200/60'
                  }`}
                >
                  {cycle}
                  <span className={`text-[10px] font-normal ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                    {cycleYears[cycle]}
                  </span>
                  {isCurrent && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                      isSelected ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'
                    }`}>
                      ahora
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {seasons.map((season) => (
          <AccordionSection
            key={season.title}
            title={season.title}
            cycles={season.cycles}
            selectedCycle={selectedCycle}
            defaultOpen
          />
        ))}

        <AccordionSection
          title={solemnidades.title}
          cycles={solemnidades.cycles}
          selectedCycle={selectedCycle}
        />

        <div className="laudia-card p-5 md:p-6">
          <h2 className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            Santoral
          </h2>
          <PdfLinksSection links={santoralLinks} />
        </div>

        <div className="text-center py-4">
          <p className="text-xs text-stone-400">
            Fuente:{' '}
            <a
              href="https://www.conferenciaepiscopal.es/liturgia-en-espanol/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-700 transition-colors"
            >
              Conferencia Episcopal Española
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
