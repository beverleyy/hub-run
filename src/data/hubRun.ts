/* --- types --- */

export interface TapeSection {
  id: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}

/* The endurance dimensions these trips train. A trip declares which ones it
   works on; the board derives its lamps from that, so adding a capability or
   retagging a trip needs no component changes. */
export type Capability =
  | 'sector-density'
  | 'timezone'
  | 'multi-carrier'
  | 'long-haul'
  | 'seven-sectors'
  | 'stopover-chain';

export const capabilities: { id: Capability; label: string; note: string }[] = [
  { id: 'sector-density', label: 'Legs in a day', note: 'Several departures between one sunrise and the next' },
  { id: 'timezone', label: 'Time shift', note: 'Body clock dragged across zones and back' },
  { id: 'multi-carrier', label: 'Unprotected', note: 'Separate tickets — a missed connection is mine to fix' },
  { id: 'long-haul', label: 'Ultra-long', note: 'Sectors long enough to be their own day' },
  { id: 'seven-sectors', label: 'Seven in a day', note: 'What the hub run actually asks for' },
  { id: 'stopover-chain', label: 'Stopover chain', note: 'Short domestic hops threaded around a long-haul turnaround' },
];

export interface SortieLeg {
  date: string;
  mode: 'Air' | 'Rail' | 'Road' | 'Sea';
  from: string;
  to: string;
  service: string;
  /* air legs only; the carrier count is derived from these */
  carrier?: string;
  /* Deliberately optional. Anything that isn't an aircraft leaves this out and
     the table strikes the cell, so a road or rail leg never sits in a row that
     looks half-filled. Trips not yet flown leave it out too: services are
     booked, no tails are assigned. */
  equipment?: string;
}

export type SortieStatus = 'flown' | 'planned' | 'scheduled';

export interface Sortie {
  id: string;
  ref: string;
  dates: string;
  title: string;
  status: SortieStatus;
  objective: string;
  /* hours of clock shift at the far end; the only metric that can't be derived */
  tzShift: number;
  trains: Capability[];
  legs: SortieLeg[];
}

/* --- site --- */

export const siteMeta = {
  author: 'Beverley Yeo',
  year: 2026,
  registration: '9Y-KWB',
  homeUrl: 'https://beverleyy.github.io',
};

export const navLinks: NavLink[] = [
  { label: 'Main site', href: 'https://beverleyy.github.io' },
  { label: 'GitHub', href: 'https://github.com/beverleyy' },
];

/* --- page tapes --- */

export const hubRunTape: TapeSection[] = [
  { id: 'objective', label: 'Objective' },
  { id: 'capability', label: 'Capability' },
  { id: 'log', label: 'Log' },
  { id: 'target', label: 'Target' },
];

/* --- the current target --- */

export const runTarget = {
  name: 'UA 7 Hub Run',
  date: '05 June 2027',
  legs: 7,
  tzShift: 3,
};

/* --- the log, oldest first --- */

