// data/brt-data.ts: demo data, shaped like the Supabase tables so it can be swapped later.
// Fares: LAMATA list effective 2 March 2026. Everything else is unverified until checked on the ground.

export type Place = {
  slug: string;
  name: string;
  type: "terminal" | "stop";
  lat: number | null; // TODO: fill from Google Maps pins (latitude first)
  lng: number | null; // TODO: longitude
  verified: boolean;
};

export type Route = {
  slug: string;
  service: "standard" | "brt";
  from: string;      // place slug (origin: where buses wait)
  to: string;        // place slug (last stop)
  via: string[];     // places passed on the way where you can get down, in order
  fareNgn: number;   // flat fare, the same wherever you get down
  headwayMin: [number, number]; // typical gap between buses (estimate)
  verified: boolean;
};

export const places: Place[] = [
  { slug: "ayobo",       name: "Ayobo",       type: "stop",     lat: null, lng: null, verified: true },
  { slug: "iyana-ipaja", name: "Iyana-Ipaja", type: "stop",     lat: null, lng: null, verified: true },
  { slug: "ikeja",       name: "Ikeja",       type: "terminal", lat: null, lng: null, verified: true },
  { slug: "oshodi",      name: "Oshodi",      type: "terminal", lat: null, lng: null, verified: true },
  { slug: "abule-egba",  name: "Abule-Egba",  type: "terminal", lat: null, lng: null, verified: true },
  { slug: "obalende",    name: "Obalende",    type: "terminal", lat: null, lng: null, verified: false },
];

export const routes: Route[] = [
  { slug: "ikeja-ayobo",        service: "standard", from: "ikeja",       to: "ayobo",    via: ["iyana-ipaja"], fareNgn: 690,  headwayMin: [10, 15], verified: false },
  { slug: "ayobo-ikeja",        service: "standard", from: "ayobo",       to: "ikeja",    via: ["iyana-ipaja"], fareNgn: 690,  headwayMin: [10, 15], verified: false }, // reverse fare assumed
  { slug: "ikeja-iyana-ipaja",  service: "standard", from: "ikeja",       to: "iyana-ipaja", via: [],           fareNgn: 440,  headwayMin: [8, 12],  verified: false },
  { slug: "oshodi-ayobo",       service: "brt",      from: "oshodi",      to: "ayobo",    via: [],              fareNgn: 890,  headwayMin: [15, 25], verified: false },
  { slug: "iyana-ipaja-obalende", service: "standard", from: "iyana-ipaja", to: "obalende", via: [],            fareNgn: 1090, headwayMin: [10, 15], verified: false },
  { slug: "ikeja-obalende",     service: "standard", from: "ikeja",       to: "obalende", via: [],              fareNgn: 720,  headwayMin: [5, 8],   verified: false },
  { slug: "iyana-ipaja-ikeja",  service: "standard", from: "iyana-ipaja", to: "ikeja",    via: [],              fareNgn: 440,  headwayMin: [10, 15], verified: false },
  { slug: "ayobo-obalende",     service: "standard", from: "ayobo",       to: "obalende", via: [],              fareNgn: 1260, headwayMin: [15, 25], verified: false },
];

// Demo-only "buses waiting" snapshots. Clearly sample numbers, not live.
export const demoQueues: Record<string, { busesWaiting: number; minutesAgo: number }> = {
  "ikeja-ayobo": { busesWaiting: 2, minutesAgo: 8 },
  "ayobo-ikeja": { busesWaiting: 2, minutesAgo: 8 },
  "ikeja-iyana-ipaja": { busesWaiting: 1, minutesAgo: 4 },
  "ikeja-obalende": { busesWaiting: 3, minutesAgo: 6 },
  // routes missing here show "No recent update"
};

