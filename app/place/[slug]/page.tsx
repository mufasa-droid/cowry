import Link from "next/link";
import { getPlace, getDepartures, queueLabel } from "@/lib/brt-local";

interface PlacePageProps {
  params: {
    slug: string;
  };
}

export default function PlacePage({ params }: PlacePageProps) {
  const place = getPlace(params.slug);

  // Unknown slug fallback
  if (!place) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="p-4 border-b border-cowry-border flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-cowry-primary hover:underline min-h-[44px] min-w-[44px]"
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
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-cowry-primary text-white rounded-xl text-sm font-semibold hover:bg-cowry-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary focus-visible:ring-offset-2 transition-colors"
          >
            Return to Nearby
          </Link>
        </main>

        <footer className="mt-auto px-4 py-3.5 bg-cowry-footer border-t border-cowry-border text-center text-xs text-cowry-muted">
          Unofficial prototype. Sample data. Times are estimates.
        </footer>
      </div>
    );
  }

  const departures = getDepartures(place.slug);
  const isTerminal = place.type === "terminal";
  const routeCount = departures.length;
  const isSingleRouteStop = !isTerminal && routeCount === 1;

  // Subtitle wording per business rules
  let subtitleText = "";
  if (isTerminal) {
    const routeSuffix = routeCount === 1 ? "route" : "routes";
    subtitleText = `Terminal · ${routeCount} ${routeSuffix} · buses leaving from here`;
  } else {
    const destination = departures[0]?.headingTo || "destination";
    subtitleText = `Bus stop · 1 route · buses wait here, then leave for ${destination}`;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Header */}
      <header className="px-5 pt-5 pb-4 border-b border-cowry-border">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-cowry-primary hover:underline min-h-[44px] min-w-[44px]"
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
      <main className="flex-1 px-5 py-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-cowry-text">
            {isTerminal ? "Departures Board" : "Route & Departures"}
          </h2>
          <span className="text-xs text-cowry-muted">
            {routeCount} {routeCount === 1 ? "departure" : "departures"}
          </span>
        </div>

        {departures.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-cowry-border rounded-xl">
            <p className="text-sm text-cowry-muted">
              No active departures from this location currently listed.
            </p>
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
                    <span>{queueText}</span>
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

                  <div className="text-xs text-cowry-muted mb-2.5">
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

        {/* Flat fare business rule notice */}
        <p className="text-xs text-cowry-muted mt-4 text-center">
          Fare is the same wherever you get down.
        </p>
      </main>

      {/* Footer Strip */}
      <footer className="mt-auto px-4 py-3.5 bg-cowry-footer border-t border-cowry-border text-center text-xs text-cowry-muted">
        Unofficial prototype. Sample data. Times are estimates.
      </footer>
    </div>
  );
}
