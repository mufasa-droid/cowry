"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getPlace,
  getDepartures,
  queueLabel,
  reportQueue,
  type Place,
} from "@/lib/brt-local";

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
      <div className="flex flex-col min-h-screen bg-white">
        <header className="p-4 border-b border-cowry-border flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-cowry-primary hover:underline min-h-touch min-w-touch"
          >
            ← Back to Nearby
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 bg-cowry-pill text-cowry-primary border border-[#BCD0ED] rounded-full">
            Demo data
          </span>
        </header>

        <main className="flex-1 p-6 flex flex-col justify-center items-center text-center">
          <h1 className="text-2xl font-bold text-cowry-text mb-2">
            Place not found
          </h1>
          <p className="text-sm text-cowry-muted mb-6 max-w-xs">
            We couldn&apos;t find the requested stop or terminal in our system.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-touch px-6 py-2.5 bg-cowry-primary text-white rounded-xl text-sm font-semibold hover:bg-cowry-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-colors"
          >
            Return to Nearby
          </Link>
        </main>

        <footer className="mt-auto px-4 py-3.5 bg-cowry-footer border-t border-cowry-border text-center text-xs text-cowry-muted">
          Unofficial prototype. Sample data. Times are estimates. ·{" "}
          <Link href="/about" className="underline hover:text-cowry-primary">
            About this demo
          </Link>
        </footer>
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
    // If only one route, preselect it
    if (departures.length === 1) {
      setSelectedRoute(departures[0].route.slug);
    } else if (!selectedRoute && departures.length > 0) {
      setSelectedRoute(departures[0].route.slug);
    }
  };

  const handleSendReport = () => {
    if (selectedCount === null || !selectedRoute) return;

    // Map 5+ to 5 (count is capped at 5 in number model)
    const countValue = Math.min(selectedCount, 5);
    reportQueue(selectedRoute, countValue);

    // Refresh departures state immediately
    const updated = getDepartures(place.slug);
    setDepartures(updated);

    // Close panel and show polite confirmation
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Header */}
      <header className="px-5 pt-5 pb-4 border-b border-cowry-border">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-cowry-primary hover:underline min-h-touch min-w-touch"
            aria-label="Back to Nearby stops"
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
          {place.name}
        </h1>
        <p className="text-sm text-cowry-muted mt-1 leading-snug">
          {subtitleText}
        </p>
      </header>

      {/* Departures Content */}
      <main className="flex-1 px-5 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-cowry-text">
            {isTerminal ? "Departures Board" : "Route & Departures"}
          </h2>
          <span className="text-xs text-cowry-muted">
            {routeCount} {routeCount === 1 ? "departure" : "departures"}
          </span>
        </div>

        {/* Polite Screen Reader Live Announcement */}
        <div
          role="status"
          aria-live="polite"
          className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 transition-all empty:hidden"
        >
          {confirmationMsg}
        </div>

        {departures.length === 0 ? (
          <div className="py-10 px-6 text-center border border-dashed border-cowry-border rounded-xl">
            <p className="text-sm font-medium text-cowry-text mb-4">
              No routes leave from here in this demo
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-touch px-5 py-2.5 bg-cowry-primary text-white rounded-xl text-sm font-semibold hover:bg-cowry-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-colors"
            >
              Back to Nearby
            </Link>
          </div>
        ) : isSingleRouteStop ? (
          /* Single Route Stop: A single featured card, not a board */
          <div className="space-y-3">
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
                  className="block p-5 bg-white border border-cowry-border rounded-xl hover:border-cowry-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-all active:scale-[0.99] min-h-[44px]"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-medium text-cowry-muted uppercase tracking-wider block mb-0.5">
                        Destination
                      </span>
                      <h3 className="font-bold text-lg text-cowry-text">
                        To {dep.headingTo}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-cowry-muted block mb-0.5">
                        Flat fare
                      </span>
                      <span className="text-xl font-bold text-cowry-primary">
                        ₦{dep.route.fareNgn}
                      </span>
                    </div>
                  </div>

                  {/* Queue Status Line */}
                  <div className="text-sm text-cowry-muted mb-3 flex items-center gap-1.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        dep.busesWaiting !== null && dep.busesWaiting > 0
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="font-medium text-cowry-text">
                      {queueText}
                    </span>
                  </div>

                  {/* Wait Estimate Pill & Chevron */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cowry-pill text-[#0B3A7A]">
                      Est. wait {minWait} to {maxWait} min (estimate)
                    </span>
                    <span className="text-xs font-medium text-cowry-primary flex items-center gap-1">
                      Route details →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Terminal: Compact departure board list with dividers */
          <div className="border border-cowry-border rounded-xl bg-white overflow-hidden divide-y divide-cowry-border shadow-sm">
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
                  className="block p-4 min-h-[44px] hover:bg-slate-50 focus-visible:outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cowry-primary transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span className="font-bold text-base text-cowry-text">
                      To {dep.headingTo}
                    </span>
                    <span className="font-bold text-base text-cowry-primary flex-shrink-0">
                      ₦{dep.route.fareNgn}
                    </span>
                  </div>

                  <div className="text-xs text-cowry-muted mb-2.5 font-medium">
                    {queueText}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cowry-pill text-[#0B3A7A]">
                      Est. wait {minWait} to {maxWait} min (estimate)
                    </span>
                    <span className="text-cowry-muted text-xs flex items-center">
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Flat fare notice */}
        <p className="text-xs text-cowry-muted text-center">
          Fare is the same wherever you get down.
        </p>

        {/* PART A: Report buses waiting Section */}
        {departures.length > 0 && (
          <section className="pt-2">
            {!isReporting ? (
              <div className="space-y-2">
                <button
                  type="button"
                  ref={reportButtonRef}
                  onClick={openReportPanel}
                  className="w-full min-h-touch px-4 py-3 bg-cowry-primary text-white rounded-xl text-sm font-semibold hover:bg-cowry-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary focus-visible:ring-offset-2 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span>I&apos;m here: report buses waiting</span>
                </button>
                <p className="text-[11px] text-cowry-muted text-center">
                  Demo: reports stay on this device and reset when you refresh the page.
                </p>
              </div>
            ) : (
              /* Inline Report Panel (NOT a modal) */
              <div
                ref={panelRef}
                className="p-5 bg-slate-50 border-2 border-cowry-primary rounded-2xl space-y-4 shadow-sm"
                role="region"
                aria-label="Report buses waiting"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-cowry-text">
                    Report buses waiting
                  </h3>
                  <button
                    type="button"
                    onClick={handleCancelReport}
                    className="text-xs font-medium text-cowry-muted hover:text-cowry-text p-1 min-h-[32px]"
                    aria-label="Close report panel"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Which bus selector (if multiple routes; preselected if 1 route) */}
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
                      className="w-full min-h-touch px-3 py-2.5 bg-white border border-cowry-border rounded-xl text-sm font-medium text-cowry-text focus:outline-none focus:ring-2 focus:ring-cowry-primary"
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
                    Route:{" "}
                    <strong className="text-cowry-text font-semibold">
                      To {departures[0].headingTo}
                    </strong>
                  </div>
                )}

                {/* How many buses are waiting? Row of buttons 0, 1, 2, 3, 4, 5+ */}
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
                    className="grid grid-cols-6 gap-1.5"
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
                          className={`min-h-touch flex flex-col items-center justify-center p-2 rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary ${
                            isSelected
                              ? "bg-cowry-pill text-cowry-primary border-2 border-cowry-primary shadow-sm"
                              : "bg-white text-cowry-text border border-cowry-border hover:bg-slate-100"
                          }`}
                        >
                          <span>{displayLabel}</span>
                          {/* Selection indicator with border AND checkmark (not color alone) */}
                          <span
                            className={`text-[10px] mt-0.5 leading-none ${
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

                {/* Action Buttons: Send report and Cancel */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSendReport}
                    disabled={selectedCount === null}
                    className="flex-1 min-h-touch px-4 py-2.5 bg-cowry-primary text-white rounded-xl text-sm font-semibold hover:bg-cowry-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send report
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelReport}
                    className="min-h-touch px-4 py-2.5 bg-white border border-cowry-border text-cowry-muted hover:text-cowry-text rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
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
