// lib/brt-local.ts: frontend-only data layer for the demo.
// Keep the screens importing from here. Later, swap this file for the Supabase version
// (same function names) and the screens won't need to change.
import { places, routes, demoQueues, type Place, type Route } from "@/data/brt-data";

export type { Place, Route };

const place = (slug: string) => places.find((p) => p.slug === slug)!;

// ---------- nearest places ----------
function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371, rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(bLat - aLat), dLng = rad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function getNearbyPlaces(lat: number, lng: number, max = 5) {
  return places
    .filter((p) => p.lat !== null && p.lng !== null)
    .map((p) => ({ ...p, distanceKm: distanceKm(lat, lng, p.lat!, p.lng!), routeCount: routesFrom(p.slug).length }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, max);
}

// Fallback when coordinates are null or location is unavailable
export function getAllPlaces() {
  return places.map((p) => ({
    ...p,
    distanceKm: null as number | null,
    routeCount: routesFrom(p.slug).length,
  }));
}

export function getPlace(slug: string): Place | undefined {
  return places.find((p) => p.slug === slug);
}

export function getRoute(slug: string): Route | undefined {
  return routes.find((r) => r.slug === slug);
}

// ---------- departures from a place ----------
export const routesFrom = (slug: string) => routes.filter((r) => r.from === slug);

export function getDepartures(slug: string) {
  return routesFrom(slug).map((r) => {
    const q = demoQueues[r.slug];
    const fresh = !!q && q.minutesAgo <= 30;
    return {
      route: r,
      headingTo: place(r.to).name,
      busesWaiting: fresh ? q.busesWaiting : null,
      updatedMinAgo: fresh ? q.minutesAgo : null,
      estWaitMin: r.headwayMin, // [low, high], shown as "estimate"
    };
  });
}

export function queueLabel(busesWaiting: number | null, minAgo: number | null) {
  if (busesWaiting === null) return "No recent update";
  const n = busesWaiting === 1 ? "1 bus waiting" : `${busesWaiting} buses waiting`;
  if (minAgo === 0) return `${n} · updated just now`;
  return `${n} · updated ${minAgo} min ago`;
}

// ---------- report "buses waiting" (demo: kept in memory only) ----------
export function reportQueue(routeSlug: string, busesWaiting: number) {
  demoQueues[routeSlug] = { busesWaiting, minutesAgo: 0 };
}

// ---------- trip planner ----------
export type Trip = { legs: Route[]; totalNgn: number; changeAt?: string };

// You can get down at any stop on the way, and still pay the route's full fare.
const reaches = (r: Route, slug: string) => r.to === slug || r.via.includes(slug);

export function planTrip(fromSlug: string, toSlug: string): Trip[] {
  const trips: Trip[] = [];

  // direct
  for (const r of routes) {
    if (r.from === fromSlug && reaches(r, toSlug)) trips.push({ legs: [r], totalNgn: r.fareNgn });
  }

  // one change, only at a terminal
  for (const a of routes.filter((r) => r.from === fromSlug)) {
    for (const hubSlug of [...a.via, a.to]) {
      if (hubSlug === toSlug || place(hubSlug).type !== "terminal") continue;
      for (const b of routes.filter((r) => r.from === hubSlug && reaches(r, toSlug))) {
        trips.push({ legs: [a, b], totalNgn: a.fareNgn + b.fareNgn, changeAt: place(hubSlug).name });
      }
    }
  }

  return trips.sort((x, y) => x.legs.length - y.legs.length || x.totalNgn - y.totalNgn);
}

