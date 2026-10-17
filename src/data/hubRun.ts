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
  { id: 'redeye', 'label': 'Red-eye', note: 'Overnight sectors that replace sleeping in a bed' },
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
  registration: '7HUB',
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
    title: 'Proof of concept',
    status: 'flown',
    objective:
      'My sister needed a driver for her Jeju trip, but the flight prices for a single weekend weren\'t it, so I added a few days to explore the country and demonstrate the possibility of flying intercontinental in the middle of a school quarter.',
    tzShift: 16,
    trains: ['long-haul', 'timezone', 'stopover-chain', 'multi-carrier'],
    legs: [
      { date: '05-06 May', mode: 'Air', from: 'SFO', to: 'ICN', service: 'UA 893', carrier: 'United', equipment: 'B789' },
      { date: '08 May', mode: 'Rail', from: 'ICN', to: 'GMP', service: 'Seoul Subway' },
      { date: '08 May', mode: 'Air', from: 'GMP', to: 'CJU', service: '7C 155', carrier: 'Jeju Air', equipment: 'B738' },
      { date: '11 May', mode: 'Air', from: 'CJU', to: 'CJJ', service: 'ZE 712', carrier: 'Eastar Jet', equipment: 'B738' },
      { date: '13 May', mode: 'Road', from: 'CJJ', to: 'ICN', service: 'Airport bus' },
      { date: '13 May', mode: 'Air', from: 'ICN', to: 'SFO', service: 'UA 892', carrier: 'United', equipment: 'B789' },
    ],
  },
  {
    id: 'trip-02',
    ref: 'Trip 02',
    dates: '31 July 2026 \u2014 03 August 2026',
    title: '3 days, 3 timezones, 3 airlines (3 planemakers)',
    status: 'flown',
    objective:
      'Los Alamos was too isolating, so I turned my rental car return into an entire trip. Deliberately booked as three separate tickets. One leg a day, each on a different carrier, dragging the clock three hours east and then all the way back in one hop. Ah, and I flew the first Delta leg in Delta First, and stuck a SkyPriority label on an empty cardboard box.',
    tzShift: 3,
    trains: ['timezone', 'multi-carrier', 'redeye'],
    legs: [
      { date: '31 Jul', mode: 'Air', from: 'ABQ', to: 'LAX', service: 'DL 4091', carrier: 'Delta', equipment: 'E75L' },
      { date: '31 Jul', mode: 'Air', from: 'LAX', to: 'SFO', service: 'DL 2986', carrier: 'Delta', equipment: 'B739'},
      { date: '01-02 Aug', mode: 'Air', from: 'SFO', to: 'ORD', service: 'UA 2278', carrier: 'United', equipment: 'B753' },
      { date: '03 Aug', mode: 'Air', from: 'ORD', to: 'ABQ', service: 'AA 1341', carrier: 'American', equipment: 'A319' },
    ],
  },
  {
    id: 'trip-03',
    ref: 'Trip 03',
    dates: '19 September 2026',
    title: 'Single-day SoCal spin',
    status: 'flown',
    objective:
      'I needed my SQ miles gone and I needed to attend Keeblife, so I booked SFO-LAX in the morning through SQ and the last Burbank departure to SFO on the $100 travel credit UA gave me for my Korea trip (see above). Mostly because if I can do 3x3x3 (see above), I can certainly take a puddle jumper for a keeb meet.',
    tzShift: 0,
    trains: ['sector-density'],
    legs: [
      { date: '19 Sep', mode: 'Air', from: 'SFO', to: 'LAX', service: 'UA 1260', carrier: 'United', equipment: 'B39M'},
      { date: '19 Sep', mode: 'Road', from: 'LAX', to: 'BUR', service: 'Rideshare' },
      { date: '19 Sep', mode: 'Air', from: 'BUR', to: 'SFO', service: 'UA 5380', carrier: 'United', equipment: 'E75L' },
    ],
  },
  {
    id: 'trip-04',
    ref: 'Trip 04',
    dates: '16 \u2014 18 October 2026',
    title: 'Ode to the quadjet (farewell to the Queen)',
    status: 'flown',
    objective:
      'Booked around two quadjets: Catching an A340-600 before Lufthansa permanently retires the type on 18 Oct, and then flying their 747 before they end passenger 747 service at SFO on 25 Oct. A few days of buffer in case there\'s a plane swap, and Mechanicon in the middle.',
    tzShift: 9,
    trains: ['long-haul', 'timezone', 'redeye'],
    legs: [
      { date: '14-15 Oct', mode: 'Air', from: 'SFO', to: 'IAD', service: 'UA 2837', carrier: 'United', equipment: 'B39M' },
      { date: '15-16 Oct', mode: 'Air', from: 'IAD', to: 'FRA', service: 'LH 419', carrier: 'Lufthansa', equipment: 'A346' },
      { date: '18 Oct', mode: 'Air', from: 'FRA', to: 'SFO', service: 'LH 454', carrier: 'Lufthansa', equipment: 'B748' },
    ],
  },  
  {
    id: 'trip-05',
    ref: 'Trip 05',
    dates: '25-28 April 2027',
    title: 'Unfinished business',
    status: 'planned',
    objective:
      'Tore some ankle ligaments during fleet week 4 days before the previous trip and spent the DC layover in the IAD United Club, so I need a DC do-over. Secondary objectives: Lufthansa A380 to complete my quadjet set, and the inaugural UA222 to Toulouse for some Beluga spotting.',
    tzShift: 9,
    trains: ['long-haul', 'timezone', 'sector-density', 'redeye'],
    legs: [
      { date: '25-26 Apr', mode: 'Air', from: 'SFO', to: 'IAD', service: 'UA 2111', carrier: 'United', equipment: 'B39M' },
      { date: '26-27 Apr', mode: 'Air', from: 'IAD', to: 'TLS', service: 'UA 222', carrier: 'United', equipment: 'A21N' },
      { date: '28 Apr', mode: 'Air', from: 'TLS', to: 'MUC', service: 'LH 2223', carrier: 'Lufthansa', equipment: 'A20N' },      
      { date: '28 Apr', mode: 'Air', from: 'MUC', to: 'SFO', service: 'LH 458', carrier: 'Lufthansa', equipment: 'A388' },
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
    'All seven United hubs inside one calendar day, ending where it started. Seven sectors, six connections, one carrier, no scheduled overnight. Aircraft are whatever United has scheduled now, but they might upgauge as the date draws nearer.',
  tzShift: runTarget.tzShift,
  trains: ['seven-sectors', 'sector-density'],
  legs: [
    { date: '05 Jun', mode: 'Air', from: 'EWR', to: 'IAD', service: 'UA 1366', carrier: 'United', equipment: 'B739' },
    { date: '05 Jun', mode: 'Air', from: 'IAD', to: 'ORD', service: 'UA 1775', carrier: 'United', equipment: 'B739' },
    { date: '05 Jun', mode: 'Air', from: 'ORD', to: 'IAH', service: 'UA 2212', carrier: 'United', equipment: 'A21N' },
    { date: '05 Jun', mode: 'Air', from: 'IAH', to: 'DEN', service: 'UA 1586', carrier: 'United', equipment: 'A21N' },
    { date: '05 Jun', mode: 'Air', from: 'DEN', to: 'SFO', service: 'UA 1007', carrier: 'United', equipment: 'A21N' },
    { date: '05 Jun', mode: 'Air', from: 'SFO', to: 'LAX', service: 'UA 2862', carrier: 'United', equipment: 'B738' },
  ],
};

/* --- derived metrics ---
   Only tzShift is hand-entered. Days, legs and carriers all come from the leg
   list, so they can't drift out of step with it. */

export function sortieDays(s: Sortie): number {
  const MONTH_START_DAY = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
 
  /* Accepts "16 Oct" and also an overnight range like "05-06 May" or
     "5–6 May" (hyphen or en dash) — an overnight leg keeps its full range in
     the displayed date, but the SPAN calculation anchors on the departure
     day (the first number), matching how flights are conventionally dated
     by their departure regardless of when they land. */
  function dayOfYear(dateStr: string): number {
    const match = /^(\d{1,2})(?:\s*[-–]\s*\d{1,2})?\s+([A-Za-z]{3})/.exec(dateStr.trim());
    if (!match) {
      throw new Error(`Leg date "${dateStr}" isn't in the "D MMM" or "D-D MMM" format (e.g. "16 Oct" or "16-17 Oct") — can't compute a day span from it.`);
    }
    const month = MONTHS.indexOf(match[2].toLowerCase());
    if (month === -1) {
      throw new Error(`Leg date "${dateStr}" has an unrecognised month.`);
    }
    return MONTH_START_DAY[month] + Number(match[1]);
  }
 
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

