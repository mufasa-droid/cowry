"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getPlace,
  getDepartures,
  queueLabel,
  reportQueue,
} from "@/lib/brt-local";
import NearbyMasterList from "@/app/components/NearbyMasterList";

interface PlaceBoardProps {
  slug: string;
}

export default function PlaceBoard({ slug }: PlaceBoardProps) {
  const place = getPlace(slug);

  // Departures state (updates immediately when user sends report)
  const [departures, setDepartures] = useState(() =>
    place ? getDepartures(place.slug) : []
  );

  // Inline reporting panel state
  const [isReporting, setIsReporting] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [confirmationMsg, setConfirmationMsg] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const reportButtonRef = useRef<HTMLButtonElement>(null);

  // Keep departures updated if slug changes
  useEffect(() => {
    if (place) {
      const deps = getDepartures(place.slug);
      setDepartures(deps);
      setSelectedRoute(deps.length === 1 ? deps[0].route.slug : "");
    }
  }, [place, slug]);

  // Handle escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isReporting) {
        setIsReporting(false);
        reportButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReporting]);

  if (!place) {
    return (
      <div className="w-full py-12 flex flex-col justify-center items-center text-center">
        <h1 className="font-serif text-2xl font-bold text-cowry-ink mb-2">
          Place not found
        </h1>
        <p className="text-sm text-cowry-muted mb-6 max-w-xs">
          We couldn&apos;t find the requested stop or terminal in our system.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-touch px-6 py-2.5 bg-cowry-primary text-white rounded-sm text-sm font-semibold hover:bg-cowry-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-colors"
        >
          Return to Nearby
        </Link>
      </div>
    );
  }

  const isTerminal = place.type === "terminal";
  const routeCount = departures.length;
  const isSingleRouteStop = !isTerminal && routeCount === 1;

  // Subtitle wording per business rules
  let subtitleText = "";
  if (routeCount === 0) {
    subtitleText = `${isTerminal ? "Terminal" : "Bus stop"} · No routes currently listed in demo`;
  } else if (isTerminal) {
    const routeSuffix = routeCount === 1 ? "route" : "routes";
    subtitleText = `Terminal · ${routeCount} ${routeSuffix} · buses leaving from here`;
  } else {
    const destination = departures[0]?.headingTo || "destination";
    subtitleText = `Bus stop · 1 route · buses wait here, then leave for ${destination}`;
  }

  const openReportPanel = () => {
    setIsReporting(true);
    setConfirmationMsg("");
    if (departures.length === 1) {
      setSelectedRoute(departures[0].route.slug);
    } else if (!selectedRoute && departures.length > 0) {
      setSelectedRoute(departures[0].route.slug);
    }
  };

  const handleSendReport = () => {
    if (selectedCount === null || !selectedRoute) return;

    const countValue = Math.min(selectedCount, 5);
    reportQueue(selectedRoute, countValue);

    const updated = getDepartures(place.slug);
    setDepartures(updated);

    setIsReporting(false);
    setSelectedCount(null);
    setConfirmationMsg("Thanks. Report saved for this demo.");
    reportButtonRef.current?.focus();
  };

  const handleCancelReport = () => {
    setIsReporting(false);
    setSelectedCount(null);
    reportButtonRef.current?.focus();
  };

  const countOptions = [0, 1, 2, 3, 4, 5];

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-10">
      {/* Left Column on Desktop (Master List) */}
      <div className="hidden lg:block lg:w-[380px] lg:flex-shrink-0">
        <NearbyMasterList selectedSlug={place.slug} />
      </div>

      {/* Right Column: Place Departure Board */}
      <div className="flex-1 lg:border-l lg:border-cowry-hairline lg:pl-10 space-y-6">
        {/* Mobile Back Button (hidden on desktop master-detail) */}
        <div className="lg:hidden -mt-1 mb-2">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-cowry-primary hover:underline min-h-touch min-w-touch"
            aria-label="Back to Nearby stops"
          >
            ← Back to Nearby
          </Link>
        </div>

        {/* Place Header */}
        <div className="border-b border-cowry-hairline pb-4">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-cowry-ink">
              {place.name}
            </h1>
            <span className="text-xs text-cowry-muted border border-cowry-hairline px-1.5 py-0.5 rounded-sm">
              {isTerminal ? "Terminal" : "Bus stop"}
            </span>
          </div>
          <p className="text-sm text-cowry-muted mt-1 leading-snug">
            {subtitleText}
          </p>
        </div>

        {/* Polite Screen Reader Live Announcement */}
        <div
          role="status"
          aria-live="polite"
          className="text-xs font-semibold text-cowry-ink bg-slate-50 border border-cowry-hairline rounded-sm p-3 transition-all empty:hidden"
        >
          {confirmationMsg}
        </div>

        {/* Empty State */}
        {departures.length === 0 ? (
          <div className="py-10 px-6 text-center border border-dashed border-cowry-hairline rounded-sm">
            <p className="text-sm font-medium text-cowry-ink mb-4">
              No routes leave from here in this demo
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-touch px-5 py-2.5 bg-cowry-primary text-white rounded-sm text-sm font-semibold hover:bg-cowry-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-colors"
            >
              Back to Nearby
            </Link>
          </div>
        ) : isSingleRouteStop ? (
          /* Single Route Stop: Clean stacked timetable format */
          <div className="space-y-4">
            {departures.map((dep) => {
              const queueText = queueLabel(
                dep.busesWaiting,
                dep.updatedMinAgo
              );
              const [minWait, maxWait] = dep.estWaitMin;

              return (
                <Link
                  key={dep.route.slug}
                  href={`/route/${dep.route.slug}`}
                  className="group block p-4 border border-cowry-hairline rounded-sm hover:border-cowry-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-colors min-h-touch"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-[11px] font-semibold text-cowry-muted uppercase tracking-wider block mb-0.5">
                        Route
                      </span>
                      <h2 className="font-serif text-lg font-bold text-cowry-ink group-hover:text-cowry-primary transition-colors">
                        To {dep.headingTo}
                      </h2>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[11px] font-semibold text-cowry-muted uppercase tracking-wider block mb-0.5">
                        Flat fare
                      </span>
                      <span className="text-2xl font-bold text-cowry-primary tabular-nums">
                        ₦{dep.route.fareNgn}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cowry-hairline flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-cowry-muted">
                    <div className="flex items-center gap-1.5 font-medium text-cowry-ink">
                      <span>{queueText}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-cowry-muted">
                        Est. wait {minWait} to {maxWait} min (estimate)
                      </span>
                      <span className="text-cowry-primary font-medium group-hover:underline">
                        Details →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Multi-route Terminal: Timetable Table on md+, Stacked on mobile */
          <div className="space-y-2">
            {/* Desktop / Tablet Timetable Table (md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-cowry-hairline text-xs font-semibold text-cowry-muted uppercase tracking-wider">
                    <th scope="col" className="py-2.5 px-3">Destination</th>
                    <th scope="col" className="py-2.5 px-3 text-right">Flat Fare</th>
                    <th scope="col" className="py-2.5 px-3">Buses Waiting</th>
                    <th scope="col" className="py-2.5 px-3">Estimated Wait</th>
                    <th scope="col" className="py-2.5 px-2 text-right"><span className="sr-only">Details</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cowry-hairline border-b border-cowry-hairline text-sm">
                  {departures.map((dep) => {
                    const queueText = queueLabel(
                      dep.busesWaiting,
                      dep.updatedMinAgo
                    );
                    const [minWait, maxWait] = dep.estWaitMin;

                    return (
                      <tr
                        key={dep.route.slug}
                        className="group hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => {
                          window.location.href = `/route/${dep.route.slug}`;
                        }}
                      >
                        <td className="py-3 px-3 font-semibold text-cowry-ink group-hover:text-cowry-primary transition-colors">
                          <Link href={`/route/${dep.route.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary rounded-sm">
                            To {dep.headingTo}
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-cowry-primary tabular-nums">
                          ₦{dep.route.fareNgn}
                        </td>
                        <td className="py-3 px-3 text-xs text-cowry-ink font-medium">
                          {queueText}
                        </td>
                        <td className="py-3 px-3 text-xs text-cowry-muted">
                          {minWait}–{maxWait} min (estimate)
                        </td>
                        <td className="py-3 px-2 text-right text-xs text-cowry-muted group-hover:text-cowry-primary transition-colors" aria-hidden="true">
                          →
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Rows (< md) */}
            <div className="md:hidden divide-y divide-cowry-hairline border-t border-b border-cowry-hairline">
              {departures.map((dep) => {
                const queueText = queueLabel(
                  dep.busesWaiting,
                  dep.updatedMinAgo
                );
                const [minWait, maxWait] = dep.estWaitMin;

                return (
                  <Link
                    key={dep.route.slug}
                    href={`/route/${dep.route.slug}`}
                    className="block py-3 px-1 min-h-touch hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary"
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm text-cowry-ink">
                        To {dep.headingTo}
                      </span>
                      <span className="font-bold text-sm text-cowry-primary tabular-nums">
                        ₦{dep.route.fareNgn}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-cowry-muted mt-0.5">
                      <span className="text-cowry-ink font-medium">{queueText}</span>
                      <span>{minWait}–{maxWait} min (estimate)</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Business Rule Notice */}
        <p className="text-xs text-cowry-muted">
          Fare is the same wherever you get down.
        </p>

        {/* Report Buses Waiting Section */}
        {departures.length > 0 && (
          <div className="pt-2">
            {!isReporting ? (
              <div className="space-y-2">
                <button
                  type="button"
                  ref={reportButtonRef}
                  onClick={openReportPanel}
                  className="w-full sm:w-auto min-h-touch px-5 py-2.5 bg-cowry-primary text-white rounded-sm text-sm font-semibold hover:bg-cowry-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-colors"
                >
                  I&apos;m here: report buses waiting
                </button>
                <p className="text-xs text-cowry-muted">
                  Demo: reports stay on this device and reset when you refresh the page.
                </p>
              </div>
            ) : (
              /* Inline Report Panel */
              <div
                ref={panelRef}
                className="p-4 sm:p-5 border border-cowry-hairline rounded-sm bg-white space-y-4"
                role="region"
                aria-label="Report buses waiting"
              >
                <div className="flex items-center justify-between border-b border-cowry-hairline pb-2.5">
                  <h3 className="font-serif text-base font-bold text-cowry-ink">
                    Report buses waiting
                  </h3>
                  <button
                    type="button"
                    onClick={handleCancelReport}
                    className="text-xs text-cowry-muted hover:text-cowry-ink p-1 min-h-[32px] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary"
                    aria-label="Close report panel"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Which bus selector */}
                {departures.length > 1 ? (
                  <div>
                    <label
                      htmlFor="select-report-route"
                      className="block text-xs font-semibold text-cowry-muted uppercase tracking-wider mb-1"
                    >
                      Which bus?
                    </label>
                    <select
                      id="select-report-route"
                      value={selectedRoute}
                      onChange={(e) => setSelectedRoute(e.target.value)}
                      className="w-full min-h-touch px-3 py-2 bg-white border border-cowry-hairline rounded-sm text-sm text-cowry-ink focus:outline-none focus:ring-2 focus:ring-cowry-primary"
                    >
                      {departures.map((dep) => (
                        <option key={dep.route.slug} value={dep.route.slug}>
                          To {dep.headingTo}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="text-xs text-cowry-muted">
                    Route: <strong className="text-cowry-ink font-semibold">To {departures[0].headingTo}</strong>
                  </div>
                )}

                {/* Count Selection (0 to 5+) */}
                <div>
                  <span
                    id="count-selection-label"
                    className="block text-xs font-semibold text-cowry-muted uppercase tracking-wider mb-2"
                  >
                    How many buses are waiting?
                  </span>
                  <div
                    role="radiogroup"
                    aria-labelledby="count-selection-label"
                    className="grid grid-cols-6 gap-2 max-w-sm"
                  >
                    {countOptions.map((count) => {
                      const isSelected = selectedCount === count;
                      const displayLabel = count === 5 ? "5+" : `${count}`;

                      return (
                        <button
                          key={`count-${count}`}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setSelectedCount(count)}
                          className={`min-h-touch flex flex-col items-center justify-center p-2 rounded-sm text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary ${
                            isSelected
                              ? "bg-white text-cowry-ink border-2 border-cowry-primary"
                              : "bg-white text-cowry-ink border border-cowry-hairline hover:bg-slate-50"
                          }`}
                        >
                          <span>{displayLabel}</span>
                          <span
                            className={`text-[10px] leading-none text-cowry-primary ${
                              isSelected ? "opacity-100" : "opacity-0"
                            }`}
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSendReport}
                    disabled={selectedCount === null}
                    className="min-h-touch px-5 py-2.5 bg-cowry-primary text-white rounded-sm text-sm font-semibold hover:bg-cowry-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Send report
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelReport}
                    className="min-h-touch px-4 py-2.5 border border-cowry-hairline text-cowry-muted hover:text-cowry-ink rounded-sm text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
