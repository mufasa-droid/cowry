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

  if (!route) {
    return (
      <div className="w-full py-12 flex flex-col justify-center items-center text-center">
        <h1 className="font-serif text-2xl font-bold text-cowry-ink mb-2">
          Route not found
        </h1>
        <p className="text-sm text-cowry-muted mb-6 max-w-xs">
          We couldn&apos;t find the requested BRT route in our system.
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

  const fromPlace = getPlace(route.from);
  const toPlace = getPlace(route.to);
  const fromName = fromPlace ? fromPlace.name : route.from;
  const toName = toPlace ? toPlace.name : route.to;
  const serviceLabel =
    route.service === "brt" ? "BRT route" : "Standard route";

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
    <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-10">
      {/* Left Column: Route Summary & Fare Information */}
      <div className="w-full lg:w-[380px] lg:flex-shrink-0 space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href={`/place/${route.from}`}
            className="inline-flex items-center text-sm font-medium text-cowry-primary hover:underline min-h-touch min-w-touch"
            aria-label={`Back to ${fromName}`}
          >
            ← Back to {fromName}
          </Link>
        </div>

        {/* Title & Service Badge */}
        <div className="border-b border-cowry-hairline pb-4">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-cowry-ink">
              {fromName} → {toName}
            </h1>
          </div>
          <div className="mt-2">
            <span className="text-xs text-cowry-muted border border-cowry-hairline px-2 py-0.5 rounded-sm">
              {serviceLabel}
            </span>
          </div>
        </div>

        {/* Flat Fare Block */}
        <section
          className="p-5 border border-cowry-hairline rounded-sm bg-white"
          aria-label="Fare Information"
        >
          <span className="text-[11px] font-semibold text-cowry-muted uppercase tracking-wider block mb-1">
            Flat Fare
          </span>
          <div className="text-4xl font-bold tracking-tight text-cowry-primary tabular-nums mb-2">
            ₦{route.fareNgn}
          </div>
          <p className="text-xs text-cowry-muted leading-relaxed">
            Flat fare: same price wherever you get down
          </p>
        </section>

        {/* Ride Time Card */}
        <section
          className="p-4 border border-cowry-hairline rounded-sm bg-white flex items-center justify-between"
          aria-label="Ride Time"
        >
          <div>
            <span className="text-[11px] font-semibold text-cowry-muted uppercase tracking-wider block">
              Ride time
            </span>
            <span className="text-sm font-semibold text-cowry-ink">
              To be confirmed
            </span>
          </div>
          <span className="text-xs text-cowry-muted italic">
            Ground audit pending
          </span>
        </section>

        {/* Verification Note (if unverified) */}
        {!route.verified && (
          <div
            className="p-3 bg-white border border-cowry-hairline rounded-sm flex items-center gap-2 text-xs text-cowry-muted"
            role="note"
          >
            <span className="text-cowry-primary font-bold">ℹ</span>
            <span>Stop order is unverified.</span>
          </div>
        )}

        {/* Secondary Action: See buses waiting at origin */}
        <div>
          <Link
            href={`/place/${route.from}`}
            className="flex items-center justify-center gap-2 min-h-touch px-4 py-2.5 bg-white border border-cowry-hairline rounded-sm text-sm font-semibold text-cowry-primary hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-colors text-center"
          >
            <span>See buses waiting at {fromName} →</span>
          </Link>
        </div>
      </div>

      {/* Right Column: Stop Progression Timeline */}
      <div className="flex-1 lg:border-l lg:border-cowry-hairline lg:pl-10 space-y-4">
        <h2 className="font-serif text-lg font-bold text-cowry-ink">
          Stops along this route
        </h2>

        <div className="border border-cowry-hairline rounded-sm p-5 bg-white">
          <div className="space-y-0" role="list">
            {timelineStops.map((stop, index) => {
              const isLast = index === timelineStops.length - 1;
              const isOrigin = stop.role === "origin";
              const isVia = stop.role === "via";
              const isDest = stop.role === "destination";

              return (
                <div key={`${stop.slug}-${index}`} className="flex group" role="listitem">
                  {/* Timeline Indicator Column */}
                  <div className="flex flex-col items-center mr-4 flex-shrink-0 w-4">
                    <div className="flex items-center justify-center my-1">
                      {isOrigin && (
                        <span
                          className="w-3.5 h-3.5 rounded-sm bg-cowry-primary block"
                          aria-hidden="true"
                        />
                      )}
                      {isVia && (
                        <span
                          className="w-3 h-3 rounded-sm border-2 border-cowry-hairline bg-white block"
                          aria-hidden="true"
                        />
                      )}
                      {isDest && (
                        <span
                          className="w-3.5 h-3.5 rounded-sm bg-cowry-ink block"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className="w-[1px] flex-1 bg-cowry-hairline my-0.5"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Stop Information */}
                  <div className={`flex-1 min-w-0 ${isLast ? "pb-1" : "pb-6"}`}>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <Link
                        href={`/place/${stop.slug}`}
                        className="font-semibold text-sm text-cowry-ink hover:text-cowry-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary rounded-sm"
                      >
                        {stop.name}
                      </Link>
                      {stop.type && (
                        <span className="text-[10px] text-cowry-muted border border-cowry-hairline px-1.5 py-0.5 rounded-sm">
                          {stop.type === "terminal" ? "Terminal" : "Stop"}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-0.5 ${
                        isOrigin
                          ? "text-cowry-primary font-medium"
                          : isDest
                          ? "text-cowry-ink font-medium"
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
      </div>
    </div>
  );
}