export const sorties: Sortie[] = [
{
    id: 'trip-01',
    ref: 'Trip 01',
    dates: '05 \u2014 13 May 2026',
    title: 'Trans-pacific in the middle of the school quarter???',
    status: 'flown',
    objective:
      'The longest sector flown so far, and rather than turning straight around, two domestic hops out to Jeju and back before the flight home \u2014 subway between Seoul\u2019s two airports, a bus for the last leg back into Incheon. Biggest time shift on the log by a wide margin, and the first trip where the turnaround itself has legs. Mostly a holiday trip because school is not it.',
    tzShift: 16,
    trains: ['long-haul', 'timezone', 'stopover-chain', 'multi-carrier'],
    legs: [
      { date: '05-06 May', mode: 'Air', from: 'SFO', to: 'ICN', service: 'UA 893', carrier: 'United', equipment: '787-9' },
      { date: '08 May', mode: 'Rail', from: 'ICN', to: 'GMP', service: 'Seoul Subway' },
      { date: '08 May', mode: 'Air', from: 'GMP', to: 'CJU', service: '7C 155', carrier: 'Jeju Air', equipment: '737-800' },
      { date: '11 May', mode: 'Air', from: 'CJU', to: 'CJJ', service: 'ZE 712', carrier: 'Eastar Jet', equipment: '737-800' },
      { date: '13 May', mode: 'Road', from: 'CJJ', to: 'ICN', service: 'Airport bus' },
      { date: '13 May', mode: 'Air', from: 'ICN', to: 'SFO', service: 'UA 892', carrier: 'United', equipment: '787-9' },
    ],
  },
  {
    id: 'trip-02',
    ref: 'Trip 02',
    dates: '31 July 2026 \u2014 03 August 2026',
    title: 'Three days, three zones, three airlines',
    status: 'flown',
    objective:
      'Deliberately booked as three separate tickets. One leg a day, each on a different carrier, dragging the clock three hours east and then all the way back in one hop. Ah, and I flew the first Delta leg in Delta First, and stuck a SkyPriority label on an empty cardboard box.',
    tzShift: 3,
    trains: ['timezone', 'multi-carrier'],
    legs: [
      { date: '31 Jul', mode: 'Air', from: 'ABQ', to: 'LAX', service: 'DL 4091', carrier: 'Delta', equipment: 'E-175' },
      { date: '31 Jul', mode: 'Air', from: 'LAX', to: 'SFO', service: 'DL 2986', carrier: 'Delta', equipment: '737-900'},
      { date: '01-02 Aug', mode: 'Air', from: 'SFO', to: 'ORD', service: 'UA 2278', carrier: 'United', equipment: '757-200' },
      { date: '03 Aug', mode: 'Air', from: 'ORD', to: 'ABQ', service: 'AA 1341', carrier: 'American', equipment: 'A319' },
    ],
  },
  {
    id: 'trip-03',
    ref: 'Trip 03',
    dates: '19 September 2026',
    title: 'LAX day trip',
    status: 'planned',
    objective:
      'The opposite shape: no time shift at all, everything inside one day, and the middle leg is a car because nobody flies LAX\u2013BUR. Two carriers, two airports forty minutes apart, and the whole thing has to close before the last Burbank departure. Mostly because if I can do 3x3x3 (see above), I can certainly take a puddle jumper for a keeb meet.',
    tzShift: 0,
    trains: ['sector-density'],
    legs: [
      { date: '19 Sep', mode: 'Air', from: 'SFO', to: 'LAX', service: 'UA 1260', carrier: 'United', equpiment: '737 MAX 9'},
      { date: '19 Sep', mode: 'Road', from: 'LAX', to: 'BUR', service: 'Rideshare' },
      { date: '19 Sep', mode: 'Air', from: 'BUR', to: 'SFO', service: 'UA 5380', carrier: 'United', equipment: 'E-175' },
    ],
  },
  {
    id: 'trip-04',
    ref: 'Trip 04',
    dates: '16 \u2014 18 October 2026',
    title: 'Farewell to the Queen',
    status: 'planned',
    objective:
      'Booked around two legs: Flying Lufthansa\u2019s 747 before they end passenger 747 service at SFO, and then catching their last scheduled A340-600 service to North America, on the very last day the type flies anywhere on the continent.',
    tzShift: 9,
    trains: ['long-haul', 'timezone'],
    legs: [
      { date: '16 Oct', mode: 'Air', from: 'SFO', to: 'FRA', service: 'LH 455', carrier: 'Lufthansa', equipment: '747-8I' },
      { date: '18 Oct', mode: 'Air', from: 'FRA', to: 'IAD', service: 'LH 418', carrier: 'Lufthansa', equipment: 'A340-600' },
      { date: '18 Oct', mode: 'Air', from: 'IAD', to: 'SFO', service: 'UA 367', carrier: 'United', equipment: '737-9' },
    ],
  },
];

/* --- the target, as a log entry --- */

