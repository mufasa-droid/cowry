"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getAllPlaces,
  getPlace,
  planTrip,
  type Trip,
} from "@/lib/brt-local";

function TripPlannerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const allPlaces = getAllPlaces();

  const initialFrom = searchParams.get("from") || "";
  const initialTo = searchParams.get("to") || "";

  const [fromSlug, setFromSlug] = useState(initialFrom);
  const [toSlug, setToSlug] = useState(initialTo);

  // Sync state if URL query changes
  useEffect(() => {
    document.title = "Plan a trip | BRT Lagos Demo";
    const qFrom = searchParams.get("from") || "";
    const qTo = searchParams.get("to") || "";
    setFromSlug((prev) => (prev !== qFrom ? qFrom : prev));
    setToSlug((prev) => (prev !== qTo ? qTo : prev));
  }, [searchParams]);

  const updateSelection = (newFrom: string, newTo: string) => {
    setFromSlug(newFrom);
    setToSlug(newTo);
    const params = new URLSearchParams();
    if (newFrom) params.set("from", newFrom);
    if (newTo) params.set("to", newTo);
    const qs = params.toString();
    router.replace(`/plan${qs ? `?${qs}` : ""}`);
  };

  const handleSwap = () => {
    updateSelection(toSlug, fromSlug);
  };

  const fromPlace = fromSlug ? getPlace(fromSlug) : undefined;
  const toPlace = toSlug ? getPlace(toSlug) : undefined;

  const isSamePlace = fromSlug && toSlug && fromSlug === toSlug;
  const hasBothPlaces = fromSlug && toSlug && !isSamePlace;

  const trips: Trip[] = hasBothPlaces ? planTrip(fromSlug, toSlug) : [];

  const directTrips = trips.filter((t) => t.legs.length === 1);
  const lowestDirectFare =
    directTrips.length > 0
      ? Math.min(...directTrips.map((t) => t.totalNgn))
      : null;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-10">
      {/* Left Column (Sticky on Desktop): From/To Form */}
      <div className="w-full lg:w-[380px] lg:flex-shrink-0 space-y-4 lg:self-start lg:sticky lg:top-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-cowry-ink">
            Plan a trip
          </h1>
          <p className="text-sm text-cowry-muted mt-1 leading-snug">
            Find direct routes and terminal transfers across Lagos BRT
          </p>
        </div>

        {/* Origin & Destination Form */}
        <section
          className="p-4 border border-cowry-hairline rounded-sm bg-white space-y-3"
          aria-label="Trip origin and destination"
        >
          {/* From Select */}
          <div>
            <label
              htmlFor="select-from"
              className="block text-xs font-semibold text-cowry-muted uppercase tracking-wider mb-1"
            >
              From (Origin)
            </label>
            <div className="relative">
              <select
                id="select-from"
                value={fromSlug}
                onChange={(e) => updateSelection(e.target.value, toSlug)}
                className="w-full min-h-touch px-3 py-2 bg-white border border-cowry-hairline rounded-sm text-sm text-cowry-ink focus:outline-none focus:ring-2 focus:ring-cowry-primary appearance-none cursor-pointer"
              >
                <option value="">Select starting stop or terminal</option>
                {allPlaces.map((p) => (
                  <option key={`from-${p.slug}`} value={p.slug}>
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
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-1">
            <button
              type="button"
              onClick={handleSwap}
              disabled={!fromSlug && !toSlug}
              aria-label="Swap starting place and destination"
              className="min-h-touch min-w-touch px-3 py-1.5 inline-flex items-center gap-1.5 bg-white border border-cowry-hairline hover:border-cowry-primary hover:text-cowry-primary rounded-sm text-xs font-medium text-cowry-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span>Swap</span>
            </button>
          </div>

          {/* To Select */}
          <div>
            <label
              htmlFor="select-to"
              className="block text-xs font-semibold text-cowry-muted uppercase tracking-wider mb-1"
            >
              To (Destination)
            </label>
            <div className="relative">
              <select
                id="select-to"
                value={toSlug}
                onChange={(e) => updateSelection(fromSlug, e.target.value)}
                className="w-full min-h-touch px-3 py-2 bg-white border border-cowry-hairline rounded-sm text-sm text-cowry-ink focus:outline-none focus:ring-2 focus:ring-cowry-primary appearance-none cursor-pointer"
              >
                <option value="">Select destination</option>
                {allPlaces.map((p) => (
                  <option key={`to-${p.slug}`} value={p.slug}>
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
          </div>
        </section>
      </div>

      {/* Right Column: Timetable-Style Results */}
      <div className="flex-1 lg:border-l lg:border-cowry-hairline lg:pl-10 space-y-4">
        {/* State 1: Nothing selected yet */}
        {!fromSlug || !toSlug ? (
          <div className="py-12 px-6 text-center border border-dashed border-cowry-hairline rounded-sm">
            <p className="font-serif text-lg font-bold text-cowry-ink">
              Choose an origin and destination
            </p>
            <p className="text-xs text-cowry-muted mt-1 max-w-sm mx-auto">
              Select where you are boarding and where you are headed to see available bus routes, flat fares, and transfer options.
            </p>
          </div>
        ) : isSamePlace ? (
          /* State 2: from equals to */
          <div className="py-8 px-6 text-center border border-cowry-hairline bg-white rounded-sm">
            <p className="text-sm font-semibold text-cowry-ink">
              Choose two different places
            </p>
            <p className="text-xs text-cowry-muted mt-1">
              Your origin and destination cannot be the same stop.
            </p>
          </div>
        ) : trips.length === 0 ? (
          /* State 3: No route found */
          <div className="py-10 px-6 text-center border border-dashed border-cowry-hairline rounded-sm">
            <p className="font-serif text-lg font-bold text-cowry-ink">
              No route found in this demo
            </p>
            <p className="text-xs text-cowry-muted mt-1.5 max-w-sm mx-auto">
              No direct route or single terminal transfer connects these stops in our demo dataset. More routes will be added as network coverage expands.
            </p>
          </div>
        ) : (
          /* State 4: Matching Trip Entries Separated by Hairlines */
          <div className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-cowry-hairline pb-2.5">
              <h2 className="font-serif text-base font-bold text-cowry-ink">
                Suggested routes ({trips.length})
              </h2>
              <span className="text-xs text-cowry-muted">
                Sorted by fewest buses
              </span>
            </div>

            <div className="divide-y divide-cowry-hairline border-t border-b border-cowry-hairline">
              {trips.map((trip, idx) => {
                const isDirect = trip.legs.length === 1;
                const firstLeg = trip.legs[0];
                const [minWait, maxWait] = firstLeg.headwayMin;

                const originName =
                  fromPlace?.name || getPlace(firstLeg.from)?.name || firstLeg.from;
                const destinationName =
                  toPlace?.name || getPlace(toSlug)?.name || toSlug;
                const routeDestName =
                  getPlace(firstLeg.to)?.name || firstLeg.to;

                const isCheapestDirect =
                  isDirect &&
                  lowestDirectFare !== null &&
                  trip.totalNgn === lowestDirectFare;

                return (
                  <Link
                    key={`trip-${idx}-${firstLeg.slug}`}
                    href={`/route/${firstLeg.slug}`}
                    className="group block py-4 px-2 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary rounded-sm"
                  >
                    {/* Header Row: Badge & Total Fare */}
                    <div className="flex items-baseline justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-cowry-ink border border-cowry-hairline px-2 py-0.5 rounded-sm">
                          {isDirect ? "Direct · 1 bus" : "1 change · 2 buses"}
                        </span>
                        {isCheapestDirect && (
                          <span className="text-[11px] font-bold text-cowry-primary">
                            Cheapest direct
                          </span>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-2xl font-bold text-cowry-primary tabular-nums">
                          ₦{trip.totalNgn.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Progression */}
                    <div className="space-y-1.5 py-1 text-sm">
                      {isDirect ? (
                        <>
                          <p className="text-cowry-ink">
                            Board at <strong className="font-semibold">{originName}</strong>, bus to{" "}
                            <strong className="font-semibold">{routeDestName}</strong>
                          </p>
                          <p className="text-cowry-ink">
                            Get down at <strong className="font-semibold">{destinationName}</strong>
                            {firstLeg.to !== toSlug && (
                              <span className="text-cowry-muted"> (Bus continues to {routeDestName})</span>
                            )}
                          </p>
                          <p className="text-xs text-cowry-muted">
                            Same fare wherever you get down
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-cowry-ink">
                            {originName} to {trip.changeAt}:{" "}
                            <span className="font-bold text-cowry-primary tabular-nums">₦{firstLeg.fareNgn}</span>
                          </p>
                          <p className="text-xs font-semibold text-cowry-ink">
                            Change at {trip.changeAt} terminal
                          </p>
                          <p className="text-cowry-ink">
                            {trip.changeAt} to {destinationName}:{" "}
                            <span className="font-bold text-cowry-primary tabular-nums">₦{trip.legs[1].fareNgn}</span>
                          </p>
                          <p className="text-xs text-cowry-muted pt-1">
                            Total is the sum of each bus fare. Check at the stop for any transfer discount.
                          </p>
                        </>
                      )}
                    </div>

                    {/* Estimated wait footer */}
                    <div className="flex items-center justify-between text-xs text-cowry-muted pt-2 mt-1">
                      <span>Est. wait {minWait} to {maxWait} min (estimate)</span>
                      <span className="text-cowry-primary group-hover:underline font-medium">
                        Route details →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TripPlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-12 flex items-center justify-center">
          <p className="text-sm text-cowry-muted">Loading trip planner...</p>
        </div>
      }
    >
      <TripPlannerContent />
    </Suspense>
  );
}
