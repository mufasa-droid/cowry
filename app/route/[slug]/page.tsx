import Link from "next/link";
import { getRoute, getPlace } from "@/lib/brt-local";

interface RoutePageProps {
  params: {
    slug: string;
  };
}

export default function RoutePage({ params }: RoutePageProps) {
  const route = getRoute(params.slug);

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
          <p className="text-sm text-cowry-muted mb-6">
            The requested route could not be found.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-cowry-primary text-white rounded-xl text-sm font-semibold hover:bg-cowry-primary-hover transition-colors"
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

  const fromPlace = getPlace(route.from);
  const toPlace = getPlace(route.to);
  const fromName = fromPlace ? fromPlace.name : route.from;
  const toName = toPlace ? toPlace.name : route.to;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Header */}
      <header className="p-4 border-b border-cowry-border flex items-center justify-between">
        <Link
          href={`/place/${route.from}`}
          className="inline-flex items-center text-sm font-medium text-cowry-primary hover:underline min-h-[44px] min-w-[44px]"
        >
          ← Back to {fromName}
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 bg-cowry-pill text-cowry-primary border border-[#BCD0ED] rounded-full">
          Demo data
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl font-bold text-cowry-text mb-2">
          {fromName} to {toName}
        </h1>
        <div className="text-2xl font-bold text-cowry-primary mb-3">
          ₦{route.fareNgn}
        </div>
        <p className="text-xs text-cowry-muted max-w-xs">
          Flat fare. Placeholder page for slice 3 route detail and stops along the way.
        </p>
      </main>

      {/* Footer Strip */}
      <footer className="mt-auto px-4 py-3.5 bg-cowry-footer border-t border-cowry-border text-center text-xs text-cowry-muted">
        Unofficial prototype. Sample data. Times are estimates.
      </footer>
    </div>
  );
}

