"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNearbyPlaces, getAllPlaces, type Place } from "@/lib/brt-local";

type PlaceWithMeta = Place & {
  distanceKm: number | null;
  routeCount: number;
};

export default function NearbyPage() {
  const [placesList, setPlacesList] = useState<PlaceWithMeta[]>([]);
  const [locationStatus, setLocationStatus] = useState<
    "loading" | "granted" | "denied" | "unavailable"
  >("loading");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
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

        {/* Visual search input (slice 1 presentation) */}
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
          <input
            id="search-destination"
            type="text"
            readOnly
            placeholder="Where are you going?"
            className="w-full min-h-touch pl-11 pr-4 py-2.5 bg-slate-50 border border-cowry-border rounded-xl text-sm text-cowry-text placeholder-cowry-muted focus:outline-none focus:ring-2 focus:ring-cowry-primary focus:bg-white cursor-pointer transition-colors"
          />
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

        {/* Loading State */}
        {locationStatus === "loading" && placesList.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-7 h-7 border-3 border-cowry-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-cowry-muted">
              Locating closest BRT stops...
            </p>
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
        Unofficial prototype. Sample data. Times are estimates.
      </footer>
    </div>
  );
}

