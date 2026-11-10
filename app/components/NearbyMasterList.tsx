"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getNearbyPlaces, getAllPlaces, type Place } from "@/lib/brt-local";

type PlaceWithMeta = Place & {
  distanceKm: number | null;
  routeCount: number;
};

interface NearbyMasterListProps {
  selectedSlug?: string;
  onSelectPlace?: (slug: string) => void;
}

export default function NearbyMasterList({
  selectedSlug,
  onSelectPlace,
}: NearbyMasterListProps) {
  const router = useRouter();
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
    <div className="w-full space-y-4">
      {/* Title & Subtitle */}
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-cowry-ink">
          Nearby
        </h1>
        <p className="text-sm text-cowry-muted mt-0.5">
          Closest BRT stops to you
        </p>
      </div>

      {/* Destination Picker */}
      <div className="relative">
        <label htmlFor="search-destination" className="sr-only">
          Where are you going?
        </label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cowry-muted">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
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
          className="w-full min-h-touch pl-9 pr-9 py-2 bg-white border border-cowry-hairline rounded-sm text-sm text-cowry-ink focus:outline-none focus:ring-2 focus:ring-cowry-primary cursor-pointer appearance-none transition-colors"
        >
          <option value="" disabled>
            Where are you going?
          </option>
          {getAllPlaces().map((p) => (
            <option key={`dest-${p.slug}`} value={p.slug}>
              {p.name} ({p.type === "terminal" ? "Terminal" : "Stop"})
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-cowry-muted">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Section Header */}
      <div className="pt-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-cowry-muted">
          {usingFallback ? "Choose where you are" : "Nearby stops"}
        </h2>
        {usingFallback && (
          <p className="text-xs text-cowry-muted mt-0.5">
            {locationStatus === "granted"
              ? "Coordinates unavailable in demo data. Select a location:"
              : locationStatus === "denied"
              ? "Location access denied. Select a location:"
              : "Select a location:"}
          </p>
        )}
      </div>

      {/* Loading Skeleton */}
      {locationStatus === "loading" && placesList.length === 0 ? (
        <div className="divide-y divide-cowry-hairline border-t border-b border-cowry-hairline" aria-label="Loading nearby stops">
          {[1, 2, 3, 4].map((n) => (
            <div key={`skel-${n}`} className="py-3.5 px-2 animate-pulse flex items-center justify-between">
              <div className="space-y-1.5 w-2/3">
                <div className="h-4 bg-slate-200 rounded-sm w-3/4" />
                <div className="h-3 bg-slate-100 rounded-sm w-1/2" />
              </div>
              <div className="h-4 bg-slate-200 rounded-sm w-12" />
            </div>
          ))}
        </div>
      ) : (
        /* Places List with 1px Hairlines */
        <nav aria-label="Stops and Terminals List">
          <ul className="divide-y divide-cowry-hairline border-t border-b border-cowry-hairline">
            {placesList.map((place) => {
              const routeLabel =
                place.routeCount === 1 ? "1 route" : `${place.routeCount} routes`;
              const isTerminal = place.type === "terminal";
              const isSelected = selectedSlug === place.slug;

              return (
                <li key={place.slug}>
                  <Link
                    href={`/place/${place.slug}`}
                    onClick={() => onSelectPlace?.(place.slug)}
                    className={`group flex items-center justify-between py-3.5 px-2 transition-colors min-h-touch rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary ${
                      isSelected
                        ? "bg-slate-50 border-l-2 border-cowry-primary pl-2.5 font-medium"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-cowry-ink group-hover:text-cowry-primary transition-colors">
                          {place.name}
                        </span>
                        <span className="text-[11px] text-cowry-muted border border-cowry-hairline px-1.5 py-0.5 rounded-sm">
                          {isTerminal ? "Terminal" : "Stop"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-cowry-muted mt-1">
                        <span>{routeLabel}</span>
                        {place.distanceKm !== null && place.distanceKm !== undefined && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">
                              {place.distanceKm < 1
                                ? `${Math.round(place.distanceKm * 1000)} m`
                                : `${place.distanceKm.toFixed(1)} km`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-cowry-muted group-hover:text-cowry-primary transition-colors text-sm" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}

