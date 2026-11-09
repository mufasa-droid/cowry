import type { Metadata } from "next";
import Link from "next/link";
import { getRoute, getPlace } from "@/lib/brt-local";

interface RoutePageProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: RoutePageProps): Metadata {
  const route = getRoute(params.slug);
  if (!route) {
    return { title: "Route not found" };
  }
  const fromPlace = getPlace(route.from);
  const toPlace = getPlace(route.to);
  const fromName = fromPlace ? fromPlace.name : route.from;
  const toName = toPlace ? toPlace.name : route.to;
  return {
    title: `${fromName} to ${toName}`,
  };
}

export default function RoutePage({ params }: RoutePageProps) {
  const route = getRoute(params.slug);

  // Friendly unknown slug fallback
  if (!route) {
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
            Route not found
          </h1>
          <p className="text-sm text-cowry-muted mb-6 max-w-xs">
            We couldn&apos;t find the requested BRT route in our system.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-cowry-primary text-white rounded-xl text-sm font-semibold hover:bg-cowry-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-colors"
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

  const fromPlace = getPlace(route.from);
  const toPlace = getPlace(route.to);
  const fromName = fromPlace ? fromPlace.name : route.from;
  const toName = toPlace ? toPlace.name : route.to;
  const serviceLabel =
    route.service === "brt" ? "BRT route" : "Standard route";

  // Timeline stops sequence: Origin -> Intermediate 'via' stops -> Destination
  const timelineStops = [
    {
      slug: route.from,
      name: fromName,
      role: "origin" as const,
      roleText: "Board here",
      type: fromPlace?.type,
    },
    ...route.via.map((viaSlug) => {
      const p = getPlace(viaSlug);
      return {
        slug: viaSlug,
        name: p ? p.name : viaSlug.replace(/-/g, " "),
        role: "via" as const,
        roleText: "You can get down here",
        type: p?.type,
      };
    }),
    {
      slug: route.to,
      name: toName,
      role: "destination" as const,
      roleText: "Last stop",
      type: toPlace?.type,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Header */}
      <header className="px-5 pt-5 pb-4 border-b border-cowry-border">
        <div className="flex items-center justify-between mb-3">
          <Link
            href={`/place/${route.from}`}
            className="inline-flex items-center text-sm font-medium text-cowry-primary hover:underline min-h-[44px] min-w-[44px]"
            aria-label={`Back to ${fromName}`}
          >
            ← Back to {fromName}
          </Link>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-cowry-pill text-cowry-primary border border-[#BCD0ED]"
            aria-label="Demo data mode"
          >
            Demo data
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-cowry-text">
            {fromName} → {toName}
          </h1>
        </div>

        <div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
              route.service === "brt"
                ? "bg-[#1558B0] text-white"
                : "bg-slate-100 text-cowry-text"
            }`}
          >
            {serviceLabel}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-5 space-y-5">
        {/* Large Fare Banner (Primary Blue #1558B0 Block) */}
        <section
          className="bg-cowry-primary text-white rounded-2xl p-5 shadow-sm"
          aria-label="Fare Information"
        >
          <span className="text-xs font-medium text-blue-100 uppercase tracking-wider block mb-1">
            Flat Fare
          </span>
          <div className="text-4xl font-extrabold tracking-tight mb-2">
            ₦{route.fareNgn}
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            Flat fare: same price wherever you get down
          </p>
        </section>

        {/* Ride Time Card */}
        <section
          className="p-4 border border-cowry-border rounded-xl bg-white flex items-center justify-between"
          aria-label="Ride Time"
        >
          <div>
            <span className="text-xs font-medium text-cowry-muted uppercase tracking-wider block">
              Ride time
            </span>
            <span className="text-sm font-semibold text-cowry-text">
              To be confirmed
            </span>
          </div>
          <span className="text-xs text-cowry-muted italic">
            Ground verification pending
          </span>
        </section>

        {/* Verification Note (if unverified) */}
        {!route.verified && (
          <div
            className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900"
            role="note"
          >
            <svg
              className="w-4 h-4 text-amber-700 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Stop order is unverified.</span>
          </div>
        )}

        {/* Stop Timeline */}
        <section aria-label="Route Stops Timeline">
          <h2 className="text-base font-semibold text-cowry-text mb-3">
            Stops along this route
          </h2>

          <div className="bg-white border border-cowry-border rounded-xl p-4 sm:p-5">
            <div className="space-y-0">
              {timelineStops.map((stop, index) => {
                const isLast = index === timelineStops.length - 1;
                const isOrigin = stop.role === "origin";
                const isVia = stop.role === "via";
                const isDest = stop.role === "destination";

                return (
                  <div key={`${stop.slug}-${index}`} className="flex group">
                    {/* Visual Timeline Column with vertical line */}
                    <div className="flex flex-col items-center mr-3 sm:mr-4 flex-shrink-0 w-5">
                      {/* Timeline Dot Indicator */}
                      <div className="flex items-center justify-center my-1">
                        {isOrigin && (
                          <span
                            className="w-4 h-4 rounded-full bg-cowry-primary ring-4 ring-cowry-pill block"
                            aria-hidden="true"
                          />
                        )}
                        {isVia && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border-2 border-cowry-primary bg-white block"
                            aria-hidden="true"
                          />
                        )}
                        {isDest && (
                          <span
                            className="w-4 h-4 rounded-full bg-cowry-text ring-2 ring-slate-200 block"
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      {/* Vertical Connecting Line */}
                      {!isLast && (
                        <div
                          className="w-0.5 flex-1 bg-cowry-border my-0.5"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    {/* Stop Details Column */}
                    <div
                      className={`flex-1 min-w-0 ${
                        isLast ? "pb-1" : "pb-6"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/place/${stop.slug}`}
                          className="font-bold text-base text-cowry-text hover:text-cowry-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary rounded"
                        >
                          {stop.name}
                        </Link>

                        {stop.type && (
                          <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 bg-slate-100 text-cowry-muted rounded">
                            {stop.type === "terminal" ? "Terminal" : "Bus stop"}
                          </span>
                        )}
                      </div>

                      {/* Text label conveying role / meaning */}
                      <p
                        className={`text-xs mt-0.5 font-medium ${
                          isOrigin
                            ? "text-cowry-primary"
                            : isDest
                            ? "text-cowry-text"
                            : "text-cowry-muted"
                        }`}
                      >
                        {stop.roleText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Secondary Action: See buses waiting at origin */}
        <section className="pt-2">
          <Link
            href={`/place/${route.from}`}
            className="flex items-center justify-center gap-2 min-h-touch px-4 py-3 bg-white border border-cowry-border rounded-xl text-sm font-semibold text-cowry-primary hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-colors text-center"
          >
            <span>See buses waiting at {fromName} →</span>
          </Link>
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
