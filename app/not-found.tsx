import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Header */}
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

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col justify-center items-center text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-cowry-muted mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-cowry-text mb-2">
          Page not found
        </h1>
        <p className="text-sm text-cowry-muted mb-6 max-w-xs">
          The stop, route, or page you are looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-touch px-6 py-2.5 bg-cowry-primary text-white rounded-xl text-sm font-semibold hover:bg-cowry-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-colors"
        >
          Return to Nearby
        </Link>
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

