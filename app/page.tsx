"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getNearbyPlaces, getAllPlaces, type Place } from "@/lib/brt-local";

type PlaceWithMeta = Place & {
  distanceKm: number | null;
  routeCount: number;
};

export default function NearbyPage() {
  const router = useRouter();
  const [placesList, setPlacesList] = useState<PlaceWithMeta[]>([]);
  const [locationStatus, setLocationStatus] = useState<
    "loading" | "granted" | "denied" | "unavailable"
  >("loading");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    document.title = "Nearby | BRT Lagos Demo";

    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationStatus("unavailable");
      setPlacesList(getAllPlaces());
      setUsingFallback(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus("granted");
        const nearby = getNearbyPlaces(
          position.coords.latitude,
          position.coords.longitude
        );

        // Coordinates in demo data are currently null, so getNearbyPlaces returns []
        if (nearby && nearby.length > 0) {
          setPlacesList(nearby);
          setUsingFallback(false);
        } else {
          setPlacesList(getAllPlaces());
          setUsingFallback(true);
        }
      },
      () => {
        setLocationStatus("denied");
        setPlacesList(getAllPlaces());
        setUsingFallback(true);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Bar with Demo Data Label */}
      <header className="px-5 pt-6 pb-4 border-b border-cowry-border">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-cowry-text">
              Nearby
            </h1>
            <p className="text-sm text-cowry-muted mt-0.5">
              Closest BRT stops to you
            </p>
          </div>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-cowry-pill text-cowry-primary border border-[#BCD0ED]"
            aria-label="Demo data mode"
          >
            Demo data
          </span>
        </div>

        {/* Destination picker navigating to /plan?to=<slug> */}
        <div className="relative mt-2">
          <label htmlFor="search-destination" className="sr-only">
            Where are you going?
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cowry-muted">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m1.85-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            id="search-destination"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                router.push(`/plan?to=${e.target.value}`);
              }
            }}
            className="w-full min-h-touch pl-11 pr-10 py-2.5 bg-slate-50 border border-cowry-border rounded-xl text-sm text-cowry-text focus:outline-none focus:ring-2 focus:ring-cowry-primary focus:bg-white cursor-pointer transition-colors appearance-none"
          >
            <option value="" disabled>
              Where are you going?
            </option>
            {getAllPlaces().map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name} ({p.type === "terminal" ? "Terminal" : "Stop"})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-cowry-muted">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-5 py-5">
        {/* Section Title */}
        <div className="mb-4">
          <h2 className="text-base font-semibold text-cowry-text">
            {usingFallback ? "Choose where you are" : "Nearby stops & terminals"}
          </h2>
          {usingFallback && (
            <p className="text-xs text-cowry-muted mt-0.5">
              {locationStatus === "granted"
                ? "Coordinates unavailable in demo data. Select a location:"
                : locationStatus === "denied"
                ? "Location access denied. Select your location below:"
                : "Select your location below:"}
            </p>
          )}
        </div>

        {/* Loading State Skeleton */}
        {locationStatus === "loading" && placesList.length === 0 ? (
          <div className="space-y-3" aria-label="Loading nearby stops">
            {[1, 2, 3].map((n) => (
              <div
                key={`skeleton-${n}`}
                className="p-4 bg-slate-50 border border-cowry-border rounded-xl animate-pulse"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="h-5 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-16" />
                </div>
                <div className="h-3 bg-slate-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          /* Places List */
          <div className="space-y-3">
            {placesList.map((place) => {
              const routeLabel =
                place.routeCount === 1 ? "1 route" : `${place.routeCount} routes`;
              const isTerminal = place.type === "terminal";

              return (
                <Link
                  key={place.slug}
                  href={`/place/${place.slug}`}
                  className="block min-h-touch p-4 bg-white border border-cowry-border rounded-xl hover:border-cowry-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-semibold text-base text-cowry-text truncate">
                          {place.name}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider ${
                            isTerminal
                              ? "bg-cowry-pill text-cowry-primary"
                              : "bg-slate-100 text-cowry-muted"
                          }`}
                        >
                          {isTerminal ? "Terminal" : "Bus stop"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-cowry-muted">
                        <span>{routeLabel}</span>
                        {place.distanceKm !== null && place.distanceKm !== undefined && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>
                              {place.distanceKm < 1
                                ? `${Math.round(place.distanceKm * 1000)} m`
                                : `${place.distanceKm.toFixed(1)} km`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-cowry-muted flex-shrink-0" aria-hidden="true">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer Strip */}
      <footer className="mt-auto px-4 py-3.5 bg-cowry-footer border-t border-cowry-border text-center text-xs text-cowry-muted">
        Unofficial prototype. Sample data. Times are estimates. ·{" "}
        <Link href="/about" className="underline hover:text-cowry-primary">
          About this demo
        </Link>
      </footer>
    </div>
  );
}

