import Link from "next/link";
import { getAllPlaces } from "@/lib/brt-local";

interface PlacePageProps {
  params: {
    slug: string;
  };
}

export default function PlacePage({ params }: PlacePageProps) {
  const allPlaces = getAllPlaces();
  const currentPlace = allPlaces.find((p) => p.slug === params.slug);

  const displayName =
    currentPlace?.name ||
    decodeURIComponent(params.slug)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Header */}
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

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl font-bold text-cowry-text mb-2">
          {displayName}
        </h1>
        <p className="text-cowry-muted text-sm">
          Placeholder page for slice 2 departures and route details.
        </p>
      </main>

      {/* Footer Strip */}
      <footer className="mt-auto p-4 bg-cowry-footer border-t border-cowry-border text-center text-xs text-cowry-muted">
        Unofficial prototype. Sample data. Times are estimates.
      </footer>
    </div>
  );
}
