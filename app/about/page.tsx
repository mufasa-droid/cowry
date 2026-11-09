import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About this demo",
  description: "Transparency on real, unverified, and sample data in this prototype",
};

export default function AboutPage() {
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
          About this demo
        </h1>
        <p className="text-xs text-cowry-muted mt-1 leading-relaxed">
          Honest disclosure on what is real, what is unverified, and what is sample data in this prototype.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 space-y-6">
        {/* Section 1: Real */}
        <section className="p-5 bg-emerald-50/50 border border-emerald-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0" aria-hidden="true" />
            <h2 className="text-base font-bold text-emerald-950">
              Real
            </h2>
          </div>
          <p className="text-sm text-emerald-900 leading-relaxed">
            Fares come from the official LAMATA fare list effective <strong>2 March 2026</strong>. These reflect the regulated flat fare pricing for Lagos BRT and standard bus services.
          </p>
        </section>

        {/* Section 2: Unverified */}
        <section className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 flex-shrink-0" aria-hidden="true" />
            <h2 className="text-base font-bold text-amber-950">
              Unverified
            </h2>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed">
            Stop order along routes, reverse-direction fare symmetry, and Obalende&apos;s full terminal infrastructure status are based on initial observations and have not yet been fully audited on the ground.
          </p>
        </section>

        {/* Section 3: Sample */}
        <section className="p-5 bg-slate-50 border border-cowry-border rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cowry-primary flex-shrink-0" aria-hidden="true" />
            <h2 className="text-base font-bold text-cowry-text">
              Sample
            </h2>
          </div>
          <p className="text-sm text-cowry-muted leading-relaxed">
            &ldquo;Buses waiting&rdquo; counts and headway wait estimates are simulated demo numbers created for this prototype, not live telematics. Reports submitted via the report tool are stored locally in browser memory for demonstration purposes.
          </p>
        </section>
      </main>

      {/* Footer Strip */}
      <footer className="mt-auto px-4 py-3.5 bg-cowry-footer border-t border-cowry-border text-center text-xs text-cowry-muted">
        Unofficial prototype. Sample data. Times are estimates. ·{" "}
        <span className="font-medium text-cowry-text">About this demo</span>
      </footer>
    </div>
  );
}