export const checkride: Sortie = {
  id: 'the-run',
  ref: 'Target',
  dates: runTarget.date,
  title: runTarget.name,
  status: 'scheduled',
  objective:
    'All seven United hubs inside one calendar day, ending where it started. Seven sectors, six connections, one carrier, no scheduled overnight. Aircraft are whatever United puts on the gate that morning.',
  tzShift: runTarget.tzShift,
  trains: ['seven-sectors', 'sector-density'],
  legs: [
    { date: '05 Jun', mode: 'Air', from: 'EWR', to: 'IAD', service: 'UA 1366', carrier: 'United' },
    { date: '05 Jun', mode: 'Air', from: 'IAD', to: 'ORD', service: 'UA 1775', carrier: 'United' },
    { date: '05 Jun', mode: 'Air', from: 'ORD', to: 'IAH', service: 'UA 2212', carrier: 'United' },
    { date: '05 Jun', mode: 'Air', from: 'IAH', to: 'DEN', service: 'UA 2767', carrier: 'United' },
    { date: '05 Jun', mode: 'Air', from: 'DEN', to: 'SFO', service: 'UA 1007', carrier: 'United' },
    { date: '05 Jun', mode: 'Air', from: 'SFO', to: 'LAX', service: 'UA 1174', carrier: 'United' },
  ],
};

/* --- derived metrics ---
   Only tzShift is hand-entered. Days, legs and carriers all come from the leg
   list, so they can't drift out of step with it. */

export function sortieDays(s: Sortie): number {
  const ordinals = s.legs.map((l) => dayOfYear(l.date));
  return Math.max(...ordinals) - Math.min(...ordinals) + 1;
}

export function sortieCarriers(s: Sortie): number {
  return new Set(s.legs.map((l) => l.carrier).filter(Boolean)).size;
}

/* most legs sharing a single date — the sector-density figure */
export function sortiePeakDay(s: Sortie): number {
  const perDay = new Map<string, number>();
  for (const l of s.legs) perDay.set(l.date, (perDay.get(l.date) ?? 0) + 1);
  return Math.max(...perDay.values());
}

/* --- route ribbons ---
   Derived from the legs, so a ribbon can never disagree with the table under
   it. Legs are expected to chain (each one departing where the last arrived);
   where they don't — arriving at one airport and leaving from another — the
   ribbon shows an explicit break rather than implying a connection that
   didn't happen. */

export type RouteNode =
  | { kind: 'stop'; name: string }
  | { kind: 'seg'; mode: SortieLeg['mode'] }
  | { kind: 'break' };

export function routeOf(s: Sortie): RouteNode[] {
  const out: RouteNode[] = [];
  s.legs.forEach((leg, i) => {
    if (i === 0) {
      out.push({ kind: 'stop', name: leg.from });
    } else if (s.legs[i - 1].to !== leg.from) {
      out.push({ kind: 'break' });
      out.push({ kind: 'stop', name: leg.from });
    }
    out.push({ kind: 'seg', mode: leg.mode });
    out.push({ kind: 'stop', name: leg.to });
  });
  return out;
}

/* only the modes actually used, so the legend doesn't explain a line style
   that never appears */
export const usedModes: SortieLeg['mode'][] = (() => {
  const order: SortieLeg['mode'][] = ['Air', 'Rail', 'Sea', 'Road'];
  const seen = new Set([...sorties, checkride].flatMap((s) => s.legs.map((l) => l.mode)));
  return order.filter((m) => seen.has(m));
})();

/* --- capability board ---
   lit    a flown trip has trained it
   ringed only a booked trip trains it
   dark   nothing on the log reaches it yet */

export type CapState = 'trained' | 'booked' | 'untrained';

export function capState(id: Capability): CapState {
  if (sorties.some((s) => s.status === 'flown' && s.trains.includes(id))) return 'trained';
  if (sorties.some((s) => s.status === 'planned' && s.trains.includes(id))) return 'booked';
  return 'untrained';
}

/* --- summary for the objective panel --- */

const flownSorties = sorties.filter((s) => s.status === 'flown');
const bookedSorties = sorties.filter((s) => s.status === 'planned');

function best(list: Sortie[], f: (s: Sortie) => number): number | undefined {
  return list.length ? Math.max(...list.map(f)) : undefined;
}

export const progress = {
  flownCount: flownSorties.length,
  bookedCount: bookedSorties.length,
  peakDayFlown: best(flownSorties, sortiePeakDay),
  peakDayBooked: best(bookedSorties, sortiePeakDay),
  tzFlown: best(flownSorties, (s) => s.tzShift),
  tzBooked: best(bookedSorties, (s) => s.tzShift),
  carriersFlown: best(flownSorties, sortieCarriers),
};

