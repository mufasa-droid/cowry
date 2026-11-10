import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded border border-cowry-border flex items-center justify-center mb-6 text-cowry-muted">
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M18.364 5.636a9 9 0 01.263 12.016m-3.08-3.08a5 5 0 00-.707-6.364m-4.243.707a2.5 2.5 0 00-.707 3.536M6.343 6.343a9 9 0 00-.263 12.016"
          />
        </svg>
      </div>

      <h1 className="font-serif text-2xl font-normal text-cowry-ink mb-3">
        You&apos;re offline
      </h1>

      <p className="text-cowry-muted text-sm leading-relaxed mb-8">
        Pages you opened before are still available without an internet connection.
      </p>

      <Link
        href="/"
        className="inline-flex items-center justify-center h-11 px-6 bg-cowry-blue text-white text-sm font-medium rounded hover:bg-opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-cowry-blue focus:ring-offset-2"
      >
        Back to Nearby
      </Link>
    </div>
  );
}

