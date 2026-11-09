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

  // Identify cheapest direct trip to mark it per acceptance criteria
  const directTrips = trips.filter((t) => t.legs.length === 1);
  const lowestDirectFare =
    directTrips.length > 0
      ? Math.min(...directTrips.map((t) => t.totalNgn))
      : null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Header */}
      <header className="px-5 pt-5 pb-4 border-b border-cowry-border">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-cowry-primary hover:underline min-h-touch min-w-touch"
            aria-label="Back to Nearby"
          >
            ← Back to Nearby
          </Link>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-cowry-pill text-cowry-primary border border-[#BCD0ED]"
            aria-label="Demo data mode"
          >
            Demo data
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-cowry-text">
          Plan a trip
        </h1>
        <p className="text-xs text-cowry-muted mt-1">
          Find direct routes and terminal transfers across Lagos BRT
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-5 py-5 space-y-5">
        {/* Origin & Destination Selectors */}
        <section
          className="p-4 bg-slate-50 border border-cowry-border rounded-2xl space-y-3"
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
                className="w-full min-h-touch px-3.5 py-2.5 bg-white border border-cowry-border rounded-xl text-sm font-medium text-cowry-text focus:outline-none focus:ring-2 focus:ring-cowry-primary appearance-none cursor-pointer"
              >
                <option value="">Select starting stop or terminal</option>
                {allPlaces.map((p) => (
                  <option key={`from-${p.slug}`} value={p.slug}>
                    {p.name} ({p.type === "terminal" ? "Terminal" : "Stop"})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-cowry-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Swap Button Row */}
          <div className="flex justify-center -my-1">
            <button
              type="button"
              onClick={handleSwap}
              disabled={!fromSlug && !toSlug}
              aria-label="Swap starting place and destination"
              className="min-h-touch min-w-touch px-3 py-1.5 inline-flex items-center gap-1.5 bg-white border border-cowry-border hover:border-cowry-primary hover:text-cowry-primary rounded-full text-xs font-medium text-cowry-muted shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="w-full min-h-touch px-3.5 py-2.5 bg-white border border-cowry-border rounded-xl text-sm font-medium text-cowry-text focus:outline-none focus:ring-2 focus:ring-cowry-primary appearance-none cursor-pointer"
              >
                <option value="">Select destination</option>
                {allPlaces.map((p) => (
                  <option key={`to-${p.slug}`} value={p.slug}>
                    {p.name} ({p.type === "terminal" ? "Terminal" : "Stop"})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-cowry-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section aria-label="Trip planning results">
          {/* State 1: Nothing selected yet */}
          {!fromSlug || !toSlug ? (
            <div className="py-12 px-4 text-center border border-dashed border-cowry-border rounded-2xl">
              <p className="text-sm font-medium text-cowry-text">
                Choose a starting point and destination above
              </p>
              <p className="text-xs text-cowry-muted mt-1">
                Select your origin and where you are headed to view bus options and flat fares.
              </p>
            </div>
          ) : isSamePlace ? (
            /* State 2: from equals to */
            <div className="py-8 px-4 text-center bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-sm font-semibold text-amber-900">
                Choose two different places
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Your origin and destination cannot be the same stop.
              </p>
            </div>
          ) : trips.length === 0 ? (
            /* State 3: No route found */
            <div className="py-10 px-4 text-center border border-dashed border-cowry-border rounded-2xl">
              <p className="text-sm font-semibold text-cowry-text">
                No route found in this demo
              </p>
              <p className="text-xs text-cowry-muted mt-1.5 max-w-xs mx-auto">
                No direct route or single terminal transfer connects these stops in our demo dataset. More routes will be added as the network expands.
              </p>
            </div>
          ) : (
            /* State 4: Matching Trip Cards */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-cowry-text">
                  Suggested routes ({trips.length})
                </h2>
                <span className="text-xs text-cowry-muted">
                  Sorted by fewest buses
                </span>
              </div>

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
                    className={`block p-5 bg-white rounded-2xl transition-all hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary ${
                      isDirect
                        ? "border-2 border-cowry-primary shadow-sm"
                        : "border border-cowry-border"
                    }`}
                  >
                    {/* Header Row: Badge & Total Fare */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isDirect
                              ? "bg-cowry-pill text-cowry-primary"
                              : "bg-slate-100 text-cowry-text"
                          }`}
                        >
                          {isDirect ? "Direct · 1 bus" : "1 change · 2 buses"}
                        </span>
                        {isCheapestDirect && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            Cheapest direct
                          </span>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs text-cowry-muted block">
                          Total fare
                        </span>
                        <span className="text-2xl font-black text-cowry-primary">
                          ₦{trip.totalNgn.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Progression */}
                    <div className="space-y-2 py-2 border-t border-b border-slate-100 text-sm">
                      {isDirect ? (
                        <>
                          <div className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-cowry-primary mt-1.5 flex-shrink-0" />
                            <p className="text-cowry-text">
                              Board at{" "}
                              <strong className="font-semibold text-cowry-text">
                                {originName}
                              </strong>
                              , bus to{" "}
                              <strong className="font-semibold text-cowry-text">
                                {routeDestName}
                              </strong>
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-cowry-text mt-1.5 flex-shrink-0" />
                            <div>
                              <p className="text-cowry-text">
                                Get down at{" "}
                                <strong className="font-semibold text-cowry-text">
                                  {destinationName}
                                </strong>
                                {firstLeg.to !== toSlug && (
                                  <span className="text-cowry-muted">
                                    {" "}
                                    (Bus continues to {routeDestName})
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-cowry-muted mt-0.5">
                                Same fare wherever you get down
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* 1 Change Steps */}
                          <div className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-cowry-primary mt-1.5 flex-shrink-0" />
                            <p className="text-cowry-text">
                              <span className="font-medium">
                                {originName} to {trip.changeAt}
                              </span>
                              :{" "}
                              <span className="font-semibold text-cowry-primary">
                                ₦{firstLeg.fareNgn}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg">
                            <span className="w-2 h-2 rounded-full border-2 border-cowry-primary bg-white mt-1.5 flex-shrink-0" />
                            <p className="text-xs font-semibold text-cowry-text">
                              Change at {trip.changeAt} terminal
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-cowry-text mt-1.5 flex-shrink-0" />
                            <p className="text-cowry-text">
                              <span className="font-medium">
                                {trip.changeAt} to {destinationName}
                              </span>
                              :{" "}
                              <span className="font-semibold text-cowry-primary">
                                ₦{trip.legs[1].fareNgn}
                              </span>
                            </p>
                          </div>

                          <p className="text-[11px] text-cowry-muted pt-1">
                            Total is the sum of each bus fare. Check at the stop for any transfer discount.
                          </p>
                        </>
                      )}
                    </div>

                    {/* Wait Estimate Pill & Route link footer */}
                    <div className="flex items-center justify-between pt-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cowry-pill text-[#0B3A7A]">
                        Est. wait {minWait} to {maxWait} min (estimate)
                      </span>
                      <span className="text-xs font-medium text-cowry-primary flex items-center gap-1">
                        View route details →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
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

export default function TripPlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white p-6 flex items-center justify-center">
          <div className="w-7 h-7 border-3 border-cowry-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TripPlannerContent />
    </Suspense>
  );
}
